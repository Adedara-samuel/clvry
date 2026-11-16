import { fail, guardAdmin } from "@/lib/admin/guard";
import { readMailbox } from "@/lib/admin/gmail";

// A cold read of a few hundred sign-up emails over IMAP can take 20–30s.
export const maxDuration = 60;

/** Subscribers and campaign history, read from Gmail. `?fresh=1` skips the one-minute cache. */
export async function GET(request: Request) {
  const denied = await guardAdmin(request);
  if (denied) return denied;
  try {
    const fresh = new URL(request.url).searchParams.get("fresh") === "1";
    return Response.json({ ok: true, ...(await readMailbox({ fresh })) });
  } catch (error) {
    const message = (error as Error).message ?? "";
    if (/auth|credentials|login/i.test(message)) {
      return fail(
        new Error(
          "Gmail refused the login over IMAP. Check SMTP_USER / SMTP_PASS (an app password) and that IMAP is on in Gmail settings.",
        ),
      );
    }
    return fail(error);
  }
}
