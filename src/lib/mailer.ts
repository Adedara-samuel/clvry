import nodemailer, { type Transporter } from "nodemailer";
import { z } from "zod";

// Validated lazily (on first send) so builds don't need SMTP credentials.
const mailEnvSchema = z.object({
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().int().positive(),
  SMTP_USER: z.email(),
  SMTP_PASS: z.string().min(1),
  CONTACT_TO_EMAIL: z.email(),
});

type MailEnv = z.infer<typeof mailEnvSchema>;

let cached: { env: MailEnv; transporter: Transporter } | null = null;

function getMailer() {
  if (cached) return cached;
  const parsed = mailEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const missing = parsed.error.issues.map((i) => i.path.join(".")).join(", ");
    throw new Error(`Mail is not configured. Check .env.local for: ${missing}`);
  }
  const env = parsed.data;
  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465, // 465 = implicit TLS; 587 upgrades via STARTTLS
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });
  cached = { env, transporter };
  return cached;
}

type Notification = {
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachments?: { filename: string; content: string; encoding: "base64"; cid: string }[];
};

/** Sends a message from the site's sender account to CONTACT_TO_EMAIL. */
export async function sendNotification({ subject, html, text, replyTo, attachments }: Notification) {
  const { env, transporter } = getMailer();
  await transporter.sendMail({
    from: { name: "CLVRY Website", address: env.SMTP_USER },
    to: env.CONTACT_TO_EMAIL,
    replyTo,
    subject,
    html,
    text,
    attachments,
  });
}
