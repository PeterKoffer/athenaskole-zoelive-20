import { useState } from 'react';
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
  
  // Enhanced XR and immersive question generation
  if (gameData.id.includes('vr') || gameData.id.includes('ar') || subject.includes('immersive')) {
    return generateXRQuestions(gameData, level, basePoints);
  }
  
  // Coding and computer science questions
  if (gameData.id.includes('coding') || gameData.id.includes('algorithm')) {
    return generateCodingQuestions(gameData, level, basePoints);
  }
  
  // Music and creative questions
  if (subject.includes('music') || gameData.id.includes('melody') || gameData.id.includes('rhythm')) {
    return generateMusicQuestions(gameData, level, basePoints);
  }
  
  // Interactive quiz and detective games
  if (gameData.id.includes('detective') || gameData.id.includes('error') || gameData.id.includes('quiz')) {
    return generateDetectiveQuestions(gameData, level, basePoints);
  }

  // Multi-subject games
  if (subject.includes('multi-subject')) {
    return generateMultiSubjectQuestions(gameData, level, basePoints);
  }
  
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

const generateXRQuestions = (gameData: CurriculumGame, level: number, basePoints: number): Question[] => {
  void gameData; void level;
  if (gameData.id.includes('ancient-rome')) {
    return [
      {
        question: "🏛️ In our VR tour of the Roman Forum, what was the main purpose of the Basilica?",
        options: ["Religious ceremonies", "Public meetings and law courts", "Gladiator fights", "Food markets"],
        correctAnswer: 1,
        explanation: "Basilicas in ancient Rome served as public buildings for meetings, law courts, and business transactions.",
        points: basePoints
      },
      {
        question: "🏺 Which architectural feature did Romans perfect that we explored in VR?",
        options: ["Flying buttresses", "Pointed arches", "Concrete domes", "Wooden beams"],
        correctAnswer: 2,
        explanation: "Romans perfected concrete construction and dome architecture, as seen in the Pantheon.",
        points: basePoints + 5
      }
    ];
  }
  
  if (gameData.id.includes('cell-biology-ar')) {
    return [
      {
        question: "🔬 Using AR microscopy, which organelle would you find only in plant cells?",
        options: ["Mitochondria", "Nucleus", "Chloroplasts", "Ribosomes"],
        correctAnswer: 2,
        explanation: "Chloroplasts are unique to plant cells and conduct photosynthesis.",
        points: basePoints
      },
      {
        question: "🧬 In our AR cell exploration, what process occurs in the mitochondria?",
        options: ["Protein synthesis", "DNA replication", "Cellular respiration", "Photosynthesis"],
        correctAnswer: 2,
        explanation: "Mitochondria are the powerhouses of the cell, producing energy through cellular respiration.",
        points: basePoints + 5
      }
    ];
  }
  
  return [
    {
      question: "🚀 What makes XR learning more effective than traditional methods?",
      options: ["It's more expensive", "Immersive experiences enhance understanding", "It requires special equipment", "It's only for advanced students"],
      correctAnswer: 1,
      explanation: "XR creates immersive experiences that help students visualize and interact with complex concepts.",
      points: basePoints
    }
  ];
};

const generateCodingQuestions = (gameData: CurriculumGame, level: number, basePoints: number): Question[] => {
  void gameData; void level;
  return [
    {
      question: "🧩 In block-based programming, what does a 'loop' block do?",
      options: ["Stops the program", "Repeats code multiple times", "Deletes variables", "Changes colors"],
      correctAnswer: 1,
      explanation: "Loop blocks repeat a set of instructions multiple times, making code more efficient.",
      points: basePoints
    },
    {
      question: "🐛 When debugging code, what should you do first?",
      options: ["Delete everything", "Read error messages carefully", "Ask for help immediately", "Start over"],
      correctAnswer: 1,
      explanation: "Reading error messages carefully helps identify exactly what went wrong and where.",
      points: basePoints + 5
    },
    {
      question: "⚡ What makes an algorithm 'efficient'?",
      options: ["It uses many variables", "It solves problems quickly with minimal resources", "It has lots of comments", "It's written in JavaScript"],
      correctAnswer: 1,
      explanation: "Efficient algorithms solve problems quickly while using minimal computational resources.",
      points: basePoints + 10
    }
  ];
};

const generateMusicQuestions = (gameData: CurriculumGame, level: number, basePoints: number): Question[] => {
  void gameData; void level;
  return [
    {
      question: "🎼 In music composition, what creates the 'melody'?",
      options: ["The beat pattern", "The sequence of musical notes", "The volume level", "The instrument choice"],
      correctAnswer: 1,
      explanation: "A melody is created by a sequence of musical notes played in succession.",
      points: basePoints
    },
    {
      question: "🥁 What element of music determines how fast or slow a song feels?",
      options: ["Harmony", "Melody", "Tempo", "Volume"],
      correctAnswer: 2,
      explanation: "Tempo determines the speed of music, measured in beats per minute (BPM).",
      points: basePoints + 5
    },
    {
      question: "🤖 How can AI help in music creation?",
      options: ["By replacing human musicians", "By generating harmonies and suggesting chord progressions", "By making music louder", "By eliminating creativity"],
      correctAnswer: 1,
      explanation: "AI can assist musicians by generating harmonies, suggesting chord progressions, and inspiring new creative directions.",
      points: basePoints + 10
    }
  ];
};

const generateDetectiveQuestions = (gameData: CurriculumGame, level: number, basePoints: number): Question[] => {
  void level;
  if (gameData.subject.toLowerCase().includes('math')) {
    return [
      {
        question: "🔍 Detective Challenge: Find the error in this solution: 5 + 3 × 2 = 16",
        options: ["No error found", "Should multiply first: 5 + 6 = 11", "Should add first", "Wrong numbers used"],
        correctAnswer: 1,
        explanation: "Order of operations: multiplication before addition. 5 + (3 × 2) = 5 + 6 = 11, not 16.",
        points: basePoints
      },
      {
        question: "🕵️ What's wrong with this fraction work: 1/2 + 1/3 = 2/5?",
        options: ["Nothing wrong", "Can't add fractions with different denominators directly", "Numbers are too small", "Should multiply instead"],
        correctAnswer: 1,
        explanation: "You need a common denominator: 1/2 + 1/3 = 3/6 + 2/6 = 5/6, not 2/5.",
        points: basePoints + 5
      }
    ];
  }
  
  return [
    {
      question: "👮 Grammar Police: Find the error in 'Me and John went to the store.'",
      options: ["No error", "'John and I went to the store'", "Should be 'John and me'", "Store should be capitalized"],
      correctAnswer: 1,
      explanation: "Use 'I' as the subject of the sentence: 'John and I went to the store.'",
      points: basePoints
    },
    {
      question: "🔤 Hidden Word Hunt: Find the word hidden in 'CELEBRATION'",
      options: ["RATE", "TREE", "CREATION", "BELL"],
      correctAnswer: 2,
      explanation: "CREATION can be found within CELEBRATION by rearranging some letters.",
      points: basePoints + 5
    }
  ];
};

const generateMultiSubjectQuestions = (gameData: CurriculumGame, level: number, basePoints: number): Question[] => {
  void gameData; void level;
  const subjects = ['Math', 'Science', 'History', 'English'];
  const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
  
  const questions = {
    Math: {
      question: "⚡ Speed Math: What's 15 × 4?",
      options: ["50", "60", "65", "70"],
      correctAnswer: 1,
      explanation: "15 × 4 = 60. Quick tip: 15 × 4 = 15 × 2 × 2 = 30 × 2 = 60",
      points: basePoints
    },
    Science: {
      question: "⚡ Quick Science: What gas do we breathe in?",
      options: ["Carbon Dioxide", "Oxygen", "Nitrogen", "Helium"],
      correctAnswer: 1,
      explanation: "We breathe in oxygen and breathe out carbon dioxide.",
      points: basePoints
    },
    History: {
      question: "⚡ History Flash: Who was the first person on the moon?",
      options: ["Buzz Aldrin", "Neil Armstrong", "John Glenn", "Yuri Gagarin"],
      correctAnswer: 1,
      explanation: "Neil Armstrong was the first person to walk on the moon in 1969.",
      points: basePoints
    },
    English: {
      question: "⚡ Word Power: What's a synonym for 'happy'?",
      options: ["Sad", "Joyful", "Angry", "Tired"],
      correctAnswer: 1,
      explanation: "Joyful means the same as happy - they're synonyms!",
      points: basePoints
    }
  };
  
  return [questions[randomSubject as keyof typeof questions]];
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
      // Level complete - pass the current level's score and whether it was perfect
      const levelScore = score + (selectedAnswer === currentQuestion.correctAnswer ? currentQuestion.points : 0);
      const finalCorrectAnswers = correctAnswers + (selectedAnswer === currentQuestion.correctAnswer ? 1 : 0);
      const perfect = finalCorrectAnswers === questions.length;
      
      onLevelComplete(levelScore, perfect);
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
