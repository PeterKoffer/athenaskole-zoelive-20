
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { Play, CheckCircle, XCircle, Clock, BookOpen, Target } from 'lucide-react';

interface TestResult {
  kcId: string;
  status: 'pending' | 'success' | 'error';
  atoms?: any[];
  error?: string;
  duration?: number;
  curriculumAligned?: boolean;
  expectedMatch?: string;
  actualMatch?: string;
}

interface CurriculumTestInterfaceProps {
  onBack: () => void;
}

const CurriculumTestInterface: React.FC<CurriculumTestInterfaceProps> = ({ onBack }) => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);

  const testCases = [
    {
      kcId: 'kc_math_g4_fraction_equivalence',
      description: 'Grade 4 Fraction Equivalence',
      expectedMatch: '4-nf-1 (Fraction equivalence)',
      expectation: 'Should match curriculum topic and generate aligned content'
    },
    {
      kcId: 'kc_math_g5_multiply_decimals',
      description: 'Grade 5 Multiply Decimals',
      expectedMatch: 'Fallback to original prompt',
      expectation: 'Should fall back to original prompt generator (no exact match)'
    },
    {
      kcId: 'kc_math_g4_area_rectangles',
      description: 'Grade 4 Area of Rectangles',
      expectedMatch: '4-md-3 (Area and perimeter)',
      expectation: 'Should match curriculum topic and generate aligned content'
    }
  ];

  const runSingleTest = async (testCase: typeof testCases[0]): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      console.log(`🧪 Running curriculum test for: ${testCase.kcId}`);
      
      const { data, error } = await supabase.functions.invoke('generate-content-atoms', {
        body: {
          kcId: testCase.kcId,
          userId: 'test-user-curriculum',
          contentTypes: ['TEXT_EXPLANATION', 'QUESTION_MULTIPLE_CHOICE'],
          maxAtoms: 2
        }
      });

      const duration = Date.now() - startTime;

      if (error) {
        console.error(`❌ Test failed for ${testCase.kcId}:`, error);
        return {
          kcId: testCase.kcId,
          status: 'error',
          error: error.message || 'Unknown error',
          duration,
          expectedMatch: testCase.expectedMatch
        };
      }

      if (data?.atoms && Array.isArray(data.atoms)) {
        console.log(`✅ Test successful for ${testCase.kcId}:`, data.atoms);
        
        // Check if content is curriculum-aligned
        const curriculumAligned = data.atoms.some((atom: any) => 
          atom.metadata?.curriculumAligned || 
          atom.metadata?.source === 'curriculum_enhanced_ai'
        );

        return {
          kcId: testCase.kcId,
          status: 'success',
          atoms: data.atoms,
          duration,
          curriculumAligned,
          expectedMatch: testCase.expectedMatch,
          actualMatch: curriculumAligned ? 'Curriculum Enhanced' : 'Standard Generation'
        };
      } else {
        return {
          kcId: testCase.kcId,
          status: 'error',
          error: 'No atoms generated',
          duration,
          expectedMatch: testCase.expectedMatch
        };
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`❌ Test exception for ${testCase.kcId}:`, error);
      
      return {
        kcId: testCase.kcId,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
        expectedMatch: testCase.expectedMatch
      };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    console.log('🚀 Starting Curriculum Integration Tests');
    
    for (const testCase of testCases) {
      setCurrentTest(testCase.kcId);
      console.log(`\n📝 Testing: ${testCase.description} (${testCase.kcId})`);
      
      const result = await runSingleTest(testCase);
      setTestResults(prev => [...prev, result]);
      
      // Small delay between tests to avoid overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setCurrentTest(null);
    setIsRunning(false);
    console.log('🏁 All curriculum tests completed');
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500 animate-spin" />;
    }
  };

  const getStatusBadge = (result: TestResult) => {
    if (result.status === 'success') {
      return (
        <Badge variant={result.curriculumAligned ? 'default' : 'secondary'}>
          {result.curriculumAligned ? 'Curriculum Enhanced' : 'Standard Generation'}
        </Badge>
      );
    }
    return <Badge variant="destructive">Failed</Badge>;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card className="bg-gradient-to-r from-blue-900 to-purple-900 border-blue-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-400" />
            Curriculum Integration Test Suite
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Button 
              onClick={onBack}
              variant="outline"
              className="text-white border-white"
            >
              Back to Practice
            </Button>
            <Button 
              onClick={runAllTests}
              disabled={isRunning}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isRunning ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Running Tests...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run All Tests
                </>
              )}
            </Button>
          </div>

          {isRunning && currentTest && (
            <div className="mb-4 p-3 bg-blue-900/30 rounded-lg border border-blue-700">
              <p className="text-blue-300">
                Currently testing: <span className="font-mono text-blue-200">{currentTest}</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Cases Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Test Cases Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {testCases.map((testCase, index) => (
              <div key={testCase.kcId} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">{testCase.description}</h4>
                    <p className="text-sm text-gray-600 font-mono">{testCase.kcId}</p>
                  </div>
                  <Badge variant="outline">Test {index + 1}</Badge>
                </div>
                <p className="text-sm text-gray-700 mb-2">{testCase.expectation}</p>
                <p className="text-xs text-blue-600">Expected: {testCase.expectedMatch}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testResults.map((result, index) => {
                const testCase = testCases.find(tc => tc.kcId === result.kcId);
                return (
                  <div key={result.kcId} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(result.status)}
                        <div>
                          <h4 className="font-semibold">{testCase?.description}</h4>
                          <p className="text-sm text-gray-600 font-mono">{result.kcId}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(result)}
                        {result.duration && (
                          <Badge variant="outline">{result.duration}ms</Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Expected:</p>
                        <p className="text-sm text-gray-600">{result.expectedMatch}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Actual:</p>
                        <p className="text-sm text-gray-600">{result.actualMatch || 'N/A'}</p>
                      </div>
                    </div>

                    {result.error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700">Error: {result.error}</p>
                      </div>
                    )}

                    {result.atoms && result.atoms.length > 0 && (
                      <div className="mt-4">
                        <Separator className="mb-3" />
                        <h5 className="font-medium mb-2">Generated Content ({result.atoms.length} atoms):</h5>
                        <div className="space-y-2">
                          {result.atoms.map((atom, atomIndex) => (
                            <div key={atomIndex} className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex justify-between items-start mb-2">
                                <Badge variant="outline">{atom.atom_type}</Badge>
                                {atom.metadata?.curriculumAligned && (
                                  <Badge className="bg-green-100 text-green-800">Curriculum Aligned</Badge>
                                )}
                              </div>
                              
                              {atom.content?.title && (
                                <p className="font-medium text-sm mb-1">{atom.content.title}</p>
                              )}
                              
                              {atom.content?.question && (
                                <p className="text-sm mb-1">Q: {atom.content.question.substring(0, 100)}...</p>
                              )}
                              
                              {atom.content?.explanation && (
                                <p className="text-xs text-gray-600">
                                  Explanation: {atom.content.explanation.substring(0, 150)}...
                                </p>
                              )}

                              {atom.metadata && (
                                <div className="mt-2 text-xs text-gray-500">
                                  Source: {atom.metadata.source || 'N/A'} | 
                                  Model: {atom.metadata.model || 'N/A'}
                                  {atom.metadata.mathTopic && ` | Topic: ${atom.metadata.mathTopic}`}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      {testResults.length === testCases.length && (
        <Card>
          <CardHeader>
            <CardTitle>Test Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {testResults.filter(r => r.status === 'success').length}
                </div>
                <p className="text-sm text-gray-600">Successful</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {testResults.filter(r => r.status === 'error').length}
                </div>
                <p className="text-sm text-gray-600">Failed</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {testResults.filter(r => r.curriculumAligned).length}
                </div>
                <p className="text-sm text-gray-600">Curriculum Enhanced</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CurriculumTestInterface;
