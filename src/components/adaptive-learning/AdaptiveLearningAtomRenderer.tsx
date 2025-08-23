import React from 'react';
import { LearningAtom } from '@/types/learning';

interface Props {
  atom: LearningAtom;
  onComplete?: (performance: any) => void;
  eventContext?: string;
}

const AdaptiveLearningAtomRenderer: React.FC<Props> = ({ atom, onComplete }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">{atom.content?.title || atom.curriculumObjectiveTitle}</h2>
      <p className="text-sm opacity-80">{atom.content?.description || atom.narrativeContext}</p>
      <button
        className="mt-4 px-4 py-2 border rounded"
        onClick={() => onComplete?.({ score: 1, completed: true })}
      >
        Complete Atom
      </button>
    </div>
  );
};

export default AdaptiveLearningAtomRenderer;
