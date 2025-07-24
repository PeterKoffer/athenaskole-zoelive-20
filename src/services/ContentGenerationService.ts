import curriculumIndex from '../data/unified-curriculum-index.json';
import type { CurriculumNode, CurriculumNodeType } from '../types/curriculum';
import { universeGenerationService } from './UniverseGenerationService';

class ContentGenerationService {
  private curriculum: { [key: string]: CurriculumNode } = {};

  constructor() {
    // Convert the imported JSON data to proper CurriculumNode objects
    this.curriculum = Object.keys(curriculumIndex).reduce((acc, key) => {
      const rawNode = curriculumIndex[key as keyof typeof curriculumIndex] as any;
      acc[key] = {
        id: key,
        parentId: rawNode.parentId || null,
        name: rawNode.name || 'Unnamed Node',
        ...rawNode,
        nodeType: rawNode.nodeType as CurriculumNodeType
      } as CurriculumNode;
      return acc;
    }, {} as { [key: string]: CurriculumNode });
  }

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
    return universeGenerationService.generate(studentProfile);
  }
}

export const contentGenerationService = new ContentGenerationService();
