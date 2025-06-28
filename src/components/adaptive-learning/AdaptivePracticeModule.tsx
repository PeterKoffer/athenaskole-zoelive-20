
import React from 'react';
import type { ContentAtom } from '@/types/content';

import ServiceTestingInterface from '@/components/adaptive-learning/components/ServiceTestingInterface';
import LoadingState from '@/components/adaptive-learning/components/LoadingState';
import ErrorState from '@/components/adaptive-learning/components/ErrorState';
import EmptyContentState from '@/components/adaptive-learning/components/EmptyContentState';
import PracticeContent from '@/components/adaptive-learning/components/PracticeContent';
import DebugPanel from '@/components/adaptive-learning/components/DebugPanel';

import { useAdaptivePracticeLogic } from './hooks/useAdaptivePracticeLogic';

const AdaptivePracticeModule: React.FC = () => {
  const { state, updateState, handleNextAtom, handleQuestionAnswer, handleRetry } = useAdaptivePracticeLogic();

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
