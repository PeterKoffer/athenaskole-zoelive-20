
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Award, Target, Brain } from 'lucide-react';

interface PerformanceData {
  subject: string;
  skill_area: string;
  current_level: number;
  accuracy_rate: number;
  attempts_count: number;
  completion_time_avg: number;
  last_assessment: string;
}

interface LearningSession {
  id: string;
  subject: string;
  skill_area: string;
  difficulty_level: number;
  score: number;
  time_spent: number;
  created_at: string;
}

const PerformanceAnalytics = () => {
  const { user } = useAuth();
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [recentSessions, setRecentSessions] = useState<LearningSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPerformanceData();
      loadRecentSessions();
    }
  }, [user]);

  const loadPerformanceData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_performance')
        .select('*')
        .eq('user_id', user.id)
        .order('accuracy_rate', { ascending: false });

      if (error) {
        console.error('Error loading performance data:', error);
        return;
      }

      setPerformanceData(data || []);
    } catch (error) {
      console.error('Error loading performance data:', error);
    }
  };

  const loadRecentSessions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('learning_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error loading recent sessions:', error);
        return;
      }

      setRecentSessions(data || []);
    } catch (error) {
      console.error('Error loading recent sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (accuracy: number) => {
    if (accuracy >= 85) return 'bg-green-500';
    if (accuracy >= 70) return 'bg-lime-500';
    if (accuracy >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getSkillBadgeColor = (level: number) => {
    if (level >= 8) return 'bg-purple-500 text-white';
    if (level >= 6) return 'bg-blue-500 text-white';
    if (level >= 4) return 'bg-lime-500 text-black';
    return 'bg-gray-500 text-white';
  };

  const chartData = performanceData.map(item => ({
    name: `${item.subject} - ${item.skill_area}`,
    accuracy: item.accuracy_rate,
    level: item.current_level,
    attempts: item.attempts_count
  }));

  const sessionChartData = recentSessions.slice(0, 7).reverse().map((session, index) => ({
    session: `Session ${index + 1}`,
    score: session.score,
    time: Math.round(session.time_spent / 60), // Convert to minutes
    difficulty: session.difficulty_level
  }));

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Brain className="w-6 h-6 text-lime-400 animate-pulse mr-2" />
            <span className="text-white">Indlæser analyse...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Performance Overview */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <TrendingUp className="w-5 h-5 text-lime-400" />
            <span>Overordnet Præstation</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {performanceData.map((item, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold capitalize text-white text-sm">
                      {item.subject}
                    </h3>
                    <Badge className={getSkillBadgeColor(item.current_level)}>
                      Niveau {item.current_level}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400 mb-3 capitalize">{item.skill_area}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Nøjagtighed</span>
                      <span className="text-white font-medium">{item.accuracy_rate.toFixed(1)}%</span>
                    </div>
                    <Progress 
                      value={item.accuracy_rate} 
                      className={`h-2 ${getProgressColor(item.accuracy_rate)}`}
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>{item.attempts_count} forsøg</span>
                      <span>{item.completion_time_avg || 0}s ⌀</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Chart */}
      {chartData.length > 0 && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Award className="w-5 h-5 text-lime-400" />
              <span>Færdighedsniveau vs Nøjagtighed</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#9CA3AF"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '6px',
                      color: '#F3F4F6'
                    }}
                  />
                  <Bar dataKey="accuracy" fill="#84cc16" name="Nøjagtighed %" />
                  <Bar dataKey="level" fill="#3B82F6" name="Niveau" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Sessions Trend */}
      {sessionChartData.length > 0 && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Target className="w-5 h-5 text-lime-400" />
              <span>Seneste Sessioner</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sessionChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="session" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '6px',
                      color: '#F3F4F6'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#84cc16" 
                    strokeWidth={2}
                    name="Score %"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="time" 
                    stroke="#F59E0B" 
                    strokeWidth={2}
                    name="Tid (min)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Sessions List */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Brain className="w-5 h-5 text-lime-400" />
            <span>Seneste Aktivitet</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentSessions.slice(0, 5).map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="capitalize">
                    {session.subject}
                  </Badge>
                  <span className="text-white text-sm capitalize">{session.skill_area}</span>
                  <Badge className={getSkillBadgeColor(session.difficulty_level)}>
                    Niveau {session.difficulty_level}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <span className={`font-medium ${session.score >= 80 ? 'text-green-400' : session.score >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {session.score}%
                  </span>
                  <span className="text-gray-400">
                    {Math.round(session.time_spent / 60)}m
                  </span>
                  <span className="text-gray-500 text-xs">
                    {new Date(session.created_at).toLocaleDateString('da-DK')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceAnalytics;
