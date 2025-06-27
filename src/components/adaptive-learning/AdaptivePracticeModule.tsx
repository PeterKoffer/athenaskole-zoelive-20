import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Play, BarChart3, Target, Zap, Database, CheckCircle, AlertCircle } from 'lucide-react';
import learnerProfileService from '@/services/learnerProfile/LearnerProfileService';
// Import the refactored service
import stealthAssessmentService from '@/services/stealthAssessment/StealthAssessmentService';
import { InteractionEventType } from '@/types/stealthAssessment';
import { MOCK_USER_ID } from '@/services/learnerProfile/MockProfileService';
import { LearnerProfile } from '@/types/learnerProfile';

const AdaptivePracticeModule = () => {
  const [learnerProfile, setLearnerProfile] = useState<LearnerProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');

  useEffect(() => {
    console.log('🎯 AdaptivePracticeModule mounted - Using refactored StealthAssessmentService');
    
    // Load initial profile for the normal flow
    const loadInitialProfile = async () => {
      try {
        console.log('📊 Loading initial profile for adaptive learning flow...');
        const profile = await learnerProfileService.getProfile(MOCK_USER_ID);
        setLearnerProfile(profile);
        console.log('✅ Initial profile loaded for adaptive learning:', profile);
      } catch (error) {
        console.error('❌ Error loading initial profile:', error);
      }
    };
    
    loadInitialProfile();
  }, []);

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Test the refactored StealthAssessmentService
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

  // Simulate answering a question in the normal flow
  const handleQuestionAnswer = async (kcId: string, isCorrect: boolean) => {
    console.log('🎯 AdaptivePracticeModule: Question answered for KC:', kcId, 'Correct:', isCorrect);
    
    try {
      // Log the interaction using the refactored service
      await stealthAssessmentService.logQuestionAttempt({
        questionId: `adaptive-question-${Date.now()}`,
        knowledgeComponentIds: [kcId],
        answerGiven: isCorrect ? 'correct_answer' : 'incorrect_answer',
        isCorrect,
        timeTakenMs: Math.floor(Math.random() * 20000) + 5000,
        attemptsMade: 1
      }, 'adaptive-practice-normal-flow');
      
      // Update KC mastery (this is what would happen in real flow)
      console.log('📈 Updating KC mastery via LearnerProfileService...');
      const updatedProfile = await learnerProfileService.updateKcMastery(
        MOCK_USER_ID,
        kcId,
        {
          isCorrect,
          newAttempt: true,
          interactionType: 'QUESTION_ATTEMPT',
          interactionDetails: { 
            difficulty: 3, 
            responseTime: Math.floor(Math.random() * 20000) + 5000,
            normalFlow: true,
            timestamp: Date.now()
          }
        }
      );
      
      console.log('✅ KC mastery updated successfully:', updatedProfile.kcMasteryMap[kcId]);
      
      // Refetch profile to get latest data
      const refreshedProfile = await learnerProfileService.getProfile(MOCK_USER_ID);
      setLearnerProfile(refreshedProfile);
      
      addTestResult(`✅ Question answered for ${kcId}: ${isCorrect ? 'Correct' : 'Incorrect'} - Both interaction logged and mastery updated`);
      
    } catch (error) {
      console.error('❌ Error handling question answer:', error);
      addTestResult(`❌ Error updating mastery for ${kcId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const testSupabaseIntegration = async () => {
    setLoading(true);
    setTestResults([]);
    setTestStatus('running');
    
    try {
      console.log('🚀 STARTING COMPREHENSIVE SUPABASE INTEGRATION TEST');
      addTestResult('🚀 Starting comprehensive Supabase integration test...');
      
      // Test 1: Get or create profile
      console.log('📊 Test 1: Fetching/creating learner profile for user:', MOCK_USER_ID);
      addTestResult('📊 Test 1: Fetching/creating learner profile...');
      
      const profile = await learnerProfileService.getProfile(MOCK_USER_ID);
      setLearnerProfile(profile);
      console.log('✅ Profile retrieved:', profile);
      addTestResult(`✅ Profile retrieved successfully. User ID: ${profile.userId}`);
      
      // Test 2: Update KC mastery with detailed logging
      console.log('📈 Test 2: Updating KC mastery with detailed tracking...');
      addTestResult('📈 Test 2: Updating KC mastery...');
      
      const kcId = 'kc_math_g4_add_fractions_likedenom';
      const eventDetails = {
        isCorrect: true,
        newAttempt: true,
        interactionType: 'QUESTION_ATTEMPT',
        interactionDetails: { 
          difficulty: 3, 
          responseTime: 15000,
          testRun: true,
          timestamp: Date.now()
        }
      };
      
      console.log('Updating KC:', kcId, 'with details:', eventDetails);
      const updatedProfile = await learnerProfileService.updateKcMastery(
        MOCK_USER_ID,
        kcId,
        eventDetails
      );
      
      const kcMastery = updatedProfile.kcMasteryMap[kcId];
      console.log('✅ KC mastery updated:', kcMastery);
      addTestResult(`✅ KC mastery updated: ${kcId} - Level: ${(kcMastery.masteryLevel * 100).toFixed(1)}%`);
      
      // Test 3: Get specific KC mastery
      console.log('🎯 Test 3: Retrieving specific KC mastery...');
      addTestResult('🎯 Test 3: Getting specific KC mastery...');
      
      const retrievedKcMastery = await learnerProfileService.getKcMastery(MOCK_USER_ID, kcId);
      console.log('✅ KC mastery retrieved:', retrievedKcMastery);
      addTestResult(`✅ KC mastery retrieved: Attempts: ${retrievedKcMastery?.attempts}, Correct: ${retrievedKcMastery?.correctAttempts}`);
      
      // Test 4: Update preferences
      console.log('⚙️ Test 4: Updating user preferences...');
      addTestResult('⚙️ Test 4: Updating preferences...');
      
      const newPreferences = {
        learningPace: 'fast' as const,
        learningStyle: 'kinesthetic' as const
      };
      
      const profileWithPreferences = await learnerProfileService.updatePreferences(MOCK_USER_ID, newPreferences);
      console.log('✅ Preferences updated:', profileWithPreferences.preferences);
      addTestResult(`✅ Preferences updated: Pace: ${profileWithPreferences.preferences?.learningPace}, Style: ${profileWithPreferences.preferences?.learningStyle}`);
      
      // Test 5: Get recommendations
      console.log('🎯 Test 5: Getting KC recommendations...');
      addTestResult('🎯 Test 5: Getting recommendations...');
      
      const recommendations = await learnerProfileService.recommendNextKcs(MOCK_USER_ID, 3);
      console.log('✅ Recommendations retrieved:', recommendations);
      addTestResult(`✅ Recommendations retrieved: ${recommendations.length} KCs recommended`);
      
      // Test 6: Batch update test
      console.log('📦 Test 6: Testing batch KC mastery update...');
      addTestResult('📦 Test 6: Testing batch update...');
      
      const batchUpdates = [
        {
          kcId: 'kc_math_g4_subtract_fractions_likedenom',
          eventDetails: {
            isCorrect: false,
            newAttempt: true,
            interactionType: 'QUESTION_ATTEMPT',
            interactionDetails: { difficulty: 2, responseTime: 20000 }
          }
        },
        {
          kcId: 'kc_math_g5_multiply_decimals',
          eventDetails: {
            isCorrect: true,
            newAttempt: true,
            interactionType: 'QUESTION_ATTEMPT',
            interactionDetails: { difficulty: 4, responseTime: 12000 }
          }
        }
      ];
      
      const batchUpdatedProfile = await learnerProfileService.batchUpdateKcMastery(MOCK_USER_ID, batchUpdates);
      console.log('✅ Batch update completed:', Object.keys(batchUpdatedProfile.kcMasteryMap));
      addTestResult(`✅ Batch update completed: ${Object.keys(batchUpdatedProfile.kcMasteryMap).length} KCs in profile`);
      
      // Final profile update
      setLearnerProfile(batchUpdatedProfile);
      setTestStatus('success');
      addTestResult('🎉 ALL TESTS COMPLETED SUCCESSFULLY! Check console for detailed logs.');
      console.log('🎉 COMPREHENSIVE TEST SUITE COMPLETED SUCCESSFULLY!');
      
    } catch (error) {
      console.error('❌ Supabase integration test failed:', error);
      setTestStatus('error');
      addTestResult(`❌ Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Log detailed error information
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
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-900 to-purple-900 border-blue-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <Database className="w-8 h-8 text-blue-400" />
            Adaptive Practice Module - Refactored Services Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">
            Testing both the refactored StealthAssessmentService and LearnerProfileService integration with real Supabase using test user ID: 
            <code className="bg-gray-800 px-2 py-1 rounded text-green-400 ml-2">{MOCK_USER_ID}</code>
          </p>
          
          <div className="bg-green-900/30 p-4 rounded-lg border border-green-700 mb-4">
            <div className="flex items-center mb-2">
              <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
              <p className="text-green-300 font-medium">Refactored Services Ready ✅</p>
            </div>
            <p className="text-green-200 text-sm">
              Both services are now modularized and ready for testing with the existing Supabase interaction_events table.
            </p>
          </div>
          
          <div className="flex gap-4">
            <Button 
              onClick={testStealthAssessmentService}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {loading ? (
                <>
                  <Zap className="w-4 h-4 mr-2 animate-spin" />
                  Testing Refactored Service...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Test Refactored StealthAssessmentService
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Normal Flow Simulation */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-green-400" />
            Integrated Flow Question Simulation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">
            Test the integrated flow with both interaction logging AND KC mastery updates:
          </p>
          
          <div className="grid md:grid-cols-3 gap-4">
            <Button 
              onClick={() => handleQuestionAnswer('kc_math_g4_add_fractions_likedenom', true)}
              className="bg-green-600 hover:bg-green-700 text-white h-auto p-4"
            >
              <div className="text-center">
                <CheckCircle className="w-6 h-6 mx-auto mb-2" />
                <div className="font-medium">Answer Correctly</div>
                <div className="text-sm opacity-80">Fractions Addition</div>
              </div>
            </Button>
            
            <Button 
              onClick={() => handleQuestionAnswer('kc_math_g4_subtract_fractions_likedenom', false)}
              className="bg-red-600 hover:bg-red-700 text-white h-auto p-4"
            >
              <div className="text-center">
                <AlertCircle className="w-6 h-6 mx-auto mb-2" />
                <div className="font-medium">Answer Incorrectly</div>
                <div className="text-sm opacity-80">Fractions Subtraction</div>
              </div>
            </Button>
            
            <Button 
              onClick={() => handleQuestionAnswer('kc_math_g5_multiply_decimals', true)}
              className="bg-blue-600 hover:bg-blue-700 text-white h-auto p-4"
            >
              <div className="text-center">
                <CheckCircle className="w-6 h-6 mx-auto mb-2" />
                <div className="font-medium">Answer Correctly</div>
                <div className="text-sm opacity-80">Decimals Multiplication</div>
              </div>
            </Button>
          </div>
          
          <div className="mt-4 p-3 bg-blue-900/30 rounded-lg border border-blue-700">
            <p className="text-blue-300 text-sm">
              <strong>Integrated Flow:</strong> Each interaction logs to Supabase AND updates KC mastery in real-time.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              {testStatus === 'success' && <CheckCircle className="w-6 h-6 text-green-400" />}
              {testStatus === 'error' && <AlertCircle className="w-6 h-6 text-red-400" />}
              {testStatus === 'running' && <Zap className="w-6 h-6 text-blue-400 animate-spin" />}
              Service Test Results
            </CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      )}

      {/* Profile Display */}
      {learnerProfile && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-400" />
              Live Learner Profile Data (Updates in Real-Time)
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-white mb-2 flex items-center">
                  <Target className="w-4 h-4 mr-2 text-blue-400" />
                  Knowledge Component Mastery ({Object.keys(learnerProfile.kcMasteryMap).length} KCs)
                </h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {Object.entries(learnerProfile.kcMasteryMap).map(([kcId, mastery]) => (
                    <div key={kcId} className="bg-gray-700 p-3 rounded">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium truncate">{kcId}</span>
                        <span className="text-xs text-gray-400">
                          {mastery.attempts} attempts
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${mastery.masteryLevel * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-300">
                          {(mastery.masteryLevel * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Correct: {mastery.correctAttempts}/{mastery.attempts}
                        {mastery.lastAttemptedTimestamp && (
                          <span className="ml-2">
                            Last: {new Date(mastery.lastAttemptedTimestamp).toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-2 flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2 text-green-400" />
                  Profile Statistics
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>User ID:</span>
                    <span className="text-blue-400 font-mono text-xs">
                      {learnerProfile.userId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Overall Mastery:</span>
                    <span className="text-green-400">
                      {learnerProfile.overallMastery ? `${(learnerProfile.overallMastery * 100).toFixed(1)}%` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Learning Pace:</span>
                    <span className="text-blue-400 capitalize">
                      {learnerProfile.preferences?.learningPace || 'Medium'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Learning Style:</span>
                    <span className="text-purple-400 capitalize">
                      {learnerProfile.preferences?.learningStyle || 'Mixed'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Updated:</span>
                    <span className="text-gray-400">
                      {new Date(learnerProfile.lastUpdatedTimestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Focus KCs:</span>
                    <span className="text-yellow-400">
                      {learnerProfile.currentLearningFocusKcs?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Suggested KCs:</span>
                    <span className="text-cyan-400">
                      {learnerProfile.suggestedNextKcs?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Integration Status */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Database className="w-6 h-6 text-blue-400" />
            Refactored Services Integration Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-green-900/30 p-4 rounded-lg border border-green-700">
              <div className="flex items-center justify-between">
                <span className="text-green-300 font-medium">Interaction Events Table</span>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-green-200 text-sm mt-1">Ready & Active</p>
            </div>
            
            <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-700">
              <div className="flex items-center justify-between">
                <span className="text-blue-300 font-medium">Refactored Service</span>
                <CheckCircle className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-blue-200 text-sm mt-1">Modular Structure</p>
            </div>
            
            <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-700">
              <div className="flex items-center justify-between">
                <span className="text-purple-300 font-medium">Event Logging</span>
                <CheckCircle className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-purple-200 text-sm mt-1">Queue & Batch</p>
            </div>
            
            <div className="bg-yellow-900/30 p-4 rounded-lg border border-yellow-700">
              <div className="flex items-center justify-between">
                <span className="text-yellow-300 font-medium">KC Integration</span>
                <CheckCircle className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-yellow-200 text-sm mt-1">Real-time Updates</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdaptivePracticeModule;
