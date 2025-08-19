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

export function gradeToBand(grade?: number): 'K-2'|'3-5'|'6-8'|'9-10'|'11-12' {
  if (grade == null) return '6-8';
  if (grade <= 2) return 'K-2';
  if (grade <= 5) return '3-5';
  if (grade <= 8) return '6-8';
  if (grade <= 10) return '9-10';
  return '11-12';
}