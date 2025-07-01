
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { Play, CheckCircle, XCircle, Clock, BookOpen, Target, Eye } from 'lucide-react';

interface TestResult {
  kcId: string;
  status: 'pending' | 'success' | 'error';
  atoms?: any[];
  error?: string;
  duration?: number;
  promptLogs?: string[];
  validationLogs?: string[];
  fallbackTest?: boolean;
}

interface Grade3FractionTestInterfaceProps {
  onBack: () => void;
}

const Grade3FractionTestInterface: React.FC<Grade3FractionTestInterfaceProps> = ({ onBack }) => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);

  const grade3FractionTestCases = [
    {
      kcId: 'kc_math_g3_nf_1',
      description: 'Grade 3 - Understand fractions as numbers (3.NF.A.1)',
      focus: 'Unit fractions (1/b) and partitioning concepts',
      expectedQuestions: 'Visual fraction identification, parts of wholes, unit fraction definitions'
    },
    {
      kcId: 'kc_math_g3_understand_fractions',
      description: 'Grade 3 - Understanding Fractions (Alternative KC)',
      focus: 'Conceptual understanding of fractions',
      expectedQuestions: 'Fraction concepts, visual representations, basic fraction vocabulary'
    },
    {
      kcId: 'kc_math_g3_fractions_parts_whole',
      description: 'Grade 3 - Fractions as Parts of Whole',
      focus: 'Visual fraction representation',
      expectedQuestions: 'Identifying fractions from visual models, shaded parts'
    }
  ];

  const runSingleTest = async (testCase: typeof grade3FractionTestCases[0], testFallback = false): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      console.log(`🧪 Testing Grade 3 Fractions: ${testCase.kcId}`);
      console.log(`📋 Focus: ${testCase.focus}`);
      console.log(`🎯 Expected: ${testCase.expectedQuestions}`);
      
      if (testFallback) {
        console.log('🔄 FALLBACK TEST MODE - Testing fallback generation');
      }

      const { data, error } = await supabase.functions.invoke('generate-content-atoms', {
        body: {
          kcId: testCase.kcId,
          userId: 'test-user-grade3-fractions',
          subject: 'mathematics',
          gradeLevel: 'g3',
          topic: 'fractions understanding',
          contentTypes: ['TEXT_EXPLANATION', 'QUESTION_MULTIPLE_CHOICE'],
          maxAtoms: 3,
          diversityPrompt: 'Create Grade 3 appropriate fraction questions focusing on conceptual understanding',
          sessionId: `grade3_fractions_${Date.now()}`,
          forceUnique: true,
          testMode: testFallback ? 'fallback' : 'ai_generation'
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
          fallbackTest: testFallback
        };
      }

      if (data?.atoms && Array.isArray(data.atoms)) {
        console.log(`✅ Test successful for ${testCase.kcId}:`, data.atoms);
        
        // Analyze content for Grade 3 appropriateness
        console.log(`📊 Grade 3 Fraction Content Analysis for ${testCase.kcId}:`);
        data.atoms.forEach((atom: any, index: number) => {
          console.log(`  Atom ${index + 1}:`);
          console.log(`    Type: ${atom.atom_type}`);
          console.log(`    Source: ${atom.metadata?.source || 'N/A'}`);
          console.log(`    Math Topic: ${atom.metadata?.mathTopic || 'N/A'}`);
          
          if (atom.content?.question) {
            console.log(`    Question: ${atom.content.question}`);
            console.log(`    Grade Level Check: ${this.analyzeGradeLevel(atom.content.question)}`);
            console.log(`    Conceptual Focus: ${this.analyzeConceptualFocus(atom.content.question)}`);
            
            if (atom.content?.options) {
              console.log(`    Options: ${atom.content.options.join(', ')}`);
              console.log(`    Correct Answer: ${atom.content.correctAnswer} (${atom.content.options[atom.content.correctAnswer]})`);
            }
          }
          
          if (atom.content?.explanation) {
            console.log(`    Explanation: ${atom.content.explanation.substring(0, 100)}...`);
          }
        });

        return {
          kcId: testCase.kcId,
          status: 'success',
          atoms: data.atoms,
          duration,
          fallbackTest: testFallback
        };
      } else {
        return {
          kcId: testCase.kcId,
          status: 'error',
          error: 'No atoms generated',
          duration,
          fallbackTest: testFallback
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
        fallbackTest: testFallback
      };
    }
  };

  const analyzeGradeLevel = (question: string): string => {
    const indicators = {
      appropriate: ['one half', '1/2', '1/3', '1/4', 'parts', 'whole', 'equal parts', 'shaded'],
      tooAdvanced: ['equivalent', 'compare', 'add', 'subtract', 'mixed number', 'improper']
    };
    
    const lowerQuestion = question.toLowerCase();
    const hasAppropriate = indicators.appropriate.some(term => lowerQuestion.includes(term));
    const hasTooAdvanced = indicators.tooAdvanced.some(term => lowerQuestion.includes(term));
    
    if (hasAppropriate && !hasTooAdvanced) return 'Grade 3 Appropriate';
    if (hasTooAdvanced) return 'Possibly Too Advanced';
    return 'Needs Analysis';
  };

  const analyzeConceptualFocus = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('what fraction') || lowerQuestion.includes('which fraction')) {
      return 'Fraction Identification (Good)';
    }
    if (lowerQuestion.includes('shaded') || lowerQuestion.includes('colored')) {
      return 'Visual Representation (Excellent)';
    }
    if (lowerQuestion.includes('equal parts') || lowerQuestion.includes('divided')) {
      return 'Partitioning Concept (Excellent)';
    }
    if (lowerQuestion.includes('calculate') || lowerQuestion.includes('compute')) {
      return 'Computational (Not Ideal for Grade 3)';
    }
    
    return 'General Fraction Question';
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    console.log('🚀 Starting Grade 3 Fraction Conceptual Understanding Tests');
    console.log('🎯 Focus: Analyzing prompt generation, AI content quality, and validation for Grade 3 fraction concepts');
    
    for (const testCase of grade3FractionTestCases) {
      setCurrentTest(testCase.kcId);
      console.log(`\n📝 Testing: ${testCase.description}`);
      console.log(`🎯 Expected: ${testCase.expectedQuestions}`);
      
      // Test AI generation
      const aiResult = await runSingleTest(testCase, false);
      setTestResults(prev => [...prev, aiResult]);
      
      // Test fallback for the first test case
      if (testCase.kcId === grade3FractionTestCases[0].kcId) {
        console.log(`\n🔄 Testing fallback generation for ${testCase.kcId}`);
        const fallbackResult = await runSingleTest(testCase, true);
        fallbackResult.kcId = `${testCase.kcId}_fallback`;
        setTestResults(prev => [...prev, fallbackResult]);
      }
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setCurrentTest(null);
    setIsRunning(false);
    
    // Final analysis
    const successCount = testResults.filter(r => r.status === 'success').length + 1;
    console.log('\n🏁 GRADE 3 FRACTION TEST SUMMARY:');
    console.log(`📊 Tests completed: ${grade3FractionTestCases.length + 1}`);
    console.log(`✅ Successful: ${successCount}`);
    console.log('📋 Key Analysis Areas:');
    console.log('  1. Prompt generation for conceptual vs computational questions');
    console.log('  2. Grade 3 appropriate vocabulary and complexity');
    console.log('  3. Visual fraction representation in questions');
    console.log('  4. Unit fraction (1/b) focus as per 3.NF.A.1 standard');
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

  const getContentQualityBadge = (atoms: any[]) => {
    if (!atoms || atoms.length === 0) return null;
    
    const hasVisualQuestions = atoms.some(atom => 
      atom.content?.question?.toLowerCase().includes('shaded') ||
      atom.content?.question?.toLowerCase().includes('colored') ||
      atom.content?.question?.toLowerCase().includes('parts')
    );
    
    const hasUnitFractions = atoms.some(atom => 
      atom.content?.question?.includes('1/') ||
      atom.content?.question?.toLowerCase().includes('one half') ||
      atom.content?.question?.toLowerCase().includes('one third')
    );
    
    if (hasVisualQuestions && hasUnitFractions) {
      return <Badge className="bg-green-100 text-green-800">Excellent for Grade 3</Badge>;
    } else if (hasVisualQuestions || hasUnitFractions) {
      return <Badge className="bg-yellow-100 text-yellow-800">Good for Grade 3</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card className="bg-gradient-to-r from-blue-900 to-purple-900 border-blue-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-400" />
            Grade 3 Fraction Conceptual Understanding Test Suite
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Button 
              onClick={onBack}
              variant="outline"
              className="text-white border-white"
            >
              Back to Tests
            </Button>
            <Button 
              onClick={runAllTests}
              disabled={isRunning}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isRunning ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Running Grade 3 Tests...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run Grade 3 Fraction Tests
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
            <h4 className="text-blue-200 font-semibold mb-2">🎯 Grade 3 Fraction Test Focus:</h4>
            <ul className="text-blue-300 text-sm space-y-1">
              <li>• Conceptual understanding vs computational problems</li>
              <li>• Unit fractions (1/2, 1/3, 1/4) as per 3.NF.A.1 standard</li>
              <li>• Visual fraction representations and "parts of whole" questions</li>
              <li>• Grade 3 appropriate vocabulary and complexity</li>
              <li>• Prompt generation analysis for conceptual topics</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Test Cases Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Grade 3 Fraction Test Cases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {grade3FractionTestCases.map((testCase, index) => (
              <div key={testCase.kcId} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">{testCase.description}</h4>
                    <p className="text-sm text-gray-600 font-mono">{testCase.kcId}</p>
                  </div>
                  <Badge variant="default">Grade 3 Focus</Badge>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Focus:</strong> {testCase.focus}
                </p>
                <p className="text-xs text-blue-600">
                  <strong>Expected Questions:</strong> {testCase.expectedQuestions}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Grade 3 Fraction Test Results & Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {testResults.map((result, index) => {
                const testCase = grade3FractionTestCases.find(tc => tc.kcId === result.kcId.replace('_fallback', ''));
                const isFallback = result.kcId.includes('_fallback');
                
                return (
                  <div key={result.kcId} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(result.status)}
                        <div>
                          <h4 className="font-semibold">
                            {testCase?.description || result.kcId}
                            {isFallback && ' (Fallback Test)'}
                          </h4>
                          <p className="text-sm text-gray-600 font-mono">{result.kcId}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {result.atoms && getContentQualityBadge(result.atoms)}
                        {result.duration && (
                          <Badge variant="outline">{result.duration}ms</Badge>
                        )}
                        {isFallback && (
                          <Badge className="bg-orange-100 text-orange-800">Fallback</Badge>
                        )}
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
                        <h5 className="font-medium mb-2">
                          Grade 3 Content Analysis ({result.atoms.length} atoms):
                        </h5>
                        <div className="space-y-3">
                          {result.atoms.map((atom, atomIndex) => (
                            <div key={atomIndex} className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex justify-between items-start mb-2">
                                <Badge variant="outline">{atom.atom_type}</Badge>
                                <div className="flex gap-1 flex-wrap">
                                  {atom.content?.question && (
                                    <Badge className={
                                      this.analyzeGradeLevel(atom.content.question).includes('Appropriate') 
                                        ? "bg-green-100 text-green-800" 
                                        : "bg-yellow-100 text-yellow-800"
                                    }>
                                      {this.analyzeGradeLevel(atom.content.question)}
                                    </Badge>
                                  )}
                                  {atom.content?.question && (
                                    <Badge className="bg-blue-100 text-blue-800">
                                      {this.analyzeConceptualFocus(atom.content.question)}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              
                              {atom.content?.question && (
                                <div className="mb-2">
                                  <p className="text-sm mb-1"><strong>Question:</strong> {atom.content.question}</p>
                                  {atom.content?.options && (
                                    <div className="ml-4 text-xs text-gray-600">
                                      <p><strong>Options:</strong> {atom.content.options.join(', ')}</p>
                                      <p><strong>Correct:</strong> {atom.content.correctAnswer} ({atom.content.options?.[atom.content.correctAnswer]})</p>
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
                                <strong>Metadata:</strong> Source: {atom.metadata?.source || 'N/A'} | 
                                Math Topic: {atom.metadata?.mathTopic || 'N/A'} |
                                Model: {atom.metadata?.model || 'N/A'}
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

      {/* Summary */}
      {testResults.length === (grade3FractionTestCases.length + 1) && (
        <Card>
          <CardHeader>
            <CardTitle>📊 Grade 3 Fraction Test Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {testResults.filter(r => r.status === 'success').length}
                </div>
                <p className="text-sm text-gray-600">Successful Tests</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {testResults.filter(r => r.atoms?.some(atom => 
                    atom.content?.question?.toLowerCase().includes('shaded') ||
                    atom.content?.question?.toLowerCase().includes('parts')
                  )).length}
                </div>
                <p className="text-sm text-gray-600">Visual Questions</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {testResults.filter(r => r.atoms?.some(atom => 
                    atom.content?.question?.includes('1/') ||
                    atom.content?.question?.toLowerCase().includes('one')
                  )).length}
                </div>
                <p className="text-sm text-gray-600">Unit Fraction Focus</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {testResults.filter(r => r.fallbackTest).length}
                </div>
                <p className="text-sm text-gray-600">Fallback Tests</p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">🔍 Key Insights for Grade 3 Fractions:</h4>
              <ul className="text-sm space-y-1">
                <li>• <strong>Conceptual Focus:</strong> Check console logs for prompt_generator.ts analysis</li>
                <li>• <strong>Validation Logic:</strong> Review math_utils.ts logs for fraction question handling</li>
                <li>• <strong>Grade Appropriateness:</strong> Analyze vocabulary and complexity in generated questions</li>
                <li>• <strong>Standards Alignment:</strong> Verify 3.NF.A.1 unit fraction emphasis</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Grade3FractionTestInterface;
