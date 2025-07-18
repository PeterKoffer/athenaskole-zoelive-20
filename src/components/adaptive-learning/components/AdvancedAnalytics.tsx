
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Brain, 
  Clock, 
  Target,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  BookOpen
} from 'lucide-react';

interface AnalyticsData {
  totalQuestions: number;
  correctAnswers: number;
  averageTime: number;
  streakDays: number;
  topicMastery: { [key: string]: number };
  weeklyProgress: number[];
  difficultyBreakdown: { [key: string]: number };
}

interface AdvancedAnalyticsProps {
  userId: string;
  subject: string;
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ userId, subject }) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalQuestions: 0,
    correctAnswers: 0,
    averageTime: 0,
    streakDays: 0,
    topicMastery: {},
    weeklyProgress: [],
    difficultyBreakdown: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for demonstration
    setTimeout(() => {
      setAnalyticsData({
        totalQuestions: 127,
        correctAnswers: 98,
        averageTime: 45,
        streakDays: 7,
        topicMastery: {
          'Basic Addition': 0.95,
          'Subtraction': 0.88,
          'Multiplication': 0.72,
          'Division': 0.65
        },
        weeklyProgress: [65, 72, 78, 85, 88, 92, 95],
        difficultyBreakdown: {
          'Easy': 45,
          'Medium': 62,
          'Hard': 20
        }
      });
      setLoading(false);
    }, 1000);
  }, [userId, subject]);

  const accuracy = analyticsData.totalQuestions > 0 
    ? Math.round((analyticsData.correctAnswers / analyticsData.totalQuestions) * 100)
    : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Advanced Analytics</h2>
        <Badge variant="secondary">
          <Calendar className="w-4 h-4 mr-1" />
          Last 30 days
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">{accuracy}%</div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">{analyticsData.totalQuestions}</div>
            <div className="text-sm text-muted-foreground">Questions</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold">{analyticsData.averageTime}s</div>
            <div className="text-sm text-muted-foreground">Avg Time</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold">{analyticsData.streakDays}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </CardContent>
        </Card>
      </div>

      {/* Topic Mastery */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Topic Mastery
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(analyticsData.topicMastery).map(([topic, mastery]) => (
            <div key={topic} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{topic}</span>
                <span>{Math.round(mastery * 100)}%</span>
              </div>
              <Progress value={mastery * 100} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="w-5 h-5" />
            Weekly Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between h-32 space-x-2">
            {analyticsData.weeklyProgress.map((progress, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="bg-blue-600 rounded-t w-full transition-all duration-300"
                  style={{ height: `${(progress / 100) * 100}%` }}
                ></div>
                <div className="text-xs mt-2">Day {index + 1}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button variant="outline" className="flex-1">
          <BarChart3 className="w-4 h-4 mr-2" />
          Detailed Report
        </Button>
        <Button variant="outline" className="flex-1">
          <PieChart className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
