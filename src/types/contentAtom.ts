// src/types/contentAtom.ts

/**
 * Defines the possible types for a Content Atom.
 * This enum will expand as more atom types are conceptualized.
 */
export enum ContentAtomType {
  // Foundational Types
  TEXT_EXPLANATION = 'TEXT_EXPLANATION', // A block of text explaining a concept.
  IMAGE = 'IMAGE',                     // A static image.
  VIDEO_SNIPPET = 'VIDEO_SNIPPET',       // A short video clip (e.g., URL or path).
  AUDIO_CLIP = 'AUDIO_CLIP',           // An audio recording (e.g., pronunciation, music sample).

  // Interactive Question Types
  QUESTION_MULTIPLE_CHOICE = 'QUESTION_MULTIPLE_CHOICE',
  QUESTION_TRUE_FALSE = 'QUESTION_TRUE_FALSE',
  QUESTION_SHORT_ANSWER = 'QUESTION_SHORT_ANSWER', // Requires external validation or AI assessment
  QUESTION_FILL_IN_THE_BLANKS = 'QUESTION_FILL_IN_THE_BLANKS',

  // Interactive Activity / Game Element Types
  INTERACTIVE_SIMULATION_EMBED = 'INTERACTIVE_SIMULATION_EMBED', // e.g., PhET sim
  DRAG_AND_DROP_TASK = 'DRAG_AND_DROP_TASK', // Defines elements and targets
  SORTING_ACTIVITY = 'SORTING_ACTIVITY',       // Defines categories and items to sort
  CODING_CHALLENGE_STUB = 'CODING_CHALLENGE_STUB', // Initial code, problem description, test cases

  // Utility/Structural Types
  NARRATIVE_PROMPT = 'NARRATIVE_PROMPT', // A prompt for NELIE to generate narrative/story around other atoms.
  HINT = 'HINT',                       // A hint related to another atom (e.g., a question).
  FEEDBACK_SPECIFIC = 'FEEDBACK_SPECIFIC', // Specific feedback for a particular incorrect answer to a question atom.
  EXTERNAL_LINK = 'EXTERNAL_LINK'        // Link to an external resource.
}

/**
 * Structure for multiple choice options within a question atom.
 */
export interface MultipleChoiceOption {
  id: string; // e.g., "opt_a"
  text: string;
  isCorrect: boolean;
  feedbackIfSelected?: string; // Specific feedback if this (incorrect) option is chosen
}

/**
 * Content structure for a TEXT_EXPLANATION atom.
 */
export interface TextExplanationContent {
  text: string; // The main explanation. Can include markdown for basic formatting.
  //NELIEprompts?: string[]; // Optional prompts for NELIE to elaborate or connect this explanation.
}

/**
 * Content structure for an IMAGE atom.
 */
export interface ImageContent {
  url: string;
  altText?: string;
  caption?: string;
}

/**
 * Content structure for a VIDEO_SNIPPET atom.
 */
export interface VideoSnippetContent {
  url: string; // URL to the video (e.g., YouTube, Vimeo, or self-hosted)
  startTime?: number; // Optional start time in seconds
  endTime?: number;   // Optional end time in seconds
  caption?: string;
}

/**
 * Content structure for QUESTION_MULTIPLE_CHOICE atom.
 */
export interface QuestionMultipleChoiceContent {
  questionText: string;
  options: MultipleChoiceOption[];
  generalIncorrectFeedback?: string; // Feedback if a non-specific incorrect answer is chosen
  correctFeedback?: string;        // Feedback if the correct answer is chosen
}

// Define other content structures for other atom types as needed...
// e.g., QuestionTrueFalseContent, QuestionShortAnswerContent, etc.


/**
 * Represents the flexible content of a Content Atom.
 * The actual structure depends on the `atomType`.
 */
export type AtomContent =
  | TextExplanationContent
  | ImageContent
  | VideoSnippetContent
  | QuestionMultipleChoiceContent
  // Add other specific content types here as they are defined
  | { [key: string]: any }; // Fallback for custom or yet-undefined structures

/**
 * Metadata for a Content Atom.
 * This will be crucial for the AI Creative Director to assemble atoms.
 */
export interface ContentAtomMetadata {
  source?: string; // Origin of the content, e.g., "Khan Academy", "Teacher Upload", "AI Generated"
  difficulty?: number; // Calibrated difficulty (e.g., 0.0 to 1.0, or IRT parameters)
  estimatedInteractionTimeSeconds?: number; // Estimated time for a student to engage with this atom

  // Tags for Worldview and Cultural Context (as per Layer 3 vision)
  worldviewTags?: string[]; // e.g., "Christian", "Islamic", "Secular", "Humanist"
  culturalContextTags?: string[]; // e.g., "Urban", "Rural", "Latinx", "EastAsianHeritage"

  // Pedagogical tags
  learningObjective?: string; // Specific learning objective this atom addresses
  interactionStyle?: 'passive' | 'active_input' | 'creative_construction'; // How the student interacts
  bloomsTaxonomyLevel?: 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate' | 'Create';

  // AI Generation hints
  //generationPrompts?: string[]; // Prompts used if this atom was AI-generated or for AI to expand upon it
  suitabilityForNelieVoice?: boolean; // If true, content is well-suited for NELIE to speak directly.
  visualGenerationHints?: string[]; // Hints for generating accompanying visuals.

  // Accessibility
  accessibilityNotes?: string; // e.g., "Requires screen reader adjustments for interactive parts"
}

/**
 * Represents a single "Content Atom" - a modular piece of educational content.
 */
export interface ContentAtom {
  id: string; // Unique identifier for the atom, e.g., UUID or a structured ID
  atomType: ContentAtomType; // The type of this atom
  knowledgeComponentIds: string[]; // IDs of KCs this atom primarily addresses
  content: AtomContent; // The actual content, structure varies by atomType
  metadata: ContentAtomMetadata;
  version?: number; // Version number for tracking changes
  createdAt?: string; // ISO 8601 timestamp
  updatedAt?: string; // ISO 8601 timestamp
  authorId?: string; // User ID of the content creator/editor
}

/**
 * Interface for the service/repository that manages Content Atoms.
 */
export interface IContentAtomRepository {
  getAtomById(id: string): Promise<ContentAtom | undefined>;
  getAtomsByIds(ids: string[]): Promise<ContentAtom[]>;
  getAtomsByKcId(kcId: string): Promise<ContentAtom[]>;
  getAtomsByKcIds(kcIds: string[]): Promise<ContentAtom[]>; // Atoms relevant to any of the given KC IDs
  getAtomsByType(atomType: ContentAtomType): Promise<ContentAtom[]>;

  // Basic search/filter - will become more complex
  findAtoms(filter: {
    kcId?: string;
    atomType?: ContentAtomType;
    tags?: string[]; // For metadata tags like worldview or cultural context
    difficultyMin?: number;
    difficultyMax?: number;
  }): Promise<ContentAtom[]>;

  // CRUD (initially mock, later Supabase)
  // addAtom(atomData: Omit<ContentAtom, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContentAtom>;
  // updateAtom(id: string, updates: Partial<ContentAtom>): Promise<ContentAtom | undefined>;
  // deleteAtom(id: string): Promise<boolean>;
}
