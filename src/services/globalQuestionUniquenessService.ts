
export interface UniqueQuestion {
  id: string;
  content: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
  metadata: {
    subject: string;
    skillArea: string;
    difficultyLevel: number;
    gradeLevel?: number;
    timestamp: number;
    userId: string;
    sessionId: string;
    teachingPerspective?: any;
    gradeStandards?: string[];
  };
}

class GlobalQuestionUniquenessService {
  private questionHistory: Map<string, Set<string>> = new Map();
  private questionDatabase: Map<string, UniqueQuestion> = new Map();
  private sessionTracker: Map<string, string[]> = new Map();

  /**
   * Generate a unique question ID
   */
  generateUniqueQuestionId(userId: string, subject: string, skillArea: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `q_${userId.substring(0, 8)}_${subject}_${skillArea}_${timestamp}_${random}`;
  }

  /**
   * Track question usage to prevent duplicates
   */
  async trackQuestionUsage(question: UniqueQuestion): Promise<void> {
    const userKey = `${question.metadata.userId}_${question.metadata.subject}`;
    
    if (!this.questionHistory.has(userKey)) {
      this.questionHistory.set(userKey, new Set());
    }
    
    const userQuestions = this.questionHistory.get(userKey)!;
    userQuestions.add(question.content.question);
    
    // Store full question data
    this.questionDatabase.set(question.id, question);
    
    // Track by session
    if (!this.sessionTracker.has(question.metadata.sessionId)) {
      this.sessionTracker.set(question.metadata.sessionId, []);
    }
    this.sessionTracker.get(question.metadata.sessionId)!.push(question.id);
    
    console.log(`📊 Tracked question usage: ${userQuestions.size} total questions for user`);
  }

  /**
   * Get user's question history
   */
  getUserQuestionHistory(userId: string, subject: string, limit: number = 50): string[] {
    const userKey = `${userId}_${subject}`;
    const questions = this.questionHistory.get(userKey);
    
    if (!questions) return [];
    
    return Array.from(questions).slice(-limit);
  }

  /**
   * Check if question is unique for user
   */
  isQuestionUnique(userId: string, subject: string, questionText: string): boolean {
    const userKey = `${userId}_${subject}`;
    const userQuestions = this.questionHistory.get(userKey);
    
    if (!userQuestions) return true;
    
    return !userQuestions.has(questionText);
  }

  /**
   * Get session statistics
   */
  getSessionStats(sessionId: string) {
    const sessionQuestions = this.sessionTracker.get(sessionId) || [];
    return {
      totalQuestions: sessionQuestions.length,
      questionIds: sessionQuestions
    };
  }

  /**
   * Clear old data to prevent memory buildup
   */
  cleanup(olderThanHours: number = 24): void {
    const cutoffTime = Date.now() - (olderThanHours * 60 * 60 * 1000);
    
    for (const [questionId, question] of this.questionDatabase.entries()) {
      if (question.metadata.timestamp < cutoffTime) {
        this.questionDatabase.delete(questionId);
      }
    }
    
    console.log(`🧹 Cleaned up old question data older than ${olderThanHours} hours`);
  }
}

export const globalQuestionUniquenessService = new GlobalQuestionUniquenessService();
