
// src/components/adaptive-learning/atoms/TextExplanationAtom.tsx

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ContentAtom } from '@/types/content';

interface TextExplanationAtomProps {
  atom: ContentAtom;
}

const TextExplanationAtom: React.FC<TextExplanationAtomProps> = ({ atom }) => {
  const content = atom.content as {
    title?: string;
    explanation?: string;
    examples?: string[];
  };

  return (
    <Card className="bg-slate-700/50 border-slate-600">
      <CardHeader>
        <CardTitle className="text-lg text-sky-300">
          {content.title || 'Explanation'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {content.explanation && (
          <p className="text-slate-200 leading-relaxed">
            {content.explanation}
          </p>
        )}
        
        {content.examples && content.examples.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-slate-300 mb-2">Examples:</h4>
            <ul className="list-disc list-inside space-y-1">
              {content.examples.map((example, index) => (
                <li key={index} className="text-slate-300 text-sm">
                  {example}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TextExplanationAtom;
