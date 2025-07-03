
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Play, CheckCircle, XCircle, Clock, Eye, Target } from 'lucide-react';

const Grade3FractionTestTrigger: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [currentTest, setCurrentTest] = useState<string>('');

  const targetKcIds = [
    'kc_math_g3_nf_1',
    'kc_math_g3_understand_fractions'
  ];

  const runGrade3Tests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    const timestamp = new Date().toISOString();
    console.log('\n🎯 STARTING TARGETED GRADE 3 FRACTION TESTS');
    console.log('=' .repeat(80));
    console.log(`🕐 Test Session Started: ${timestamp}`);
    console.log('🎯 Target KC IDs:', targetKcIds);
    console.log('📊 Expected Standards: 3.NF.A.1 (Understanding fractions as numbers)');
    console.log('🔍 Focus: Unit fractions (1/b), conceptual understanding, partitioning');
    console.log('=' .repeat(80));
    
    const results = [];
    
    for (const kcId of targetKcIds) {
      setCurrentTest(kcId);
      console.log(`\n🧪 TESTING KC ID: ${kcId}`);
      console.log(`⏰ Test Start Time: ${new Date().toISOString()}`);
      console.log(`📋 Expected: Grade 3 conceptual fraction understanding`);
      console.log(`🎯 Looking for: Unit fractions, visual representations, parts/whole concepts`);
      
      try {
        const startTime = Date.now();
        
        console.log(`📤 Sending request to generate-content-atoms for ${kcId}...`);
        
        const requestBody = {
          kcId: kcId,
          userId: 'test-user-grade3-targeted-analysis',
          subject: 'mathematics',
          gradeLevel: 'g3',
          topic: 'fractions understanding',
          contentTypes: ['TEXT_EXPLANATION', 'QUESTION_MULTIPLE_CHOICE'],
          maxAtoms: 3,
          diversityPrompt: 'Create Grade 3 appropriate fraction questions focusing on conceptual understanding of unit fractions (1/b) as per 3.NF.A.1 standard',
          sessionId: `grade3_targeted_${Date.now()}`,
          forceUnique: true,
          testMode: 'grade3_analysis',
          testContext: {
            targetedTest: true,
            grade3Focus: true,
            unitFractionEmphasis: true,
            conceptualUnderstanding: true,
            standard: '3.NF.A.1',
            expectedTopics: ['unit fractions', 'parts of whole', 'equal parts', 'fraction concepts']
          }
        };

        console.log(`📊 Request payload:`, JSON.stringify(requestBody, null, 2));

        const { data, error } = await supabase.functions.invoke('generate-content-atoms', {
          body: requestBody
        });

        const duration = Date.now() - startTime;
        const responseTime = new Date().toISOString();
        
        console.log(`⏱️ Request completed in ${duration}ms at ${responseTime}`);

        if (error) {
          console.error(`❌ Test FAILED for ${kcId}:`, error);
          console.log(`🔍 Check Supabase logs around timestamp: ${responseTime}`);
          
          results.push({
            kcId,
            status: 'error',
            error: error.message,
            duration,
            timestamp: responseTime
          });
        } else if (data?.atoms && Array.isArray(data.atoms)) {
          console.log(`✅ Test SUCCESSFUL for ${kcId}`);
          console.log(`📊 Generated ${data.atoms.length} atoms`);
          
          // Detailed analysis of each atom
          console.log(`\n📝 DETAILED ATOM ANALYSIS FOR ${kcId}:`);
          data.atoms.forEach((atom: any, index: number) => {
            console.log(`\n  🔍 Atom ${index + 1} Analysis:`);
            console.log(`    Type: ${atom.atom_type}`);
            console.log(`    Source: ${atom.metadata?.source || 'N/A'}`);
            console.log(`    Model: ${atom.metadata?.model || 'N/A'}`);
            console.log(`    Math Topic: ${atom.metadata?.mathTopic || 'N/A'}`);
            
            if (atom.content?.question) {
              console.log(`    Question: "${atom.content.question}"`);
              
              // Grade 3 specific analysis
              const questionLower = atom.content.question.toLowerCase();
              const hasUnitFraction = questionLower.includes('1/') || 
                                    questionLower.includes('one half') ||
                                    questionLower.includes('one third') ||
                                    questionLower.includes('one fourth');
              
              const hasVisual = questionLower.includes('shaded') ||
                              questionLower.includes('circle') ||
                              questionLower.includes('rectangle') ||
                              questionLower.includes('diagram');
              
              const hasConceptual = questionLower.includes('part') ||
                                  questionLower.includes('whole') ||
                                  questionLower.includes('equal parts') ||
                                  questionLower.includes('divided');
              
              const isGradeAppropriate = atom.content.question.split(' ').length <= 30 &&
                                       !questionLower.includes('calculate') &&
                                       !questionLower.includes('compute') &&
                                       !questionLower.includes('equivalent');
              
              console.log(`    Grade 3 Analysis:`);
              console.log(`      ✓ Has Unit Fractions: ${hasUnitFraction}`);
              console.log(`      ✓ Has Visual Elements: ${hasVisual}`);
              console.log(`      ✓ Has Conceptual Focus: ${hasConceptual}`);
              console.log(`      ✓ Is Grade Appropriate: ${isGradeAppropriate}`);
              
              if (atom.content?.options) {
                console.log(`    Options: [${atom.content.options.join(', ')}]`);
                console.log(`    Correct Answer Index: ${atom.content.correctAnswer}`);
                console.log(`    Correct Answer: "${atom.content.options[atom.content.correctAnswer]}"`);
              }
            }
            
            if (atom.content?.explanation) {
              console.log(`    Explanation: "${atom.content.explanation.substring(0, 150)}..."`);
            }
          });

          console.log(`\n🎯 KEY SERVER LOGS TO CHECK in Supabase Dashboard:`);
          console.log(`   1. Look for "🎯 Creating REAL curriculum-enhanced prompt for kcId: ${kcId}"`);
          console.log(`   2. Check for "✅ Found relevant curriculum topic:" with 3.NF.A.1 or Grade 3 fractions`);
          console.log(`   3. Look for "🔍 Validating question [X]:" in math_utils.ts`);
          console.log(`   4. Check for "🧩 Conceptual unit fraction question detected" validation`);
          console.log(`   5. Verify fallback behavior if AI generation fails`);

          results.push({
            kcId,
            status: 'success',
            atoms: data.atoms,
            duration,
            timestamp: responseTime,
            analysisComplete: true
          });
        } else {
          console.log(`⚠️ No atoms generated for ${kcId}`);
          results.push({
            kcId,
            status: 'no_atoms',
            duration,
            timestamp: responseTime
          });
        }
        
        // Brief pause between tests for log clarity
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`💥 Exception during ${kcId} test:`, error);
        results.push({
          kcId,
          status: 'exception',
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        });
      }
    }
    
    setTestResults(results);
    setIsRunning(false);
    setCurrentTest('');
    
    // Final summary
    const finalTimestamp = new Date().toISOString();
    console.log('\n' + '=' .repeat(80));
    console.log('🏁 GRADE 3 FRACTION TEST SUMMARY');
    console.log('=' .repeat(80));
    console.log(`🕐 Test Session Completed: ${finalTimestamp}`);
    console.log(`📊 Total Tests: ${results.length}`);
    console.log(`✅ Successful: ${results.filter(r => r.status === 'success').length}`);
    console.log(`❌ Failed: ${results.filter(r => r.status === 'error').length}`);
    console.log(`⚠️ No Atoms: ${results.filter(r => r.status === 'no_atoms').length}`);
    
    console.log('\n🔍 NEXT STEPS FOR LOG ANALYSIS:');
    console.log('1. Go to Supabase Dashboard → Edge Functions → generate-content-atoms → Logs');
    console.log(`2. Filter logs by timestamp range: ${timestamp} to ${finalTimestamp}`);
    console.log('3. Look for the specific log patterns mentioned above for each KC ID');
    console.log('4. Verify prompt_generator.ts correctly identifies Grade 3 topics');
    console.log('5. Check math_utils.ts validation logic for unit fractions');
    console.log('6. Analyze fallback behavior if applicable');
    
    console.log('\n📋 SPECIFIC LOGS TO FIND:');
    targetKcIds.forEach(kcId => {
      console.log(`\nFor ${kcId}:`);
      console.log(`  • Prompt generation logs with Grade 3 context`);
      console.log(`  • Curriculum matching for 3.NF.A.1 standard`);
      console.log(`  • AI content validation for unit fractions`);
      console.log(`  • Question quality assessment`);
    });
    
    console.log('\n' + '=' .repeat(80));
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-6 h-6 text-blue-600" />
          Grade 3 Fraction Test Trigger - Targeted Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold mb-2 text-blue-800">🎯 Test Objectives:</h4>
            <ul className="text-sm space-y-1 text-blue-700">
              <li>• Generate server-side logs for Grade 3 fraction KC IDs</li>
              <li>• Verify 3.NF.A.1 standard recognition in prompt_generator.ts</li>
              <li>• Test unit fraction validation logic in math_utils.ts</li>
              <li>• Analyze AI-generated question quality for Grade 3 level</li>
              <li>• Check conceptual vs computational question types</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Target KC IDs:</h4>
            <div className="flex gap-2 flex-wrap">
              {targetKcIds.map(kcId => (
                <Badge key={kcId} variant="outline" className="font-mono text-xs">
                  {kcId}
                </Badge>
              ))}
            </div>
          </div>

          <Button 
            onClick={runGrade3Tests}
            disabled={isRunning}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isRunning ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Running Grade 3 Tests...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Targeted Grade 3 Fraction Tests
              </>
            )}
          </Button>

          {isRunning && currentTest && (
            <div className="p-3 bg-blue-100 rounded-lg border border-blue-300">
              <p className="text-blue-800 font-medium">
                Currently testing: <span className="font-mono">{currentTest}</span>
              </p>
              <p className="text-sm text-blue-600 mt-1">
                Check console for detailed analysis and Supabase Dashboard for server logs...
              </p>
            </div>
          )}

          {testResults.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Test Results Summary:
              </h4>
              {testResults.map((result) => (
                <div key={result.kcId} className="border rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between p-3 bg-gray-50">
                    <div className="flex items-center gap-3">
                      {result.status === 'success' ? 
                        <CheckCircle className="w-5 h-5 text-green-500" /> :
                        <XCircle className="w-5 h-5 text-red-500" />
                      }
                      <div>
                        <p className="font-mono text-sm font-semibold">{result.kcId}</p>
                        <p className="text-xs text-gray-600">
                          {result.status === 'success' && result.atoms ? 
                            `${result.atoms.length} atoms generated at ${result.timestamp}` : 
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
                  
                  {result.status === 'success' && result.atoms && (
                    <div className="p-4 space-y-4">
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <h5 className="font-semibold text-blue-800 mb-2">📋 Raw JSON Atoms Output:</h5>
                        <div className="bg-white p-3 rounded border max-h-96 overflow-auto">
                          <pre className="text-xs text-gray-800 whitespace-pre-wrap font-mono">
                            {JSON.stringify(result.atoms, null, 2)}
                          </pre>
                        </div>
                        <p className="text-xs text-blue-600 mt-2">
                          💡 Copy this JSON for detailed analysis of generated content structure and validation
                        </p>
                      </div>
                      
                      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <h5 className="font-semibold text-green-800 mb-2">🔍 Content Analysis Summary:</h5>
                        {result.atoms.map((atom: any, index: number) => (
                          <div key={index} className="mb-3 p-2 bg-white rounded border-l-4 border-green-400">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-semibold text-sm">Atom {index + 1}: {atom.atom_type}</span>
                              <Badge variant="outline" className="text-xs">
                                {atom.metadata?.model || 'N/A'}
                              </Badge>
                            </div>
                            {atom.content?.question && (
                              <div className="text-sm space-y-1">
                                <p><strong>Question:</strong> {atom.content.question}</p>
                                {atom.content.options && (
                                  <div>
                                    <p><strong>Options:</strong> [{atom.content.options.join(', ')}]</p>
                                    <p><strong>Correct Answer:</strong> Index {atom.content.correctAnswer} = "{atom.content.options[atom.content.correctAnswer]}"</p>
                                  </div>
                                )}
                              </div>
                            )}
                            {atom.content?.explanation && (
                              <p className="text-sm"><strong>Explanation:</strong> {atom.content.explanation.substring(0, 150)}...</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-semibold mb-2 text-yellow-800">📋 After Running Tests:</h4>
            <ol className="text-sm space-y-1 text-yellow-700 list-decimal list-inside">
              <li>Check the browser console for detailed client-side analysis</li>
              <li>Go to Supabase Dashboard → Functions → generate-content-atoms → Logs</li>
              <li>Filter by the test timestamps shown in console</li>
              <li>Look for Grade 3 specific server-side log patterns</li>
              <li>Verify curriculum matching and validation logic execution</li>
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Grade3FractionTestTrigger;
