
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import LearnerProfileService from '@/services/learnerProfile/LearnerProfileService';
import ContentOrchestrator from '@/services/content/ContentOrchestrator';
import { LearnerProfile } from '@/types/learnerProfile';
import { KnowledgeComponent } from '@/types/knowledgeComponent';

interface AdaptivePracticeState {
  learnerProfile: LearnerProfile | null;
  currentKc: KnowledgeComponent | null;
  atomSequence: any | null;
  currentAtomIndex: number;
  isLoading: boolean;
  error: string | null;
}

export const useAdaptivePracticeLogic = () => {
  const { toast } = useToast();
  
  const [state, setState] = useState<AdaptivePracticeState>({
    learnerProfile: null,
    currentKc: null,
    atomSequence: null,
    currentAtomIndex: 0,
    isLoading: true,
    error: null
  });

  // Load initial profile and generate content
  useEffect(() => {
    loadInitialContent();
  }, []);

  const loadInitialContent = async () => {
    console.log('🚀 AdaptivePracticeModule: Loading initial profile...');
    
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Load learner profile
      console.log('🚀 Loading learner profile...');
      const profile = await LearnerProfileService.getProfile('12345678-1234-5678-9012-123456789012');
      
      if (!profile) {
        throw new Error('Failed to load learner profile');
      }

      console.log('✅ Profile loaded successfully:', profile.userId);

      // Generate AI content using ContentOrchestrator
      const selectedKc = {
        id: 'kc_math_g4_add_fractions_likedenom',
        name: 'Adding Fractions with Like Denominators',
        subject: 'Mathematics',
        gradeLevels: [4],
        difficulty_estimate: 0.4
      };

      console.log('🎯 Generating atom sequence for KC:', selectedKc.id);
      const atomSequence = await ContentOrchestrator.getAtomSequenceForKc(
        selectedKc.id, 
        profile.userId
      );

      if (!atomSequence || !atomSequence.atoms || atomSequence.atoms.length === 0) {
        throw new Error('Failed to generate AI content sequence');
      }

      console.log('✅ AI atom sequence loaded:', {
        sequenceId: atomSequence.sequence_id,
        atomCount: atomSequence.atoms.length,
        firstAtomType: atomSequence.atoms[0]?.atom_type
      });

      setState({
        learnerProfile: profile,
        currentKc: selectedKc,
        atomSequence: atomSequence,
        currentAtomIndex: 0,
        isLoading: false,
        error: null
      });

    } catch (error) {
      console.error('❌ Failed to load initial content:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));

      toast({
        title: "Loading Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleNextAtom = useCallback(() => {
    console.log('➡️ Moving to next atom...');
    
    if (!state.atomSequence || !state.atomSequence.atoms) {
      console.error('❌ No atom sequence available');
      return;
    }

    const nextIndex = state.currentAtomIndex + 1;
    
    if (nextIndex >= state.atomSequence.atoms.length) {
      console.log('🔄 End of sequence reached, generating new content...');
      // Generate new content when we reach the end
      loadInitialContent();
      return;
    }

    setState(prev => ({
      ...prev,
      currentAtomIndex: nextIndex
    }));

    console.log('✅ Moved to atom index:', nextIndex);
  }, [state.atomSequence, state.currentAtomIndex]);

  const handleQuestionAnswer = useCallback(async (
    atom: any,
    userAnswer: string,
    isCorrect: boolean
  ) => {
    console.log('📝 Processing answer:', {
      atomId: atom.atom_id,
      userAnswer,
      isCorrect,
      kcId: state.currentKc?.id
    });

    if (!state.learnerProfile || !state.currentKc) {
      console.error('❌ Missing profile or KC data');
      return;
    }

    try {
      // Update KC mastery with stealth assessment
      const updatedProfile = await LearnerProfileService.updateKcMastery(
        state.learnerProfile.userId,
        state.currentKc.id,
        {
          isCorrect,
          newAttempt: true,
          interactionType: 'multiple_choice_question',
          interactionDetails: {
            atomId: atom.atom_id,
            userAnswer,
            correctAnswer: atom.content.correctAnswer || atom.content.correct,
            questionText: atom.content.question
          }
        }
      );

      setState(prev => ({
        ...prev,
        learnerProfile: updatedProfile
      }));

      console.log('✅ KC mastery updated successfully');

    } catch (error) {
      console.error('❌ Failed to update KC mastery:', error);
    }
  }, [state.learnerProfile, state.currentKc]);

  const handleRetry = useCallback(() => {
    console.log('🔄 Retrying content generation...');
    loadInitialContent();
  }, []);

  return {
    state,
    handleNextAtom,
    handleQuestionAnswer,
    handleRetry
  };
};
