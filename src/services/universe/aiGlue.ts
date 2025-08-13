// src/services/universe/aiGlue.ts
import { UniversePack, GradeBand, BeatBlueprint, CanonicalSubject } from "@/content/types";

// Hook into your existing prompt system:
type Personalization = {
  gradeBand: GradeBand;
  subjectOfDay: CanonicalSubject;
  minutesTotal: number;               // e.g., 150 for 2.5h
  interests: string[];
  teachingPerspective?: string;       // project_based, explicit_instruction, etc.
  learningStyle?: "visual"|"auditory"|"reading_writing"|"kinesthetic";
  ability?: { readingLevel?: "below"|"on"|"above"; numeracyLevel?: "below"|"on"|"above"; scaffolding?: boolean; stretchGoals?: boolean };
  calendarKeywords?: string[];
  standards?: string[];               // resolved standard IDs
};

// Replace with your actual model call:
async function callLLMJson(_prompt: string): Promise<any> {
  // NOTE: in offline mode this throws — caller will handle fallback
  // Wire this to your existing edge function or client model call.
  throw new Error("LLM unavailable (demo fallback)");
}

function clamp(n: number, min: number, max: number) { return Math.max(min, Math.min(max, n)); }

// Scale beats to fit duration:
export function scaleBeatsToMinutes(beats: BeatBlueprint[], band: GradeBand, targetMinutes: number) {
  const base = beats.reduce((s,b)=> s + (b.minutes[band] ?? 0), 0);
  if (base <= 0) return beats;
  const r = targetMinutes / base;
  return beats.map(b => {
    const m = Math.round((b.minutes[band] ?? 0) * r);
    return { ...b, minutes: { ...b.minutes, [band]: clamp(m, 4, 30) } };
  });
}

// OFFLINE fallback generator (no AI): concrete tasks with props/tables/checklists
function offlineActivityFromBeat(pack: UniversePack, beat: BeatBlueprint, band: GradeBand) {
  const props = beat.props.slice(0,3).join(", ");
  const minutes = beat.minutes[band] ?? 10;
  switch (beat.kind) {
    case "visual_hook":
      return {
        kind: "make",
        title: beat.title,
        minutes,
        instructions: `Sketch or assemble a visual for "${pack.title}". Use at least two props: ${props}. K-2 may draw; older bands can mock a logo/poster or UI wireframe.`,
        deliverable: "One image/photo or simple mockup.",
        tags: beat.tags,
      };
    case "make_something":
      return {
        kind: "task",
        title: beat.title,
        minutes,
        instructions: `Create a concrete asset linked to "${pack.title}" (e.g., menu, budget, checklist, storyboard). Include numbers or steps and reference ${props}.`,
        deliverable: "One document/table with at least 6 items/rows.",
        tags: beat.tags,
      };
    case "investigate":
      return {
        kind: "investigate",
        title: beat.title,
        minutes,
        instructions: `Collect or analyze small data for "${pack.title}". Make a quick table with 5–10 rows. Use ${props} where meaningful.`,
        deliverable: "A table plus 2 sentences of findings.",
        tags: beat.tags,
      };
    case "practice":
      return {
        kind: "quiz",
        title: beat.title,
        minutes,
        instructions: `Do a quick practice set aligned to today's subject. If a game is available, play once.`,
        game: beat.gameId ? { id: beat.gameId, params: beat.gameParams } : undefined,
        deliverable: "Score or 5 self-checked items.",
        tags: beat.tags,
      };
    case "apply":
      return {
        kind: "apply",
        title: beat.title,
        minutes,
        instructions: `Solve a realistic constraint in "${pack.title}" using a small budget/limit. Use a table or bullet plan that references ${props}.`,
        deliverable: "A plan with justification (3–6 sentences).",
        tags: beat.tags,
      };
    case "reflect":
      return {
        kind: "reflect",
        title: beat.title,
        minutes,
        instructions: `Write a quick reflection: what worked, what you'd change, one question you still have.`,
        deliverable: "3–5 sentences or a voice note.",
        tags: beat.tags,
      };
    case "present":
      return {
        kind: "present",
        title: beat.title,
        minutes,
        instructions: `Share one artifact from today's work and ask for one piece of feedback.`,
        deliverable: "Photo/file + 1 feedback note.",
        tags: beat.tags,
      };
    default:
      return {
        kind: "task",
        title: beat.title,
        minutes,
        instructions: `Complete a concrete step for "${pack.title}".`,
        deliverable: "One small artifact.",
        tags: beat.tags,
      };
  }
}

// AI enrichment: returns per-beat activities; falls back to concrete offline tasks
export async function buildLessonFromPack(pack: UniversePack, p: Personalization) {
  // 1) scale beats to the teacher's lesson duration
  const beatsScaled = scaleBeatsToMinutes(pack.beats[p.gradeBand], p.gradeBand, p.minutesTotal);

  // 2) try AI to enrich (single prompt with strict JSON)
  const prompt = `
You are generating lesson activities for a "${pack.title}" universe.
Subject of the day: ${p.subjectOfDay}. Grade band: ${p.gradeBand}. Total minutes: ${p.minutesTotal}.
Teaching perspective: ${p.teachingPerspective ?? "project_based"}.
Learning style: ${p.learningStyle ?? "visual"}.
Ability: ${JSON.stringify(p.ability ?? {})}.
Interests: ${JSON.stringify(p.interests ?? [])}.
Calendar: ${JSON.stringify(p.calendarKeywords ?? [])}.
Standards: ${JSON.stringify(p.standards ?? [])}.
Setting synopsis: grounded in daily life. Props to use in tasks: ${Array.from(new Set(beatsScaled.flatMap(b=>b.props))).slice(0,6).join(", ")}.
Return STRICT JSON array; each item:
{
  "kind": "make|investigate|quiz|apply|reflect|present|simulate",
  "title": "...",
  "minutes": <int>,
  "instructions": "student-facing steps, concrete, references at least 2 props",
  "deliverable": "what to produce",
  "tags": ["..."],
  "game": { "id": "fast-facts", "params": {...} } | null
}
Only generate ${beatsScaled.length} items, ordered to match these beats: ${beatsScaled.map(b=>b.kind).join(", ")}.
Each activity MUST clearly support ${p.subjectOfDay} (reference standards if given).
  `.trim();

  try {
    const enriched = await callLLMJson(prompt);
    if (Array.isArray(enriched) && enriched.length === beatsScaled.length) {
      // sanity: ensure minutes not zero
      return enriched.map((a: any, i: number) => ({
        ...a,
        minutes: a.minutes || beatsScaled[i].minutes[p.gradeBand] || 10,
      }));
    }
    throw new Error("Bad LLM format");
  } catch {
    // 3) guaranteed offline fallback (no AI)
    return beatsScaled.map(b => offlineActivityFromBeat(pack, b, p.gradeBand));
  }
}