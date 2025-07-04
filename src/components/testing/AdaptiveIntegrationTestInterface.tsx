
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

// Test atom for testing purposes
const createTestAtom = (objectiveId: string, difficulty: 'easy' | 'medium' | 'hard'): LearningAtom => ({
  id: `test-atom-${objectiveId}-${difficulty}`,
  curriculumObjectiveId: objectiveId,
  curriculumObjectiveTitle: `Test Objective: ${objectiveId}`,
  subject: 'Mathematics',
  difficulty,
  estimatedMinutes: 5,
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
    if (user) {
      loadHistoricalData();
    }
  }, [user]);

  const loadHistoricalData = async () => {
    if (!user) return;
    
    try {
      const progress = await mockUserProgressService.getUserProgress(user.id);
      const objectiveData: any = {};
      
      for (const stepProgress of progress) {
        for (const [objId, metrics] of Object.entries(stepProgress.curriculumProgress)) {
          objectiveData[objId] = metrics;
        }
      }
      
      setHistoricalData(objectiveData);
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
    if (!user) return;
    
    setCurrentTest('Historical Difficulty Initialization');
    
    try {
      // Test with objective that has history
      const objectiveWithHistory = 'k-cc-1'; // This has history in mock data
      const suggestedDifficulty = await AdaptiveDifficultyEngine.suggestInitialDifficulty(
        user.id,
        objectiveWithHistory,
        'Mathematics'
      );

      const historicalMetrics = historicalData[objectiveWithHistory];
      
      addTestResult('Historical Difficulty Suggestion', true, {
        objectiveId: objectiveWithHistory,
        suggestedDifficulty,
        historicalMetrics,
        expectedBehavior: historicalMetrics?.isCompleted ? 'Should suggest medium/hard for completed' : 'Should suggest based on success rate'
      });

      // Test with objective that has no history
      const newObjective = 'test-new-objective';
      const newObjectiveDifficulty = await AdaptiveDifficultyEngine.suggestInitialDifficulty(
        user.id,
        newObjective,
        'Mathematics'
      );

      addTestResult('New Objective Default Difficulty', true, {
        objectiveId: newObjective,
        suggestedDifficulty: newObjectiveDifficulty,
        expectedBehavior: 'Should default to medium for new objectives'
      });

    } catch (error) {
      addTestResult('Historical Difficulty Initialization', false, { error: error.message });
    }
  };

  const runTest2_AdaptiveSessionFlow = async () => {
    if (!user) return;
    
    setCurrentTest('Adaptive Session Flow');
    
    try {
      // Create a test atom with medium difficulty
      const testObj = 'k-cc-2'; // This has some failed attempts in mock data
      const atom = createTestAtom(testObj, 'medium');
      setTestAtom(atom);

      addTestResult('Session Initialization', true, {
        atomId: atom.id,
        initialDifficulty: atom.difficulty,
        objectiveId: atom.curriculumObjectiveId
      });

      // Wait a moment for session to initialize
      setTimeout(() => {
        // Simulate some responses to trigger adaptation
        addTestResult('Session Ready for Interaction', true, {
          currentAtom: currentAtom?.id,
          sessionMetrics: getSessionMetrics()
        });
      }, 1000);

    } catch (error) {
      addTestResult('Adaptive Session Flow', false, { error: error.message });
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
    if (!user || !currentAtom) return;
    
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
        }, 2000);
      }

    } catch (error) {
      addTestResult('Completion and Persistence', false, { error: error.message });
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
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
        <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
          {JSON.stringify(result.details, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>Please log in to run adaptive integration tests.</p>
        </CardContent>
      </Card>
    );
  }

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
          <div className="flex gap-2 mb-4">
            <Button onClick={runAllTests} disabled={isRunning}>
              {isRunning ? 'Running Tests...' : 'Run All Tests'}
            </Button>
            <Button onClick={loadHistoricalData} variant="outline">
              Refresh Historical Data
            </Button>
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
              <CardTitle>Historical Data (Mock Service)</CardTitle>
            </CardHeader>
            <CardContent>
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
