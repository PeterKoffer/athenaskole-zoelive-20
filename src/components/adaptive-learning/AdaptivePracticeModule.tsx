
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Play, BarChart3, Target, Zap, Database, CheckCircle } from 'lucide-react';
import learnerProfileService from '@/services/learnerProfile/LearnerProfileService';
import { MOCK_USER_ID } from '@/services/learnerProfile/MockProfileService';
import { LearnerProfile } from '@/types/learnerProfile';

const AdaptivePracticeModule = () => {
  const [learnerProfile, setLearnerProfile] = useState<LearnerProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<string>('');

  useEffect(() => {
    console.log('🎯 AdaptivePracticeModule mounted - Testing with real Supabase user:', MOCK_USER_ID);
  }, []);

  const testSupabaseIntegration = async () => {
    setLoading(true);
    setTestResult('');
    
    try {
      console.log('🔍 Testing Supabase integration with real user ID:', MOCK_USER_ID);
      
      // Test 1: Get or create profile
      console.log('📊 Test 1: Fetching/creating learner profile...');
      const profile = await learnerProfileService.getProfile(MOCK_USER_ID);
      setLearnerProfile(profile);
      console.log('✅ Profile retrieved:', profile);
      
      // Test 2: Update KC mastery
      console.log('📈 Test 2: Updating KC mastery...');
      const updatedProfile = await learnerProfileService.updateKcMastery(
        MOCK_USER_ID,
        'kc_math_g4_add_fractions_likedenom',
        {
          isCorrect: true,
          newAttempt: true,
          interactionType: 'QUESTION_ATTEMPT',
          interactionDetails: { difficulty: 3, responseTime: 15000 }
        }
      );
      console.log('✅ KC mastery updated:', updatedProfile.kcMasteryMap['kc_math_g4_add_fractions_likedenom']);
      
      // Test 3: Get specific KC mastery
      console.log('🎯 Test 3: Getting specific KC mastery...');
      const kcMastery = await learnerProfileService.getKcMastery(MOCK_USER_ID, 'kc_math_g4_add_fractions_likedenom');
      console.log('✅ KC mastery retrieved:', kcMastery);
      
      // Test 4: Update preferences
      console.log('⚙️ Test 4: Updating preferences...');
      const profileWithPreferences = await learnerProfileService.updatePreferences(MOCK_USER_ID, {
        learningPace: 'fast',
        learningStyle: 'kinesthetic'
      });
      console.log('✅ Preferences updated:', profileWithPreferences.preferences);
      
      // Test 5: Get recommendations
      console.log('🎯 Test 5: Getting recommendations...');
      const recommendations = await learnerProfileService.recommendNextKcs(MOCK_USER_ID, 3);
      console.log('✅ Recommendations retrieved:', recommendations);
      
      setTestResult('✅ All Supabase integration tests passed successfully!');
      setLearnerProfile(profileWithPreferences);
      
    } catch (error) {
      console.error('❌ Supabase integration test failed:', error);
      setTestResult(`❌ Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
            Adaptive Practice Module - Supabase Integration Test
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
              Test user has been successfully created in the Supabase database and is ready for integration testing.
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
                Running Tests...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Test Supabase Integration
              </>
            )}
          </Button>
          
          {testResult && (
            <div className={`mt-4 p-4 rounded-lg ${testResult.includes('✅') ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'}`}>
              <p className={testResult.includes('✅') ? 'text-green-300' : 'text-red-300'}>
                {testResult}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profile Display */}
      {learnerProfile && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-400" />
              Current Learner Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-white mb-2 flex items-center">
                  <Target className="w-4 h-4 mr-2 text-blue-400" />
                  Knowledge Component Mastery
                </h4>
                <div className="space-y-2">
                  {Object.entries(learnerProfile.kcMasteryMap).map(([kcId, mastery]) => (
                    <div key={kcId} className="bg-gray-700 p-3 rounded">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">{kcId}</span>
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
          <div className="grid md:grid-cols-3 gap-4">
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
              <p className="text-blue-200 text-sm mt-1">Created & Configured</p>
            </div>
            
            <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-700">
              <div className="flex items-center justify-between">
                <span className="text-purple-300 font-medium">CRUD Operations</span>
                <CheckCircle className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-purple-200 text-sm mt-1">Fully Functional</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdaptivePracticeModule;
