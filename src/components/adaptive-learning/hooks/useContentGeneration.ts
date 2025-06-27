
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

      // Step 2: Get atom sequence for the KC
      const sequence = await aiCreativeDirectorService.getAtomSequenceForKc(nextKc.id, profile.userId);
      
      if (!sequence) {
        const errorMsg = `Failed to generate content sequence for topic: ${nextKc.name}`;
        console.error('❌ No sequence returned:', errorMsg);
        onError(errorMsg);
        return;
      }

      if (!sequence.atoms || sequence.atoms.length === 0) {
        const errorMsg = `No content atoms found for topic: ${nextKc.name}. The content repository may be empty for this KC.`;
        onError(errorMsg);
        return;
      }

      onSuccess(nextKc, sequence);

    } catch (error) {
      const errorMsg = `Content generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error('💥 Content generation error:', error);
      onError(errorMsg);
    }
  }, []);

  return { recommendAndLoadContent };
};
