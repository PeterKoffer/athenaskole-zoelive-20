// @ts-nocheck

import { LearnerProfile, KnowledgeComponentMastery } from '@/types/learnerProfile';

export class MasteryCalculator {
  static updateKcMastery(
    kcMastery: KnowledgeComponentMastery,
    masteryUpdate: {
      isCorrect: boolean;
      newAttempt: boolean;
      interactionType: string;
      interactionDetails?: any;
    }
  ): void {
    // Update mastery based on performance
    if (masteryUpdate.newAttempt) {
      kcMastery.totalAttempts = (kcMastery.totalAttempts || 0) + 1;
      if (masteryUpdate.isCorrect) {
        kcMastery.successfulAttempts = (kcMastery.successfulAttempts || 0) + 1;
        kcMastery.currentStreak = (kcMastery.currentStreak || 0) + 1;
      } else {
        kcMastery.currentStreak = 0;
      }
    }

    // Simple mastery calculation using BKT-like approach
    if (masteryUpdate.isCorrect) {
      kcMastery.masteryLevel = Math.min(0.99, kcMastery.masteryLevel + (1 - kcMastery.masteryLevel) * 0.25);
    } else {
      kcMastery.masteryLevel = Math.max(0.01, kcMastery.masteryLevel - kcMastery.masteryLevel * 0.25);
    }

    // Add to history (keep last 20 entries)
    if (!kcMastery.interactionHistory) kcMastery.interactionHistory = [];
    kcMastery.interactionHistory.push({
      timestamp: new Date().toISOString(),
      success: masteryUpdate.isCorrect,
      timeTakenSeconds: masteryUpdate.interactionDetails?.timeTakenSeconds || 30,
      hintsUsed: masteryUpdate.interactionDetails?.hintsUsed || 0,
      attempts: masteryUpdate.interactionDetails?.attempts || 1,
      firstAttemptSuccess: masteryUpdate.isCorrect && (masteryUpdate.interactionDetails?.attempts || 1) === 1
    });

    // Keep only last 20 interactions
    if (kcMastery.interactionHistory.length > 20) {
      kcMastery.interactionHistory = kcMastery.interactionHistory.slice(-20);
    }

    kcMastery.lastAssessed = new Date().toISOString();
    kcMastery.practiceCount = kcMastery.totalAttempts || 0;
  }

  static updateOverallMastery(profile: LearnerProfile): void {
    if (!profile.kcMasteryMap) {
      profile.overallMastery = 0.0;
      if (!profile.aggregateMetrics) profile.aggregateMetrics = { overallMastery: 0, completedKCs: 0, totalKCsAttempted: 0 };
      profile.aggregateMetrics.overallMastery = 0;
      profile.aggregateMetrics.completedKCs = 0;
      profile.aggregateMetrics.totalKCsAttempted = 0;
      return;
    }

    const masteryValues = Object.values(profile.kcMasteryMap).map(kc => kc.masteryLevel);
    if (masteryValues.length === 0) {
      profile.overallMastery = 0.0;
    } else {
      profile.overallMastery = masteryValues.reduce((sum, level) => sum + level, 0) / masteryValues.length;
    }

    // Update aggregate metrics
    if (!profile.aggregateMetrics) profile.aggregateMetrics = { overallMastery: 0, completedKCs: 0, totalKCsAttempted: 0 };
    profile.aggregateMetrics.overallMastery = profile.overallMastery;
    profile.aggregateMetrics.totalKCsAttempted = masteryValues.length;
    profile.aggregateMetrics.completedKCs = masteryValues.filter(level => level >= 0.85).length;
  }

  static createInitialKcMastery(kcId: string): KnowledgeComponentMastery {
    return {
      kcId,
      masteryLevel: 0.5, // Start at neutral
      practiceCount: 0,
      lastAssessed: new Date().toISOString(),
      totalAttempts: 0,
      successfulAttempts: 0,
      currentStreak: 0,
      interactionHistory: []
    };
  }
}
