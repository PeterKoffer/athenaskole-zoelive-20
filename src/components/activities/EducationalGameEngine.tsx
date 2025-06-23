
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Star, Trophy, Target, Zap, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GameLevel {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  objectives: string[];
  reward_points: number;
  time_limit_seconds?: number;
}

interface GameState {
  current_level: GameLevel;
  score: number;
  lives: number;
  streak: number;
  power_ups: string[];
  achievements: string[];
  time_remaining?: number;
}

interface EducationalGameEngineProps {
  subject: string;
  skillArea: string;
  theme: 'space_adventure' | 'underwater_exploration' | 'magical_forest' | 'detective_mystery' | 'cooking_challenge';
  onGameComplete: (score: number, achievements: string[]) => void;
  onRequestHelp: () => void;
}

const EducationalGameEngine = ({
  subject = 'mathematics',
  skillArea = 'addition',
  theme = 'space_adventure',
  onGameComplete,
  onRequestHelp
}: EducationalGameEngineProps) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState<any>(null);
  const [feedback, setFeedback] = useState<{ message: string; type: 'correct' | 'incorrect' | 'hint' } | null>(null);

  // Game themes configuration
  const themes = {
    space_adventure: {
      title: "Math Space Explorer",
      background: "bg-gradient-to-b from-purple-900 via-blue-900 to-black",
      character: "🚀",
      collectible: "⭐",
      environment: ["🌌", "🪐", "🌟", "🛰️"],
      success_messages: [
        "Stellar calculation, Space Explorer!",
        "You've navigated the asteroid field perfectly!",
        "Mission accomplished, Commander!"
      ],
      challenge_intro: "Navigate through the cosmic challenges!"
    },
    underwater_exploration: {
      title: "Ocean Math Adventure", 
      background: "bg-gradient-to-b from-blue-400 via-blue-600 to-blue-900",
      character: "🐠",
      collectible: "💎",
      environment: ["🌊", "🐙", "🐢", "🪸"],
      success_messages: [
        "Fantastic diving, Ocean Explorer!",
        "You've discovered the treasure!",
        "The sea creatures are impressed!"
      ],
      challenge_intro: "Dive deep into mathematical mysteries!"
    },
    magical_forest: {
      title: "Enchanted Math Quest",
      background: "bg-gradient-to-b from-green-300 via-green-600 to-green-900", 
      character: "🧙‍♀️",
      collectible: "✨",
      environment: ["🌲", "🍄", "🦋", "🌸"],
      success_messages: [
        "Magical work, young wizard!",
        "The forest spirits are pleased!",
        "Your math magic is growing stronger!"
      ],
      challenge_intro: "Cast mathematical spells to save the forest!"
    },
    detective_mystery: {
      title: "Math Detective Agency",
      background: "bg-gradient-to-b from-gray-600 via-gray-800 to-black",
      character: "🕵️",
      collectible: "🔍",
      environment: ["🏢", "💼", "📋", "🔦"],
      success_messages: [
        "Excellent deduction, Detective!",
        "Case closed with mathematical precision!",
        "Your logic skills are impressive!"
      ],
      challenge_intro: "Solve mathematical mysteries and crack the case!"
    },
    cooking_challenge: {
      title: "Master Chef Math",
      background: "bg-gradient-to-b from-orange-300 via-red-400 to-red-600",
      character: "👨‍🍳",
      collectible: "⭐",
      environment: ["🍳", "🥄", "🧄", "🍅"],
      success_messages: [
        "Perfect recipe, Chef!",
        "Your mathematical cooking is delicious!",
        "The kitchen is impressed with your skills!"
      ],
      challenge_intro: "Cook up some mathematical masterpieces!"
    }
  };

  const currentTheme = themes[theme];

  useEffect(() => {
    initializeGame();
  }, [subject, skillArea, theme]);

  const initializeGame = () => {
    const initialLevel: GameLevel = {
      id: 'level-1',
      title: `${skillArea} Basics`,
      description: `Master the fundamentals of ${skillArea}`,
      difficulty: 1,
      objectives: [`Solve 10 ${skillArea} problems`, 'Maintain 70% accuracy', 'Complete within time limit'],
      reward_points: 100,
      time_limit_seconds: 300 // 5 minutes
    };

    const initialState: GameState = {
      current_level: initialLevel,
      score: 0,
      lives: 3,
      streak: 0,
      power_ups: [],
      achievements: [],
      time_remaining: initialLevel.time_limit_seconds
    };

    setGameState(initialState);
    generateNextChallenge(initialState);
  };

  const generateNextChallenge = (state: GameState) => {
    // Generate appropriate challenge based on subject and skill area
    if (subject === 'mathematics') {
      setCurrentChallenge(generateMathChallenge(skillArea, state.current_level.difficulty));
    }
  };

  const generateMathChallenge = (skillArea: string, difficulty: number) => {
    const challenges = {
      addition: () => {
        const num1 = Math.floor(Math.random() * (10 * difficulty)) + 1;
        const num2 = Math.floor(Math.random() * (10 * difficulty)) + 1;
        const correct = num1 + num2;
        const options = [
          correct,
          correct + Math.floor(Math.random() * 5) + 1,
          correct - Math.floor(Math.random() * 5) - 1,
          correct + Math.floor(Math.random() * 10) + 5
        ].sort(() => Math.random() - 0.5);

        return {
          question: `${currentTheme.character} needs to calculate: ${num1} + ${num2} = ?`,
          options,
          correct_answer: correct,
          explanation: `${num1} + ${num2} = ${correct}`,
          theme_context: `Help ${currentTheme.character} collect ${num1 + num2} ${currentTheme.collectible}!`
        };
      },
      
      subtraction: () => {
        const num1 = Math.floor(Math.random() * (10 * difficulty)) + 10;
        const num2 = Math.floor(Math.random() * num1) + 1;
        const correct = num1 - num2;
        const options = [
          correct,
          correct + Math.floor(Math.random() * 5) + 1,
          correct - Math.floor(Math.random() * 5) - 1,
          num1 // Common mistake
        ].sort(() => Math.random() - 0.5);

        return {
          question: `${currentTheme.character} started with ${num1} items and used ${num2}. How many are left?`,
          options,
          correct_answer: correct,
          explanation: `${num1} - ${num2} = ${correct}`,
          theme_context: `${currentTheme.character} has ${correct} ${currentTheme.collectible} remaining!`
        };
      }
    };

    const challengeGenerator = challenges[skillArea as keyof typeof challenges] || challenges.addition;
    return challengeGenerator();
  };

  const handleAnswerSelection = (selectedAnswer: number) => {
    if (!currentChallenge || !gameState) return;

    const isCorrect = selectedAnswer === currentChallenge.correct_answer;
    const newState = { ...gameState };

    if (isCorrect) {
      // Correct answer handling
      newState.score += 10 + (newState.streak * 2);
      newState.streak += 1;
      
      setFeedback({
        message: currentTheme.success_messages[Math.floor(Math.random() * currentTheme.success_messages.length)],
        type: 'correct'
      });

      // Check for achievements
      if (newState.streak === 5) {
        newState.achievements.push('streak_master');
        newState.power_ups.push('double_points');
      }
      
      if (newState.streak === 10) {
        newState.achievements.push('unstoppable');
      }

    } else {
      // Incorrect answer handling
      newState.lives -= 1;  
      newState.streak = 0;
      
      setFeedback({
        message: `Not quite! ${currentChallenge.explanation}. Try again!`,
        type: 'incorrect'
      });

      if (newState.lives <= 0) {
        endGame(newState);
        return;
      }
    }

    setGameState(newState);

    // Generate next challenge after short delay
    setTimeout(() => {
      setFeedback(null);
      generateNextChallenge(newState);
    }, 2000);
  };

  const useHint = () => {
    if (!currentChallenge) return;
    
    setFeedback({
      message: `Hint: Think about ${currentChallenge.theme_context}`,
      type: 'hint'
    });
    
    onRequestHelp();
  };

  const endGame = (finalState: GameState) => {
    setIsPlaying(false);
    onGameComplete(finalState.score, finalState.achievements);
  };

  if (!gameState || !currentChallenge) {
    return (
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="p-6 text-center">
          <div className="text-white">Loading game...</div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={`min-h-screen p-4 ${currentTheme.background}`}>
      <div className="max-w-4xl mx-auto">
        {/* Game Header */}
        <Card className="mb-6 bg-black/30 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white text-2xl flex items-center space-x-2">
                  <span>{currentTheme.character}</span>
                  <span>{currentTheme.title}</span>
                </CardTitle>
                <p className="text-white/80">{currentTheme.challenge_intro}</p>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="secondary" className="bg-yellow-600 text-white">
                  <Star className="w-4 h-4 mr-1" />
                  {gameState.score}
                </Badge>
                <Badge variant="secondary" className="bg-red-600 text-white">
                  <Heart className="w-4 h-4 mr-1" />
                  {gameState.lives}
                </Badge>
                <Badge variant="secondary" className="bg-purple-600 text-white">
                  <Zap className="w-4 h-4 mr-1" />
                  {gameState.streak}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Game Challenge */}
        <Card className="bg-white/90 backdrop-blur-sm border-white/20">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {currentChallenge.question}
              </h2>
              <p className="text-lg text-purple-600 mb-6">
                {currentChallenge.theme_context}
              </p>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {currentChallenge.options.map((option: number, index: number) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => handleAnswerSelection(option)}
                    className="w-full h-16 text-xl font-bold bg-blue-500 hover:bg-blue-600 text-white"
                    disabled={!!feedback}
                  >
                    {option}
                  </Button>
                </motion.div>
              ))}
            </div>

            {/* Feedback */}
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`text-center p-4 rounded-lg mb-4 ${
                    feedback.type === 'correct' 
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : feedback.type === 'incorrect'
                      ? 'bg-red-100 text-red-800 border border-red-300'
                      : 'bg-blue-100 text-blue-800 border border-blue-300'
                  }`}
                >
                  <p className="font-semibold">{feedback.message}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Help Button */}
            <div className="text-center">
              <Button
                onClick={useHint}
                variant="outline"
                className="bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-600"
              >
                <Target className="w-4 h-4 mr-2" />
                Ask Nelie for Help
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Achievements Display */}
        {gameState.achievements.length > 0 && (
          <Card className="mt-4 bg-yellow-500/20 border-yellow-400">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-semibold">Achievements:</span>
                {gameState.achievements.map((achievement, index) => (
                  <Badge key={index} className="bg-yellow-600 text-white">
                    {achievement.replace('_', ' ').toUpperCase()}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EducationalGameEngine;
