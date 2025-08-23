import React from 'react';

interface OptimizedQuestionActivityProps {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  onComplete: (wasCorrect?: boolean) => void;
  questionNumber: number;
  totalQuestions: number;
}

// Minimal activity component to satisfy imports and let lessons progress
const OptimizedQuestionActivity: React.FC<OptimizedQuestionActivityProps> = ({
  subject,
  skillArea,
  difficultyLevel,
  onComplete,
  questionNumber,
  totalQuestions,
}) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-medium">Activity {questionNumber} of {totalQuestions}</h2>
      <p className="text-sm text-gray-600">
        Subject: {subject} • Skill: {skillArea} • Difficulty: {difficultyLevel}
      </p>
      <div className="mt-4 flex gap-2">
        <button
          className="rounded-md bg-emerald-600 px-3 py-1.5 text-white hover:bg-emerald-700"
          onClick={() => onComplete(true)}
        >
          Mark Correct
        </button>
        <button
          className="rounded-md bg-rose-600 px-3 py-1.5 text-white hover:bg-rose-700"
          onClick={() => onComplete(false)}
        >
          Mark Incorrect
        </button>
      </div>
    </div>
  );
};

export default OptimizedQuestionActivity;
