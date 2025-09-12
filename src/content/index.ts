// src/content/index.ts
export type LessonParams = {
  subject: string;
  grade: number | string;
  curriculum?: string | null;
  ability?: "remedial" | "standard" | "advanced" | string;
  learningStyle?: string;
  interests?: string[] | string | null;
  schoolPhilosophy?: string | null;
  teacherWeights?: Record<string, number> | null;
  lessonDurationMins?: number | null;
  calendarKeywords?: string[] | null;
  calendarDurationDays?: number | null;
};

export function normalizeGrade(input: number | string): number {
  if (typeof input === "number" && Number.isFinite(input)) return input;
  const m = String(input ?? "").match(/\d+/);
  return m ? Math.max(0, parseInt(m[0], 10)) : 0;
}

export function buildContentRequest(params: LessonParams) {
  const grade = normalizeGrade(params.grade);
  const ability = params.ability ?? "standard";
  const learningStyle = params.learningStyle ?? "mixed";
  const interestsArr = Array.isArray(params.interests)
    ? params.interests
    : params.interests
    ? [params.interests]
    : [];

  return {
    subject: params.subject,
    grade,
    curriculum: params.curriculum ?? null,
    ability,
    learningStyle,
    interests: interestsArr,
    context: {
      schoolPhilosophy: params.schoolPhilosophy ?? null,
      teacherWeights: params.teacherWeights ?? null,
      lessonDurationMins: params.lessonDurationMins ?? 45,
      calendar: {
        keywords: params.calendarKeywords ?? [],
        durationDays: params.calendarDurationDays ?? 1,
      },
    },
  };
}

export default { buildContentRequest, normalizeGrade };
