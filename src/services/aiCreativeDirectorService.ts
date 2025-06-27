
// src/services/aiCreativeDirectorService.ts

import type { AtomSequence, ContentAtom } from '@/types/content';
import { contentRepository } from '@/services/content/contentRepository';

export interface IAiCreativeDirectorService {
  getAtomSequenceForKc(kcId: string, userId: string): Promise<AtomSequence | null>;
}

class AiCreativeDirectorService implements IAiCreativeDirectorService {
  async getAtomSequenceForKc(kcId: string, userId: string): Promise<AtomSequence | null> {
    try {
      const atoms: ContentAtom[] = await contentRepository.getAtomsByKcId(kcId);

      if (!atoms || atoms.length === 0) {
        return null; 
      }

      return {
        sequence_id: `seq_${kcId}_${userId}_${Date.now()}`,
        atoms: atoms, 
        kc_id: kcId,
        user_id: userId,
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error(`AiCreativeDirectorService: Error fetching or sequencing atoms for KC ${kcId}:`, error);
      return null; 
    }
  }
}

const aiCreativeDirectorService = new AiCreativeDirectorService();
export default aiCreativeDirectorService;
