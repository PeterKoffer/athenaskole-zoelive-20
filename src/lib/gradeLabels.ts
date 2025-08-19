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