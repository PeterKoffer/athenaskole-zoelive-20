export type Horizon = "day" | "week" | "month" | "year";

export type UniverseState = {
  id: string;                     // stable across days
  subject: string;
  gradeBand: "3-5" | "6-8" | "9-12";
  title: string;
  synopsis: string;
  tags: string[];                 // interest tags we're leaning into
  props: string[];                // concrete objects/locations used in tasks
  time: {                         // simulation clock
    dayIndex: number;             // 0..n (increments)
    horizon: Horizon;
  };
  metrics: {                      // learning + engagement signals
    mastery: Record<string, number>; // standardId -> 0..1
    engagement: number;              // -1..+1 rolling score
  };
  log: Array<{ t: string; event: string; data?: any }>; // short event feed
};

export type UniverseDiff = {
  title?: string;
  synopsis?: string;
  tags?: string[];
  props?: string[];
  metrics?: Partial<UniverseState["metrics"]>;
  log?: UniverseState["log"];
  // advancing time:
  advanceDay?: boolean;
};

export function applyDiff(s: UniverseState, d: UniverseDiff): UniverseState {
  return {
    ...s,
    title: d.title ?? s.title,
    synopsis: d.synopsis ?? s.synopsis,
    tags: d.tags ?? s.tags,
    props: d.props ?? s.props,
    metrics: { ...s.metrics, ...(d.metrics ?? {}) },
    time: {
      ...s.time,
      dayIndex: (d.advanceDay ? s.time.dayIndex + 1 : s.time.dayIndex),
    },
    log: d.log ? [...s.log, ...d.log] : s.log,
  };
}