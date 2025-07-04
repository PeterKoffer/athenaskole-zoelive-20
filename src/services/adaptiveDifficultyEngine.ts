import { LearningAtomPerformance } from '@/types/learning';
import { ObjectiveProgressMetrics } from '@/types/curriculum';
import { mockUserProgressService } from './mockUserProgressService'; // Assuming path

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

class AdaptiveDifficultyEngine {

  public async suggestInitialDifficulty(
    userId: string,
    objectiveId: string,
    subject: string // Keep subject for potential future use (e.g. overall subject performance)
  ): Promise<DifficultyLevel> {
    console.log(`[AdaptiveDifficultyEngine] Suggesting initial difficulty for userId: ${userId}, objectiveId: ${objectiveId}, subject: ${subject}`);

    const objectiveMetrics = await mockUserProgressService.getObjectiveProgress(userId, objectiveId);

    if (!objectiveMetrics || objectiveMetrics.totalAttempts === 0) {
      console.log(`[AdaptiveDifficultyEngine] No prior history for objective ${objectiveId}. Defaulting to medium.`);
      return 'medium'; // No history, start with medium
    }

    // Calculate success rate, avoid division by zero
    const successRate = objectiveMetrics.totalAttempts > 0
      ? objectiveMetrics.successfulAttempts / objectiveMetrics.totalAttempts
      : 0;

    if (objectiveMetrics.isCompleted) {
        // If completed, and success rate was high, maybe try harder if it's for revision.
        // Or, if it was a struggle to complete, revise on easy/medium.
        // For initial placement into a new universe, if it's for REVISION, medium is safe.
        // If it's somehow being picked as NEW despite being complete, that's an issue for DailyUniverseGenerator.
        // Let's assume if it's picked, and was completed easily, it could be a harder variant for revision.
        if (successRate > 0.7 && objectiveMetrics.totalAttempts <= 2) return 'hard'; // Completed easily, try harder revision
        if (successRate < 0.4) return 'easy'; // Was a struggle, revise on easy
        return 'medium'; // Default for completed items picked for revision
    }


    // If not completed, but has attempts:
    if (successRate > 0.6 && objectiveMetrics.totalAttempts < 3) {
      // Doing reasonably well, few attempts
      console.log(`[AdaptiveDifficultyEngine] Good partial history. Suggesting medium.`);
      return 'medium';
    } else if (successRate < 0.3 && objectiveMetrics.totalAttempts >= 2) {
      // Struggling significantly
      console.log(`[AdaptiveDifficultyEngine] Struggling history. Suggesting easy.`);
      return 'easy';
    } else if (objectiveMetrics.totalAttempts >= 3) {
        // Many attempts, not clearly succeeding or failing hard
        console.log(`[AdaptiveDifficultyEngine] Many attempts, mixed results. Suggesting easy to solidify.`);
        return 'easy';
    }

    console.log(`[AdaptiveDifficultyEngine] Defaulting to medium due to mixed/insufficient history.`);
    return 'medium';
  }

  public suggestNextDifficultyOnRetry(
    currentAtomDifficulty: DifficultyLevel,
    performanceOfLastAttempt: LearningAtomPerformance,
    historicalMetrics?: ObjectiveProgressMetrics
  ): DifficultyLevel {
    console.log(`[AdaptiveDifficultyEngine] Suggesting next difficulty on retry. Last attempt success: ${performanceOfLastAttempt.success}`);

    if (!performanceOfLastAttempt.success) {
      // If failed, definitely go easier or stay easy
      if (currentAtomDifficulty === 'hard') return 'medium';
      if (currentAtomDifficulty === 'medium') return 'easy';
      return 'easy'; // Already easy, stay easy
    } else {
      // If succeeded, but it's a retry (implying previous failure)
      // Don't ramp up too quickly. Stay at current or one step up if it was easy.
      if (currentAtomDifficulty === 'easy') return 'medium'; // Succeeded on easy after failure, try medium
      return currentAtomDifficulty; // Succeeded on medium/hard after failure, solidify at this level.
    }
  }

  public suggestDifficultyAdjustmentForNextAtomInSubject(
    currentAtomSubject: string, // eslint-disable-line @typescript-eslint/no-unused-vars
    currentAtomDifficulty: DifficultyLevel,
    performanceOfLastAtom: LearningAtomPerformance,
    historicalSubjectSuccessRate?: number // Overall success rate in this subject (0.0 to 1.0)
  ): DifficultyLevel {
    console.log(`[AdaptiveDifficultyEngine] Suggesting adjustment for next atom in subject. Last atom success: ${performanceOfLastAtom.success}`);

    if (performanceOfLastAtom.success) {
      if (performanceOfLastAtom.firstAttemptSuccess && performanceOfLastAtom.hintsUsed === 0) {
        // Strong success
        if (currentAtomDifficulty === 'easy') return 'medium';
        if (currentAtomDifficulty === 'medium') {
            // If historical success in subject is also high, go hard. Otherwise, stay medium.
            return (historicalSubjectSuccessRate && historicalSubjectSuccessRate > 0.75) ? 'hard' : 'medium';
        }
        return 'hard'; // Already hard, stay hard
      } else {
        // Moderate success (e.g., needed hints or multiple attempts but got there)
        // Stay at current difficulty, or one step down if they were on hard and struggled a bit
        if (currentAtomDifficulty === 'hard' && (performanceOfLastAtom.attempts > 1 || performanceOfLastAtom.hintsUsed > 0)) return 'medium';
        return currentAtomDifficulty;
      }
    } else {
      // Failure
      if (currentAtomDifficulty === 'hard') return 'medium';
      if (currentAtomDifficulty === 'medium') return 'easy';
      return 'easy'; // Already easy, stay easy
    }
  }
}

export default new AdaptiveDifficultyEngine();
