
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LessonActivity } from '../types/LessonTypes';
import { Sparkles, Zap, Trophy, Star } from 'lucide-react';

interface ActivityAdventureGameProps {
  activity: LessonActivity;
  onActivityComplete: (wasCorrect?: boolean) => void;
}

const ActivityAdventureGame = ({ activity, onActivityComplete }: ActivityAdventureGameProps) => {
  const [gamePhase, setGamePhase] = useState<'intro' | 'playing' | 'victory'>('intro');
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleStartAdventure = () => {
    setGamePhase('playing');
    // Simulate game progression
    setTimeout(() => {
      setScore(85 + Math.floor(Math.random() * 15)); // Score between 85-100
      setGamePhase('victory');
      setShowCelebration(true);
    }, 3000); // 3 seconds of "gameplay"
  };

  const handleCompleteAdventure = () => {
    onActivityComplete(true);
  };

  useEffect(() => {
    if (showCelebration) {
      // Auto-complete after celebration
      const timer = setTimeout(() => {
        handleCompleteAdventure();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showCelebration]);

  if (gamePhase === 'intro') {
    return (
      <Card className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-purple-500 border-2">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center">
              <Sparkles className="w-6 h-6 mr-2 text-yellow-400" />
              {activity.title}
            </span>
            <Badge className="bg-yellow-500 text-black font-bold">ADVENTURE TIME!</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8 space-y-6">
            <div className="text-8xl animate-bounce">🎮</div>
            
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">Epic Adventure Awaits!</h3>
              <p className="text-xl text-blue-200">{activity.content.scenario}</p>
              
              <div className="bg-blue-800/50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-blue-300 mb-2">How to Play:</h4>
                <p className="text-blue-100">{activity.content.mechanics}</p>
              </div>
              
              <div className="bg-green-800/50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-green-300 mb-2">Epic Rewards:</h4>
                <div className="flex flex-wrap gap-2 justify-center">
                  {activity.content.rewards?.map((reward: string, index: number) => (
                    <Badge key={index} className="bg-green-600 text-white">
                      🏆 {reward}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleStartAdventure}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-8 py-4 text-xl animate-pulse"
            >
              <Zap className="w-6 h-6 mr-2" />
              START EPIC ADVENTURE!
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (gamePhase === 'playing') {
    return (
      <Card className="bg-gradient-to-br from-green-900 via-teal-900 to-blue-900 border-green-500 border-2">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-center">
            <Zap className="w-6 h-6 mr-2 text-yellow-400 animate-spin" />
            Adventure In Progress...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8 space-y-6">
            <div className="text-8xl animate-pulse">⚡</div>
            
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">You're Doing AMAZING!</h3>
              <p className="text-xl text-green-200">Solving challenges like a true hero!</p>
              
              <div className="bg-yellow-600/20 rounded-lg p-6 border-2 border-yellow-400 animate-pulse">
                <div className="text-4xl mb-2">🎯</div>
                <p className="text-lg text-yellow-200">Adventure magic happening...</p>
                <p className="text-yellow-300">Keep going, champion!</p>
              </div>
            </div>
            
            <div className="flex justify-center space-x-2">
              {[1, 2, 3].map((dot) => (
                <div 
                  key={dot}
                  className="w-4 h-4 bg-blue-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${dot * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-yellow-600 via-orange-600 to-red-600 border-yellow-400 border-4">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-center">
          <Trophy className="w-8 h-8 mr-2 text-yellow-300 animate-bounce" />
          ADVENTURE COMPLETED!
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center p-8 space-y-6">
          <div className="text-8xl animate-bounce">🏆</div>
          
          <div className="space-y-4">
            <h3 className="text-3xl font-bold text-white">YOU'RE A LEGEND!</h3>
            <p className="text-xl text-yellow-100">Adventure Score: {score}%</p>
            
            <div className="bg-white/20 rounded-lg p-6 backdrop-blur">
              <div className="text-6xl mb-4">⭐</div>
              <h4 className="text-2xl font-bold text-white mb-2">HERO STATUS ACHIEVED!</h4>
              <p className="text-yellow-200 text-lg">You solved every challenge with incredible skill!</p>
            </div>
            
            <div className="flex justify-center space-x-4">
              {['🎖️', '⚡', '🌟', '🚀'].map((emoji, index) => (
                <div 
                  key={index}
                  className="text-4xl animate-bounce"
                  style={{ animationDelay: `${index * 0.3}s` }}
                >
                  {emoji}
                </div>
              ))}
            </div>
            
            {showCelebration && (
              <div className="space-y-4">
                <div className="text-lg text-yellow-100 font-semibold">
                  🎉 Advancing to next adventure... 🎉
                </div>
                <div className="flex justify-center">
                  <Star className="w-8 h-8 text-yellow-300 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityAdventureGame;
