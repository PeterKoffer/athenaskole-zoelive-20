
/**
 * Defines the type of a node in the curriculum hierarchy.
 * - country: Root node for a country's curriculum system.
 * - state_province: A sub-division within a country (e.g., state, province).
 * - district_region: A district or regional subdivision.
 * - school: Individual school level.
 * - grade_level: Specific grade (e.g., K, 1, 5, 10).
 * - subject_area: A broad subject area (e.g., Math, Science, English).
 * - curriculum_standard: Curriculum standards or frameworks.
 * - learning_objective: A specific skill or understanding students should achieve.
 * - skill_component: Specific skill components within learning objectives.
 * - assessment_item: Assessment or evaluation items.
 * - region: Legacy support for regional nodes.
 * - subject: Legacy support for subject nodes.
 * - course: A specific course within a subject for a grade (e.g., Algebra I, Grade 9 English).
 * - domain: A major strand or domain within a subject/course (e.g., "Number Sense", "Reading Comprehension").
 * - topic: A more specific topic area within a domain (e.g., "Fractions", "Identifying Main Idea").
 * - kc: Knowledge Component - the most granular, teachable/assessable unit of knowledge or skill.
 */
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
  | 'assessment_item'
  | 'region' // Optional, for countries with regional curricula (e.g., US states, Canadian provinces)
  | 'subject'
  | 'course' // e.g., "Algebra 1" as distinct from general "Math" for a grade
  | 'domain' // e.g., "Ratios and Proportional Relationships" in Math
  | 'topic' // e.g., "Understanding Unit Rates"
  | 'kc'; // Knowledge Component, e.g., "Define unit rate", "Calculate unit rate from ratio"

export interface CurriculumNode {
  id: string; // Unique identifier for this node (e.g., "us-ma-g6-numsys-rp-1a", or UUID)
  parentId: string | null; // ID of the parent node; null for root nodes (like 'country')

  nodeType: CurriculumNodeType;

  name: string; // Human-readable name (e.g., "Grade 6", "Mathematics", "Ratios and Proportional Relationships")
  description?: string; // Optional detailed description of the node's content or purpose

  countryCode?: string; // ISO 3166-1 alpha-2 country code (e.g., "US", "DK", "CA"). Relevant for country/region nodes, can be inherited.
  languageCode?: string; // ISO 639-1 language code (e.g., "en", "da"). Relevant for country/region nodes, can be inherited.
  regionCode?: string; // Optional, for states/provinces if nodeType is 'region' or below within a region.
  stateProvinceCode?: string; // State/province code for unified curriculum nodes
  districtCode?: string; // District code for unified curriculum nodes
  schoolCode?: string; // School code for unified curriculum nodes

  educationalLevel?: string; // e.g., "K", "1", "2", ..., "12" (especially for 'grade_level' type or content nodes)
  subjectName?: string; // Standardized subject name (e.g., "Mathematics", "Language Arts", "Physical Science"). Useful for filtering.
  subject?: import('./NELIESubjects').NELIESubject; // Strongly types the subject using the core enum

  sourceIdentifier?: string; // Original ID from the source curriculum (e.g., CCSS.Math.Content.6.RP.A.1)
  sourceUrl?: string; // URL to the original curriculum document/page for this node, if applicable

  tags?: string[]; // General tags for searchability or categorization (e.g., "foundational", "algebra-readiness")

  // Enhanced metadata for diverse subjects
  subjectSpecific?: import('./SubjectMetadata').SubjectSpecificMetadata;
  
  // Accessibility and inclusion
  accessibilityConsiderations?: string[]; // ["visual_impairment", "hearing_impairment", "motor_difficulties"]
  culturalConsiderations?: string[]; // Cultural sensitivity flags
  
  // Assessment and evaluation
  assessmentTypes?: ('formative' | 'summative' | 'peer' | 'self' | 'portfolio' | 'project' | 'performance')[];
  evaluationCriteria?: string[]; // Specific criteria for measuring success
  
  // Time and pacing
  estimatedDuration?: number; // In minutes
  prerequisites?: string[]; // IDs of prerequisite nodes
  estimatedTime?: number; // Unified curriculum support
  
  // Engagement and pedagogy
  preferredTeachingMethods?: string[]; // ["hands_on", "discussion", "lecture", "project_based", "collaborative"]
  engagementStrategies?: string[]; // ["gamification", "storytelling", "real_world_connections", "technology_integration"]

  // Unified curriculum support
  children?: CurriculumNode[];
  metadata?: Record<string, any>;
  standardsCode?: string;
  difficultyLevel?: number;

  // For KCs, could include IRT parameters in the future, or links to "Content Atoms"
  // For Learning Objectives, could link to KCs that comprise it.
  // For Topics, could link to prerequisite topics/KCs.

  // Potential future fields:
  // equivalentNodes?: string[]; // IDs of equivalent nodes in other curricula/countries
  // pedagogicalUse?: string[]; // e.g., 'assessment', 'instruction', 'reinforcement'
  // difficultyEstimate?: 'beginner' | 'intermediate' | 'advanced'; // Relative to its level
}
