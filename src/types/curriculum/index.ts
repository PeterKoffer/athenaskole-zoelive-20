
// Core curriculum types
export interface CurriculumNode {
  id: string;
  nodeType: 'level' | 'subject' | 'topic' | 'subtopic';
  name: string;
  description?: string;
  countryCode?: string;
  subjectName?: string;
  parentId?: string;
  children?: CurriculumNode[];
  metadata?: Record<string, any>;
}

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
