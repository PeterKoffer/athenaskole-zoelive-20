
// Adaptive Difficulty Engine - Dynamically adjusts content difficulty
export interface StudentPerformanceMetrics {
  accuracy_rate: number;
  response_time_avg: number;
  consistency_score: number;
  engagement_level: number;
  recent_session_scores: number[];
  mistake_patterns: string[];
  strength_areas: string[];
  challenge_areas: string[];
}

export interface DifficultyAdjustment {
  new_difficulty_level: number;
  adjustment_reason: string;
  recommended_interventions: string[];
  suggested_practice_areas: string[];
  encouragement_strategy: 'celebrate' | 'encourage' | 'challenge' | 'support';
}

export class AdaptiveDifficultyEngine {
  private static readonly DIFFICULTY_THRESHOLDS = {
    increase: { accuracy: 85, consistency: 80, engagement: 90 },
    decrease: { accuracy: 60, consistency: 50, engagement: 60 },
    maintain: { accuracy_range: [70, 84], consistency_range: [60, 79] }
  };

  static analyzeDifficultyAdjustment(
    currentDifficulty: number,
    metrics: StudentPerformanceMetrics,
    sessionContext: {
      subject: string;
      skill_area: string;
      total_questions: number;
      time_spent_minutes: number;
    }
  ): DifficultyAdjustment {
    console.log('🔄 Analyzing difficulty adjustment:', {
      current: currentDifficulty,
      accuracy: metrics.accuracy_rate,
      consistency: metrics.consistency_score,
      engagement: metrics.engagement_level
    });

    // Check for difficulty increase conditions
    if (this.shouldIncreaseDifficulty(metrics)) {
      return this.createDifficultyIncrease(currentDifficulty, metrics, sessionContext);
    }

    // Check for difficulty decrease conditions  
    if (this.shouldDecreaseDifficulty(metrics)) {
      return this.createDifficultyDecrease(currentDifficulty, metrics, sessionContext);
    }

    // Maintain current difficulty with targeted support
    return this.maintainDifficultyWithSupport(currentDifficulty, metrics, sessionContext);
  }

  private static shouldIncreaseDifficulty(metrics: StudentPerformanceMetrics): boolean {
    const thresholds = this.DIFFICULTY_THRESHOLDS.increase;
    
    return (
      metrics.accuracy_rate >= thresholds.accuracy &&
      metrics.consistency_score >= thresholds.consistency &&
      metrics.engagement_level >= thresholds.engagement &&
      metrics.recent_session_scores.slice(-3).every(score => score >= 80)
    );
  }

  private static shouldDecreaseDifficulty(metrics: StudentPerformanceMetrics): boolean {
    const thresholds = this.DIFFICULTY_THRESHOLDS.decrease;
    
    return (
      metrics.accuracy_rate <= thresholds.accuracy ||
      metrics.consistency_score <= thresholds.consistency ||
      metrics.engagement_level <= thresholds.engagement ||
      metrics.recent_session_scores.slice(-2).every(score => score <= 65)
    );
  }

  private static createDifficultyIncrease(
    currentDifficulty: number,
    metrics: StudentPerformanceMetrics,
    context: any
  ): DifficultyAdjustment {
    const newDifficulty = Math.min(5, currentDifficulty + 1);
    
    return {
      new_difficulty_level: newDifficulty,
      adjustment_reason: `Excellent performance! Ready for greater challenges (${metrics.accuracy_rate}% accuracy)`,
      recommended_interventions: [
        'Introduce advanced problem-solving strategies',
        'Add multi-step word problems',
        'Include conceptual reasoning questions'
      ],
      suggested_practice_areas: this.identifyGrowthAreas(metrics, 'advance'),
      encouragement_strategy: 'challenge'
    };
  }

  private static createDifficultyDecrease(
    currentDifficulty: number,
    metrics: StudentPerformanceMetrics,
    context: any
  ): DifficultyAdjustment {
    const newDifficulty = Math.max(1, currentDifficulty - 1);
    
    return {
      new_difficulty_level: newDifficulty,
      adjustment_reason: `Providing more foundational support (${metrics.accuracy_rate}% accuracy)`,
      recommended_interventions: [
        'Review prerequisite concepts',
        'Provide step-by-step guided practice',
        'Include visual aids and manipulatives',
        'Offer additional practice time'
      ],
      suggested_practice_areas: this.identifyGrowthAreas(metrics, 'support'),
      encouragement_strategy: 'support'
    };
  }

  private static maintainDifficultyWithSupport(
    currentDifficulty: number,
    metrics: StudentPerformanceMetrics,
    context: any
  ): DifficultyAdjustment {
    return {
      new_difficulty_level: currentDifficulty,
      adjustment_reason: `Maintaining current level while building confidence (${metrics.accuracy_rate}% accuracy)`,
      recommended_interventions: [
        'Vary question formats to maintain engagement',
        'Focus on mistake patterns for improvement',
        'Celebrate progress in strength areas'
      ],
      suggested_practice_areas: metrics.challenge_areas.slice(0, 2),
      encouragement_strategy: metrics.accuracy_rate >= 75 ? 'celebrate' : 'encourage'
    };
  }

  private static identifyGrowthAreas(metrics: StudentPerformanceMetrics, direction: 'advance' | 'support'): string[] {
    if (direction === 'advance') {
      // For advancing students, focus on extending their strengths
      return [
        ...metrics.strength_areas.slice(0, 2),
        'advanced_applications',
        'creative_problem_solving'
      ];
    } else {
      // For students needing support, focus on addressing challenges
      return [
        ...metrics.challenge_areas.slice(0, 2),
        'foundational_concepts',
        'basic_skill_building'
      ];
    }
  }

  // Real-time difficulty adjustment during sessions
  static getRealtimeAdjustment(
    questionNumber: number,
    recentAnswers: boolean[],
    responseTimeSeconds: number
  ): 'easier' | 'harder' | 'maintain' {
    if (questionNumber < 3) return 'maintain'; // Need baseline data

    const recentAccuracy = recentAnswers.slice(-3).filter(Boolean).length / Math.min(3, recentAnswers.length);
    const isRespondingQuickly = responseTimeSeconds < 15; // Quick responses might indicate too easy
    const isStruggling = responseTimeSeconds > 60; // Slow responses might indicate too hard

    // Increase difficulty if performing well
    if (recentAccuracy >= 0.8 && isRespondingQuickly) {
      return 'harder';
    }

    // Decrease difficulty if struggling
    if (recentAccuracy <= 0.4 || isStruggling) {
      return 'easier';
    }

    return 'maintain';
  }

  // Calculate engagement level based on multiple factors
  static calculateEngagementLevel(sessionData: {
    questions_completed: number;
    total_time_minutes: number;
    interaction_count: number;
    help_requests: number;
    voluntary_breaks: number;
  }): number {
    const completionRate = sessionData.questions_completed / Math.max(1, sessionData.total_time_minutes / 3);
    const interactionRate = sessionData.interaction_count / Math.max(1, sessionData.questions_completed);
    const selfRegulation = sessionData.voluntary_breaks > 0 ? 10 : 0; // Bonus for self-regulation
    
    // Normalize to 0-100 scale
    const baseEngagement = Math.min(100, (completionRate * 40) + (interactionRate * 30) + selfRegulation + 20);
    
    // Reduce engagement if too many help requests (indicates frustration)
    const helpPenalty = Math.min(20, sessionData.help_requests * 2);
    
    return Math.max(0, baseEngagement - helpPenalty);
  }
}
