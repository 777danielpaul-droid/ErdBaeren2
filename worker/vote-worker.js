export default {
  async fetch(request, env, ctx) {
    // CORS für Requests von github.io
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    const url = new URL(request.url);
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip));
    const ipKey = "ip:" + [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");

    if (url.pathname === "/counts") {
      const erdbaeren = Number(await env.VOTES.get("erdbaeren")) || 0;
      const milchmaeuse = Number(await env.VOTES.get("milchmaeuse")) || 0;
      const mine = await env.VOTES.get(ipKey) || null;
      return json({ erdbaeren, milchmaeuse, mine });
    }

    if (url.pathname === "/vote" && request.method === "POST") {
      let body = {};
      try { body = await request.json(); } catch {}
      const faction = body.faction;
      if (faction !== "erdbaeren" && faction !== "milchmaeuse") {
        return json({ error: "invalid faction" }, 400);
      }

      const prev = await env.VOTES.get(ipKey);
      if (prev && prev !== faction) {
        const old = Number(await env.VOTES.get(prev)) || 0;
        await env.VOTES.put(prev, String(Math.max(0, old - 1)));
      }
      if (!prev || prev !== faction) {
        const cur = Number(await env.VOTES.get(faction)) || 0;
        await env.VOTES.put(faction, String(cur + 1));
      }
      await env.VOTES.put(ipKey, faction);

      const erdbaeren = Number(await env.VOTES.get("erdbaeren")) || 0;
      const milchmaeuse = Number(await env.VOTES.get("milchmaeuse")) || 0;
      return json({ erdbaeren, milchmaeuse, mine: faction });
    }

    return new Response("Not found", { status: 404 });
  },
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
