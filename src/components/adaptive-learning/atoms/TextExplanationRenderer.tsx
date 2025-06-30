
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, CheckCircle } from 'lucide-react';

interface TextExplanationRendererProps {
  content: {
    title?: string;
    explanation?: string;
    examples?: string[];
  };
  atomId: string;
  onComplete: (result: { isCorrect: boolean; selectedAnswer: number; timeSpent: number }) => void;
}

const TextExplanationRenderer: React.FC<TextExplanationRendererProps> = ({ 
  content, 
  atomId, 
  onComplete 
}) => {
  const [startTime] = React.useState(Date.now());

  const handleContinue = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    
    console.log('📖 Text explanation completed:', {
      atomId,
      timeSpent,
      hasTitle: !!content.title,
      hasExplanation: !!content.explanation
    });
    
    // For text explanations, we consider them "correct" as they're informational
    onComplete({ 
      isCorrect: true, 
      selectedAnswer: 0, 
      timeSpent 
    });
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-blue-400" />
          {content.title || 'Learning Content'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {content.explanation && (
          <div className="text-gray-300 leading-relaxed">
            {content.explanation}
          </div>
        )}
        
        {content.examples && content.examples.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-white font-medium">Examples:</h4>
            {content.examples.map((example, index) => (
              <div key={index} className="bg-blue-900/30 p-3 rounded-lg border border-blue-700">
                <p className="text-blue-100">{example}</p>
              </div>
            ))}
          </div>
        )}
        
        <div className="pt-4 flex justify-end">
          <Button 
            onClick={handleContinue}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TextExplanationRenderer;
