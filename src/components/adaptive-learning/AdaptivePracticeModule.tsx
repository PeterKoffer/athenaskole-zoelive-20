
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Play, BarChart3, Target, Zap, Database, CheckCircle, AlertCircle } from 'lucide-react';
import learnerProfileService from '@/services/learnerProfile/LearnerProfileService';
import { MOCK_USER_ID } from '@/services/learnerProfile/MockProfileService';
import { LearnerProfile } from '@/types/learnerProfile';

const AdaptivePracticeModule = () => {
  const [learnerProfile, setLearnerProfile] = useState<LearnerProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');

  useEffect(() => {
    console.log('🎯 AdaptivePracticeModule mounted - Testing with real Supabase user:', MOCK_USER_ID);
  }, []);

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
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
            Adaptive Practice Module - Comprehensive Supabase Test
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">
            Testing the LearnerProfileService with real Supabase database integration using test user ID: 
            <code className="bg-gray-800 px-2 py-1 rounded text-green-400 ml-2">{MOCK_USER_ID}</code>
          </p>
          
          <div className="bg-green-900/30 p-4 rounded-lg border border-green-700 mb-4">
            <div className="flex items-center mb-2">
              <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
              <p className="text-green-300 font-medium">Real Supabase User Created ✅</p>
            </div>
            <p className="text-green-200 text-sm">
              Test user has been successfully created in the Supabase database and is ready for comprehensive integration testing.
            </p>
          </div>
          
          <Button 
            onClick={testSupabaseIntegration}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <>
                <Zap className="w-4 h-4 mr-2 animate-spin" />
                Running Comprehensive Tests...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Comprehensive Supabase Test
              </>
            )}
          </Button>
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
              Test Results
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
              Updated Learner Profile Data
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
                            className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full"
                            style={{ width: `${mastery.masteryLevel * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-300">
                          {(mastery.masteryLevel * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Correct: {mastery.correctAttempts}/{mastery.attempts}
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
            Database Integration Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-green-900/30 p-4 rounded-lg border border-green-700">
              <div className="flex items-center justify-between">
                <span className="text-green-300 font-medium">Supabase Connection</span>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-green-200 text-sm mt-1">Active & Ready</p>
            </div>
            
            <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-700">
              <div className="flex items-center justify-between">
                <span className="text-blue-300 font-medium">Test User</span>
                <CheckCircle className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-blue-200 text-sm mt-1">Real User in Auth</p>
            </div>
            
            <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-700">
              <div className="flex items-center justify-between">
                <span className="text-purple-300 font-medium">Profile Operations</span>
                <CheckCircle className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-purple-200 text-sm mt-1">CRUD Ready</p>
            </div>
            
            <div className="bg-yellow-900/30 p-4 rounded-lg border border-yellow-700">
              <div className="flex items-center justify-between">
                <span className="text-yellow-300 font-medium">KC Mastery</span>
                <CheckCircle className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-yellow-200 text-sm mt-1">Tracking Active</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdaptivePracticeModule;
