
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { ScenarioDefinition } from '@/types/scenario';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import { useScenarioSession } from './hooks/useScenarioSession';
import { useScenarioAnswering } from './hooks/useScenarioAnswering';
import ScenarioHeader from './components/ScenarioHeader';
import ScenarioContent from './components/ScenarioContent';
import ScenarioSidebar from './components/ScenarioSidebar';
import stealthAssessmentService from '@/services/stealthAssessment/StealthAssessmentService';
import { InteractionEventType } from '@/types/stealthAssessment';

interface ScenarioPlayerProps {
  scenario: ScenarioDefinition;
  onComplete: () => void;
  onExit: () => void;
}

const ScenarioPlayer: React.FC<ScenarioPlayerProps> = ({
  scenario,
  onComplete,
  onExit
}) => {
  const { session, currentNode, score, setScore, updateSession, moveToNextNode } = useScenarioSession(scenario);
  const { 
    selectedAnswer, 
    showResult, 
    isCorrect, 
    handleAnswerSelect, 
    handleSubmitAnswer, 
    resetAnswering 
  } = useScenarioAnswering();
  
  const { speakAsNelie, isSpeaking, stop } = useUnifiedSpeech();

  console.log('🎭 ScenarioPlayer rendering with scenario:', scenario.title);

  // Log scenario start when component mounts
  React.useEffect(() => {
    if (session && currentNode) {
      console.log('📊 Logging SESSION_START event');
      stealthAssessmentService.logEvent({
        type: InteractionEventType.SESSION_START,
        learningGoals: scenario.educational.learningOutcomes
      }, 'ScenarioPlayer');
    }
  }, [scenario, session, currentNode]);

  // Log node view when currentNode changes
  React.useEffect(() => {
    if (currentNode && session) {
      console.log('📊 Logging CONTENT_VIEW event for node:', currentNode.id);
      stealthAssessmentService.logContentView({
        contentAtomId: currentNode.id,
        knowledgeComponentIds: [currentNode.educational.skillArea],
        contentType: currentNode.type.toUpperCase(),
        timeViewedMs: undefined // Will be calculated when leaving the node
      }, 'ScenarioPlayer');
    }
  }, [currentNode, session]);

  const handleSpeak = async () => {
    if (!currentNode) return;
    
    if (isSpeaking) {
      stop();
    } else {
      await speakAsNelie(currentNode.content, true, 'scenario-content');
    }
  };

  const handleSubmit = () => {
    if (!currentNode || !session) return;
    
    // Log the answer attempt
    console.log('📊 Logging QUESTION_ATTEMPT event');
    stealthAssessmentService.logQuestionAttempt({
      questionId: currentNode.id,
      knowledgeComponentIds: [currentNode.educational.skillArea],
      answerGiven: selectedAnswer,
      isCorrect: selectedAnswer === currentNode.config.customProperties?.correctAnswer,
      attemptsMade: 1,
      timeTakenMs: undefined // Could be enhanced to track actual time
    }, 'ScenarioPlayer');

    handleSubmitAnswer(currentNode, session, updateSession, (points) => setScore(prev => prev + points));
  };

  const handleContinue = () => {
    if (!currentNode || !session) return;
    
    resetAnswering();
    
    // Determine next node based on branching logic
    let nextNodeId: string | null = null;
    
    if (currentNode.connections.branches) {
      const branch = currentNode.connections.branches.find(b => 
        (b.condition === 'correct' && isCorrect) ||
        (b.condition === 'incorrect' && !isCorrect)
      );
      nextNodeId = branch?.targetNodeId || currentNode.connections.fallback || null;
      
      // Log the branching decision
      console.log('📊 Logging NAVIGATION event for branching decision');
      stealthAssessmentService.logEvent({
        type: InteractionEventType.NAVIGATION,
        fromPath: currentNode.id,
        toPath: nextNodeId || 'scenario_end',
        navigationType: 'INTERNAL_LINK' as const
      }, 'ScenarioPlayer');
    } else {
      nextNodeId = currentNode.connections.next || null;
    }
    
    if (nextNodeId) {
      moveToNextNode(nextNodeId);
    } else {
      // Scenario complete
      console.log('🎉 Scenario completed!');
      handleComplete();
    }
  };

  const handleComplete = () => {
    if (session) {
      const finalSession = {
        ...session,
        status: 'completed' as const,
        timestamps: {
          ...session.timestamps,
          completedAt: new Date()
        }
      };
      updateSession(finalSession);
      
      // Log scenario completion
      console.log('📊 Logging SESSION_END event');
      stealthAssessmentService.logEvent({
        type: InteractionEventType.SESSION_END,
        reason: 'COMPLETION' as const,
        metrics: {
          totalScore: score,
          nodesCompleted: session.progress.nodesCompleted,
          totalNodes: session.progress.totalNodes,
          percentComplete: session.progress.percentComplete,
          timeSpent: Date.now() - session.timestamps.startedAt.getTime()
        }
      }, 'ScenarioPlayer');
      
      console.log('✅ Final session:', finalSession);
    }
    
    speakAsNelie("Congratulations! You've completed the scenario!", true, 'completion');
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  const handleExit = () => {
    if (session) {
      // Log scenario exit
      console.log('📊 Logging SESSION_END event for exit');
      stealthAssessmentService.logEvent({
        type: InteractionEventType.SESSION_END,
        reason: 'USER_INITIATED' as const,
        metrics: {
          totalScore: score,
          nodesCompleted: session.progress.nodesCompleted,
          totalNodes: session.progress.totalNodes,
          percentComplete: session.progress.percentComplete,
          timeSpent: Date.now() - session.timestamps.startedAt.getTime()
        }
      }, 'ScenarioPlayer');
    }
    onExit();
  };

  if (!currentNode || !session) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading scenario...</div>
      </div>
    );
  }

  const progressPercent = session.progress.percentComplete;

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <ScenarioHeader
          scenario={scenario}
          session={session}
          score={score}
          isSpeaking={isSpeaking}
          onExit={handleExit}
          onSpeak={handleSpeak}
        />

        {/* Progress Bar */}
        <div className="mb-6">
          <Progress value={progressPercent} className="w-full h-2" />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Content Area */}
          <div className="lg:col-span-2">
            <ScenarioContent
              currentNode={currentNode}
              selectedAnswer={selectedAnswer}
              showResult={showResult}
              isCorrect={isCorrect}
              onAnswerSelect={handleAnswerSelect}
              onSubmitAnswer={handleSubmit}
              onContinue={handleContinue}
            />
          </div>

          {/* Sidebar */}
          <ScenarioSidebar
            currentNode={currentNode}
            isSpeaking={isSpeaking}
          />
        </div>
      </div>
    </div>
  );
};

export default ScenarioPlayer;
