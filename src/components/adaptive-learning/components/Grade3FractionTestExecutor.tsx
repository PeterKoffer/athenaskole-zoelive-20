
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Play, CheckCircle, XCircle, FileText, Eye } from 'lucide-react';

interface TestExecutorProps {
  onResults: (results: any) => void;
}

const Grade3FractionTestExecutor: React.FC<TestExecutorProps> = ({ onResults }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [currentTest, setCurrentTest] = useState<string>('');

  const testKcIds = [
    'kc_math_g3_nf_1',
    'kc_math_g3_understand_fractions'
  ];

  const runComprehensiveTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    console.log('🚀 Starting COMPREHENSIVE Grade 3 Fraction Tests');
    console.log('🎯 Testing KC IDs:', testKcIds);
    console.log('📊 Analyzing: prompt_generator.ts matching, AI quality, math_utils.ts validation, fallback behavior');
    
    const results = [];
    
    for (const kcId of testKcIds) {
      setCurrentTest(kcId);
      console.log(`\n🧪 TESTING: ${kcId}`);
      console.log(`📋 Expected: Grade 3 conceptual fraction understanding`);
      console.log(`🎯 Focus: Unit fractions (1/b) and partitioning concepts`);
      
      try {
        const startTime = Date.now();
        
        const { data, error } = await supabase.functions.invoke('generate-content-atoms', {
          body: {
            kcId: kcId,
            userId: 'test-user-grade3-comprehensive',
            subject: 'mathematics',
            gradeLevel: 'g3',
            topic: 'fractions understanding',
            contentTypes: ['TEXT_EXPLANATION', 'QUESTION_MULTIPLE_CHOICE'],
            maxAtoms: 3,
            diversityPrompt: 'Create Grade 3 appropriate fraction questions focusing on conceptual understanding of unit fractions',
            sessionId: `comprehensive_grade3_${Date.now()}`,
            forceUnique: true,
            testMode: 'comprehensive_analysis'
          }
        });

        const duration = Date.now() - startTime;

        if (error) {
          console.error(`❌ Test failed for ${kcId}:`, error);
          results.push({
            kcId,
            status: 'error',
            error: error.message,
            duration
          });
        } else if (data?.atoms) {
          console.log(`✅ Test successful for ${kcId}:`, data.atoms.length, 'atoms generated');
          
          // Detailed analysis of generated content
          console.log(`\n📊 DETAILED ANALYSIS FOR ${kcId}:`);
          data.atoms.forEach((atom: any, index: number) => {
            console.log(`\n  📝 Atom ${index + 1} Analysis:`);
            console.log(`    Type: ${atom.atom_type}`);
            console.log(`    Source: ${atom.metadata?.source || 'N/A'}`);
            console.log(`    Math Topic: ${atom.metadata?.mathTopic || 'N/A'}`);
            console.log(`    Model: ${atom.metadata?.model || 'N/A'}`);
            
            if (atom.content?.question) {
              console.log(`    Question: "${atom.content.question}"`);
              console.log(`    Grade 3 Analysis:`);
              
              // Analyze for Grade 3 appropriateness
              const isConceptual = atom.content.question.toLowerCase().includes('fraction') &&
                                 (atom.content.question.toLowerCase().includes('part') || 
                                  atom.content.question.toLowerCase().includes('whole') ||
                                  atom.content.question.toLowerCase().includes('equal'));
              
              const hasVisuals = atom.content.question.toLowerCase().includes('shaded') ||
                               atom.content.question.toLowerCase().includes('circle') ||
                               atom.content.question.toLowerCase().includes('rectangle');
              
              const isUnitFraction = atom.content.question.includes('1/') ||
                                   atom.content.question.toLowerCase().includes('one half') ||
                                   atom.content.question.toLowerCase().includes('one third') ||
                                   atom.content.question.toLowerCase().includes('one fourth');
              
              console.log(`      ✓ Conceptual (parts/whole): ${isConceptual}`);
              console.log(`      ✓ Visual elements: ${hasVisuals}`);
              console.log(`      ✓ Unit fraction focus: ${isUnitFraction}`);
              
              if (atom.content?.options) {
                console.log(`    Options: [${atom.content.options.join(', ')}]`);
                console.log(`    Correct Answer Index: ${atom.content.correctAnswer}`);
                console.log(`    Correct Answer Value: "${atom.content.options[atom.content.correctAnswer]}"`);
                
                // Validate the correct answer makes sense
                const correctOption = atom.content.options[atom.content.correctAnswer];
                console.log(`    Answer Analysis: ${correctOption ? 'Valid index' : 'Invalid index!'}`);
              }
            }
            
            if (atom.content?.explanation) {
              console.log(`    Explanation Length: ${atom.content.explanation.length} chars`);
              console.log(`    Explanation Preview: "${atom.content.explanation.substring(0, 100)}..."`);
            }
            
            console.log(`    Metadata Complete: source=${!!atom.metadata?.source}, mathTopic=${!!atom.metadata?.mathTopic}`);
          });

          results.push({
            kcId,
            status: 'success',
            atoms: data.atoms,
            duration,
            analysisComplete: true
          });
        } else {
          console.log(`⚠️ No atoms generated for ${kcId}`);
          results.push({
            kcId,
            status: 'no_atoms',
            duration
          });
        }
        
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 1500));
        
      } catch (error) {
        console.error(`💥 Exception during ${kcId} test:`, error);
        results.push({
          kcId,
          status: 'exception',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    setTestResults(results);
    setIsRunning(false);
    setCurrentTest('');
    
    // Final comprehensive summary
    console.log('\n🏁 COMPREHENSIVE TEST SUMMARY:');
    console.log(`📊 Total Tests: ${results.length}`);
    console.log(`✅ Successful: ${results.filter(r => r.status === 'success').length}`);
    console.log(`❌ Failed: ${results.filter(r => r.status === 'error').length}`);
    console.log(`⚠️ No Atoms: ${results.filter(r => r.status === 'no_atoms').length}`);
    
    console.log('\n🔍 KEY ANALYSIS POINTS TO CHECK:');
    console.log('1. 📋 Supabase Edge Function Logs: Look for prompt_generator.ts topic matching');
    console.log('2. 🧠 AI Content Quality: Check conceptual vs computational questions');
    console.log('3. ✅ Validation Logs: Look for math_utils.ts unit fraction detection');
    console.log('4. 🔄 Fallback Behavior: Check for specific Grade 3 fallbacks if AI fails');
    
    onResults(results);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Comprehensive Grade 3 Fraction Test Executor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={runComprehensiveTests}
              disabled={isRunning}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isRunning ? (
                <>
                  <Play className="w-4 h-4 mr-2 animate-spin" />
                  Running Comprehensive Tests...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run Comprehensive Grade 3 Tests
                </>
              )}
            </Button>
          </div>

          {isRunning && currentTest && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-700">
                <strong>Currently testing:</strong> <span className="font-mono">{currentTest}</span>
              </p>
              <p className="text-sm text-blue-600 mt-1">
                Check console logs for detailed analysis...
              </p>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">🎯 Test Scope:</h4>
            <ul className="text-sm space-y-1">
              <li>• <strong>KC IDs:</strong> {testKcIds.join(', ')}</li>
              <li>• <strong>Focus:</strong> Grade 3 conceptual fraction understanding</li>
              <li>• <strong>Analysis:</strong> Prompt matching, AI quality, validation logic</li>
              <li>• <strong>Expected:</strong> Unit fraction (1/b) questions with visual elements</li>
            </ul>
          </div>

          {testResults.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold">Test Results Summary:</h4>
              {testResults.map((result, index) => (
                <div key={result.kcId} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {result.status === 'success' ? 
                      <CheckCircle className="w-5 h-5 text-green-500" /> :
                      <XCircle className="w-5 h-5 text-red-500" />
                    }
                    <div>
                      <p className="font-mono text-sm">{result.kcId}</p>
                      <p className="text-xs text-gray-600">
                        {result.status === 'success' && result.atoms ? 
                          `${result.atoms.length} atoms generated` : 
                          result.error || result.status
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {result.status === 'success' && (
                      <Badge className="bg-green-100 text-green-800">Success</Badge>
                    )}
                    {result.duration && (
                      <Badge variant="outline">{result.duration}ms</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Grade3FractionTestExecutor;
