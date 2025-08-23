// @ts-nocheck

import { ICurriculumService } from './CurriculumService';
import { CurriculumLevel, CurriculumSubject, CurriculumTopic, CurriculumNode } from '@/types/curriculum/index';
import { CurriculumStats } from './core/CurriculumStats';

export class MockCurriculumService implements ICurriculumService {
  async getLevels(): Promise<CurriculumLevel[]> {
    return [
      {
        id: 'elementary',
        name: 'Elementary School',
        description: 'Grades K-5',
        countryCode: 'US',
        subjects: []
      },
      {
        id: 'middle',
        name: 'Middle School', 
        description: 'Grades 6-8',
        countryCode: 'US',
        subjects: []
      },
      {
        id: 'high',
        name: 'High School',
        description: 'Grades 9-12',
        countryCode: 'US',
        subjects: []
      }
    ];
  }

  async getSubjects(levelId: string): Promise<CurriculumSubject[]> {
    return [
      {
        id: 'math',
        name: 'Mathematics',
        description: 'Mathematical concepts and problem solving',
        levelId,
        topics: []
      },
      {
        id: 'science',
        name: 'Science',
        description: 'Scientific inquiry and understanding',
        levelId,
        topics: []
      },
      {
        id: 'english',
        name: 'English Language Arts',
        description: 'Reading, writing, speaking, and listening',
        levelId,
        topics: []
      }
    ];
  }

  async getTopics(subjectId: string): Promise<CurriculumTopic[]> {
    const topics: Record<string, CurriculumTopic[]> = {
      '1': [
        { id: 'numbers', name: 'Numbers and Operations', description: 'Basic number concepts', subjectId },
        { id: 'algebra', name: 'Algebra', description: 'Algebraic thinking', subjectId },
        { id: 'geometry', name: 'Geometry', description: 'Shapes and spatial reasoning', subjectId }
      ],
      math: [
        { id: 'numbers', name: 'Numbers and Operations', description: 'Basic number concepts', subjectId },
        { id: 'algebra', name: 'Algebra', description: 'Algebraic thinking', subjectId },
        { id: 'geometry', name: 'Geometry', description: 'Shapes and spatial reasoning', subjectId }
      ],
      science: [
        { id: 'earth', name: 'Earth Science', description: 'Earth and space systems', subjectId },
        { id: 'life', name: 'Life Science', description: 'Living organisms', subjectId },
        { id: 'physical', name: 'Physical Science', description: 'Matter and energy', subjectId }
      ],
      english: [
        { id: 'reading', name: 'Reading', description: 'Reading comprehension', subjectId },
        { id: 'writing', name: 'Writing', description: 'Written communication', subjectId },
        { id: 'speaking', name: 'Speaking & Listening', description: 'Oral communication', subjectId }
      ]
    };

    return topics[subjectId] || [];
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
