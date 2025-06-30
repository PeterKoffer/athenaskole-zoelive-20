
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TestTube, CheckCircle, XCircle, AlertCircle, Play } from 'lucide-react';
import { LocalizationTestHelper } from '@/utils/localizationTestHelper';

interface TestResult {
  name: string;
  passed: boolean;
  error?: any;
}

const LocalizationTestPanel: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [overallStatus, setOverallStatus] = useState<'idle' | 'running' | 'passed' | 'failed'>('idle');

  const runTests = async () => {
    setIsRunning(true);
    setOverallStatus('running');
    setTestResults([]);

    try {
      const { allPassed, results } = await LocalizationTestHelper.runFullLocalizationTest();
      setTestResults(results);
      setOverallStatus(allPassed ? 'passed' : 'failed');
    } catch (error) {
      console.error('Test suite error:', error);
      setOverallStatus('failed');
    } finally {
      setIsRunning(false);
    }
  };

  const showManualSteps = () => {
    LocalizationTestHelper.logManualTestingSteps();
  };

  const getStatusIcon = (status: typeof overallStatus) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'running': return <TestTube className="w-5 h-5 text-blue-500 animate-pulse" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (passed: boolean) => {
    return passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TestTube className="w-6 h-6" />
          <span>Localization Test Suite</span>
          {getStatusIcon(overallStatus)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Button 
            onClick={runTests} 
            disabled={isRunning}
            className="flex items-center space-x-2"
          >
            <Play className="w-4 h-4" />
            <span>{isRunning ? 'Running Tests...' : 'Run Setup Tests'}</span>
          </Button>
          
          <Button 
            onClick={showManualSteps} 
            variant="outline"
            className="flex items-center space-x-2"
          >
            <AlertCircle className="w-4 h-4" />
            <span>Show Manual Steps</span>
          </Button>
        </div>

        {testResults.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Test Results:</h3>
            {testResults.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded bg-gray-50">
                <span className="font-medium">{result.name}</span>
                <Badge className={getStatusColor(result.passed)}>
                  {result.passed ? 'PASSED' : 'FAILED'}
                </Badge>
              </div>
            ))}
          </div>
        )}

        {overallStatus === 'passed' && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">✅ Ready for Manual Testing!</p>
            <p className="text-green-700 text-sm mt-1">
              All setup checks passed. You can now proceed with the manual localization flow testing.
            </p>
          </div>
        )}

        {overallStatus === 'failed' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">❌ Setup Issues Detected</p>
            <p className="text-red-700 text-sm mt-1">
              Some setup requirements are missing. Check the console for details and resolve before manual testing.
            </p>
          </div>
        )}

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Quick Manual Test Steps:</h4>
          <ol className="text-blue-700 text-sm space-y-1">
            <li>1. Run setup tests above</li>
            <li>2. Navigate to /adaptive-practice-test</li>
            <li>3. Test English content loading</li>
            <li>4. Switch to Danish using language switcher</li>
            <li>5. Verify Danish content loads</li>
            <li>6. Check Supabase interaction_events table</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocalizationTestPanel;
