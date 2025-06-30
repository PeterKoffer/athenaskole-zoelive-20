
import ContentGenerationService, { AtomSequence, ContentGenerationRequest } from './ContentGenerationService';
import KnowledgeComponentService, { KnowledgeComponent } from './KnowledgeComponentService';

class ContentOrchestrator {
  async getAtomSequenceForKc(kcId: string, userId: string): Promise<AtomSequence | null> {
    const forceAIGenerationForTesting = true; // Enable AI generation for testing
    try {
      console.log('🎯 ContentOrchestrator: Generating diverse atom sequence for KC:', kcId);
      
      // Step 1: Try database first (unless forcing AI)
      if (!forceAIGenerationForTesting) {
        const dbAtoms = await ContentGenerationService.generateFromDatabase(kcId);
        if (dbAtoms.length > 0) {
          return this.createAtomSequence('database', dbAtoms, kcId, userId);
        }
      }

      // Step 2: Enhanced AI generation with variety
      const diversityPrompts = [
        'Create unique and engaging examples',
        'Use real-world scenarios and applications',
        'Include creative problem-solving approaches',
        'Design interactive and hands-on activities',
        'Focus on visual and conceptual understanding'
      ];

      const randomPrompt = diversityPrompts[Math.floor(Math.random() * diversityPrompts.length)];
      const sessionId = `diverse_${Date.now()}_${Math.random().toString(36).substring(7)}`;

      const request: ContentGenerationRequest = {
        kcId,
        userId,
        contentTypes: ['TEXT_EXPLANATION', 'QUESTION_MULTIPLE_CHOICE', 'INTERACTIVE_EXERCISE'],
        maxAtoms: 3,
        diversityPrompt: randomPrompt,
        sessionId: sessionId,
        forceUnique: true
      };

      console.log('🎨 Using diversity prompt:', randomPrompt);
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
      kcId: kcId.split('_').pop()
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
