// Strict parameter validation to prevent poor content generation
export interface LessonParams {
  subject?: string;
  gradeLevel?: string;
  curriculum?: string;
  schoolLeaderPerspective?: string;
  teacherSubjectWeights?: any;
  lessonDuration?: number;
  calendarKeywords?: string[];
  calendarDuration?: number;
  studentAbilities?: any;
  learningStyle?: string;
  interests?: string[];
  [key: string]: any;
}

const REQUIRED_PARAMS = [
  "subject",
  "gradeLevel", 
  "curriculum",
  "schoolLeaderPerspective",
  "teacherSubjectWeights",
  "lessonDuration",
  "calendarKeywords",
  "calendarDuration", 
  "studentAbilities",
  "learningStyle",
  "interests"
];

export function hasAllRequiredParams(params: LessonParams): boolean {
  return REQUIRED_PARAMS.every(key => {
    const value = params[key];
    return value !== undefined && value !== null && value !== '';
  });
}

export function validateRequiredParams(params: LessonParams): { valid: boolean; missing: string[] } {
  const missing = REQUIRED_PARAMS.filter(key => {
    const value = params[key];
    return value === undefined || value === null || value === '';
  });
  
  return {
    valid: missing.length === 0,
    missing
  };
}

export function shouldUseCatalogFallback(params: LessonParams): boolean {
  return !hasAllRequiredParams(params);
}