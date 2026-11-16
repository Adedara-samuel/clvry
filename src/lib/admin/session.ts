/*
 * Admin session: a signed cookie (HMAC-SHA256, Web Crypto only) so the same code verifies it in
 * proxy.ts and in route handlers. There's one admin account; its credentials live in env vars.
 */

export const SESSION_COOKIE = "clvry_admin";
export const SESSION_MAX_AGE = 60 * 60 * 12; // 12 hours

const encoder = new TextEncoder();

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET is missing or shorter than 32 characters. Set it in .env.local.");
  }
  return value;
}

function toBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string) {
  const binary = atob(value.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

async function hmacKey(purpose: string) {
  return crypto.subtle.importKey("raw", encoder.encode(`${purpose}:${secret()}`), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);
}

/** Signs `payload` for a given purpose (sessions and unsubscribe links use different keys). */
export async function sign(purpose: string, payload: string) {
  const sig = await crypto.subtle.sign("HMAC", await hmacKey(purpose), encoder.encode(payload));
  return toBase64Url(new Uint8Array(sig));
}

/** Constant-time check of a signature made by `sign`. */
export async function verify(purpose: string, payload: string, signature: string) {
  try {
    return await crypto.subtle.verify("HMAC", await hmacKey(purpose), fromBase64Url(signature), encoder.encode(payload));
  } catch {
    return false;
  }
}

export async function createSessionToken(username: string) {
  const payload = toBase64Url(encoder.encode(JSON.stringify({ u: username, exp: Date.now() + SESSION_MAX_AGE * 1000 })));
  return `${payload}.${await sign("session", payload)}`;
}

/** Returns the username for a valid, unexpired token, or null. */
export async function readSessionToken(token: string | undefined) {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !(await verify("session", payload, signature))) return null;
  try {
    const data = JSON.parse(new TextDecoder().decode(fromBase64Url(payload))) as { u?: unknown; exp?: unknown };
    if (typeof data.u !== "string" || typeof data.exp !== "number" || data.exp < Date.now()) return null;
    return data.u;
  } catch {
    return null;
  }
}

/** Reads the session cookie straight off a request's Cookie header. */
export function sessionCookieFrom(request: Request) {
  const header = request.headers.get("cookie") ?? "";
  for (const part of header.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === SESSION_COOKIE) return rest.join("=");
  }
  return undefined;
}
