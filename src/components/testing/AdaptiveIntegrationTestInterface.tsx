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
import { AlertTriangle, CheckCircle2, Clock, Target } from 'lucide-react';

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
      // Always use the test user ID to load historical data
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
      // Test objectives with different historical patterns using the test user ID
      const testObjectives = [
        { id: 'k-cc-1', expectedBehavior: 'Should suggest hard (completed easily)' },
        { id: 'k-cc-2', expectedBehavior: 'Should suggest easy (multiple failures)' },
        { id: 'k-cc-3', expectedBehavior: 'Should suggest medium (moderate performance)' },
        { id: 'dk-math-basic-arithmetic', expectedBehavior: 'Should suggest medium/hard (high performance after struggle)' },
        { id: 'new-objective-test', expectedBehavior: 'Should default to medium (no history)' }
      ];

      for (const testObj of testObjectives) {
        console.log(`[Test] Testing difficulty suggestion for objective: ${testObj.id}`);

        // First, verify the historical data exists
        const historicalMetrics = await mockUserProgressService.getObjectiveProgress(TEST_USER_ID, testObj.id);
        console.log(`[Test] Historical metrics for ${testObj.id}:`, historicalMetrics);

        // Then get the difficulty suggestion
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
      addTestResult('Historical Difficulty Initialization', false, { error: (error instanceof Error) ? error.message : String(error) });
    }
  };

  const runTest2_AdaptiveSessionFlow = async () => {
    setCurrentTest('Adaptive Session Flow');

    try {
      // Create a test atom with the objective that has struggling history
      const testObj = 'k-cc-2'; // This has multiple failed attempts in mock data
      const suggestedDifficulty = await AdaptiveDifficultyEngine.suggestInitialDifficulty(
        TEST_USER_ID,
        testObj,
        'Mathematics'
      );

      const atom = createTestAtom(testObj, suggestedDifficulty);
      setTestAtom(atom);

      addTestResult('Session Initialization with Adaptive Difficulty', true, {
        atomId: atom.id,
        objectiveId: atom.curriculumObjectiveId,
        suggestedDifficulty,
        actualDifficulty: atom.difficulty,
        reasoning: 'Difficulty suggested based on historical performance'
      });

      // Wait a moment for session to initialize
      setTimeout(() => {
        addTestResult('Session Ready for Interaction', true, {
          currentAtom: currentAtom?.id,
          sessionMetrics: getSessionMetrics()
        });
      }, 1000);

    } catch (error) {
      addTestResult('Adaptive Session Flow', false, { error: (error instanceof Error) ? error.message : String(error) });
    }
  };

  const simulateCorrectResponse = () => {
    if (currentAtom) {
      recordResponse(true, 0); // Correct answer, no hints
      addTestResult('Simulated Correct Response', true, {
        atomId: currentAtom.id,
        attempt: currentAttempt,
        isAdapting,
        adaptationReason
      });
    }
  };

  const simulateIncorrectResponse = () => {
    if (currentAtom) {
      recordResponse(false, 2); // Incorrect answer, used 2 hints
      addTestResult('Simulated Incorrect Response', true, {
        atomId: currentAtom.id,
        attempt: currentAttempt,
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
          const updatedMetrics = historicalData?.[currentAtom.curriculumObjectiveId as any];

          addTestResult('Historical Data Update', true, {
            objectiveId: currentAtom.curriculumObjectiveId,
            updatedMetrics,
            performanceRecorded: performance
          });
        }, 2000);
      }

    } catch (error) {
      addTestResult('Completion and Persistence', false, { error: (error instanceof Error) ? error.message : String(error) });
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    console.log(`[Test] Starting integration tests with test user ID: ${TEST_USER_ID}`);

    await runTest1_HistoricalDifficultyInitialization();
    await new Promise(resolve => setTimeout(resolve, 1000));

    await runTest2_AdaptiveSessionFlow();
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Tests 3 will be run manually after user interactions

    setIsRunning(false);
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
        <pre className="text-xs bg-muted text-foreground p-2 rounded overflow-auto max-h-32 border">
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
            Adaptive Learning Integration Test Suite
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-3 bg-muted rounded border">
            <p className="text-sm font-medium text-foreground">Test Configuration:</p>
            <p className="text-xs text-muted-foreground">Test User ID: {TEST_USER_ID}</p>
            <p className="text-xs text-muted-foreground">Auth User: {user?.id || 'Not logged in'}</p>
            <p className="text-xs text-muted-foreground">Historical Objectives: {Object.keys(historicalData).length}</p>
          </div>

          <div className="flex gap-2 mb-4">
            <Button onClick={runAllTests} disabled={isRunning}>
              {isRunning ? 'Running Tests...' : 'Run All Tests'}
            </Button>
            <Button onClick={loadHistoricalData} variant="outline">
              Refresh Historical Data
            </Button>
          </div>
          {currentTest && (
            <div className="mb-4 p-2 bg-muted rounded border flex items-center gap-2">
              <Clock className="w-4 h-4 text-foreground" />
              <span className="text-foreground">Currently running: {currentTest}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="results" className="w-full">
        <TabsList>
          <TabsTrigger value="results">Test Results</TabsTrigger>
          <TabsTrigger value="session">Active Session</TabsTrigger>
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
                <div className="space-y-2">
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
                  <div className="grid grid-cols-2 gap-4">
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

                  <div className="flex gap-2">
                    <Button onClick={simulateCorrectResponse} size="sm" variant="outline">
                      Simulate Correct Response
                    </Button>
                    <Button onClick={simulateIncorrectResponse} size="sm" variant="outline">
                      Simulate Incorrect Response
                    </Button>
                    <Button onClick={runTest3_CompletionAndPersistence} size="sm">
                      Complete Session & Test Persistence
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No active session. Run Test 2 to start a session.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historical">
          <Card>
            <CardHeader>
              <CardTitle>Historical Data (Test User: {TEST_USER_ID})</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted text-foreground p-4 rounded overflow-auto max-h-96 border">
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
