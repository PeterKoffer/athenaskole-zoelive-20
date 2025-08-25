import type { AgentInputs } from "./types";
import { logEvent } from "./logger";

export interface ScenarioState {
  step: number;
  history: string[];
}

export async function advanceScenario(
  sessionId: string,
  inputs: AgentInputs,
  state: ScenarioState
): Promise<ScenarioState> {
  const next: ScenarioState = {
    step: state.step + 1,
    history: [...state.history, `Advanced in ${inputs.subject} (grade ${inputs.grade})`],
  };

  await logEvent({
    sessionId,
    agent: "simulator",
    level: "info",
    message: "Scenario advanced",
    meta: next,
  });

  return next;
}
