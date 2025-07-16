
import { CurriculumNode, CurriculumLevel, CurriculumSubject, CurriculumTopic } from '@/types/curriculum/index';
import { CurriculumStats } from './core/CurriculumStats';

export interface ICurriculumService {
  getLevels(): Promise<CurriculumLevel[]>;
  getSubjects(levelId: string): Promise<CurriculumSubject[]>;
  getTopics(subjectId: string): Promise<CurriculumTopic[]>;
  getAllNodes(): Promise<CurriculumNode[]>;
  getStats(): Promise<any>;
}

export class CurriculumService implements ICurriculumService {
  private static instance: CurriculumService;

  public static getInstance(): CurriculumService {
    if (!CurriculumService.instance) {
      CurriculumService.instance = new CurriculumService();
    }
    return CurriculumService.instance;
  }

  async getLevels(): Promise<CurriculumLevel[]> {
    // Mock data for now
    return [
      {
        id: '1',
        name: 'Primary School',
        description: 'Elementary education',
        countryCode: 'US',
        subjects: []
      },
      {
        id: '2',
        name: 'Middle School',
        description: 'Middle school education',
        countryCode: 'US',
        subjects: []
      },
      {
        id: '3',
        name: 'High School',
        description: 'Secondary education',
        countryCode: 'US',
        subjects: []
      }
    ];
  }

  async getSubjects(levelId: string): Promise<CurriculumSubject[]> {
    // Mock data for now
    return [
      {
        id: '1',
        name: 'Mathematics',
        description: 'Math curriculum',
        levelId,
        topics: []
      },
      {
        id: '2',
        name: 'Science',
        description: 'Science curriculum',
        levelId,
        topics: []
      },
      {
        id: '3',
        name: 'English',
        description: 'English curriculum',
        levelId,
        topics: []
      }
    ];
  }

  async getTopics(subjectId: string): Promise<CurriculumTopic[]> {
    // Mock data for now
    const mathTopics = [
      { id: '1', name: 'Algebra', description: 'Basic algebra', subjectId },
      { id: '2', name: 'Geometry', description: 'Basic geometry', subjectId },
      { id: '3', name: 'Statistics', description: 'Basic statistics', subjectId }
    ];

    const scienceTopics = [
      { id: '4', name: 'Biology', description: 'Life sciences', subjectId },
      { id: '5', name: 'Chemistry', description: 'Chemical sciences', subjectId },
      { id: '6', name: 'Physics', description: 'Physical sciences', subjectId }
    ];

    const englishTopics = [
      { id: '7', name: 'Reading', description: 'Reading comprehension', subjectId },
      { id: '8', name: 'Writing', description: 'Creative and academic writing', subjectId },
      { id: '9', name: 'Grammar', description: 'English grammar', subjectId }
    ];

    switch (subjectId) {
      case '1': return mathTopics;
      case '2': return scienceTopics;
      case '3': return englishTopics;
      default: return [];
    }
  }

  async getAllNodes(): Promise<CurriculumNode[]> {
    const levels = await this.getLevels();
    const nodes: CurriculumNode[] = [];

    for (const level of levels) {
      nodes.push({
        id: level.id,
        nodeType: 'level',
        name: level.name,
        description: level.description,
        countryCode: level.countryCode
      });

      const subjects = await this.getSubjects(level.id);
      for (const subject of subjects) {
        nodes.push({
          id: subject.id,
          nodeType: 'subject',
          name: subject.name,
          description: subject.description,
          subjectName: subject.name,
          parentId: level.id
        });

        const topics = await this.getTopics(subject.id);
        for (const topic of topics) {
          nodes.push({
            id: topic.id,
            nodeType: 'topic',
            name: topic.name,
            description: topic.description,
            subjectName: subject.name,
            parentId: subject.id
          });
        }
      }
    }

    return nodes;
  }

  async getStats(): Promise<any> {
    const nodes = await this.getAllNodes();
    return CurriculumStats.generateStats(nodes);
  }
}

// Export singleton instance
export const curriculumService = CurriculumService.getInstance();
