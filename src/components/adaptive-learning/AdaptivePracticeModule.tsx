import React from 'react';

interface Props { onBack?: () => void }

export default function AdaptivePracticeModule({ onBack }: Props) {
  return (
    <div className="p-6 bg-card text-foreground border rounded">
      <h2 className="text-lg font-semibold mb-2">AdaptivePracticeModule (placeholder)</h2>
      <p className="text-sm opacity-80 mb-4">This is a temporary stub.</p>
      {onBack && (
        <button className="px-3 py-2 border rounded" onClick={onBack}>Back</button>
      )}
    </div>
  );
}
