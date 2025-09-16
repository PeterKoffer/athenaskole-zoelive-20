export interface Universe {
  id: string;
  title: string;
  theme: string;
  description?: string;
  activities?: Activity[];
}

export interface Activity {
  id: string;
  type: string;
  title: string;
  content: any;
  estimatedMinutes?: number;
}

export interface Scenario {
  id: string;
  subject: string;
  title: string;
  description: string;
  gradeLevel: number;
}

export interface LearningContext {
  subject: string;
  grade: number;
  curriculum: string;
  ability?: string;
  learningStyle?: string;
  interests?: string[];
}