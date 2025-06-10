
export interface SessionQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: number;
  topic: string;
  standard?: {
    code: string;
    title: string;
  };
}

export interface SessionAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent: number;
  timestamp: string;
}

export interface SessionProgress {
  questionsAnswered: number;
  correctAnswers: number;
  accuracy: number;
  totalTimeSpent: number;
  averageTimePerQuestion: number;
}

export interface SessionState {
  sessionId: string;
  isActive: boolean;
  isComplete: boolean;
  currentQuestionIndex: number;
  questions: SessionQuestion[];
  answers: SessionAnswer[];
  progress: SessionProgress;
  startTime: string;
  endTime?: string;
}

export interface LearningObjective {
  id: string;
  title: string;
  description: string;
  difficulty_level: number;
  subject: string;
  skillArea: string;
}
