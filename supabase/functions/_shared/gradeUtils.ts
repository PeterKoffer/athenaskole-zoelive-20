// Deno-compatible grade utilities

export function parseGrade(input?: string | number | null): number | undefined {
  if (input == null) return undefined;
  if (typeof input === 'number' && Number.isFinite(input)) return input;
  const m = String(input).match(/\d+/); // pulls 5 out of "5a", "5. klasse", etc.
  if (!m) return undefined;
  const n = parseInt(m[0], 10);
  return n >= 0 && n <= 13 ? n : undefined;
}

export function ageToUsGrade(age?: number): number | undefined {
  if (!Number.isFinite(age as number)) return undefined;
  // simple mapping: 6→K/1, 7→1/2 … 11→5, 12→6 …
  return Math.max(0, Math.min(12, (age as number) - 6));
}

export function resolveLearnerGrade(gradeRaw?: string|number|null, age?: number) {
  const g = parseGrade(gradeRaw);
  return g ?? ageToUsGrade(age) ?? 6; // final fallback = 6
}