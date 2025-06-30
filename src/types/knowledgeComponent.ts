
// src/types/knowledgeComponent.ts

export interface KnowledgeComponent {
  id: string; // Unique identifier for the KC, e.g., "kc_math_g4_add_fractions_likedenom"
  // TODO: Future localization: name and description will need to be translatable.
  // This might involve a separate kc_translations table or language-specific columns.
  // For now, these are assumed to be in a primary reference language (e.g., English).
  name: string; // Human-readable name, e.g., "Adding Fractions with Like Denominators"
  description?: string; // Optional detailed description
  subject: string; // e.g., "Mathematics", "English Language Arts" (Subject itself might also need localization or mapping)
  gradeLevels: number[]; // Array of applicable grade levels, e.g., [3, 4]
  domain?: string; // Broader area within the subject, e.g., "Number & Operations - Fractions"
  curriculumStandards?: CurriculumStandardLink[]; // Links to specific curriculum standards
  prerequisiteKcs?: string[]; // IDs of KCs that should ideally be mastered before this one
  postrequisiteKcs?: string[]; // IDs of KCs that this one is a prerequisite for (for path generation)
  difficultyEstimate?: number; // An initial estimate of difficulty (e.g., 1-5 or IRT parameter)
  tags?: string[]; // General tags for categorization, e.g., ["fractions", "addition", "visual_model_needed"]
  // Future: Could include links to exemplar ContentAtoms or assessment items
}

/**
 * Links a Knowledge Component to a specific curriculum standard.
 */
export interface CurriculumStandardLink {
  standardId: string; // e.g., "CCSS.Math.Content.4.NF.B.3a"
  standardId: string; // Should be the UUID (id column) from the 'curriculum_standards' table.
  standardSet: string; // e.g., "CCSSM", "NGSS", "TEKS". This can act as a denormalized quick reference.
  description?: string; // Short description of the standard alignment, if needed beyond the standard's own description.
}

/**
 * Interface for the service that manages Knowledge Component definitions.
 */
export interface IKnowledgeComponentService {
  /**
   * Retrieves a Knowledge Component by its ID.
   * @param id The ID of the KC to retrieve.
   * @returns A Promise that resolves to the KnowledgeComponent or undefined if not found.
   */
  getKcById(id: string): Promise<KnowledgeComponent | undefined>;

  /**
   * Retrieves multiple Knowledge Components by their IDs.
   * @param ids An array of KC IDs.
   * @returns A Promise that resolves to an array of found KnowledgeComponents.
   */
  getKcsByIds(ids: string[]): Promise<KnowledgeComponent[]>;

  /**
   * Retrieves all Knowledge Components for a given subject and grade level.
   * @param subject The subject.
   * @param gradeLevel The grade level.
   * @returns A Promise that resolves to an array of matching KnowledgeComponents.
   */
  getKcsBySubjectAndGrade(subject: string, gradeLevel: number): Promise<KnowledgeComponent[]>;

  /**
   * Retrieves all Knowledge Components that are prerequisites for a given KC.
   * @param kcId The ID of the target KC.
   * @returns A Promise that resolves to an array of prerequisite KnowledgeComponents.
   */
  getPrerequisiteKcs(kcId: string): Promise<KnowledgeComponent[]>;

  /**
   * Searches for KCs based on keywords or tags.
   * @param query The search query.
   * @returns A Promise that resolves to an array of matching KnowledgeComponents.
   */
  searchKcs(query: string): Promise<KnowledgeComponent[]>;

  // Future methods:
  // addKc(kcData: Omit<KnowledgeComponent, 'id'>): Promise<KnowledgeComponent>;
  // updateKc(id: string, updates: Partial<KnowledgeComponent>): Promise<KnowledgeComponent | undefined>;
  // deleteKc(id: string): Promise<boolean>;
}
