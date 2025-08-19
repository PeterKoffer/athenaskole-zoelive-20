import { resolveLearnerGrade, gradeToBand } from '@/lib/grade';

export function learnerGrade(profile?: { grade_level?: string | number; age?: number }) {
  return resolveLearnerGrade(profile?.grade_level, profile?.age); // → number (e.g., 5)
}

export function learnerBand(profile?: { grade_level?: string | number; age?: number }) {
  return gradeToBand(learnerGrade(profile)); // → '3-5'
}

export function learnerBadge(profile?: { grade_level?: string | number; age?: number }, mode: 'exact'|'band' = 'exact') {
  return mode === 'exact' ? `Grade ${learnerGrade(profile)}` : learnerBand(profile);
}

export function learnerStep(profile?: { grade_level?: string | number; age?: number }) {
  const g = resolveLearnerGrade(profile?.grade_level, profile?.age);
  // clamp 1..12, fallback to 7 if unknown
  return Math.min(12, Math.max(1, Number.isFinite(g) ? g! : 7));
}

export function learnerExactBadge(profile?: { grade_level?: string | number; age?: number }, locale: 'en'|'da'='en') {
  const g = learnerStep(profile);
  return locale === 'da' ? `${g}. klasse` : `Grade ${g}`;
}