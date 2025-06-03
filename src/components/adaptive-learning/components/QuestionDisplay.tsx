import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Question } from '../hooks/useQuestionGeneration';
import QuestionTimer from './QuestionTimer';
import QuestionCard from './QuestionCard';
import ExplanationCard from './ExplanationCard';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';

export interface QuestionDisplayProps {
  question: Question;
  onAnswerSelect: (selectedAnswer: number) => void;
  hasAnswered: boolean;
  selectedAnswer?: number;
  autoSubmit?: boolean;
  subject?: string;
}

const QuestionDisplay = ({ 
  question, 
  onAnswerSelect, 
  hasAnswered, 
  selectedAnswer,
  autoSubmit = false,
  subject = 'general'
}: QuestionDisplayProps) => {
  const [tempSelected, setTempSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const { speak } = useSpeechSynthesis();

  // Show explanation when answer is submitted
  useEffect(() => {
    if (hasAnswered && question.explanation) {
      setShowExplanation(true);
      
      // Read the explanation aloud with Nelie's voice
      speak(question.explanation);

      // For science subjects, keep explanation visible longer
      const hideDelay = subject === 'science' ? 15000 : 8000;
      const timer = setTimeout(() => {
        setShowExplanation(false);
      }, hideDelay);
      
      return () => clearTimeout(timer);
    }
  }, [hasAnswered, question.explanation, subject, speak]);

  const handleOptionClick = (optionIndex: number) => {
    if (hasAnswered) return;

    if (autoSubmit) {
      onAnswerSelect(optionIndex);
    } else {
      setTempSelected(optionIndex);
    }
  };

  const handleSubmit = () => {
    if (tempSelected !== null) {
      onAnswerSelect(tempSelected);
    }
  };

  const handleTimeUp = () => {
    if (!hasAnswered) {
      // Auto-select a random answer if time runs out
      const randomAnswer = Math.floor(Math.random() * question.options.length);
      onAnswerSelect(randomAnswer);
    }
  };

  return (
    <div className="space-y-6">
      {/* Always show countdown timer for active questions */}
      <QuestionTimer
        initialTime={question.estimatedTime}
        onTimeUp={handleTimeUp}
        isActive={!hasAnswered}
      />

      <QuestionCard
        question={question}
        hasAnswered={hasAnswered}
        selectedAnswer={selectedAnswer}
        tempSelected={tempSelected}
        onOptionClick={handleOptionClick}
      />

      {!autoSubmit && !hasAnswered && tempSelected !== null && (
        <Button 
          onClick={handleSubmit}
          className="w-full bg-lime-400 hover:bg-lime-500 text-black font-semibold mt-4"
        >
          Submit Answer
        </Button>
      )}

      {hasAnswered && question.explanation && (
        <ExplanationCard
          explanation={question.explanation}
          subject={subject}
          isVisible={showExplanation}
        />
      )}
    </div>
  );
};

export default QuestionDisplay;
