
import React, { useEffect } from 'react';
import stealthAssessmentService from '@/services/stealthAssessment/StealthAssessmentService';
import learnerProfileService from '@/services/learnerProfile/LearnerProfileService';
import { MOCK_USER_ID } from '@/services/learnerProfile/MockProfileService';
import type { ContentAtom } from '@/types/content';

import ServiceTestingInterface from '@/components/adaptive-learning/components/ServiceTestingInterface';
import LoadingState from '@/components/adaptive-learning/components/LoadingState';
import ErrorState from '@/components/adaptive-learning/components/ErrorState';
import EmptyContentState from '@/components/adaptive-learning/components/EmptyContentState';
import PracticeContent from '@/components/adaptive-learning/components/PracticeContent';
import DebugPanel from '@/components/adaptive-learning/components/DebugPanel';

import { useAdaptivePracticeState } from '@/components/adaptive-learning/hooks/useAdaptivePracticeState';
import { useContentGeneration } from '@/components/adaptive-learning/hooks/useContentGeneration';
import { useProfileManagement } from '@/components/adaptive-learning/hooks/useProfileManagement';

const AdaptivePracticeModule: React.FC = () => {
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
      isCorrect: isCorrectAnswer,
      answer: answerGiven 
    });

    try {
      // Log the attempt
      await stealthAssessmentService.logQuestionAttempt({
        questionId: atom.atom_id,
        knowledgeComponentIds: atom.kc_ids && atom.kc_ids.length > 0 ? atom.kc_ids : [state.currentKc.id],
        answerGiven: Array.isArray(answerGiven) ? answerGiven.join(', ') : answerGiven,
        isCorrect: isCorrectAnswer,
        timeTakenMs: Math.floor(Math.random() * 20000) + 5000,
        attemptsMade: 1 
      }, 'adaptive-practice-module');

      // Update mastery
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
            timestamp: Date.now()
          }
        }
      );

      updateState({ learnerProfile: updatedProfile });

    } catch (logError) {
      console.error('❌ Error handling question answer:', logError);
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

  const currentAtom = state.atomSequence?.atoms[state.currentAtomIndex];

  // Console logging for debugging
  console.log('🔍 AdaptivePracticeModule state:', {
    hasProfile: !!state.learnerProfile,
    hasCurrentKc: !!state.currentKc,
    hasAtomSequence: !!state.atomSequence,
    currentAtomIndex: state.currentAtomIndex,
    totalAtoms: state.atomSequence?.atoms.length || 0,
    hasCurrentAtom: !!currentAtom,
    isLoading: state.isLoading,
    error: state.error,
    showServiceTests: state.showServiceTests
  });

  // Render states
  if (state.showServiceTests) {
    return (
      <ServiceTestingInterface 
        onBack={() => updateState({ showServiceTests: false })}
      />
    );
  }

  // Always show debug panel in development
  const debugPanel = (
    <DebugPanel
      learnerProfile={state.learnerProfile}
      currentKc={state.currentKc}
      atomSequence={state.atomSequence}
      currentAtomIndex={state.currentAtomIndex}
      sessionKcs={state.sessionKcs}
      error={state.error}
    />
  );

  if (state.isLoading && !currentAtom && !state.error) {
    return (
      <div>
        {debugPanel}
        <LoadingState />
      </div>
    );
  }

  if (state.error) {
    return (
      <div>
        {debugPanel}
        <ErrorState 
          error={state.error}
          onRetry={handleRetry}
          onShowServiceTests={() => updateState({ showServiceTests: true })}
        />
      </div>
    );
  }
  
  if (!state.isLoading && (!state.currentKc || !currentAtom)) {
    return (
      <div>
        {debugPanel}
        <EmptyContentState 
          onRefresh={handleRetry}
          onShowServiceTests={() => updateState({ showServiceTests: true })}
        />
      </div>
    );
  }
  
  if (!currentAtom) {
    return (
      <div>
        {debugPanel}
        <LoadingState title="Preparing Content..." />
      </div>
    );
  }

  return (
    <div>
      {debugPanel}
      <PracticeContent
        currentKc={state.currentKc}
        learnerProfile={state.learnerProfile}
        currentAtom={currentAtom}
        showFeedback={state.showFeedback}
        isCorrect={state.isCorrect}
        feedbackMessage={state.feedbackMessage}
        isLoading={state.isLoading}
        onQuestionAnswer={handleQuestionAnswer}
        onNextAtom={handleNextAtom}
        onShowServiceTests={() => updateState({ showServiceTests: true })}
      />
    </div>
  );
};

export default AdaptivePracticeModule;
