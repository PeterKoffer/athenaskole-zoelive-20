import React from 'react';

interface Props {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  onBack: () => void;
}

const AILearningModule: React.FC<Props> = ({ subject, skillArea, difficultyLevel, onBack }) => {
  return (
    <div className="p-6 border rounded">
      <h2 className="font-semibold mb-2">AI Learning Module (placeholder)</h2>
      <p className="text-sm opacity-80">Subject: {subject} • Skill: {skillArea} • Difficulty: {difficultyLevel}</p>
      <button className="mt-4 px-3 py-2 border rounded" onClick={onBack}>Back</button>
    </div>
  );
};

export default AILearningModule;
