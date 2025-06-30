
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2, CheckCircle } from 'lucide-react';

interface InteractiveExerciseRendererProps {
  content: {
    title?: string;
    description?: string;
    exerciseType?: string;
    components?: any;
  };
  atomId: string;
  onComplete: (result: { isCorrect: boolean; selectedAnswer: number; timeSpent: number }) => void;
}

const InteractiveExerciseRenderer: React.FC<InteractiveExerciseRendererProps> = ({ 
  content, 
  atomId, 
  onComplete 
}) => {
  const [startTime] = React.useState(Date.now());
  const [isCompleted, setIsCompleted] = React.useState(false);

  const handleComplete = () => {
    if (isCompleted) return;
    
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    setIsCompleted(true);
    
    console.log('🎮 Interactive exercise completed:', {
      atomId,
      timeSpent,
      exerciseType: content.exerciseType
    });
    
    // For interactive exercises, we consider them "correct" when completed
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
          <Gamepad2 className="w-5 h-5 mr-2 text-purple-400" />
          {content.title || 'Interactive Exercise'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {content.description && (
          <div className="text-gray-300 leading-relaxed">
            {content.description}
          </div>
        )}
        
        {content.exerciseType && (
          <div className="bg-purple-900/30 p-3 rounded-lg border border-purple-700">
            <p className="text-purple-100">
              <strong>Exercise Type:</strong> {content.exerciseType}
            </p>
          </div>
        )}
        
        {content.components?.problem && (
          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="text-white font-medium mb-2">Problem:</h4>
            <p className="text-gray-300">{content.components.problem}</p>
          </div>
        )}
        
        <div className="pt-4 flex justify-end">
          <Button 
            onClick={handleComplete}
            disabled={isCompleted}
            className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            {isCompleted ? 'Completed' : 'Complete Exercise'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveExerciseRenderer;
