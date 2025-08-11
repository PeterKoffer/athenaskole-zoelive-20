import React from 'react';

interface Props {
  question: { prompt: string; options?: string[] };
  onAnswer?: (index: number) => void;
}

const QuestionCard: React.FC<Props> = ({ question, onAnswer }) => {
  return (
    <div className="p-4 border rounded">
      <div className="mb-2 font-medium">{question.prompt}</div>
      <div className="grid gap-2">
        {(question.options || []).map((opt, idx) => (
          <button key={idx} className="px-3 py-2 border rounded" onClick={() => onAnswer?.(idx)}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
