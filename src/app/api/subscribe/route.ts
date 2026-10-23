import { newSubscriberEmail } from "@/emails/new-subscriber";
import { sendNotification } from "@/lib/mailer";
import { subscribeSchema } from "@/lib/schemas";

// Basic per-IP throttle so the form can't be used to flood the inbox.
// In-memory, so it's per server instance — good enough for a landing page.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

function pageUrlFrom(request: Request) {
  const referer = request.headers.get("referer");
  if (!referer) return undefined;
  try {
    const url = new URL(referer);
    return url.protocol === "http:" || url.protocol === "https:" ? url.origin + url.pathname : undefined;
  } catch {
    return undefined;
  }
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return Response.json({ ok: false, error: "Too many attempts. Please try again later." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = subscribeSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 },
    );
  }

  try {
    await sendNotification(
      newSubscriberEmail({
        email: parsed.data.email,
        submittedAt: new Date(),
        pageUrl: pageUrlFrom(request),
      }),
    );
  } catch (error) {
    console.error("[subscribe] failed to send notification:", error);
    return Response.json(
      { ok: false, error: "We couldn't sign you up right now. Please try again." },
      { status: 500 },
    );
  }

  return Response.json({ ok: true });
}
