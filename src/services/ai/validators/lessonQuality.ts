// @ts-nocheck

// src/services/ai/validators/lessonQuality.ts
// Mini-validator to filter, ensure variety, and time-normalize activities

export function validateAndNormalize(
  activities: any[],
  targetMin = 150
): any[] {
  if (!Array.isArray(activities)) return [];

  // 1) Remove empty/invalid activities
  const valid = activities.filter((a) => {
    const hasQuestion = !!a?.question;
    const hasAssessment =
      (Array.isArray(a?.options) && a.options.length >= 3 && a.correctIndex !== undefined) ||
      (Array.isArray(a?.rubric) && a.rubric.length >= 2);
    const hasScaffolding = Array.isArray(a?.hints) && a.hints.length >= 1;
    return hasQuestion && hasAssessment && hasScaffolding;
  });

  // 2) Variety warning
  const kinds = new Set(valid.map((a) => a?.kind));
  if (kinds.size < Math.min(3, valid.length)) {
    console.warn("[NELIE] Low variety in activities", { kinds: Array.from(kinds) });
  }

  // 3) Normalize total time to targetMin ±5
  const sum = valid.reduce((acc, a) => acc + (a.estimatedTimeMin || 0), 0);
  const diff = targetMin - sum;
  if (Math.abs(diff) > 5 && valid.length > 0) {
    const per = Math.trunc(diff / valid.length);
    for (const a of valid) {
      const now = Math.max(3, Number(a.estimatedTimeMin || 0) + per);
      a.estimatedTimeMin = now;
    }
  }

  return valid;
}
