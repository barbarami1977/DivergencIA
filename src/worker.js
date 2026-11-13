import resourceUrls from "./resource-urls.js";

import { api as simonRoomAPI } from "./simon-rooms.js";

const countPath = "/api/contadores";
const noCache = { "Cache-Control": "no-store" };

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/simon/room") return simonRoomAPI(request, env);
    if (["/bingo", "/simon"].includes(url.pathname)) return Response.redirect(url.origin + url.pathname + "/" + url.search, 308);
    if (url.pathname !== countPath) {
      const response = await env.ASSETS.fetch(request);
      if (response.headers.get("Content-Type")?.includes("text/html")) {
        const headers = new Headers(response.headers);
        headers.set("Cache-Control", "no-cache");
        headers.set("Permissions-Policy", "autoplay=()");
        return new Response(response.body, { status: response.status, headers });
      }
      return response;
    }

    if (request.method === "GET") {
      const { results } = await env.DB.prepare(
        "SELECT resource, action, total FROM public_counts"
      ).all();
      return Response.json(results, { headers: noCache });
    }

    if (request.method !== "POST") {
      return new Response(null, { status: 405, headers: { Allow: "GET, POST" } });
    }
    if (request.headers.get("Origin") !== url.origin) {
      return new Response(null, { status: 403 });
    }

    const data = await request.json().catch(() => null);
    const resource = data?.resource;
    const action = data?.action;
    const valid = resource === "site"
      ? action === "visit"
      : typeof resource === "string" && Object.hasOwn(resourceUrls, resource)
        && (action === "open" || (action === "download" && resourceUrls[resource]));
    if (!valid) return new Response(null, { status: 400 });

    const result = await env.DB.prepare(
      `INSERT INTO public_counts (resource, action, total) VALUES (?, ?, 1)
       ON CONFLICT (resource, action) DO UPDATE SET total = total + 1
       RETURNING total`
    ).bind(resource, action).first();
    return Response.json(result, { headers: noCache });
  }
};
