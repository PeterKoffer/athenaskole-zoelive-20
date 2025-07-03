
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const FocusedGrade3MultiplicationTest = () => {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);

  const runMultiplicationTest = async () => {
    setIsRunning(true);
    setTestResults(null);
    setExecutionLogs([]);
    
    const startTime = Date.now();
    
    try {
      console.log('🎯 Starting focused Grade 3 Multiplication (3.OA.A.1) test...');
      setExecutionLogs(prev => [...prev, `Starting Grade 3 Multiplication test at ${new Date().toLocaleTimeString()}`]);
      
      // Test KC ID for 3.OA.A.1 (interpret products)
      const testKcId = 'kc_math_g3_oa_1';
      
      setExecutionLogs(prev => [...prev, `Testing KC ID: ${testKcId}`]);
      setExecutionLogs(prev => [...prev, `Target Standard: 3.OA.A.1 (Interpret products of whole numbers)`]);
      setExecutionLogs(prev => [...prev, `Focus: Group interpretations, equal groups, arrays`]);
      
      console.log('📊 Invoking generate-content-atoms for 3.OA.A.1...');
      
      const { data: response, error } = await supabase.functions.invoke('generate-content-atoms', {
        body: {
          kcId: testKcId,
          userId: 'focused-grade3-multiplication-test-user',
          contentTypes: ['TEXT_EXPLANATION', 'QUESTION_MULTIPLE_CHOICE'],
          maxAtoms: 3
        }
      });

      const endTime = Date.now();
      const executionTime = endTime - startTime;
      
      setExecutionLogs(prev => [...prev, `Execution completed in ${executionTime}ms`]);

      if (error) {
        console.error('❌ Grade 3 Multiplication test failed:', error);
        setExecutionLogs(prev => [...prev, `❌ ERROR: ${error.message}`]);
        toast({
          title: "Test Failed",
          description: `Grade 3 Multiplication test failed: ${error.message}`,
          variant: "destructive",
          duration: 5000
        });
        return;
      }

      if (response?.atoms) {
        console.log('✅ Grade 3 Multiplication test successful:', response.atoms);
        setExecutionLogs(prev => [...prev, `✅ SUCCESS: Generated ${response.atoms.length} atoms`]);
        
        // Analyze the results
        const hasTextExplanation = response.atoms.some((atom: any) => atom.atom_type === 'TEXT_EXPLANATION');
        const hasMultipleChoice = response.atoms.some((atom: any) => atom.atom_type === 'QUESTION_MULTIPLE_CHOICE');
        const hasMultiplicationContent = response.atoms.some((atom: any) => 
          JSON.stringify(atom.content).toLowerCase().includes('group') ||
          JSON.stringify(atom.content).toLowerCase().includes('equal') ||
          JSON.stringify(atom.content).toLowerCase().includes('times') ||
          JSON.stringify(atom.content).toLowerCase().includes('×')
        );
        
        setExecutionLogs(prev => [...prev, `Analysis: Text Explanation: ${hasTextExplanation ? '✅' : '❌'}`]);
        setExecutionLogs(prev => [...prev, `Analysis: Multiple Choice: ${hasMultipleChoice ? '✅' : '❌'}`]);
        setExecutionLogs(prev => [...prev, `Analysis: Multiplication Content: ${hasMultiplicationContent ? '✅' : '❌'}`]);
        
        setTestResults(response);
        
        toast({
          title: "🎉 Grade 3 Multiplication Test Successful!",
          description: `Generated ${response.atoms.length} atoms for 3.OA.A.1 (Interpret products)`,
          duration: 5000
        });
      } else {
        console.log('⚠️ No atoms returned for Grade 3 Multiplication test');
        setExecutionLogs(prev => [...prev, '⚠️ WARNING: No atoms returned']);
        toast({
          title: "Test Incomplete",
          description: "No content atoms were generated for Grade 3 Multiplication",
          variant: "destructive",
          duration: 5000
        });
      }

    } catch (error) {
      console.error('💥 Grade 3 Multiplication test error:', error);
      setExecutionLogs(prev => [...prev, `💥 EXCEPTION: ${error}`]);
      toast({
        title: "Test Error",
        description: `Unexpected error during Grade 3 Multiplication test: ${error}`,
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          📚 Focused Grade 3 Multiplication Test (3.OA.A.1)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Test Target Info */}
        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
          <div className="text-center space-y-2">
            <div className="text-red-400 font-semibold">🎯 Specific Test Target:</div>
            <div className="text-green-400 font-mono">KC ID: kc_math_g3_oa_1</div>
            <div className="text-blue-300">Standard: 3.OA.A.1 (Interpret products of whole numbers)</div>
            <div className="text-yellow-300">Focus: Equal groups, arrays, group interpretations (e.g., 5 × 7 as 5 groups of 7)</div>
          </div>
        </div>

        {/* Run Test Button */}
        <Button 
          onClick={runMultiplicationTest} 
          disabled={isRunning}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3"
        >
          {isRunning ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Running Grade 3 Multiplication Test...
            </>
          ) : (
            <>▶ Run Focused Grade 3 Multiplication Test</>
          )}
        </Button>

        {/* Instructions */}
        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
          <div className="text-yellow-200 text-sm">
            <div className="font-semibold mb-2">📋 After Running:</div>
            <ol className="space-y-1 list-decimal list-inside">
              <li>Check browser console for detailed Grade 3 analysis</li>
              <li>Go to Supabase Dashboard → Functions → generate-content-atoms → Logs</li>
              <li>Look for the specific Grade 3 server-side logs mentioned above</li>
            </ol>
          </div>
        </div>

        {/* Execution Logs */}
        {executionLogs.length > 0 && (
          <div className="bg-gray-900 border border-gray-600 rounded-lg p-4">
            <div className="text-gray-300 text-sm font-mono space-y-1">
              <div className="text-blue-400 font-semibold mb-2">🔍 Execution Log:</div>
              {executionLogs.map((log, index) => (
                <div key={index} className="text-xs">{log}</div>
              ))}
            </div>
          </div>
        )}

        {/* Test Results */}
        {testResults && (
          <div className="bg-gray-900 border border-gray-600 rounded-lg p-4">
            <div className="text-green-400 font-semibold mb-2">✅ Generated Atoms:</div>
            <pre className="text-xs text-gray-300 overflow-auto max-h-96 bg-black p-3 rounded">
              {JSON.stringify(testResults.atoms, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FocusedGrade3MultiplicationTest;
