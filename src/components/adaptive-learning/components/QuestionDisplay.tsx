import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Question } from '../hooks/useQuestionGeneration';
import QuestionTimer from './QuestionTimer';
import QuestionCard from './QuestionCard';
import ExplanationCard from './ExplanationCard';

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

  // Show explanation when answer is submitted
  useEffect(() => {
    if (hasAnswered && question.explanation) {
      setShowExplanation(true);
    }
  }, [hasAnswered, question.explanation]);

  const handleSpeechEnd = () => {
    setShowExplanation(false);
  };

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

  // Calculate if the answer was correct
  const isCorrect = hasAnswered && selectedAnswer === question.correct;
  const correctAnswerText = question.options[question.correct];

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
          onSpeechEnd={handleSpeechEnd}
          isCorrect={isCorrect}
          correctAnswer={correctAnswerText}
        />
      )}
    </div>
  );
};

export default QuestionDisplay;
