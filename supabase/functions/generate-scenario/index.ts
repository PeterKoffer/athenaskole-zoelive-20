import { advanceScenario, type ScenarioState } from "../../../src/agents/simulatorAgent";
import type { AgentInputs } from "../../../src/agents/types";

Deno.serve(async (req) => {
  try {
    const { inputs, state } = (await req.json()) as { inputs: AgentInputs; state: ScenarioState };
    const sessionId = inputs.sessionId ?? crypto.randomUUID();
    const next = await advanceScenario(sessionId, inputs, state);
    return new Response(JSON.stringify({ ok: true, data: next }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500 });
  }
});
