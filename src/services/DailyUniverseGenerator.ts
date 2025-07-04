import curriculumStepsData from '../../public/data/curriculum-steps.json'; // Adjusted path
import { CurriculumStep, Curriculum } from '@/types/curriculum';
import { LearningAtom, DailyUniverse } from '@/types/learning';
import { mockUserProgressService } from './mockUserProgressService'; // Assuming path is correct

interface DailyUniverseParams {
  userId: string;
  studentAge: number; // Used to infer a general grade level if no specific current step is found
  // theme?: string; // Future: Allow theme selection or make it dynamic
}

const MAX_ATOMS_PER_DAY = 8;
const MIN_ATOMS_PER_DAY = 5; // Ensure at least some content
const SUBJECT_DIVERSITY_TARGET = 3; // Aim for at least this many different subjects

// Dummy theme and context generation - to be replaced by dynamic narrative generation
const THEMES = [
  {
    name: 'Galactic Research Mission',
    contexts: {
      default: "As part of our mission, we need to investigate...",
      Mathematics: "The ship's navigation system requires precise calculations for...",
      Science: "Our sensors have detected an anomaly! We need to analyze data regarding...",
      English: "We've intercepted a coded message. Let's decipher its meaning concerning...",
      History: "Ancient alien ruins on this planet might hold clues about... Let's research..."
    },
    intro: "Welcome, Space Cadet! Today's Galactic Research Mission takes us to the Kepler-186f system. Prepare for exciting discoveries!",
    outro: "Mission accomplished, Cadet! Your findings have been invaluable. See you tomorrow for a new adventure!"
  },
  // Add more themes like 'Time Detective Agency', 'Guardian of the Living Forest'
];

export class DailyUniverseGenerator {
  private curriculumSteps: CurriculumStep[] = curriculumStepsData as CurriculumStep[];

  private getContextForObjective(themeName: string, subject: string, objectiveTitle: string): string {
    const theme = THEMES.find(t => t.name === themeName);
    if (!theme) return `Let's learn about: ${objectiveTitle}`;
    return (theme.contexts[subject as keyof typeof theme.contexts] || theme.contexts.default || `Explore ${objectiveTitle}`)
            .replace("...", objectiveTitle.toLowerCase());
  }

  public async generateUniverse(params: DailyUniverseParams): Promise<DailyUniverse | null> {
    const { userId, studentAge } = params;
    console.log(`[DailyUniverseGenerator] Generating universe for userId: ${userId}, age: ${studentAge}`);

    const userProgress = await mockUserProgressService.getUserProgress(userId);

    // 1. Determine student's current learning focus (active steps)
    let activeStepNumbers: number[] = [];
    const allStepsSorted = [...this.curriculumSteps].sort((a, b) => a.stepNumber - b.stepNumber);

    let primaryActiveStepFound = false;
    for (const step of allStepsSorted) {
      const stepProgress = userProgress.find(sp => sp.stepId === step.id);
      if (!stepProgress || !stepProgress.isCompleted) {
        activeStepNumbers.push(step.stepNumber);
        primaryActiveStepFound = true;
        if (activeStepNumbers.length >= 2) break; // Consider current and next step
      }
    }

    if (!primaryActiveStepFound && allStepsSorted.length > 0) { // All steps completed or no progress, start from beginning or an age-appropriate step
      const inferredGradeLevel = Math.max(0, studentAge - 6); // K=0, G1=1 etc.
      const targetStep = allStepsSorted.find(s => s.stepNumber === inferredGradeLevel + 1) || allStepsSorted[0];
      activeStepNumbers = [targetStep.stepNumber];
      if (targetStep.stepNumber < allStepsSorted.length) {
        activeStepNumbers.push(targetStep.stepNumber + 1);
      }
    }
     if (activeStepNumbers.length === 0 && allStepsSorted.length > 0) { // Still nothing, maybe user has no progress records at all
        activeStepNumbers.push(allStepsSorted[0].stepNumber); // Default to first step
    }


    console.log(`[DailyUniverseGenerator] Active step numbers for focus: ${activeStepNumbers.join(', ')}`);

    // 2. Gather potential objectives from these active steps
    let potentialObjectives: Curriculum[] = [];
    activeStepNumbers.forEach(stepNum => {
      const step = this.curriculumSteps.find(s => s.stepNumber === stepNum);
      if (step) {
        potentialObjectives.push(...step.curriculums);
      }
    });

    console.log(`[DailyUniverseGenerator] Found ${potentialObjectives.length} potential objectives initially.`);

    // 3. Filter out completed objectives
    const uncompletedObjectives = potentialObjectives.filter(obj => {
      const stepProg = userProgress.find(sp => sp.stepId === obj.stepId);
      return !stepProg || !stepProg.curriculumProgress[obj.id];
    });
    console.log(`[DailyUniverseGenerator] Found ${uncompletedObjectives.length} uncompleted objectives.`);

    // 4. Prioritize & Select Objectives (Simplified for now, more complex weighting can be added)
    // For this iteration, we'll shuffle uncompleted and try to get subject diversity
    let selectedObjectives: Curriculum[] = [];
    const shuffledUncompleted = [...uncompletedObjectives].sort(() => 0.5 - Math.random());

    const objectivesBySubject: Record<string, Curriculum[]> = {};
    shuffledUncompleted.forEach(obj => {
      if (!objectivesBySubject[obj.subject]) {
        objectivesBySubject[obj.subject] = [];
      }
      objectivesBySubject[obj.subject].push(obj);
    });

    // Try to pick to ensure subject diversity first, then fill up
    const subjectsPresent = Object.keys(objectivesBySubject);
    let atomCount = 0;

    for (let i = 0; i < SUBJECT_DIVERSITY_TARGET && i < subjectsPresent.length; i++) {
      const subjectKey = subjectsPresent[i];
      const objFromSubject = objectivesBySubject[subjectKey].shift(); // Get one
      if (objFromSubject) {
        selectedObjectives.push(objFromSubject);
        atomCount++;
      }
    }

    // Fill remaining slots from shuffled list, avoiding duplicates
    for (const obj of shuffledUncompleted) {
      if (atomCount >= MAX_ATOMS_PER_DAY) break;
      if (!selectedObjectives.find(so => so.id === obj.id)) {
        selectedObjectives.push(obj);
        atomCount++;
      }
    }

    // If not enough, try adding some recently completed for revision (very basic)
    if (selectedObjectives.length < MIN_ATOMS_PER_DAY) {
        const completedObjectives = potentialObjectives.filter(obj => {
            const stepProg = userProgress.find(sp => sp.stepId === obj.stepId);
            return stepProg && stepProg.curriculumProgress[obj.id];
        }).sort(() => 0.5 - Math.random());

        for (const obj of completedObjectives) {
            if (selectedObjectives.length >= MIN_ATOMS_PER_DAY) break;
            if (!selectedObjectives.find(so => so.id === obj.id)) {
                selectedObjectives.push(obj); // Mark for revision later
            }
        }
    }


    if (selectedObjectives.length === 0) {
      console.log("[DailyUniverseGenerator] No objectives selected. Universe generation failed or student has completed all available content in focus.");
      // Fallback: select a few from the very first step if truly nothing.
      const firstStep = allStepsSorted[0];
      if(firstStep && firstStep.curriculums.length > 0){
        selectedObjectives = firstStep.curriculums.slice(0, Math.min(MIN_ATOMS_PER_DAY, firstStep.curriculums.length));
        console.log(`[DailyUniverseGenerator] Fallback: Selected ${selectedObjectives.length} objectives from the first step.`);
      } else {
        return null; // Cannot generate a universe
      }
    }

    console.log(`[DailyUniverseGenerator] Selected ${selectedObjectives.length} objectives for the universe.`);

    // 5. Create LearningAtoms (on-the-fly based on selected theme and objectives)
    // For now, pick a random theme
    const currentTheme = THEMES[Math.floor(Math.random() * THEMES.length)];

    const learningAtoms: LearningAtom[] = selectedObjectives.map((obj, index) => {
      // Simple type/interaction assignment based on subject (can be more sophisticated)
      let type: LearningAtom['type'] = 'challenge';
      let interactionType: LearningAtom['interactionType'] = 'puzzle';
      if (obj.subject.toLowerCase().includes('science')) {
        type = 'exploration'; interactionType = 'experiment';
      } else if (obj.subject.toLowerCase().includes('english') || obj.subject.toLowerCase().includes('dansk')) {
        type = 'creation'; interactionType = 'story';
      } else if (obj.subject.toLowerCase().includes('history')) {
        type = 'discovery'; interactionType = 'creative';
      }


      return {
        id: `atom-${obj.id}-${Date.now()}-${index}`, // Ensure unique atom ID
        type,
        subject: obj.subject,
        curriculumObjectiveId: obj.id,
        curriculumObjectiveTitle: obj.title,
        narrativeContext: this.getContextForObjective(currentTheme.name, obj.subject, obj.title),
        estimatedMinutes: obj.duration || 15, // Use objective's duration or default
        interactionType,
        content: {
          title: obj.title,
          description: obj.description, // This could be expanded with more specific instructions for the atom
          data: { standards: obj.standards } // Example additional data
        },
      };
    });

    const totalMinutes = learningAtoms.reduce((sum, atom) => sum + atom.estimatedMinutes, 0);

    const universe: DailyUniverse = {
      userId,
      theme: currentTheme.name,
      storylineIntro: currentTheme.intro,
      learningAtoms,
      storylineOutro: currentTheme.outro,
      estimatedTotalMinutes: totalMinutes,
      dateGenerated: new Date().toISOString(),
    };

    console.log(`[DailyUniverseGenerator] Generated universe with ${universe.learningAtoms.length} atoms. Theme: ${universe.theme}. Est. Time: ${totalMinutes}m.`);
    return universe;
  }
}

export default new DailyUniverseGenerator();
