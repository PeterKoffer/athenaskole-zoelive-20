
import ContentGenerationService, { AtomSequence, ContentGenerationRequest } from './ContentGenerationService';
import KnowledgeComponentService, { KnowledgeComponent } from './KnowledgeComponentService';

class ContentOrchestrator {
  async getAtomSequenceForKc(kcId: string, userId: string): Promise<AtomSequence | null> {
    const forceAIGenerationForTesting = false; // REVERTED TEST FLAG
    const forceAIGenerationForTesting = true; // Enable AI generation for testing
    try {
      console.log('🎯 ContentOrchestrator: Generating atom sequence for KC:', kcId);
      // console.log(`🧪 TEST MODE: forceAIGenerationForTesting is ${forceAIGenerationForTesting}`); // Commented out test log
      

      // Step 1: Try database first
      if (!forceAIGenerationForTesting) {
        // console.log('[ContentOrchestrator] Checking database for pre-built atoms (forceAIGenerationForTesting is false).'); // Commented out test log
        const dbAtoms = await ContentGenerationService.generateFromDatabase(kcId);
        if (dbAtoms.length > 0) {
          // console.log('[ContentOrchestrator] ✅ Found pre-built atoms in database. Using them.'); // Commented out test log
          return this.createAtomSequence('database', dbAtoms, kcId, userId);
        }
        // console.log('[ContentOrchestrator] No pre-built atoms found in database.'); // Commented out test log
      } else {
        // This path should ideally not be taken in production due to the flag above being false.
        console.warn('[ContentOrchestrator] 🧪 Skipping database check because forceAIGenerationForTesting is true. THIS SHOULD BE FALSE IN PRODUCTION.');
      // Step 1: Try database first (unless forcing AI)
      if (!forceAIGenerationForTesting) {
      }

      // Step 2: Try AI generation
      // console.log('[ContentOrchestrator] 🤖 Proceeding to AI generation path.'); // Commented out test log
      const request: ContentGenerationRequest = {
        kcId,
        userId,
        contentTypes: ['TEXT_EXPLANATION', 'QUESTION_MULTIPLE_CHOICE', 'INTERACTIVE_EXERCISE'],
        maxAtoms: 3
      };

      const aiAtoms = await ContentGenerationService.generateFromAI(request);
      if (aiAtoms.length > 0) {
        return this.createAtomSequence('ai_generated', aiAtoms, kcId, userId);
      }

      // Step 3: Use fallback
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
