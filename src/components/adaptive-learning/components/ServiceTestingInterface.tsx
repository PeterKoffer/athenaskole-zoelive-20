
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Play, Zap } from 'lucide-react';
import stealthAssessmentService from '@/services/stealthAssessment/StealthAssessmentService';
import { InteractionEventType } from '@/types/stealthAssessment';
import { MOCK_USER_ID } from '@/services/learnerProfile/MockProfileService';

interface ServiceTestingInterfaceProps {
  onBack: () => void;
}

const ServiceTestingInterface: React.FC<ServiceTestingInterfaceProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testStealthAssessmentService = async () => {
    setLoading(true);
    setTestResults([]);
    setTestStatus('running');
    
    try {
      console.log('🚀 TESTING REFACTORED STEALTH ASSESSMENT SERVICE');
      addTestResult('🚀 Testing refactored StealthAssessmentService...');
      
      // Test 1: Log a question attempt event
      console.log('📝 Test 1: Logging question attempt event...');
      addTestResult('📝 Test 1: Logging question attempt event...');
      
      await stealthAssessmentService.logQuestionAttempt({
        questionId: 'test-question-123',
        knowledgeComponentIds: ['kc_math_g4_add_fractions_likedenom'],
        answerGiven: 'correct_answer',
        isCorrect: true,
        timeTakenMs: 15000,
        attemptsMade: 1
      }, 'adaptive-practice-module');
      
      addTestResult('✅ Question attempt event logged successfully');
      
      // Test 2: Log a hint usage event
      console.log('💡 Test 2: Logging hint usage event...');
      addTestResult('💡 Test 2: Logging hint usage event...');
      
      await stealthAssessmentService.logHintUsage({
        questionId: 'test-question-123',
        knowledgeComponentIds: ['kc_math_g4_add_fractions_likedenom'],
        hintId: 'hint-explanation-001',
        hintLevel: 1
      }, 'adaptive-practice-module');
      
      addTestResult('✅ Hint usage event logged successfully');
      
      // Test 3: Log a content view event
      console.log('👁️ Test 3: Logging content view event...');
      addTestResult('👁️ Test 3: Logging content view event...');
      
      await stealthAssessmentService.logContentView({
        contentAtomId: 'content-atom-fractions-001',
        knowledgeComponentIds: ['kc_math_g4_add_fractions_likedenom'],
        contentType: 'EXPLANATION',
        timeViewedMs: 45000
      }, 'adaptive-practice-module');
      
      addTestResult('✅ Content view event logged successfully');
      
      // Test 4: Log using legacy method for backward compatibility
      console.log('🔄 Test 4: Testing legacy logging method...');
      addTestResult('🔄 Test 4: Testing legacy logging method...');
      
      await stealthAssessmentService.logInteractionEvent({
        event_type: InteractionEventType.QUESTION_ATTEMPT,
        user_id: MOCK_USER_ID,
        event_data: {
          question_id: 'legacy-test-question',
          is_correct: true,
          response_time: 12000
        },
        kc_ids: ['kc_math_g4_subtract_fractions_likedenom'],
        is_correct: true
      });
      
      addTestResult('✅ Legacy method logged successfully');
      
      setTestStatus('success');
      addTestResult('🎉 ALL STEALTH ASSESSMENT TESTS COMPLETED SUCCESSFULLY!');
      console.log('🎉 REFACTORED STEALTH ASSESSMENT SERVICE TESTS COMPLETED!');
      
    } catch (error) {
      console.error('❌ StealthAssessmentService test failed:', error);
      setTestStatus('error');
      addTestResult(`❌ Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      if (error instanceof Error) {
        console.error('Error stack:', error.stack);
        addTestResult(`Error details: ${error.stack || 'No stack trace available'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="bg-gradient-to-r from-blue-900 to-purple-900 border-blue-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <Database className="w-8 h-8 text-blue-400" />
            Adaptive Practice Module - Service Testing
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
              onClick={testStealthAssessmentService}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {loading ? (
                <>
                  <Zap className="w-4 h-4 mr-2 animate-spin" />
                  Testing Service...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Test Refactored Service
                </>
              )}
            </Button>
          </div>
          
          {testResults.length > 0 && (
            <div className={`p-4 rounded-lg border max-h-96 overflow-y-auto ${
              testStatus === 'success' ? 'bg-green-900/30 border-green-700' : 
              testStatus === 'error' ? 'bg-red-900/30 border-red-700' : 
              'bg-blue-900/30 border-blue-700'
            }`}>
              {testResults.map((result, index) => (
                <p key={index} className={`text-sm mb-2 ${
                  testStatus === 'success' ? 'text-green-300' : 
                  testStatus === 'error' ? 'text-red-300' : 
                  'text-blue-300'
                }`}>
                  {result}
                </p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceTestingInterface;
