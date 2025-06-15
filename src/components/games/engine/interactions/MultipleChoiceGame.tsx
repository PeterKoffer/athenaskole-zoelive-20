
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
  const subject = gameData.subject.toLowerCase();
  const basePoints = 10 + level * 5;
  
  // Subject-specific question generation
  if (subject.includes('french') || subject === 'french') {
    return [
      {
        question: `Comment dit-on "Hello" en français?`,
        options: ['Bonjour', 'Au revoir', 'Merci', 'Bonsoir'],
        correctAnswer: 0,
        explanation: '"Bonjour" means "Hello" in French and is used for daytime greetings.',
        points: basePoints
      },
      {
        question: `Quel est le mot français pour "coffee"?`,
        options: ['Thé', 'Eau', 'Café', 'Lait'],
        correctAnswer: 2,
        explanation: '"Café" is the French word for coffee.',
        points: basePoints
      },
      {
        question: `Comment dit-on "Thank you" en français?`,
        options: ['S\'il vous plaît', 'Merci', 'Excusez-moi', 'De rien'],
        correctAnswer: 1,
        explanation: '"Merci" means "Thank you" in French.',
        points: basePoints + 5
      }
    ];
  }
  
  if (subject.includes('spanish') || subject === 'spanish') {
    return [
      {
        question: `¿Cómo se dice "Hello" en español?`,
        options: ['Adiós', 'Hola', 'Gracias', 'Por favor'],
        correctAnswer: 1,
        explanation: '"Hola" means "Hello" in Spanish.',
        points: basePoints
      },
      {
        question: `¿Cuál es la palabra española para "water"?`,
        options: ['Leche', 'Agua', 'Café', 'Jugo'],
        correctAnswer: 1,
        explanation: '"Agua" is the Spanish word for water.',
        points: basePoints
      },
      {
        question: `¿Cómo se dice "Good morning" en español?`,
        options: ['Buenas noches', 'Buenas tardes', 'Buenos días', 'Hasta luego'],
        correctAnswer: 2,
        explanation: '"Buenos días" means "Good morning" in Spanish.',
        points: basePoints + 5
      }
    ];
  }
  
  if (subject.includes('geography')) {
    return [
      {
        question: `What is the capital of France?`,
        options: ['London', 'Berlin', 'Paris', 'Rome'],
        correctAnswer: 2,
        explanation: 'Paris is the capital and largest city of France.',
        points: basePoints
      },
      {
        question: `Which continent is Brazil located in?`,
        options: ['North America', 'South America', 'Europe', 'Asia'],
        correctAnswer: 1,
        explanation: 'Brazil is the largest country in South America.',
        points: basePoints
      },
      {
        question: `What is the longest river in the world?`,
        options: ['Amazon River', 'Nile River', 'Mississippi River', 'Yangtze River'],
        correctAnswer: 1,
        explanation: 'The Nile River in Africa is generally considered the longest river in the world.',
        points: basePoints + 5
      }
    ];
  }
  
  if (subject.includes('science')) {
    return [
      {
        question: `What planet is known as the "Red Planet"?`,
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correctAnswer: 1,
        explanation: 'Mars is called the Red Planet due to iron oxide (rust) on its surface.',
        points: basePoints
      },
      {
        question: `What gas do plants absorb from the atmosphere?`,
        options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'],
        correctAnswer: 2,
        explanation: 'Plants absorb carbon dioxide during photosynthesis to make food.',
        points: basePoints
      },
      {
        question: `How many bones are in the adult human body?`,
        options: ['106', '206', '306', '406'],
        correctAnswer: 1,
        explanation: 'The adult human body has 206 bones.',
        points: basePoints + 5
      }
    ];
  }
  
  if (subject.includes('history')) {
    return [
      {
        question: `Who was the first President of the United States?`,
        options: ['Thomas Jefferson', 'John Adams', 'George Washington', 'Benjamin Franklin'],
        correctAnswer: 2,
        explanation: 'George Washington was the first President of the United States (1789-1797).',
        points: basePoints
      },
      {
        question: `In what year did World War II end?`,
        options: ['1944', '1945', '1946', '1947'],
        correctAnswer: 1,
        explanation: 'World War II ended in 1945 with the surrender of Japan in September.',
        points: basePoints
      },
      {
        question: `Which ancient wonder of the world was located in Egypt?`,
        options: ['Hanging Gardens', 'Colossus of Rhodes', 'Great Pyramid of Giza', 'Lighthouse of Alexandria'],
        correctAnswer: 2,
        explanation: 'The Great Pyramid of Giza is the only ancient wonder still standing today.',
        points: basePoints + 5
      }
    ];
  }
  
  if (subject.includes('computer science') || subject === 'computer science') {
    return [
      {
        question: `What does "HTML" stand for?`,
        options: ['High Tech Modern Language', 'HyperText Markup Language', 'Home Tool Markup Language', 'Hyperlink and Text Markup Language'],
        correctAnswer: 1,
        explanation: 'HTML stands for HyperText Markup Language, used to create web pages.',
        points: basePoints
      },
      {
        question: `Which of these is a programming language?`,
        options: ['HTML', 'CSS', 'Python', 'PDF'],
        correctAnswer: 2,
        explanation: 'Python is a popular programming language used for many applications.',
        points: basePoints
      },
      {
        question: `What does "AI" stand for in technology?`,
        options: ['Automated Intelligence', 'Artificial Intelligence', 'Advanced Internet', 'Application Interface'],
        correctAnswer: 1,
        explanation: 'AI stands for Artificial Intelligence, the simulation of human intelligence in machines.',
        points: basePoints + 5
      }
    ];
  }

  // Default to math questions only if the subject is actually Mathematics
  if (subject.includes('math') || subject === 'mathematics') {
    return [
      {
        question: `What is 5 + 3?`,
        options: ['6', '7', '8', '9'],
        correctAnswer: 2,
        explanation: '5 + 3 = 8. Count up from 5: 6, 7, 8!',
        points: basePoints
      },
      {
        question: `Which shape has 3 sides?`,
        options: ['Circle', 'Square', 'Triangle', 'Rectangle'],
        correctAnswer: 2,
        explanation: 'A triangle has exactly 3 sides and 3 corners.',
        points: basePoints
      },
      {
        question: `What comes next in the pattern: 2, 4, 6, ?`,
        options: ['7', '8', '9', '10'],
        correctAnswer: 1,
        explanation: 'The pattern increases by 2 each time: 2, 4, 6, 8.',
        points: basePoints + 5
      }
    ];
  }
  
  // Fallback for unknown subjects - create generic educational questions
  return [
    {
      question: `What subject are you learning about in "${gameData.title}"?`,
      options: [gameData.subject, 'Mathematics', 'History', 'Art'],
      correctAnswer: 0,
      explanation: `This game focuses on ${gameData.subject} concepts and skills.`,
      points: basePoints
    },
    {
      question: `Which skill area does this game help you practice?`,
      options: gameData.skillAreas.slice(0, 3).concat(['None of the above']),
      correctAnswer: 0,
      explanation: `This game helps you practice ${gameData.skillAreas[0]} and related skills.`,
      points: basePoints
    },
    {
      question: `What grade levels is this game designed for?`,
      options: [
        `Grades ${gameData.gradeLevel.join(', ')}`,
        'All grades',
        'Only advanced students',
        'Pre-school only'
      ],
      correctAnswer: 0,
      explanation: `This game is designed for students in grades ${gameData.gradeLevel.join(', ')}.`,
      points: basePoints + 5
    }
  ];
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
            {gameData.title} - Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <Badge className="bg-blue-600 text-white">
            Level {level}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-4xl mb-4">{gameData.emoji}</div>
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
