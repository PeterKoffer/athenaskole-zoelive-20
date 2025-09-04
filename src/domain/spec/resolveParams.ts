import type { AdaptationParams } from './adaptation';
import { AdaptationParamsSchema } from './adaptation';
import type { SubjectId } from '../subjects';

type Ctx = {
  userId: string;
  now: Date;
  route: { mode: 'daily-program'|'training-ground'; subjectId?: SubjectId };
  fetchProfile: (userId: string) => Promise<{ grade: AdaptationParams['grade']; interests?: string[] }>;
  fetchTeacherPrefs: (userId: string) => Promise<{
    subjectWeights: Record<string, number>;
    lessonDurations: Record<string, number>;
    learningStyle?: AdaptationParams['learningStyle'];
  }>;
  fetchSchoolSettings: () => Promise<{ schoolPerspective: AdaptationParams['schoolPerspective']; curriculumId?: string }>;
  fetchCalendarContext: (userId: string, at: Date) => Promise<{ keywords: string[]; windowMinutes?: number }>;
};

export async function resolveAdaptationParams(ctx: Ctx): Promise<AdaptationParams> {
  const [profile, teacher, school, calendar] = await Promise.all([
    ctx.fetchProfile(ctx.userId),
    ctx.fetchTeacherPrefs(ctx.userId),
    ctx.fetchSchoolSettings(),
    ctx.fetchCalendarContext(ctx.userId, ctx.now),
  ]);

  const subjectId: SubjectId = ctx.route.subjectId ?? 'native-language';

  const candidate = {
    mode: ctx.route.mode,
    locale: 'en-US',
    subjectId,
    grade: profile.grade,
    curriculumId: school.curriculumId,
    schoolPerspective: school.schoolPerspective,
    lessonDurations: teacher.lessonDurations ?? {},
    subjectWeights: teacher.subjectWeights ?? {},
    calendar,
    abilities: undefined,
    learningStyle: teacher.learningStyle,
    interests: profile.interests ?? [],
    featureFlags: [],
  };

  return AdaptationParamsSchema.parse(candidate);
}
