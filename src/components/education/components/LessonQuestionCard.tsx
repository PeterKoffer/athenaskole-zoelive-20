
import { Card, CardContent } from '@/components/ui/card';
import QuestionDisplay from './QuestionDisplay';
import AnswerOptions from './AnswerOptions';
import QuestionResult from './QuestionResult';
import UnifiedLessonControls from './UnifiedLessonControls';
import { Question } from './hooks/useInteractiveLessonState';

interface LessonQuestionCardProps {
  question: Question;
  currentQuestionIndex: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  showResult: boolean;
  score: number;
  onAnswerSelect: (answerIndex: number) => void;
  onSubmitAnswer: () => void;
  onNextQuestion: () => void;
}

const LessonQuestionCard = ({
  question,
  currentQuestionIndex,
  totalQuestions,
  selectedAnswer,
  showResult,
  score,
  onAnswerSelect,
  onSubmitAnswer,
  onNextQuestion
}: LessonQuestionCardProps) => {
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="space-y-6 p-6">
        <QuestionDisplay
          question={question.question}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
          score={score}
          showResult={showResult}
        />

        <AnswerOptions
          options={question.options}
          selectedAnswer={selectedAnswer}
          correctAnswer={question.correctAnswer}
          showResult={showResult}
          onAnswerSelect={onAnswerSelect}
        />

        <QuestionResult
          showResult={showResult}
          isCorrect={selectedAnswer === question.correctAnswer}
          explanation={question.explanation}
          isLastQuestion={isLastQuestion}
        />

        <UnifiedLessonControls
          showResult={showResult}
          selectedAnswer={selectedAnswer}
          isLastQuestion={isLastQuestion}
          onSubmitAnswer={onSubmitAnswer}
          onNextQuestion={onNextQuestion}
        />
      </CardContent>
    </Card>
  );
};

export default LessonQuestionCard;
