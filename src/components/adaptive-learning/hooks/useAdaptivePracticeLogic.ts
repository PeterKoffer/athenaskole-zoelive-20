
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

// Dynamic Knowledge Components for variety
const DIVERSE_KCS = [
  {
    id: 'kc_math_g4_add_fractions_likedenom',
    name: 'Adding Fractions with Like Denominators',
    subject: 'Mathematics',
    gradeLevels: [4],
    difficulty_estimate: 0.4
  },
  {
    id: 'kc_math_g5_multiply_decimals',
    name: 'Multiplying Decimal Numbers',
    subject: 'Mathematics',
    gradeLevels: [5],
    difficulty_estimate: 0.6
  },
  {
    id: 'kc_math_g3_basic_division',
    name: 'Basic Division with Remainders',
    subject: 'Mathematics',
    gradeLevels: [3],
    difficulty_estimate: 0.5
  },
  {
    id: 'kc_math_g4_area_rectangles',
    name: 'Finding Area of Rectangles',
    subject: 'Mathematics',
    gradeLevels: [4],
    difficulty_estimate: 0.4
  },
  {
    id: 'kc_math_g5_equivalent_fractions',
    name: 'Understanding Equivalent Fractions',
    subject: 'Mathematics',
    gradeLevels: [5],
    difficulty_estimate: 0.7
  }
];

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

  // Track used KCs to ensure variety
  const [usedKcIds, setUsedKcIds] = useState<Set<string>>(new Set());

  // Load initial profile and generate content
  useEffect(() => {
    loadInitialContent();
  }, []);

  const getRandomKc = useCallback(() => {
    // Filter out already used KCs if we haven't used all of them
    const availableKcs = usedKcIds.size < DIVERSE_KCS.length 
      ? DIVERSE_KCS.filter(kc => !usedKcIds.has(kc.id))
      : DIVERSE_KCS; // Reset if all have been used

    // Select random KC
    const randomIndex = Math.floor(Math.random() * availableKcs.length);
    const selectedKc = availableKcs[randomIndex];
    
    console.log('🎲 Selected random KC:', selectedKc.name, 'from', availableKcs.length, 'available');
    return selectedKc;
  }, [usedKcIds]);

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

      // Select a diverse KC
      const selectedKc = getRandomKc();
      
      // Add to used KCs
      setUsedKcIds(prev => new Set([...prev, selectedKc.id]));

      console.log('🎯 Generating diverse atom sequence for KC:', selectedKc.id);
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
        firstAtomType: atomSequence.atoms[0]?.atom_type,
        kcName: selectedKc.name
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
      console.log('🔄 End of sequence reached, generating NEW diverse content...');
      // Generate new content with a different KC when we reach the end
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
