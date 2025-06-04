
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, X, TrendingUp, Lightbulb, Sparkles } from 'lucide-react';
import { AIInsightsScanner } from '@/services/aiInsightsScanner';

interface InsightsNotificationProps {
  onViewDashboard: () => void;
}

const InsightsNotification = ({ onViewDashboard }: InsightsNotificationProps) => {
  const [insights, setInsights] = useState<any>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    checkForNewInsights();
  }, []);

  const checkForNewInsights = async () => {
    try {
      // Check if we should show notification
      const shouldShow = AIInsightsScanner.shouldPerformNewScan();
      const lastDismissed = localStorage.getItem('insights_notification_dismissed');
      const today = new Date().toDateString();
      
      if (shouldShow && lastDismissed !== today) {
        const results = await AIInsightsScanner.getOrUpdateInsights();
        setInsights(results);
        setShowNotification(true);
      }
    } catch (error) {
      console.error('Error checking insights:', error);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    setShowNotification(false);
    localStorage.setItem('insights_notification_dismissed', new Date().toDateString());
  };

  const handleViewDashboard = () => {
    onViewDashboard();
    handleDismiss();
  };

  if (!showNotification || dismissed || !insights) {
    return null;
  }

  const highImpactTrends = insights.trends?.filter((t: any) => t.impact === 'high') || [];

  return (
    <div className="fixed top-4 right-4 z-50 w-96">
      <Card className="bg-gradient-to-r from-purple-900 to-blue-900 border-purple-500 shadow-2xl">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 text-gray-300 hover:text-white"
            onClick={handleDismiss}
          >
            <X className="w-4 h-4" />
          </Button>
          <CardTitle className="flex items-center space-x-3 text-white pr-8">
            <div className="bg-purple-600 p-2 rounded-full">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">New AI Insights Available!</h3>
              <p className="text-purple-200 text-sm font-normal">
                Fresh ideas to enhance your learning platform
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center mb-1">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-white">{insights.trends?.length || 0}</div>
              <div className="text-xs text-gray-300">New Trends</div>
            </div>
            <div>
              <div className="flex items-center justify-center mb-1">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="text-2xl font-bold text-white">{highImpactTrends.length}</div>
              <div className="text-xs text-gray-300">High Impact</div>
            </div>
            <div>
              <div className="flex items-center justify-center mb-1">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">{insights.recommendations?.length || 0}</div>
              <div className="text-xs text-gray-300">AI Tips</div>
            </div>
          </div>

          {highImpactTrends.length > 0 && (
            <div className="bg-black/20 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-purple-200 mb-2">Top Recommendation:</h4>
              <p className="text-sm text-white">{highImpactTrends[0]?.title}</p>
              <Badge className="mt-2 bg-red-500 text-white text-xs">
                High Impact
              </Badge>
            </div>
          )}

          <div className="flex space-x-2">
            <Button
              onClick={handleViewDashboard}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              View Full Dashboard
            </Button>
            <Button
              onClick={handleDismiss}
              variant="outline"
              className="border-purple-400 text-purple-200 hover:bg-purple-800"
            >
              Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsightsNotification;
