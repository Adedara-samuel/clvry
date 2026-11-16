import { createHash, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { clientIp, throttle } from "@/lib/admin/guard";
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/admin/session";

const loginSchema = z.object({ username: z.string().max(200), password: z.string().max(200) });

// Slows down password guessing: 8 tries per IP per 15 minutes.
const attempts = new Map<string, number[]>();

function same(a: string, b: string) {
  // Hash first so the comparison is constant-time regardless of length.
  return timingSafeEqual(createHash("sha256").update(a).digest(), createHash("sha256").update(b).digest());
}

export async function POST(request: Request) {
  if (throttle(attempts, clientIp(request), 8, 15 * 60 * 1000)) {
    return Response.json({ ok: false, error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
  }

  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPass = process.env.ADMIN_PASSWORD;
  if (!expectedUser || !expectedPass || !process.env.ADMIN_SESSION_SECRET) {
    return Response.json(
      { ok: false, error: "The admin login isn't set up. Add ADMIN_USERNAME, ADMIN_PASSWORD and ADMIN_SESSION_SECRET." },
      { status: 500 },
    );
  }

  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ ok: false, error: "Enter your username and password." }, { status: 400 });

  const { username, password } = parsed.data;
  // Evaluate both so a wrong username takes as long as a wrong password.
  const userOk = same(username.trim(), expectedUser);
  const passOk = same(password, expectedPass);
  if (!userOk || !passOk) {
    return Response.json({ ok: false, error: "Wrong username or password." }, { status: 401 });
  }

  const token = await createSessionToken(expectedUser);
  const secure = new URL(request.url).protocol === "https:";
  return Response.json(
    { ok: true },
    {
      headers: {
        "Set-Cookie": `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_MAX_AGE}${secure ? "; Secure" : ""}`,
      },
    },
  );
}
