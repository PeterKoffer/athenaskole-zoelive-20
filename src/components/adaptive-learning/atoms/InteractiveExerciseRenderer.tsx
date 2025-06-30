
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Target } from 'lucide-react';

interface InteractiveExerciseContent {
  title?: string;
  description?: string;
  exerciseType?: string;
  components?: {
    problem?: string;
    answer?: string;
    [key: string]: any;
  };
}

interface InteractiveExerciseRendererProps {
  content: InteractiveExerciseContent;
  atomId: string;
  onComplete: (result: { isCorrect: boolean; selectedAnswer: number; timeSpent: number }) => void;
}

const InteractiveExerciseRenderer = ({ content, atomId, onComplete }: InteractiveExerciseRendererProps) => {
  const [startTime] = useState(Date.now());
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  console.log('🎯 InteractiveExerciseRenderer rendering:', {
    atomId,
    hasTitle: !!content.title,
    hasDescription: !!content.description,
    exerciseType: content.exerciseType,
    hasComponents: !!content.components
  });

  const handleSubmit = () => {
    if (!content.components?.answer) {
      // If no expected answer, just mark as correct
      const timeSpent = Date.now() - startTime;
      onComplete({
        isCorrect: true,
        selectedAnswer: 0,
        timeSpent
      });
      return;
    }

    const correct = userAnswer.toLowerCase().trim() === content.components.answer.toLowerCase().trim();
    setIsCorrect(correct);
    setShowResult(true);

    // Auto-complete after showing result
    setTimeout(() => {
      onComplete({
        isCorrect: correct,
        selectedAnswer: correct ? 1 : 0,
        timeSpent: Date.now() - startTime
      });
    }, 3000);
  };

  const handleContinue = () => {
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
              <Target className="w-5 h-5 mr-2 text-orange-400" />
              {content.title || 'Interactive Exercise'}
            </span>
            <Clock className="w-5 h-5 text-blue-400" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {content.description && (
            <div className="text-lg text-gray-200 leading-relaxed">
              {content.description}
            </div>
          )}
          
          {content.components?.problem && (
            <div className="bg-orange-900/30 rounded-lg p-4">
              <h4 className="font-semibold text-orange-200 mb-3">Problem:</h4>
              <p className="text-orange-100 text-lg">
                {content.components.problem}
              </p>
            </div>
          )}

          {content.components?.answer && !showResult && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Answer:
                </label>
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your answer..."
                />
              </div>
              <Button
                onClick={handleSubmit}
                disabled={!userAnswer.trim()}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              >
                Submit Answer
              </Button>
            </div>
          )}

          {showResult && (
            <Card className={`${isCorrect ? 'bg-green-900 border-green-600' : 'bg-red-900 border-red-600'}`}>
              <CardContent className="p-4">
                <div className="text-center">
                  <h4 className={`font-semibold mb-2 ${isCorrect ? 'text-green-100' : 'text-red-100'}`}>
                    {isCorrect ? 'Excellent!' : 'Not quite right'}
                  </h4>
                  <p className={`${isCorrect ? 'text-green-200' : 'text-red-200'}`}>
                    {isCorrect 
                      ? 'You got it right!' 
                      : `The correct answer was: ${content.components?.answer}`
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {!content.components?.answer && (
            <div className="text-center">
              <Button
                onClick={handleContinue}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                Continue
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveExerciseRenderer;
