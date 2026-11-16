import "server-only";
import { ImapFlow, type FetchMessageObject, type MessageStructureObject } from "imapflow";
import { CAMPAIGN_STATS_HEADER, CAMPAIGN_SUBJECT, SIGNUP_SUBJECT, UNSUBSCRIBE_SUBJECT } from "@/emails/subjects";
import { getMailEnv } from "@/lib/mailer";

/*
 * The subscriber list has no database: every sign-up, unsubscribe and campaign already leaves an email
 * in the sender's Gmail, so the admin reads them back over IMAP (same account and app password as
 * SMTP). "All Mail" holds both the sent copies and anything received, so it works whether
 * CONTACT_TO_EMAIL is the sender account or another inbox.
 */

export type Subscriber = {
  email: string;
  phone?: string;
  /** First time they signed up. */
  joinedAt: string;
  /** Latest sign-up (they may have signed up more than once). */
  lastSignupAt: string;
  source?: string;
  status: "active" | "unsubscribed";
  unsubscribedAt?: string;
};

export type CampaignRecord = {
  subject: string;
  sentAt: string;
  recipients: number | null;
  sent: number | null;
  failed: number | null;
  messageId?: string;
};

export type MailboxSnapshot = { subscribers: Subscriber[]; campaigns: CampaignRecord[]; fetchedAt: string };

async function withAllMail<T>(work: (client: ImapFlow) => Promise<T>): Promise<T> {
  const env = getMailEnv();
  const client = new ImapFlow({
    host: process.env.IMAP_HOST || (env.SMTP_HOST.includes("gmail") ? "imap.gmail.com" : env.SMTP_HOST.replace(/^smtp\./, "imap.")),
    port: Number(process.env.IMAP_PORT || 993),
    secure: true,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    logger: false,
  });
  await client.connect();
  try {
    const boxes = await client.list();
    // Localised Gmail names differ ("[Gmail]/Tous les messages"…), so find it by its special-use flag.
    const all = boxes.find((b) => b.specialUse === "\\All")?.path ?? "INBOX";
    const lock = await client.getMailboxLock(all, { readOnly: true });
    try {
      return await work(client);
    } finally {
      lock.release();
    }
  } finally {
    await client.logout().catch(() => {});
  }
}

async function uidsWithSubject(client: ImapFlow, words: string) {
  const found = await client.search({ subject: words }, { uid: true });
  return Array.isArray(found) ? found : [];
}

function envelopeOf(msg: FetchMessageObject) {
  return { subject: msg.envelope?.subject ?? "", date: msg.envelope?.date ?? msg.internalDate };
}

function iso(date: Date | string | undefined) {
  const d = date ? new Date(date) : new Date(0);
  return Number.isNaN(d.getTime()) ? new Date(0).toISOString() : d.toISOString();
}

/** The text/plain part of a message (the sign-up emails carry the phone number in it). */
function textPart(node: MessageStructureObject | undefined): MessageStructureObject | null {
  if (!node) return null;
  if (node.type === "text/plain" && node.disposition !== "attachment") return { ...node, part: node.part ?? "1" };
  for (const child of node.childNodes ?? []) {
    const hit = textPart(child);
    if (hit) return hit;
  }
  return null;
}

function decode(raw: Buffer, encoding = "7bit") {
  const enc = encoding.toLowerCase();
  if (enc === "base64") return Buffer.from(raw.toString("ascii").replace(/\s+/g, ""), "base64").toString("utf8");
  if (enc === "quoted-printable") {
    const bytes = raw
      .toString("binary")
      .replace(/=\r?\n/g, "")
      .replace(/=([0-9A-F]{2})/gi, (_, hex: string) => String.fromCharCode(parseInt(hex, 16)));
    return Buffer.from(bytes, "binary").toString("utf8");
  }
  return raw.toString("utf8");
}

async function readSignups(client: ImapFlow) {
  const uids = await uidsWithSubject(client, "New newsletter sign-up");
  if (!uids.length) return [];
  const messages = await client.fetchAll(uids, { uid: true, envelope: true, internalDate: true, bodyStructure: true }, { uid: true });
  const signups = messages
    .map((msg) => ({ msg, ...envelopeOf(msg) }))
    .filter((m) => m.subject.startsWith(SIGNUP_SUBJECT));

  // Fetch just the text parts, grouped by part number (normally all the same, so one round trip).
  const byPart = new Map<string, { uid: number; encoding?: string }[]>();
  for (const { msg } of signups) {
    const part = textPart(msg.bodyStructure);
    if (!part?.part) continue;
    byPart.set(part.part, [...(byPart.get(part.part) ?? []), { uid: msg.uid, encoding: part.encoding }]);
  }
  const bodies = new Map<number, string>();
  for (const [part, list] of byPart) {
    const encodings = new Map(list.map((l) => [l.uid, l.encoding]));
    const fetched = await client.fetchAll(
      list.map((l) => l.uid),
      { uid: true, bodyParts: [part] },
      { uid: true },
    );
    for (const msg of fetched) {
      const raw = msg.bodyParts?.values().next().value;
      if (raw) bodies.set(msg.uid, decode(raw, encodings.get(msg.uid)));
    }
  }

  return signups.map(({ msg, subject, date }) => {
    const text = bodies.get(msg.uid) ?? "";
    return {
      email: subject.slice(SIGNUP_SUBJECT.length).trim().toLowerCase(),
      at: iso(date),
      phone: text.match(/^Phone:\s*(.+)$/m)?.[1]?.trim(),
      source: text.match(/^Source:\s*(.+)$/m)?.[1]?.trim(),
    };
  });
}

async function readUnsubscribes(client: ImapFlow) {
  const uids = await uidsWithSubject(client, "Unsubscribed");
  if (!uids.length) return [];
  const messages = await client.fetchAll(uids, { uid: true, envelope: true, internalDate: true }, { uid: true });
  return messages
    .map(envelopeOf)
    .filter((m) => m.subject.startsWith(UNSUBSCRIBE_SUBJECT))
    .map((m) => ({ email: m.subject.slice(UNSUBSCRIBE_SUBJECT.length).trim().toLowerCase(), at: iso(m.date) }));
}

async function readCampaigns(client: ImapFlow): Promise<CampaignRecord[]> {
  const uids = await uidsWithSubject(client, "Campaign sent");
  if (!uids.length) return [];
  const messages = await client.fetchAll(
    uids,
    { uid: true, envelope: true, internalDate: true, headers: [CAMPAIGN_STATS_HEADER] },
    { uid: true },
  );
  return messages
    .map((msg) => ({ msg, ...envelopeOf(msg) }))
    .filter((m) => m.subject.startsWith(CAMPAIGN_SUBJECT))
    .map(({ msg, subject, date }) => {
      let stats: Partial<Record<"recipients" | "sent" | "failed", number>> = {};
      const header = msg.headers?.toString("utf8").match(new RegExp(`^${CAMPAIGN_STATS_HEADER}:\\s*(.+)$`, "im"))?.[1];
      try {
        if (header) stats = JSON.parse(header);
      } catch {}
      return {
        subject: subject.slice(CAMPAIGN_SUBJECT.length),
        sentAt: iso(date),
        recipients: stats.recipients ?? null,
        sent: stats.sent ?? null,
        failed: stats.failed ?? null,
        messageId: msg.envelope?.messageId,
      };
    })
    .sort((a, b) => b.sentAt.localeCompare(a.sentAt));
}

function buildSubscribers(
  signups: Awaited<ReturnType<typeof readSignups>>,
  unsubscribes: Awaited<ReturnType<typeof readUnsubscribes>>,
) {
  const people = new Map<string, Subscriber>();
  for (const s of [...signups].sort((a, b) => a.at.localeCompare(b.at))) {
    const known = people.get(s.email);
    people.set(s.email, {
      email: s.email,
      phone: s.phone ?? known?.phone,
      joinedAt: known?.joinedAt ?? s.at,
      lastSignupAt: s.at,
      source: known?.source ?? s.source,
      status: "active",
    });
  }
  const lastUnsub = new Map<string, string>();
  for (const u of unsubscribes) {
    if ((lastUnsub.get(u.email) ?? "") < u.at) lastUnsub.set(u.email, u.at);
  }
  for (const [email, at] of lastUnsub) {
    const person = people.get(email);
    // Signing up again after leaving puts them back on the list.
    if (person && at >= person.lastSignupAt) {
      person.status = "unsubscribed";
      person.unsubscribedAt = at;
    }
  }
  return [...people.values()].sort((a, b) => b.joinedAt.localeCompare(a.joinedAt));
}

// Reading the mailbox takes a few seconds, so keep the result briefly. Each server instance has its
// own copy; any change made through the admin clears it.
const TTL_MS = 60 * 1000;
let snapshot: { at: number; data: Promise<MailboxSnapshot> } | null = null;

export function readMailbox({ fresh = false } = {}): Promise<MailboxSnapshot> {
  if (!fresh && snapshot && Date.now() - snapshot.at < TTL_MS) return snapshot.data;
  const data = withAllMail(async (client) => {
    const signups = await readSignups(client);
    const unsubscribes = await readUnsubscribes(client);
    const campaigns = await readCampaigns(client);
    return { subscribers: buildSubscribers(signups, unsubscribes), campaigns, fetchedAt: new Date().toISOString() };
  });
  snapshot = { at: Date.now(), data };
  data.catch(() => {
    if (snapshot?.data === data) snapshot = null;
  });
  return data;
}

export function forgetMailbox() {
  snapshot = null;
}
