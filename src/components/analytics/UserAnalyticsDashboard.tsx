
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { aiInteractionService } from '@/services/aiInteractionService';
import { userActivityService } from '@/services/userActivityService';
import { realTimeProgressService } from '@/services/realTimeProgressService';
import { Brain, Clock, Target, TrendingUp } from 'lucide-react';

const UserAnalyticsDashboard = () => {
  const { user } = useAuth();
  const [aiStats, setAiStats] = useState<any>(null);
  const [activityStats, setActivityStats] = useState<any>(null);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user]);

  const loadAnalytics = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const [aiData, activityData, progressData] = await Promise.all([
        aiInteractionService.getInteractionStats(user.id),
        userActivityService.getSessionAnalytics(user.id),
        realTimeProgressService.getUserProgress(user.id)
      ]);

      setAiStats(aiData);
      setActivityStats(activityData);
      setProgressData(progressData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Please log in to view your analytics.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center">Loading analytics...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Interactions</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiStats?.totalInteractions || 0}</div>
            <p className="text-xs text-muted-foreground">
              {aiStats?.successRate?.toFixed(1) || 0}% success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activityStats?.totalTimeSpent || 0} min</div>
            <p className="text-xs text-muted-foreground">
              {activityStats?.totalSessions || 0} sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activityStats?.averageEngagement?.toFixed(1) || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {activityStats?.completionRate?.toFixed(1) || 0}% completion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subjects</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progressData?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active learning areas
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="progress" className="space-y-4">
        <TabsList>
          <TabsTrigger value="progress">Learning Progress</TabsTrigger>
          <TabsTrigger value="activity">Activity Overview</TabsTrigger>
          <TabsTrigger value="ai">AI Usage</TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subject Progress</CardTitle>
              <CardDescription>Your learning progress across different subjects</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {progressData.map((progress) => (
                <div key={`${progress.subject}-${progress.skill_area}`} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{progress.subject}</p>
                      <p className="text-sm text-muted-foreground">{progress.skill_area}</p>
                    </div>
                    <Badge variant="secondary">
                      {progress.progress_percentage?.toFixed(1) || 0}%
                    </Badge>
                  </div>
                  <Progress value={progress.progress_percentage || 0} />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{progress.total_time_spent} minutes spent</span>
                    <span>{progress.streak_count} day streak</span>
                  </div>
                </div>
              ))}
              {progressData.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No learning progress recorded yet. Start learning to see your progress!
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Breakdown</CardTitle>
              <CardDescription>How you spend your learning time</CardDescription>
            </CardHeader>
            <CardContent>
              {activityStats?.sessionTypeBreakdown && Object.keys(activityStats.sessionTypeBreakdown).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(activityStats.sessionTypeBreakdown).map(([type, count]) => (
                    <div key={type} className="flex justify-between items-center">
                      <span className="capitalize">{type.replace('_', ' ')}</span>
                      <Badge variant="outline">{String(count)} sessions</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No activity data available yet.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Service Usage</CardTitle>
              <CardDescription>Your interactions with different AI services</CardDescription>
            </CardHeader>
            <CardContent>
              {aiStats?.serviceBreakdown && Object.keys(aiStats.serviceBreakdown).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(aiStats.serviceBreakdown).map(([service, count]) => (
                    <div key={service} className="flex justify-between items-center">
                      <span className="capitalize">{service}</span>
                      <Badge variant="outline">{String(count)} interactions</Badge>
                    </div>
                  ))}
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Tokens Used:</span>
                      <span>{aiStats.totalTokens?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Estimated Cost:</span>
                      <span>${aiStats.totalCost?.toFixed(4) || '0.0000'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No AI interactions recorded yet.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserAnalyticsDashboard;
