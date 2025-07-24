
// Core curriculum types
export type { UnifiedCurriculumNode as CurriculumNode, CurriculumNodeType } from './UnifiedCurriculumNode';

export interface CurriculumLevel {
  id: string;
  name: string;
  description?: string;
  countryCode: string;
  subjects: CurriculumSubject[];
}

export interface CurriculumSubject {
  id: string;
  name: string;
  description?: string;
  levelId: string;
  topics: CurriculumTopic[];
}

export interface CurriculumTopic {
  id: string;
  name: string;
  description?: string;
  subjectId: string;
  subtopics?: CurriculumTopic[];
}

export interface CurriculumStats {
  totalNodes: number;
  nodesByType: Record<string, number>;
  nodesByCountry: Record<string, number>;
  nodesBySubject: Record<string, number>;
}
