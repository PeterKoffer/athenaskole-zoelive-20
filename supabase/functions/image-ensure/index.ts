// supabase/functions/image-ensure/index.ts
import { ensureCoverImage } from "../../../src/agents/imageAgent";

Deno.serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ ok: false, error: "method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { sessionId, universeId, gradeInt, prompt, minBytes } = await req.json();
    if (!universeId || typeof gradeInt !== "number") {
      return new Response(
        JSON.stringify({ ok: false, error: "missing or invalid universeId/gradeInt" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const id = sessionId ?? (crypto as any).randomUUID?.() ?? `sess_${Math.random().toString(36).slice(2)}`;
    const res = await ensureCoverImage(id, { universeId, gradeInt, prompt, minBytes });

    return new Response(JSON.stringify({ ok: true, data: res }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
