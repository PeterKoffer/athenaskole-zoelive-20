
import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface StableMultipleChoiceRendererProps {
  atom: any;
  onComplete: (result: { isCorrect: boolean; selectedAnswer: number; timeSpent: number }) => void;
}

const StableMultipleChoiceRenderer = ({ atom, onComplete }: StableMultipleChoiceRendererProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [startTime] = useState(Date.now());
  const [isCompleted, setIsCompleted] = useState(false);

  // Prevent multiple completions
  const handleComplete = useCallback(() => {
    if (isCompleted || selectedAnswer === null) return;
    
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const correctAnswer = atom.content.correctAnswer ?? atom.content.correct ?? 0;
    const isCorrect = selectedAnswer === correctAnswer;
    
    setIsCompleted(true);
    
    console.log('🎯 Question completed:', {
      selectedAnswer,
      correctAnswer,
      isCorrect,
      timeSpent,
      atomId: atom.atom_id
    });
    
    onComplete({ isCorrect, selectedAnswer, timeSpent });
  }, [selectedAnswer, atom, startTime, onComplete, isCompleted]);

  const handleAnswerSelect = useCallback((answerIndex: number) => {
    if (showResult || isCompleted) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    // Auto-complete after showing result briefly
    setTimeout(() => {
      handleComplete();
    }, 2000);
  }, [showResult, isCompleted, handleComplete]);

  if (!atom?.content) {
    return (
      <Card className="bg-red-900/20 border-red-700">
        <CardContent className="p-4">
          <p className="text-red-400">Error: Invalid question data</p>
        </CardContent>
      </Card>
    );
  }

  const correctAnswer = atom.content.correctAnswer ?? atom.content.correct ?? 0;
  const options = atom.content.options || [];

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>AI Generated Question</span>
          <Clock className="w-5 h-5 text-blue-400" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-xl font-semibold text-white mb-6">
          {atom.content.question}
        </div>

        <div className="grid gap-3">
          {options.map((option: string, index: number) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === correctAnswer;
            const showCorrect = showResult && isCorrect;
            const showIncorrect = showResult && isSelected && !isCorrect;

            return (
              <Button
                key={index}
                variant="outline"
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult || isCompleted}
                className={`
                  p-4 text-left justify-start h-auto whitespace-normal
                  ${showCorrect ? 'bg-green-600 border-green-500 text-white' : ''}
                  ${showIncorrect ? 'bg-red-600 border-red-500 text-white' : ''}
                  ${!showResult ? 'hover:bg-gray-700 border-gray-600' : ''}
                  ${isSelected && !showResult ? 'bg-blue-600 border-blue-500' : ''}
                `}
              >
                <div className="flex items-center space-x-3 w-full">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-sm font-bold">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {showCorrect && <CheckCircle className="w-5 h-5 text-green-200" />}
                  {showIncorrect && <XCircle className="w-5 h-5 text-red-200" />}
                </div>
              </Button>
            );
          })}
        </div>

        {showResult && atom.content.explanation && (
          <Card className={selectedAnswer === correctAnswer ? 'bg-green-900/30 border-green-700' : 'bg-red-900/30 border-red-700'}>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                {selectedAnswer === correctAnswer ? (
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <h4 className="font-semibold mb-2 text-white">
                    {selectedAnswer === correctAnswer ? 'Correct!' : 'Not quite right'}
                  </h4>
                  <p className="text-gray-300">{atom.content.explanation}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default StableMultipleChoiceRenderer;
