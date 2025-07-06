
// src/services/learnerProfile/integrationHelpers.ts

import { mockCurriculumService } from '@/services/curriculumService/mockCurriculumService';
import { mockLearnerProfileService } from './MockLearnerProfileService';
import { LearningAtomPerformance } from '@/types/learning';

/**
 * Helper function to update KC mastery when objective performance is recorded.
 * This bridges the gap between objective-level progress and KC-level mastery.
 */
export async function updateKcMasteryFromObjectivePerformance(
  userId: string,
  objectiveId: string,
  performance: LearningAtomPerformance
): Promise<void> {
  console.log(`🔗 Updating KC mastery from objective performance: ${objectiveId}`);

  try {
    // Get all KCs that are children of this learning objective
    const childKcs = await mockCurriculumService.getChildren(objectiveId);
    const knowledgeComponents = childKcs.filter(node => node.nodeType === 'kc');

    if (knowledgeComponents.length === 0) {
      console.log(`ℹ️ No KCs found for objective ${objectiveId}`);
      return;
    }

    console.log(`📚 Found ${knowledgeComponents.length} KCs for objective ${objectiveId}`);

    // Update mastery for each KC
    for (const kc of knowledgeComponents) {
      await mockLearnerProfileService.updateKcMastery(userId, kc.id, {
        isCorrect: performance.success,
        newAttempt: true,
        interactionType: 'objective_practice',
        interactionDetails: {
          objectiveId,
          hintsUsed: performance.hintsUsed,
          timeTakenSeconds: performance.timeTakenSeconds,
          attempts: performance.attempts,
          difficulty: 'medium' // Default difficulty since it's not in performance data
        }
      });
    }

    console.log(`✅ Updated KC mastery for ${knowledgeComponents.length} KCs`);
  } catch (error) {
    console.error(`❌ Error updating KC mastery from objective performance:`, error);
  }
}

/**
 * Get recommended difficulty for an objective based on related KC mastery levels
 */
export async function getRecommendedDifficultyFromKcMastery(
  userId: string,
  objectiveId: string
): Promise<'easy' | 'medium' | 'hard'> {
  try {
    // Get all KCs that are children of this learning objective
    const childKcs = await mockCurriculumService.getChildren(objectiveId);
    const knowledgeComponents = childKcs.filter(node => node.nodeType === 'kc');

    if (knowledgeComponents.length === 0) {
      console.log(`ℹ️ No KCs found for objective ${objectiveId}, defaulting to medium`);
      return 'medium';
    }

    // Get mastery levels for all related KCs
    const masteryLevels: number[] = [];
    for (const kc of knowledgeComponents) {
      const kcMastery = await mockLearnerProfileService.getKcMastery(userId, kc.id);
      if (kcMastery) {
        masteryLevels.push(kcMastery.masteryLevel);
      }
    }

    if (masteryLevels.length === 0) {
      console.log(`ℹ️ No KC mastery data found for objective ${objectiveId}, defaulting to medium`);
      return 'medium';
    }

    // Calculate average mastery level
    const averageMastery = masteryLevels.reduce((sum, level) => sum + level, 0) / masteryLevels.length;

    // Map mastery level to difficulty
    if (averageMastery < 0.3) {
      return 'easy';
    } else if (averageMastery > 0.7) {
      return 'hard';
    } else {
      return 'medium';
    }
  } catch (error) {
    console.error(`❌ Error getting recommended difficulty from KC mastery:`, error);
    return 'medium';
  }
}
