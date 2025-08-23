// src/services/universe/lessonBuilder.ts
import { choosePackForToday } from "@/services/universe/offlineScheduler";
import { buildLessonFromPack } from "@/services/universe/aiGlue";
import { GradeBand, CanonicalSubject } from "@/content/types";

// Example usage:
export async function getTodaysUniverseLesson(opts: {
  userId: string;
  schoolId: string;
  classId?: string;
  gradeBand: GradeBand;
  minutesTotal: number; // from teacher dashboard (default 150 = 2.5h)
  subjectOfDay: CanonicalSubject; // your v3 prompt chooser or weights
  interests: string[];
  standards?: string[];
  teachingPerspective?: string;
  learningStyle?: "visual"|"auditory"|"reading_writing"|"kinesthetic";
  ability?: { readingLevel?: "below"|"on"|"above"; numeracyLevel?: "below"|"on"|"above"; scaffolding?: boolean; stretchGoals?: boolean };
  calendarKeywords?: string[];
}) {
  const { pack } = choosePackForToday({
    userId: opts.userId,
    schoolId: opts.schoolId,
    classId: opts.classId,
    preferPrime: true,
    avoidRepeatsDays: 30,
  });

  const activities = await buildLessonFromPack(pack, {
    gradeBand: opts.gradeBand,
    subjectOfDay: opts.subjectOfDay,
    minutesTotal: opts.minutesTotal,
    interests: opts.interests,
    teachingPerspective: opts.teachingPerspective,
    learningStyle: opts.learningStyle,
    ability: opts.ability,
    calendarKeywords: opts.calendarKeywords,
    standards: opts.standards,
  });

  return {
    pack,                                // use pack.title, imagePrompt in your hero
    activities,                          // render in your EnhancedActivityRenderer
  };
}