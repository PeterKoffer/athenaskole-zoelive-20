
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Star, Calendar, Gift } from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'pronunciation' | 'vocabulary' | 'grammar' | 'listening';
  target: number;
  current: number;
  reward: number;
  emoji: string;
  completed: boolean;
}

interface DailyChallengesProps {
  onChallengeComplete: (challengeId: string, reward: number) => void;
}

const DailyChallenges = ({ onChallengeComplete }: DailyChallengesProps) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [streakDays, setStreakDays] = useState(5);
  const [totalCoins, setTotalCoins] = useState(150);

  useEffect(() => {
    // Initialize daily challenges
    const today = new Date().toDateString();
    const savedChallenges = localStorage.getItem(`dailyChallenges_${today}`);
    
    if (savedChallenges) {
      setChallenges(JSON.parse(savedChallenges));
    } else {
      generateDailyChallenges();
    }
  }, []);

  const generateDailyChallenges = () => {
    const newChallenges: Challenge[] = [
      {
        id: 'pronunciation_practice',
        title: 'Udtale Mester',
        description: 'Få 85%+ nøjagtighed i udtale 3 gange',
        type: 'pronunciation',
        target: 3,
        current: 0,
        reward: 25,
        emoji: '🎯',
        completed: false
      },
      {
        id: 'vocabulary_builder',
        title: 'Ord Samler',
        description: 'Lær 10 nye ord i dag',
        type: 'vocabulary',
        target: 10,
        current: 2,
        reward: 20,
        emoji: '📚',
        completed: false
      },
      {
        id: 'listening_champion',
        title: 'Lytte Mester',
        description: 'Afslut 2 lytteøvelser',
        type: 'listening',
        target: 2,
        current: 0,
        reward: 15,
        emoji: '👂',
        completed: false
      },
      {
        id: 'grammar_guru',
        title: 'Grammatik Guru',
        description: 'Besvar 15 grammatik spørgsmål korrekt',
        type: 'grammar',
        target: 15,
        current: 7,
        reward: 30,
        emoji: '✏️',
        completed: false
      }
    ];

    setChallenges(newChallenges);
    saveChallenges(newChallenges);
  };

  const saveChallenges = (challengesToSave: Challenge[]) => {
    const today = new Date().toDateString();
    localStorage.setItem(`dailyChallenges_${today}`, JSON.stringify(challengesToSave));
  };

  const updateChallengeProgress = (challengeId: string, increment: number = 1) => {
    setChallenges(prev => {
      const updated = prev.map(challenge => {
        if (challenge.id === challengeId && !challenge.completed) {
          const newCurrent = Math.min(challenge.current + increment, challenge.target);
          const completed = newCurrent >= challenge.target;
          
          if (completed && !challenge.completed) {
            setTotalCoins(coins => coins + challenge.reward);
            onChallengeComplete(challengeId, challenge.reward);
          }
          
          return { ...challenge, current: newCurrent, completed };
        }
        return challenge;
      });
      
      saveChallenges(updated);
      return updated;
    });
  };

  const getProgressPercentage = (current: number, target: number): number => {
    return Math.min((current / target) * 100, 100);
  };

  const completedChallenges = challenges.filter(c => c.completed).length;
  const allCompleted = completedChallenges === challenges.length;

  return (
    <div className="space-y-6">
      {/* Header with streak and coins */}
      <Card className="bg-gradient-to-r from-purple-900 to-blue-900 border-purple-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-6 h-6 text-orange-400" />
                  <span className="text-2xl font-bold text-white">{streakDays}</span>
                </div>
                <p className="text-gray-300 text-sm">Dage i træk</p>
              </div>
              <div className="text-center">
                <div className="flex items-center space-x-2">
                  <Star className="w-6 h-6 text-yellow-400" />
                  <span className="text-2xl font-bold text-white">{totalCoins}</span>
                </div>
                <p className="text-gray-300 text-sm">Stjerner</p>
              </div>
            </div>
            
            {allCompleted && (
              <div className="text-center">
                <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <Badge variant="outline" className="bg-yellow-600 text-white border-yellow-600">
                  Alle udfordringer klaret! 🎉
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Daily Challenges */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Target className="w-6 h-6 mr-2 text-lime-400" />
            Dagens Udfordringer
            <Badge variant="outline" className="ml-auto text-lime-400 border-lime-400">
              {completedChallenges}/{challenges.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {challenges.map((challenge) => (
            <Card key={challenge.id} className={`${
              challenge.completed 
                ? 'bg-green-900/20 border-green-700' 
                : 'bg-gray-800 border-gray-700'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{challenge.emoji}</span>
                    <div>
                      <h4 className="font-semibold text-white">{challenge.title}</h4>
                      <p className="text-gray-400 text-sm">{challenge.description}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center space-x-1">
                      <Gift className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-semibold">{challenge.reward}</span>
                    </div>
                    {challenge.completed && (
                      <Badge variant="outline" className="mt-1 bg-green-600 text-white border-green-600">
                        Fuldført! ✓
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Fremskridt</span>
                    <span className="text-white font-medium">
                      {challenge.current}/{challenge.target}
                    </span>
                  </div>
                  <Progress 
                    value={getProgressPercentage(challenge.current, challenge.target)} 
                    className="h-2"
                  />
                </div>

                {/* Test buttons for demo purposes */}
                {!challenge.completed && (
                  <Button
                    size="sm"
                    onClick={() => updateChallengeProgress(challenge.id)}
                    className="mt-3 bg-blue-600 hover:bg-blue-700"
                  >
                    Simuler fremskridt (+1)
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Weekly bonus challenge */}
      <Card className="bg-gradient-to-r from-orange-900 to-red-900 border-orange-700">
        <CardContent className="p-6">
          <div className="text-center">
            <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-white mb-2">Ugentlig Bonus</h3>
            <p className="text-gray-300 mb-4">
              Fuldfør alle daglige udfordringer i 7 dage for at få 100 bonus stjerner!
            </p>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-white font-semibold">Fremskridt:</span>
              <Badge variant="outline" className="bg-orange-600 text-white border-orange-600">
                {streakDays}/7 dage
              </Badge>
            </div>
            <Progress value={(streakDays / 7) * 100} className="h-3 mt-3" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyChallenges;
