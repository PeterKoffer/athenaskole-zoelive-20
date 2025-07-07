
// Global Question Uniqueness Service

export interface QuestionMetadata {
  subject?: string;
  skillArea?: string;
  difficultyLevel?: number;
  gradeLevel?: number;
}

export interface UniqueQuestion {
  id: string;
  userId: string;
  questionData: any;
  timestamp: number;
  content?: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
  metadata?: QuestionMetadata;
}

export class GlobalQuestionUniquenessService {
  private questionHistory: Map<string, Set<string>> = new Map();

  getUserQuestionHistory(userId: string): string[] {
    const userHistory = this.questionHistory.get(userId);
    return userHistory ? Array.from(userHistory) : [];
  }

  generateUniqueQuestion(userId: string, questionData: any): string {
    const questionId = `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    if (!this.questionHistory.has(userId)) {
      this.questionHistory.set(userId, new Set());
    }
    
    this.questionHistory.get(userId)!.add(questionId);
    return questionId;
  }

  generateUniqueQuestionId(userId: string): string {
    return this.generateUniqueQuestion(userId, {});
  }

  hasUserSeenQuestion(userId: string, questionId: string): boolean {
    const userHistory = this.questionHistory.get(userId);
    return userHistory ? userHistory.has(questionId) : false;
  }

  isQuestionUnique(userId: string, questionId: string): boolean {
    return !this.hasUserSeenQuestion(userId, questionId);
  }

  addQuestionToHistory(userId: string, questionId: string): void {
    if (!this.questionHistory.has(userId)) {
      this.questionHistory.set(userId, new Set());
    }
    this.questionHistory.get(userId)!.add(questionId);
  }

  trackQuestionUsage(userId: string, questionId: string): void {
    this.addQuestionToHistory(userId, questionId);
  }
}

export const globalQuestionUniquenessService = new GlobalQuestionUniquenessService();
