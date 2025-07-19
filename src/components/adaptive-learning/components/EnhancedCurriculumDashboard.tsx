
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CurriculumAlignedContent from './CurriculumAlignedContent';
import EnhancedLearningSession from './EnhancedLearningSession';
import AdvancedAnalytics from './AdvancedAnalytics';
import SmartRecommendations from './SmartRecommendations';
import { useAdaptiveDifficulty } from './useAdaptiveDifficulty';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, BarChart3, Brain, Target, ArrowLeft } from 'lucide-react';

interface EnhancedCurriculumDashboardProps {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  onBack: () => void;
}

const EnhancedCurriculumDashboard = ({ 
  subject, 
  skillArea, 
  onBack 
}: EnhancedCurriculumDashboardProps) => {
  const [selectedObjective, setSelectedObjective] = useState<{
    id: string;
    title: string;
    description: string;
    difficulty_level: number;
  } | null>(null);

  const [activeTab, setActiveTab] = useState('ai-path');

  const {
    difficultyMetrics,
    getDifficultyRecommendation,
    applyDifficultyAdjustment
  } = useAdaptiveDifficulty(subject, skillArea);

  const handleAIPathUpdate = (pathData: any) => {
    console.log('AI has updated the learning path:', pathData);
    // The AI automatically handles path updates - no manual intervention needed
    if (pathData.focus) {
      setActiveTab('objectives'); // Navigate to show the AI-selected content
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
                AI Level {difficultyMetrics.currentLevel}
              </Badge>
              {difficultyRecommendation.type !== 'maintain' && (
                <Button
                  size="sm"
                  onClick={applyDifficultyAdjustment}
                  className="bg-lime-500 hover:bg-lime-600"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Auto-Adjust to Level {difficultyMetrics.recommendedLevel}
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">
              AI-Personalized Learning
            </h1>
            <p className="text-gray-400">
              AI-driven adaptive curriculum for {subject} • {skillArea}
            </p>
            
            {difficultyRecommendation.type !== 'maintain' && (
              <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-3 mt-4">
                <p className="text-blue-200 text-sm">
                  <Brain className="w-4 h-4 inline mr-2" />
                  {difficultyRecommendation.message}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-gray-800 border-gray-700 grid w-full grid-cols-4">
          <TabsTrigger value="ai-path" className="data-[state=active]:bg-lime-500">
            <Brain className="w-4 h-4 mr-2" />
            AI Learning Path
          </TabsTrigger>
          <TabsTrigger value="objectives" className="data-[state=active]:bg-lime-500">
            <Target className="w-4 h-4 mr-2" />
            Current Objectives
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-lime-500">
            <BarChart3 className="w-4 h-4 mr-2" />
            Progress Analytics
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-lime-500">
            <TrendingUp className="w-4 h-4 mr-2" />
            AI Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai-path">
          <SmartRecommendations 
            subject={subject} 
            onPathUpdate={handleAIPathUpdate}
          />
        </TabsContent>

        <TabsContent value="objectives">
          <CurriculumAlignedContent
            subject={subject}
            onObjectiveSelect={setSelectedObjective}
          />
        </TabsContent>

        <TabsContent value="analytics">
          <AdvancedAnalytics subject={subject} userId="user-placeholder" />
        </TabsContent>

        <TabsContent value="insights">
          <div className="space-y-6">
            {/* Difficulty Adaptation Insights */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Brain className="w-5 h-5 text-lime-400" />
                  <span>AI Learning Adaptation</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">Current AI Assessment Level</p>
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
                    <p className="text-sm text-gray-400">AI Confidence Score</p>
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
                    <strong>AI Decision:</strong> {difficultyMetrics.adaptationReason}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Last AI update: {new Date(difficultyMetrics.lastUpdated).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* AI Learning Insights */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Brain className="w-5 h-5 text-lime-400" />
                  <span>AI Learning Intelligence</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-800 rounded-lg">
                    <Brain className="w-8 h-8 text-lime-400 mx-auto mb-2" />
                    <h3 className="text-white font-medium">Personalized Content</h3>
                    <p className="text-gray-400 text-sm">AI selects optimal learning materials</p>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-800 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <h3 className="text-white font-medium">Adaptive Progression</h3>
                    <p className="text-gray-400 text-sm">Automatic difficulty adjustment</p>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-800 rounded-lg">
                    <Target className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <h3 className="text-white font-medium">Focused Learning</h3>
                    <p className="text-gray-400 text-sm">AI identifies and addresses gaps</p>
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
