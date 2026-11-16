import type { Campaign } from "@/lib/campaign-schema";
import { emailMark, emailWordmark } from "./assets";
import { CAMPAIGN_STATS_HEADER, CAMPAIGN_SUBJECT, UNSUBSCRIBE_SUBJECT } from "./subjects";

// Same rules as new-subscriber.ts: tables and inline styles, which every major client renders.
const c = {
  night: "#0a0a0a",
  paper: "#f2ebdd",
  card: "#faf6ee",
  wine: "#780008",
  gold: "#8c6a24",
  goldLight: "#c9a45c",
  muted: "#6b6460",
  line: "#e6dfd3",
};
const serif = "'Cinzel', 'Trajan Pro', Georgia, 'Times New Roman', serif";
const sans = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const mono = "'SFMono-Regular', Menlo, Consolas, 'Courier New', monospace";

const CID_WORDMARK = "clvry-wordmark";
const CID_MARK = "clvry-mark";

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Site paths become absolute links; full URLs pass through. */
function absolute(url: string, siteUrl: string) {
  return url.startsWith("/") ? `${siteUrl.replace(/\/$/, "")}${url}` : url;
}

/** Plain text → paragraphs, with **bold** and [text](url). Everything is escaped first. */
function formatBody(body: string, siteUrl: string) {
  return body
    .trim()
    .split(/\n\s*\n/)
    .map((para) => {
      const html = escapeHtml(para.trim())
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/g, (_, text: string, href: string) => {
          const url = absolute(href.replace(/&amp;/g, "&"), siteUrl);
          return `<a href="${escapeHtml(url)}" style="color:${c.wine};font-weight:600;">${text}</a>`;
        })
        .replace(/\n/g, "<br>");
      return `<p style="margin:0 0 18px;font-family:${sans};font-size:16px;line-height:26px;color:${c.night};">${html}</p>`;
    })
    .join("");
}

function bodyText(body: string) {
  return body.trim().replace(/\*\*(.+?)\*\*/g, "$1").replace(/\[([^\]]+)\]\(([^\s)]+)\)/g, "$1 ($2)");
}

type RenderOptions = {
  siteUrl: string;
  unsubscribeUrl: string;
  /** "cid" for real sends (attachments travel with the email); "data" for the in-browser preview. */
  assets: "cid" | "data";
};

export function renderCampaign(campaign: Campaign, { siteUrl, unsubscribeUrl, assets }: RenderOptions) {
  const wordmarkSrc = assets === "cid" ? `cid:${CID_WORDMARK}` : `data:image/png;base64,${emailWordmark.base64}`;
  const markSrc = assets === "cid" ? `cid:${CID_MARK}` : `data:image/png;base64,${emailMark.base64}`;
  const image = campaign.imageUrl ? absolute(campaign.imageUrl, siteUrl) : "";
  const cta = campaign.ctaLabel && campaign.ctaUrl ? { label: campaign.ctaLabel, url: absolute(campaign.ctaUrl, siteUrl) } : null;
  const host = new URL(siteUrl).host;

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light only">
  <meta name="supported-color-schemes" content="light">
  <title>${escapeHtml(campaign.subject)}</title>
  <style>
    @media (max-width: 620px) {
      .container { width: 100% !important; }
      .px { padding-left: 24px !important; padding-right: 24px !important; }
      .h1 { font-size: 26px !important; line-height: 34px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:${c.paper};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
    ${escapeHtml(campaign.preheader || campaign.heading)}&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${c.paper};">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">
          <tr>
            <td align="center" style="background:${c.night};padding:40px 40px 34px;">
              <a href="${escapeHtml(siteUrl)}" style="text-decoration:none;">
                <img src="${wordmarkSrc}" width="180" height="${Math.round((180 / emailWordmark.width) * emailWordmark.height)}" alt="CLVRY" style="display:block;border:0;outline:none;width:180px;height:auto;">
              </a>
            </td>
          </tr>
          <tr><td style="background:${c.wine};height:4px;line-height:4px;font-size:0;">&nbsp;</td></tr>
          ${
            image
              ? `<tr><td style="background:${c.card};"><img src="${escapeHtml(image)}" width="600" alt="" style="display:block;border:0;width:100%;max-width:600px;height:auto;"></td></tr>`
              : ""
          }
          <tr>
            <td class="px" style="background:${c.card};padding:44px 48px 20px;">
              <h1 class="h1" style="margin:0 0 24px;font-family:${serif};font-size:30px;line-height:38px;font-weight:400;letter-spacing:1px;text-transform:uppercase;color:${c.night};">
                ${escapeHtml(campaign.heading)}
              </h1>
              ${formatBody(campaign.body, siteUrl)}
            </td>
          </tr>
          ${
            cta
              ? `<tr>
            <td class="px" style="background:${c.card};padding:4px 48px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background:${c.night};">
                    <a href="${escapeHtml(cta.url)}" style="display:inline-block;padding:16px 30px;font-family:${mono};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${c.paper};text-decoration:none;">
                      ${escapeHtml(cta.label)} &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`
              : ""
          }
          <tr>
            <td align="center" style="background:${c.card};padding:0 48px 44px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="border-top:1px solid ${c.line};height:1px;line-height:1px;font-size:0;">&nbsp;</td></tr>
              </table>
              <img src="${markSrc}" width="52" height="${Math.round((52 / emailMark.width) * emailMark.height)}" alt="" style="display:block;margin:34px auto 0;border:0;width:52px;height:auto;">
              <p style="margin:16px 0 0;font-family:${serif};font-size:13px;letter-spacing:4px;text-transform:uppercase;color:${c.night};">
                Bring Christ to the street
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="background:${c.night};padding:28px 40px;">
              <p style="margin:0;font-family:${sans};font-size:12px;line-height:18px;color:#a39c94;">
                You're getting this because you joined the CLVRY list at
                <a href="${escapeHtml(siteUrl)}" style="color:${c.goldLight};text-decoration:none;">${escapeHtml(host)}</a>.
              </p>
              <p style="margin:10px 0 0;font-family:${mono};font-size:10px;letter-spacing:2px;text-transform:uppercase;">
                <a href="${escapeHtml(unsubscribeUrl)}" style="color:${c.goldLight};text-decoration:underline;">Unsubscribe</a>
                <span style="color:#6b6460;">&nbsp;&middot;&nbsp; &copy; CLVRY</span>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    campaign.heading.toUpperCase(),
    "",
    bodyText(campaign.body),
    ...(cta ? ["", `${cta.label}: ${cta.url}`] : []),
    "",
    "Bring Christ to the street.",
    "",
    `You're getting this because you joined the CLVRY list at ${host}.`,
    `Unsubscribe: ${unsubscribeUrl}`,
  ].join("\n");

  const attachments =
    assets === "cid"
      ? [
          { filename: "clvry-wordmark.png", content: emailWordmark.base64, encoding: "base64" as const, cid: CID_WORDMARK },
          { filename: "clvry-mark.png", content: emailMark.base64, encoding: "base64" as const, cid: CID_MARK },
        ]
      : [];

  return { html, text, attachments };
}

export type CampaignStats = { recipients: number; sent: number; failed: number; failedEmails: string[] };

/** The record of a send, emailed to the team inbox. The admin's campaign history is read from these. */
export function campaignLogEmail(campaign: Campaign, stats: CampaignStats, siteUrl: string) {
  const preview = renderCampaign(campaign, { siteUrl, unsubscribeUrl: `${siteUrl}/unsubscribe`, assets: "cid" });
  const summary = [
    `Campaign sent from the CLVRY admin: "${campaign.subject}"`,
    `Recipients: ${stats.recipients}`,
    `Delivered to Gmail for sending: ${stats.sent}`,
    `Failed: ${stats.failed}${stats.failedEmails.length ? ` (${stats.failedEmails.join(", ")})` : ""}`,
  ];
  const banner = `<div style="background:#0a0a0a;color:#f2ebdd;padding:16px 20px;font-family:${mono};font-size:12px;line-height:20px;">${summary
    .map(escapeHtml)
    .join("<br>")}<br><span style="color:#c9a45c;">The email as subscribers received it is below.</span></div>`;

  return {
    subject: `${CAMPAIGN_SUBJECT}${campaign.subject}`,
    html: preview.html.replace(/<body([^>]*)>/, `<body$1>${banner}`),
    text: `${summary.join("\n")}\n\n---\n\n${preview.text}`,
    attachments: preview.attachments,
    headers: {
      [CAMPAIGN_STATS_HEADER]: JSON.stringify({ recipients: stats.recipients, sent: stats.sent, failed: stats.failed }),
    },
  };
}

/** Recorded in the team inbox whenever someone leaves the list (or the admin removes them). */
export function unsubscribedEmail(email: string, source: string) {
  const when = new Intl.DateTimeFormat("en-GB", { dateStyle: "full", timeStyle: "short", timeZone: "UTC" }).format(new Date());
  const text = [
    "CLVRY — WEBSITE NOTIFICATION",
    "",
    `${email} is off the newsletter list.`,
    `When: ${when} UTC`,
    `How: ${source}`,
    "",
    "Campaigns from the admin portal will skip this address. If they sign up again, they're back on the list.",
  ].join("\n");
  const html = `<div style="font-family:${sans};font-size:15px;line-height:24px;color:${c.night};background:${c.card};padding:28px;border-top:4px solid ${c.wine};">
  <p style="margin:0 0 6px;font-family:${mono};font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${c.muted};">CLVRY website &middot; Newsletter</p>
  <p style="margin:0 0 16px;font-family:${serif};font-size:20px;text-transform:uppercase;">Unsubscribed</p>
  <p style="margin:0;"><strong>${escapeHtml(email)}</strong> is off the newsletter list.</p>
  <p style="margin:8px 0 0;color:${c.muted};">${escapeHtml(when)} UTC &middot; ${escapeHtml(source)}</p>
  <p style="margin:16px 0 0;color:${c.muted};font-size:13px;">Campaigns from the admin portal will skip this address. If they sign up again, they're back on the list.</p>
</div>`;
  return { subject: `${UNSUBSCRIBE_SUBJECT}${email}`, html, text };
}
