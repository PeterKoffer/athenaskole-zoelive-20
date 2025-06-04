
export interface CurriculumStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isLocked: boolean;
  estimatedTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  curriculums: Curriculum[];
}

export interface Curriculum {
  id: string;
  stepId: string;
  title: string;
  description: string;
  subject: string;
  content: string;
  duration: number;
  isCompleted: boolean;
  order: number;
}

export interface UserStepProgress {
  id: string;
  userId: string;
  stepId: string;
  isCompleted: boolean;
  completedAt?: string;
  timeSpent: number;
  curriculumProgress: Record<string, boolean>;
}
