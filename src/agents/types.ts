export interface AgentInputs {
  subject: string;
  grade: number; // fx 1-12
  curriculum?: string;
  philosophy?: string; // school leader philosophy
  lessonDuration?: number; // minutter
  teacherWeights?: Record<string, number>;
  calendarKeywords?: string[];
  calendarDuration?: string; // fx "1 uge"
  ability?: string; // "low" | "medium" | "high" | custom
  learningStyle?: string;
  interests?: string[];
  sessionId?: string;
}
