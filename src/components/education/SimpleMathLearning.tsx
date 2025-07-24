import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

interface MathQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const mathQuestions: MathQuestion[] = [
  {
    question: "What is 5 + 3?",
    options: ["6", "7", "8", "9"],
    correct: 2,
    explanation: "5 + 3 = 8"
  },
  {
    question: "What is 12 ÷ 4?",
    options: ["2", "3", "4", "5"],
    correct: 1,
    explanation: "12 ÷ 4 = 3"
  },
  {
    question: "What is 7 × 2?",
    options: ["12", "14", "16", "18"],
    correct: 1,
    explanation: "7 × 2 = 14"
  }
];

const SimpleMathLearning: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === mathQuestions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < mathQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setIsComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setIsComplete(false);
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">🎉 Great Job!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-lg">
              You scored {score} out of {mathQuestions.length}!
            </p>
            <Button onClick={handleRestart} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const question = mathQuestions[currentQuestion];
  const isCorrect = selectedAnswer === question.correct;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Mathematics Learning</CardTitle>
            <div className="text-sm bg-primary/10 px-3 py-1 rounded-full">
              Question {currentQuestion + 1} of {mathQuestions.length}
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Score: {score}/{mathQuestions.length}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">{question.question}</h3>
            <div className="grid grid-cols-1 gap-3">
              {question.options.map((option, index) => {
                let buttonClass = "w-full text-left justify-start h-auto p-4";
                
                if (showResult) {
                  if (index === question.correct) {
                    buttonClass += " bg-green-500/20 border-green-500 text-green-700";
                  } else if (index === selectedAnswer && selectedAnswer !== question.correct) {
                    buttonClass += " bg-red-500/20 border-red-500 text-red-700";
                  }
                }
                
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className={buttonClass}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showResult}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{option}</span>
                      {showResult && index === question.correct && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                      {showResult && index === selectedAnswer && selectedAnswer !== question.correct && (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          {showResult && (
            <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className="font-medium">
                  {isCorrect ? 'Correct!' : 'Not quite right.'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{question.explanation}</p>
            </div>
          )}

          {showResult && (
            <Button onClick={handleNext} className="w-full">
              {currentQuestion < mathQuestions.length - 1 ? 'Next Question' : 'Finish'}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleMathLearning;