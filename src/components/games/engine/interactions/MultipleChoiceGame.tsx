
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Brain } from 'lucide-react';
import { CurriculumGame } from '../../types/GameTypes';

interface MultipleChoiceGameProps {
  level: number;
  onLevelComplete: (score: number, perfect: boolean) => void;
  gameData: CurriculumGame;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  points: number;
}

const generateQuestions = (gameData: CurriculumGame, level: number): Question[] => {
  // Generate questions based on game data and level
  const baseQuestions: Question[] = [
    {
      question: `What is 5 + 3?`,
      options: ['6', '7', '8', '9'],
      correctAnswer: 2,
      explanation: '5 + 3 = 8. Count up from 5: 6, 7, 8!',
      points: 10 + level * 5
    },
    {
      question: `Which shape has 3 sides?`,
      options: ['Circle', 'Square', 'Triangle', 'Rectangle'],
      correctAnswer: 2,
      explanation: 'A triangle has exactly 3 sides and 3 corners.',
      points: 10 + level * 5
    },
    {
      question: `What comes next in the pattern: 2, 4, 6, ?`,
      options: ['7', '8', '9', '10'],
      correctAnswer: 1,
      explanation: 'The pattern increases by 2 each time: 2, 4, 6, 8.',
      points: 15 + level * 5
    }
  ];

  return baseQuestions.slice(0, Math.min(3 + level, 5));
};

const MultipleChoiceGame = ({ level, onLevelComplete, gameData }: MultipleChoiceGameProps) => {
  const [questions] = useState(() => generateQuestions(gameData, level));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === currentQuestion.correctAnswer) {
      setScore(prev => prev + currentQuestion.points);
      setCorrectAnswers(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      // Level complete
      const perfect = correctAnswers === questions.length;
      onLevelComplete(score, perfect);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const getOptionColor = (index: number) => {
    if (!showResult) {
      return selectedAnswer === index 
        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
        : 'bg-gray-700 hover:bg-gray-600 text-white';
    }
    
    if (index === currentQuestion.correctAnswer) {
      return 'bg-green-600 text-white';
    }
    
    if (selectedAnswer === index && index !== currentQuestion.correctAnswer) {
      return 'bg-red-600 text-white';
    }
    
    return 'bg-gray-700 text-white';
  };

  return (
    <Card className="bg-gray-900 border-gray-700 max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <span className="flex items-center">
            <Brain className="w-6 h-6 mr-2 text-blue-400" />
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <Badge className="bg-blue-600 text-white">
            Level {level}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            {currentQuestion.question}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
                className={`p-6 text-lg font-semibold transition-all duration-200 ${getOptionColor(index)}`}
              >
                <span className="mr-2 text-xl">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
                {showResult && index === currentQuestion.correctAnswer && (
                  <CheckCircle className="w-5 h-5 ml-2 text-green-300" />
                )}
                {showResult && selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                  <XCircle className="w-5 h-5 ml-2 text-red-300" />
                )}
              </Button>
            ))}
          </div>
        </div>

        {showResult && (
          <div className="bg-gray-800 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-center space-x-2">
              {selectedAnswer === currentQuestion.correctAnswer ? (
                <>
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <span className="text-green-400 font-bold text-lg">Correct! +{currentQuestion.points} points</span>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-red-400" />
                  <span className="text-red-400 font-bold text-lg">Not quite right</span>
                </>
              )}
            </div>
            
            <p className="text-gray-300 text-center">{currentQuestion.explanation}</p>
            
            <div className="text-center">
              <Button 
                onClick={handleNextQuestion}
                className="bg-lime-500 hover:bg-lime-600 text-black font-bold px-8 py-3"
              >
                {isLastQuestion ? '🎉 Complete Level!' : '➡️ Next Question'}
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-between text-gray-400 text-sm">
          <span>Score: {score} points</span>
          <span>Correct: {correctAnswers}/{questions.length}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MultipleChoiceGame;
