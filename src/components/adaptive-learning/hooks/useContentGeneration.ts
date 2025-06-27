
import { useCallback } from 'react';
import knowledgeComponentService from '@/services/knowledgeComponentService';
import aiCreativeDirectorService from '@/services/aiCreativeDirectorService';
import { LearnerProfile } from '@/types/learnerProfile';
import { KnowledgeComponent } from '@/types/knowledgeComponent';

export const useContentGeneration = () => {
  const recommendAndLoadContent = useCallback(async (
    profile: LearnerProfile,
    sessionKcs: KnowledgeComponent[],
    onSuccess: (kc: KnowledgeComponent, sequence: any) => void,
    onError: (error: string) => void
  ) => {
    try {
      console.log('🎯 Starting AI-powered content generation...');

      // Step 1: Get KC recommendations
      const excludedKcIds = sessionKcs.map(kc => kc.id);
      
      const recommendedKcs = await knowledgeComponentService.recommendNextKcs(
        profile.userId, 
        1, 
        excludedKcIds
      );

      if (recommendedKcs.length === 0) {
        const errorMsg = "No more Knowledge Components available to practice. All topics may have been completed in this session.";
        onError(errorMsg);
        return;
      }

      const nextKc = recommendedKcs[0];
      console.log(`🎯 Selected KC for AI generation: ${nextKc.name} (${nextKc.id})`);

      // Step 2: Generate AI-powered content sequence for the KC
      const sequence = await aiCreativeDirectorService.getAtomSequenceForKc(nextKc.id, profile.userId);
      
      if (!sequence) {
        const errorMsg = `Failed to generate AI content for topic: ${nextKc.name}. Please try again.`;
        console.error('❌ No AI sequence generated:', errorMsg);
        onError(errorMsg);
        return;
      }

      if (!sequence.atoms || sequence.atoms.length === 0) {
        const errorMsg = `No AI questions generated for topic: ${nextKc.name}. Please try again.`;
        onError(errorMsg);
        return;
      }

      console.log(`✅ AI Content generated successfully: ${sequence.atoms.length} questions for ${nextKc.name}`);
      onSuccess(nextKc, sequence);

    } catch (error) {
      const errorMsg = `AI content generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error('💥 AI content generation error:', error);
      onError(errorMsg);
    }
  }, []);

  return { recommendAndLoadContent };
};
