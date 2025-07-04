
import { DailyUniverse, LearningAtom, LearningAtomPerformance } from '@/types/learning';
import { mockUserProgressService } from './mockUserProgressService';
import curriculumStepsData from '../../public/data/curriculum-steps.json';
import { CurriculumStep } from '@/types/curriculum';
import AdaptiveDifficultyEngine from './AdaptiveDifficultyEngine';

export class UniverseSessionManager {
  private currentUserId: string | null = null;
  private currentUniverse: DailyUniverse | null = null;
  // Stores performance for current session atoms. Key: atomId
  private currentSessionAtomPerformance: Map<string, LearningAtomPerformance> = new Map();
  private curriculumSteps: CurriculumStep[] = curriculumStepsData as CurriculumStep[];

  public async startSession(userId: string, universe: DailyUniverse): Promise<void> {
    this.currentUserId = userId;
    this.currentUniverse = universe;
    this.currentSessionAtomPerformance.clear(); // Reset for new session

    // Pre-populate atom isCompleted status based on historical objective completion
    if (this.currentUniverse) {
      for (const atom of this.currentUniverse.learningAtoms) {
        const isObjectiveHistoricallyCompleted = await mockUserProgressService.isObjectiveCompleted(userId, atom.curriculumObjectiveId);
        atom.isCompleted = isObjectiveHistoricallyCompleted;
      }
    }
    console.log(`[UniverseSessionManager] Session started for user: ${userId}, universe theme: ${universe.theme}`);
  }

  public recordAtomPerformance(atomId: string, performance: LearningAtomPerformance): void {
    if (!this.currentUserId || !this.currentUniverse) {
      console.error("[UniverseSessionManager] Cannot record performance: No active session.");
      return;
    }

    console.log(`[UniverseSessionManager] Recording performance for atomId: ${atomId}`, performance);

    // Find the atom by atomId (might be adapted with suffix)
    const atom = this.currentUniverse.learningAtoms.find(a => 
      a.id === atomId || atomId.startsWith(a.id + '-')
    );
    
    if (!atom) {
      console.error(`[UniverseSessionManager] Atom with id ${atomId} not found in current universe to record performance.`);
      return;
    }

    // Store performance for this specific atom instance in this session
    this.currentSessionAtomPerformance.set(atomId, performance);
    atom.performance = performance; // Store on the atom instance as well
    atom.isCompleted = performance.success; // Update atom's completion status based on this performance

    console.log(`[UniverseSessionManager] Performance recorded for Atom ${atomId} (Objective: ${atom.curriculumObjectiveTitle}). Success: ${performance.success}`);

    // Find the stepId associated with this curriculumObjectiveId
    const stepIdForObjective = this.getStepIdForObjective(atom.curriculumObjectiveId);

    if (!stepIdForObjective) {
        console.error(`[UniverseSessionManager] Could not find stepId for objectiveId: ${atom.curriculumObjectiveId} when recording performance.`);
        return;
    }

    // Update persistent historical progress using the mock service
    mockUserProgressService.recordObjectiveAttempt(
      this.currentUserId,
      stepIdForObjective,
      atom.curriculumObjectiveId,
      performance
    ).then(() => {
        // After updating objective, check if the whole step is complete
        const stepDefinition = this.curriculumSteps.find(s => s.id === stepIdForObjective);
        if (stepDefinition) {
            const allObjectiveIdsInStep = stepDefinition.curriculums.map(c => c.id);
            mockUserProgressService.checkAndUpdateStepCompletion(this.currentUserId!, stepIdForObjective, allObjectiveIdsInStep);
        }
    }).catch(error => {
        console.error('[UniverseSessionManager] Error recording objective attempt:', error);
    });

    // Enhanced adaptive suggestion for potential retry scenarios
    if (!performance.success && performance.attempts < 3) { 
        // Get historical metrics for more informed retry suggestion
        mockUserProgressService.getObjectiveProgress(this.currentUserId, atom.curriculumObjectiveId)
            .then(historicalMetrics => {
                const suggestedRetryDifficulty = AdaptiveDifficultyEngine.suggestNextDifficultyOnRetry(
                    atom.difficulty,
                    performance,
                    historicalMetrics
                );
                console.log(`[UniverseSessionManager] For objective ${atom.curriculumObjectiveTitle}, suggested retry difficulty: ${suggestedRetryDifficulty} (Historical context: ${historicalMetrics ? 'available' : 'none'})`);
            })
            .catch(error => {
                console.error('[UniverseSessionManager] Error getting historical metrics for retry suggestion:', error);
            });
    }
  }

  private getStepIdForObjective(objectiveId: string): string | null {
    for (const step of this.curriculumSteps) {
        if (step.curriculums.some(c => c.id === objectiveId)) {
            return step.id;
        }
    }
    return null;
  }

  public getAtomPerformance(atomId: string): LearningAtomPerformance | undefined {
    return this.currentSessionAtomPerformance.get(atomId);
  }

  public isAtomCompletedInSession(atomId: string): boolean {
    const performance = this.currentSessionAtomPerformance.get(atomId);
    return performance?.success || false;
  }

  public getCurrentUniverse(): DailyUniverse | null {
    return this.currentUniverse;
  }

  public endSession(): void {
    console.log(`[UniverseSessionManager] Session ended for user: ${this.currentUserId}. Total atoms completed: ${this.currentSessionAtomPerformance.size}`);
    
    // Log session summary before cleanup
    if (this.currentSessionAtomPerformance.size > 0) {
        const successfulAtoms = Array.from(this.currentSessionAtomPerformance.values()).filter(p => p.success).length;
        console.log(`[UniverseSessionManager] Session summary - Successful: ${successfulAtoms}/${this.currentSessionAtomPerformance.size} atoms`);
    }
    
    this.currentUserId = null;
    this.currentUniverse = null;
    this.currentSessionAtomPerformance.clear();
  }
}

export default new UniverseSessionManager();
