import { dailyLearningPlanService, type DailyLearningPlan, type LearningSession } from './dailyLearningPlanService';
import { personalizedLearningPathGenerator, type PersonalizedLearningPath } from './personalizedLearningPathGenerator';
import { contentDeduplicationService } from './contentDeduplicationService';
import { QuestionGenerationService } from '@/components/adaptive-learning/hooks/questionGenerationService';
import { userLearningProfileService } from './userLearningProfileService';
import { getStandardsForGrade } from '@/data/curriculumStandards';
import { supabase } from '@/integrations/supabase/client';

export interface DailyLearningSession {
  id: string;
  userId: string;
  date: string;
  gradeLevel: number;
  plan: DailyLearningPlan;
  currentSessionIndex: number;
  sessions: EnhancedLearningSession[];
  progress: SessionProgress;
  adaptiveAdjustments: AdaptiveAdjustment[];
  completed: boolean;
  startedAt?: string;
  completedAt?: string;
}

export interface EnhancedLearningSession extends LearningSession {
  generatedContent?: any;
  uniquenessVerified: boolean;
  adaptations: SessionAdaptation[];
  performance?: SessionPerformance;
}

export interface SessionAdaptation {
  type: 'difficulty' | 'pace' | 'format' | 'support';
  applied: boolean;
  reason: string;
  details: any;
}

export interface SessionProgress {
  totalSessions: number;
  completedSessions: number;
  currentStreak: number;
  totalTimeSpent: number;
  averageAccuracy: number;
  masteryAchieved: string[];
  strugglingAreas: string[];
}

export interface SessionPerformance {
  accuracy: number;
  timeSpent: number;
  engagement: number;
  difficulty: 'too_easy' | 'just_right' | 'too_hard';
  feedback: string;
}

export interface AdaptiveAdjustment {
  timestamp: string;
  type: 'difficulty_increase' | 'difficulty_decrease' | 'pace_adjustment' | 'content_change';
  reason: string;
  previousValue: any;
  newValue: any;
  impact: 'immediate' | 'next_session' | 'long_term';
}

export interface LearningAnalytics {
  dailyProgress: {
    date: string;
    sessionsCompleted: number;
    timeSpent: number;
    accuracy: number;
    masteryGained: string[];
  }[];
  weeklyTrends: {
    week: string;
    averageAccuracy: number;
    consistencyScore: number;
    engagementLevel: number;
    curriculumProgress: number;
  }[];
  curriculumMastery: {
    subject: string;
    gradeLevel: number;
    standardsMastered: number;
    totalStandards: number;
    masteryPercentage: number;
    projectedCompletion: string;
  }[];
}

class DailyLearningSessionOrchestrator {
  /**
   * Start a new daily learning session
   */
  async startDailySession(userId: string, gradeLevel: number): Promise<DailyLearningSession> {
    console.log(`🚀 Starting daily learning session for user ${userId}, grade ${gradeLevel}`);

    const today = new Date().toISOString().split('T')[0];

    // Check if session already exists for today
    let existingSession = await this.getDailySession(userId, today);
    if (existingSession && !existingSession.completed) {
      console.log('📋 Resuming existing session');
      return existingSession;
    }

    // Generate or get daily plan
    const plan = await dailyLearningPlanService.generateDailyPlan(userId, gradeLevel, today);

    // Enhance sessions with content generation and uniqueness verification
    const enhancedSessions = await this.enhanceSessionsWithContent(userId, plan.sessions, gradeLevel);

    // Initialize session progress
    const progress: SessionProgress = {
      totalSessions: enhancedSessions.length,
      completedSessions: 0,
      currentStreak: await this.calculateCurrentStreak(userId),
      totalTimeSpent: 0,
      averageAccuracy: 0,
      masteryAchieved: [],
      strugglingAreas: []
    };

    const session: DailyLearningSession = {
      id: `${userId}-${today}-session`,
      userId,
      date: today,
      gradeLevel,
      plan,
      currentSessionIndex: 0,
      sessions: enhancedSessions,
      progress,
      adaptiveAdjustments: [],
      completed: false,
      startedAt: new Date().toISOString()
    };

    // Save session
    await this.saveDailySession(session);

    console.log(`✅ Daily session started with ${enhancedSessions.length} learning activities`);
    return session;
  }

  /**
   * Get current session for a specific learning activity
   */
  async getCurrentLearningActivity(
    userId: string,
    date: string
  ): Promise<{
    session: DailyLearningSession | null;
    currentActivity: EnhancedLearningSession | null;
    isComplete: boolean;
  }> {
    const session = await this.getDailySession(userId, date);
    
    if (!session) {
      return { session: null, currentActivity: null, isComplete: false };
    }

    if (session.completed || session.currentSessionIndex >= session.sessions.length) {
      return { session, currentActivity: null, isComplete: true };
    }

    const currentActivity = session.sessions[session.currentSessionIndex];
    return { session, currentActivity, isComplete: false };
  }

  /**
   * Complete a learning activity and move to next
   */
  async completeActivity(
    userId: string,
    date: string,
    activityId: string,
    performance: SessionPerformance
  ): Promise<{
    sessionUpdated: DailyLearningSession;
    nextActivity: EnhancedLearningSession | null;
    adaptiveAdjustments: AdaptiveAdjustment[];
  }> {
    console.log(`✅ Completing activity ${activityId} for user ${userId}`);

    const session = await this.getDailySession(userId, date);
    if (!session) {
      throw new Error('No active session found');
    }

    // Find and update the completed activity
    const activityIndex = session.sessions.findIndex(s => s.id === activityId);
    if (activityIndex === -1) {
      throw new Error('Activity not found in session');
    }

    // Update activity performance
    session.sessions[activityIndex].performance = performance;
    session.sessions[activityIndex].completed = true;

    // Update session progress
    session.progress.completedSessions += 1;
    session.progress.totalTimeSpent += performance.timeSpent;
    
    // Update average accuracy
    const completedSessions = session.sessions.filter(s => s.completed && s.performance);
    const totalAccuracy = completedSessions.reduce((sum, s) => sum + (s.performance?.accuracy || 0), 0);
    session.progress.averageAccuracy = completedSessions.length > 0 ? totalAccuracy / completedSessions.length : 0;

    // Check for mastery achievement
    if (performance.accuracy >= 80 && performance.difficulty === 'just_right') {
      const skillArea = session.sessions[activityIndex].skillArea;
      if (!session.progress.masteryAchieved.includes(skillArea)) {
        session.progress.masteryAchieved.push(skillArea);
      }
    }

    // Check for struggling areas
    if (performance.accuracy < 60 || performance.difficulty === 'too_hard') {
      const skillArea = session.sessions[activityIndex].skillArea;
      if (!session.progress.strugglingAreas.includes(skillArea)) {
        session.progress.strugglingAreas.push(skillArea);
      }
    }

    // Generate adaptive adjustments
    const adaptiveAdjustments = await this.generateAdaptiveAdjustments(session, performance);
    session.adaptiveAdjustments.push(...adaptiveAdjustments);

    // Apply immediate adjustments
    await this.applyImmediateAdjustments(session, adaptiveAdjustments);

    // Move to next activity
    session.currentSessionIndex += 1;

    // Check if session is complete
    if (session.currentSessionIndex >= session.sessions.length) {
      session.completed = true;
      session.completedAt = new Date().toISOString();
      
      // Update user learning profile
      await this.updateUserLearningProfile(userId, session);
    }

    // Save updated session
    await this.saveDailySession(session);

    // Track content usage
    await contentDeduplicationService.trackContentUsage(
      userId,
      activityId,
      {
        accuracy: performance.accuracy,
        timeSpent: performance.timeSpent,
        engagement: performance.engagement
      },
      {
        rating: performance.engagement > 7 ? 5 : performance.engagement > 5 ? 4 : 3,
        difficulty: performance.difficulty,
        interest: performance.engagement > 7 ? 'interesting' : performance.engagement > 5 ? 'okay' : 'boring'
      }
    );

    const nextActivity = session.currentSessionIndex < session.sessions.length 
      ? session.sessions[session.currentSessionIndex] 
      : null;

    return {
      sessionUpdated: session,
      nextActivity,
      adaptiveAdjustments
    };
  }

  /**
   * Get learning analytics for a user
   */
  async getLearningAnalytics(userId: string, days: number = 30): Promise<LearningAnalytics> {
    console.log(`📊 Generating learning analytics for user ${userId}`);

    const [dailyProgress, weeklyTrends, curriculumMastery] = await Promise.all([
      this.getDailyProgressData(userId, days),
      this.getWeeklyTrendsData(userId, Math.ceil(days / 7)),
      this.getCurriculumMasteryData(userId)
    ]);

    return {
      dailyProgress,
      weeklyTrends,
      curriculumMastery
    };
  }

  /**
   * Generate personalized learning path and sync with daily plans
   */
  async generateAndSyncLearningPath(
    userId: string,
    gradeLevel: number,
    subjects: string[] = ['mathematics', 'english']
  ): Promise<PersonalizedLearningPath> {
    console.log(`🎯 Generating and syncing learning path for user ${userId}`);

    // Generate personalized learning path
    const learningPath = await personalizedLearningPathGenerator.generateLearningPath(
      userId,
      gradeLevel,
      subjects
    );

    // Store learning path
    await this.storeLearningPath(userId, learningPath);

    // Update future daily plans to align with learning path
    await this.alignDailyPlansWithLearningPath(userId, learningPath);

    return learningPath;
  }

  /**
   * Get content freshness and diversity metrics
   */
  async getContentMetrics(userId: string, subject: string, skillArea: string): Promise<{
    freshness: number;
    diversity: number;
    uniqueness: number;
    recommendations: string[];
  }> {
    const [freshnessData, diversityData] = await Promise.all([
      contentDeduplicationService.getContentFreshnessScore(userId, subject, skillArea),
      contentDeduplicationService.getDiversifiedRecommendations(userId, subject, skillArea, 0)
    ]);

    return {
      freshness: freshnessData.score,
      diversity: diversityData.diversityScore,
      uniqueness: 100 - freshnessData.staleness, // Inverse of staleness
      recommendations: [
        ...freshnessData.recommendations,
        ...diversityData.recommendations.slice(0, 2)
      ]
    };
  }

  /**
   * Private helper methods
   */

  private async enhanceSessionsWithContent(
    userId: string,
    sessions: LearningSession[],
    gradeLevel: number
  ): Promise<EnhancedLearningSession[]> {
    const enhanced: EnhancedLearningSession[] = [];

    for (const session of sessions) {
      try {
        let generatedContent = null;
        let uniquenessVerified = false;

        // Generate content for questions and games
        if (session.contentType === 'question' || session.contentType === 'game') {
          // Check content uniqueness first
          const uniquenessCheck = await contentDeduplicationService.checkContentUniqueness(
            userId,
            session.contentType,
            `${session.subject}-${session.skillArea}-${session.difficultyLevel}`,
            session.subject,
            session.skillArea,
            gradeLevel
          );

          if (uniquenessCheck.isUnique) {
            // Generate new content
            if (session.contentType === 'question') {
              generatedContent = await QuestionGenerationService.generateWithAPI(
                session.subject,
                session.skillArea,
                session.difficultyLevel,
                userId,
                gradeLevel,
                { standardId: session.curriculumStandardId },
                { uniquenessRequired: true },
                [] // Will be populated with user's question history
              );
            }
            uniquenessVerified = true;
          } else {
            // Handle duplicate content
            console.log(`⚠️ Content similarity detected: ${uniquenessCheck.reason}`);
            // Could implement content variation here
          }
        }

        const enhancedSession: EnhancedLearningSession = {
          ...session,
          generatedContent,
          uniquenessVerified,
          adaptations: this.generateSessionAdaptations(session, gradeLevel)
        };

        enhanced.push(enhancedSession);
      } catch (error) {
        console.error(`Error enhancing session ${session.id}:`, error);
        // Add session without enhancement
        enhanced.push({
          ...session,
          uniquenessVerified: false,
          adaptations: []
        });
      }
    }

    return enhanced;
  }

  private generateSessionAdaptations(session: LearningSession, gradeLevel: number): SessionAdaptation[] {
    const adaptations: SessionAdaptation[] = [];

    // Difficulty adaptation based on grade level and session difficulty
    if (session.difficultyLevel > gradeLevel + 1) {
      adaptations.push({
        type: 'difficulty',
        applied: false,
        reason: 'Content is above grade level',
        details: { 
          originalDifficulty: session.difficultyLevel, 
          recommendedDifficulty: gradeLevel 
        }
      });
    }

    // Pace adaptation for longer sessions
    if (session.estimatedMinutes > 25) {
      adaptations.push({
        type: 'pace',
        applied: false,
        reason: 'Session is longer than recommended attention span',
        details: { 
          originalMinutes: session.estimatedMinutes, 
          recommendedBreaks: Math.ceil(session.estimatedMinutes / 15) 
        }
      });
    }

    return adaptations;
  }

  private async generateAdaptiveAdjustments(
    session: DailyLearningSession,
    performance: SessionPerformance
  ): Promise<AdaptiveAdjustment[]> {
    const adjustments: AdaptiveAdjustment[] = [];
    const timestamp = new Date().toISOString();

    // Difficulty adjustments based on performance
    if (performance.difficulty === 'too_easy' && performance.accuracy >= 90) {
      adjustments.push({
        timestamp,
        type: 'difficulty_increase',
        reason: 'High accuracy with content perceived as too easy',
        previousValue: session.sessions[session.currentSessionIndex]?.difficultyLevel,
        newValue: Math.min(5, (session.sessions[session.currentSessionIndex]?.difficultyLevel || 1) + 1),
        impact: 'next_session'
      });
    }

    if (performance.difficulty === 'too_hard' && performance.accuracy < 50) {
      adjustments.push({
        timestamp,
        type: 'difficulty_decrease',
        reason: 'Low accuracy with content perceived as too hard',
        previousValue: session.sessions[session.currentSessionIndex]?.difficultyLevel,
        newValue: Math.max(1, (session.sessions[session.currentSessionIndex]?.difficultyLevel || 1) - 1),
        impact: 'immediate'
      });
    }

    // Pace adjustments based on time spent
    const expectedTime = session.sessions[session.currentSessionIndex]?.estimatedMinutes || 20;
    if (performance.timeSpent > expectedTime * 1.5) {
      adjustments.push({
        timestamp,
        type: 'pace_adjustment',
        reason: 'Taking longer than expected - may need more time or support',
        previousValue: expectedTime,
        newValue: Math.ceil(expectedTime * 1.2),
        impact: 'next_session'
      });
    }

    return adjustments;
  }

  private async applyImmediateAdjustments(
    session: DailyLearningSession,
    adjustments: AdaptiveAdjustment[]
  ): Promise<void> {
    const immediateAdjustments = adjustments.filter(adj => adj.impact === 'immediate');

    for (const adjustment of immediateAdjustments) {
      if (adjustment.type === 'difficulty_decrease') {
        // Apply to remaining sessions of the same skill area
        const currentSkillArea = session.sessions[session.currentSessionIndex]?.skillArea;
        for (let i = session.currentSessionIndex + 1; i < session.sessions.length; i++) {
          if (session.sessions[i].skillArea === currentSkillArea) {
            session.sessions[i].difficultyLevel = adjustment.newValue;
          }
        }
      }
    }
  }

  private async calculateCurrentStreak(userId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('daily_learning_sessions')
        .select('date, completed')
        .eq('user_id', userId)
        .eq('completed', true)
        .order('date', { ascending: false })
        .limit(30);

      if (error) throw error;

      if (!data || data.length === 0) return 0;

      let streak = 0;
      const today = new Date();
      
      for (const session of data) {
        const sessionDate = new Date(session.date);
        const daysDiff = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === streak) {
          streak++;
        } else if (daysDiff > streak) {
          break;
        }
      }

      return streak;
    } catch (error) {
      console.error('Error calculating streak:', error);
      return 0;
    }
  }

  private async getDailySession(userId: string, date: string): Promise<DailyLearningSession | null> {
    try {
      const { data, error } = await supabase
        .from('daily_learning_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('date', date)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return this.transformDatabaseSession(data);
    } catch (error) {
      console.error('Error fetching daily session:', error);
      return null;
    }
  }

  private async saveDailySession(session: DailyLearningSession): Promise<void> {
    try {
      const { error } = await supabase
        .from('daily_learning_sessions')
        .upsert({
          id: session.id,
          user_id: session.userId,
          date: session.date,
          grade_level: session.gradeLevel,
          plan: session.plan,
          current_session_index: session.currentSessionIndex,
          sessions: session.sessions,
          progress: session.progress,
          adaptive_adjustments: session.adaptiveAdjustments,
          completed: session.completed,
          started_at: session.startedAt,
          completed_at: session.completedAt,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving daily session:', error);
    }
  }

  private transformDatabaseSession(data: any): DailyLearningSession {
    return {
      id: data.id,
      userId: data.user_id,
      date: data.date,
      gradeLevel: data.grade_level,
      plan: data.plan,
      currentSessionIndex: data.current_session_index,
      sessions: data.sessions || [],
      progress: data.progress || {},
      adaptiveAdjustments: data.adaptive_adjustments || [],
      completed: data.completed || false,
      startedAt: data.started_at,
      completedAt: data.completed_at
    };
  }

  private async updateUserLearningProfile(userId: string, session: DailyLearningSession): Promise<void> {
    try {
      const profileUpdates = {
        user_id: userId,
        overall_accuracy: session.progress.averageAccuracy,
        total_sessions: session.progress.totalSessions,
        total_time_spent: session.progress.totalTimeSpent,
        strengths: session.progress.masteryAchieved,
        weaknesses: session.progress.strugglingAreas,
        last_session_date: session.date,
        updated_at: new Date().toISOString()
      };

      await userLearningProfileService.createOrUpdateProfile(profileUpdates);
    } catch (error) {
      console.error('Error updating user learning profile:', error);
    }
  }

  private async getDailyProgressData(userId: string, days: number): Promise<any[]> {
    // Implementation for daily progress data
    return [];
  }

  private async getWeeklyTrendsData(userId: string, weeks: number): Promise<any[]> {
    // Implementation for weekly trends data
    return [];
  }

  private async getCurriculumMasteryData(userId: string): Promise<any[]> {
    // Implementation for curriculum mastery data
    return [];
  }

  private async storeLearningPath(userId: string, learningPath: PersonalizedLearningPath): Promise<void> {
    // Implementation to store learning path
  }

  private async alignDailyPlansWithLearningPath(userId: string, learningPath: PersonalizedLearningPath): Promise<void> {
    // Implementation to align daily plans with learning path
  }
}

export const dailyLearningSessionOrchestrator = new DailyLearningSessionOrchestrator();