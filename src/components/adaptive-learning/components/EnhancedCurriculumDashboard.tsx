
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CurriculumAlignedContent from './CurriculumAlignedContent';
import CurriculumLearningPath from './CurriculumLearningPath';
import EnhancedLearningSession from './EnhancedLearningSession';
import AdvancedAnalytics from './AdvancedAnalytics';
import SmartRecommendations from './SmartRecommendations';
import { useAdaptiveDifficulty } from './AdaptiveDifficultyEngine';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, BarChart3, Lightbulb, Target, ArrowLeft } from 'lucide-react';

interface EnhancedCurriculumDashboardProps {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  onBack: () => void;
}

const EnhancedCurriculumDashboard = ({ 
  subject, 
  skillArea, 
  difficultyLevel, 
  onBack 
}: EnhancedCurriculumDashboardProps) => {
  const [selectedObjective, setSelectedObjective] = useState<{
    id: string;
    title: string;
    description: string;
    difficulty_level: number;
  } | null>(null);

  const [activeTab, setActiveTab] = useState('objectives');

  const {
    difficultyMetrics,
    getDifficultyRecommendation,
    applyDifficultyAdjustment
  } = useAdaptiveDifficulty(subject, skillArea);

  const handleRecommendationApply = (recommendation: any) => {
    console.log('Applying recommendation:', recommendation);
    // Handle recommendation application logic here
    if (recommendation.type === 'concept') {
      setActiveTab('objectives');
    } else if (recommendation.type === 'strategy') {
      setActiveTab('paths');
    }
  };

  const difficultyRecommendation = getDifficultyRecommendation();

  if (selectedObjective) {
    return (
      <EnhancedLearningSession
        subject={subject}
        skillArea={skillArea}
        difficultyLevel={selectedObjective.difficulty_level}
        onBack={() => setSelectedObjective(null)}
        learningObjective={selectedObjective}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Enhanced Header with Adaptive Insights */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-gray-400 hover:text-white hover:bg-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="bg-blue-600 text-white border-blue-600">
                Current Level {difficultyMetrics.currentLevel}
              </Badge>
              {difficultyRecommendation.type !== 'maintain' && (
                <Button
                  size="sm"
                  onClick={applyDifficultyAdjustment}
                  className="bg-lime-500 hover:bg-lime-600"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Adjust to Level {difficultyMetrics.recommendedLevel}
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">
              Enhanced Curriculum Learning
            </h1>
            <p className="text-gray-400">
              AI-powered adaptive learning for {subject} • {skillArea}
            </p>
            
            {difficultyRecommendation.type !== 'maintain' && (
              <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-3 mt-4">
                <p className="text-blue-200 text-sm">
                  <Target className="w-4 h-4 inline mr-2" />
                  {difficultyRecommendation.message}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Smart Recommendations */}
      <SmartRecommendations 
        subject={subject} 
        onRecommendationApply={handleRecommendationApply}
      />

      {/* Enhanced Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-gray-800 border-gray-700 grid w-full grid-cols-4">
          <TabsTrigger value="objectives" className="data-[state=active]:bg-lime-500">
            <Target className="w-4 h-4 mr-2" />
            Learning Objectives
          </TabsTrigger>
          <TabsTrigger value="paths" className="data-[state=active]:bg-lime-500">
            <TrendingUp className="w-4 h-4 mr-2" />
            Learning Paths
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-lime-500">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-lime-500">
            <Lightbulb className="w-4 h-4 mr-2" />
            AI Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="objectives">
          <CurriculumAlignedContent
            subject={subject}
            onObjectiveSelect={setSelectedObjective}
          />
        </TabsContent>

        <TabsContent value="paths">
          <CurriculumLearningPath
            subject={subject}
            onStartObjective={setSelectedObjective}
          />
        </TabsContent>

        <TabsContent value="analytics">
          <AdvancedAnalytics subject={subject} />
        </TabsContent>

        <TabsContent value="insights">
          <div className="space-y-6">
            {/* Difficulty Adaptation Insights */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <TrendingUp className="w-5 h-5 text-lime-400" />
                  <span>Adaptive Difficulty Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">Current Performance Level</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-lime-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(difficultyMetrics.currentLevel / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-white font-semibold">{difficultyMetrics.currentLevel}/10</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">Adaptation Confidence</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${difficultyMetrics.confidenceScore * 100}%` }}
                        />
                      </div>
                      <span className="text-white font-semibold">
                        {Math.round(difficultyMetrics.confidenceScore * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-gray-300 text-sm">
                    <strong>Latest Adaptation:</strong> {difficultyMetrics.adaptationReason}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Last updated: {new Date(difficultyMetrics.lastUpdated).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Additional AI Insights */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Lightbulb className="w-5 h-5 text-lime-400" />
                  <span>Learning Pattern Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-800 rounded-lg">
                    <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <h3 className="text-white font-medium">Optimal Challenge</h3>
                    <p className="text-gray-400 text-sm">Content difficulty matches your skill level</p>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-800 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <h3 className="text-white font-medium">Progress Trend</h3>
                    <p className="text-gray-400 text-sm">Steady improvement detected</p>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-800 rounded-lg">
                    <BarChart3 className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <h3 className="text-white font-medium">Learning Efficiency</h3>
                    <p className="text-gray-400 text-sm">Above average retention rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedCurriculumDashboard;
