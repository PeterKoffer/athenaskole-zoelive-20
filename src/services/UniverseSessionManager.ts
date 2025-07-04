import { DailyUniverse, LearningAtom } from '@/types/learning';
import { mockUserProgressService } from './mockUserProgressService';
import curriculumStepsData from '../../public/data/curriculum-steps.json'; // Adjusted path
import { CurriculumStep } from '@/types/curriculum';

export class UniverseSessionManager {
  private currentUserId: string | null = null;
  private currentUniverse: DailyUniverse | null = null;
  private atomCompletionStatus: Record<string, boolean> = {}; // Tracks atom completion within the current session { atomId: isCompleted }
  private curriculumSteps: CurriculumStep[] = curriculumStepsData as CurriculumStep[];


  public startSession(userId: string, universe: DailyUniverse): void {
    this.currentUserId = userId;
    this.currentUniverse = universe;
    this.atomCompletionStatus = {}; // Reset for new session

    // Initialize atomCompletionStatus based on user's existing progress for these objectives
    // This is important if a universe is resumed or contains already completed objectives for revision
    universe.learningAtoms.forEach(async (atom) => {
        if (userId){
            const isObjectiveCompleted = await mockUserProgressService.getObjectiveCompletionStatus(userId, atom.curriculumObjectiveId);
            if (isObjectiveCompleted) {
                this.atomCompletionStatus[atom.id] = true;
            } else {
                this.atomCompletionStatus[atom.id] = false;
            }
        }
    });
    console.log(`[UniverseSessionManager] Session started for user: ${userId}, universe theme: ${universe.theme}`);
  }

  public completeLearningAtom(atomId: string): void {
    if (!this.currentUserId || !this.currentUniverse) {
      console.error("[UniverseSessionManager] Cannot complete atom: No active session.");
      return;
    }

    const atom = this.currentUniverse.learningAtoms.find(a => a.id === atomId);
    if (!atom) {
      console.error(`[UniverseSessionManager] Atom with id ${atomId} not found in current universe.`);
      return;
    }

    // Mark atom as complete for this session
    this.atomCompletionStatus[atom.id] = true;
    atom.isCompleted = true; // Also update the atom object in the current universe instance
    console.log(`[UniverseSessionManager] Atom ${atomId} (Objective: ${atom.curriculumObjectiveTitle}) marked as complete.`);

    // Find the stepId associated with this curriculumObjectiveId
    let stepIdForObjective: string | null = null;
    for (const step of this.curriculumSteps) {
        if (step.curriculums.some(c => c.id === atom.curriculumObjectiveId)) {
            stepIdForObjective = step.id;
            break;
        }
    }

    if (!stepIdForObjective) {
        console.error(`[UniverseSessionManager] Could not find stepId for objectiveId: ${atom.curriculumObjectiveId}`);
        return;
    }
    const objectiveStepId = stepIdForObjective;


    // Update persistent progress using the mock service
    mockUserProgressService.updateObjectiveCompletionStatus(
      this.currentUserId,
      objectiveStepId,
      atom.curriculumObjectiveId,
      true
    ).then(() => {
        // After updating objective, check if the whole step is complete
        const stepDefinition = this.curriculumSteps.find(s => s.id === objectiveStepId);
        if (stepDefinition) {
            const allObjectiveIdsInStep = stepDefinition.curriculums.map(c => c.id);
            mockUserProgressService.checkAndUpdateStepCompletion(this.currentUserId!, objectiveStepId, allObjectiveIdsInStep);
        }
    });
  }

  public getAtomCompletionStatus(atomId: string): boolean {
    return this.atomCompletionStatus[atomId] || false;
  }

  public getCurrentUniverse(): DailyUniverse | null {
    return this.currentUniverse;
  }

  public endSession(): void {
    console.log(`[UniverseSessionManager] Session ended for user: ${this.currentUserId}.`);
    // Potentially save session summary or other cleanup
    this.currentUserId = null;
    this.currentUniverse = null;
    this.atomCompletionStatus = {};
  }

  // Add other methods as needed, e.g., getCurrentAtom, nextAtom, previousAtom, getSessionProgressPercentage etc.
}

export default new UniverseSessionManager();
