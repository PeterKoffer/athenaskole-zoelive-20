
import LessonComplete from "./LessonComplete";
import ConceptMasteryTracker from "./ConceptMasteryTracker";
import { SessionQuestion, SessionAnswer } from '../types/SessionTypes';

export interface SessionCompleteProps {
  subject: string;
  skillArea: string;
  answers: SessionAnswer[] | number[]; // Support both new and legacy formats
  sessionQuestions: SessionQuestion[] | any[]; // Support both new and legacy formats
  totalQuestions: number;
  onRetry: () => void;
  onBack: () => void;
}

const SessionComplete = ({
  subject,
  skillArea,
  answers,
  sessionQuestions,
  totalQuestions,
  onRetry,
  onBack
}: SessionCompleteProps) => {
  // Handle both new SessionAnswer[] format and legacy number[] format
  const correctAnswers = Array.isArray(answers) && answers.length > 0
    ? typeof answers[0] === 'object'
      ? (answers as SessionAnswer[]).reduce((count, answer) => count + (answer.isCorrect ? 1 : 0), 0)
      : (answers as number[]).reduce((count, answer, index) => {
          const question = sessionQuestions[index];
          const correctAnswer = question?.correct ?? question?.correctAnswer ?? 0;
          return count + (answer === correctAnswer ? 1 : 0);
        }, 0)
    : 0;

  const score = Math.round((correctAnswers / totalQuestions) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <LessonComplete
        score={score}
        totalQuestions={totalQuestions}
        onRetry={onRetry}
        onBack={onBack}
      />
      
      {/* Show concept mastery tracking after completion */}
      <ConceptMasteryTracker 
        subject={subject} 
        skillArea={skillArea}
      />
    </div>
  );
};

export default SessionComplete;
