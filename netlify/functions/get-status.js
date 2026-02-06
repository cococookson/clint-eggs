import { getStore } from "@netlify/blobs";

export default async () => {
  const store = getStore("clint-eggs");
  const data = await store.get("status", { type: "json", consistency: "strong" });

  // Default if nothing has been set yet:
  const status = data ?? { hasEggs: false, updatedAt: null };

  return new Response(JSON.stringify(status), {
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
};
