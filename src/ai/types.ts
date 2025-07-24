export type LessonRequest = {
  mode: "daily" | "training";
  subject: string;
  gradeLevel: number;
  curriculum: string;
  studentProfile?: {
    ability: string;
    learningStyle?: string;
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