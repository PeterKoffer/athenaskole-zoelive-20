
import { CurriculumNodeType } from './CurriculumNode';
import { SubjectSpecificMetadata } from './SubjectMetadata';

/**
 * Filters for querying curriculum nodes.
 * All properties are optional.
 */
export interface CurriculumNodeFilters {
  parentId?: string | null;
  nodeType?: CurriculumNodeType | CurriculumNodeType[];
  countryCode?: string;
  languageCode?: string;
  regionCode?: string;
  educationalLevel?: string | string[];
  subjectName?: string | string[];
  tags?: string[]; // Match if node has ANY of these tags
  nameContains?: string; // Case-insensitive search within the name
  
  // Enhanced filtering capabilities
  subjectSpecificFilters?: Partial<SubjectSpecificMetadata>;
  hasAccessibilitySupport?: string[]; // Filter by accessibility considerations
  assessmentType?: string;
  maxDuration?: number; // Filter by estimated duration
  teachingMethod?: string;
}
