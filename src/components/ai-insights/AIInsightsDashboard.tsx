import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp, Lightbulb, Target, Users, Zap, RefreshCw, Star, ArrowRight, Sparkles } from 'lucide-react';
import { AIInsightsScanner } from '@/services/aiInsightsScanner';
interface AIInsightsDashboardProps {
  onClose: () => void;
}
const AIInsightsDashboard = ({
  onClose
}: AIInsightsDashboardProps) => {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    loadInsights();
  }, []);
  const loadInsights = async () => {
    try {
      setLoading(true);
      const results = await AIInsightsScanner.getOrUpdateInsights();
      setInsights(results);
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const results = await AIInsightsScanner.scanForEducationTrends();
      setInsights(results);
    } catch (error) {
      console.error('Error refreshing insights:', error);
    } finally {
      setRefreshing(false);
    }
  };
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'hard':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  if (loading) {
    return <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-16 h-16 mx-auto mb-4 animate-pulse text-purple-400" />
          <h2 className="text-2xl font-bold mb-2">AI Scanning the Internet...</h2>
          <p className="text-gray-400">Finding the latest educational innovations for your platform</p>
          <Progress value={75} className="w-64 mx-auto mt-4" />
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-600 p-3 rounded-full">
              <Brain className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">AI Insights Dashboard</h1>
              <p className="text-gray-400">Latest educational technology trends and improvements</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <Button onClick={handleRefresh} disabled={refreshing} variant="outline" className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white">
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Scanning...' : 'Refresh Scan'}
            </Button>
            <Button onClick={onClose} variant="outline" className="text-slate-950">
              Close Dashboard
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <h3 className="text-2xl font-bold text-green-400">{insights?.trends?.length || 0}</h3>
              <p className="text-gray-400">New Trends Found</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 text-center">
              <Lightbulb className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
              <h3 className="text-2xl font-bold text-yellow-400">{insights?.recommendations?.length || 0}</h3>
              <p className="text-gray-400">AI Recommendations</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 text-center">
              <Zap className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <h3 className="text-2xl font-bold text-purple-400">{insights?.emergingTechnologies?.length || 0}</h3>
              <p className="text-gray-400">Emerging Technologies</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <h3 className="text-2xl font-bold text-blue-400">
                {insights?.trends?.filter((t: any) => t.impact === 'high').length || 0}
              </h3>
              <p className="text-gray-400">High Impact Ideas</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Content */}
        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="bg-gray-800">
            <TabsTrigger value="trends">Latest Trends</TabsTrigger>
            <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
            <TabsTrigger value="technologies">Emerging Tech</TabsTrigger>
            <TabsTrigger value="improvements">UX Improvements</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {insights?.trends?.map((trend: any) => <Card key={trend.id} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{trend.title}</CardTitle>
                      <div className="flex space-x-2">
                        <Badge className={`${getImpactColor(trend.impact)} text-white`}>
                          {trend.impact} impact
                        </Badge>
                        <Badge className={`${getDifficultyColor(trend.implementationDifficulty)} text-white`}>
                          {trend.implementationDifficulty}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-4">{trend.description}</p>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-green-400 mb-1">Potential Benefit:</h4>
                        <p className="text-sm text-gray-400">{trend.potentialBenefit}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-400 mb-1">Implementation:</h4>
                        <p className="text-sm text-gray-400">{trend.suggestedImplementation}</p>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                        <span className="text-xs text-gray-500">Relevance: {trend.relevanceScore}%</span>
                        <span className="text-xs text-gray-500">Source: {trend.source}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>)}
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            {insights?.recommendations?.map((rec: string, index: number) => <Card key={index} className="bg-gray-800 border-gray-700">
                <CardContent className="p-6 bg-slate-700">
                  <div className="flex items-center space-x-4">
                    <div className="bg-purple-600 p-2 rounded-full">
                      <Target className="w-5 h-5" />
                    </div>
                    <p className="flex-1">{rec}</p>
                    <ArrowRight className="w-5 h-5 text-purple-400" />
                  </div>
                </CardContent>
              </Card>)}
          </TabsContent>

          <TabsContent value="technologies" className="space-y-4">
            {insights?.emergingTechnologies?.map((tech: string, index: number) => <Card key={index} className="bg-gray-800 border-gray-700">
                <CardContent className="p-6 bg-slate-700">
                  <div className="flex items-center space-x-4">
                    <div className="bg-cyan-600 p-2 rounded-full">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <p className="flex-1 font-medium">{tech}</p>
                  </div>
                </CardContent>
              </Card>)}
          </TabsContent>

          <TabsContent value="improvements" className="space-y-4">
            {insights?.userExperienceImprovements?.map((improvement: string, index: number) => <Card key={index} className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-orange-600 p-2 rounded-full">
                      <Users className="w-5 h-5" />
                    </div>
                    <p className="flex-1">{improvement}</p>
                  </div>
                </CardContent>
              </Card>)}
          </TabsContent>
        </Tabs>
      </div>
    </div>;
};
export default AIInsightsDashboard;