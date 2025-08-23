// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

/** Simpel SVG-cover generator (ingen ekstern afhængighed) */
serve(async (req) => {
  try {
    const url = new URL(req.url);
    const title = url.searchParams.get("title") ?? "Untitled";
    const author = url.searchParams.get("author") ?? "Anonymous";
    const bg = url.searchParams.get("bg") ?? "264653";
    const color = url.searchParams.get("color") ?? "ffffff";
    const size = parseInt(url.searchParams.get("size") ?? "70", 10);
    const width = parseInt(url.searchParams.get("width") ?? "1200", 10);
    const height = parseInt(url.searchParams.get("height") ?? "630", 10);

    const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#${bg}"/>
  <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="${size}px" font-weight="bold" fill="#${color}" text-anchor="middle">
    ${title}
  </text>
  <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="${Math.round(size * 0.4)}px" fill="#${color}" text-anchor="middle">
    by ${author}
  </text>
</svg>`.trim();

    return new Response(svg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "public, max-age=31536000",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err?.message ?? err) }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});
