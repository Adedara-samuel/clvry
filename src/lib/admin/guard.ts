import "server-only";
import { readSessionToken, sessionCookieFrom } from "./session";

/**
 * Checks an admin API request. proxy.ts already blocks signed-out requests, but every handler checks
 * again close to the data. Writes must also come from this site's own pages (Origin check), which
 * together with the SameSite=Strict cookie stops cross-site request forgery.
 *
 * Returns an error Response to send back, or null when the request may proceed.
 */
export async function guardAdmin(request: Request): Promise<Response | null> {
  const user = await readSessionToken(sessionCookieFrom(request)).catch(() => null);
  if (!user) return Response.json({ ok: false, error: "Please sign in again." }, { status: 401 });

  if (request.method !== "GET" && request.method !== "HEAD") {
    const origin = request.headers.get("origin");
    if (!origin || origin !== new URL(request.url).origin) {
      return Response.json({ ok: false, error: "Request blocked: it didn't come from the admin." }, { status: 403 });
    }
  }
  return null;
}

/** A JSON error response with the message the admin UI shows in its toast. */
export function fail(error: unknown, status = 500) {
  const message = error instanceof Error ? error.message : String(error);
  if (status >= 500) console.error("[admin]", error);
  return Response.json({ ok: false, error: message }, { status });
}

/** Very small per-instance throttle (same approach as /api/subscribe). */
export function throttle(bucket: Map<string, number[]>, key: string, max: number, windowMs: number) {
  const now = Date.now();
  const recent = (bucket.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  bucket.set(key, recent);
  return recent.length > max;
}

/** The public site address used in email links: SITE_URL if set, otherwise wherever the admin is open. */
export function siteUrlFor(request: Request) {
  return (process.env.SITE_URL || new URL(request.url).origin).replace(/\/$/, "");
}

export function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}
