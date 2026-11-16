import { z } from "zod";
import { campaignLogEmail } from "@/emails/campaign";
import { fail, guardAdmin, siteUrlFor } from "@/lib/admin/guard";
import { forgetMailbox } from "@/lib/admin/gmail";
import { campaignSchema } from "@/lib/campaign-schema";
import { sendNotification } from "@/lib/mailer";

const logSchema = z.object({
  campaign: campaignSchema,
  stats: z.object({
    recipients: z.number().int().nonnegative(),
    sent: z.number().int().nonnegative(),
    failed: z.number().int().nonnegative(),
    failedEmails: z.array(z.string()).max(500),
  }),
});

/** Records a finished send in the team inbox; the campaign history is read back from these. */
export async function POST(request: Request) {
  const denied = await guardAdmin(request);
  if (denied) return denied;

  const parsed = logSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return fail(new Error("Invalid campaign log"), 400);

  try {
    await sendNotification(campaignLogEmail(parsed.data.campaign, parsed.data.stats, siteUrlFor(request)));
    forgetMailbox();
    return Response.json({ ok: true });
  } catch (error) {
    return fail(error);
  }
}
