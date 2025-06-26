
// src/types/content.ts

export interface ContentAtom {
  atom_id: string;
  atom_type: 'TEXT_EXPLANATION' | 'QUESTION_MULTIPLE_CHOICE' | 'INTERACTIVE_EXERCISE';
  content: any; // This can be more specific based on atom_type
  kc_ids?: string[];
  metadata?: any;
}

export interface AtomSequence {
  sequence_id: string;
  atoms: ContentAtom[];
  kc_id: string;
  user_id: string;
  created_at: string;
}
