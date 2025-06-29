
// src/types/knowledgeComponent.ts

export interface KnowledgeComponent {
  id: string;
  name: string;
  description?: string;
  subject: string;
  gradeLevels?: number[];
  domain?: string;
  curriculumStandards?: any;
  prerequisiteKcs?: string[];
  postrequisiteKcs?: string[];
  tags?: string[];
  difficultyEstimate?: number;
}
