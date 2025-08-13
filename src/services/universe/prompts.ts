export const UNIVERSE_BRIEF_PROMPT = (p: {
  subject: string; gradeBand: string; interestsCSV: string;
}) => `
You design a short, VIVID, DAILY-LIFE learning universe for a ${p.gradeBand} ${p.subject} student.
Blend curriculum with interests: ${p.interestsCSV || "none"} (interest weight ≤ 40%).
Ground everything in school/home/club/work/community life - NO fantasy unless explicitly tagged.
Return STRICT JSON:
{
  "title": "Brief, engaging title (max 6 words)",
  "synopsis": "2-3 sentences grounded in school/home/club/work life with concrete stakes",
  "props": ["prop1","prop2","prop3","prop4"],         // real, tangible items/places students use daily
  "tags": ["sports","cooking"]                // 2-4 interest tags actually used in this scenario
}
`.trim();

export const SIMULATE_STEP_PROMPT = (p: {
  state: any; horizon: "day"|"week"|"month"|"year";
  todayStandards: string[];                // chosen standards for this step
  signals: Array<{tag:string,delta:number}>; // engagement signals since last step
}) => `
You are advancing an educational simulation in *small, realistic steps* for horizon="${p.horizon}".
Input:
- currentState: ${JSON.stringify(p.state)}
- standardsToTargetToday: ${JSON.stringify(p.todayStandards)}
- latestSignals: ${JSON.stringify(p.signals)}  // interest +/- deltas

Rules:
- Keep story in DAILY LIFE (school/home/club/community). Avoid fantasy unless tagged.
- Balance: standards alignment ≈ 60–80%; interests ≈ up to 40%; sprinkle novelty 10–20%.
- Prefer concrete tasks: budgets, tables, maps, schedules, measurements, checklists, timers.
- DO NOT repeat yesterday's props; rotate settings and stakes while maintaining narrative thread.
- Advance time minimally for "day" (one day's beat), more for "week/month/year" (summaries + milestones).
- Return ONLY a DIFF JSON with keys that need updating.

Return STRICT JSON:
{
  "title"?: "Updated title if scenario shifts",
  "synopsis"?: "Updated synopsis if story advances significantly", 
  "tags"?: ["updated","interest","tags"],
  "props"?: ["new","props","to","use"],
  "metrics"?: { "mastery": {"<stdId>": 0.05}, "engagement": +0.1 },
  "log": [ { "t": "8:15", "event": "Morning standup at the cafe pop-up" } ],
  "advanceDay": true
}
`.trim();