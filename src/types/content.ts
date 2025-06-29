
// src/types/content.ts

export interface AtomMetadata {
  difficulty?: number; // General difficulty (e.g., 1-5)
  learningStyles?: ('visual' | 'auditory' | 'kinesthetic' | 'reading_writing')[];
  estimatedTimeMs?: number;
  source?: string; // e.g., 'teacher_upload', 'ai_generated_v1'
  worldviewTags?: string[]; // e.g., ['secular'], ['christian-generic', 'creation-narrative']
  culturalContextTags?: string[]; // e.g., ['urban-us'], ['rural-india']
  // IRT Parameters (placeholders for future calibration)
  irtDifficulty?: number; // (b parameter in 2PL/3PL)
  irtDiscrimination?: number; // (a parameter in 2PL/3PL)
  irtGuessingProbability?: number; // (c parameter in 3PL)
  [key: string]: any; // Allow other custom metadata properties
}

export interface ContentAtom {
  atom_id: string; // Maps to 'id' from Supabase
  atom_type: 'TEXT_EXPLANATION' | 'QUESTION_MULTIPLE_CHOICE' | 'INTERACTIVE_EXERCISE' | string; // Allow other strings for flexibility
  content: any; // This can be more specific based on atom_type
  kc_ids: string[]; // Required array, matches Supabase NOT NULL constraint
  metadata?: AtomMetadata;
  version?: number;
  author_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AtomSequence {
  sequence_id: string;
  atoms: ContentAtom[];
  kc_id: string;
  user_id: string;
  created_at: string;
}
