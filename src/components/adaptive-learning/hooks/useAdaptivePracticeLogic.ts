
import { useEffect } from 'react';
import { useAdaptivePracticeState } from './useAdaptivePracticeState';
import { useContentGeneration } from './useContentGeneration';
import { useProfileManagement } from './useProfileManagement';
import stealthAssessmentService from '@/services/stealthAssessment/StealthAssessmentService';
import learnerProfileService from '@/services/learnerProfile/LearnerProfileService';
import { MOCK_USER_ID } from '@/services/learnerProfile/MockProfileService';
import type { ContentAtom } from '@/types/content';

export const useAdaptivePracticeLogic = () => {
  const { state, updateState, resetFeedback, setError, setLoading } = useAdaptivePracticeState();
  const { recommendAndLoadContent } = useContentGeneration();
  const { loadLearnerProfile } = useProfileManagement();

  // Load initial profile
  useEffect(() => {
    console.log('🚀 AdaptivePracticeModule: Loading initial profile...');
    loadLearnerProfile(
      (profile) => {
        console.log('✅ Profile loaded successfully:', profile.userId);
        updateState({ learnerProfile: profile, isLoading: false });
      },
      (error) => {
        console.error('❌ Profile loading failed:', error);
        setError(error);
      }
    );
  }, [loadLearnerProfile, updateState, setError]);

  // Load content when profile is ready
  useEffect(() => {
    if (state.learnerProfile && !state.currentKc && !state.isLoading && !state.error) {
      console.log('🎯 Profile ready, generating content...');
      setLoading(true);
      
      recommendAndLoadContent(
        state.learnerProfile,
        state.sessionKcs,
        (kc, sequence) => {
          console.log('✅ Content generated successfully:', kc.name, sequence.atoms.length, 'atoms');
          updateState({
            currentKc: kc,
            atomSequence: sequence,
            currentAtomIndex: 0,
            sessionKcs: [...state.sessionKcs, kc],
            isLoading: false,
            error: null
          });
          resetFeedback();
        },
        (error) => {
          console.error('❌ Content generation failed:', error);
          setError(error);
        }
      );
    }
  }, [state.learnerProfile, state.currentKc, state.isLoading, state.error, state.sessionKcs, recommendAndLoadContent, updateState, setLoading, setError, resetFeedback]);

  const handleNextAtom = () => {
    console.log('➡️ Moving to next atom...');
    resetFeedback();
    
    if (state.atomSequence && state.currentAtomIndex < state.atomSequence.atoms.length - 1) {
      console.log(`📝 Next atom in sequence: ${state.currentAtomIndex + 1}/${state.atomSequence.atoms.length}`);
      updateState({ currentAtomIndex: state.currentAtomIndex + 1 });
    } else if (state.learnerProfile) {
      console.log('🔄 Generating new content sequence...');
      setLoading(true);
      
      recommendAndLoadContent(
        state.learnerProfile,
        state.sessionKcs,
        (kc, sequence) => {
          console.log('✅ New sequence generated:', kc.name, sequence.atoms.length, 'atoms');
          updateState({
            currentKc: kc,
            atomSequence: sequence,
            currentAtomIndex: 0,
            sessionKcs: [...state.sessionKcs, kc],
            isLoading: false
          });
        },
        (error) => {
          console.error('❌ New sequence generation failed:', error);
          setError(error);
        }
      );
    }
  };

  const handleQuestionAnswer = async (atom: ContentAtom, answerGiven: string | string[], isCorrectAnswer: boolean) => {
    if (!state.currentKc || !state.learnerProfile) {
      console.error('❌ Cannot handle answer - missing KC or profile');
      return;
    }

    console.log('📝 Processing answer:', { 
      atomId: atom.atom_id, 
      kcId: state.currentKc.id,
      isCorrect: isCorrectAnswer,
      answer: answerGiven,
      userId: MOCK_USER_ID
    });

    try {
      // Log the attempt first
      await stealthAssessmentService.logQuestionAttempt({
        questionId: atom.atom_id,
        knowledgeComponentIds: atom.kc_ids && atom.kc_ids.length > 0 ? atom.kc_ids : [state.currentKc.id],
        answerGiven: Array.isArray(answerGiven) ? answerGiven.join(', ') : answerGiven,
        isCorrect: isCorrectAnswer,
        timeTakenMs: Math.floor(Math.random() * 20000) + 5000,
        attemptsMade: 1 
      }, 'adaptive-practice-module');

      console.log('🔄 About to update KC mastery - KC:', state.currentKc.id, 'User:', MOCK_USER_ID);
      
      // Update mastery - this is where we test the duplicate key fix
      const updatedProfile = await learnerProfileService.updateKcMastery(
        MOCK_USER_ID, 
        state.currentKc.id,
        {
          isCorrect: isCorrectAnswer,
          newAttempt: true,
          interactionType: 'QUESTION_ATTEMPT',
          interactionDetails: { 
            difficulty: (atom.metadata as any)?.difficulty || 0.5,
            responseTime: Math.floor(Math.random() * 20000) + 5000,
            atomId: atom.atom_id,
            timestamp: Date.now(),
            questionText: (atom.content as any)?.question || 'Unknown question'
          }
        }
      );

      console.log('✅ KC mastery update completed successfully');
      updateState({ learnerProfile: updatedProfile });

    } catch (logError) {
      console.error('❌ Critical error handling question answer:', logError);
      console.error('❌ Error details:', {
        message: logError.message,
        stack: logError.stack,
        kcId: state.currentKc.id,
        userId: MOCK_USER_ID,
        isCorrect: isCorrectAnswer
      });
    }

    // Show feedback
    const feedbackContent = atom.content as any;
    updateState({
      isCorrect: isCorrectAnswer,
      feedbackMessage: isCorrectAnswer 
        ? (feedbackContent.correctFeedback || "Correct!")
        : (feedbackContent.generalIncorrectFeedback || "Not quite. Let's review."),
      showFeedback: true
    });
  };

  const handleRetry = () => {
    console.log('🔄 Retrying content generation...');
    updateState({ error: null, isLoading: true });
    
    if (state.learnerProfile) {
      recommendAndLoadContent(
        state.learnerProfile,
        state.sessionKcs,
        (kc, sequence) => {
          console.log('✅ Retry successful:', kc.name);
          updateState({
            currentKc: kc,
            atomSequence: sequence,
            currentAtomIndex: 0,
            sessionKcs: [...state.sessionKcs, kc],
            isLoading: false
          });
        },
        (error) => {
          console.error('❌ Retry failed:', error);
          setError(error);
        }
      );
    } else {
      console.log('🔄 Reloading profile...');
      loadLearnerProfile(
        (profile) => {
          console.log('✅ Profile reloaded successfully');
          updateState({ learnerProfile: profile, isLoading: false });
        },
        (error) => {
          console.error('❌ Profile reload failed:', error);
          setError(error);
        }
      );
    }
  };

  return {
    state,
    updateState,
    handleNextAtom,
    handleQuestionAnswer,
    handleRetry
  };
};
