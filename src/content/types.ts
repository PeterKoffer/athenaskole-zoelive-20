// src/content/types.ts
export type GradeBand = "K-2" | "3-5" | "6-8" | "9-10" | "11-12";

export type CanonicalSubject =
  | "Mathematics"
  | "Science"
  | "English"
  | "Social Studies"
  | "Arts"
  | "Music"
  | "PE"
  | "Technology"
  | "Computer Science"
  | "Foreign Language"
  | "Civics"
  | "Life Skills";

export type UniverseCategory =
  | "Entrepreneurship & Business"
  | "Science & Exploration"
  | "Creative Arts & Media Production"
  | "Civics, Community & Social Good"
  | "Engineering & Hands-On Design"
  | "Personal Growth & Life Skills";

export type BeatKind =
  | "visual_hook"    // make logo, poster, avatar, prototype mock
  | "make_something" // create asset: menu, budget sheet, storyboard, map, plan
  | "investigate"    // research, data, measure, analyze
  | "practice"       // quiz/flash/game
  | "apply"          // case/task with constraints, table, budget
  | "reflect"        // journal, voice note, exit ticket
  | "present"        // short share-out, rubric-aligned
  | "simulate";      // mini-sim/manager loop

export type BeatBlueprint = {
  id: string;               // stable within pack
  kind: BeatKind;
  title: string;            // student-facing
  minutes: Partial<Record<GradeBand, number>>; // auto-scaled if lesson longer
  // tags feed the interest-engine + subject mixer
  tags: string[];
  // "props" are concrete items/places; renderer/AI must reference 2+
  props: string[];
  // subject hook (explicit standard alignment happens in AI glue)
  subjectBias?: CanonicalSubject;
  // optional: embed a registered microgame
  gameId?: string;
  gameParams?: Record<string, any>;
};

export type UniversePack = {
  id: string; // slug
  title: string;
  category: UniverseCategory;
  subjectHint: CanonicalSubject;        // main lens
  crossSubjects: CanonicalSubject[];    // helpful crossover subjects
  tags: string[];
  imagePrompt: string;                  // for your generator
  // per-grade "beats" (we'll scaffold defaults and the AI glue will enrich)
  beats: Record<GradeBand, BeatBlueprint[]>;
};