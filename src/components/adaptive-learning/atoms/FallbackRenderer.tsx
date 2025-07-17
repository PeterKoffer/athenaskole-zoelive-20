
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, RefreshCw } from 'lucide-react';

interface FallbackRendererProps {
  atom: any;
  onComplete: (result: { isCorrect: boolean; selectedAnswer: number; timeSpent: number }) => void;
}

const FallbackRenderer: React.FC<FallbackRendererProps> = ({ atom, onComplete }) => {
  const [startTime] = React.useState(Date.now());

  const handleContinue = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    
    console.log('📚 Enhanced fallback content used:', {
      atomId: atom?.atom_id || 'unknown',
      atomType: atom?.atom_type || 'unknown',
      timeSpent
    });
    
    onComplete({ 
      isCorrect: true, 
      selectedAnswer: 0, 
      timeSpent 
    });
  };

  return (
    <Card className="bg-blue-900/20 border-blue-700">
      <CardHeader>
        <CardTitle className="text-blue-400 flex items-center">
          <BookOpen className="w-5 h-5 mr-2" />
          Practice Content Ready
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-blue-200">
          <p className="mb-3">
            We've prepared some practice content for you to continue learning.
          </p>
          {atom?.content?.question && (
            <div className="bg-blue-800/30 p-4 rounded-lg">
              <p className="font-medium">{atom.content.question}</p>
            </div>
          )}
        </div>
        
        <div className="pt-4 flex justify-end">
          <Button 
            onClick={handleContinue}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Continue Learning
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FallbackRenderer;
