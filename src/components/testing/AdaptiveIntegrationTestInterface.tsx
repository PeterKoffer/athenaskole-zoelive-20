
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Lightbulb, 
  RefreshCw, 
  Play, 
  Target,
  Database,
  Activity,
  TrendingUp,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { mockUserProgressService } from '@/services/mockUserProgressService';
import AdaptiveDifficultyEngine from '@/services/AdaptiveDifficultyEngine';
import { useAdaptiveLearningSession } from '@/hooks/useAdaptiveLearningSession';
import { LearningAtom, LearningAtomPerformance } from '@/types/learning';
import UniverseSessionManager from '@/services/UniverseSessionManager';
import InSessionAdaptiveManager from '@/services/InSessionAdaptiveManager';

const TEST_USER_ID = '62612ab6-0c5f-4713-b716-feee788c89d9';

// Test objectives with their expected behaviors
const TEST_OBJECTIVES = [
  { id: 'k-cc-1', title: 'Counting 1-10', expectedDifficulty: 'hard', reason: 'Completed easily (success rate: 1.0)' },
  { id: 'k-cc-2', title: 'Counting 11-20', expectedDifficulty: 'easy', reason: 'Multiple failures (success rate: 0.25)' },
  { id: 'k-cc-3', title: 'Skip Counting', expectedDifficulty: 'medium', reason: 'Moderate performance (success rate: 0.67)' },
  { id: 'dk-math-basic-arithmetic', title: 'Basic Arithmetic', expectedDifficulty: 'medium', reason: 'Good after initial struggle' },
  { id: '1-oa-1', title: 'Addition Problems', expectedDifficulty: 'medium', reason: 'No history, default' },
  { id: '1-oa-2', title: 'Subtraction Problems', expectedDifficulty: 'medium', reason: 'One successful attempt' }
];

// Performance simulation presets
const PERFORMANCE_PRESETS = {
  struggling: {
    name: 'Struggling Student',
    responseTime: 120,
    hintsUsed: 3,
    isCorrect: false,
    icon: AlertTriangle,
    color: 'text-red-400'
  },
  moderate: {
    name: 'Moderate Performance',
    responseTime: 45,
    hintsUsed: 1,
    isCorrect: true,
    icon: TrendingUp,
    color: 'text-yellow-400'
  },
  quickSuccess: {
    name: 'Quick Success',
    responseTime: 15,
    hintsUsed: 0,
    isCorrect: true,
    icon: Zap,
    color: 'text-green-400'
  }
};

interface TestResult {
  id: string;
  type: string;
  status: 'pass' | 'fail' | 'running';
  message: string;
  details?: any;
  timestamp: string;
}

const AdaptiveIntegrationTestInterface: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [historicalData, setHistoricalData] = useState<any>(null);
  const [selectedObjective, setSelectedObjective] = useState<string>('');
  const [currentAtom, setCurrentAtom] = useState<LearningAtom | null>(null);
  const [isRunningFullLoop, setIsRunningFullLoop] = useState(false);
  
  // Simulation controls
  const [simulationSettings, setSimulationSettings] = useState({
    responseTime: 45,
    hintsUsed: 1,
    isCorrect: true
  });

  const addTestResult = (type: string, status: 'pass' | 'fail' | 'running', message: string, details?: any) => {
    const result: TestResult = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      status,
      message,
      details,
      timestamp: new Date().toISOString()
    };
    
    setTestResults(prev => [result, ...prev.slice(0, 19)]); // Keep last 20 results
    return result.id;
  };

  const updateTestResult = (id: string, status: 'pass' | 'fail', message: string, details?: any) => {
    setTestResults(prev => prev.map(result => 
      result.id === id ? { ...result, status, message, details } : result
    ));
  };

  const loadHistoricalData = async () => {
    console.log('[Test] Loading historical data for test user:', TEST_USER_ID);
    try {
      const userProgress = await mockUserProgressService.getUserProgress(TEST_USER_ID);
      const historicalObjectives: any = {};
      
      for (const stepProgress of userProgress) {
        Object.assign(historicalObjectives, stepProgress.curriculumProgress);
      }
      
      console.log('[Test] Loaded historical data for test user', TEST_USER_ID + ':', historicalObjectives);
      setHistoricalData(historicalObjectives);
      
      addTestResult('Historical Data', 'pass', `Loaded ${Object.keys(historicalObjectives).length} historical objectives`);
    } catch (error) {
      console.error('[Test] Error loading historical data:', error);
      addTestResult('Historical Data', 'fail', 'Failed to load historical data');
    }
  };

  const testDifficultySuggestions = async () => {
    const testId = addTestResult('Difficulty Suggestions', 'running', 'Testing difficulty suggestions for all objectives...');
    
    try {
      let allPassed = true;
      const results: any[] = [];
      
      for (const objective of TEST_OBJECTIVES) {
        console.log(`[Test] Testing difficulty suggestion for ${objective.id}`);
        
        const suggestedDifficulty = await AdaptiveDifficultyEngine.suggestInitialDifficulty(
          TEST_USER_ID,
          objective.id,
          'mathematics'
        );
        
        const passed = suggestedDifficulty === objective.expectedDifficulty;
        if (!passed) allPassed = false;
        
        results.push({
          objectiveId: objective.id,
          title: objective.title,
          expected: objective.expectedDifficulty,
          actual: suggestedDifficulty,
          passed,
          reason: objective.reason
        });
        
        console.log(`[Test] ${objective.id}: Expected ${objective.expectedDifficulty}, Got ${suggestedDifficulty} - ${passed ? 'PASS' : 'FAIL'}`);
      }
      
      updateTestResult(
        testId, 
        allPassed ? 'pass' : 'fail',
        `Difficulty suggestions: ${results.filter(r => r.passed).length}/${results.length} passed`,
        results
      );
    } catch (error) {
      console.error('[Test] Error testing difficulty suggestions:', error);
      updateTestResult(testId, 'fail', 'Error testing difficulty suggestions');
    }
  };

  const startFullLoopTest = async () => {
    if (!selectedObjective) {
      addTestResult('Full Loop Test', 'fail', 'Please select an objective first');
      return;
    }

    setIsRunningFullLoop(true);
    const testId = addTestResult('Full Loop Test', 'running', `Starting full loop test for ${selectedObjective}...`);

    try {
      console.log(`[Test] Starting full loop test for objective: ${selectedObjective}`);
      
      // Step 1: Get initial difficulty suggestion
      const initialDifficulty = await AdaptiveDifficultyEngine.suggestInitialDifficulty(
        TEST_USER_ID,
        selectedObjective,
        'mathematics'
      );
      
      console.log(`[Test] Initial difficulty suggestion for ${selectedObjective}: ${initialDifficulty}`);
      
      // Step 2: Create a test atom
      const testAtom: LearningAtom = {
        id: `test-atom-${selectedObjective}-${Date.now()}`,
        curriculumObjectiveId: selectedObjective,
        curriculumObjectiveTitle: TEST_OBJECTIVES.find(obj => obj.id === selectedObjective)?.title || selectedObjective,
        subject: 'mathematics',
        difficulty: initialDifficulty,
        atomType: 'multiple-choice',
        content: {
          question: `Test question for ${selectedObjective}`,
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: 0,
          explanation: 'This is a test explanation',
          data: {}
        },
        estimatedDuration: 60,
        isCompleted: false
      };
      
      setCurrentAtom(testAtom);
      
      // Step 3: Start InSessionAdaptiveManager session
      InSessionAdaptiveManager.startAtomSession(testAtom.id);
      console.log(`[Test] Started InSessionAdaptiveManager session for atom: ${testAtom.id}`);
      
      updateTestResult(testId, 'pass', `Full loop test ready for ${selectedObjective} at ${initialDifficulty} difficulty`);
      
    } catch (error) {
      console.error('[Test] Error starting full loop test:', error);
      updateTestResult(testId, 'fail', 'Error starting full loop test');
      setIsRunningFullLoop(false);
    }
  };

  const simulateUserResponse = () => {
    if (!currentAtom) {
      addTestResult('Simulation', 'fail', 'No active atom to simulate response for');
      return;
    }

    const testId = addTestResult('Simulation', 'running', 'Simulating user response...');
    
    try {
      console.log('[Test] Simulating user response with settings:', simulationSettings);
      
      // Record interaction with InSessionAdaptiveManager
      InSessionAdaptiveManager.recordAtomInteraction(
        currentAtom.id,
        simulationSettings.isCorrect,
        simulationSettings.responseTime,
        simulationSettings.hintsUsed
      );
      
      console.log(`[Test] Recorded interaction for ${currentAtom.id}: correct=${simulationSettings.isCorrect}, time=${simulationSettings.responseTime}s, hints=${simulationSettings.hintsUsed}`);
      
      // Check for adaptation suggestions
      const adaptationCheck = InSessionAdaptiveManager.shouldAdaptAtomDifficulty(currentAtom.id);
      console.log('[Test] Adaptation check result:', adaptationCheck);
      
      let message = `Response simulated: ${simulationSettings.isCorrect ? 'Correct' : 'Incorrect'}, ${simulationSettings.responseTime}s, ${simulationSettings.hintsUsed} hints`;
      
      if (adaptationCheck.shouldAdapt) {
        message += ` | ADAPTATION TRIGGERED: ${adaptationCheck.reason} → ${adaptationCheck.newDifficulty}`;
        
        // Generate adapted atom
        if (adaptationCheck.newDifficulty && adaptationCheck.contentModifications) {
          const adaptedAtom = InSessionAdaptiveManager.generateAdaptiveAtomVariant(
            currentAtom,
            adaptationCheck.newDifficulty,
            adaptationCheck.contentModifications
          );
          setCurrentAtom(adaptedAtom);
          console.log('[Test] Generated adapted atom:', adaptedAtom.id);
        }
      }
      
      updateTestResult(testId, 'pass', message);
      
    } catch (error) {
      console.error('[Test] Error simulating response:', error);
      updateTestResult(testId, 'fail', 'Error simulating response');
    }
  };

  const completeAndTestPersistence = async () => {
    if (!currentAtom) {
      addTestResult('Persistence Test', 'fail', 'No active atom to complete');
      return;
    }

    const testId = addTestResult('Persistence Test', 'running', 'Completing atom and testing persistence...');
    
    try {
      console.log('[Test] Completing atom and testing persistence for:', currentAtom.id);
      
      // End InSessionAdaptiveManager session
      const performance = InSessionAdaptiveManager.endAtomSession(currentAtom.id);
      console.log('[Test] Final performance from InSessionAdaptiveManager:', performance);
      
      if (performance) {
        // Record with UniverseSessionManager
        UniverseSessionManager.recordAtomPerformance(currentAtom.id, performance);
        console.log('[Test] Recorded performance with UniverseSessionManager');
        
        // Test persistence by getting updated difficulty suggestion
        const updatedDifficulty = await AdaptiveDifficultyEngine.suggestInitialDifficulty(
          TEST_USER_ID,
          currentAtom.curriculumObjectiveId,
          'mathematics'
        );
        
        console.log(`[Test] Updated difficulty suggestion for ${currentAtom.curriculumObjectiveId}: ${updatedDifficulty}`);
        
        updateTestResult(testId, 'pass', `Atom completed and persisted. Updated difficulty: ${updatedDifficulty}`, {
          performance,
          updatedDifficulty
        });
      } else {
        updateTestResult(testId, 'fail', 'No performance data returned from session');
      }
      
      // Reset for next test
      setCurrentAtom(null);
      setIsRunningFullLoop(false);
      await loadHistoricalData(); // Refresh historical data
      
    } catch (error) {
      console.error('[Test] Error completing and testing persistence:', error);
      updateTestResult(testId, 'fail', 'Error completing and testing persistence');
    }
  };

  const runAllTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);
    
    await loadHistoricalData();
    await testDifficultySuggestions();
    
    setIsRunningTests(false);
  };

  const applyPreset = (presetKey: keyof typeof PERFORMANCE_PRESETS) => {
    const preset = PERFORMANCE_PRESETS[presetKey];
    setSimulationSettings({
      responseTime: preset.responseTime,
      hintsUsed: preset.hintsUsed,
      isCorrect: preset.isCorrect
    });
  };

  useEffect(() => {
    loadHistoricalData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="bg-gray-700">
            <CardTitle className="flex items-center gap-2 text-white">
              <Brain className="w-6 h-6 text-blue-400" />
              Adaptive Learning Integration Test Suite
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-gray-800 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-700 rounded-lg">
              <div>
                <Label className="text-gray-300">Test User ID:</Label>
                <p className="text-sm font-mono text-blue-300">{TEST_USER_ID}</p>
              </div>
              <div>
                <Label className="text-gray-300">Auth User:</Label>
                <p className="text-sm text-gray-400">Not logged in</p>
              </div>
              <div>
                <Label className="text-gray-300">Historical Objectives:</Label>
                <p className="text-sm text-green-400">{historicalData ? Object.keys(historicalData).length : 'Loading...'}</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button 
                onClick={runAllTests} 
                disabled={isRunningTests}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isRunningTests && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
                Run All Tests
              </Button>
              <Button 
                variant="outline" 
                onClick={loadHistoricalData}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Database className="w-4 h-4 mr-2" />
                Refresh Historical Data
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="results" className="space-y-6">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="results" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">Test Results</TabsTrigger>
            <TabsTrigger value="session" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">Active Session</TabsTrigger>
            <TabsTrigger value="historical" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">Historical Data</TabsTrigger>
          </TabsList>

          <TabsContent value="results">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="bg-gray-700">
                <CardTitle className="text-white">Test Results ({testResults.length})</CardTitle>
              </CardHeader>
              <CardContent className="bg-gray-800 space-y-3 max-h-96 overflow-y-auto">
                {testResults.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No test results yet. Run some tests to see results here.</p>
                  </div>
                ) : (
                  testResults.map((result) => (
                    <div key={result.id} className="border border-gray-700 rounded-lg p-4 bg-gray-750">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {result.status === 'pass' && <CheckCircle className="w-5 h-5 text-green-400" />}
                          {result.status === 'fail' && <XCircle className="w-5 h-5 text-red-400" />}
                          {result.status === 'running' && <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />}
                          <Badge 
                            variant={result.status === 'pass' ? 'default' : result.status === 'fail' ? 'destructive' : 'secondary'}
                            className={
                              result.status === 'pass' ? 'bg-green-900 text-green-300' :
                              result.status === 'fail' ? 'bg-red-900 text-red-300' :
                              'bg-blue-900 text-blue-300'
                            }
                          >
                            {result.status.toUpperCase()}
                          </Badge>
                          <span className="font-medium text-white">{result.type}</span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(result.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-2">{result.message}</p>
                      {result.details && (
                        <details className="text-xs text-gray-400">
                          <summary className="cursor-pointer hover:text-gray-300">Show details</summary>
                          <pre className="mt-2 p-2 bg-gray-900 rounded overflow-x-auto">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="session">
            <div className="space-y-6">
              {/* Objective Selection */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="bg-gray-700">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Target className="w-5 h-5 text-purple-400" />
                    Full Loop Test Setup
                  </CardTitle>
                </CardHeader>
                <CardContent className="bg-gray-800 space-y-4">
                  <div>
                    <Label className="text-gray-300">Select Objective for Testing:</Label>
                    <Select value={selectedObjective} onValueChange={setSelectedObjective}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Choose an objective to test..." />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        {TEST_OBJECTIVES.map(obj => (
                          <SelectItem key={obj.id} value={obj.id} className="text-white hover:bg-gray-600">
                            <div>
                              <div className="font-medium">{obj.title} ({obj.id})</div>
                              <div className="text-xs text-gray-400">Expected: {obj.expectedDifficulty} - {obj.reason}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    onClick={startFullLoopTest} 
                    disabled={!selectedObjective || isRunningFullLoop}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Full Loop Test
                  </Button>
                </CardContent>
              </Card>

              {/* Active Session */}
              {currentAtom && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="bg-gray-700">
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Activity className="w-5 h-5 text-green-400" />
                      Active Learning Atom
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="bg-gray-800 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Atom ID:</Label>
                        <p className="text-sm font-mono text-blue-300">{currentAtom.id}</p>
                      </div>
                      <div>
                        <Label className="text-gray-300">Difficulty:</Label>
                        <Badge className="ml-2 bg-orange-900 text-orange-300">{currentAtom.difficulty.toUpperCase()}</Badge>
                      </div>
                      <div>
                        <Label className="text-gray-300">Objective:</Label>
                        <p className="text-sm text-gray-300">{currentAtom.curriculumObjectiveTitle}</p>
                      </div>
                      <div>
                        <Label className="text-gray-300">Subject:</Label>
                        <p className="text-sm text-gray-300">{currentAtom.subject}</p>
                      </div>
                    </div>

                    <Separator className="bg-gray-600" />

                    {/* Performance Simulation Controls */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-white">Simulation Controls</h4>
                      
                      {/* Presets */}
                      <div className="flex gap-2 flex-wrap">
                        {Object.entries(PERFORMANCE_PRESETS).map(([key, preset]) => {
                          const Icon = preset.icon;
                          return (
                            <Button
                              key={key}
                              variant="outline"
                              size="sm"
                              onClick={() => applyPreset(key as keyof typeof PERFORMANCE_PRESETS)}
                              className={`border-gray-600 hover:bg-gray-700 ${preset.color}`}
                            >
                              <Icon className="w-4 h-4 mr-2" />
                              {preset.name}
                            </Button>
                          );
                        })}
                      </div>

                      {/* Manual Controls */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-gray-300">Response Time (seconds)</Label>
                          <Input
                            type="number"
                            value={simulationSettings.responseTime}
                            onChange={(e) => setSimulationSettings(prev => ({
                              ...prev,
                              responseTime: parseInt(e.target.value) || 0
                            }))}
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300">Hints Used</Label>
                          <Input
                            type="number"
                            value={simulationSettings.hintsUsed}
                            onChange={(e) => setSimulationSettings(prev => ({
                              ...prev,
                              hintsUsed: parseInt(e.target.value) || 0
                            }))}
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300">Correctness</Label>
                          <Select 
                            value={simulationSettings.isCorrect.toString()} 
                            onValueChange={(value) => setSimulationSettings(prev => ({
                              ...prev,
                              isCorrect: value === 'true'
                            }))}
                          >
                            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700 border-gray-600">
                              <SelectItem value="true" className="text-white hover:bg-gray-600">Correct</SelectItem>
                              <SelectItem value="false" className="text-white hover:bg-gray-600">Incorrect</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Button onClick={simulateUserResponse} className="bg-green-600 hover:bg-green-700">
                          <Activity className="w-4 h-4 mr-2" />
                          Simulate Response
                        </Button>
                        <Button onClick={completeAndTestPersistence} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Complete & Test Persistence
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="historical">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="bg-gray-700">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Database className="w-5 h-5 text-indigo-400" />
                  Historical Performance Data
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-gray-800">
                {historicalData ? (
                  <div className="space-y-4">
                    {Object.entries(historicalData).map(([objectiveId, data]: [string, any]) => (
                      <div key={objectiveId} className="border border-gray-700 rounded-lg p-4 bg-gray-750">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-white">{objectiveId}</h4>
                          <Badge 
                            variant={data.isCompleted ? 'default' : 'secondary'}
                            className={data.isCompleted ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'}
                          >
                            {data.isCompleted ? 'Completed' : 'In Progress'}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <Label className="text-gray-400">Success Rate</Label>
                            <p className="text-white">{((data.successRate || 0) * 100).toFixed(1)}%</p>
                          </div>
                          <div>
                            <Label className="text-gray-400">Attempts</Label>
                            <p className="text-white">{data.totalAttempts}</p>
                          </div>
                          <div>
                            <Label className="text-gray-400">Avg Time</Label>
                            <p className="text-white">{data.avgTimeSpentSeconds || 0}s</p>
                          </div>
                          <div>
                            <Label className="text-gray-400">Last Attempt</Label>
                            <p className="text-white">
                              {data.lastAttemptPerformance?.success ? 
                                <CheckCircle className="w-4 h-4 inline text-green-400" /> : 
                                <XCircle className="w-4 h-4 inline text-red-400" />
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Loading historical data...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdaptiveIntegrationTestInterface;
