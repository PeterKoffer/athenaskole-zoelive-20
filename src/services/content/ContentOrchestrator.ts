
import ContentGenerationService, { AtomSequence, ContentGenerationRequest } from './ContentGenerationService';
import KnowledgeComponentService, { KnowledgeComponent } from './KnowledgeComponentService';

class ContentOrchestrator {
  async getAtomSequenceForKc(kcId: string, userId: string): Promise<AtomSequence | null> {
    try {
      console.log('🎯 ContentOrchestrator: Generating atom sequence for KC:', kcId);
      
      // Step 1: Try database first (unless testing flag is set)
      const dbAtoms = await ContentGenerationService.generateFromDatabase(kcId);
      if (dbAtoms.length > 0) {
        console.log('✅ Using database atoms');
        return this.createAtomSequence('database', dbAtoms, kcId, userId);
      }

      // Step 2: Proceed to AI generation
      console.log('🤖 Proceeding to AI generation...');
      const request: ContentGenerationRequest = {
        kcId,
        userId,
        contentTypes: ['TEXT_EXPLANATION', 'QUESTION_MULTIPLE_CHOICE', 'INTERACTIVE_EXERCISE'],
        maxAtoms: 3
      };

      const aiAtoms = await ContentGenerationService.generateFromAI(request);
      if (aiAtoms.length > 0) {
        console.log('✅ Using AI generated atoms');
        return this.createAtomSequence('ai_generated', aiAtoms, kcId, userId);
      }

      // Step 3: Use fallback only if not in testing mode
      console.log('🔄 Attempting fallback content generation...');
      const kc = await KnowledgeComponentService.getKnowledgeComponent(kcId);
      if (!kc) {
        throw new Error(`Knowledge component not found: ${kcId}`);
      }

      const fallbackAtoms = ContentGenerationService.generateFallbackContent(kc);
      return this.createAtomSequence('fallback', fallbackAtoms, kcId, userId);

    } catch (error) {
      console.error('❌ ContentOrchestrator error:', error);
      throw error;
    }
  }

  private createAtomSequence(source: string, atoms: any[], kcId: string, userId: string): AtomSequence {
    const sequenceId = `${source}_seq_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    console.log(`✅ Created ${source} sequence:`, {
      sequenceId,
      atomCount: atoms.length,
      kcId
    });

    return {
      sequence_id: sequenceId,
      atoms,
      kc_id: kcId,
      user_id: userId,
      created_at: new Date().toISOString()
    };
  }
}

export default new ContentOrchestrator();
