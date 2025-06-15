
/**
 * Provides global question uniqueness and recap logic.
 */

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
    timestamp: number;
    userId: string;
    sessionId: string;
  };
}

interface QuestionHistory {
  questionText: string;
  questionId: string;
  timestamp: number;
  userId: string;
  subject: string;
  skillArea: string;
}

class GlobalQuestionUniquenessService {
  private usedQuestions = new Map<string, QuestionHistory>();
  private userQuestionCounts = new Map<string, number>();
  private sessionQuestions = new Map<string, Set<string>>();

  // Generate guaranteed unique question ID
  generateUniqueQuestionId(userId: string, subject: string, skillArea: string): string {
    const timestamp = Date.now();
    const userHash = this.hashString(userId).substring(0, 8);
    const subjectHash = this.hashString(subject).substring(0, 4);
    const skillHash = this.hashString(skillArea).substring(0, 4);
    const random = Math.random().toString(36).substring(2, 8);
    return `q_${timestamp}_${userHash}_${subjectHash}_${skillHash}_${random}`;
  }

  // Check if question text is unique for this user/subject combination
  async isQuestionUnique(
    questionText: string, 
    userId: string, 
    subject: string,
    sessionId?: string
  ): Promise<boolean> {
    const normalizedQuestion = this.normalizeQuestionText(questionText);
    const userKey = `${userId}_${subject}`;

    console.log('🔍 Checking question uniqueness:', {
      normalizedQuestion: normalizedQuestion.substring(0, 50) + '...',
      userKey,
      sessionId,
      totalTrackedQuestions: this.usedQuestions.size
    });

    for (const [questionId, history] of this.usedQuestions.entries()) {
      if (history.userId === userId && history.subject === subject) {
        const historicalNormalized = this.normalizeQuestionText(history.questionText);
        if (this.calculateSimilarity(normalizedQuestion, historicalNormalized) > 0.8) {
          console.log('❌ Question too similar to previous question:', questionId);
          return false;
        }
      }
    }

    if (sessionId) {
      const sessionQuestions = this.sessionQuestions.get(sessionId) || new Set();
      const questionHash = this.hashString(normalizedQuestion);
      if (sessionQuestions.has(questionHash)) {
        console.log('❌ Question already used in this session');
        return false;
      }
    }

    console.log('✅ Question is unique');
    return true;
  }

  // Track a question as used
  async trackQuestionUsage(question: UniqueQuestion): Promise<void> {
    const questionHistory: QuestionHistory = {
      questionText: question.content.question,
      questionId: question.id,
      timestamp: question.metadata.timestamp,
      userId: question.metadata.userId,
      subject: question.metadata.subject,
      skillArea: question.metadata.skillArea
    };

    this.usedQuestions.set(question.id, questionHistory);

    // Track user question count
    const userCount = this.userQuestionCounts.get(question.metadata.userId) || 0;
    this.userQuestionCounts.set(question.metadata.userId, userCount + 1);

    // Track session questions
    if (question.metadata.sessionId) {
      const sessionQuestions = this.sessionQuestions.get(question.metadata.sessionId) || new Set();
      const questionHash = this.hashString(question.content.question);
      sessionQuestions.add(questionHash);
      this.sessionQuestions.set(question.metadata.sessionId, sessionQuestions);
    }

    console.log('📊 Question tracked:', {
      questionId: question.id,
      userId: question.metadata.userId,
      totalQuestionsForUser: this.userQuestionCounts.get(question.metadata.userId),
      totalGlobalQuestions: this.usedQuestions.size
    });
  }

  // Get usage statistics
  getUsageStats() {
    return {
      totalQuestionsTracked: this.usedQuestions.size,
      uniqueUsers: this.userQuestionCounts.size,
      activeSessions: this.sessionQuestions.size,
      averageQuestionsPerUser: this.usedQuestions.size / Math.max(this.userQuestionCounts.size, 1)
    };
  }

  // Get user's previous questions for a subject
  getUserQuestionHistory(userId: string, subject: string, limit: number = 10): string[] {
    const userQuestions: string[] = [];
    for (const history of this.usedQuestions.values()) {
      if (history.userId === userId && history.subject === subject) {
        userQuestions.push(history.questionText);
      }
    }
    return userQuestions
      .sort((a, b) => this.usedQuestions.get(this.findQuestionId(a))?.timestamp || 0 - 
                      this.usedQuestions.get(this.findQuestionId(b))?.timestamp || 0)
      .slice(-limit);
  }

  // -- RECAP SUPPORT METHODS --

  /**
   * Returns whether a recap can be generated (if the user has at least 3 previous questions for the subject/skillArea).
   */
  canGenerateRecap(userId: string, subject: string, skillArea: string, min=3): boolean {
    let count = 0;
    for (const history of this.usedQuestions.values()) {
      if (history.userId === userId && history.subject === subject && history.skillArea === skillArea) {
        count++;
        if (count >= min) return true;
      }
    }
    return false;
  }

  /**
   * Returns up to `limit` questions suitable for recap for the subject/skillArea.
   */
  getQuestionsForRecap(
    userId: string, 
    subject: string, 
    skillArea: string, 
    limit: number = 1
  ): Array<{ question: string; options?: string[]; correct?: number; explanation?: string }> {
    const recapPool: QuestionHistory[] = [];
    for (const history of this.usedQuestions.values()) {
      if (history.userId === userId && history.subject === subject && history.skillArea === skillArea) {
        recapPool.push(history);
      }
    }
    recapPool.sort((a, b) => b.timestamp - a.timestamp);
    return recapPool.slice(0, limit).map(h => ({ question: h.questionText }));
  }

  // Clear old questions (memory management)
  clearOldQuestions(maxAge: number = 24 * 60 * 60 * 1000): void {
    const cutoff = Date.now() - maxAge;
    let cleared = 0;
    for (const [questionId, history] of this.usedQuestions.entries()) {
      if (history.timestamp < cutoff) {
        this.usedQuestions.delete(questionId);
        cleared++;
      }
    }
    console.log(`🧹 Cleared ${cleared} old questions (older than ${maxAge}ms)`);
  }

  // Private helper methods
  private normalizeQuestionText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private calculateSimilarity(text1: string, text2: string): number {
    const words1 = text1.split(' ');
    const words2 = text2.split(' ');
    const allWords = new Set([...words1, ...words2]);
    let matches = 0;
    for (const word of allWords) {
      if (words1.includes(word) && words2.includes(word)) {
        matches++;
      }
    }
    return matches / allWords.size;
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  private findQuestionId(questionText: string): string {
    for (const [questionId, history] of this.usedQuestions.entries()) {
      if (history.questionText === questionText) {
        return questionId;
      }
    }
    return '';
  }
}

// Export singleton instance
export const globalQuestionUniquenessService = new GlobalQuestionUniquenessService();

