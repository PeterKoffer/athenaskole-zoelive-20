
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LessonActivity } from '../types/LessonTypes';
import { Brain, Lightbulb, CheckCircle, Sparkles } from 'lucide-react';

interface ActivityPuzzleQuestProps {
  activity: LessonActivity;
  onActivityComplete: (wasCorrect?: boolean) => void;
}

const ActivityPuzzleQuest = ({ activity, onActivityComplete }: ActivityPuzzleQuestProps) => {
  const [questPhase, setQuestPhase] = useState<'briefing' | 'solving' | 'triumph'>('briefing');
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const handleStartQuest = () => {
    setQuestPhase('solving');
    // Simulate puzzle solving time
    setTimeout(() => {
      setQuestPhase('triumph');
    }, 4000);
  };

  const handleShowHint = () => {
    setHintsUsed(prev => prev + 1);
    setShowHint(true);
  };

  const handleCompleteQuest = () => {
    onActivityComplete(true);
  };

  useEffect(() => {
    if (questPhase === 'triumph') {
      const timer = setTimeout(() => {
        handleCompleteQuest();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [questPhase]);

  if (questPhase === 'briefing') {
    return (
      <Card className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 border-indigo-400 border-2">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center">
              <Brain className="w-6 h-6 mr-2 text-pink-400" />
              {activity.title}
            </span>
            <Badge className="bg-pink-500 text-white font-bold">PUZZLE QUEST!</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8 space-y-6">
            <div className="text-8xl animate-pulse">🧩</div>
            
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">Mind-Bending Challenge Awaits!</h3>
              <p className="text-xl text-purple-200">{activity.content.puzzleDescription}</p>
              
              <div className="bg-purple-800/50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-purple-300 mb-2">Puzzle Master Tools:</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Badge className="bg-blue-600 text-white">🔍 Pattern Detector</Badge>
                  <Badge className="bg-green-600 text-white">💡 Hint System</Badge>
                  <Badge className="bg-orange-600 text-white">🎯 Logic Analyzer</Badge>
                  <Badge className="bg-red-600 text-white">⚡ Quick Solver</Badge>
                </div>
              </div>
              
              <div className="bg-yellow-800/50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-yellow-300 mb-2">Puzzle Difficulty:</h4>
                <div className="flex justify-center">
                  {[...Array(activity.content.difficulty || 3)].map((_, i) => (
                    <span key={i} className="text-2xl text-yellow-400">⭐</span>
                  ))}
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleStartQuest}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-8 py-4 text-xl"
            >
              <Brain className="w-6 h-6 mr-2 animate-pulse" />
              BEGIN PUZZLE QUEST!
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (questPhase === 'solving') {
    return (
      <Card className="bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900 border-teal-400 border-2">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-center">
            <Brain className="w-6 h-6 mr-2 text-cyan-400 animate-pulse" />
            Puzzle Quest in Progress...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8 space-y-6">
            <div className="text-8xl animate-spin">🧩</div>
            
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">Your Brain is ON FIRE! 🔥</h3>
              <p className="text-xl text-teal-200">Brilliant thinking in action!</p>
              
              <div className="bg-cyan-800/50 rounded-lg p-6 border-2 border-cyan-400">
                <div className="text-4xl mb-2">🧠</div>
                <p className="text-lg text-cyan-200">Mental gears turning...</p>
                <p className="text-cyan-300">Logic circuits activating!</p>
              </div>
              
              {!showHint && (
                <Button 
                  onClick={handleShowHint}
                  variant="outline"
                  className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Need a Hint? ({3 - hintsUsed} remaining)
                </Button>
              )}
              
              {showHint && (
                <div className="bg-yellow-600/20 rounded-lg p-4 border-2 border-yellow-400 animate-pulse">
                  <Lightbulb className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                  <p className="text-yellow-200">Smart thinking! You're on the right track!</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-center space-x-1">
              {[1, 2, 3, 4, 5].map((dot) => (
                <div 
                  key={dot}
                  className="w-3 h-3 bg-teal-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${dot * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 border-green-400 border-4">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-center">
          <CheckCircle className="w-8 h-8 mr-2 text-green-300 animate-bounce" />
          PUZZLE MASTERED!
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center p-8 space-y-6">
          <div className="text-8xl animate-bounce">🏆</div>
          
          <div className="space-y-4">
            <h3 className="text-3xl font-bold text-white">GENIUS LEVEL UNLOCKED!</h3>
            <p className="text-xl text-green-100">Puzzle solved with brilliant thinking!</p>
            
            <div className="bg-white/20 rounded-lg p-6 backdrop-blur">
              <div className="text-6xl mb-4">🧠</div>
              <h4 className="text-2xl font-bold text-white mb-2">MASTER PUZZLE SOLVER!</h4>
              <p className="text-green-200 text-lg">Your logical thinking is absolutely incredible!</p>
              
              <div className="mt-4 flex justify-center space-x-2">
                <Badge className="bg-yellow-500 text-black">🏅 Logic Master</Badge>
                <Badge className="bg-purple-500 text-white">🧩 Puzzle Champion</Badge>
                <Badge className="bg-blue-500 text-white">⚡ Quick Thinker</Badge>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              {['🎯', '💡', '🌟', '🚀'].map((emoji, index) => (
                <div 
                  key={index}
                  className="text-4xl animate-bounce"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {emoji}
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <div className="text-lg text-green-100 font-semibold">
                🎉 Advancing to next challenge... 🎉
              </div>
              <div className="flex justify-center">
                <Sparkles className="w-8 h-8 text-green-300 animate-spin" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityPuzzleQuest;
