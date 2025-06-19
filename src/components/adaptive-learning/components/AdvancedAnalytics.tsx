
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Target, Clock, Award, Brain, BarChart3 } from 'lucide-react';

interface AnalyticsData {
  sessions: any[];
  conceptMastery: any[];
  performance: any[];
  weeklyProgress: any[];
}

interface AdvancedAnalyticsProps {
  subject: string;
}

const AdvancedAnalytics = ({ subject }: AdvancedAnalyticsProps) => {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsData>({
    sessions: [],
    conceptMastery: [],
    performance: [],
    weeklyProgress: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAnalyticsData();
    }
  }, [user, subject]);

  const loadAnalyticsData = async () => {
    if (!user) return;

    try {
      // Load all analytics data
      const [sessionsResult, masteryResult, performanceResult] = await Promise.all([
        supabase
          .from('learning_sessions')
          .select('*')
          .eq('user_id', user.id)
          .eq('subject', subject)
          .order('created_at', { ascending: false })
          .limit(30),
        
        supabase
          .from('concept_mastery')
          .select('*')
          .eq('user_id', user.id)
          .eq('subject', subject),
        
        supabase
          .from('user_performance')
          .select('*')
          .eq('user_id', user.id)
          .eq('subject', subject)
      ]);

      // Process weekly progress
      const weeklyData = processWeeklyProgress(sessionsResult.data || []);

      setData({
        sessions: sessionsResult.data || [],
        conceptMastery: masteryResult.data || [],
        performance: performanceResult.data || [],
        weeklyProgress: weeklyData
      });
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processWeeklyProgress = (sessions: any[]) => {
    const weeklyMap = new Map();
    
    sessions.forEach(session => {
      const date = new Date(session.created_at);
      const weekStart = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeklyMap.has(weekKey)) {
        weeklyMap.set(weekKey, { week: weekKey, sessions: 0, avgScore: 0, totalTime: 0 });
      }
      
      const week = weeklyMap.get(weekKey);
      week.sessions += 1;
      week.avgScore = ((week.avgScore * (week.sessions - 1)) + (session.score || 0)) / week.sessions;
      week.totalTime += session.time_spent || 0;
    });
    
    return Array.from(weeklyMap.values()).slice(-8); // Last 8 weeks
  };

  const getMasteryDistribution = () => {
    const distribution = { mastered: 0, learning: 0, struggling: 0 };
    
    data.conceptMastery.forEach(concept => {
      if (concept.mastery_level >= 0.8) distribution.mastered++;
      else if (concept.mastery_level >= 0.5) distribution.learning++;
      else distribution.struggling++;
    });
    
    return [
      { name: 'Mastered', value: distribution.mastered, color: '#22c55e' },
      { name: 'Learning', value: distribution.learning, color: '#eab308' },
      { name: 'Struggling', value: distribution.struggling, color: '#ef4444' }
    ];
  };

  const getAverageScore = () => {
    if (data.sessions.length === 0) return 0;
    return Math.round(data.sessions.reduce((acc, s) => acc + (s.score || 0), 0) / data.sessions.length);
  };

  const getTotalStudyTime = () => {
    return Math.round(data.sessions.reduce((acc, s) => acc + (s.time_spent || 0), 0) / 60); // Convert to minutes
  };

  const getStreakData = () => {
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Sort sessions by date
    const sortedSessions = [...data.sessions].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    for (let i = 0; i < sortedSessions.length; i++) {
      const sessionDate = new Date(sortedSessions[i].created_at);
      sessionDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === i) {
        tempStreak++;
        if (i === 0) currentStreak = tempStreak;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 0;
      }
    }
    
    longestStreak = Math.max(longestStreak, tempStreak);
    
    return { current: currentStreak, longest: longestStreak };
  };

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-lime-400 animate-pulse mr-2" />
            <span className="text-white">Loading analytics...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const masteryDistribution = getMasteryDistribution();
  const streakData = getStreakData();

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-lime-400" />
              <div>
                <p className="text-sm text-gray-400">Average Score</p>
                <p className="text-2xl font-bold text-white">{getAverageScore()}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Study Time</p>
                <p className="text-2xl font-bold text-white">{getTotalStudyTime()}m</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">Current Streak</p>
                <p className="text-2xl font-bold text-white">{streakData.current} days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Concepts Mastered</p>
                <p className="text-2xl font-bold text-white">{masteryDistribution[0].value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="progress" className="space-y-4">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="progress" className="data-[state=active]:bg-lime-500">
            Progress Trends
          </TabsTrigger>
          <TabsTrigger value="mastery" className="data-[state=active]:bg-lime-500">
            Concept Mastery
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-lime-500">
            Performance Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="progress">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Weekly Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="week" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                    labelStyle={{ color: '#F3F4F6' }}
                  />
                  <Line type="monotone" dataKey="avgScore" stroke="#84cc16" strokeWidth={2} />
                  <Line type="monotone" dataKey="sessions" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mastery">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Mastery Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={masteryDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {masteryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Concept Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.conceptMastery.slice(0, 5).map((concept, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white text-sm">{concept.concept_name}</span>
                      <Badge variant={concept.mastery_level >= 0.8 ? 'default' : 'secondary'}>
                        {Math.round(concept.mastery_level * 100)}%
                      </Badge>
                    </div>
                    <Progress value={concept.mastery_level * 100} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Recent Sessions Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.sessions.slice(0, 10).reverse()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="created_at" stroke="#9CA3AF" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                    labelStyle={{ color: '#F3F4F6' }}
                    formatter={(value, name) => [value + '%', 'Score']}
                  />
                  <Bar dataKey="score" fill="#84cc16" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalytics;
