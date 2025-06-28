
export interface EducationalContext {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  gradeLevel: number;
  teacherRequirements: {
    focusAreas: string[];
    avoidTopics: string[];
    preferredQuestionTypes: string[];
    difficultyPreference: 'easier' | 'standard' | 'challenging';
  };
  schoolStandards: {
    curriculum: 'common_core' | 'state_standards' | 'international' | 'custom';
    assessmentStyle: 'traditional' | 'performance_based' | 'formative';
    learningGoals: string[];
    mandatoryTopics: string[];
  };
  studentAdaptation: {
    learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
    previousPerformance: {
      accuracy: number;
      averageTime: number;
      strugglingConcepts: string[];
      masteredConcepts: string[];
    };
    engagementLevel: 'low' | 'medium' | 'high';
    preferredContexts: string[];
  };
}

export interface GeneratedQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  isAiGenerated: boolean;
  isPersonalized: boolean;
  source: string;
  educationalNotes?: any;
}
