
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, Target } from 'lucide-react';

interface LearningStats {
  totalSessions: number;
  averageScore: number;
  conceptsMastered: number;
  timeSpent: number;
}

interface AILearningDashboardProps {
  userId: string;
}

const AILearningDashboard = ({ userId }: AILearningDashboardProps) => {
  const [stats, setStats] = useState<LearningStats>({
    totalSessions: 0,
    averageScore: 0,
    conceptsMastered: 0,
    timeSpent: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Simulate API call
        const mockStats = {
          totalSessions: 15,
          averageScore: 85,
          conceptsMastered: 12,
          timeSpent: 240
        };
        setStats(mockStats);
      } catch (error) {
        console.error('Error fetching learning stats:', error);
      }
    };

    fetchStats();
  }, [userId]);

  const handleStartNewSession = () => {
    console.log('Starting new AI learning session');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400 flex items-center">
              <Brain className="w-4 h-4 mr-2" />
              Total Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalSessions}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Average Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.averageScore}%</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400 flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Concepts Mastered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.conceptsMastered}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400">Time Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.timeSpent}m</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">AI Learning Assistant</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">
            Ready to continue your learning journey? The AI will adapt to your progress.
          </p>
          <Button onClick={handleStartNewSession} className="bg-blue-600 hover:bg-blue-700">
            Start New Session
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AILearningDashboard;
