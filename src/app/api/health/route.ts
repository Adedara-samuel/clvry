import { connection } from "next/server";

// Pinged by .github/workflows/keep-alive.yml so the server never idles into a cold start.
export async function GET() {
  await connection(); // run on every request rather than serving a prerendered response
  return Response.json(
    { ok: true, service: "clvry", time: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
