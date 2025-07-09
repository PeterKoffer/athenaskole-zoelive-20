
export interface ContentAtom {
  id: string;
  kc_id: string;
  atom_type: string;
  content: any;
  difficulty_level: number;
  estimated_time: number;
  prerequisites?: string[];
  created_at?: string;
  updated_at?: string;
  atom_id?: string; // Adding this for compatibility
}

export interface AtomSequence {
  id: string;
  atoms: ContentAtom[];
  metadata?: any;
}
