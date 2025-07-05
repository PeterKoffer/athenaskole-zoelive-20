
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { mockUserProgressService } from '@/services/mockUserProgressService';
import AdaptiveDifficultyEngine from '@/services/AdaptiveDifficultyEngine';
import { useAdaptiveLearningSession } from '@/hooks/useAdaptiveLearningSession';
import { LearningAtom } from '@/types/learning';
import { AlertTriangle, CheckCircle2, Clock, Target, Play, Pause, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Use the specific test user ID that has historical data
const TEST_USER_ID = '62612ab6-0c5f-4713-b716-feee788c89d9';

// Test atom for testing purposes
const createTestAtom = (objectiveId: string, difficulty: 'easy' | 'medium' | 'hard'): LearningAtom => ({
  id: `test-atom-${objectiveId}-${difficulty}`,
  type: 'challenge',
  curriculumObjectiveId: objectiveId,
  curriculumObjectiveTitle: `Test Objective: ${objectiveId}`,
  subject: 'Mathematics',
  narrativeContext: `Welcome to the ${difficulty} level challenge for ${objectiveId}! Let's test your skills.`,
  difficulty,
  estimatedMinutes: 5,
  interactionType: 'game',
  content: {
    title: `Test Content: ${objectiveId}`,
    description: `This is a ${difficulty} level test question for ${objectiveId}`,
    data: {
      question: `What is 2 + 2? (${difficulty} level)`,
      options: ['3', '4', '5', '6'],
      correctAnswer: 1,
      explanation: 'The answer is 4 because 2 + 2 = 4'
    }
  },
  variantId: `test-${difficulty}`,
  isCompleted: false
});

const AdaptiveIntegrationTestInterface: React.FC = () => {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [historicalData, setHistoricalData] = useState<any>({});
  const [testAtom, setTestAtom] = useState<LearningAtom | null>(null);
  
  // Enhanced testing controls
  const [selectedObjective, setSelectedObjective] = useState<string>('k-cc-2');
  const [simulationSettings, setSimulationSettings] = useState({
    responseTime: 5,
    hintsUsed: 0,
    isCorrect: true
  });

  const availableObjectives = [
    { id: 'k-cc-1', label: 'k-cc-1 (High performer - should start hard)' },
    { id: 'k-cc-2', label: 'k-cc-2 (Struggling - should start easy)' },
    { id: 'k-cc-3', label: 'k-cc-3 (Moderate - should start medium)' },
    { id: 'dk-math-basic-arithmetic', label: 'dk-math-basic-arithmetic (Recovered - should start medium)' },
    { id: '1-oa-1', label: '1-oa-1 (No history - should start medium)' },
    { id: '1-oa-2', label: '1-oa-2 (One success - should start medium)' }
  ];

  const {
    currentAtom,
    isAdapting,
    adaptationReason,
    currentAttempt,
    recordResponse,
    completeSession,
    getSessionMetrics
  } = useAdaptiveLearningSession(testAtom);

  useEffect(() => {
    loadHistoricalData();
  }, []);

  const loadHistoricalData = async () => {
    try {
      const progress = await mockUserProgressService.getUserProgress(TEST_USER_ID);
      const objectiveData: any = {};
      
      for (const stepProgress of progress) {
        for (const [objId, metrics] of Object.entries(stepProgress.curriculumProgress)) {
          objectiveData[objId] = metrics;
        }
      }
      
      setHistoricalData(objectiveData);
      console.log(`[Test] Loaded historical data for test user ${TEST_USER_ID}:`, objectiveData);
    } catch (error) {
      console.error('Error loading historical data:', error);
    }
  };

  const addTestResult = (testName: string, success: boolean, details: any) => {
    setTestResults(prev => [...prev, {
      testName,
      success,
      details,
      timestamp: new Date().toISOString()
    }]);
  };

  const runTest1_HistoricalDifficultyInitialization = async () => {
    setCurrentTest('Historical Difficulty Initialization');
    
    try {
      const testObjectives = [
        { id: 'k-cc-1', expectedBehavior: 'Should suggest hard (completed easily)' },
        { id: 'k-cc-2', expectedBehavior: 'Should suggest easy (multiple failures)' },
        { id: 'k-cc-3', expectedBehavior: 'Should suggest medium (moderate performance)' },
        { id: 'dk-math-basic-arithmetic', expectedBehavior: 'Should suggest medium/hard (high performance after struggle)' },
        { id: 'new-objective-test', expectedBehavior: 'Should default to medium (no history)' }
      ];

      for (const testObj of testObjectives) {
        console.log(`[Test] Testing difficulty suggestion for objective: ${testObj.id}`);
        
        const historicalMetrics = await mockUserProgressService.getObjectiveProgress(TEST_USER_ID, testObj.id);
        console.log(`[Test] Historical metrics for ${testObj.id}:`, historicalMetrics);
        
        const suggestedDifficulty = await AdaptiveDifficultyEngine.suggestInitialDifficulty(
          TEST_USER_ID,
          testObj.id,
          'Mathematics'
        );

        addTestResult(`Difficulty Suggestion for ${testObj.id}`, true, {
          objectiveId: testObj.id,
          suggestedDifficulty,
          historicalMetrics,
          expectedBehavior: testObj.expectedBehavior,
          hasHistory: !!historicalMetrics,
          successRate: historicalMetrics?.successRate || 'N/A',
          isCompleted: historicalMetrics?.isCompleted || false
        });
      }

    } catch (error) {
      addTestResult('Historical Difficulty Initialization', false, { error: error.message });
    }
  };

  const runTest2_StartAdaptiveSession = async () => {
    setCurrentTest('Starting Adaptive Session');
    
    try {
      console.log(`[Test] Starting adaptive session for objective: ${selectedObjective}`);
      
      const suggestedDifficulty = await AdaptiveDifficultyEngine.suggestInitialDifficulty(
        TEST_USER_ID,
        selectedObjective,
        'Mathematics'
      );
      
      const atom = createTestAtom(selectedObjective, suggestedDifficulty);
      setTestAtom(atom);

      addTestResult('Adaptive Session Started', true, {
        objectiveId: selectedObjective,
        suggestedDifficulty,
        atomId: atom.id,
        atomDifficulty: atom.difficulty,
        reasoning: 'Session initialized with historically-informed difficulty'
      });

    } catch (error) {
      addTestResult('Start Adaptive Session', false, { error: error.message });
    }
  };

  const simulateUserResponse = () => {
    if (currentAtom) {
      const { responseTime, hintsUsed, isCorrect } = simulationSettings;
      
      console.log(`[Test] Simulating response - Correct: ${isCorrect}, Time: ${responseTime}s, Hints: ${hintsUsed}`);
      
      recordResponse(isCorrect, hintsUsed);
      
      addTestResult('User Response Simulated', true, {
        atomId: currentAtom.id,
        attempt: currentAttempt,
        isCorrect,
        responseTime,
        hintsUsed,
        isAdapting,
        adaptationReason
      });
    }
  };

  const runTest3_CompletionAndPersistence = async () => {
    if (!currentAtom) return;
    
    setCurrentTest('Completion and Persistence');
    
    try {
      const performance = completeSession();
      
      if (performance) {
        addTestResult('Session Completion', true, {
          atomId: currentAtom.id,
          performance,
          objectiveId: currentAtom.curriculumObjectiveId
        });

        // Wait for persistence to complete, then check historical data
        setTimeout(async () => {
          await loadHistoricalData();
          const updatedMetrics = historicalData[currentAtom.curriculumObjectiveId];
          
          addTestResult('Historical Data Update', true, {
            objectiveId: currentAtom.curriculumObjectiveId,
            updatedMetrics,
            performanceRecorded: performance
          });
          
          // Test if future difficulty suggestions have changed
          setTimeout(async () => {
            const newSuggestedDifficulty = await AdaptiveDifficultyEngine.suggestInitialDifficulty(
              TEST_USER_ID,
              currentAtom.curriculumObjectiveId,
              'Mathematics'
            );
            
            addTestResult('Future Difficulty Influence', true, {
              objectiveId: currentAtom.curriculumObjectiveId,
              newSuggestedDifficulty,
              previousDifficulty: currentAtom.difficulty,
              influenceDetected: newSuggestedDifficulty !== currentAtom.difficulty
            });
          }, 1000);
        }, 2000);
      }

    } catch (error) {
      addTestResult('Completion and Persistence', false, { error: error.message });
    }
  };

  const runFullAdaptiveLoopTest = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    console.log(`[Test] Starting full adaptive loop test with objective: ${selectedObjective}`);
    
    // Step 1: Historical difficulty
    await runTest1_HistoricalDifficultyInitialization();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Step 2: Start session
    await runTest2_StartAdaptiveSession();
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsRunning(false);
  };

  const resetTest = () => {
    setTestAtom(null);
    setTestResults([]);
    setCurrentTest('');
  };

  const TestResultCard = ({ result }: { result: any }) => (
    <Card className={`mb-2 ${result.success ? 'border-green-500' : 'border-red-500'}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            {result.success ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <AlertTriangle className="w-4 h-4 text-red-500" />}
            {result.testName}
          </CardTitle>
          <Badge variant={result.success ? 'default' : 'destructive'}>
            {result.success ? 'PASS' : 'FAIL'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
          {JSON.stringify(result.details, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Full Adaptive Learning Loop Integration Test
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-3 bg-blue-50 rounded">
            <p className="text-sm font-medium">Test Configuration:</p>
            <p className="text-xs text-gray-600">Test User ID: {TEST_USER_ID}</p>
            <p className="text-xs text-gray-600">Auth User: {user?.id || 'Not logged in'}</p>
            <p className="text-xs text-gray-600">Historical Objectives: {Object.keys(historicalData).length}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="objective-select">Select Objective for Testing</Label>
              <Select value={selectedObjective} onValueChange={setSelectedObjective}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose objective" />
                </SelectTrigger>
                <SelectContent>
                  {availableObjectives.map(obj => (
                    <SelectItem key={obj.id} value={obj.id}>{obj.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={runFullAdaptiveLoopTest} disabled={isRunning}>
                {isRunning ? 'Running...' : 'Start Full Loop Test'}
              </Button>
              <Button onClick={resetTest} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
          
          {currentTest && (
            <div className="mb-4 p-2 bg-blue-50 rounded flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Currently running: {currentTest}
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="results" className="w-full">
        <TabsList>
          <TabsTrigger value="results">Test Results</TabsTrigger>
          <TabsTrigger value="session">Active Session</TabsTrigger>
          <TabsTrigger value="simulation">Simulation Controls</TabsTrigger>
          <TabsTrigger value="historical">Historical Data</TabsTrigger>
        </TabsList>

        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Test Results ({testResults.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {testResults.length === 0 ? (
                <p className="text-gray-500">No test results yet. Run the test suite to see results.</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {testResults.map((result, index) => (
                    <TestResultCard key={index} result={result} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="session">
          <Card>
            <CardHeader>
              <CardTitle>Active Adaptive Session</CardTitle>
            </CardHeader>
            <CardContent>
              {currentAtom ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold">Current Atom</h4>
                      <p className="text-sm">ID: {currentAtom.id}</p>
                      <p className="text-sm">Objective: {currentAtom.curriculumObjectiveId}</p>
                      <p className="text-sm">Difficulty: {currentAtom.difficulty}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Session State</h4>
                      <p className="text-sm">Attempt: {currentAttempt}</p>
                      <p className="text-sm">Adapting: {isAdapting ? 'Yes' : 'No'}</p>
                      {adaptationReason && <p className="text-sm">Reason: {adaptationReason}</p>}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 flex-wrap">
                    <Button onClick={simulateUserResponse} size="sm" variant="outline">
                      Simulate Response
                    </Button>
                    <Button 
                      onClick={runTest3_CompletionAndPersistence} 
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Complete & Test Persistence
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No active session. Run the full loop test to start a session.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simulation">
          <Card>
            <CardHeader>
              <CardTitle>Simulation Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="response-time">Response Time (seconds)</Label>
                  <Input
                    id="response-time"
                    type="number"
                    value={simulationSettings.responseTime}
                    onChange={(e) => setSimulationSettings(prev => ({
                      ...prev,
                      responseTime: parseInt(e.target.value) || 5
                    }))}
                    min="1"
                    max="120"
                  />
                </div>
                <div>
                  <Label htmlFor="hints-used">Hints Used</Label>
                  <Input
                    id="hints-used"
                    type="number"
                    value={simulationSettings.hintsUsed}
                    onChange={(e) => setSimulationSettings(prev => ({
                      ...prev,
                      hintsUsed: parseInt(e.target.value) || 0
                    }))}
                    min="0"
                    max="5"
                  />
                </div>
                <div>
                  <Label htmlFor="is-correct">Response Correctness</Label>
                  <Select 
                    value={simulationSettings.isCorrect.toString()} 
                    onValueChange={(value) => setSimulationSettings(prev => ({
                      ...prev,
                      isCorrect: value === 'true'
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Correct</SelectItem>
                      <SelectItem value="false">Incorrect</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <h4 className="font-semibold mb-2">Quick Simulation Presets:</h4>
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setSimulationSettings({ responseTime: 2, hintsUsed: 0, isCorrect: true })}
                  >
                    Quick Success
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setSimulationSettings({ responseTime: 30, hintsUsed: 2, isCorrect: false })}
                  >
                    Struggling
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setSimulationSettings({ responseTime: 8, hintsUsed: 1, isCorrect: true })}
                  >
                    Moderate Success
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historical">
          <Card>
            <CardHeader>
              <CardTitle>Historical Data (Test User: {TEST_USER_ID})</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={loadHistoricalData} className="mb-4" size="sm">
                Refresh Historical Data
              </Button>
              <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-96">
                {JSON.stringify(historicalData, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdaptiveIntegrationTestInterface;
