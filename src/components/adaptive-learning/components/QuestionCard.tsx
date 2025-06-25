// src/components/adaptive-learning/components/QuestionCard.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import QuestionBadge from './QuestionBadge';
import AnswerOption from './AnswerOption';
import { Question } from '../hooks/useQuestionGeneration'; // Assuming Question type is defined here
import stealthAssessmentService from '@/services/stealthAssessmentService';
// InteractionEventType is not directly used here but good for context if expanding logging
// import { InteractionEventType } from '@/types/stealthAssessment'; 
import { useEffect, useState } from 'react';

export interface QuestionCardQuestion extends Question { // Renamed to avoid conflict if Question is also a component
  id: string; // Ensure question object has an ID
  knowledgeComponentIds?: string[]; // Ensure KCs can be passed
}

interface QuestionCardProps {
  question: QuestionCardQuestion; // Use the extended Question type
  hasAnswered: boolean;
  selectedAnswer?: number;
  tempSelected: number | null;
  onOptionClick: (index: number) => void;
  onAnswerSubmit: (selectedIndex: number, isCorrect: boolean) => void;
  // userId and sessionId are now handled by stealthAssessmentService internally
  currentAttemptNumber: number; 
}

const QuestionCard = ({
  question,
  hasAnswered,
  selectedAnswer,
  tempSelected,
  onOptionClick,
  onAnswerSubmit,
  currentAttemptNumber,
}: QuestionCardProps) => {
  const [startTime, setStartTime] = useState<number>(0);

  useEffect(() => {
    setStartTime(Date.now());
    // Example: Log content view when question is first displayed
    // This assumes question.id can serve as a contentAtomId for this context
    // and that knowledgeComponentIds are available on the question object.
    // stealthAssessmentService.logContentView({
    //   contentAtomId: question.id, 
    //   knowledgeComponentIds: question.knowledgeComponentIds || ['unknown_kc_question_view'],
    //   contentType: 'QUESTION_INTERACTIVE_VIEW',
    // }, `QuestionCard-View-${question.id}`);
  }, [question.id]); // Only re-run if question.id changes

  const handleActualSubmission = (selectedIndex: number) => {
    const isCorrect = selectedIndex === question.correct;
    const timeTakenMs = Date.now() - startTime;

    // Call the parent's submit handler (important for parent component to manage state)
    onAnswerSubmit(selectedIndex, isCorrect);

    // Log the question attempt
    stealthAssessmentService.logQuestionAttempt({
      questionId: question.id,
      knowledgeComponentIds: question.knowledgeComponentIds || ['unknown_kc_question_attempt'],
      answerGiven: question.options[selectedIndex],
      isCorrect: isCorrect,
      attemptsMade: currentAttemptNumber,
      timeTakenMs: timeTakenMs,
    }, `QuestionCard-Submit-${question.id}`);
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-white">{question.question}</CardTitle>
          {question.estimatedTime && <QuestionBadge estimatedTime={question.estimatedTime} />}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {question.options.map((option, index) => (
          <AnswerOption
            key={index}
            option={option}
            index={index}
            hasAnswered={hasAnswered}
            isCorrect={index === question.correct}
            isSelected={index === selectedAnswer}
            isTempSelected={index === tempSelected}
            onClick={() => {
              if (!hasAnswered) {
                // Update UI for temporary selection first
                onOptionClick(index); 
                // Then, directly call submission logic.
                // In a more complex app, onOptionClick might just set tempSelected,
                // and a separate "Submit" button would call handleActualSubmission.
                // For this POC, clicking an option when not answered is the submission.
                handleActualSubmission(index);
              } else {
                // If already answered, allow clicking to review (onOptionClick might highlight it)
                // but don't re-trigger submission.
                onOptionClick(index); 
              }
            }}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
