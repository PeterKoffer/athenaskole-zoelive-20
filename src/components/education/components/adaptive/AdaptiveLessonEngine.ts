
import { StudentPerformanceMetrics, AdaptiveLessonConfig, AdaptivePhaseConfig } from '../types/AdaptiveLessonTypes';

export class AdaptiveLessonEngine {
  private config: AdaptiveLessonConfig;
  private studentMetrics: StudentPerformanceMetrics;
  
  constructor(initialConfig: AdaptiveLessonConfig) {
    this.config = initialConfig;
    this.studentMetrics = {
      correctAnswersRatio: 0.5,
      averageResponseTime: 30,
      strugglingConcepts: [],
      masteredConcepts: [],
      currentDifficultyLevel: 5,
      engagementLevel: 75,
      learningPace: 'average'
    };
  }

  updateStudentMetrics(
    wasCorrect: boolean, 
    responseTime: number, 
    concept: string,
    engagementSignals: { clickCount: number; timeOnTask: number }
  ) {
    // Update correct answers ratio
    const totalAnswers = this.studentMetrics.correctAnswersRatio * 10 + 1; // Rough estimation
    const correctAnswers = this.studentMetrics.correctAnswersRatio * 10 + (wasCorrect ? 1 : 0);
    this.studentMetrics.correctAnswersRatio = correctAnswers / totalAnswers;

    // Update response time
    this.studentMetrics.averageResponseTime = 
      (this.studentMetrics.averageResponseTime * 0.8) + (responseTime * 0.2);

    // Update concepts
    if (wasCorrect && this.studentMetrics.correctAnswersRatio > 0.8) {
      if (!this.studentMetrics.masteredConcepts.includes(concept)) {
        this.studentMetrics.masteredConcepts.push(concept);
      }
      this.studentMetrics.strugglingConcepts = 
        this.studentMetrics.strugglingConcepts.filter(c => c !== concept);
    } else if (!wasCorrect) {
      if (!this.studentMetrics.strugglingConcepts.includes(concept)) {
        this.studentMetrics.strugglingConcepts.push(concept);
      }
    }

    // Update learning pace
    this.updateLearningPace();
    
    // Update difficulty
    this.updateDifficultyLevel();

    console.log('📊 Updated student metrics:', this.studentMetrics);
  }

  private updateLearningPace() {
    const { averageResponseTime, correctAnswersRatio } = this.studentMetrics;
    
    if (averageResponseTime < 15 && correctAnswersRatio > 0.7) {
      this.studentMetrics.learningPace = 'fast';
    } else if (averageResponseTime > 45 || correctAnswersRatio < 0.4) {
      this.studentMetrics.learningPace = 'slow';
    } else {
      this.studentMetrics.learningPace = 'average';
    }
  }

  private updateDifficultyLevel() {
    const { correctAnswersRatio } = this.studentMetrics;
    const { increaseThreshold, decreaseThreshold, maxAdjustmentPerActivity } = this.config.difficultyAdaptation;

    if (correctAnswersRatio > increaseThreshold) {
      this.studentMetrics.currentDifficultyLevel = Math.min(
        10, 
        this.studentMetrics.currentDifficultyLevel + maxAdjustmentPerActivity
      );
    } else if (correctAnswersRatio < decreaseThreshold) {
      this.studentMetrics.currentDifficultyLevel = Math.max(
        1, 
        this.studentMetrics.currentDifficultyLevel - maxAdjustmentPerActivity
      );
    }
  }

  calculateAdaptivePhaseTime(phaseConfig: AdaptivePhaseConfig, totalLessonTime: number): number {
    let adjustedPercentage = phaseConfig.basePercentage;

    // Adjust based on learning pace
    if (phaseConfig.adaptiveFactors.paceBased) {
      switch (this.studentMetrics.learningPace) {
        case 'fast':
          adjustedPercentage *= this.config.paceAdaptation.fastLearnerSpeedup;
          break;
        case 'slow':
          adjustedPercentage *= this.config.paceAdaptation.slowLearnerExtension;
          break;
      }
    }

    // Adjust based on performance
    if (phaseConfig.adaptiveFactors.performanceBased) {
      if (this.studentMetrics.correctAnswersRatio < 0.5) {
        adjustedPercentage *= 1.2; // Give more time for struggling students
      } else if (this.studentMetrics.correctAnswersRatio > 0.8) {
        adjustedPercentage *= 0.9; // Less time for high performers
      }
    }

    // Ensure within bounds
    adjustedPercentage = Math.max(phaseConfig.minPercentage, adjustedPercentage);
    adjustedPercentage = Math.min(phaseConfig.maxPercentage, adjustedPercentage);

    return Math.floor((adjustedPercentage / 100) * totalLessonTime);
  }

  getAdaptedDifficulty(): number {
    return this.studentMetrics.currentDifficultyLevel;
  }

  getStudentMetrics(): StudentPerformanceMetrics {
    return { ...this.studentMetrics };
  }

  shouldAdvanceToNextPhase(timeInCurrentPhase: number, phaseTime: number, performanceInPhase: number): boolean {
    // Fast learners can advance early if performing well
    if (this.studentMetrics.learningPace === 'fast' && performanceInPhase > 0.8) {
      return timeInCurrentPhase >= phaseTime * 0.7;
    }
    
    // Slow learners get extra time if struggling
    if (this.studentMetrics.learningPace === 'slow' && performanceInPhase < 0.5) {
      return timeInCurrentPhase >= phaseTime * 1.3;
    }

    return timeInCurrentPhase >= phaseTime;
  }

  generatePersonalizedFeedback(wasCorrect: boolean, concept: string): string {
    const { learningPace, correctAnswersRatio, currentDifficultyLevel } = this.studentMetrics;
    
    if (wasCorrect) {
      if (learningPace === 'fast') {
        return "Excellent! You're mastering this quickly. Let's try something more challenging!";
      } else if (correctAnswersRatio > 0.8) {
        return "Great work! You're really understanding these concepts well.";
      } else {
        return "Nice job! You're making good progress.";
      }
    } else {
      if (this.studentMetrics.strugglingConcepts.includes(concept)) {
        return "I see this concept is challenging for you. Let me break it down differently.";
      } else {
        return "That's okay! Let's think through this step by step.";
      }
    }
  }
}

export const createDefaultAdaptiveLessonConfig = (): AdaptiveLessonConfig => {
  return {
    targetTotalMinutes: 20,
    phases: [
      {
        phaseType: 'introduction',
        basePercentage: 12.5, // 2.5 minutes of 20
        minPercentage: 8,
        maxPercentage: 18,
        adaptiveFactors: { performanceBased: false, paceBased: true, engagementBased: true }
      },
      {
        phaseType: 'content-delivery',
        basePercentage: 30, // 6 minutes of 20
        minPercentage: 20,
        maxPercentage: 40,
        adaptiveFactors: { performanceBased: true, paceBased: true, engagementBased: false }
      },
      {
        phaseType: 'interactive-game',
        basePercentage: 22.5, // 4.5 minutes of 20
        minPercentage: 15,
        maxPercentage: 35,
        adaptiveFactors: { performanceBased: true, paceBased: true, engagementBased: true }
      },
      {
        phaseType: 'application',
        basePercentage: 17.5, // 3.5 minutes of 20
        minPercentage: 12,
        maxPercentage: 25,
        adaptiveFactors: { performanceBased: true, paceBased: true, engagementBased: false }
      },
      {
        phaseType: 'creative-exploration',
        basePercentage: 12.5, // 2.5 minutes of 20
        minPercentage: 8,
        maxPercentage: 20,
        adaptiveFactors: { performanceBased: false, paceBased: true, engagementBased: true }
      },
      {
        phaseType: 'summary',
        basePercentage: 5, // 1 minute of 20
        minPercentage: 3,
        maxPercentage: 10,
        adaptiveFactors: { performanceBased: false, paceBased: false, engagementBased: false }
      }
    ],
    difficultyAdaptation: {
      increaseThreshold: 0.75,
      decreaseThreshold: 0.4,
      maxAdjustmentPerActivity: 0.5
    },
    paceAdaptation: {
      fastLearnerSpeedup: 0.8,
      slowLearnerExtension: 1.3
    }
  };
};
