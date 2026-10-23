import { emailMark, emailWordmark } from "./assets";

// Email HTML: tables + inline styles only — that's what Gmail, Outlook and Apple Mail all render.
const c = {
  night: "#0b0a0a",
  paper: "#f4efe6",
  card: "#fbf8f3",
  wine: "#5e0b1a",
  fire: "#b22222",
  gold: "#daa520",
  muted: "#6b6460",
  line: "#e6dfd3",
};
const serif = "'Cinzel', 'Trajan Pro', Georgia, 'Times New Roman', serif";
const sans = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const mono = "'SFMono-Regular', Menlo, Consolas, 'Courier New', monospace";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export type NewSubscriber = {
  email: string;
  submittedAt: Date;
  /** Page the form was submitted from, if known. */
  pageUrl?: string;
};

const CID_WORDMARK = "clvry-wordmark";
const CID_MARK = "clvry-mark";

export function newSubscriberEmail({ email, submittedAt, pageUrl }: NewSubscriber) {
  const when = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(submittedAt);

  const safeEmail = escapeHtml(email);
  const mailto = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent("Welcome to CLVRY")}`;

  const rows: [string, string][] = [
    ["Email", `<a href="${escapeHtml(mailto)}" style="color:${c.wine};text-decoration:none;font-weight:600;">${safeEmail}</a>`],
    ["Signed up", `${escapeHtml(when)} UTC`],
    ["Source", "CLVRY website &middot; Newsletter sign-up form"],
  ];
  if (pageUrl) rows.push(["Page", escapeHtml(pageUrl)]);

  const detailRows = rows
    .map(
      ([label, value], i) => `
      <tr>
        <td style="padding:14px 0;${i ? `border-top:1px solid ${c.line};` : ""}width:110px;vertical-align:top;font-family:${mono};font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${c.muted};">${label}</td>
        <td style="padding:14px 0;${i ? `border-top:1px solid ${c.line};` : ""}vertical-align:top;font-family:${sans};font-size:15px;line-height:22px;color:${c.night};word-break:break-word;">${value}</td>
      </tr>`,
    )
    .join("");

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light only">
  <meta name="supported-color-schemes" content="light">
  <title>New newsletter sign-up</title>
  <style>
    @media (max-width: 620px) {
      .container { width: 100% !important; }
      .px { padding-left: 24px !important; padding-right: 24px !important; }
      .h1 { font-size: 24px !important; line-height: 32px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:${c.paper};">
  <!-- Inbox preview text -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
    ${safeEmail} just joined the CLVRY list from the website.&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${c.paper};">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">

          <!-- Header -->
          <tr>
            <td align="center" style="background:${c.night};padding:44px 40px 36px;">
              <img src="cid:${CID_WORDMARK}" width="200" height="${Math.round((200 / emailWordmark.width) * emailWordmark.height)}" alt="CLVRY" style="display:block;border:0;outline:none;width:200px;height:auto;">
              <p style="margin:20px 0 0;font-family:${mono};font-size:10px;letter-spacing:4px;text-transform:uppercase;color:${c.gold};">Website notification</p>
            </td>
          </tr>
          <tr><td style="background:${c.fire};height:4px;line-height:4px;font-size:0;">&nbsp;</td></tr>

          <!-- Body -->
          <tr>
            <td class="px" style="background:${c.card};padding:44px 48px 12px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background:${c.wine};padding:7px 14px;font-family:${mono};font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${c.paper};">
                    <span style="color:${c.gold};">&#9679;</span>&nbsp; From the website &middot; Newsletter
                  </td>
                </tr>
              </table>

              <h1 class="h1" style="margin:28px 0 0;font-family:${serif};font-size:30px;line-height:38px;font-weight:400;letter-spacing:1px;text-transform:uppercase;color:${c.night};">
                New subscriber<br>on the list
              </h1>
              <p style="margin:16px 0 0;font-family:${sans};font-size:15px;line-height:24px;color:${c.muted};">
                Someone just joined the CLVRY newsletter through the sign-up form on the website.
                They&rsquo;ll want to hear first when the shop, Circle Sessions and the lookbook open.
              </p>
            </td>
          </tr>

          <!-- Details card -->
          <tr>
            <td class="px" style="background:${c.card};padding:24px 48px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-left:3px solid ${c.gold};">
                <tr>
                  <td style="padding:6px 0 6px 22px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${detailRows}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td class="px" style="background:${c.card};padding:32px 48px 44px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background:${c.night};">
                    <a href="${escapeHtml(mailto)}" style="display:inline-block;padding:16px 30px;font-family:${mono};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${c.paper};text-decoration:none;">
                      Write to subscriber &rarr;
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:16px 0 0;font-family:${sans};font-size:12px;line-height:18px;color:${c.muted};">
                Or just hit reply. Replies to this email go straight to the subscriber.
              </p>
            </td>
          </tr>

          <!-- Sign-off -->
          <tr>
            <td align="center" style="background:${c.card};padding:0 48px 44px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="border-top:1px solid ${c.line};height:1px;line-height:1px;font-size:0;">&nbsp;</td></tr>
              </table>
              <img src="cid:${CID_MARK}" width="56" height="${Math.round((56 / emailMark.width) * emailMark.height)}" alt="" style="display:block;margin:36px auto 0;border:0;width:56px;height:auto;">
              <p style="margin:16px 0 0;font-family:${serif};font-size:13px;letter-spacing:4px;text-transform:uppercase;color:${c.night};">
                Bring Christ to the street
              </p>
              <p style="margin:6px 0 0;font-family:${mono};font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${c.muted};">
                Galatians 6:14
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background:${c.night};padding:28px 40px;">
              <p style="margin:0;font-family:${sans};font-size:12px;line-height:18px;color:#a39c94;">
                Sent automatically by the CLVRY website when someone joins the newsletter.
              </p>
              <p style="margin:10px 0 0;font-family:${mono};font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#6b6460;">
                &copy; CLVRY &middot; Developed by
                <a href="https://sapoktech.vercel.app" style="color:${c.gold};text-decoration:none;">Sapok</a>
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
    "CLVRY — WEBSITE NOTIFICATION",
    "",
    "New subscriber on the list",
    "Someone just joined the CLVRY newsletter through the sign-up form on the website.",
    "",
    `Email: ${email}`,
    `Signed up: ${when} UTC`,
    "Source: CLVRY website · Newsletter sign-up form",
    ...(pageUrl ? [`Page: ${pageUrl}`] : []),
    "",
    "Reply to this email to write to the subscriber directly.",
    "",
    "Bring Christ to the street. Galatians 6:14",
    "Sent automatically by the CLVRY website. Developed by Sapok: https://sapoktech.vercel.app",
  ].join("\n");

  return {
    subject: `[CLVRY Website] New newsletter sign-up: ${email}`,
    html,
    text,
    replyTo: email,
    attachments: [
      { filename: "clvry-wordmark.png", content: emailWordmark.base64, encoding: "base64" as const, cid: CID_WORDMARK },
      { filename: "clvry-mark.png", content: emailMark.base64, encoding: "base64" as const, cid: CID_MARK },
    ],
  };
}
