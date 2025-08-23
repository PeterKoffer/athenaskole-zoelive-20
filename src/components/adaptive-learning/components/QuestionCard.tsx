export type QuestionCardQuestion = {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
  learningObjectives?: string[];
  estimatedTime?: number;
  conceptsCovered?: string[];
  knowledgeComponentIds?: string[];
};

interface Props {
  question: QuestionCardQuestion;
  hasAnswered: boolean;
  selectedAnswer?: number;
  tempSelected: number | null;
  onOptionClick: (index: number) => void;
  onAnswerSubmit: (selectedIndex: number, isCorrect: boolean) => void;
  currentAttemptNumber: number;
}

const QuestionCard = ({ question, hasAnswered, selectedAnswer, tempSelected, onOptionClick, onAnswerSubmit }: Props) => {
  const handleSubmit = () => {
    if (tempSelected === null) return;
    const isCorrect = tempSelected === question.correct;
    onAnswerSubmit(tempSelected, isCorrect);
  };

  return (
    <div className="p-4 border rounded">
      <div className="mb-2 font-medium">{question.question}</div>
      <div className="grid gap-2">
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            className={`px-3 py-2 border rounded ${tempSelected === idx ? 'bg-muted' : ''}`}
            onClick={() => onOptionClick(idx)}
            disabled={hasAnswered}
          >
            {opt}
          </button>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        {!hasAnswered && (
          <button className="px-4 py-2 border rounded" onClick={handleSubmit} disabled={tempSelected === null}>
            Submit
          </button>
        )}
        {hasAnswered && selectedAnswer !== undefined && (
          <div className="text-sm">
            {selectedAnswer === question.correct ? '✅ Correct' : '❌ Incorrect'}
          </div>
        )}
      </div>
      {hasAnswered && question.explanation && (
        <p className="mt-3 text-sm opacity-80">{question.explanation}</p>
      )}
    </div>
  );
};

export default QuestionCard;
