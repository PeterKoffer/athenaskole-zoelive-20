
import LessonComplete from "./LessonComplete";
import ConceptMasteryTracker from "./ConceptMasteryTracker";

export interface SessionCompleteProps {
  subject: string;
  skillArea: string;
  answers: number[];
  sessionQuestions: any[];
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
  const correctAnswers = answers.reduce((count, answer, index) => {
    return count + (answer === sessionQuestions[index]?.correct ? 1 : 0);
  }, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <LessonComplete
        score={Math.round((correctAnswers / totalQuestions) * 100)}
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
