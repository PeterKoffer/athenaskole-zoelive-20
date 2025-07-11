
/**
 * Defines the type of a node in the curriculum hierarchy.
 * - country: Root node for a country's curriculum system.
 * - region: A sub-division within a country if applicable (e.g., state, province).
 * - grade_level: Specific grade (e.g., K, 1, 5, 10).
 * - subject: A broad subject area (e.g., Math, Science, English).
 * - course: A specific course within a subject for a grade (e.g., Algebra I, Grade 9 English).
 * - domain: A major strand or domain within a subject/course (e.g., "Number Sense", "Reading Comprehension").
 * - topic: A more specific topic area within a domain (e.g., "Fractions", "Identifying Main Idea").
 * - learning_objective: A specific skill or understanding students should achieve (often corresponds to a standard).
 * - kc: Knowledge Component - the most granular, teachable/assessable unit of knowledge or skill.
 */
export type CurriculumNodeType =
  | 'country'
  | 'region' // Optional, for countries with regional curricula (e.g., US states, Canadian provinces)
  | 'grade_level'
  | 'subject'
  | 'course' // e.g., "Algebra 1" as distinct from general "Math" for a grade
  | 'domain' // e.g., "Ratios and Proportional Relationships" in Math
  | 'topic' // e.g., "Understanding Unit Rates"
  | 'learning_objective' // Specific standard or objective, e.g., "Understand the concept of a unit rate a/b associated with a ratio a:b with b != 0"
  | 'kc'; // Knowledge Component, e.g., "Define unit rate", "Calculate unit rate from ratio"

/**
 * Subject-specific metadata for enhanced curriculum indexing
 */
export interface SubjectSpecificMetadata {
  // Language-specific (for Other Languages, English)
  targetLanguage?: string; // ISO 639-1 code for the language being learned
  proficiencyLevel?: 'beginner' | 'intermediate' | 'advanced' | 'native';
  linguisticSkill?: 'speaking' | 'listening' | 'reading' | 'writing' | 'grammar' | 'vocabulary';

  // Creative Arts & Music
  medium?: string; // "digital", "traditional", "mixed", "instrumental", "vocal"
  technique?: string; // "watercolor", "sculpture", "piano", "guitar", etc.
  artisticStyle?: string; // "classical", "contemporary", "folk", etc.

  // Physical Education / Body Lab
  activityType?: 'individual' | 'team' | 'fitness' | 'sport' | 'dance' | 'martial_arts';
  physicalRequirements?: string[]; // ["coordination", "strength", "endurance", "flexibility"]
  equipmentNeeded?: string[];

  // Mental Wellness
  wellnessArea?: 'emotional_regulation' | 'social_skills' | 'stress_management' | 'self_awareness' | 'mindfulness';
  sensitivityLevel?: 'low' | 'medium' | 'high'; // For age-appropriate content
  therapeuticApproach?: string; // "cognitive_behavioral", "mindfulness_based", etc.

  // Life Essentials
  lifeStage?: 'childhood' | 'adolescence' | 'young_adult' | 'adult' | 'general';
  practicalApplication?: 'financial_literacy' | 'health_nutrition' | 'relationships' | 'career_planning' | 'civic_responsibility';
  realWorldContext?: string; // Specific scenarios or contexts

  // Science-specific enhancements
  labRequired?: boolean;
  safetyConsiderations?: string[];
  experimentType?: 'observation' | 'hypothesis_testing' | 'demonstration' | 'field_study';

  // Computer Science
  programmingLanguage?: string;
  conceptualArea?: 'algorithms' | 'data_structures' | 'software_engineering' | 'cybersecurity' | 'ai_ml';
  practicalProject?: boolean;

  // History & Religion
  culturalContext?: string[];
  timesPeriod?: string; // "ancient", "medieval", "modern", "contemporary"
  geographicalScope?: 'local' | 'national' | 'regional' | 'global';
  religiousTradition?: string;

  // Geography
  geographicalScale?: 'local' | 'regional' | 'national' | 'continental' | 'global';
  geographicalType?: 'physical' | 'human' | 'environmental' | 'political' | 'economic';
}

export interface CurriculumNode {
  id: string; // Unique identifier for this node (e.g., "us-ma-g6-numsys-rp-1a", or UUID)
  parentId: string | null; // ID of the parent node; null for root nodes (like 'country')

  nodeType: CurriculumNodeType;

  name: string; // Human-readable name (e.g., "Grade 6", "Mathematics", "Ratios and Proportional Relationships")
  description?: string; // Optional detailed description of the node's content or purpose

  countryCode?: string; // ISO 3166-1 alpha-2 country code (e.g., "US", "DK", "CA"). Relevant for country/region nodes, can be inherited.
  languageCode?: string; // ISO 639-1 language code (e.g., "en", "da"). Relevant for country/region nodes, can be inherited.
  regionCode?: string; // Optional, for states/provinces if nodeType is 'region' or below within a region.

  educationalLevel?: string; // e.g., "K", "1", "2", ..., "12" (especially for 'grade_level' type or content nodes)
  subjectName?: string; // Standardized subject name (e.g., "Mathematics", "Language Arts", "Physical Science"). Useful for filtering.

  sourceIdentifier?: string; // Original ID from the source curriculum (e.g., CCSS.Math.Content.6.RP.A.1)
  sourceUrl?: string; // URL to the original curriculum document/page for this node, if applicable

  tags?: string[]; // General tags for searchability or categorization (e.g., "foundational", "algebra-readiness")

  // Enhanced metadata for diverse subjects
  subjectSpecific?: SubjectSpecificMetadata;
  
  // Accessibility and inclusion
  accessibilityConsiderations?: string[]; // ["visual_impairment", "hearing_impairment", "motor_difficulties"]
  culturalConsiderations?: string[]; // Cultural sensitivity flags
  
  // Assessment and evaluation
  assessmentTypes?: ('formative' | 'summative' | 'peer' | 'self' | 'portfolio' | 'project' | 'performance')[];
  evaluationCriteria?: string[]; // Specific criteria for measuring success
  
  // Time and pacing
  estimatedDuration?: number; // In minutes
  prerequisites?: string[]; // IDs of prerequisite nodes
  
  // Engagement and pedagogy
  preferredTeachingMethods?: string[]; // ["hands_on", "discussion", "lecture", "project_based", "collaborative"]
  engagementStrategies?: string[]; // ["gamification", "storytelling", "real_world_connections", "technology_integration"]

  // For KCs, could include IRT parameters in the future, or links to "Content Atoms"
  // For Learning Objectives, could link to KCs that comprise it.
  // For Topics, could link to prerequisite topics/KCs.

  // Potential future fields:
  // equivalentNodes?: string[]; // IDs of equivalent nodes in other curricula/countries
  // pedagogicalUse?: string[]; // e.g., 'assessment', 'instruction', 'reinforcement'
  // difficultyEstimate?: 'beginner' | 'intermediate' | 'advanced'; // Relative to its level
}

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

/**
 * Validation utilities for curriculum nodes
 */
export const CurriculumValidation = {
  /**
   * Validates that a curriculum node is properly structured for its subject
   */
  validateNodeForSubject(node: CurriculumNode): { isValid: boolean; warnings: string[] } {
    const warnings: string[] = [];
    
    // Subject-specific validation logic
    if (node.subjectName?.toLowerCase().includes('language') && !node.subjectSpecific?.targetLanguage) {
      warnings.push('Language subjects should specify targetLanguage in subjectSpecific metadata');
    }
    
    if (node.subjectName?.toLowerCase().includes('physical') && !node.subjectSpecific?.activityType) {
      warnings.push('Physical education should specify activityType in subjectSpecific metadata');
    }
    
    if (node.subjectName?.toLowerCase().includes('art') && !node.subjectSpecific?.medium) {
      warnings.push('Creative arts should specify medium in subjectSpecific metadata');
    }
    
    return {
      isValid: warnings.length === 0,
      warnings
    };
  },

  /**
   * Suggests appropriate metadata fields based on subject
   */
  suggestMetadataForSubject(subjectName: string): Partial<SubjectSpecificMetadata> {
    const subject = subjectName.toLowerCase();
    
    if (subject.includes('language') || subject.includes('english')) {
      return {
        proficiencyLevel: 'beginner',
        linguisticSkill: 'reading'
      };
    }
    
    if (subject.includes('art') || subject.includes('creative')) {
      return {
        medium: 'traditional',
        technique: 'drawing'
      };
    }
    
    if (subject.includes('music')) {
      return {
        medium: 'instrumental',
        artisticStyle: 'classical'
      };
    }
    
    if (subject.includes('physical') || subject.includes('body')) {
      return {
        activityType: 'fitness',
        physicalRequirements: ['coordination']
      };
    }
    
    if (subject.includes('wellness') || subject.includes('mental')) {
      return {
        wellnessArea: 'emotional_regulation',
        sensitivityLevel: 'medium'
      };
    }
    
    if (subject.includes('computer') || subject.includes('technology')) {
      return {
        conceptualArea: 'algorithms',
        practicalProject: true
      };
    }
    
    return {};
  }
};

/**
 * Subject mapping utilities
 */
export const NELIE_SUBJECTS = {
  MATHEMATICS: 'Mathematics',
  ENGLISH: 'English Language Arts', 
  OTHER_LANGUAGES: 'World Languages',
  SCIENCE: 'Science',
  MENTAL_WELLNESS: 'Mental Wellness',
  COMPUTER_SCIENCE: 'Computer Science',
  CREATIVE_ARTS: 'Creative Arts',
  MUSIC: 'Music',
  HISTORY_RELIGION: 'History & Religion',
  GEOGRAPHY: 'Geography',
  BODY_LAB: 'Physical Education',
  LIFE_ESSENTIALS: 'Life Essentials'
} as const;

export type NelieSubject = typeof NELIE_SUBJECTS[keyof typeof NELIE_SUBJECTS];
