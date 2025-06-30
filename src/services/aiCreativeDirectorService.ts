
import ContentOrchestrator from './content/ContentOrchestrator';

interface ContentGenerationRequest {
  kcId: string;
  userId: string;
  difficultyLevel?: number;
  contentTypes?: string[];
  maxAtoms?: number;
}

interface AtomSequence {
  sequence_id: string;
  atoms: any[];
  kc_id: string;
  user_id: string;
  created_at: string;
}

class AICreativeDirectorService {
  async getAtomSequenceForKc(kcId: string, userId: string): Promise<AtomSequence | null> {
    console.log('🎯 AICreativeDirectorService: Delegating to ContentOrchestrator');
    return ContentOrchestrator.getAtomSequenceForKc(kcId, userId);
  }
}

export default new AICreativeDirectorService();
