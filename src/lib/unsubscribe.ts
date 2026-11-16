import "server-only";
import { sign, verify } from "./admin/session";

/*
 * Every campaign email carries a personal unsubscribe link: the address plus a signature, so nobody
 * can unsubscribe someone else by editing the URL. Signed with ADMIN_SESSION_SECRET (under its own
 * purpose), so changing that secret invalidates links in emails already sent.
 */

function encodeEmail(email: string) {
  return Buffer.from(email.toLowerCase(), "utf8").toString("base64url");
}

export async function unsubscribeUrl(siteUrl: string, email: string) {
  const e = encodeEmail(email);
  const t = await sign("unsubscribe", e);
  return `${siteUrl.replace(/\/$/, "")}/unsubscribe?e=${e}&t=${t}`;
}

/** Same link, pointing at the API, for the one-click List-Unsubscribe header. */
export async function oneClickUrl(siteUrl: string, email: string) {
  const e = encodeEmail(email);
  const t = await sign("unsubscribe", e);
  return `${siteUrl.replace(/\/$/, "")}/api/unsubscribe?e=${e}&t=${t}`;
}

/** Returns the email address for a valid link, or null. */
export async function readUnsubscribeLink(e: string | null, t: string | null) {
  if (!e || !t || e.length > 400 || !(await verify("unsubscribe", e, t))) return null;
  const email = Buffer.from(e, "base64url").toString("utf8");
  return email.includes("@") ? email : null;
}
