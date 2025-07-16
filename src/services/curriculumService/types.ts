
import { CurriculumLevel, CurriculumSubject, CurriculumTopic, CurriculumNode } from '@/types/curriculum/index';

export interface CurriculumService {
  getLevels(): Promise<CurriculumLevel[]>;
  getSubjects(levelId: string): Promise<CurriculumSubject[]>;
  getTopics(subjectId: string): Promise<CurriculumTopic[]>;
  getAllNodes(): Promise<CurriculumNode[]>;
  getStats(): Promise<any>;
}
