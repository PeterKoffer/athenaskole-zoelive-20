import type { TeachingPerspective } from "./prompts/dailyUniverse.v3";

export type LessonRequest = {
  mode: "daily" | "training";
  subject: string;
  gradeLevel: number;
  curriculum: string;
  studentProfile?: {
    ability: string;
    learningStyle?: string;
    interests?: string[]; // Added for student interests parameter
    // Educational localization fields
    countryCode?: string;
    locale?: string;
    currencyCode?: string;
    measurement?: string;
    curriculumCode?: string;
    timezone?: string;
  };
  teacherPreferences?: {
    subjectWeights?: Record<string, number>;
    lessonDurations?: Record<string, number>; // hours per class
    teachingPerspective?: TeachingPerspective;
  };
  // Calendar context for lessons
  calendarContext?: {
    keywords?: string[];
    duration?: string; // e.g., "daily", "weekly", "unit"
    timeframe?: string;
  };
  // Optional class context
  classId?: string;
};

export type Activity = {
  type: string;
  timebox: number;
  instructions: string;
};

export type LessonResponse = {
  title: string;
  durationMinutes?: number;
  objectives: string[];
  activities: Activity[];
  materials?: string[];
  reflectionPrompts?: string[];
  metadata?: { promptVersion: number };
};