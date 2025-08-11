import React from 'react';

interface LearningMode { id: string; name: string; description?: string }
interface Props { onModeSelect: (mode: LearningMode) => void }

const LearningModeSelector: React.FC<Props> = ({ onModeSelect }) => {
  return (
    <div className="p-6 border rounded space-y-2">
      <h2 className="font-semibold">Choose a Mode</h2>
      <div className="flex gap-2">
        <button className="px-3 py-2 border rounded" onClick={() => onModeSelect({ id: 'adaptive', name: 'Adaptive' })}>Adaptive</button>
        <button className="px-3 py-2 border rounded" onClick={() => onModeSelect({ id: 'focused', name: 'Focused' })}>Focused</button>
      </div>
    </div>
  );
};

export default LearningModeSelector;
