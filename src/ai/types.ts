import type { TeachingPerspective } from "./prompts/dailyUniverse.v3";

export type LessonRequest = {
  mode: "daily" | "training";
  subject: string;
  gradeLevel: number;
  curriculum: string;
  studentProfile?: {
    ability: string;
    learningStyle?: string;
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