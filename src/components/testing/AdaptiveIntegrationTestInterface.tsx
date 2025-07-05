
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Brain, Database, Play, RotateCcw } from 'lucide-react';
import { mockUserProgressService } from '@/services/mockUserProgressService';
import AdaptiveDifficultyEngine from '@/services/AdaptiveDifficultyEngine';
import AdaptiveTestScenarios from './AdaptiveTestScenarios';

const AdaptiveIntegrationTestInterface: React.FC = () => {
  const [selectedObjective, setSelectedObjective] = useState<string>('k-cc-1');
  const [historicalData, setHistoricalData] = useState<any>(null);
  const [difficultyPredictions, setDifficultyPredictions] = useState<any>({});
  const [isLoadingData, setIsLoadingData] = useState(false);

  const testUserId = '62612ab6-0c5f-4713-b716-feee788c89d9';
  
  const objectives = [
    { id: 'k-cc-1', title: 'Count to 100 by ones and by tens', status: 'completed' },
    { id: 'k-cc-2', title: 'Count forward beginning from a given number', status: 'struggling' },
    { id: 'k-cc-3', title: 'Write numbers from 0 to 20', status: 'in-progress' },
    { id: 'k-oa-1', title: 'Addition and subtraction within 10', status: 'completed' },
    { id: 'dk-math-basic-arithmetic', title: 'Basic arithmetic operations', status: 'completed' },
    { id: 'dk-danish-reading', title: 'Danish reading comprehension', status: 'completed' }
  ];

  const loadHistoricalData = async () => {
    setIsLoadingData(true);
    try {
      const userProgress = await mockUserProgressService.getUserProgress(testUserId);
      setHistoricalData(userProgress);

      // Get difficulty predictions for all objectives
      const predictions: any = {};
      for (const objective of objectives) {
        const difficulty = await AdaptiveDifficultyEngine.suggestInitialDifficulty(
          testUserId, objective.id, 'math'
        );
        predictions[objective.id] = difficulty;
      }
      setDifficultyPredictions(predictions);
    } catch (error) {
      console.error('Error loading historical data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    loadHistoricalData();
  }, []);

  const resetTestData = async () => {
    // Reset specific test data - this is for testing purposes
    console.log('🔄 Resetting test data for scenarios...');
    await loadHistoricalData();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Brain className="w-8 h-8" />
              Adaptive Learning Integration Test Suite
            </CardTitle>
            <p className="text-blue-100">
              Comprehensive testing of the adaptive learning loop: InSessionAdaptiveManager → 
              UniverseSessionManager → AdaptiveDifficultyEngine
            </p>
          </CardHeader>
        </Card>

        <Tabs defaultValue="scenarios" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="scenarios">Test Scenarios</TabsTrigger>
            <TabsTrigger value="historical">Historical Data</TabsTrigger>
            <TabsTrigger value="predictions">Difficulty Predictions</TabsTrigger>
          </TabsList>

          {/* Test Scenarios Tab */}
          <TabsContent value="scenarios">
            <AdaptiveTestScenarios />
          </TabsContent>

          {/* Historical Data Tab */}
          <TabsContent value="historical">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Historical Progress Data
                  <Button 
                    onClick={loadHistoricalData} 
                    size="sm" 
                    variant="outline"
                    disabled={isLoadingData}
                  >
                    <RotateCcw className={`w-4 h-4 ${isLoadingData ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {historicalData ? (
                  <div className="space-y-4">
                    {historicalData.map((stepProgress: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-2">Step {stepProgress.stepId}</h3>
                        <p className="text-sm text-gray-600 mb-3">
                          Status: <Badge variant={stepProgress.isCompleted ? "default" : "secondary"}>
                            {stepProgress.isCompleted ? "Completed" : "In Progress"}
                          </Badge>
                        </p>
                        
                        <div className="grid grid-cols-1 gap-3">
                          {Object.entries(stepProgress.curriculumProgress).map(([objectiveId, progress]: [string, any]) => (
                            <div key={objectiveId} className="bg-gray-50 p-3 rounded">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-sm">{objectiveId}</h4>
                                <Badge variant={progress.isCompleted ? "default" : "secondary"}>
                                  {progress.isCompleted ? "✓ Complete" : "In Progress"}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>Total Attempts: {progress.totalAttempts}</div>
                                <div>Successful: {progress.successfulAttempts}</div>
                                <div>Time Spent: {progress.totalTimeSpentSeconds}s</div>
                                <div>Success Rate: {((progress.successRate || 0) * 100).toFixed(1)}%</div>
                              </div>
                              
                              {progress.lastAttemptPerformance && (
                                <div className="mt-2 text-xs text-gray-600">
                                  Last attempt: {progress.lastAttemptPerformance.success ? 'Success' : 'Failed'} 
                                  in {progress.lastAttemptPerformance.timeTakenSeconds}s
                                  {progress.lastAttemptPerformance.hintsUsed > 0 && ` (${progress.lastAttemptPerformance.hintsUsed} hints)`}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {isLoadingData ? 'Loading historical data...' : 'No historical data available'}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Difficulty Predictions Tab */}
          <TabsContent value="predictions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Current Difficulty Predictions
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Based on historical performance, here are the initial difficulty suggestions:
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {objectives.map((objective) => (
                    <div key={objective.id} className="border rounded-lg p-4">
                      <h3 className="font-semibold text-sm mb-2">{objective.id}</h3>
                      <p className="text-xs text-gray-600 mb-3">{objective.title}</p>
                      
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className={
                          objective.status === 'completed' ? 'border-green-500 text-green-600' :
                          objective.status === 'struggling' ? 'border-red-500 text-red-600' :
                          'border-yellow-500 text-yellow-600'
                        }>
                          {objective.status}
                        </Badge>
                        
                        <Badge className={
                          difficultyPredictions[objective.id] === 'easy' ? 'bg-green-100 text-green-800' :
                          difficultyPredictions[objective.id] === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          difficultyPredictions[objective.id] === 'hard' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {difficultyPredictions[objective.id] || 'loading...'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdaptiveIntegrationTestInterface;
