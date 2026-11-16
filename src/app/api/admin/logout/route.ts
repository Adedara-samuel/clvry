import { SESSION_COOKIE } from "@/lib/admin/session";

export function POST() {
  return Response.json(
    { ok: true },
    { headers: { "Set-Cookie": `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0` } },
  );
}
