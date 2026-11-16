import { unsubscribedEmail } from "@/emails/campaign";
import { clientIp, throttle } from "@/lib/admin/guard";
import { forgetMailbox } from "@/lib/admin/gmail";
import { sendNotification } from "@/lib/mailer";
import { readUnsubscribeLink } from "@/lib/unsubscribe";

const hits = new Map<string, number[]>();

/**
 * Leaves the list. Called by the /unsubscribe page ({ e, t } as JSON) and by mail apps' one-click
 * unsubscribe (RFC 8058: a POST to the List-Unsubscribe URL, with e and t in the query string).
 */
export async function POST(request: Request) {
  if (throttle(hits, clientIp(request), 20, 10 * 60 * 1000)) {
    return Response.json({ ok: false, error: "Too many attempts. Please try again later." }, { status: 429 });
  }

  const query = new URL(request.url).searchParams;
  let e = query.get("e");
  let t = query.get("t");
  if (!e || !t) {
    const body = (await request.json().catch(() => null)) as { e?: unknown; t?: unknown } | null;
    e = typeof body?.e === "string" ? body.e : null;
    t = typeof body?.t === "string" ? body.t : null;
  }

  const email = await readUnsubscribeLink(e, t);
  if (!email) {
    return Response.json({ ok: false, error: "This unsubscribe link isn't valid. Reply to any of our emails and we'll take you off." }, { status: 400 });
  }

  try {
    await sendNotification(unsubscribedEmail(email, "Unsubscribe link in a campaign email"));
    forgetMailbox();
    return Response.json({ ok: true, email });
  } catch (error) {
    console.error("[unsubscribe] failed:", error);
    return Response.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
