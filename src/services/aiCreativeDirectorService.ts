
// src/services/aiCreativeDirectorService.ts

import type { AtomSequence, ContentAtom } from '@/types/content';
import { contentRepository } from '@/services/content/contentRepository';

export interface IAiCreativeDirectorService {
  getAtomSequenceForKc(kcId: string, userId: string): Promise<AtomSequence | null>;
}

class AiCreativeDirectorService implements IAiCreativeDirectorService {
  async getAtomSequenceForKc(kcId: string, userId: string): Promise<AtomSequence | null> {
    console.log(`AiCreativeDirectorService: Requesting atoms from ContentRepository for KC ${kcId}, user ${userId}`);
    
    try {
      const atoms: ContentAtom[] = await contentRepository.getAtomsByKcId(kcId);

      if (!atoms || atoms.length === 0) {
        console.warn(`AiCreativeDirectorService: No atoms found by repository for KC ID: ${kcId}`);
        return null; 
      }

      console.log(`AiCreativeDirectorService: Found ${atoms.length} atoms for KC ${kcId} from repository. Creating sequence.`);

      return {
        sequence_id: `seq_${kcId}_${userId}_${Date.now()}`,
        atoms: atoms, 
        kc_id: kcId,
        user_id: userId,
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error(`AiCreativeDirectorService: Error fetching or sequencing atoms for KC ${kcId} via repository:`, error);
      return null; 
    }
  }
}

const aiCreativeDirectorService = new AiCreativeDirectorService();
export default aiCreativeDirectorService;
