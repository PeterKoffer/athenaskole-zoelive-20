import { generateLesson } from "../../../src/agents/contentAgent.ts";
import type { AgentInputs } from "../../../src/agents/types.ts";

Deno.serve(async (req) => {
  try {
    const inputs = (await req.json()) as AgentInputs;
    const sessionId = inputs.sessionId ?? crypto.randomUUID();
    const result = await generateLesson({ ...inputs, sessionId });
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500 });
  }
});
