
import { NELIESubject } from './NELIESubjects';

export type CurriculumNodeType = 
  | 'country'
  | 'state_province' 
  | 'district_region'
  | 'school'
  | 'grade_level'
  | 'subject_area'
  | 'curriculum_standard'
  | 'learning_objective'
  | 'skill_component'
  | 'assessment_item';

export interface UnifiedCurriculumNode {
  id: string;
  parentId: string | null;
  name: string;
  nodeType: CurriculumNodeType;
  
  // Geographic/Administrative Info
  countryCode?: string;
  stateProvinceCode?: string;
  districtCode?: string;
  schoolCode?: string;
  
  // Educational Context
  educationalLevel?: string; // e.g., "Grade 3", "Year 7", "Primary"
  subject: NELIESubject;
  subjectName?: string;
  
  // Hierarchical Structure
  children?: UnifiedCurriculumNode[];
  
  // Metadata
  description?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  
  // Standards/Assessment Info
  standardsCode?: string;
  difficultyLevel?: number;
  estimatedTime?: number;
  prerequisites?: string[];
}
