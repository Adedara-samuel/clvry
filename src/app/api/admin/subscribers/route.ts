import { z } from "zod";
import { unsubscribedEmail } from "@/emails/campaign";
import { newSubscriberEmail } from "@/emails/new-subscriber";
import { fail, guardAdmin } from "@/lib/admin/guard";
import { forgetMailbox } from "@/lib/admin/gmail";
import { sendNotification } from "@/lib/mailer";
import { subscribeSchema } from "@/lib/schemas";

/*
 * The list lives in Gmail, so adding or removing someone means sending the same notification the site
 * would: a sign-up email, or an "Unsubscribed" email. The list is rebuilt from those.
 */

/** Add someone by hand (e.g. from an event sign-up sheet). */
export async function POST(request: Request) {
  const denied = await guardAdmin(request);
  if (denied) return denied;

  const parsed = subscribeSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return fail(new Error(parsed.error.issues[0]?.message ?? "Invalid email"), 400);

  try {
    await sendNotification(
      newSubscriberEmail({
        email: parsed.data.email.toLowerCase(),
        phone: parsed.data.phone,
        submittedAt: new Date(),
        source: "Added by admin",
      }),
    );
    forgetMailbox();
    return Response.json({ ok: true });
  } catch (error) {
    return fail(error);
  }
}

/** Take someone off the list. Their history stays in Gmail; they can sign up again later. */
export async function DELETE(request: Request) {
  const denied = await guardAdmin(request);
  if (denied) return denied;

  const parsed = z.object({ email: z.email() }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return fail(new Error("Invalid email"), 400);

  try {
    await sendNotification(unsubscribedEmail(parsed.data.email.toLowerCase(), "Removed by admin"));
    forgetMailbox();
    return Response.json({ ok: true });
  } catch (error) {
    return fail(error);
  }
}
