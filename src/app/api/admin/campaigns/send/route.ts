import { z } from "zod";
import { renderCampaign } from "@/emails/campaign";
import { fail, guardAdmin, siteUrlFor } from "@/lib/admin/guard";
import { campaignSchema, SEND_BATCH_SIZE } from "@/lib/campaign-schema";
import { sendCampaignMail } from "@/lib/mailer";
import { oneClickUrl, unsubscribeUrl } from "@/lib/unsubscribe";

// A batch of 20 at Gmail's pace takes well under a minute; this is headroom.
export const maxDuration = 120;

const sendSchema = z.object({
  campaign: campaignSchema,
  recipients: z.array(z.email()).min(1).max(SEND_BATCH_SIZE),
  /** Test sends get a [Test] subject so they're easy to tell apart. */
  test: z.boolean().optional(),
});

/**
 * Sends one batch. The admin page walks the list in batches and shows progress, so no single request
 * runs long and a failure part-way only affects the batch it happened in.
 */
export async function POST(request: Request) {
  const denied = await guardAdmin(request);
  if (denied) return denied;

  const parsed = sendSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return fail(new Error(parsed.error.issues[0]?.message ?? "Invalid campaign"), 400);

  const { campaign, recipients, test } = parsed.data;
  const siteUrl = siteUrlFor(request);
  const sent: string[] = [];
  const failed: { email: string; error: string }[] = [];

  try {
    for (const raw of recipients) {
      const email = raw.toLowerCase();
      try {
        const link = await unsubscribeUrl(siteUrl, email);
        const { html, text, attachments } = renderCampaign(campaign, { siteUrl, unsubscribeUrl: link, assets: "cid" });
        await sendCampaignMail({
          to: email,
          subject: test ? `[Test] ${campaign.subject}` : campaign.subject,
          html,
          text,
          attachments,
          list: { unsubscribe: { url: await oneClickUrl(siteUrl, email), comment: "Unsubscribe" } },
          headers: { "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
        });
        sent.push(email);
      } catch (error) {
        failed.push({ email, error: (error as Error).message });
        // Gmail's daily cap: stop this batch instead of failing every remaining address.
        if (/limit|quota|550 5\.4\.5|421/i.test((error as Error).message)) {
          return Response.json({ ok: true, sent, failed, stopped: "Gmail's sending limit was reached. Try the rest tomorrow." });
        }
      }
    }
    return Response.json({ ok: true, sent, failed });
  } catch (error) {
    return fail(error);
  }
}
