
import { CurriculumNodeType } from './CurriculumNode';
import { SubjectSpecificMetadata } from './SubjectMetadata';

export interface CurriculumNodeFilters {
  // Hierarchy filters
  parentId?: string | null;
  nodeType?: CurriculumNodeType | CurriculumNodeType[];
  
  // Geographic filters
  countryCode?: string;
  languageCode?: string;
  regionCode?: string;
  
  // Educational filters
  educationalLevel?: string | string[];
  subjectName?: string | string[];
  
  // Search filters
  nameContains?: string;
  tags?: string[];
  
  // Subject-specific filters
  subjectSpecificFilters?: Partial<SubjectSpecificMetadata>;
  
  // Accessibility filters
  hasAccessibilitySupport?: string[];
  
  // Assessment filters
  assessmentType?: string;
  
  // Time filters
  maxDuration?: number;
  
  // Pedagogical filters
  teachingMethod?: string;
}
