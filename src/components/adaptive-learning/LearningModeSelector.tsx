interface Props { onModeSelect: (mode: any) => void }

const LearningModeSelector = ({ onModeSelect }: Props) => {
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
