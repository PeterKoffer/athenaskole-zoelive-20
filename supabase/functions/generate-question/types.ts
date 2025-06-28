
export interface QuestionGenerationRequest {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  userId: string;
  questionIndex?: number;
  promptVariation?: string;
  specificContext?: string;
  gradeLevel?: number;
  
  // Enhanced educational parameters
  teacherRequirements?: {
    focusAreas: string[];
    avoidTopics: string[];
    preferredQuestionTypes: string[];
    difficultyPreference: 'easier' | 'standard' | 'challenging';
    pedagogicalNotes?: string;
  };
  
  schoolStandards?: {
    curriculum: 'common_core' | 'state_standards' | 'international' | 'custom';
    assessmentStyle: 'traditional' | 'performance_based' | 'formative';
    learningGoals: string[];
    mandatoryTopics: string[];
    districtRequirements?: string[];
  };
  
  studentAdaptation?: {
    learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
    previousPerformance: {
      accuracy: number;
      averageTime: number;
      strugglingConcepts: string[];
      masteredConcepts: string[];
      recentTrends?: 'improving' | 'declining' | 'stable';
    };
    engagementLevel: 'low' | 'medium' | 'high';
    preferredContexts: string[];
    specialNeeds?: string[];
    languageSupport?: 'english' | 'bilingual' | 'esl';
  };
}

export interface GeneratedQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  educationalNotes?: {
    addressedStandards: string[];
    teacherFocus: string[];
    studentAdaptations: string[];
    gradeAppropriate: boolean;
    difficultyJustification?: string;
  };
}

export interface QuestionValidationResult {
  isValid: boolean;
  correctedIndex?: number;
  error?: string;
  warningMessages?: string[];
}
