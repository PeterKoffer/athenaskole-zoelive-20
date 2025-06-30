
import { useState } from 'react';
import { LearnerProfile } from '@/types/learnerProfile';
import { KnowledgeComponent } from '@/types/knowledgeComponent';
import aiCreativeDirectorService from '@/services/aiCreativeDirectorService';

export const useContentGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recommendAndLoadContent = async (
    profile: LearnerProfile,
    sessionKcs: KnowledgeComponent[],
    onSuccess: (kc: KnowledgeComponent, sequence: any) => void,
    onError: (error: string) => void
  ) => {
    console.log('🎯 Starting AI-powered content generation with enhanced uniqueness...');
    setIsGenerating(true);
    setError(null);

    try {
      // Simple KC selection for now - rotate through available KCs
      const availableKcs = [
        {
          id: 'kc_math_g4_add_fractions_likedenom',
          name: 'Adding Fractions with Like Denominators',
          subject: 'Mathematics',
          gradeLevels: [4],
          difficulty_estimate: 0.4
        },
        {
          id: 'kc_math_g3_multiplication_basic',
          name: 'Basic Multiplication',
          subject: 'Mathematics', 
          gradeLevels: [3],
          difficulty_estimate: 0.3
        },
        {
          id: 'kc_english_g5_reading_comprehension',
          name: 'Reading Comprehension',
          subject: 'English',
          gradeLevels: [5],
          difficulty_estimate: 0.5
        }
      ];

      // Select KC that hasn't been used recently in this session
      const usedKcIds = sessionKcs.map(kc => kc.id);
      const availableUnusedKcs = availableKcs.filter(kc => !usedKcIds.includes(kc.id));
      const selectedKc = availableUnusedKcs.length > 0 
        ? availableUnusedKcs[0] 
        : availableKcs[Math.floor(Math.random() * availableKcs.length)];

      console.log('🎯 Selected KC for AI generation:', selectedKc.name, `(${selectedKc.id})`);

      // Generate unique session context
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const uniquenessContext = {
        sessionId,
        timestamp: Date.now(),
        previousSessionCount: sessionKcs.length,
        userContext: profile.userId,
        uniquenessBooster: Math.random() * 1000,
        generationAttempt: Date.now() % 10000
      };

      console.log('🎲 Enhanced uniqueness context:', uniquenessContext);

      // Construct UserContext for the AiCreativeDirectorService
      const userContext = {
        userId: profile.userId,
        targetLanguage: profile.preferences?.preferredLanguage || 'en-US', // Default to en-US
        targetContextCurriculum: profile.preferences?.activeCurriculumContext || 'US_CCSSM', // Default to US_CCSSM
      };
      console.log('👤 UserContext for AI Director:', userContext);

      const sequence = await aiCreativeDirectorService.getAtomSequenceForKc(
        nextKc.id, 
        userContext // Pass the full UserContext object
      );

      if (!sequence) {
        throw new Error(`Failed to generate AI content for topic: ${selectedKc.name}. Please try again.`);
      }

      console.log('✅ AI sequence generated successfully:', {
        sequenceId: sequence.sequence_id,
        atomCount: sequence.atoms.length,
        selectedKc: selectedKc.name
      });

      onSuccess(selectedKc as KnowledgeComponent, sequence);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('❌ No AI sequence generated:', errorMessage);
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    error,
    recommendAndLoadContent
  };
};
