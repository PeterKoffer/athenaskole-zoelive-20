import { ensureCoverImage } from "../../../src/agents/imageAgent";

Deno.serve(async (req) => {
  try {
    const { sessionId, universeId, gradeInt, prompt, minBytes } = await req.json();
    const id = sessionId ?? crypto.randomUUID();
    const res = await ensureCoverImage(id, { universeId, gradeInt, prompt, minBytes });
    return new Response(JSON.stringify({ ok: true, data: res }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500 });
  }
});
