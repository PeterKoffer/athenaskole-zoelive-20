import curriculumIndex from '../data/unified-curriculum-index.json';
import { CurriculumNode } from '../types/curriculum/CurriculumNode';

class ContentGenerationService {
  private curriculum: { [key: string]: CurriculumNode } = curriculumIndex;

  public getCurriculumNodeById(id: string): CurriculumNode | undefined {
    return this.curriculum[id];
  }

  public findNodesBySubject(subject: string): CurriculumNode[] {
    return Object.values(this.curriculum).filter(node => node.subjectName === subject);
  }

  public findNodesByGrade(grade: string): CurriculumNode[] {
    return Object.values(this.curriculum).filter(node => node.educationalLevel === grade);
  }

  public generateDailyUniverse(studentProfile: any): any {
    // This is a placeholder for the more complex logic to be implemented.
    // For now, let's just grab a few random learning objectives.

    const learningObjectives = Object.values(this.curriculum).filter(
      node => node.nodeType === 'learning_objective'
    );

    const randomObjectives = learningObjectives
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    return {
      title: "A Day of Adventure!",
      description: "Today, you'll embark on a journey of learning and discovery. Complete these tasks to help your community and earn rewards!",
      objectives: randomObjectives,
    };
  }
}

export const contentGenerationService = new ContentGenerationService();
