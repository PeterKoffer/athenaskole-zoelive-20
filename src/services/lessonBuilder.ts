// src/services/lessonBuilder.ts
import type { GradeBand, CanonicalSubject } from "@/content/types";
import { choosePackForToday } from "@/services/universe/offlineScheduler";
import { buildLessonFromPack } from "@/services/universe/aiGlue";
import { saveUniverseArc } from "@/services/universe/arcs";

export async function getTodaysUniverseLesson(opts: {
  userId: string;
  schoolId: string;
  classId: string;
  gradeBand: GradeBand;
  minutesTotal: number;
  subjectOfDay: CanonicalSubject;
  interests: string[];
  standards?: string[];
  teachingPerspective?: string;
  learningStyle?: "visual"|"auditory"|"reading_writing"|"kinesthetic";
  ability?: { readingLevel?: "below"|"on"|"above"; numeracyLevel?: "below"|"on"|"above"; scaffolding?: boolean; stretchGoals?: boolean };
  calendarKeywords?: string[];
}) {
  const { date, pack } = choosePackForToday({
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

  // persist arc (state can include minute plan, pack + shallow metrics)
  await saveUniverseArc({
    user_id: opts.userId,
    class_id: opts.classId,
    pack_id: pack.id,
    date,
    state: {
      title: pack.title,
      minutesTotal: opts.minutesTotal,
      subjectOfDay: opts.subjectOfDay,
      gradeBand: opts.gradeBand,
      activities: activities.map((a: any) => ({ kind: a.kind, title: a.title, minutes: a.minutes })),
    },
  });

  return { date, pack, activities };
}