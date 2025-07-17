
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

interface ImprovedLearningSessionProps {
  subject: string;
  skillArea: string;
  onComplete: (results: any) => void;
}

const ImprovedLearningSession = ({ subject, skillArea, onComplete }: ImprovedLearningSessionProps) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    generateQuestion();
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const generateQuestion = () => {
    const sampleQuestion: Question = {
      id: `q-${Date.now()}`,
      text: `Sample ${skillArea} question for ${subject}?`,
      options: [
        'Option A - Correct answer',
        'Option B - Incorrect',
        'Option C - Incorrect',
        'Option D - Incorrect'
      ],
      correctAnswer: 0
    };
    
    setCurrentQuestion(sampleQuestion);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null || !currentQuestion) return;
    
    setShowResult(true);
    
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(prev => prev + 10);
    }
  };

  const handleNext = () => {
    if (questionNumber >= 5) {
      const results = {
        subject,
        skillArea,
        score,
        totalQuestions: 5,
        timeElapsed,
        accuracy: (score / (questionNumber * 10)) * 100
      };
      onComplete(results);
    } else {
      setQuestionNumber(prev => prev + 1);
      generateQuestion();
    }
  };

  const handleSessionError = (errorMessage: string) => {
    console.error('Session error:', errorMessage);
  };

  if (!currentQuestion) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6 text-center">
          <div className="text-white">Loading question...</div>
        </CardContent>
      </Card>
    );
  }

  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>{subject} - {skillArea}</span>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
            </div>
            <div>Question {questionNumber}/5</div>
            <div>Score: {score}</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">
            {currentQuestion.text}
          </h3>
          
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                variant={selectedAnswer === index ? "default" : "outline"}
                className={`w-full text-left justify-start p-4 h-auto ${
                  selectedAnswer === index 
                    ? "bg-blue-600 hover:bg-blue-700" 
                    : "bg-gray-600 hover:bg-gray-500 border-gray-500"
                }`}
                disabled={showResult}
              >
                <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
                {option}
              </Button>
            ))}
          </div>
        </div>

        {showResult && (
          <Alert className={`${isCorrect ? 'border-green-600' : 'border-red-600'}`}>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex items-center">
              {isCorrect ? (
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 mr-2 text-red-400" />
              )}
              {isCorrect ? 'Correct! Well done.' : 'Incorrect. The correct answer was A.'}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-center">
          {!showResult ? (
            <Button 
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700">
              {questionNumber >= 5 ? 'Complete Session' : 'Next Question'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImprovedLearningSession;
