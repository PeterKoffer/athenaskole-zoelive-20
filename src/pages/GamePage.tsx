import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Trophy, Users, Globe, School } from 'lucide-react';
import MicroGameHost from '@/games/components/MicroGameHost';
import { getLeaderboard, LeaderboardEntry } from '@/services/leaderboard';


interface LeaderboardProps {
  gameId: string;
  scope: "world" | "country" | "school";
}

function Leaderboard({ gameId, scope }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    (async () => {
      setLoading(true);
      const data = await getLeaderboard(gameId, scope);
      if (mounted) {
        setEntries(data);
        setLoading(false);
      }
    })();
    
    return () => { mounted = false; };
  }, [gameId, scope]);

  if (loading) {
    return <div className="text-center py-8">Loading leaderboard...</div>;
  }

  if (!entries.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No scores yet today. Be the first to play!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map((entry, index) => (
        <div
          key={entry.userId}
          className={`flex items-center justify-between p-3 rounded-lg ${
            index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200' : 'bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              index === 0 ? 'bg-yellow-500 text-white' :
              index === 1 ? 'bg-gray-400 text-white' :
              index === 2 ? 'bg-orange-600 text-white' :
              'bg-gray-200 text-gray-600'
            }`}>
              {index < 3 ? <Trophy className="w-4 h-4" /> : entry.rank}
            </div>
            <div>
              <div className="font-medium">{entry.username}</div>
              {entry.meta.accuracy && (
                <div className="text-xs text-muted-foreground">
                  {Math.round(entry.meta.accuracy * 100)}% accuracy
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-lg">{entry.score}</div>
            <div className="text-xs text-muted-foreground">points</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function GamePage() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [showGame, setShowGame] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  if (!gameId) {
    navigate('/games');
    return null;
  }

  const handleGameComplete = (score: number) => {
    setGameCompleted(true);
    console.log('Game completed with score:', score);
  };

  const handlePlayAgain = () => {
    setGameCompleted(false);
    setShowGame(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/games')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Games
          </Button>
          <h1 className="text-3xl font-bold capitalize">
            {gameId.replace('-', ' ')} Game
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Game Area */}
          <div className="lg:col-span-2">
            {!showGame ? (
              <Card>
                <CardHeader>
                  <CardTitle>Ready to Play?</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    Test your skills and compete with players around the world!
                  </p>
                  <Button 
                    onClick={() => setShowGame(true)}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Start Game
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div>
                <MicroGameHost
                  gameId={gameId}
                  onComplete={handleGameComplete}
                  onClose={() => setShowGame(false)}
                />
                {gameCompleted && (
                  <div className="mt-4 text-center">
                    <Button onClick={handlePlayAgain} variant="outline">
                      Play Again
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Leaderboards */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Today's Leaders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="world" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="world" className="text-xs">
                      <Globe className="w-3 h-3 mr-1" />
                      World
                    </TabsTrigger>
                    <TabsTrigger value="country" className="text-xs">
                      <Users className="w-3 h-3 mr-1" />
                      Country
                    </TabsTrigger>
                    <TabsTrigger value="school" className="text-xs">
                      <School className="w-3 h-3 mr-1" />
                      School
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="world" className="mt-4">
                    <Leaderboard gameId={gameId} scope="world" />
                  </TabsContent>
                  
                  <TabsContent value="country" className="mt-4">
                    <Leaderboard gameId={gameId} scope="country" />
                  </TabsContent>
                  
                  <TabsContent value="school" className="mt-4">
                    <Leaderboard gameId={gameId} scope="school" />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}