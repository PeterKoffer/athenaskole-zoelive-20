import type { AgentInputs } from "./types.ts";
import { logEvent } from "./logger.ts";
import { boringButCorrectLesson } from "./fallbacks.ts";
import { validateJson } from "./qaAgent.ts";

export async function generateLesson(inputs: AgentInputs) {
  const sessionId = inputs.sessionId ?? cryptoRandom();

  const raw = {
    title: `${inputs.subject} – Grade ${inputs.grade}`,
    objectives: ["Understand core concept", "Practice with examples"],
    activities: ["Warm-up", "Main exercise", "Reflection"],
    assessment: ["Exit ticket"],
    meta: {
      curriculum: inputs.curriculum ?? null,
      ability: inputs.ability ?? null,
      learningStyle: inputs.learningStyle ?? null,
      interests: inputs.interests ?? [],
    },
  };

  await logEvent({
    sessionId,
    agent: "content",
    level: "info",
    message: "Generated raw lesson (stub)",
    meta: { subject: inputs.subject, grade: inputs.grade },
  });

  const qa = await validateJson(sessionId, "content", raw);
  if (!qa.ok) {
    await logEvent({
      sessionId,
      agent: "content",
      level: "warn",
      message: "QA failed – using boring but correct fallback",
      meta: { error: qa.error },
    });
    return { ok: true as const, data: boringButCorrectLesson, note: "fallback" };
  }

  return { ok: true as const, data: qa.data };
}

function cryptoRandom() {
  // lille helper så vi ikke er afhængige af Node's crypto i alle miljøer
  return "sess_" + Math.random().toString(36).slice(2, 10);
}
