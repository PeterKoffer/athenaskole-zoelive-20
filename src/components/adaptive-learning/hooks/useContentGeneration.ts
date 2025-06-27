
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
      console.log('🎯 Starting content generation for profile:', profile.userId);
      console.log('📋 Session KCs so far:', sessionKcs.map(kc => kc.id));

      // Step 1: Get KC recommendations
      const excludedKcIds = sessionKcs.map(kc => kc.id);
      console.log('🚫 Excluding KCs:', excludedKcIds);
      
      const recommendedKcs = await knowledgeComponentService.recommendNextKcs(
        profile.userId, 
        1, 
        excludedKcIds
      );

      console.log('💡 Recommended KCs:', recommendedKcs);

      if (recommendedKcs.length === 0) {
        const errorMsg = "No more Knowledge Components available to practice. All topics may have been completed in this session.";
        console.warn('⚠️ No KCs recommended:', errorMsg);
        onError(errorMsg);
        return;
      }

      const nextKc = recommendedKcs[0];
      console.log('✅ Selected KC:', nextKc);

      // Step 2: Get atom sequence for the KC
      console.log('🔄 Requesting atom sequence for KC:', nextKc.id);
      const sequence = await aiCreativeDirectorService.getAtomSequenceForKc(nextKc.id, profile.userId);
      
      console.log('📦 Received sequence:', sequence);

      if (!sequence) {
        const errorMsg = `Failed to generate content sequence for topic: ${nextKc.name}`;
        console.error('❌ No sequence returned:', errorMsg);
        onError(errorMsg);
        return;
      }

      if (!sequence.atoms || sequence.atoms.length === 0) {
        const errorMsg = `No content atoms found for topic: ${nextKc.name}. The content repository may be empty for this KC.`;
        console.warn('⚠️ Empty sequence:', errorMsg);
        onError(errorMsg);
        return;
      }

      console.log('🎉 Content generation successful!', {
        kcId: nextKc.id,
        kcName: nextKc.name,
        atomCount: sequence.atoms.length
      });

      onSuccess(nextKc, sequence);

    } catch (error) {
      const errorMsg = `Content generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error('💥 Content generation error:', error);
      onError(errorMsg);
    }
  }, []);

  return { recommendAndLoadContent };
};
