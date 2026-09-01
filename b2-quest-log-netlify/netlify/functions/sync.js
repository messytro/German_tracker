import { getStore } from "@netlify/blobs";

// Simple sync endpoint: GET to pull, POST to push, both keyed by a
// user-chosen "sync code". No accounts, no auth — anyone with the exact
// code you choose could read/write your data, so pick something
// reasonably unguessable, not "1234".

export default async (req) => {
  const url = new URL(req.url);
  const code = (url.searchParams.get("code") || "").trim();

  if (code.length < 4) {
    return new Response(
      JSON.stringify({ error: "Sync code must be at least 4 characters" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const store = getStore("b2quest-sync");
  const key = "sync-" + code;

  if (req.method === "GET") {
    const data = await store.get(key, { type: "json" });
    return new Response(JSON.stringify({ data: data || null }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (req.method === "POST") {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    await store.setJSON(key, body);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config = { path: "/api/sync" };
