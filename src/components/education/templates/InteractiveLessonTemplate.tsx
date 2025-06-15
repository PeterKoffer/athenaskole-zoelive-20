
import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, Trophy, Star, Target, Clock, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface InteractiveActivity {
  id: string;
  type: 'mini-game' | 'quiz' | 'puzzle' | 'simulation' | 'creative' | 'exploration';
  title: string;
  description: string;
  duration: number; // in seconds
  difficulty: 1 | 2 | 3 | 4 | 5;
  points: number;
  content: any; // Flexible content structure
  instructions: string;
  successCriteria: string;
}

export interface LessonTemplateProps {
  subject: string;
  topic: string;
  activities: InteractiveActivity[];
  onComplete: (score: number, achievements: string[]) => void;
  onBack: () => void;
}

const InteractiveLessonTemplate = ({ 
  subject, 
  topic, 
  activities, 
  onComplete, 
  onBack 
}: LessonTemplateProps) => {
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [activityStartTime, setActivityStartTime] = useState(Date.now());

  const currentActivity = activities[currentActivityIndex];
  const totalActivities = activities.length;
  const progress = ((currentActivityIndex + 1) / totalActivities) * 100;

  // Timer for engagement tracking
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleActivityComplete = useCallback((earnedPoints: number, isCorrect: boolean = true) => {
    const activityTime = Math.floor((Date.now() - activityStartTime) / 1000);
    
    // Award points based on performance
    let finalPoints = earnedPoints;
    if (activityTime < currentActivity.duration / 2) {
      finalPoints = Math.floor(earnedPoints * 1.5); // Speed bonus
      setAchievements(prev => [...prev, '⚡ Speed Demon']);
    }
    
    setScore(prev => prev + finalPoints);
    
    // Check for achievements
    if (isCorrect && currentActivity.difficulty >= 4) {
      setAchievements(prev => [...prev, '🎯 Master Level']);
    }
    
    // Move to next activity
    if (currentActivityIndex < activities.length - 1) {
      setCurrentActivityIndex(prev => prev + 1);
      setActivityStartTime(Date.now());
    } else {
      // Lesson complete
      const finalAchievements = [...achievements];
      if (score >= totalActivities * 50) {
        finalAchievements.push('🏆 Perfect Score');
      }
      onComplete(score + finalPoints, finalAchievements);
    }
  }, [currentActivityIndex, activities.length, currentActivity, score, achievements, onComplete, activityStartTime]);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'bg-green-500';
      case 2: return 'bg-blue-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-orange-500';
      case 5: return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyLabel = (difficulty: number) => {
    const labels = ['', 'Beginner', 'Easy', 'Medium', 'Hard', 'Expert'];
    return labels[difficulty];
  };

  if (!currentActivity) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-8 text-center">
            <p className="text-white">No activities available</p>
            <Button onClick={onBack} className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header with Progress */}
      <Card className="bg-gradient-to-r from-purple-900 to-blue-900 border-purple-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{subject} - {topic}</h1>
              <p className="text-purple-200">Interactive Learning Session</p>
            </div>
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="text-white hover:bg-purple-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="bg-black/20 rounded-lg p-3">
              <Target className="w-6 h-6 text-purple-400 mx-auto mb-1" />
              <p className="text-sm text-purple-200">Activity</p>
              <p className="text-lg font-bold text-white">{currentActivityIndex + 1}/{totalActivities}</p>
            </div>
            <div className="bg-black/20 rounded-lg p-3">
              <Star className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
              <p className="text-sm text-purple-200">Score</p>
              <p className="text-lg font-bold text-white">{score}</p>
            </div>
            <div className="bg-black/20 rounded-lg p-3">
              <Trophy className="w-6 h-6 text-orange-400 mx-auto mb-1" />
              <p className="text-sm text-purple-200">Achievements</p>
              <p className="text-lg font-bold text-white">{achievements.length}</p>
            </div>
            <div className="bg-black/20 rounded-lg p-3">
              <Clock className="w-6 h-6 text-blue-400 mx-auto mb-1" />
              <p className="text-sm text-purple-200">Time</p>
              <p className="text-lg font-bold text-white">{Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-purple-200 mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-purple-800 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-lime-400 to-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Activity */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold text-white">{currentActivity.title}</h2>
              <Badge className={`${getDifficultyColor(currentActivity.difficulty)} text-white`}>
                {getDifficultyLabel(currentActivity.difficulty)}
              </Badge>
              <Badge variant="outline" className="text-lime-400 border-lime-400">
                {currentActivity.points} pts
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => speakText(currentActivity.instructions)}
              className="border-gray-600 text-white hover:bg-gray-700"
            >
              <Volume2 className="w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-gray-300 mb-4">{currentActivity.description}</p>
          
          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4 mb-6">
            <h3 className="text-blue-400 font-semibold mb-2">Instructions</h3>
            <p className="text-blue-200">{currentActivity.instructions}</p>
          </div>

          {/* Dynamic Activity Renderer */}
          <ActivityRenderer 
            activity={currentActivity}
            onComplete={handleActivityComplete}
          />
        </CardContent>
      </Card>

      {/* Achievements Display */}
      {achievements.length > 0 && (
        <Card className="bg-gradient-to-r from-yellow-900 to-orange-900 border-yellow-700">
          <CardContent className="p-4">
            <h3 className="text-yellow-400 font-semibold mb-2">🏆 Achievements Unlocked</h3>
            <div className="flex flex-wrap gap-2">
              {achievements.map((achievement, index) => (
                <Badge key={index} className="bg-yellow-600 text-yellow-100">
                  {achievement}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Dynamic Activity Renderer Component
const ActivityRenderer = ({ activity, onComplete }: { 
  activity: InteractiveActivity; 
  onComplete: (points: number, isCorrect?: boolean) => void; 
}) => {
  switch (activity.type) {
    case 'mini-game':
      return <MiniGameRenderer activity={activity} onComplete={onComplete} />;
    case 'quiz':
      return <QuizRenderer activity={activity} onComplete={onComplete} />;
    case 'puzzle':
      return <PuzzleRenderer activity={activity} onComplete={onComplete} />;
    case 'simulation':
      return <SimulationRenderer activity={activity} onComplete={onComplete} />;
    case 'creative':
      return <CreativeRenderer activity={activity} onComplete={onComplete} />;
    case 'exploration':
      return <ExplorationRenderer activity={activity} onComplete={onComplete} />;
    default:
      return <DefaultRenderer activity={activity} onComplete={onComplete} />;
  }
};

// Individual Activity Type Renderers
const MiniGameRenderer = ({ activity, onComplete }: any) => (
  <div className="text-center p-8 bg-gradient-to-b from-purple-900/20 to-pink-900/20 rounded-lg">
    <div className="text-6xl mb-4">🎮</div>
    <h3 className="text-xl font-bold text-white mb-4">Mini Game Challenge</h3>
    <p className="text-gray-300 mb-6">{activity.content.gameDescription}</p>
    <Button 
      onClick={() => onComplete(activity.points, true)}
      className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
    >
      Start Game
    </Button>
  </div>
);

const QuizRenderer = ({ activity, onComplete }: any) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === activity.content.correctAnswer;
    setShowResult(true);
    
    setTimeout(() => {
      onComplete(isCorrect ? activity.points : Math.floor(activity.points / 2), isCorrect);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">{activity.content.question}</h3>
      <div className="space-y-2">
        {activity.content.options.map((option: string, index: number) => (
          <Button
            key={index}
            variant="outline"
            className={`w-full text-left justify-start p-4 h-auto ${
              selectedAnswer === index ? 'bg-blue-600 border-blue-500' : 'bg-gray-700 border-gray-600'
            }`}
            onClick={() => setSelectedAnswer(index)}
            disabled={showResult}
          >
            <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}.</span>
            {option}
          </Button>
        ))}
      </div>
      
      {showResult && (
        <div className={`p-4 rounded-lg border ${
          selectedAnswer === activity.content.correctAnswer 
            ? 'bg-green-900/20 border-green-700' 
            : 'bg-red-900/20 border-red-700'
        }`}>
          <p className={`font-semibold ${
            selectedAnswer === activity.content.correctAnswer ? 'text-green-400' : 'text-red-400'
          }`}>
            {selectedAnswer === activity.content.correctAnswer ? '✅ Correct!' : '❌ Incorrect'}
          </p>
          <p className="text-gray-300 mt-2">{activity.content.explanation}</p>
        </div>
      )}
      
      {!showResult && (
        <Button 
          onClick={handleSubmit}
          disabled={selectedAnswer === null}
          className="bg-green-600 hover:bg-green-700 text-white w-full"
        >
          Submit Answer
        </Button>
      )}
    </div>
  );
};

const PuzzleRenderer = ({ activity, onComplete }: any) => (
  <div className="text-center p-8 bg-gradient-to-b from-green-900/20 to-blue-900/20 rounded-lg">
    <div className="text-6xl mb-4">🧩</div>
    <h3 className="text-xl font-bold text-white mb-4">Puzzle Challenge</h3>
    <p className="text-gray-300 mb-6">{activity.content.puzzleDescription}</p>
    <Button 
      onClick={() => onComplete(activity.points, true)}
      className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
    >
      Solve Puzzle
    </Button>
  </div>
);

const SimulationRenderer = ({ activity, onComplete }: any) => (
  <div className="text-center p-8 bg-gradient-to-b from-blue-900/20 to-teal-900/20 rounded-lg">
    <div className="text-6xl mb-4">🔬</div>
    <h3 className="text-xl font-bold text-white mb-4">Interactive Simulation</h3>
    <p className="text-gray-300 mb-6">{activity.content.simulationDescription}</p>
    <Button 
      onClick={() => onComplete(activity.points, true)}
      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
    >
      Start Simulation
    </Button>
  </div>
);

const CreativeRenderer = ({ activity, onComplete }: any) => (
  <div className="text-center p-8 bg-gradient-to-b from-pink-900/20 to-purple-900/20 rounded-lg">
    <div className="text-6xl mb-4">🎨</div>
    <h3 className="text-xl font-bold text-white mb-4">Creative Challenge</h3>
    <p className="text-gray-300 mb-6">{activity.content.creativePrompt}</p>
    <Button 
      onClick={() => onComplete(activity.points, true)}
      className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3"
    >
      Start Creating
    </Button>
  </div>
);

const ExplorationRenderer = ({ activity, onComplete }: any) => (
  <div className="text-center p-8 bg-gradient-to-b from-orange-900/20 to-red-900/20 rounded-lg">
    <div className="text-6xl mb-4">🗺️</div>
    <h3 className="text-xl font-bold text-white mb-4">Exploration Activity</h3>
    <p className="text-gray-300 mb-6">{activity.content.explorationTask}</p>
    <Button 
      onClick={() => onComplete(activity.points, true)}
      className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3"
    >
      Start Exploring
    </Button>
  </div>
);

const DefaultRenderer = ({ activity, onComplete }: any) => (
  <div className="text-center p-8 bg-gray-800 rounded-lg">
    <p className="text-gray-300 mb-4">Interactive activity coming soon!</p>
    <Button 
      onClick={() => onComplete(activity.points, true)}
      className="bg-gray-600 hover:bg-gray-700 text-white"
    >
      Continue
    </Button>
  </div>
);

export default InteractiveLessonTemplate;
