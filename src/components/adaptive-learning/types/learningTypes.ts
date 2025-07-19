
export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  subject: string;
  skillArea: string;
  points: number;
}

export interface UserAnswer {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
  hintsUsed: number;
}

export interface SessionProgress {
  completed: number;
  total: number;
  percentage: number;
}

export interface LearningSession {
  id: string;
  userId: string;
  subject: string;
  grade: string;
  startTime: Date;
  endTime?: Date;
  questions: Question[];
  answers: UserAnswer[];
  score: number;
  masteryLevel: number;
}
