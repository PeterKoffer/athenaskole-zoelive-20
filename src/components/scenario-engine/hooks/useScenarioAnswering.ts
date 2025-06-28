
import { useState } from 'react';
import { ScenarioNode, ScenarioSession } from '@/types/scenario';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import stealthAssessmentService from '@/services/stealthAssessment/StealthAssessmentService';
import { InteractionEventType } from '@/types/stealthAssessment';

export const useScenarioAnswering = () => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);
  
  const { speakAsNelie } = useUnifiedSpeech();

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    console.log('📝 Answer selected:', answer);
    
    // Log answer selection as a revision event if changing answer
    if (selectedAnswer && selectedAnswer !== answer) {
      console.log('📊 Logging REVISION event for answer change');
      stealthAssessmentService.logEvent({
        type: InteractionEventType.REVISION,
        originalAnswer: selectedAnswer,
        revisedAnswer: answer
      }, 'useScenarioAnswering');
    }
  };

  const handleSubmitAnswer = (
    currentNode: ScenarioNode,
    session: ScenarioSession,
    onSessionUpdate: (updates: Partial<ScenarioSession>) => void,
    onScoreUpdate: (score: number) => void
  ) => {
    const correctAnswer = currentNode.config.customProperties?.correctAnswer;
    const isAnswerCorrect = selectedAnswer === correctAnswer;
    
    setIsCorrect(isAnswerCorrect);
    setShowResult(true);
    setAttempts(prev => prev + 1);
    
    if (isAnswerCorrect) {
      onScoreUpdate(10);
      speakAsNelie("Correct! Great job!", true, 'result-feedback');
    } else {
      speakAsNelie("That's not quite right. Let me help you with that.", true, 'result-feedback');
    }
    
    // Update session
    const updatedSession = {
      responses: {
        ...session.responses,
        [currentNode.id]: {
          answer: selectedAnswer,
          correct: isAnswerCorrect,
          attempts: attempts + 1,
          timestamp: new Date()
        }
      }
    };
    onSessionUpdate(updatedSession);
    
    console.log('🎯 Answer submitted:', { selectedAnswer, correctAnswer, isAnswerCorrect });
  };

  const resetAnswering = () => {
    setShowResult(false);
    setSelectedAnswer('');
  };

  return {
    selectedAnswer,
    showResult,
    isCorrect,
    attempts,
    handleAnswerSelect,
    handleSubmitAnswer,
    resetAnswering
  };
};
