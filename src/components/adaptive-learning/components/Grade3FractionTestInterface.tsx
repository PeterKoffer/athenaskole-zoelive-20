
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Grade3FractionTestExecutor from './Grade3FractionTestExecutor';
import TestResultsAnalyzer from './TestResultsAnalyzer';
import Grade3TestControls from './Grade3TestControls';
import Grade3TestCasesDisplay from './Grade3TestCasesDisplay';
import Grade3TestResults from './Grade3TestResults';
import Grade3TestSummary from './Grade3TestSummary';
import { grade3FractionTestCases, TestResult } from '../config/grade3FractionTestCases';
import { analyzeGradeLevel, analyzeConceptualFocus } from '../utils/grade3FractionTestUtils';

interface Grade3FractionTestInterfaceProps {
  onBack: () => void;
}

const Grade3FractionTestInterface: React.FC<Grade3FractionTestInterfaceProps> = ({ onBack }) => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  const [comprehensiveResults, setComprehensiveResults] = useState<any[]>([]);
  const [showComprehensiveAnalysis, setShowComprehensiveAnalysis] = useState(false);

  const runSingleTest = async (testCase: typeof grade3FractionTestCases[0], testFallback = false): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      console.log(`🎯 TARGETED GRADE 3 FRACTION TEST STARTING`);
      console.log(`📋 KC ID: ${testCase.kcId}`);
      console.log(`🔍 Focus: ${testCase.focus}`);
      console.log(`📊 Expected Questions: ${testCase.expectedQuestions}`);
      console.log(`⏰ Test Started At: ${new Date().toISOString()}`);
      
      if (testFallback) {
        console.log('🔄 FALLBACK TEST MODE - Testing fallback generation');
      }

      // Add extra context for server-side logging
      const requestBody = {
        kcId: testCase.kcId,
        userId: 'test-user-grade3-fractions-targeted',
        subject: 'mathematics',
        gradeLevel: 'g3',
        topic: 'fractions understanding',
        contentTypes: ['TEXT_EXPLANATION', 'QUESTION_MULTIPLE_CHOICE'],
        maxAtoms: 3,
        diversityPrompt: 'Create Grade 3 appropriate fraction questions focusing on conceptual understanding of unit fractions (1/b) as per 3.NF.A.1 standard',
        sessionId: `grade3_fractions_targeted_${Date.now()}`,
        forceUnique: true,
        testMode: testFallback ? 'fallback' : 'ai_generation',
        // Additional metadata for server-side tracking
        testContext: {
          targetedTest: true,
          grade3Focus: true,
          unitFractionEmphasis: true,
          conceptualUnderstanding: true,
          standard: '3.NF.A.1'
        }
      };

      console.log(`📤 Sending request to generate-content-atoms:`, requestBody);

      const { data, error } = await supabase.functions.invoke('generate-content-atoms', {
        body: requestBody
      });

      const duration = Date.now() - startTime;
      console.log(`⏱️ Request completed in ${duration}ms`);

      if (error) {
        console.error(`❌ Test failed for ${testCase.kcId}:`, error);
        console.log(`🔍 Please check Supabase Function logs for timestamp: ${new Date().toISOString()}`);
        return {
          kcId: testCase.kcId,
          status: 'error',
          error: error.message || 'Unknown error',
          duration,
          fallbackTest: testFallback
        };
      }

      if (data?.atoms && Array.isArray(data.atoms)) {
        console.log(`✅ Test successful for ${testCase.kcId}`);
        console.log(`📊 Generated ${data.atoms.length} atoms`);
        
        // Detailed client-side analysis for comparison with server logs
        console.log(`\n🔍 CLIENT-SIDE ANALYSIS for ${testCase.kcId}:`);
        data.atoms.forEach((atom: any, index: number) => {
          console.log(`\n  📝 Atom ${index + 1} Client Analysis:`);
          console.log(`    Type: ${atom.atom_type}`);
          console.log(`    Source: ${atom.metadata?.source || 'N/A'}`);
          console.log(`    Model: ${atom.metadata?.model || 'N/A'}`);
          
          if (atom.content?.question) {
            const gradeAnalysis = analyzeGradeLevel(atom.content.question);
            const conceptAnalysis = analyzeConceptualFocus(atom.content.question);
            
            console.log(`    Question: "${atom.content.question}"`);
            console.log(`    Grade Level Analysis: ${gradeAnalysis}`);
            console.log(`    Conceptual Focus: ${conceptAnalysis}`);
            
            // Check for unit fraction content
            const hasUnitFraction = atom.content.question.includes('1/') ||
                                  atom.content.question.toLowerCase().includes('one half') ||
                                  atom.content.question.toLowerCase().includes('one third') ||
                                  atom.content.question.toLowerCase().includes('one fourth');
            
            console.log(`    Contains Unit Fractions: ${hasUnitFraction ? '✅ YES' : '❌ NO'}`);
            
            if (atom.content?.options) {
              console.log(`    Options: [${atom.content.options.join(', ')}]`);
              console.log(`    Correct Answer: Index ${atom.content.correctAnswer} = "${atom.content.options[atom.content.correctAnswer]}"`);
            }
          }
        });

        console.log(`\n🎯 IMPORTANT: Check Supabase Edge Function logs around timestamp ${new Date().toISOString()}`);
        console.log(`🔍 Look for these server-side log patterns:`);
        console.log(`   - "🎯 Creating REAL curriculum-enhanced prompt for kcId: ${testCase.kcId}"`);
        console.log(`   - "✅ Found relevant curriculum topic: [topic name]"`);
        console.log(`   - "🔍 Validating question [X]:" in math_utils.ts`);
        console.log(`   - "🧩 Conceptual unit fraction question detected" if validation triggered`);

        return {
          kcId: testCase.kcId,
          status: 'success',
          atoms: data.atoms,
          duration,
          fallbackTest: testFallback
        };
      } else {
        console.log(`⚠️ No atoms generated for ${testCase.kcId}`);
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
      console.error(`💥 Test exception for ${testCase.kcId}:`, error);
      console.log(`🔍 Check Supabase Function logs for timestamp: ${new Date().toISOString()}`);
      
      return {
        kcId: testCase.kcId,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
        fallbackTest: testFallback
      };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    console.log('\n🚀 STARTING COMPREHENSIVE GRADE 3 FRACTION TESTS');
    console.log('=' .repeat(60));
    console.log('🎯 PRIMARY OBJECTIVE: Generate server-side logs for Grade 3 fraction content');
    console.log('📊 FOCUS: KC validation, prompt generation, AI content quality');
    console.log(`⏰ Test Session Started: ${new Date().toISOString()}`);
    console.log('=' .repeat(60));
    
    const allResults: TestResult[] = [];
    
    for (const testCase of grade3FractionTestCases) {
      setCurrentTest(testCase.kcId);
      console.log(`\n📋 TESTING: ${testCase.description}`);
      console.log(`🆔 KC ID: ${testCase.kcId}`);
      console.log(`🎯 Expected: ${testCase.expectedQuestions}`);
      
      // Test AI generation
      const aiResult = await runSingleTest(testCase, false);
      allResults.push(aiResult);
      setTestResults(prev => [...prev, aiResult]);
      
      // Test fallback for the first test case to verify fallback behavior
      if (testCase.kcId === grade3FractionTestCases[0].kcId) {
        console.log(`\n🔄 TESTING FALLBACK for ${testCase.kcId}`);
        const fallbackResult = await runSingleTest(testCase, true);
        fallbackResult.kcId = `${testCase.kcId}_fallback`;
        allResults.push(fallbackResult);
        setTestResults(prev => [...prev, fallbackResult]);
      }
      
      // Small delay between tests for log clarity
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    setCurrentTest(null);
    setIsRunning(false);
    
    // Final comprehensive summary
    const successCount = allResults.filter(r => r.status === 'success').length;
    const totalTests = allResults.length;
    
    console.log('\n' + '=' .repeat(60));
    console.log('🏁 COMPREHENSIVE GRADE 3 FRACTION TEST SUMMARY');
    console.log('=' .repeat(60));
    console.log(`📊 Total Tests Completed: ${totalTests}`);
    console.log(`✅ Successful Tests: ${successCount}`);
    console.log(`❌ Failed Tests: ${totalTests - successCount}`);
    console.log(`⏰ Test Session Completed: ${new Date().toISOString()}`);
    
    console.log('\n🔍 NEXT STEPS FOR LOG ANALYSIS:');
    console.log('1. Go to your Supabase Dashboard');
    console.log('2. Navigate to Edge Functions → generate-content-atoms → Logs');
    console.log('3. Filter logs by the timestamps shown above');
    console.log('4. Look for the server-side log patterns mentioned in each test');
    
    console.log('\n📋 KEY SERVER-SIDE LOGS TO FIND:');
    console.log('• Prompt generation logs from prompt_generator.ts');
    console.log('• Curriculum matching for Grade 3 fraction topics');
    console.log('• AI content validation from math_utils.ts');
    console.log('• Unit fraction detection patterns');
    console.log('• Fallback behavior for 3.NF.A.1 content');
    
    console.log('\n' + '=' .repeat(60));
  };

  const handleComprehensiveResults = (results: any[]) => {
    setComprehensiveResults(results);
    setShowComprehensiveAnalysis(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Grade3TestControls 
        onBack={onBack}
        onRunTests={runAllTests}
        isRunning={isRunning}
        currentTest={currentTest}
      />

      <Grade3FractionTestExecutor onResults={handleComprehensiveResults} />

      {showComprehensiveAnalysis && comprehensiveResults.length > 0 && (
        <TestResultsAnalyzer results={comprehensiveResults} />
      )}

      <Grade3TestCasesDisplay />

      {testResults.length > 0 && (
        <Grade3TestResults testResults={testResults} />
      )}

      <Grade3TestSummary testResults={testResults} />
    </div>
  );
};

export default Grade3FractionTestInterface;
