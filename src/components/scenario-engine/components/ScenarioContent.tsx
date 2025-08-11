
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, AlertCircle, ArrowRight } from 'lucide-react';
import { ScenarioNode } from '@/types/scenario';

interface ScenarioContentProps {
  currentNode: ScenarioNode;
  selectedAnswer: string;
  showResult: boolean;
  isCorrect: boolean;
  onAnswerSelect: (answer: string) => void;
  onSubmitAnswer: () => void;
  onContinue: () => void;
}

const ScenarioContent: React.FC<ScenarioContentProps> = ({
  currentNode,
  selectedAnswer,
  showResult,
  isCorrect,
  onAnswerSelect,
  onSubmitAnswer,
  onContinue
}) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>{currentNode.title}</span>
          <span className="text-sm font-normal text-gray-400 capitalize">
            {currentNode.type}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Node Content */}
          <div className="text-gray-300 leading-relaxed">
            {currentNode.content}
          </div>

          {/* Question Options */}
          {currentNode.type === 'question' && (currentNode.config as any)?.customProperties?.options && (
            <div className="space-y-3">
              <h3 className="text-white font-medium">Choose your answer:</h3>
              <div className="grid grid-cols-1 gap-2">
                {(currentNode.config as any)?.customProperties?.options.map((option: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => onAnswerSelect(option)}
                    disabled={showResult}
                    className={`p-3 text-left rounded-lg border transition-all ${
                      selectedAnswer === option
                        ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                        : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500'
                    } ${showResult ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Result Display */}
          {showResult && (
            <div className={`p-4 rounded-lg border ${
              isCorrect
                ? 'border-green-500 bg-green-500/10'
                : 'border-red-500 bg-red-500/10'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                {isCorrect ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                )}
                <span className={`font-medium ${
                  isCorrect ? 'text-green-400' : 'text-red-400'
                }`}>
                  {isCorrect ? 'Correct!' : 'Not quite right'}
                </span>
              </div>
              <p className="text-gray-300 text-sm">
                {isCorrect
                  ? 'Great job! You got it right.'
                  : `The correct answer is: ${currentNode.config?.customProperties?.correctAnswer}`
                }
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            {currentNode.type === 'question' && !showResult && (
              <Button
                onClick={onSubmitAnswer}
                disabled={!selectedAnswer}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Submit Answer
              </Button>
            )}
            
            {(currentNode.type !== 'question' || showResult) && (
              <Button
                onClick={onContinue}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScenarioContent;
