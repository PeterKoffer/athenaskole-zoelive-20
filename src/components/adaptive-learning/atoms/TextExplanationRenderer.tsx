
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, BookOpen } from 'lucide-react';

interface TextExplanationContent {
  title?: string;
  explanation?: string;
  examples?: string[];
}

interface TextExplanationRendererProps {
  content: TextExplanationContent;
  atomId: string;
  onComplete: (result: { isCorrect: boolean; selectedAnswer: number; timeSpent: number }) => void;
}

const TextExplanationRenderer = ({ content, atomId, onComplete }: TextExplanationRendererProps) => {
  const [startTime] = useState(Date.now());

  console.log('📖 TextExplanationRenderer rendering:', {
    atomId,
    hasTitle: !!content.title,
    hasExplanation: !!content.explanation,
    hasExamples: !!content.examples,
    examplesCount: content.examples?.length || 0
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('⏰ Auto-completing text explanation after 5 seconds');
      onComplete({
        isCorrect: true,
        selectedAnswer: 0,
        timeSpent: Date.now() - startTime
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete, startTime]);

  const handleManualContinue = () => {
    console.log('👆 Manual continue clicked');
    onComplete({
      isCorrect: true,
      selectedAnswer: 0,
      timeSpent: Date.now() - startTime
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-green-400" />
              {content.title || 'Learn'}
            </span>
            <Clock className="w-5 h-5 text-blue-400" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {content.explanation && (
            <div className="text-lg text-gray-200 leading-relaxed">
              {content.explanation}
            </div>
          )}
          
          {content.examples && Array.isArray(content.examples) && content.examples.length > 0 && (
            <div className="bg-blue-900/30 rounded-lg p-4">
              <h4 className="font-semibold text-blue-200 mb-3">Examples:</h4>
              <ul className="space-y-2">
                {content.examples.map((example, index) => (
                  <li key={`example-${index}-${atomId}`} className="text-blue-100 flex items-center">
                    <span className="text-blue-400 mr-2">•</span>
                    {String(example)}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="text-center">
            <div className="text-gray-400 text-sm mb-4">
              Automatically continuing in a few seconds...
            </div>
            <Button
              onClick={handleManualContinue}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TextExplanationRenderer;
