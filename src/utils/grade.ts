export function parseExactGrade(g?: string | number) {
  const n = Number(String(g ?? '').match(/\d+/)?.[0]);
  return Number.isFinite(n) ? Math.min(12, Math.max(1, n)) : undefined;
}

export function getLearnerGrade(userMeta?: { grade_level?: string | number; age?: number }) {
  return (
    parseExactGrade(userMeta?.grade_level) ??
    parseExactGrade((userMeta?.age ?? 12) - 6) ??
    6
  );
}