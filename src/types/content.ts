
// src/types/content.ts

export interface ContentAtom {
  atom_id: string;
  atom_type: 'TEXT_EXPLANATION' | 'QUESTION_MULTIPLE_CHOICE' | 'INTERACTIVE_EXERCISE';
  content: any;
  kc_ids: string[];
  metadata?: {
    difficulty?: number;
    estimatedTimeMs?: number;
    source?: string;
    language?: string;
  };
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
