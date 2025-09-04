import type { Simulation } from '../dsl/schema';

export type SimState = {
  nodeId: string;
  resources: Record<string, number>;
  flags: Record<string, boolean>;
  log: Array<{ nodeId: string; optionId?: string }>;
  score: number;
};

export function init(sim: Simulation): SimState {
  return {
    nodeId: sim.start,
    resources: { ...sim.resources },
    flags: {},
    log: [],
    score: 0,
  };
}

export function step(sim: Simulation, state: SimState, optionId: string | null): SimState {
  const node = sim.nodes.find(n => n.id === state.nodeId);
  if (!node) throw new Error(`Node not found: ${state.nodeId}`);

  let nextId: string | null = null;

  if (node.kind === 'decision' && optionId) {
    const opt = node.options?.find(o => o.id === optionId);
    if (!opt) throw new Error('Invalid option');

    for (const e of opt.effects ?? []) {
      if (e.type === 'resource') {
        const cur = state.resources[e.key] ?? 0;
        state.resources[e.key] =
          e.op === 'inc' ? cur + (e.value ?? 0)
        : e.op === 'dec' ? cur - (e.value ?? 0)
        : (e.value ?? cur);
      } else if (e.type === 'flag') {
        state.flags[e.key] = e.op !== 'dec';
      } else if (e.type === 'score') {
        state.score += e.value ?? 0;
      }
    }

    state.log.push({ nodeId: node.id, optionId });
    nextId = opt.to;
  } else {
    state.log.push({ nodeId: node.id });
    nextId = node.options?.[0]?.to ?? null;
  }

  return { ...state, nodeId: nextId ?? state.nodeId };
}
