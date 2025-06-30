
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import type { ContentAtom } from '@/types/content';

interface FallbackRendererProps {
  atom: ContentAtom;
  onComplete: (result: { isCorrect: boolean; selectedAnswer: number; timeSpent: number }) => void;
}

const FallbackRenderer = ({ atom, onComplete }: FallbackRendererProps) => {
  const [startTime] = useState(Date.now());

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Content</span>
            <Clock className="w-5 h-5 text-orange-400" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-lg text-gray-200 leading-relaxed">
            Content type "{atom.atom_type}" is not yet supported.
          </div>
          
          <div className="text-center">
            <Button
              onClick={() => onComplete({
                isCorrect: true,
                selectedAnswer: 0,
                timeSpent: Date.now() - startTime
              })}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FallbackRenderer;
