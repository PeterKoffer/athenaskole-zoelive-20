import { DailyUniverse, LearningAtom, LearningAtomPerformance } from '@/types/learning';
import { mockUserProgressService } from './mockUserProgressService';
import curriculumStepsData from '../../public/data/curriculum-steps.json'; // Adjusted path
import { CurriculumStep } from '@/types/curriculum';
import AdaptiveDifficultyEngine from './AdaptiveDifficultyEngine'; // Import the engine

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
    // This doesn't affect currentSessionAtomPerformance, which is for new interactions.
    if (this.currentUniverse) {
      for (const atom of this.currentUniverse.learningAtoms) {
        const isObjectiveHistoricallyCompleted = await mockUserProgressService.isObjectiveCompleted(userId, atom.curriculumObjectiveId);
        atom.isCompleted = isObjectiveHistoricallyCompleted;
        // Note: atom.performance is for the *current* attempt in *this* session.
      }
    }
    console.log(`[UniverseSessionManager] Session started for user: ${userId}, universe theme: ${universe.theme}`);
  }

  public recordAtomPerformance(atomId: string, performance: LearningAtomPerformance): void {
    if (!this.currentUserId || !this.currentUniverse) {
      console.error("[UniverseSessionManager] Cannot record performance: No active session.");
      return;
    }

    const atom = this.currentUniverse.learningAtoms.find(a => a.id === atomId);
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
    });

    // --- Foundation for Adaptation (Example: Suggesting difficulty for a retry) ---
    // This part is conceptual for now, as actual retry mechanism isn't fully built.
    if (!performance.success && performance.attempts < 3) { // Example: if failed and can retry
        const suggestedRetryDifficulty = AdaptiveDifficultyEngine.suggestNextDifficultyOnRetry(
            atom.difficulty,
            performance
            // We could also pass historical metrics for this objective if needed by the engine's rule
        );
        console.log(`[UniverseSessionManager] For objective ${atom.curriculumObjectiveTitle}, a retry could be at difficulty: ${suggestedRetryDifficulty}`);
        // Next step would be to trigger UI for retry, and if user accepts,
        // potentially call DailyUniverseGenerator to create a new atom instance for this objective
        // with the new difficulty, and then replace/insert it into the currentUniverse.learningAtoms.
        // This is out of scope for the current plan step's core implementation.
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
    console.log(`[UniverseSessionManager] Session ended for user: ${this.currentUserId}.`);
    // Potentially save summary of currentSessionAtomPerformance or other cleanup
    this.currentUserId = null;
    this.currentUniverse = null;
    this.currentSessionAtomPerformance.clear();
  }

  // Add other methods as needed, e.g., getCurrentAtom, nextAtom, getSessionProgressPercentage etc.
}

export default new UniverseSessionManager();
