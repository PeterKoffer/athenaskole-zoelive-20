
import { useEffect } from 'react';
import { ScenarioDefinition, ScenarioNode, ScenarioSession } from '@/types/scenario';
import stealthAssessmentService from '@/services/stealthAssessment/StealthAssessmentService';
import { InteractionEventType } from '@/types/stealthAssessment';

interface UseScenarioEventLoggingProps {
  scenario: ScenarioDefinition;
  session: ScenarioSession | null;
  currentNode: ScenarioNode | null;
  score: number;
}

export const useScenarioEventLogging = ({
  scenario,
  session,
  currentNode,
  score
}: UseScenarioEventLoggingProps) => {
  
  // Log scenario start when component mounts
  useEffect(() => {
    if (session && currentNode) {
      console.log('📊 Logging SESSION_START event');
      stealthAssessmentService.logEvent({
        type: InteractionEventType.SESSION_START
      }, 'ScenarioPlayer');
    }
  }, [scenario, session, currentNode]);

  // Log node view when currentNode changes
  useEffect(() => {
    if (currentNode && session) {
      console.log('📊 Logging CONTENT_VIEW event for node:', currentNode.id);
      stealthAssessmentService.logContentView({
        contentAtomId: currentNode.id,
        knowledgeComponentIds: [currentNode.educational.skillArea],
        contentType: currentNode.type.toUpperCase(),
        timeViewedMs: undefined
      }, 'ScenarioPlayer');
    }
  }, [currentNode, session]);

  const logQuestionAttempt = (currentNode: ScenarioNode, selectedAnswer: string) => {
    console.log('📊 Logging QUESTION_ATTEMPT event');
    stealthAssessmentService.logQuestionAttempt({
      questionId: currentNode.id,
      knowledgeComponentIds: [currentNode.educational.skillArea],
      answerGiven: selectedAnswer,
      isCorrect: selectedAnswer === currentNode.config.customProperties?.correctAnswer,
      attemptsMade: 1,
      timeTakenMs: undefined
    }, 'ScenarioPlayer');
  };

  const logNavigation = (fromNodeId: string, toNodeId: string | null) => {
    console.log('📊 Logging NAVIGATION event for branching decision');
    stealthAssessmentService.logEvent({
      type: InteractionEventType.NAVIGATION
    }, 'ScenarioPlayer');
  };

  const logSessionEnd = (reason: 'COMPLETION' | 'USER_INITIATED', session: ScenarioSession) => {
    console.log('📊 Logging SESSION_END event');
    stealthAssessmentService.logEvent({
      type: InteractionEventType.SESSION_END
    }, 'ScenarioPlayer');
  };

  return {
    logQuestionAttempt,
    logNavigation,
    logSessionEnd
  };
};
