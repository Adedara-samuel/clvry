import { renderCampaign } from "@/emails/campaign";
import { fail, guardAdmin, siteUrlFor } from "@/lib/admin/guard";
import { campaignSchema } from "@/lib/campaign-schema";

/** Renders the email for the live preview. Lenient per field, so half-written drafts still preview. */
export async function POST(request: Request) {
  const denied = await guardAdmin(request);
  if (denied) return denied;
  try {
    const raw = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const field = <K extends keyof typeof campaignSchema.shape>(key: K) => {
      const result = campaignSchema.shape[key].safeParse(raw[key]);
      return result.success ? result.data : "";
    };
    const siteUrl = siteUrlFor(request);
    const { html } = renderCampaign(
      {
        subject: field("subject") || "Subject",
        preheader: field("preheader"),
        heading: field("heading") || "Your heading",
        body: field("body") || "Write your message and it shows up here.",
        imageUrl: field("imageUrl"),
        ctaLabel: field("ctaLabel"),
        ctaUrl: field("ctaUrl"),
      },
      { siteUrl, unsubscribeUrl: `${siteUrl}/unsubscribe`, assets: "data" },
    );
    return Response.json({ ok: true, html });
  } catch (error) {
    return fail(error);
  }
}
