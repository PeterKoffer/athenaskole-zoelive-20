
// Type definitions for learner profile

export interface LearnerPreferences {
  preferredSubjects: string[];
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  difficultyPreference: number;
}

export interface KnowledgeComponentMastery {
  kcId: string;
  masteryLevel: number;
  practiceCount: number;
  lastAssessed: string;
}

export interface LearnerProfile {
  userId: string;
  preferences: LearnerPreferences;
  createdAt: string;
  updatedAt: string;
  kcMastery?: KnowledgeComponentMastery[];
}
