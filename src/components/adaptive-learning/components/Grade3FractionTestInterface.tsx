
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
            console.log(`    Grade Level Check: ${analyzeGradeLevel(atom.content.question)}`);
            console.log(`    Conceptual Focus: ${analyzeConceptualFocus(atom.content.question)}`);
            
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
