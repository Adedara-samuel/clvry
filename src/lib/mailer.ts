import nodemailer, { type SendMailOptions, type Transporter } from "nodemailer";
import { z } from "zod";

// Validated lazily (on first send) so builds don't need SMTP credentials.
const mailEnvSchema = z.object({
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().int().positive(),
  SMTP_USER: z.email(),
  SMTP_PASS: z.string().min(1),
  CONTACT_TO_EMAIL: z.email(),
});

export type MailEnv = z.infer<typeof mailEnvSchema>;

let cachedEnv: MailEnv | null = null;
let notifier: Transporter | null = null;
let bulk: Transporter | null = null;

export function getMailEnv() {
  if (cachedEnv) return cachedEnv;
  const parsed = mailEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const missing = parsed.error.issues.map((i) => i.path.join(".")).join(", ");
    throw new Error(`Mail is not configured. Check .env.local for: ${missing}`);
  }
  cachedEnv = parsed.data;
  return cachedEnv;
}

function transportOptions(env: MailEnv) {
  return {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465, // 465 = implicit TLS; 587 upgrades via STARTTLS
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  };
}

function getNotifier() {
  notifier ??= nodemailer.createTransport(transportOptions(getMailEnv()));
  return notifier;
}

/**
 * Campaign sends reuse a couple of pooled connections and pace themselves (Gmail throttles bursts and
 * caps a regular account at about 500 recipients a day; Workspace at 2,000).
 */
function getBulkTransport() {
  bulk ??= nodemailer.createTransport({
    ...transportOptions(getMailEnv()),
    pool: true,
    maxConnections: 2,
    maxMessages: 100,
    rateDelta: 1000,
    rateLimit: 4,
  });
  return bulk;
}

type Notification = {
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachments?: { filename: string; content: string; encoding: "base64"; cid: string }[];
  headers?: Record<string, string>;
};

/** Sends a message from the site's sender account to CONTACT_TO_EMAIL. */
export async function sendNotification({ subject, html, text, replyTo, attachments, headers }: Notification) {
  const env = getMailEnv();
  await getNotifier().sendMail({
    from: { name: "CLVRY Website", address: env.SMTP_USER },
    to: env.CONTACT_TO_EMAIL,
    replyTo,
    subject,
    html,
    text,
    attachments,
    headers,
  });
}

/** Sends one campaign email to one subscriber, from "CLVRY" at the sender account. */
export async function sendCampaignMail(message: Omit<SendMailOptions, "from">) {
  const env = getMailEnv();
  await getBulkTransport().sendMail({ ...message, from: { name: "CLVRY", address: env.SMTP_USER } });
}
