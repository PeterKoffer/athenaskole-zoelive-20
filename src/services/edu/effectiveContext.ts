// src/services/edu/effectiveContext.ts
import { resolveEduContext, EduContext } from "./locale";

export type PartialEdu = Partial<
  Pick<
    EduContext,
    | "countryCode"
    | "locale"
    | "language"
    | "currencyCode"
    | "measurement"
    | "curriculumCode"
    | "timezone"
  >
>;

export type EffectiveOpts = {
  // From DB (student's own profile):
  studentProfile?: PartialEdu;

  // Teacher-level picks (from Teacher Dashboard):
  teacherOverrides?: PartialEdu & { strictTeacherWins?: boolean };

  // Optional: class/course-specific overrides set by the teacher for this class:
  classOverrides?: PartialEdu;

  // If provided, we'll cache in-memory by this key to avoid repeated merges in one session
  cacheKey?: string;
};

const memCache = new Map<string, EduContext>();

function mergeDeep<T extends object>(base: T, patch?: PartialEdu): T {
  if (!patch) return base;
  return { ...base, ...Object.fromEntries(Object.entries(patch).filter(([,v]) => v !== undefined)) } as T;
}

/**
 * Precedence:
 *   1) classOverrides (most specific)
 *   2) teacherOverrides
 *   3) studentProfile
 *   4) country preset fallback (inside resolveEduContext)
 * If teacherOverrides.strictTeacherWins is true, any missing field falls back to teacher's choices
 * before student profile or preset.
 */
export function getEffectiveEduContext(opts: EffectiveOpts): EduContext {
  const ck = opts.cacheKey ?? "";
  if (ck && memCache.has(ck)) return memCache.get(ck)!;

  // Start with student => preset via resolver
  const base = resolveEduContext(opts.studentProfile ?? {});

  // If strictTeacherWins, pre-fill from teacher BEFORE class merge,
  // so teacher provides the "default" foundation
  const teacherFirst = opts.teacherOverrides?.strictTeacherWins
    ? resolveEduContext(mergeDeep(base, opts.teacherOverrides))
    : base;

  // Merge non-strict teacher overrides (overlay on top of student/preset)
  const withTeacher = !opts.teacherOverrides?.strictTeacherWins
    ? resolveEduContext(mergeDeep(teacherFirst, opts.teacherOverrides))
    : teacherFirst;

  // Class overrides (most specific)
  const effective = resolveEduContext(mergeDeep(withTeacher, opts.classOverrides));

  if (ck) memCache.set(ck, effective);
  return effective;
}