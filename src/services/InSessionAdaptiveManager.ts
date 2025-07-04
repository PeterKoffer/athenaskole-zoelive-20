
import { LearningAtom, LearningAtomPerformance } from '@/types/learning';
import { DifficultyLevel } from '@/services/AdaptiveDifficultyEngine';

interface InSessionPerformanceMetrics {
  consecutiveCorrect: number;
  consecutiveIncorrect: number;
  totalAttempts: number;
  averageResponseTime: number;
  hintsRequested: number;
  timeSpentSeconds: number;
  strugglingIndicators: string[];
  masteryIndicators: string[];
}

interface AtomVariation {
  difficulty: DifficultyLevel;
  contentModifications: {
    simplifiedInstructions?: string;
    additionalHints?: string[];
    visualAids?: string[];
    scaffolding?: string[];
    advancedChallenges?: string[];
  };
  interactionModifications: {
    allowMoreAttempts?: boolean;
    provideStepByStep?: boolean;
    enableHints?: boolean;
    timeLimit?: number;
  };
}

export class InSessionAdaptiveManager {
  private sessionMetrics: Map<string, InSessionPerformanceMetrics> = new Map();
  private atomVariations: Map<string, AtomVariation[]> = new Map();

  public startAtomSession(atomId: string): void {
    console.log(`[InSessionAdaptiveManager] Starting session for atom: ${atomId}`);
    
    this.sessionMetrics.set(atomId, {
      consecutiveCorrect: 0,
      consecutiveIncorrect: 0,
      totalAttempts: 0,
      averageResponseTime: 0,
      hintsRequested: 0,
      timeSpentSeconds: 0,
      strugglingIndicators: [],
      masteryIndicators: []
    });
  }

  public recordAtomInteraction(
    atomId: string, 
    isCorrect: boolean, 
    responseTimeSeconds: number,
    hintsUsed: number = 0
  ): void {
    const metrics = this.sessionMetrics.get(atomId);
    if (!metrics) {
      console.warn(`[InSessionAdaptiveManager] No session found for atom: ${atomId}`);
      return;
    }

    metrics.totalAttempts++;
    metrics.timeSpentSeconds += responseTimeSeconds;
    metrics.hintsRequested += hintsUsed;
    
    // Update response time average
    metrics.averageResponseTime = metrics.timeSpentSeconds / metrics.totalAttempts;

    if (isCorrect) {
      metrics.consecutiveCorrect++;
      metrics.consecutiveIncorrect = 0;
      
      // Check for mastery indicators
      if (responseTimeSeconds < 10 && hintsUsed === 0) {
        metrics.masteryIndicators.push('quick_correct_response');
      }
      if (metrics.consecutiveCorrect >= 3) {
        metrics.masteryIndicators.push('multiple_consecutive_correct');
      }
    } else {
      metrics.consecutiveIncorrect++;
      metrics.consecutiveCorrect = 0;
      
      // Check for struggling indicators
      if (responseTimeSeconds > 60) {
        metrics.strugglingIndicators.push('slow_response');
      }
      if (hintsUsed > 2) {
        metrics.strugglingIndicators.push('excessive_hints');
      }
      if (metrics.consecutiveIncorrect >= 2) {
        metrics.strugglingIndicators.push('multiple_consecutive_incorrect');
      }
    }

    console.log(`[InSessionAdaptiveManager] Updated metrics for ${atomId}:`, {
      attempts: metrics.totalAttempts,
      consecutive: { correct: metrics.consecutiveCorrect, incorrect: metrics.consecutiveIncorrect },
      struggling: metrics.strugglingIndicators.length,
      mastery: metrics.masteryIndicators.length
    });
  }

  public shouldAdaptAtomDifficulty(atomId: string): { 
    shouldAdapt: boolean; 
    newDifficulty?: DifficultyLevel; 
    reason?: string;
    contentModifications?: AtomVariation['contentModifications'];
  } {
    const metrics = this.sessionMetrics.get(atomId);
    if (!metrics || metrics.totalAttempts < 2) {
      return { shouldAdapt: false };
    }

    // Check for need to make easier (stronger conditions for clearer struggling signals)
    if (metrics.strugglingIndicators.length >= 2 || metrics.consecutiveIncorrect >= 2) {
      return {
        shouldAdapt: true,
        newDifficulty: 'easy',
        reason: 'Student showing signs of struggle - providing additional support',
        contentModifications: {
          simplifiedInstructions: 'Let me break this down into simpler steps for you.',
          additionalHints: [
            'Take your time and think through each step',
            'Remember the key concepts we just learned',
            'Try breaking the problem into smaller parts'
          ],
          scaffolding: [
            'Step 1: Identify what we know',
            'Step 2: Determine what we need to find',
            'Step 3: Choose the right approach'
          ]
        }
      };
    }

    // Check for need to make harder (evidence of mastery)
    if (metrics.masteryIndicators.length >= 2 || metrics.consecutiveCorrect >= 3) {
      return {
        shouldAdapt: true,
        newDifficulty: 'hard',
        reason: 'Student demonstrating mastery - ready for enhanced challenge',
        contentModifications: {
          advancedChallenges: [
            'Now try solving this in a different way',
            'Can you explain why this method works?',
            'What would happen if we changed this variable?'
          ]
        }
      };
    }

    return { shouldAdapt: false };
  }

  public generateAdaptiveAtomVariant(
    originalAtom: LearningAtom,
    targetDifficulty: DifficultyLevel,
    contentModifications: AtomVariation['contentModifications']
  ): LearningAtom {
    console.log(`[InSessionAdaptiveManager] Generating ${targetDifficulty} variant for atom: ${originalAtom.id}`);

    const adaptedAtom: LearningAtom = {
      ...originalAtom,
      id: `${originalAtom.id}-adapted-${targetDifficulty}-${Date.now()}`,
      difficulty: targetDifficulty,
      variantId: `adaptive-${targetDifficulty}`,
      content: {
        ...originalAtom.content,
        description: this.adaptContentDescription(
          originalAtom.content.description,
          targetDifficulty,
          contentModifications
        ),
        data: {
          ...originalAtom.content.data,
          adaptiveModifications: contentModifications,
          originalDifficulty: originalAtom.difficulty,
          adaptationReason: `Real-time adaptation to ${targetDifficulty} based on current performance`,
          adaptationTimestamp: new Date().toISOString()
        }
      }
    };

    return adaptedAtom;
  }

  private adaptContentDescription(
    originalDescription: string,
    targetDifficulty: DifficultyLevel,
    modifications: AtomVariation['contentModifications']
  ): string {
    let adaptedDescription = originalDescription;

    if (targetDifficulty === 'easy' && modifications.simplifiedInstructions) {
      adaptedDescription = `${modifications.simplifiedInstructions}\n\n${adaptedDescription}`;
    }

    if (targetDifficulty === 'hard' && modifications.advancedChallenges) {
      adaptedDescription = `${adaptedDescription}\n\nBonus Challenge: ${modifications.advancedChallenges[0]}`;
    }

    return adaptedDescription;
  }

  public getSessionSummary(atomId: string): InSessionPerformanceMetrics | null {
    return this.sessionMetrics.get(atomId) || null;
  }

  public endAtomSession(atomId: string): LearningAtomPerformance | null {
    const metrics = this.sessionMetrics.get(atomId);
    if (!metrics) {
        console.warn(`[InSessionAdaptiveManager] No metrics found for atom: ${atomId}`);
        return null;
    }

    const performance: LearningAtomPerformance = {
      attempts: metrics.totalAttempts,
      timeTakenSeconds: metrics.timeSpentSeconds,
      hintsUsed: metrics.hintsRequested,
      success: metrics.consecutiveCorrect > 0 || metrics.totalAttempts > 0,
      firstAttemptSuccess: metrics.totalAttempts === 1 && metrics.consecutiveCorrect === 1,
      timestamp: new Date().toISOString()
    };

    // Clean up session data
    this.sessionMetrics.delete(atomId);

    console.log(`[InSessionAdaptiveManager] Session ended for ${atomId}. Final performance:`, {
      ...performance,
      adaptiveIndicators: {
        strugglingSignals: metrics.strugglingIndicators.length,
        masterySignals: metrics.masteryIndicators.length
      }
    });
    
    return performance;
  }

  public reset(): void {
    this.sessionMetrics.clear();
    this.atomVariations.clear();
    console.log('[InSessionAdaptiveManager] Reset all session data');
  }
}

export default new InSessionAdaptiveManager();
