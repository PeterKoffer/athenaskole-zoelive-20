
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import QuestionBadge from './QuestionBadge';
import AnswerOption from './AnswerOption';
import { Question } from '../hooks/useQuestionGeneration';
import stealthAssessmentService from '@/services/stealthAssessmentService';
import { InteractionEventType } from '@/types/stealthAssessment';
import { useEffect, useState } from 'react';

interface QuestionCardProps {
  question: Question;
  hasAnswered: boolean; // True if the user has submitted an answer for this question
  selectedAnswer?: number; // The index of the submitted answer
  tempSelected: number | null; // The index of the currently hovered/temporarily selected answer before submission
  onOptionClick: (index: number) => void; // Callback when an option is clicked (likely before submission)
  onAnswerSubmit: (selectedIndex: number, isCorrect: boolean) => void; // Callback when an answer is definitively submitted
  userId?: string; // Optional: Pass user ID if available, otherwise service will use mock
  sessionId?: string; // Optional: Pass session ID
  currentAttemptNumber: number; // To track attempts for this specific question instance
}

const QuestionCard = ({
  question,
  hasAnswered,
  selectedAnswer,
  tempSelected,
  onOptionClick,
  onAnswerSubmit, // Added for clarity on when an answer is final
  userId, // Consumed but service has a mock
  sessionId, // Consumed but service has a mock
  currentAttemptNumber,
}: QuestionCardProps) => {
  const [startTime, setStartTime] = useState<number>(0);

  useEffect(() => {
    setStartTime(Date.now());
    // Optionally log content view when question is first displayed
    // stealthAssessmentService.logContentView({
    //   contentAtomId: question.id, // Assuming question.id can serve as contentAtomId
    //   knowledgeComponentIds: question.knowledgeComponentIds || [],
    //   contentType: 'QUESTION_INTERACTIVE',
    // }, `QuestionCard-${question.id}`);
  }, [question.id, question.knowledgeComponentIds]);

  const handleOptionClickAndLog = (index: number) => {
    onOptionClick(index); // Original behavior: handles temporary selection

    // This function is called when an option is clicked, which might be before submission.
    // The actual "QuestionAttemptEvent" should be logged when the answer is submitted.
    // We'll assume `onAnswerSubmit` is called by a parent component when a "Submit" button is pressed.
  };

  // This new function would be called by the parent component after it confirms submission
  // For this POC, we'll simulate it being called directly from onOptionClick if it's a "submit on click" behavior
  // However, a dedicated submit button is usually better.
  // Let's assume for this POC that onOptionClick IS the submission for simplicity of change here.
  // A more robust implementation would have a separate submit action.

  const handleActualSubmission = (selectedIndex: number) => {
    const isCorrect = selectedIndex === question.correct;
    const timeTakenMs = Date.now() - startTime;

    // Call the parent's submit handler
    onAnswerSubmit(selectedIndex, isCorrect);

    // Log the question attempt
    stealthAssessmentService.logQuestionAttempt({
      questionId: question.id,
      knowledgeComponentIds: question.knowledgeComponentIds || ['unknown_kc'], // Ensure KCs are passed with question
      answerGiven: question.options[selectedIndex],
      isCorrect: isCorrect,
      attemptsMade: currentAttemptNumber, // This should be managed by the parent component that holds question state
      timeTakenMs: timeTakenMs,
      // sessionId: sessionId, // Service handles mock if not provided
      // userId: userId, // Service handles mock if not provided
    }, `QuestionCard-${question.id}`);
  };


  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-white">{question.question}</CardTitle>
          <QuestionBadge estimatedTime={question.estimatedTime} />
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
            // onClick={() => handleOptionClickAndLog(index)} // Original
            // For POC, let's assume clicking an option submits it if not already answered.
            // In a real app, a separate "Submit" button would call handleActualSubmission.
            onClick={() => {
              if (!hasAnswered) {
                // Call original onOptionClick for UI update (temp selection)
                onOptionClick(index);
                // Then call the submission logic.
                // This is a simplified flow for the POC.
                handleActualSubmission(index);
              } else {
                onOptionClick(index); // Allow re-clicking for review, but don't re-submit
              }
            }}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
