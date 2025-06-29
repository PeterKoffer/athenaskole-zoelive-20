
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import { ContentAtom } from '@/types/content';

interface QuestionRendererProps {
  atom: ContentAtom;
  onComplete: (result: { isCorrect: boolean; selectedAnswer: number; timeSpent: number }) => void;
}

const QuestionRenderer = ({ atom, onComplete }: QuestionRendererProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [startTime] = useState(Date.now());

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    const timeSpent = Date.now() - startTime;
    const isCorrect = selectedAnswer === atom.content.correctAnswer;
    
    setShowResult(true);
    
    // Auto-continue after showing result
    setTimeout(() => {
      onComplete({ isCorrect, selectedAnswer, timeSpent });
    }, 2000);
  };

  const handleContinue = () => {
    if (selectedAnswer === null) return;
    
    const timeSpent = Date.now() - startTime;
    const isCorrect = selectedAnswer === atom.content.correctAnswer;
    
    onComplete({ isCorrect, selectedAnswer, timeSpent });
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Question */}
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-6">
              {atom.content.question}
            </h3>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {atom.content.options.map((option: string, index: number) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === atom.content.correctAnswer;
              
              let buttonClass = "w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ";
              
              if (showResult) {
                if (isCorrect) {
                  buttonClass += "bg-green-900/30 border-green-500 text-green-300";
                } else if (isSelected && !isCorrect) {
                  buttonClass += "bg-red-900/30 border-red-500 text-red-300";
                } else {
                  buttonClass += "bg-gray-700 border-gray-600 text-gray-400";
                }
              } else if (isSelected) {
                buttonClass += "bg-blue-900/30 border-blue-500 text-blue-300";
              } else {
                buttonClass += "bg-gray-700 border-gray-600 text-white hover:bg-gray-600 hover:border-gray-500";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={buttonClass}
                  disabled={showResult}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{option}</span>
                    {showResult && isCorrect && (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation (shown after answer) */}
          {showResult && atom.content.explanation && (
            <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-700/50">
              <h4 className="text-blue-300 font-medium mb-2">Explanation:</h4>
              <p className="text-gray-300">{atom.content.explanation}</p>
            </div>
          )}

          {/* Action Button */}
          <div className="text-center">
            {!showResult ? (
              <Button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={handleContinue}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
              >
                Continue
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionRenderer;
