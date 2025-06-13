import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  Clock, 
  Trophy, 
  Target, 
  TrendingUp,
  Users,
  CheckCircle,
  PlayCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { gameAssignmentService } from '@/services/gameAssignmentService';
import { curriculumGames } from '@/components/games/CurriculumGameConfig';

const GameAnalyticsDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('30');
  const [selectedGame, setSelectedGame] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    loadAnalytics();
    loadAssignments();
  }, [user, selectedTimeframe, selectedGame]);

  const loadAnalytics = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const data = await gameAssignmentService.getGameAnalytics(
        user.id,
        selectedGame === 'all' ? undefined : selectedGame,
        parseInt(selectedTimeframe)
      );
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
    setIsLoading(false);
  };

  const loadAssignments = async () => {
    if (!user?.id) return;
    
    try {
      const data = await gameAssignmentService.getTeacherAssignments(user.id);
      setAssignments(data);
    } catch (error) {
      console.error('Error loading assignments:', error);
    }
  };

  const getGameTitle = (gameId: string): string => {
    const game = curriculumGames.find(g => g.id === gameId);
    return game ? `${game.emoji} ${game.title}` : gameId;
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.round(seconds / 60);
    return `${minutes}m`;
  };

  const getSubjectColor = (subject: string): string => {
    const colors: Record<string, string> = {
      mathematics: 'bg-blue-500',
      english: 'bg-green-500',
      science: 'bg-purple-500',
      'computer-science': 'bg-orange-500',
      'social-studies': 'bg-red-500',
      'creative-arts': 'bg-pink-500',
      music: 'bg-yellow-500',
    };
    return colors[subject] || 'bg-gray-500';
  };

  if (isLoading || !analytics) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Game Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="bg-gray-800 border-gray-700 animate-pulse">
              <CardContent className="p-6">
                <div className="h-8 bg-gray-600 rounded w-3/4 mb-2"></div>
                <div className="h-12 bg-gray-600 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Game Analytics</h2>
          <p className="text-gray-400">Track student engagement and learning outcomes from game assignments</p>
        </div>
        
        <div className="flex space-x-2">
          <Select value={selectedGame} onValueChange={setSelectedGame}>
            <SelectTrigger className="w-48 bg-gray-700 border-gray-600">
              <SelectValue placeholder="Select game" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Games</SelectItem>
              {assignments.map(assignment => (
                <SelectItem key={assignment.game_id} value={assignment.game_id}>
                  {getGameTitle(assignment.game_id)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32 bg-gray-700 border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <PlayCircle className="h-8 w-8 text-blue-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Sessions</p>
                <p className="text-2xl font-bold text-white">{analytics.totalSessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Completion Rate</p>
                <p className="text-2xl font-bold text-white">{analytics.completionRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-yellow-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Average Score</p>
                <p className="text-2xl font-bold text-white">{analytics.averageScore.toFixed(0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Avg. Duration</p>
                <p className="text-2xl font-bold text-white">{formatDuration(analytics.averageDuration)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Breakdown */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Activity by Subject
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(analytics.subjectBreakdown).map(([subject, count]: [string, any]) => (
              <div key={subject} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getSubjectColor(subject)} text-white`}>
                      {subject.replace('-', ' ')}
                    </Badge>
                    <span className="text-sm text-gray-400">{count} sessions</span>
                  </div>
                  <span className="text-sm text-white">
                    {((count / analytics.totalSessions) * 100).toFixed(0)}%
                  </span>
                </div>
                <Progress 
                  value={(count / analytics.totalSessions) * 100} 
                  className="h-2" 
                />
              </div>
            ))}
            
            {Object.keys(analytics.subjectBreakdown).length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400">No activity data yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Learning Objectives Progress */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Learning Objectives Achieved
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(analytics.objectiveProgress).map(([objective, count]: [string, any]) => (
              <div key={objective} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white truncate">{objective}</span>
                  <span className="text-sm text-gray-400">{count} times</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Progress 
                    value={Math.min((count / analytics.completedSessions) * 100, 100)} 
                    className="h-2 flex-1" 
                  />
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
              </div>
            ))}
            
            {Object.keys(analytics.objectiveProgress).length === 0 && (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400">No learning objectives completed yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Session Data */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Game Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.totalSessions > 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🎯</div>
                <p className="text-gray-400">
                  {analytics.completedSessions} of {analytics.totalSessions} sessions completed
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Students are actively engaging with your assigned games!
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📊</div>
                <p className="text-gray-400">No game sessions yet</p>
                <p className="text-sm text-gray-500 mt-1">
                  Analytics will appear here once students start playing assigned games.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameAnalyticsDashboard;