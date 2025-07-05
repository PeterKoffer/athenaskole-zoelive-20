
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockUserProgressService } from '@/services/mockUserProgressService';
import AdaptiveDifficultyEngine from '@/services/AdaptiveDifficultyEngine';
import AdaptiveTestScenarios from './AdaptiveTestScenarios';
import AdaptiveTestHeader from './components/AdaptiveTestHeader';
import HistoricalDataTab from './components/HistoricalDataTab';
import DifficultyPredictionsTab from './components/DifficultyPredictionsTab';

const AdaptiveIntegrationTestInterface: React.FC = () => {
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

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <AdaptiveTestHeader />

        <Tabs defaultValue="scenarios" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full bg-gray-100">
            <TabsTrigger value="scenarios" className="text-gray-900">Test Scenarios</TabsTrigger>
            <TabsTrigger value="historical" className="text-gray-900">Historical Data</TabsTrigger>
            <TabsTrigger value="predictions" className="text-gray-900">Difficulty Predictions</TabsTrigger>
          </TabsList>

          <TabsContent value="scenarios">
            <AdaptiveTestScenarios />
          </TabsContent>

          <TabsContent value="historical">
            <HistoricalDataTab
              historicalData={historicalData}
              isLoadingData={isLoadingData}
              onRefresh={loadHistoricalData}
            />
          </TabsContent>

          <TabsContent value="predictions">
            <DifficultyPredictionsTab
              objectives={objectives}
              difficultyPredictions={difficultyPredictions}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdaptiveIntegrationTestInterface;
