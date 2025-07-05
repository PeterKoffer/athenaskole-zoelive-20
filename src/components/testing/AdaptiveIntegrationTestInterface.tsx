
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Play, RotateCcw, Zap, Target, TrendingUp, TrendingDown, CheckCircle, XCircle, Clock, HelpCircle } from 'lucide-react';
import { LearningAtom, LearningAtomPerformance } from '@/types/learning';
import { mockUserProgressService } from '@/services/mockUserProgressService';

const AdaptiveIntegrationTestInterface: React.FC = () => {
  // Test Configuration State
  const [selectedObjective, setSelectedObjective] = useState<string>('k-cc-2');
  const [responseTime, setResponseTime] = useState<number[]>([3]);
  const [hintsUsed, setHintsUsed] = useState<number[]>([1]);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('struggling');
  
  // Session State
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [sessionResults, setSessionResults] = useState<any[]>([]);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  
  // Test Data
  const testObjectives = [
    { id: 'k-cc-1', label: 'Count to 100 by ones', status: 'completed' },
    { id: 'k-cc-2', label: 'Count forward from number', status: 'struggling' },
    { id: 'k-cc-3', label: 'Write numbers 0-20', status: 'moderate' },
    { id: 'dk-math-basic-arithmetic', label: 'Basic Arithmetic', status: 'mastered' }
  ];

  const presets = {
    struggling: { responseTime: [8], hintsUsed: [2], isCorrect: false },
    moderate: { responseTime: [5], hintsUsed: [1], isCorrect: true },
    mastering: { responseTime: [2], hintsUsed: [0], isCorrect: true },
    inconsistent: { responseTime: [6], hintsUsed: [1], isCorrect: false }
  };

  const testSteps = [
    'Initialize Session',
    'Load Historical Data', 
    'Calculate Initial Difficulty',
    'Generate Content',
    'Simulate User Response',
    'Process Performance',
    'Update Progress',
    'Adapt for Next Round'
  ];

  // Preset Application
  const applyPreset = (presetName: string) => {
    const preset = presets[presetName as keyof typeof presets];
    if (preset) {
      setResponseTime(preset.responseTime);
      setHintsUsed(preset.hintsUsed);
      setIsCorrect(preset.isCorrect);
    }
  };

  useEffect(() => {
    if (selectedPreset !== 'custom') {
      applyPreset(selectedPreset);
    }
  }, [selectedPreset]);

  // Console Logging Simulation
  const addConsoleLog = (message: string, type: 'info' | 'warn' | 'error' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
    setConsoleOutput(prev => [...prev.slice(-20), logEntry]); // Keep last 20 logs
  };

  // Mock Content Generation
  const generateMockContent = (objective: string, difficulty: number) => {
    const questions = {
      'k-cc-2': {
        easy: 'Count from 5: 5, 6, ?, ?',
        medium: 'Count from 23: 23, 24, ?, ?, ?',
        hard: 'Count from 47: 47, 48, ?, ?, ?, ?'
      },
      'k-cc-3': {
        easy: 'Write the number: three',
        medium: 'Write these numbers: 12, 15, 18',
        hard: 'Write numbers 16-20 in order'
      }
    };

    const difficultyLabel = difficulty <= 3 ? 'easy' : difficulty <= 6 ? 'medium' : 'hard';
    const objectiveQuestions = questions[objective as keyof typeof questions] || questions['k-cc-2'];
    const questionText = objectiveQuestions[difficultyLabel as keyof typeof objectiveQuestions] || objectiveQuestions.medium;

    return {
      title: `${objective.toUpperCase()} Practice`,
      description: `Difficulty Level ${difficulty}`,
      data: {
        question: questionText,
        options: ['A', 'B', 'C', 'D'],
        correct: 0,
        explanation: 'This is a practice question for counting skills.'
      }
    };
  };

  // Main Test Execution
  const runFullAdaptiveLoop = async () => {
    setIsRunning(true);
    setCurrentStep(0);
    setSessionResults([]);
    setConsoleOutput([]);

    const userId = '62612ab6-0c5f-4713-b716-feee788c89d9';
    const stepId = '1';

    try {
      // Step 1: Initialize Session
      addConsoleLog('🚀 Initializing Adaptive Learning Session');
      setCurrentStep(1);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 2: Load Historical Data
      addConsoleLog('📊 Loading Historical Performance Data');
      setCurrentStep(2);
      const historicalProgress = await mockUserProgressService.getObjectiveProgress(userId, selectedObjective);
      addConsoleLog(`Historical Data: ${JSON.stringify(historicalProgress)}`);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 3: Calculate Initial Difficulty
      addConsoleLog('🎯 Calculating Initial Difficulty');
      setCurrentStep(3);
      let initialDifficulty = 5; // Default medium
      
      if (historicalProgress) {
        if (historicalProgress.successRate && historicalProgress.successRate > 0.8) {
          initialDifficulty = 7; // Hard
          addConsoleLog('High success rate detected - suggesting HARD difficulty');
        } else if (historicalProgress.successRate && historicalProgress.successRate < 0.4) {
          initialDifficulty = 3; // Easy  
          addConsoleLog('Low success rate detected - suggesting EASY difficulty');
        } else {
          initialDifficulty = 5; // Medium
          addConsoleLog('Moderate performance - suggesting MEDIUM difficulty');
        }
      } else {
        addConsoleLog('No historical data - defaulting to MEDIUM difficulty');
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 4: Generate Content
      addConsoleLog('🎨 Generating Adaptive Content');
      setCurrentStep(4);
      const generatedContent = generateMockContent(selectedObjective, initialDifficulty);
      addConsoleLog(`Generated Content: ${generatedContent.title}`);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 5: Simulate User Response
      addConsoleLog('👤 Simulating User Response');
      setCurrentStep(5);
      const simulatedPerformance: LearningAtomPerformance = {
        attempts: 1,
        timeTakenSeconds: responseTime[0],
        hintsUsed: hintsUsed[0],
        success: isCorrect,
        firstAttemptSuccess: isCorrect,
        timestamp: new Date().toISOString()
      };
      addConsoleLog(`User Performance: ${JSON.stringify(simulatedPerformance)}`);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 6: Process Performance  
      addConsoleLog('⚡ Processing Performance Data');
      setCurrentStep(6);
      await mockUserProgressService.recordObjectiveAttempt(
        userId,
        stepId, 
        selectedObjective,
        simulatedPerformance
      );
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 7: Update Progress
      addConsoleLog('📈 Updating Student Progress');
      setCurrentStep(7);
      const updatedProgress = await mockUserProgressService.getObjectiveProgress(userId, selectedObjective);
      addConsoleLog(`Updated Progress: ${JSON.stringify(updatedProgress)}`);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 8: Adapt for Next Round
      addConsoleLog('🔄 Calculating Next Difficulty Level');
      setCurrentStep(8);
      let nextDifficulty = initialDifficulty;
      
      if (updatedProgress) {
        if (simulatedPerformance.success && simulatedPerformance.timeTakenSeconds < 4 && simulatedPerformance.hintsUsed === 0) {
          nextDifficulty = Math.min(initialDifficulty + 2, 10);
          addConsoleLog(`Excellent performance - increasing difficulty to ${nextDifficulty}`);
        } else if (!simulatedPerformance.success || simulatedPerformance.hintsUsed > 1) {
          nextDifficulty = Math.max(initialDifficulty - 1, 1);
          addConsoleLog(`Struggled with content - decreasing difficulty to ${nextDifficulty}`);
        } else {
          nextDifficulty = initialDifficulty;
          addConsoleLog(`Adequate performance - maintaining difficulty at ${nextDifficulty}`);
        }
      }

      // Store Results
      const result = {
        objective: selectedObjective,
        initialDifficulty,
        nextDifficulty,
        performance: simulatedPerformance,
        historicalData: historicalProgress,
        updatedData: updatedProgress,
        generatedContent
      };
      
      setSessionResults([result]);
      addConsoleLog('✅ Full Adaptive Loop Completed Successfully');

    } catch (error) {
      addConsoleLog(`❌ Error in Adaptive Loop: ${error}`, 'error');
    }

    setIsRunning(false);
    setCurrentStep(0);
  };

  const resetTest = () => {
    setSessionResults([]);
    setConsoleOutput([]);
    setCurrentStep(0);
    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'struggling': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'moderate': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'mastered': return <TrendingUp className="w-4 h-4 text-blue-500" />;
      default: return <HelpCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl text-cyan-400 flex items-center gap-2">
              <Target className="w-6 h-6" />
              Adaptive Learning Integration Test
            </CardTitle>
            <p className="text-gray-300">
              Test the complete adaptive learning loop with realistic student scenarios
            </p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Configuration Panel */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg text-blue-400">Test Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Objective Selection */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Learning Objective
                </label>
                <Select value={selectedObjective} onValueChange={setSelectedObjective}>
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    {testObjectives.map(obj => (
                      <SelectItem key={obj.id} value={obj.id} className="text-white">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(obj.status)}
                          <span>{obj.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator className="bg-gray-600" />

              {/* Student Behavior Presets */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Student Behavior Preset
                </label>
                <Select value={selectedPreset} onValueChange={setSelectedPreset}>
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="struggling" className="text-white">🟥 Struggling Student</SelectItem>
                    <SelectItem value="moderate" className="text-white">🟨 Moderate Student</SelectItem>
                    <SelectItem value="mastering" className="text-white">🟩 Mastering Student</SelectItem>
                    <SelectItem value="inconsistent" className="text-white">🟪 Inconsistent Student</SelectItem>
                    <SelectItem value="custom" className="text-white">⚙️ Custom Settings</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Detailed Controls */}
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">
                    Response Time: {responseTime[0]}s
                  </label>
                  <Slider
                    value={responseTime}
                    onValueChange={setResponseTime}
                    max={15}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-300 mb-1 block">
                    Hints Used: {hintsUsed[0]}
                  </label>
                  <Slider
                    value={hintsUsed}
                    onValueChange={setHintsUsed}
                    max={3}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-300">
                    Answer Correctness
                  </label>
                  <Switch
                    checked={isCorrect}
                    onCheckedChange={setIsCorrect}
                  />
                </div>
              </div>

              <Separator className="bg-gray-600" />

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button 
                  onClick={runFullAdaptiveLoop}
                  disabled={isRunning}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isRunning ? (
                    <>
                      <Zap className="w-4 h-4 mr-2 animate-pulse" />
                      Running Test...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Run Full Loop Test
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={resetTest}
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Test
                </Button>
              </div>

            </CardContent>
          </Card>

          {/* Progress & Results */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Progress Tracker */}
            {isRunning && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg text-green-400">Test Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {testSteps.map((step, index) => (
                      <div 
                        key={index}
                        className={`flex items-center gap-3 p-2 rounded ${
                          index < currentStep ? 'bg-green-900/30 text-green-300' :
                          index === currentStep ? 'bg-blue-900/30 text-blue-300' :
                          'bg-gray-700/30 text-gray-500'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs ${
                          index < currentStep ? 'border-green-500 bg-green-500' :
                          index === currentStep ? 'border-blue-500 bg-blue-500' :
                          'border-gray-500'
                        }`}>
                          {index < currentStep ? '✓' : index + 1}
                        </div>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results Display */}
            {sessionResults.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg text-purple-400">Test Results</CardTitle>
                </CardHeader>
                <CardContent>
                  {sessionResults.map((result, index) => (
                    <div key={index} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-700 p-3 rounded">
                          <h4 className="text-cyan-300 font-medium mb-2">Difficulty Progression</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                              Initial: {result.initialDifficulty}
                            </Badge>
                            <span className="text-gray-400">→</span>
                            <Badge variant="outline" className="text-green-400 border-green-400">
                              Next: {result.nextDifficulty}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="bg-gray-700 p-3 rounded">
                          <h4 className="text-cyan-300 font-medium mb-2">Performance</h4>
                          <div className="space-y-1 text-sm">
                            <div>Success: {result.performance.success ? '✅' : '❌'}</div>
                            <div>Time: {result.performance.timeTakenSeconds}s</div>
                            <div>Hints: {result.performance.hintsUsed}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-700 p-3 rounded">
                        <h4 className="text-cyan-300 font-medium mb-2">Generated Content</h4>
                        <div className="text-sm text-gray-300">
                          <div><strong>Title:</strong> {result.generatedContent.title}</div>
                          <div><strong>Question:</strong> {result.generatedContent.data.question}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Console Output */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-orange-400">Console Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-black p-4 rounded font-mono text-sm max-h-64 overflow-y-auto">
                  {consoleOutput.length === 0 ? (
                    <div className="text-gray-500">No logs yet. Run a test to see console output...</div>
                  ) : (
                    consoleOutput.map((log, index) => (
                      <div key={index} className="text-green-400">
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdaptiveIntegrationTestInterface;
