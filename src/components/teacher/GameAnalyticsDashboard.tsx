
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Users, 
  Target,
  Trophy,
  BookOpen
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { gameAssignmentService } from '@/services/gameAssignmentService';

const GameAnalyticsDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [timeframe, setTimeframe] = useState<number>(30);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [user, timeframe]);

  const loadAnalytics = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const data = await gameAssignmentService.getGameAnalytics(user.id, undefined, timeframe);
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Game Analytics</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="bg-gray-800 border-gray-700 animate-pulse">
              <CardHeader className="pb-3">
                <div className="h-4 bg-gray-600 rounded w-24"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-600 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-600 rounded w-20"></div>
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
          <h2 className="text-2xl font-bold text-white">Game Analytics Dashboard</h2>
          <p className="text-gray-400">Track student engagement and learning outcomes</p>
        </div>
        
        <Select value={timeframe.toString()} onValueChange={(value) => setTimeframe(parseInt(value))}>
          <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 3 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Sessions</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{analytics?.totalSessions || 0}</div>
            <p className="text-xs text-gray-400">
              Game sessions started
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{Math.round(analytics?.completionRate || 0)}%</div>
            <p className="text-xs text-gray-400">
              Of started sessions completed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Average Score</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{Math.round(analytics?.averageScore || 0)}</div>
            <p className="text-xs text-gray-400">
              Points per completed session
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Avg. Duration</CardTitle>
            <Clock className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{Math.round((analytics?.averageDuration || 0) / 60)}m</div>
            <p className="text-xs text-gray-400">
              Time per session
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subject Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Subject Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics?.subjectBreakdown && Object.entries(analytics.subjectBreakdown).map(([subject, count]: [string, any]) => (
              <div key={subject} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white capitalize">{subject.replace('-', ' ')}</span>
                  <span className="text-gray-400">{count} sessions</span>
                </div>
                <Progress 
                  value={(count / analytics.totalSessions) * 100} 
                  className="h-2" 
                />
              </div>
            ))}
            
            {(!analytics?.subjectBreakdown || Object.keys(analytics.subjectBreakdown).length === 0) && (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No subject data available yet</p>
                <p className="text-gray-500 text-sm">Data will appear once students start playing games</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Learning Objectives Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics?.objectiveProgress && Object.entries(analytics.objectiveProgress).slice(0, 5).map(([objective, count]: [string, any]) => (
              <div key={objective} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white text-sm">{objective}</span>
                  <Badge variant="outline" className="border-green-600 text-green-400">
                    {count} achieved
                  </Badge>
                </div>
              </div>
            ))}
            
            {(!analytics?.objectiveProgress || Object.keys(analytics.objectiveProgress).length === 0) && (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No learning objectives completed yet</p>
                <p className="text-gray-500 text-sm">Progress will show once students complete games</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary Card */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Analytics Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-lime-400 mb-2">{analytics?.completedSessions || 0}</div>
              <p className="text-gray-300 text-sm">Completed Sessions</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {analytics?.objectiveProgress ? Object.keys(analytics.objectiveProgress).length : 0}
              </div>
              <p className="text-gray-300 text-sm">Unique Objectives Met</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {analytics?.subjectBreakdown ? Object.keys(analytics.subjectBreakdown).length : 0}
              </div>
              <p className="text-gray-300 text-sm">Subjects Covered</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameAnalyticsDashboard;
