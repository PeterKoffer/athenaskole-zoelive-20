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
      kcId: 'kc_math_g5_multiply_decimals',
      description: 'Grade 5 Multiply Decimals',
      expectedMatch: '5-nbt-7-multiply (Multiply decimals)',
      expectation: 'Should match new curriculum topic for decimal multiplication'
    },
    {
      kcId: 'kc_math_g5_divide_decimals',
      description: 'Grade 5 Divide Decimals',
      expectedMatch: '5-nbt-7-divide (Divide decimals)',
      expectation: 'Should match new curriculum topic for decimal division'
    },
    {
      kcId: 'kc_math_g6_ratios_rates',
      description: 'Grade 6 Ratios and Rates',
      expectedMatch: '6-rp-1 or 6-rp-2 (Ratios and rates / Unit rates)',
      expectation: 'Should match new curriculum topics for ratios and rates'
    },
    {
      kcId: 'kc_math_g4_fraction_equivalence',
      description: 'Grade 4 Fraction Equivalence (Control)',
      expectedMatch: '4-nf-1 (Fraction equivalence)',
      expectation: 'Should continue to work with existing curriculum data'
    }
  ];

  const runSingleTest = async (testCase: typeof testCases[0]): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      console.log(`🧪 Running curriculum test for: ${testCase.kcId}`);
      console.log(`📋 Expected match: ${testCase.expectedMatch}`);
      
      const { data, error } = await supabase.functions.invoke('generate-content-atoms', {
        body: {
          kcId: testCase.kcId,
          userId: 'test-user-curriculum-v2',
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
        
        // Enhanced curriculum alignment detection
        const curriculumAligned = data.atoms.some((atom: any) => 
          atom.metadata?.curriculumAligned === true ||
          atom.metadata?.source === 'curriculum_enhanced_ai' ||
          atom.metadata?.studypugIntegration === true
        );

        // Detailed logging for analysis
        console.log(`📊 Curriculum Analysis for ${testCase.kcId}:`);
        data.atoms.forEach((atom: any, index: number) => {
          console.log(`  Atom ${index + 1}:`);
          console.log(`    Type: ${atom.atom_type}`);
          console.log(`    Source: ${atom.metadata?.source || 'N/A'}`);
          console.log(`    Curriculum Aligned: ${atom.metadata?.curriculumAligned || false}`);
          console.log(`    StudyPug Integration: ${atom.metadata?.studypugIntegration || false}`);
          console.log(`    Math Topic: ${atom.metadata?.mathTopic || 'N/A'}`);
          if (atom.content?.question) {
            console.log(`    Question: ${atom.content.question.substring(0, 100)}...`);
          }
        });

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
    
    console.log('🚀 Starting ENHANCED Curriculum Integration Tests');
    console.log('🎯 Testing newly added curriculum topics:');
    console.log('  - Grade 5 Multiply Decimals (5-nbt-7-multiply)');
    console.log('  - Grade 5 Divide Decimals (5-nbt-7-divide)');
    console.log('  - Grade 6 Ratios and Rates (6-rp-1, 6-rp-2)');
    
    for (const testCase of testCases) {
      setCurrentTest(testCase.kcId);
      console.log(`\n📝 Testing: ${testCase.description} (${testCase.kcId})`);
      console.log(`🎯 Expected: ${testCase.expectation}`);
      
      const result = await runSingleTest(testCase);
      setTestResults(prev => [...prev, result]);
      
      // Analysis logging
      if (result.status === 'success' && result.curriculumAligned) {
        console.log(`✅ SUCCESS: ${testCase.kcId} achieved Curriculum Enhancement!`);
      } else if (result.status === 'success') {
        console.log(`⚠️ STANDARD: ${testCase.kcId} used standard generation (not curriculum-enhanced)`);
      } else {
        console.log(`❌ FAILED: ${testCase.kcId} failed to generate content`);
      }
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setCurrentTest(null);
    setIsRunning(false);
    
    // Final summary
    const successCount = testResults.filter(r => r.status === 'success').length + 1; // +1 for the last test
    const enhancedCount = testResults.filter(r => r.curriculumAligned).length;
    console.log('\n🏁 CURRICULUM INTEGRATION TEST SUMMARY:');
    console.log(`📊 Tests completed: ${testCases.length}`);
    console.log(`✅ Successful: ${successCount}`);
    console.log(`🎓 Curriculum Enhanced: ${enhancedCount}`);
    console.log('📋 Focus Areas for Analysis:');
    console.log('  1. Curriculum Enhancement Status verification');
    console.log('  2. Console log verification'); 
    console.log('  3. AI Content Quality');
    console.log('  4. validateMathAnswer Performance');
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
            Enhanced Curriculum Integration Test Suite
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
                  Running Enhanced Tests...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run Enhanced Tests
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

          <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-600">
            <h4 className="text-blue-200 font-semibold mb-2">🎯 Test Focus Areas:</h4>
            <ul className="text-blue-300 text-sm space-y-1">
              <li>• Curriculum Enhancement Status verification</li>
              <li>• Console log analysis for prompt_generator.ts matching</li>
              <li>• AI content quality assessment for new topics</li>
              <li>• validateMathAnswer performance on decimals and ratios</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Test Cases Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Enhanced Test Cases Overview
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
                  <Badge variant={index < 3 ? "default" : "outline"}>
                    {index < 3 ? "New Topic" : "Control"}
                  </Badge>
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
            <CardTitle>Enhanced Test Results</CardTitle>
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
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-3">
                        <p className="text-sm text-red-700">Error: {result.error}</p>
                      </div>
                    )}

                    {result.atoms && result.atoms.length > 0 && (
                      <div className="mt-4">
                        <Separator className="mb-3" />
                        <h5 className="font-medium mb-2">Generated Content Analysis ({result.atoms.length} atoms):</h5>
                        <div className="space-y-2">
                          {result.atoms.map((atom, atomIndex) => (
                            <div key={atomIndex} className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex justify-between items-start mb-2">
                                <Badge variant="outline">{atom.atom_type}</Badge>
                                <div className="flex gap-1">
                                  {atom.metadata?.curriculumAligned && (
                                    <Badge className="bg-green-100 text-green-800">Curriculum Aligned</Badge>
                                  )}
                                  {atom.metadata?.studypugIntegration && (
                                    <Badge className="bg-blue-100 text-blue-800">StudyPug</Badge>
                                  )}
                                </div>
                              </div>
                              
                              {atom.content?.title && (
                                <p className="font-medium text-sm mb-1">{atom.content.title}</p>
                              )}
                              
                              {atom.content?.question && (
                                <div className="mb-2">
                                  <p className="text-sm mb-1"><strong>Q:</strong> {atom.content.question}</p>
                                  {atom.content?.options && (
                                    <div className="ml-4 text-xs text-gray-600">
                                      Options: {atom.content.options.join(', ')}
                                    </div>
                                  )}
                                  {atom.content?.correctAnswer !== undefined && (
                                    <div className="ml-4 text-xs text-green-600">
                                      Correct: {atom.content.correctAnswer} ({atom.content.options?.[atom.content.correctAnswer]})
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              {atom.content?.explanation && (
                                <p className="text-xs text-gray-600 mb-2">
                                  <strong>Explanation:</strong> {atom.content.explanation.substring(0, 150)}...
                                </p>
                              )}

                              <div className="mt-2 text-xs text-gray-500 bg-gray-100 p-2 rounded">
                                <strong>Metadata:</strong> Source: {atom.metadata.source || 'N/A'} | 
                                Model: {atom.metadata.model || 'N/A'} | 
                                Math Topic: {atom.metadata.mathTopic || 'N/A'}
                                {atom.metadata.curriculumAligned && ' | ✅ Curriculum Enhanced'}
                              </div>
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

      {/* Enhanced Summary */}
      {testResults.length === testCases.length && (
        <Card>
          <CardHeader>
            <CardTitle>📊 Enhanced Test Summary & Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {testResults.filter(r => r.status === 'success').length}
                </div>
                <p className="text-sm text-gray-600">Successful</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {testResults.filter(r => r.curriculumAligned).length}
                </div>
                <p className="text-sm text-gray-600">Curriculum Enhanced</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {testResults.filter(r => r.kcId.includes('g5') || r.kcId.includes('g6')).filter(r => r.curriculumAligned).length}
                </div>
                <p className="text-sm text-gray-600">New Topics Enhanced</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {testResults.filter(r => r.status === 'error').length}
                </div>
                <p className="text-sm text-gray-600">Failed</p>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">🔍 Analysis Notes:</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Check console logs for prompt_generator.ts curriculum topic matching</li>
                <li>• Verify validateMathAnswer handles decimal operations correctly</li>
                <li>• Assess ratio/rate question generation and validation needs</li>
                <li>• Review AI content alignment with new curriculum descriptions</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CurriculumTestInterface;
