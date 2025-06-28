
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { ScenarioDefinition } from '@/types/scenario';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import { useScenarioSession } from './hooks/useScenarioSession';
import { useScenarioAnswering } from './hooks/useScenarioAnswering';
import { useScenarioEventLogging } from './hooks/useScenarioEventLogging';
import { useScenarioCompletion } from './hooks/useScenarioCompletion';
import { useScenarioNavigation } from './hooks/useScenarioNavigation';
import ScenarioHeader from './components/ScenarioHeader';
import ScenarioContent from './components/ScenarioContent';
import ScenarioSidebar from './components/ScenarioSidebar';

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

  const { logQuestionAttempt, logNavigation, logSessionEnd } = useScenarioEventLogging({
    scenario,
    session,
    currentNode,
    score
  });

  const { handleComplete, handleExit } = useScenarioCompletion({
    session,
    score,
    updateSession,
    logSessionEnd,
    onComplete,
    onExit
  });

  const { handleContinue } = useScenarioNavigation({
    currentNode,
    session,
    isCorrect,
    resetAnswering,
    moveToNextNode,
    logNavigation,
    handleComplete
  });

  console.log('🎭 ScenarioPlayer rendering with scenario:', scenario.title);

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
    
    logQuestionAttempt(currentNode, selectedAnswer);
    handleSubmitAnswer(currentNode, session, updateSession, (points) => setScore(prev => prev + points));
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
