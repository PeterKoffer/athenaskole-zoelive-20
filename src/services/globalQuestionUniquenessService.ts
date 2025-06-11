import { supabase } from '@/integrations/supabase/client';
import { Question } from '@/components/adaptive-learning/hooks/types';

export interface UniqueQuestion extends Question {
  id: string;
  createdAt: Date;
  userId: string;
  subject: string;
  skillArea: string;
  difficultyLevel: number;
}

export class GlobalQuestionUniquenessService {
  private static instance: GlobalQuestionUniquenessService;
  private globalUsedQuestions = new Map<string, UniqueQuestion>();
  private questionsByUser = new Map<string, Set<string>>();
  private questionsBySubject = new Map<string, Set<string>>();

  private constructor() {}

  static getInstance(): GlobalQuestionUniquenessService {
    if (!GlobalQuestionUniquenessService.instance) {
      GlobalQuestionUniquenessService.instance = new GlobalQuestionUniquenessService();
    }
    return GlobalQuestionUniquenessService.instance;
  }

  /**
   * Generate a guaranteed unique question ID
   */
  generateUniqueQuestionId(userId: string, subject: string, skillArea: string): string {
    const timestamp = Date.now();
    const randomComponent = Math.random().toString(36).substring(2, 15);
    const userHash = this.hashString(userId).substring(0, 8);
    const subjectHash = this.hashString(subject).substring(0, 4);
    const skillHash = this.hashString(skillArea).substring(0, 4);
    
    return `q_${timestamp}_${userHash}_${subjectHash}_${skillHash}_${randomComponent}`;
  }

  /**
   * Check if a question text is unique globally
   */
  async isQuestionUnique(questionText: string, userId: string, subject: string, skipPersistenceCheck = false, isRecap = false): Promise<boolean> {
    // Allow recap/review questions to repeat
    if (isRecap) {
      return true;
    }

    // Check local cache first
    const normalizedText = this.normalizeQuestionText(questionText);
    
    // Check in-memory cache
    for (const [id, question] of this.globalUsedQuestions) {
      if (this.normalizeQuestionText(question.question) === normalizedText) {
        return false;
      }
    }

    // Check database for persistence unless skipped
    if (!skipPersistenceCheck) {
      try {
        const { data: existingQuestions } = await supabase
          .from('user_question_history')
          .select('question_text')
          .eq('subject', subject)
          .order('asked_at', { ascending: false })
          .limit(200); // Check recent questions for efficiency

        if (existingQuestions) {
          for (const existing of existingQuestions) {
            if (this.normalizeQuestionText(existing.question_text) === normalizedText) {
              return false;
            }
          }
        }
      } catch (error) {
        console.warn('Could not check database for question uniqueness:', error);
        // Continue with in-memory check only
      }
    }

    return true;
  }

  /**
   * Track a question as used globally
   */
  trackUsedQuestion(question: UniqueQuestion): void {
    this.globalUsedQuestions.set(question.id, question);
    
    // Update user tracking
    if (!this.questionsByUser.has(question.userId)) {
      this.questionsByUser.set(question.userId, new Set());
    }
    this.questionsByUser.get(question.userId)!.add(question.id);

    // Update subject tracking
    const subjectKey = `${question.subject}-${question.skillArea}`;
    if (!this.questionsBySubject.has(subjectKey)) {
      this.questionsBySubject.set(subjectKey, new Set());
    }
    this.questionsBySubject.get(subjectKey)!.add(question.id);
  }

  /**
   * Get questions used by a specific user
   */
  getUserQuestions(userId: string): UniqueQuestion[] {
    const userQuestionIds = this.questionsByUser.get(userId) || new Set();
    return Array.from(userQuestionIds)
      .map(id => this.globalUsedQuestions.get(id))
      .filter((q): q is UniqueQuestion => q !== undefined);
  }

  /**
   * Get questions for a specific subject/skill area
   */
  getSubjectQuestions(subject: string, skillArea: string): UniqueQuestion[] {
    const subjectKey = `${subject}-${skillArea}`;
    const subjectQuestionIds = this.questionsBySubject.get(subjectKey) || new Set();
    return Array.from(subjectQuestionIds)
      .map(id => this.globalUsedQuestions.get(id))
      .filter((q): q is UniqueQuestion => q !== undefined);
  }

  /**
   * Get questions for recap/review purposes
   * Returns questions the user has answered correctly before
   */
  async getQuestionsForRecap(userId: string, subject: string, skillArea: string, limit = 10): Promise<UniqueQuestion[]> {
    try {
      // Get correctly answered questions from database
      const { data: correctQuestions } = await supabase
        .from('user_question_history')
        .select('question_text, concepts_covered, difficulty_level')
        .eq('user_id', userId)
        .eq('subject', subject)
        .eq('skill_area', skillArea)
        .eq('is_correct', true)
        .order('asked_at', { ascending: false })
        .limit(limit);

      if (!correctQuestions) return [];

      // Convert to UniqueQuestion format with recap flag
      return correctQuestions.map((q, index) => ({
        id: this.generateUniqueQuestionId(userId, subject, skillArea) + '_recap',
        question: q.question_text,
        options: [], // Would need to be populated from original question
        correct: 0, // Would need to be populated from original question  
        explanation: 'This is a recap question to reinforce your learning.',
        learningObjectives: [],
        estimatedTime: 30,
        conceptsCovered: Array.isArray(q.concepts_covered) ? q.concepts_covered : [skillArea],
        createdAt: new Date(),
        userId,
        subject,
        skillArea,
        difficultyLevel: q.difficulty_level,
        isRecap: true
      }));
    } catch (error) {
      console.warn('Could not fetch recap questions:', error);
      return [];
    }
  }

  /**
   * Check if a user has answered enough questions to warrant recap
   */
  async canGenerateRecap(userId: string, subject: string, skillArea: string, minQuestions = 5): Promise<boolean> {
    try {
      const { data, count } = await supabase
        .from('user_question_history')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('subject', subject)
        .eq('skill_area', skillArea)
        .eq('is_correct', true);

      return (count || 0) >= minQuestions;
    } catch (error) {
      console.warn('Could not check recap eligibility:', error);
      return false;
    }
  }
  async getUserQuestionTexts(userId: string, subject: string, skillArea: string, limit = 50): Promise<string[]> {
    // Get from local cache first
    const localQuestions = this.getUserQuestions(userId)
      .filter(q => q.subject === subject && q.skillArea === skillArea)
      .map(q => q.question)
      .slice(0, limit);

    // Also fetch from database for persistence
    try {
      const { data: dbQuestions } = await supabase
        .from('user_question_history')
        .select('question_text')
        .eq('user_id', userId)
        .eq('subject', subject)
        .eq('skill_area', skillArea)
        .order('asked_at', { ascending: false })
        .limit(limit);

      const dbTexts = dbQuestions?.map(q => q.question_text) || [];
      
      // Combine and deduplicate
      const allTexts = [...new Set([...localQuestions, ...dbTexts])];
      return allTexts.slice(0, limit);
    } catch (error) {
      console.warn('Could not fetch user questions from database:', error);
      return localQuestions;
    }
  }

  /**
   * Clear cache for memory management (keep recent questions)
   */
  clearOldQuestions(maxAge: number = 24 * 60 * 60 * 1000): void {
    const cutoffTime = Date.now() - maxAge;
    
    for (const [id, question] of this.globalUsedQuestions) {
      if (question.createdAt.getTime() < cutoffTime) {
        this.globalUsedQuestions.delete(id);
        
        // Clean up user tracking
        const userQuestions = this.questionsByUser.get(question.userId);
        if (userQuestions) {
          userQuestions.delete(id);
        }
        
        // Clean up subject tracking
        const subjectKey = `${question.subject}-${question.skillArea}`;
        const subjectQuestions = this.questionsBySubject.get(subjectKey);
        if (subjectQuestions) {
          subjectQuestions.delete(id);
        }
      }
    }
  }

  /**
   * Get statistics about question usage
   */
  getUsageStats(): {
    totalQuestions: number;
    questionsByUser: Record<string, number>;
    questionsBySubject: Record<string, number>;
  } {
    const userStats: Record<string, number> = {};
    for (const [userId, questions] of this.questionsByUser) {
      userStats[userId] = questions.size;
    }

    const subjectStats: Record<string, number> = {};
    for (const [subject, questions] of this.questionsBySubject) {
      subjectStats[subject] = questions.size;
    }

    return {
      totalQuestions: this.globalUsedQuestions.size,
      questionsByUser: userStats,
      questionsBySubject: subjectStats
    };
  }

  private normalizeQuestionText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
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
}

export const globalQuestionUniquenessService = GlobalQuestionUniquenessService.getInstance();