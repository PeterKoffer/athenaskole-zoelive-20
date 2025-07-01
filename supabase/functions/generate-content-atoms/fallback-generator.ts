
// Minimal Fallback Generator (Last Resort Only)

export interface Atom {
  atom_id: string;
  atom_type: string;
  content: any;
  kc_ids: string[];
  metadata: any;
}

export function generateMinimalFallback(kcId: string, maxAtoms: number): Atom[] {
  console.log(`⚠️ LAST RESORT: Minimal fallback for ${kcId} (AI generation completely failed)`);
  
  const timestamp = Date.now();
  const atoms: Atom[] = [];
  
  atoms.push({
    atom_id: `minimal_fallback_${timestamp}_1`,
    atom_type: 'TEXT_EXPLANATION',
    content: {
      title: `Mathematics Practice`,
      explanation: `This is an important mathematical concept that requires practice and understanding.`,
      examples: [`Practice helps build mathematical skills`]
    },
    kc_ids: [kcId],
    metadata: {
      difficulty: 0.5,
      estimatedTimeMs: 30000,
      source: 'minimal_fallback',
      model: 'Minimal Fallback',
      generated_at: timestamp,
      curriculumAligned: false,
      aiGenerated: false
    }
  });
  
  return atoms.slice(0, maxAtoms);
}
