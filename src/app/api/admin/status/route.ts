import { fail, guardAdmin } from "@/lib/admin/guard";
import { storeMode } from "@/lib/admin/content-store";
import { getMailEnv } from "@/lib/mailer";

/** What's configured, for the dashboard's setup checklist. Never returns secret values. */
export async function GET(request: Request) {
  const denied = await guardAdmin(request);
  if (denied) return denied;
  try {
    let mail: { ok: boolean; sender?: string; inbox?: string; error?: string };
    try {
      const env = getMailEnv();
      mail = { ok: true, sender: env.SMTP_USER, inbox: env.CONTACT_TO_EMAIL };
    } catch (error) {
      mail = { ok: false, error: (error as Error).message };
    }
    return Response.json({
      ok: true,
      mail,
      store: {
        mode: storeMode(),
        repo: process.env.GITHUB_REPO ?? null,
        branch: process.env.GITHUB_BRANCH || "main",
      },
      siteUrl: process.env.SITE_URL || new URL(request.url).origin,
      siteUrlSet: Boolean(process.env.SITE_URL),
      weakPassword: (process.env.ADMIN_PASSWORD ?? "").length < 12,
    });
  } catch (error) {
    return fail(error);
  }
}
