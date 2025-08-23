// Unified lesson context builder used by the Planner → Activity pipeline
import { topTags } from '@/services/interestProfile';

export type LessonContext = {
  subject: string;
  gradeLevel: string | number;
  curriculum: {
    framework: string;
    standards: string[];
    mustIncludeConcepts: string[];
  };
  schoolPerspective: {
    teachingApproach: string;
    tone: string;
    constraints: string[];
  };
  time: {
    lessonDurationMinutes: number;
    calendarKeywords: string[];
    calendarSpanDays: number;
  };
  teacherPreferences: {
    subjectWeights: Record<string, number>;
    assessmentPreference: string;
    mediaPreference: string;
    allowShortClips: boolean;
  };
  studentGroup: {
    learningStyles: string[];
    abilityProfile: string;
    readability: string;
    interests: string[];
    language: string;
    accommodations: string[];
  };
  adaptivity: {
    difficultyPolicy: string;
    hintPolicy: string;
    fastFinishPolicy: string;
  };
};

// Lightweight mapper from app data → context. Callers can override any field.
export function buildLessonContext(params: {
  subject: string;
  gradeLevel: number;
  activeKeywords?: string[];
  learnerProfile?: any;
  studentProgress?: any;
  lessonDurationMinutes?: number;
}): LessonContext {
  const { subject, gradeLevel, activeKeywords = [], learnerProfile, studentProgress, lessonDurationMinutes } = params;

  const ability = (studentProgress?.accuracy_rate ?? 0.65) >= 0.85
    ? 'above'
    : (studentProgress?.accuracy_rate ?? 0.65) >= 0.6
      ? 'mixed_on_level'
      : 'below';

  return {
    subject,
    gradeLevel,
    curriculum: {
      framework: 'K-12 generic',
      standards: [],
      mustIncludeConcepts: [],
    },
    schoolPerspective: {
      teachingApproach: 'inquiry-based, project-centric, SEL-positive',
      tone: 'hopeful, collaborative, hands-on',
      constraints: ['no violent themes', 'age-appropriate vocabulary'],
    },
    time: {
      lessonDurationMinutes: Math.max(30, Math.min(90, lessonDurationMinutes ?? 45)),
      calendarKeywords: activeKeywords,
      calendarSpanDays: 1,
    },
    teacherPreferences: {
      subjectWeights: { [subject]: 0.5 },
      assessmentPreference: 'light formative',
      mediaPreference: 'images',
      allowShortClips: true,
    },
    studentGroup: {
      learningStyles: [
        learnerProfile?.learning_style_preference || 'mixed',
      ].filter(Boolean),
      abilityProfile: ability,
      readability: 'US Grade 4–5',
      interests: [...(learnerProfile?.interests || []), ...topTags(3)],
      language: learnerProfile?.language || 'en',
      accommodations: ['short instructions', 'optional read-aloud'],
    },
    adaptivity: {
      difficultyPolicy: 'adjust_per_activity',
      hintPolicy: 'always_offer_first_hint',
      fastFinishPolicy: 'extend_with_bonus_activity',
    },
  };
}
