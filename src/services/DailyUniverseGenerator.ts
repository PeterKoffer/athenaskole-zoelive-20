import { DailyUniverse } from '@/types/learning';
import { CurriculumNode } from '@/types/curriculum/CurriculumNode';
import curriculumData from '../../public/data/curriculum-steps.json';

// Placeholder for student profile type
interface StudentProfile {
  gradeLevel?: number;
  learningPreferences?: string[];
  interests?: string[];
}

class DailyUniverseGenerator {
  public generate(studentProfile: StudentProfile): DailyUniverse {
    const gradeLevel = studentProfile.gradeLevel || 4; // Default to grade 4 if not specified

    const objectives = this.selectObjectives(gradeLevel);

    const universe: DailyUniverse = {
      id: `universe-${Date.now()}`,
      title: 'A Day of Discovery',
      description: 'Explore a variety of subjects and challenges to expand your knowledge.',
      theme: 'interdisciplinary',
      objectives: objectives,
      learningAtoms: [], // This will be populated later
    };

    return universe;
  }

  private selectObjectives(gradeLevel: number): CurriculumNode[] {
    const allObjectives: CurriculumNode[] = curriculumData.flatMap((step: any) =>
      step.curriculums.map((curriculum: any) => ({
        ...curriculum,
        subjectName: step.subject,
      }))
    );

    const gradeFilteredObjectives = allObjectives.filter(
      (objective) => (objective.educationalLevel || '').includes(String(gradeLevel))
    );

    // Simple selection logic: pick 3 random objectives
    const selectedObjectives: CurriculumNode[] = [];
    const availableObjectives = [...gradeFilteredObjectives];

    for (let i = 0; i < 3 && availableObjectives.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * availableObjectives.length);
      selectedObjectives.push(availableObjectives[randomIndex]);
      availableObjectives.splice(randomIndex, 1);
    }

    return selectedObjectives;
  }
}

export const dailyUniverseGenerator = new DailyUniverseGenerator();
