
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface MultipleChoiceRendererProps {
  content: {
    question?: string;
    options?: string[];
    correctAnswer?: number;
    correct?: number;
    correctFeedback?: string;
    generalIncorrectFeedback?: string;
    explanation?: string;
  };
  atomId: string;
  onComplete: (result: { isCorrect: boolean; selectedAnswer: number; timeSpent: number }) => void;
}

const MultipleChoiceRenderer = ({ content, atomId, onComplete }: MultipleChoiceRendererProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());

  console.log('❓ MultipleChoiceRenderer rendering:', {
    atomId,
    hasQuestion: !!content.question,
    optionsCount: content.options?.length || 0,
    correctAnswer: content.correctAnswer ?? content.correct,
    hasExplanation: !!(content.explanation || content.correctFeedback)
  });

  // Track time spent
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const correctIndex = content.correctAnswer ?? content.correct ?? 0;
    const isCorrect = answerIndex === correctIndex;
    
    console.log('✅ Answer selected:', {
      selected: answerIndex,
      correct: correctIndex,
      isCorrect,
      timeSpent
    });

    // Auto-continue after showing result
    setTimeout(() => {
      onComplete({
        isCorrect,
        selectedAnswer: answerIndex,
        timeSpent
      });
    }, 2000);
  };

  const question = content.question || 'Question not available';
  const options = content.options || ['Option A', 'Option B', 'Option C', 'Option D'];
  const correctIndex = content.correctAnswer ?? content.correct ?? 0;

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>AI Generated Question</span>
          <div className="flex items-center text-sm text-gray-400">
            <Clock className="w-4 h-4 mr-1" />
            {timeSpent}s
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-lg text-gray-200 leading-relaxed">
          {question}
        </div>

        <div className="space-y-3">
          {options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === correctIndex;
            
            let buttonClass = "w-full p-4 text-left border rounded-lg transition-all duration-200 ";
            
            if (!showResult) {
              buttonClass += "border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-200";
            } else {
              if (isSelected && isCorrect) {
                buttonClass += "border-green-500 bg-green-900/30 text-green-300";
              } else if (isSelected && !isCorrect) {
                buttonClass += "border-red-500 bg-red-900/30 text-red-300";
              } else if (isCorrect) {
                buttonClass += "border-green-500 bg-green-900/20 text-green-400";
              } else {
                buttonClass += "border-gray-600 bg-gray-700 text-gray-400";
              }
            }

            return (
              <Button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
                className={buttonClass}
                variant="ghost"
              >
                <div className="flex items-center justify-between w-full">
                  <span>{option}</span>
                  {showResult && isSelected && (
                    isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )
                  )}
                  {showResult && !isSelected && isCorrect && (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                </div>
              </Button>
            );
          })}
        </div>

        {showResult && (
          <div className="mt-6 p-4 rounded-lg bg-blue-900/20 border border-blue-700">
            <div className="flex items-start space-x-3">
              {selectedAnswer === correctIndex ? (
                <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-red-400 mt-1 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className="text-white font-medium mb-2">
                  {selectedAnswer === correctIndex ? 'Correct!' : 'Not quite right'}
                </p>
                <p className="text-gray-300 text-sm">
                  {selectedAnswer === correctIndex 
                    ? (content.correctFeedback || content.explanation || 'Great job!')
                    : (content.generalIncorrectFeedback || content.explanation || 'Keep trying!')
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MultipleChoiceRenderer;
