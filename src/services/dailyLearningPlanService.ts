import { supabase } from '@/integrations/supabase/client';
import { GRADE_LEVELS, type GradeLevel } from '@/types/gradeStandards';
import { userLearningProfileService } from './userLearningProfileService';
import { conceptMasteryService } from './conceptMasteryService';

export interface DailyLearningPlan {
  id: string;
  userId: string;
  gradeLevel: number;
  date: string;
  totalMinutes: number;
  sessions: LearningSession[];
  curriculumGoals: string[];
  personalizedAdjustments: PersonalizedAdjustment[];
  completed: boolean;
  createdAt: string;
}

export interface LearningSession {
  id: string;
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  estimatedMinutes: number;
  contentType: 'question' | 'game' | 'activity';
  curriculumStandardId: string;
  prerequisites: string[];
  completed: boolean;
}

export interface PersonalizedAdjustment {
  type: 'difficulty' | 'pace' | 'content_type' | 'skill_focus';
  reason: string;
  adjustment: any;
}

export interface GradeCurriculumGoal {
  id: string;
  gradeLevel: number;
  subject: string;
  title: string;
  description: string;
  skillAreas: string[];
  estimatedWeeks: number;
  prerequisites: string[];
  masteryThreshold: number;
}

class DailyLearningPlanService {
  private readonly TARGET_DAILY_MINUTES = 150; // 2.5 hours average
  private readonly MIN_DAILY_MINUTES = 120; // 2 hours minimum
  private readonly MAX_DAILY_MINUTES = 180; // 3 hours maximum

  /**
   * Generate a personalized daily learning plan for a student
   */
  async generateDailyPlan(
    userId: string, 
    gradeLevel: number, 
    targetDate: string = new Date().toISOString().split('T')[0]
  ): Promise<DailyLearningPlan> {
    console.log(`📅 Generating daily learning plan for user ${userId}, grade ${gradeLevel}, date ${targetDate}`);

    // Check if plan already exists for this date
    const existingPlan = await this.getDailyPlan(userId, targetDate);
    if (existingPlan) {
      console.log('📋 Found existing plan for date:', targetDate);
      return existingPlan;
    }

    // Get user's learning profile and progress
    const [profile, conceptMastery, usedContent] = await Promise.all([
      userLearningProfileService.getUserLearningProfile(userId),
      conceptMasteryService.getConceptMastery(userId),
      this.getUsedContentHistory(userId, 30) // Last 30 days
    ]);

    // Get curriculum goals for the grade
    const curriculumGoals = await this.getCurriculumGoalsForGrade(gradeLevel);
    
    // Determine focus areas based on progress and curriculum
    const focusAreas = this.determineFocusAreas(profile, conceptMastery, curriculumGoals);

    // Generate personalized adjustments
    const personalizedAdjustments = this.generatePersonalizedAdjustments(profile, focusAreas);

    // Create learning sessions
    const sessions = await this.createLearningSessions(
      userId, 
      gradeLevel, 
      focusAreas, 
      personalizedAdjustments,
      usedContent
    );

    // Calculate total time
    const totalMinutes = sessions.reduce((sum, session) => sum + session.estimatedMinutes, 0);

    const plan: DailyLearningPlan = {
      id: `${userId}-${targetDate}-${Date.now()}`,
      userId,
      gradeLevel,
      date: targetDate,
      totalMinutes,
      sessions,
      curriculumGoals: curriculumGoals.map(g => g.id),
      personalizedAdjustments,
      completed: false,
      createdAt: new Date().toISOString()
    };

    // Save plan to database
    await this.saveDailyPlan(plan);

    console.log(`✅ Generated daily plan with ${sessions.length} sessions (${totalMinutes} minutes)`);
    return plan;
  }

  /**
   * Get existing daily plan for a user and date
   */
  async getDailyPlan(userId: string, date: string): Promise<DailyLearningPlan | null> {
    try {
      const { data, error } = await supabase
        .from('daily_learning_plans')
        .select('*')
        .eq('user_id', userId)
        .eq('date', date)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // No rows found
        throw error;
      }

      return this.transformDatabasePlan(data);
    } catch (error) {
      console.error('Error fetching daily plan:', error);
      return null;
    }
  }

  /**
   * Get curriculum goals for a specific grade level
   */
  private async getCurriculumGoalsForGrade(gradeLevel: number): Promise<GradeCurriculumGoal[]> {
    // This could be enhanced to fetch from a curriculum database
    // For now, return default goals based on grade level
    const subjects = ['mathematics', 'english', 'science', 'social_studies'];
    
    return subjects.map(subject => ({
      id: `grade-${gradeLevel}-${subject}`,
      gradeLevel,
      subject,
      title: `Grade ${gradeLevel} ${subject.charAt(0).toUpperCase() + subject.slice(1)}`,
      description: `Core curriculum standards for ${subject} at grade ${gradeLevel}`,
      skillAreas: this.getSkillAreasForSubject(subject, gradeLevel),
      estimatedWeeks: 36, // Full school year
      prerequisites: gradeLevel > 1 ? [`grade-${gradeLevel - 1}-${subject}`] : [],
      masteryThreshold: 0.8
    }));
  }

  /**
   * Get skill areas for a subject based on grade level
   */
  private getSkillAreasForSubject(subject: string, gradeLevel: number): string[] {
    const skillAreaMap: Record<string, Record<string, string[]>> = {
      mathematics: {
        elementary: ['number_sense', 'addition_subtraction', 'multiplication_division', 'fractions', 'geometry', 'measurement'],
        middle: ['algebra_basics', 'integers', 'ratios_proportions', 'geometry', 'statistics', 'probability'],
        high: ['algebra', 'geometry', 'trigonometry', 'statistics', 'calculus_prep', 'problem_solving']
      },
      english: {
        elementary: ['phonics', 'reading_comprehension', 'vocabulary', 'grammar', 'writing', 'spelling'],
        middle: ['literature', 'grammar', 'writing', 'vocabulary', 'research_skills', 'speaking'],
        high: ['literature_analysis', 'essay_writing', 'research', 'rhetoric', 'grammar', 'vocabulary']
      },
      science: {
        elementary: ['life_science', 'earth_science', 'physical_science', 'scientific_method', 'observation', 'classification'],
        middle: ['biology', 'chemistry_basics', 'physics_basics', 'earth_science', 'scientific_method', 'data_analysis'],
        high: ['biology', 'chemistry', 'physics', 'environmental_science', 'scientific_research', 'lab_skills']
      },
      social_studies: {
        elementary: ['community', 'geography', 'history', 'civics', 'culture', 'economics_basics'],
        middle: ['world_history', 'geography', 'civics', 'economics', 'cultures', 'research_skills'],
        high: ['world_history', 'us_history', 'government', 'economics', 'psychology', 'sociology']
      }
    };

    const level = gradeLevel <= 5 ? 'elementary' : gradeLevel <= 8 ? 'middle' : 'high';
    return skillAreaMap[subject]?.[level] || [];
  }

  /**
   * Determine focus areas based on student progress and curriculum
   */
  private determineFocusAreas(
    profile: any, 
    conceptMastery: any[], 
    curriculumGoals: GradeCurriculumGoal[]
  ): { subject: string; skillArea: string; priority: number }[] {
    const focusAreas: { subject: string; skillArea: string; priority: number }[] = [];

    // Analyze weaknesses and gaps
    const weaknesses = profile?.weaknesses || [];
    const learningGaps = profile?.learning_gaps || [];

    // Add high-priority areas from weaknesses
    weaknesses.forEach((weakness: string) => {
      focusAreas.push({
        subject: this.inferSubjectFromSkill(weakness),
        skillArea: weakness,
        priority: 1 // High priority
      });
    });

    // Add medium-priority areas from learning gaps
    learningGaps.forEach((gap: string) => {
      focusAreas.push({
        subject: this.inferSubjectFromSkill(gap),
        skillArea: gap,
        priority: 2 // Medium priority
      });
    });

    // Add low-priority areas from curriculum goals
    curriculumGoals.forEach(goal => {
      goal.skillAreas.forEach(skillArea => {
        const mastery = conceptMastery.find(m => m.conceptName === skillArea);
        if (!mastery || mastery.masteryLevel < goal.masteryThreshold) {
          focusAreas.push({
            subject: goal.subject,
            skillArea,
            priority: 3 // Low priority
          });
        }
      });
    });

    // Remove duplicates and sort by priority
    const uniqueFocusAreas = focusAreas.filter((area, index, self) => 
      index === self.findIndex(a => a.subject === area.subject && a.skillArea === area.skillArea)
    );

    return uniqueFocusAreas.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Infer subject from skill name
   */
  private inferSubjectFromSkill(skillName: string): string {
    const skillToSubject: Record<string, string> = {
      'number_sense': 'mathematics',
      'addition_subtraction': 'mathematics',
      'multiplication_division': 'mathematics',
      'fractions': 'mathematics',
      'geometry': 'mathematics',
      'algebra': 'mathematics',
      'reading_comprehension': 'english',
      'vocabulary': 'english',
      'grammar': 'english',
      'writing': 'english',
      'life_science': 'science',
      'earth_science': 'science',
      'physical_science': 'science',
      'biology': 'science',
      'chemistry': 'science',
      'physics': 'science',
      'history': 'social_studies',
      'geography': 'social_studies',
      'civics': 'social_studies',
      'economics': 'social_studies'
    };

    return skillToSubject[skillName] || 'mathematics'; // Default to mathematics
  }

  /**
   * Generate personalized adjustments based on student profile
   */
  private generatePersonalizedAdjustments(
    profile: any, 
    focusAreas: { subject: string; skillArea: string; priority: number }[]
  ): PersonalizedAdjustment[] {
    const adjustments: PersonalizedAdjustment[] = [];

    // Difficulty adjustment based on accuracy
    if (profile?.overall_accuracy !== null) {
      if (profile.overall_accuracy > 85) {
        adjustments.push({
          type: 'difficulty',
          reason: 'High accuracy rate indicates readiness for increased challenge',
          adjustment: { increase: 1 }
        });
      } else if (profile.overall_accuracy < 60) {
        adjustments.push({
          type: 'difficulty',
          reason: 'Lower accuracy rate requires foundational reinforcement',
          adjustment: { decrease: 1 }
        });
      }
    }

    // Pace adjustment based on attention span
    if (profile?.attention_span_minutes !== null) {
      if (profile.attention_span_minutes < 15) {
        adjustments.push({
          type: 'pace',
          reason: 'Short attention span requires frequent breaks and varied activities',
          adjustment: { sessionLength: 10, breakFrequency: 'high' }
        });
      } else if (profile.attention_span_minutes > 30) {
        adjustments.push({
          type: 'pace',
          reason: 'Good attention span allows for longer focused sessions',
          adjustment: { sessionLength: 25, breakFrequency: 'low' }
        });
      }
    }

    // Content type adjustment based on learning style
    if (profile?.learning_style) {
      adjustments.push({
        type: 'content_type',
        reason: `Learning style preference: ${profile.learning_style}`,
        adjustment: { preferredTypes: this.getContentTypesForLearningStyle(profile.learning_style) }
      });
    }

    return adjustments;
  }

  /**
   * Get preferred content types based on learning style
   */
  private getContentTypesForLearningStyle(learningStyle: string): string[] {
    const styleMap: Record<string, string[]> = {
      'visual': ['game', 'activity', 'question'],
      'auditory': ['activity', 'question', 'game'],
      'kinesthetic': ['game', 'activity', 'question'],
      'reading': ['question', 'activity', 'game']
    };

    return styleMap[learningStyle] || ['question', 'game', 'activity'];
  }

  /**
   * Create learning sessions for the daily plan
   */
  private async createLearningSessions(
    userId: string,
    gradeLevel: number,
    focusAreas: { subject: string; skillArea: string; priority: number }[],
    adjustments: PersonalizedAdjustment[],
    usedContent: string[]
  ): Promise<LearningSession[]> {
    const sessions: LearningSession[] = [];
    let totalMinutes = 0;
    const targetMinutes = this.TARGET_DAILY_MINUTES;

    // Determine session length based on adjustments
    const paceAdjustment = adjustments.find(a => a.type === 'pace');
    const sessionLength = paceAdjustment?.adjustment?.sessionLength || 20;

    // Determine content type preferences
    const contentTypeAdjustment = adjustments.find(a => a.type === 'content_type');
    const preferredTypes = contentTypeAdjustment?.adjustment?.preferredTypes || ['question', 'game', 'activity'];

    // Create sessions from focus areas
    for (const focusArea of focusAreas) {
      if (totalMinutes >= targetMinutes) break;

      const remainingMinutes = targetMinutes - totalMinutes;
      const sessionMinutes = Math.min(sessionLength, remainingMinutes);

      // Cycle through content types
      const contentType = preferredTypes[sessions.length % preferredTypes.length] as 'question' | 'game' | 'activity';

      const session: LearningSession = {
        id: `${userId}-${Date.now()}-${sessions.length}`,
        subject: focusArea.subject,
        skillArea: focusArea.skillArea,
        difficultyLevel: this.getDifficultyForGrade(gradeLevel),
        estimatedMinutes: sessionMinutes,
        contentType,
        curriculumStandardId: `${gradeLevel}-${focusArea.subject}-${focusArea.skillArea}`,
        prerequisites: [],
        completed: false
      };

      sessions.push(session);
      totalMinutes += sessionMinutes;
    }

    // If we haven't reached target minutes, add more sessions
    while (totalMinutes < this.MIN_DAILY_MINUTES && sessions.length < 15) {
      const randomFocusArea = focusAreas[Math.floor(Math.random() * focusAreas.length)];
      const remainingMinutes = targetMinutes - totalMinutes;
      const sessionMinutes = Math.min(sessionLength, remainingMinutes);
      const contentType = preferredTypes[sessions.length % preferredTypes.length] as 'question' | 'game' | 'activity';

      const session: LearningSession = {
        id: `${userId}-${Date.now()}-${sessions.length}`,
        subject: randomFocusArea.subject,
        skillArea: randomFocusArea.skillArea,
        difficultyLevel: this.getDifficultyForGrade(gradeLevel),
        estimatedMinutes: sessionMinutes,
        contentType,
        curriculumStandardId: `${gradeLevel}-${randomFocusArea.subject}-${randomFocusArea.skillArea}`,
        prerequisites: [],
        completed: false
      };

      sessions.push(session);
      totalMinutes += sessionMinutes;
    }

    return sessions;
  }

  /**
   * Get appropriate difficulty level for grade
   */
  private getDifficultyForGrade(gradeLevel: number): number {
    // Scale difficulty from 1-5 based on grade level
    if (gradeLevel <= 2) return 1;
    if (gradeLevel <= 4) return 2;
    if (gradeLevel <= 6) return 3;
    if (gradeLevel <= 8) return 4;
    return 5;
  }

  /**
   * Get used content history to avoid repetition
   */
  private async getUsedContentHistory(userId: string, days: number): Promise<string[]> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const { data, error } = await supabase
        .from('user_question_history')
        .select('question_text')
        .eq('user_id', userId)
        .gte('created_at', cutoffDate.toISOString());

      if (error) throw error;

      return data?.map(item => item.question_text) || [];
    } catch (error) {
      console.error('Error fetching used content history:', error);
      return [];
    }
  }

  /**
   * Save daily learning plan to database
   */
  private async saveDailyPlan(plan: DailyLearningPlan): Promise<void> {
    try {
      const { error } = await supabase
        .from('daily_learning_plans')
        .insert({
          id: plan.id,
          user_id: plan.userId,
          grade_level: plan.gradeLevel,
          date: plan.date,
          total_minutes: plan.totalMinutes,
          sessions: plan.sessions,
          curriculum_goals: plan.curriculumGoals,
          personalized_adjustments: plan.personalizedAdjustments,
          completed: plan.completed,
          created_at: plan.createdAt
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving daily plan:', error);
      // Continue without throwing - plan will be regenerated if needed
    }
  }

  /**
   * Transform database plan to application format
   */
  private transformDatabasePlan(data: any): DailyLearningPlan {
    return {
      id: data.id,
      userId: data.user_id,
      gradeLevel: data.grade_level,
      date: data.date,
      totalMinutes: data.total_minutes,
      sessions: data.sessions || [],
      curriculumGoals: data.curriculum_goals || [],
      personalizedAdjustments: data.personalized_adjustments || [],
      completed: data.completed || false,
      createdAt: data.created_at
    };
  }

  /**
   * Mark a session as completed
   */
  async markSessionCompleted(userId: string, date: string, sessionId: string): Promise<void> {
    const plan = await this.getDailyPlan(userId, date);
    if (!plan) return;

    const sessionIndex = plan.sessions.findIndex(s => s.id === sessionId);
    if (sessionIndex >= 0) {
      plan.sessions[sessionIndex].completed = true;
      
      // Check if all sessions are completed
      const allCompleted = plan.sessions.every(s => s.completed);
      if (allCompleted) {
        plan.completed = true;
      }

      await this.saveDailyPlan(plan);
    }
  }

  /**
   * Get learning analytics for a user
   */
  async getLearningAnalytics(userId: string, days: number = 30): Promise<any> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const { data, error } = await supabase
        .from('daily_learning_plans')
        .select('*')
        .eq('user_id', userId)
        .gte('date', cutoffDate.toISOString().split('T')[0]);

      if (error) throw error;

      const plans = data || [];
      const totalPlans = plans.length;
      const completedPlans = plans.filter(p => p.completed).length;
      const totalMinutes = plans.reduce((sum, p) => sum + (p.total_minutes || 0), 0);
      const completedMinutes = plans.filter(p => p.completed).reduce((sum, p) => sum + (p.total_minutes || 0), 0);

      return {
        totalPlans,
        completedPlans,
        completionRate: totalPlans > 0 ? (completedPlans / totalPlans) * 100 : 0,
        totalMinutes,
        completedMinutes,
        averageMinutesPerDay: totalPlans > 0 ? totalMinutes / totalPlans : 0,
        streakDays: this.calculateStreakDays(plans)
      };
    } catch (error) {
      console.error('Error getting learning analytics:', error);
      return {};
    }
  }

  /**
   * Calculate streak days from completed plans
   */
  private calculateStreakDays(plans: any[]): number {
    const completedPlans = plans.filter(p => p.completed).sort((a, b) => b.date.localeCompare(a.date));
    let streak = 0;
    let currentDate = new Date();

    for (const plan of completedPlans) {
      const planDate = new Date(plan.date);
      const daysDiff = Math.floor((currentDate.getTime() - planDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === streak) {
        streak++;
        currentDate = planDate;
      } else if (daysDiff > streak) {
        break;
      }
    }

    return streak;
  }
}

export const dailyLearningPlanService = new DailyLearningPlanService();