
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Clock, Target, TrendingDown, TrendingUp } from 'lucide-react';
import AdaptiveDifficultyEngine from '@/services/AdaptiveDifficultyEngine';
import InSessionAdaptiveManager from '@/services/InSessionAdaptiveManager';
import UniverseSessionManager from '@/services/UniverseSessionManager';
import { mockUserProgressService } from '@/services/mockUserProgressService';
import { LearningAtomPerformance } from '@/types/learning';

interface ScenarioResult {
  initialDifficulty: string;
  finalDifficulty: string;
  sessionMetrics: any;
  historicalUpdate: any;
  consoleLogs: string[];
}

const AdaptiveTestScenarios: React.FC = () => {
  const [scenario1Results, setScenario1Results] = useState<ScenarioResult | null>(null);
  const [scenario2Results, setScenario2Results] = useState<ScenarioResult | null>(null);
  const [isRunningScenario1, setIsRunningScenario1] = useState(false);
  const [isRunningScenario2, setIsRunningScenario2] = useState(false);

  const testUserId = '62612ab6-0c5f-4713-b716-feee788c89d9';

  const captureConsoleLogs = (): string[] => {
    // In a real implementation, we'd capture actual console logs
    // For now, we'll simulate the expected log patterns
    return [];
  };

  const runStrugglingStudentScenario = async () => {
    setIsRunningScenario1(true);
    const consoleLogs: string[] = [];
    
    try {
      console.log('🎯 [TEST SCENARIO 1] Starting Struggling Student Test for k-cc-2');
      consoleLogs.push('[TEST SCENARIO 1] Starting Struggling Student Test for k-cc-2');

      // Step 1: Get initial difficulty suggestion
      const initialDifficulty = await AdaptiveDifficultyEngine.suggestInitialDifficulty(
        testUserId, 'k-cc-2', 'math'
      );
      console.log(`📊 [SCENARIO 1] Initial difficulty for k-cc-2: ${initialDifficulty}`);
      consoleLogs.push(`Initial difficulty for k-cc-2: ${initialDifficulty}`);

      // Step 2: Start adaptive session
      const atomId = 'k-cc-2-test-atom';
      InSessionAdaptiveManager.startAtomSession(atomId);
      console.log(`🎬 [SCENARIO 1] Started in-session management for ${atomId}`);

      // Step 3: Simulate struggling interactions
      const strugglingInteractions = [
        { isCorrect: false, timeSeconds: 75, hints: 2 },
        { isCorrect: false, timeSeconds: 90, hints: 3 },
        { isCorrect: false, timeSeconds: 60, hints: 1 },
        { isCorrect: true, timeSeconds: 120, hints: 4 } // Finally succeeds but with lots of help
      ];

      for (let i = 0; i < strugglingInteractions.length; i++) {
        const interaction = strugglingInteractions[i];
        InSessionAdaptiveManager.recordAtomInteraction(
          atomId, 
          interaction.isCorrect, 
          interaction.timeSeconds, 
          interaction.hints
        );
        
        console.log(`📝 [SCENARIO 1] Interaction ${i + 1}: ${interaction.isCorrect ? 'Correct' : 'Incorrect'}, ${interaction.timeSeconds}s, ${interaction.hints} hints`);
        consoleLogs.push(`Interaction ${i + 1}: ${interaction.isCorrect ? 'Correct' : 'Incorrect'}, ${interaction.timeSeconds}s, ${interaction.hints} hints`);

        // Check for adaptation
        const adaptationCheck = InSessionAdaptiveManager.shouldAdaptAtomDifficulty(atomId);
        if (adaptationCheck.shouldAdapt) {
          console.log(`🔄 [SCENARIO 1] Adaptation triggered: ${adaptationCheck.reason}`);
          consoleLogs.push(`Adaptation triggered: ${adaptationCheck.reason}`);
        }
      }

      // Step 4: End session and get performance
      const sessionMetrics = InSessionAdaptiveManager.getSessionSummary(atomId);
      const finalPerformance = InSessionAdaptiveManager.endAtomSession(atomId);
      
      console.log(`📊 [SCENARIO 1] Session metrics:`, sessionMetrics);
      console.log(`🏁 [SCENARIO 1] Final performance:`, finalPerformance);

      // Step 5: Record performance with UniverseSessionManager
      if (finalPerformance) {
        console.log(`💾 [SCENARIO 1] Recording performance with UniverseSessionManager`);
        await mockUserProgressService.recordObjectiveAttempt(
          testUserId, '1', 'k-cc-2', finalPerformance
        );
      }

      // Step 6: Check new difficulty suggestion
      const newDifficulty = await AdaptiveDifficultyEngine.suggestInitialDifficulty(
        testUserId, 'k-cc-2', 'math'
      );
      console.log(`📊 [SCENARIO 1] New difficulty suggestion for k-cc-2: ${newDifficulty}`);

      // Step 7: Get updated historical data
      const historicalUpdate = await mockUserProgressService.getObjectiveProgress(testUserId, 'k-cc-2');

      setScenario1Results({
        initialDifficulty,
        finalDifficulty: newDifficulty,
        sessionMetrics,
        historicalUpdate,
        consoleLogs
      });

    } catch (error) {
      console.error('Error in Scenario 1:', error);
      consoleLogs.push(`Error: ${error}`);
    } finally {
      setIsRunningScenario1(false);
    }
  };

  const runMasteryStudentScenario = async () => {
    setIsRunningScenario2(true);
    const consoleLogs: string[] = [];
    
    try {
      console.log('🎯 [TEST SCENARIO 2] Starting Mastery Student Test for k-cc-3');
      consoleLogs.push('[TEST SCENARIO 2] Starting Mastery Student Test for k-cc-3');

      // Step 1: Get initial difficulty suggestion
      const initialDifficulty = await AdaptiveDifficultyEngine.suggestInitialDifficulty(
        testUserId, 'k-cc-3', 'math'
      );
      console.log(`📊 [SCENARIO 2] Initial difficulty for k-cc-3: ${initialDifficulty}`);
      consoleLogs.push(`Initial difficulty for k-cc-3: ${initialDifficulty}`);

      // Step 2: Start adaptive session
      const atomId = 'k-cc-3-test-atom';
      InSessionAdaptiveManager.startAtomSession(atomId);
      console.log(`🎬 [SCENARIO 2] Started in-session management for ${atomId}`);

      // Step 3: Simulate mastery interactions
      const masteryInteractions = [
        { isCorrect: true, timeSeconds: 15, hints: 0 },
        { isCorrect: true, timeSeconds: 12, hints: 0 },
        { isCorrect: true, timeSeconds: 18, hints: 0 },
        { isCorrect: true, timeSeconds: 10, hints: 0 }
      ];

      for (let i = 0; i < masteryInteractions.length; i++) {
        const interaction = masteryInteractions[i];
        InSessionAdaptiveManager.recordAtomInteraction(
          atomId, 
          interaction.isCorrect, 
          interaction.timeSeconds, 
          interaction.hints
        );
        
        console.log(`📝 [SCENARIO 2] Interaction ${i + 1}: ${interaction.isCorrect ? 'Correct' : 'Incorrect'}, ${interaction.timeSeconds}s, ${interaction.hints} hints`);
        consoleLogs.push(`Interaction ${i + 1}: ${interaction.isCorrect ? 'Correct' : 'Incorrect'}, ${interaction.timeSeconds}s, ${interaction.hints} hints`);

        // Check for adaptation
        const adaptationCheck = InSessionAdaptiveManager.shouldAdaptAtomDifficulty(atomId);
        if (adaptationCheck.shouldAdapt) {
          console.log(`🔄 [SCENARIO 2] Adaptation triggered: ${adaptationCheck.reason}`);
          consoleLogs.push(`Adaptation triggered: ${adaptationCheck.reason}`);
        }
      }

      // Step 4: End session and get performance
      const sessionMetrics = InSessionAdaptiveManager.getSessionSummary(atomId);
      const finalPerformance = InSessionAdaptiveManager.endAtomSession(atomId);
      
      console.log(`📊 [SCENARIO 2] Session metrics:`, sessionMetrics);
      console.log(`🏁 [SCENARIO 2] Final performance:`, finalPerformance);

      // Step 5: Record performance with UniverseSessionManager
      if (finalPerformance) {
        console.log(`💾 [SCENARIO 2] Recording performance with UniverseSessionManager`);
        await mockUserProgressService.recordObjectiveAttempt(
          testUserId, '1', 'k-cc-3', finalPerformance
        );
      }

      // Step 6: Check new difficulty suggestion
      const newDifficulty = await AdaptiveDifficultyEngine.suggestInitialDifficulty(
        testUserId, 'k-cc-3', 'math'
      );
      console.log(`📊 [SCENARIO 2] New difficulty suggestion for k-cc-3: ${newDifficulty}`);

      // Step 7: Get updated historical data
      const historicalUpdate = await mockUserProgressService.getObjectiveProgress(testUserId, 'k-cc-3');

      setScenario2Results({
        initialDifficulty,
        finalDifficulty: newDifficulty,
        sessionMetrics,
        historicalUpdate,
        consoleLogs
      });

    } catch (error) {
      console.error('Error in Scenario 2:', error);
      consoleLogs.push(`Error: ${error}`);
    } finally {
      setIsRunningScenario2(false);
    }
  };

  const ScenarioResultsCard = ({ 
    title, 
    results, 
    icon 
  }: { 
    title: string; 
    results: ScenarioResult | null; 
    icon: React.ReactNode;
  }) => {
    if (!results) return null;

    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {icon}
            {title} - Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="summary">
            <TabsList>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="metrics">Session Metrics</TabsTrigger>
              <TabsTrigger value="historical">Historical Update</TabsTrigger>
              <TabsTrigger value="logs">Console Logs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm">Initial Difficulty</h4>
                  <Badge variant="outline">{results.initialDifficulty}</Badge>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Final Difficulty</h4>
                  <Badge variant="outline">{results.finalDifficulty}</Badge>
                </div>
              </div>
              
              {results.initialDifficulty !== results.finalDifficulty && (
                <Alert>
                  <AlertDescription>
                    Difficulty suggestion changed from {results.initialDifficulty} to {results.finalDifficulty}!
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
            
            <TabsContent value="metrics">
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(results.sessionMetrics, null, 2)}
              </pre>
            </TabsContent>
            
            <TabsContent value="historical">
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(results.historicalUpdate, null, 2)}
              </pre>
            </TabsContent>
            
            <TabsContent value="logs">
              <div className="space-y-2">
                {results.consoleLogs.map((log, index) => (
                  <div key={index} className="font-mono text-sm bg-gray-100 p-2 rounded">
                    {log}
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scenario 1: Struggling Student */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-500" />
              Scenario 1: Struggling Student
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600">
              <p><strong>Objective:</strong> k-cc-2</p>
              <p><strong>Expected Initial Difficulty:</strong> easy</p>
              <p><strong>Simulation:</strong> Incorrect responses, high time, hints used</p>
            </div>
            
            <Button
              onClick={runStrugglingStudentScenario}
              disabled={isRunningScenario1}
              className="w-full"
            >
              {isRunningScenario1 ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Running Scenario...
                </>
              ) : (
                <>
                  <Target className="w-4 h-4 mr-2" />
                  Run Struggling Student Test
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Scenario 2: Mastery Student */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Scenario 2: Mastery Student
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600">
              <p><strong>Objective:</strong> k-cc-3</p>
              <p><strong>Expected Initial Difficulty:</strong> medium</p>
              <p><strong>Simulation:</strong> Correct, quick responses, no hints</p>
            </div>
            
            <Button
              onClick={runMasteryStudentScenario}
              disabled={isRunningScenario2}
              className="w-full"
            >
              {isRunningScenario2 ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Running Scenario...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Run Mastery Student Test
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      <ScenarioResultsCard
        title="Struggling Student (k-cc-2)"
        results={scenario1Results}
        icon={<TrendingDown className="w-5 h-5 text-red-500" />}
      />

      <ScenarioResultsCard
        title="Mastery Student (k-cc-3)"
        results={scenario2Results}
        icon={<TrendingUp className="w-5 h-5 text-green-500" />}
      />
    </div>
  );
};

export default AdaptiveTestScenarios;
