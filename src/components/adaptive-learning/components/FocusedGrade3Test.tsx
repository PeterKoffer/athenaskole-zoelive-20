import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Play, CheckCircle, XCircle, Target, BookOpen } from 'lucide-react';

const FocusedGrade3Test: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const runGrade3FractionTest = async () => {
    setIsRunning(true);
    setTestResult(null);
    
    const timestamp = new Date().toISOString();
    console.log('\n🎯 FOCUSED GRADE 3 FRACTION TEST STARTING');
    console.log('=' .repeat(80));
    console.log(`🕐 Test Started: ${timestamp}`);
    console.log('🎯 Target: kc_math_g3_nf_1 (Grade 3 - Understanding fractions as numbers)');
    console.log('📊 Expected: 3.NF.A.1 standard recognition and unit fraction questions');
    console.log('=' .repeat(80));
    
    try {
      const startTime = Date.now();
      
      const requestBody = {
        kcId: 'kc_math_g3_nf_1',
        userId: 'focused-grade3-test-user',
        subject: 'mathematics',
        gradeLevel: 'g3',
        topic: 'fractions understanding',
        contentTypes: ['TEXT_EXPLANATION', 'QUESTION_MULTIPLE_CHOICE'],
        maxAtoms: 3,
        diversityPrompt: 'Create Grade 3 appropriate fraction questions focusing on conceptual understanding of unit fractions (1/b) as per 3.NF.A.1 standard. Focus on visual representations and parts of wholes.',
        sessionId: `focused_grade3_${Date.now()}`,
        forceUnique: true,
        testMode: 'focused_grade3_test',
        testContext: {
          targetedTest: true,
          grade3Focus: true,
          unitFractionEmphasis: true,
          conceptualUnderstanding: true,
          standard: '3.NF.A.1',
          expectedTopics: ['unit fractions', 'parts of whole', 'equal parts', 'fraction concepts']
        }
      };

      console.log(`📤 Sending focused Grade 3 request:`, requestBody);

      const { data, error } = await supabase.functions.invoke('generate-content-atoms', {
        body: requestBody
      });

      const duration = Date.now() - startTime;
      const responseTime = new Date().toISOString();
      
      console.log(`⏱️ Request completed in ${duration}ms at ${responseTime}`);

      if (error) {
        console.error(`❌ Grade 3 test FAILED:`, error);
        setTestResult({
          status: 'error',
          error: error.message,
          duration,
          timestamp: responseTime
        });
      } else if (data?.atoms && Array.isArray(data.atoms)) {
        console.log(`✅ Grade 3 test SUCCESSFUL`);
        console.log(`📊 Generated ${data.atoms.length} atoms`);
        
        // Log detailed analysis
        console.log(`\n📝 GRADE 3 ATOMS ANALYSIS:`);
        data.atoms.forEach((atom: any, index: number) => {
          console.log(`\n  🔍 Atom ${index + 1}:`);
          console.log(`    Type: ${atom.atom_type}`);
          console.log(`    Source: ${atom.metadata?.source || 'N/A'}`);
          
          if (atom.content?.question) {
            const questionLower = atom.content.question.toLowerCase();
            const hasUnitFraction = questionLower.includes('1/') || 
                                  questionLower.includes('one half') ||
                                  questionLower.includes('one third') ||
                                  questionLower.includes('one fourth');
            
            const hasVisual = questionLower.includes('shaded') ||
                            questionLower.includes('circle') ||
                            questionLower.includes('rectangle') ||
                            questionLower.includes('diagram') ||
                            questionLower.includes('picture');
            
            const hasConceptual = questionLower.includes('part') ||
                                questionLower.includes('whole') ||
                                questionLower.includes('equal parts') ||
                                questionLower.includes('divided');
            
            console.log(`    Question: "${atom.content.question}"`);
            console.log(`    ✓ Unit Fractions: ${hasUnitFraction ? '✅ YES' : '❌ NO'}`);
            console.log(`    ✓ Visual Elements: ${hasVisual ? '✅ YES' : '❌ NO'}`);
            console.log(`    ✓ Conceptual Focus: ${hasConceptual ? '✅ YES' : '❌ NO'}`);
            
            if (atom.content.options) {
              console.log(`    Options: [${atom.content.options.join(', ')}]`);
              console.log(`    Correct Answer: "${atom.content.options[atom.content.correctAnswer]}"`);
            }
          }
        });

        console.log(`\n🔍 CHECK SUPABASE LOGS NOW:`);
        console.log(`   1. Go to Supabase Dashboard → Functions → generate-content-atoms → Logs`);
        console.log(`   2. Filter by timestamp: ${timestamp} to ${responseTime}`);
        console.log(`   3. Look for: "Found relevant curriculum topic: Understand fractions as numbers (ID: 3-nf-1)"`);
        console.log(`   4. Look for: "🔍 Validating question [X]:" validation logs`);
        console.log(`   5. Look for: "🧩 Conceptual unit fraction question detected"`);

        setTestResult({
          status: 'success',
          atoms: data.atoms,
          duration,
          timestamp: responseTime
        });
      } else {
        console.log(`⚠️ No atoms generated for Grade 3 test`);
        setTestResult({
          status: 'no_atoms',
          duration,
          timestamp: responseTime
        });
      }
      
    } catch (error) {
      console.error(`💥 Exception during Grade 3 test:`, error);
      setTestResult({
        status: 'exception',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
    
    setIsRunning(false);
  };

  return (
    <Card className="mb-6 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-green-600" />
          Focused Grade 3 Fraction Test (3.NF.A.1)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold mb-2 text-green-800">🎯 Specific Test Target:</h4>
            <div className="space-y-2 text-green-700">
              <div><strong>KC ID:</strong> <code className="bg-green-100 px-2 py-1 rounded">kc_math_g3_nf_1</code></div>
              <div><strong>Standard:</strong> 3.NF.A.1 (Understand fractions as numbers)</div>
              <div><strong>Focus:</strong> Unit fractions (1/b), parts of wholes, visual representations</div>
            </div>
          </div>

          <Button 
            onClick={runGrade3FractionTest}
            disabled={isRunning}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isRunning ? (
              <>
                <Target className="w-4 h-4 mr-2 animate-spin" />
                Running Grade 3 Test...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Focused Grade 3 Fraction Test
              </>
            )}
          </Button>

          {testResult && (
            <div className="space-y-3">
              <div className="border rounded-lg overflow-hidden">
                <div className="flex items-center justify-between p-3 bg-gray-50">
                  <div className="flex items-center gap-3">
                    {testResult.status === 'success' ? 
                      <CheckCircle className="w-5 h-5 text-green-500" /> :
                      <XCircle className="w-5 h-5 text-red-500" />
                    }
                    <div>
                      <p className="font-mono text-sm font-semibold">kc_math_g3_nf_1</p>
                      <p className="text-xs text-gray-600">
                        {testResult.status === 'success' && testResult.atoms ? 
                          `${testResult.atoms.length} atoms generated` : 
                          testResult.error || testResult.status
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {testResult.status === 'success' && (
                      <Badge className="bg-green-100 text-green-800">Success</Badge>
                    )}
                    {testResult.duration && (
                      <Badge variant="outline">{testResult.duration}ms</Badge>
                    )}
                  </div>
                </div>
                
                {testResult.status === 'success' && testResult.atoms && (
                  <div className="p-4 space-y-4">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <h5 className="font-semibold text-blue-800 mb-2">📋 Grade 3 JSON Atoms Output:</h5>
                      <div className="bg-white p-3 rounded border max-h-96 overflow-auto">
                        <pre className="text-xs text-gray-800 whitespace-pre-wrap font-mono">
                          {JSON.stringify(testResult.atoms, null, 2)}
                        </pre>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <h5 className="font-semibold text-green-800 mb-2">🔍 Grade 3 Content Analysis:</h5>
                      {testResult.atoms.map((atom: any, index: number) => (
                        <div key={index} className="mb-3 p-2 bg-white rounded border-l-4 border-green-400">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-semibold text-sm">Atom {index + 1}: {atom.atom_type}</span>
                          </div>
                          {atom.content?.question && (
                            <div className="text-sm space-y-1">
                              <p><strong>Question:</strong> {atom.content.question}</p>
                              {atom.content.options && (
                                <div>
                                  <p><strong>Options:</strong> [{atom.content.options.join(', ')}]</p>
                                  <p><strong>Correct Answer:</strong> "{atom.content.options[atom.content.correctAnswer]}"</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-semibold mb-2 text-yellow-800">📋 After Running:</h4>
            <ol className="text-sm space-y-1 text-yellow-700 list-decimal list-inside">
              <li>Check browser console for detailed Grade 3 analysis</li>
              <li>Go to Supabase Dashboard → Functions → generate-content-atoms → Logs</li>
              <li>Look for the specific Grade 3 server-side logs mentioned above</li>
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FocusedGrade3Test;