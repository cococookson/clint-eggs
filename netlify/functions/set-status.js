import { getStore } from "@netlify/blobs";

export default async (req) => {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return new Response("Server not configured (missing ADMIN_PASSWORD)", { status: 500 });

  const provided = req.headers.get("x-admin-password") || "";
  if (provided !== expected) return new Response("Unauthorized", { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body || typeof body.hasEggs !== "boolean") {
    return new Response("Bad Request (expected { hasEggs: boolean })", { status: 400 });
  }

  const store = getStore("clint-eggs");
  const payload = { hasEggs: body.hasEggs, updatedAt: Date.now() };

  await store.setJSON("status", payload);

  return new Response("ok", { status: 200 });
};
