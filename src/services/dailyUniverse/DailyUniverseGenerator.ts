
import { supabase } from '@/integrations/supabase/client';
import UNESCOCurriculumService from '../curriculum/UNESCOCurriculumService';
import { CurriculumStep } from '@/types/curriculum';

export interface UniverseTheme {
  id: string;
  title: string;
  setting: string;
  mainCharacter: string;
  conflict: string;
  ageAppropriate: number[];
  subjects: string[];
}

export interface LearningAtom {
  id: string;
  type: 'exploration' | 'challenge' | 'discovery' | 'creation' | 'reflection';
  subject: string;
  curriculumObjective: string;
  narrativeContext: string;
  estimatedMinutes: number;
  interactionType: 'story' | 'game' | 'experiment' | 'puzzle' | 'creative';
  content: any;
}

export interface DailyUniverse {
  id: string;
  date: string;
  theme: UniverseTheme;
  overallNarrative: string;
  totalEstimatedTime: number;
  learningAtoms: LearningAtom[];
  curriculumCoverage: {
    mathematics: string[];
    language: string[];
    science: string[];
    socialStudies: string[];
    arts: string[];
  };
}

class DailyUniverseGenerator {
  private themes: UniverseTheme[] = [
    {
      id: 'space-explorer',
      title: 'Galactic Research Mission',
      setting: 'A space station orbiting an unknown planet',
      mainCharacter: 'Commander Nova (the student)',
      conflict: 'Must gather data and solve mysteries to help the planet',
      ageAppropriate: [6, 7, 8, 9, 10, 11, 12],
      subjects: ['mathematics', 'science', 'language', 'problem-solving']
    },
    {
      id: 'time-detective',
      title: 'The Time Detective Agency',
      setting: 'A magical office that can travel through time',
      mainCharacter: 'Detective Time-Keeper (the student)',
      conflict: 'Historical mysteries need solving using clues from different eras',
      ageAppropriate: [7, 8, 9, 10, 11, 12, 13],
      subjects: ['history', 'mathematics', 'language', 'science', 'geography']
    },
    {
      id: 'eco-guardian',
      title: 'Guardian of the Living Forest',
      setting: 'An enchanted forest ecosystem',
      mainCharacter: 'Forest Guardian (the student)',
      conflict: 'The forest needs help - solve environmental challenges',
      ageAppropriate: [6, 7, 8, 9, 10, 11],
      subjects: ['science', 'mathematics', 'environmental-studies', 'problem-solving']
    },
    {
      id: 'inventor-lab',
      title: 'The Young Inventor\'s Workshop',
      setting: 'A high-tech inventor\'s laboratory',
      mainCharacter: 'Chief Inventor (the student)',
      conflict: 'Must design and build solutions to help the community',
      ageAppropriate: [8, 9, 10, 11, 12, 13],
      subjects: ['mathematics', 'science', 'engineering', 'arts', 'problem-solving']
    }
  ];

  async generateDailyUniverse(
    userId: string, 
    studentAge: number, 
    currentDate: string,
    curriculumSteps: CurriculumStep[]
  ): Promise<DailyUniverse> {
    console.log(`🌟 Generating Daily Universe for age ${studentAge} on ${currentDate}`);

    // Select appropriate theme based on age
    const availableThemes = this.themes.filter(theme => 
      theme.ageAppropriate.includes(studentAge)
    );
    const selectedTheme = availableThemes[Math.floor(Math.random() * availableThemes.length)];

    // Get student's current curriculum needs
    const curriculumNeeds = await this.identifyDailyCurriculumNeeds(userId, studentAge, curriculumSteps);
    
    // Generate the overarching narrative
    const overallNarrative = await this.generateNarrativeFramework(selectedTheme, curriculumNeeds);
    
    // Create learning atoms that fit the narrative
    const learningAtoms = await this.createIntegratedLearningAtoms(
      selectedTheme, 
      curriculumNeeds, 
      overallNarrative
    );

    const universe: DailyUniverse = {
      id: `universe-${Date.now()}`,
      date: currentDate,
      theme: selectedTheme,
      overallNarrative,
      totalEstimatedTime: learningAtoms.reduce((total, atom) => total + atom.estimatedMinutes, 0),
      learningAtoms,
      curriculumCoverage: this.calculateCurriculumCoverage(learningAtoms)
    };

    console.log(`✨ Generated Daily Universe: "${selectedTheme.title}" with ${learningAtoms.length} learning atoms`);
    return universe;
  }

  private async identifyDailyCurriculumNeeds(
    userId: string, 
    studentAge: number, 
    curriculumSteps: CurriculumStep[]
  ): Promise<any[]> {
    // Get student's current progress to determine which curriculum they need
    const gradeLevel = Math.max(1, studentAge - 5); // Rough age to grade conversion
    const relevantSteps = curriculumSteps.filter(step => 
      step.stepNumber <= gradeLevel + 2 && step.stepNumber >= gradeLevel - 1
    );

    const curriculumNeeds: any[] = [];

    // Extract curriculum from relevant steps across subjects
    relevantSteps.forEach(step => {
      if (step.curriculums) {
        step.curriculums.forEach(curriculum => {
          curriculumNeeds.push({
            subject: curriculum.subject,
            title: curriculum.title,
            description: curriculum.description,
            content: curriculum.content,
            estimatedTime: curriculum.duration,
            difficulty: step.difficulty,
            stepNumber: step.stepNumber
          });
        });
      }
    });

    // Shuffle and select 6-8 diverse curriculum points for the day
    const shuffled = curriculumNeeds.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 8);
  }

  private async generateNarrativeFramework(theme: UniverseTheme, curriculumNeeds: any[]): Promise<string> {
    const subjects = [...new Set(curriculumNeeds.map(need => need.subject))];
    
    const narrativeTemplates = {
      'space-explorer': `Welcome aboard the Starship Discovery, Commander! Our long-range sensors have detected an fascinating planet that needs our help. As the ship's lead researcher, you'll need to use your knowledge of ${subjects.join(', ')} to complete critical missions. Each challenge you solve brings us closer to understanding this mysterious world and helping its inhabitants. Your scientific training and problem-solving skills will be essential for our success!`,
      
      'time-detective': `Welcome to the Time Detective Agency! A series of mysterious events across different time periods needs your expert investigation. As our newest detective, you'll travel through history, gathering clues using your skills in ${subjects.join(', ')}. Each era presents unique puzzles that only someone with your knowledge can solve. The timeline depends on your success!`,
      
      'eco-guardian': `The ancient forest has chosen you as its new Guardian! The woodland creatures need your help to maintain the delicate balance of their ecosystem. Using your understanding of ${subjects.join(', ')}, you'll solve environmental challenges, help species thrive, and ensure the forest remains healthy for generations to come. Every decision you make affects the entire forest community!`,
      
      'inventor-lab': `Welcome to your new invention laboratory! The community has challenges that need creative solutions, and they're counting on your engineering genius. Using your knowledge of ${subjects.join(', ')}, you'll design, build, and test inventions that make life better for everyone. Each successful invention unlocks new possibilities and more exciting challenges!`
    };

    return narrativeTemplates[theme.id as keyof typeof narrativeTemplates] || narrativeTemplates['space-explorer'];
  }

  private async createIntegratedLearningAtoms(
    theme: UniverseTheme, 
    curriculumNeeds: any[], 
    narrative: string
  ): Promise<LearningAtom[]> {
    const atoms: LearningAtom[] = [];
    let atomOrder = 1;

    // Create varied learning atoms that embed curriculum within the narrative
    for (const need of curriculumNeeds) {
      const atom = await this.createNarrativeAtom(theme, need, atomOrder);
      atoms.push(atom);
      atomOrder++;
    }

    // Add introductory and concluding atoms
    atoms.unshift(await this.createIntroductionAtom(theme, narrative));
    atoms.push(await this.createConclusionAtom(theme, atoms));

    return atoms;
  }

  private async createNarrativeAtom(theme: UniverseTheme, curriculumNeed: any, order: number): Promise<LearningAtom> {
    const narrativeContexts = {
      'space-explorer': {
        mathematics: `The ship's navigation system needs calculations to plot our course safely through the asteroid field.`,
        science: `Our research lab has detected unusual readings that require scientific analysis.`,
        language: `We've received transmissions from the planet that need translation and interpretation.`,
        default: `Mission Control needs your expertise to solve this challenge aboard the starship.`
      },
      'time-detective': {
        mathematics: `Ancient puzzles from this time period require mathematical reasoning to unlock their secrets.`,
        science: `Historical evidence shows scientific principles that need investigation.`,
        language: `Old documents and inscriptions hold clues that need careful reading and analysis.`,
        default: `Your detective skills are needed to piece together this historical mystery.`
      }
    };

    const contexts = narrativeContexts[theme.id as keyof typeof narrativeContexts] || narrativeContexts['space-explorer'];
    const context = contexts[curriculumNeed.subject as keyof typeof contexts] || contexts.default;

    return {
      id: `atom-${order}-${Date.now()}`,
      type: this.selectAtomType(order),
      subject: curriculumNeed.subject,
      curriculumObjective: curriculumNeed.title,
      narrativeContext: context,
      estimatedMinutes: Math.max(15, curriculumNeed.estimatedTime || 20),
      interactionType: this.selectInteractionType(curriculumNeed.subject),
      content: {
        title: curriculumNeed.title,
        description: curriculumNeed.description,
        learning_content: curriculumNeed.content,
        narrative_integration: context,
        theme_connection: theme.title
      }
    };
  }

  private async createIntroductionAtom(theme: UniverseTheme, narrative: string): Promise<LearningAtom> {
    return {
      id: `intro-${Date.now()}`,
      type: 'exploration',
      subject: 'introduction',
      curriculumObjective: 'Daily Universe Introduction',
      narrativeContext: narrative,
      estimatedMinutes: 10,
      interactionType: 'story',
      content: {
        title: `Welcome to ${theme.title}`,
        description: narrative,
        theme: theme,
        type: 'universe-introduction'
      }
    };
  }

  private async createConclusionAtom(theme: UniverseTheme, completedAtoms: LearningAtom[]): Promise<LearningAtom> {
    const subjects = [...new Set(completedAtoms.map(atom => atom.subject))];
    
    return {
      id: `conclusion-${Date.now()}`,
      type: 'reflection',
      subject: 'conclusion',
      curriculumObjective: 'Daily Reflection and Celebration',
      narrativeContext: `Congratulations! You've successfully completed your mission and helped solve all the challenges in ${theme.title}. Let's reflect on everything you learned today.`,
      estimatedMinutes: 15,
      interactionType: 'creative',
      content: {
        title: 'Mission Accomplished!',
        description: `Reflect on your learning journey through ${subjects.join(', ')} today.`,
        achievements: completedAtoms.map(atom => atom.curriculumObjective),
        theme: theme,
        type: 'universe-conclusion'
      }
    };
  }

  private selectAtomType(order: number): LearningAtom['type'] {
    const types: LearningAtom['type'][] = ['exploration', 'challenge', 'discovery', 'creation', 'reflection'];
    return types[order % types.length];
  }

  private selectInteractionType(subject: string): LearningAtom['interactionType'] {
    const subjectMap: Record<string, LearningAtom['interactionType']> = {
      'Mathematics': 'puzzle',
      'English': 'story',
      'Science': 'experiment',
      'History': 'story',
      'Art': 'creative',
      'default': 'game'
    };
    return subjectMap[subject] || subjectMap.default;
  }

  private calculateCurriculumCoverage(atoms: LearningAtom[]) {
    const coverage = {
      mathematics: [],
      language: [],
      science: [],
      socialStudies: [],
      arts: []
    };

    atoms.forEach(atom => {
      const subject = atom.subject.toLowerCase();
      if (subject.includes('math')) {
        coverage.mathematics.push(atom.curriculumObjective);
      } else if (subject.includes('english') || subject.includes('language')) {
        coverage.language.push(atom.curriculumObjective);
      } else if (subject.includes('science')) {
        coverage.science.push(atom.curriculumObjective);
      } else if (subject.includes('history') || subject.includes('geography')) {
        coverage.socialStudies.push(atom.curriculumObjective);
      } else if (subject.includes('art') || subject.includes('music')) {
        coverage.arts.push(atom.curriculumObjective);
      }
    });

    return coverage;
  }
}

export default new DailyUniverseGenerator();
