
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, RefreshCw, Loader2, AlertTriangle, Info, Brain, Play, BarChart3, Target, Zap, Database, CheckCircle, AlertCircle } from 'lucide-react';
import learnerProfileService from '@/services/learnerProfile/LearnerProfileService';
import { knowledgeComponentService } from '@/services/knowledgeComponentService';
import { aiCreativeDirectorService } from '@/services/aiCreativeDirectorService';
// Import the refactored service
import stealthAssessmentService from '@/services/stealthAssessment/StealthAssessmentService';
import { InteractionEventType } from '@/types/stealthAssessment';
import { MOCK_USER_ID } from '@/services/learnerProfile/MockProfileService';
import { LearnerProfile } from '@/types/learnerProfile';
import type { KnowledgeComponent } from '@/types/learner';
import type { AtomSequence, ContentAtom } from '@/types/content';
import type { QuestionAttemptEvent } from '@/types/interaction';
import TextExplanationAtom from './atoms/TextExplanationAtom';
import QuestionCard from './cards/QuestionCard';

const AdaptivePracticeModule: React.FC = () => {
  // Core learning states
  const [learnerProfile, setLearnerProfile] = useState<LearnerProfile | null>(null);
  const [currentKc, setCurrentKc] = useState<KnowledgeComponent | null>(null);
  const [atomSequence, setAtomSequence] = useState<AtomSequence | null>(null);
  const [currentAtomIndex, setCurrentAtomIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionKcs, setSessionKcs] = useState<KnowledgeComponent[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  // Testing states for service integration
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [showServiceTests, setShowServiceTests] = useState(false);

  useEffect(() => {
    console.log('🎯 AdaptivePracticeModule mounted - Using refactored StealthAssessmentService');
    loadLearnerProfile();
  }, []);

  const loadLearnerProfile = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      console.log("AdaptivePracticeModule: Fetching learner profile for user:", MOCK_USER_ID);
      const profile = await learnerProfileService.getProfile(MOCK_USER_ID);
      setLearnerProfile(profile);
      console.log("AdaptivePracticeModule: Learner profile loaded:", profile);
    } catch (err) {
      console.error("AdaptivePracticeModule: Error loading learner profile:", err);
      setError("Failed to load learner profile. Please try again.");
      setIsLoading(false);
    }
  }, []);

  const recommendAndLoadNextKc = useCallback(async (profile: LearnerProfile) => {
    try {
      setError(null);
      setIsLoading(true);
      console.log("AdaptivePracticeModule: Recommending next KC for profile:", profile);
      const recommendedKcs = await knowledgeComponentService.recommendNextKcs(profile.userId, 1, sessionKcs.map(kc => kc.kc_id));

      if (recommendedKcs.length === 0) {
        console.warn("AdaptivePracticeModule: No more KCs to recommend or all attempted in this session.");
        setError("No more new Knowledge Components to practice in this session, or an error occurred fetching them. Try refreshing or starting a new session later.");
        setCurrentKc(null);
        setAtomSequence(null);
        setIsLoading(false);
        return;
      }
      const nextKc = recommendedKcs[0];
      console.log("AdaptivePracticeModule: Next KC recommended:", nextKc);
      setCurrentKc(nextKc);
      setSessionKcs(prevKcs => [...prevKcs, nextKc]);

      console.log("AdaptivePracticeModule: Requesting atom sequence for KC:", nextKc.kc_id);
      const sequence = await aiCreativeDirectorService.getAtomSequenceForKc(nextKc.kc_id, profile.userId);
      setAtomSequence(sequence);
      setCurrentAtomIndex(0);
      setShowFeedback(false);
      console.log("AdaptivePracticeModule: Atom sequence received:", sequence);
      if (!sequence || sequence.atoms.length === 0) {
        console.warn("AdaptivePracticeModule: No atoms found for KC:", nextKc.kc_id);
        setError(`No content atoms found for the topic: ${nextKc.name}. Try another topic or check content availability.`);
      }
    } catch (err) {
      console.error("AdaptivePracticeModule: Error recommending or loading KC/atoms:", err);
      setError("Failed to load new content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [sessionKcs]);

  useEffect(() => {
    if (learnerProfile && !currentKc && !isLoading && !error) {
      console.log("AdaptivePracticeModule: Learner profile loaded, attempting to recommend KC.");
      recommendAndLoadNextKc(learnerProfile);
    }
  }, [learnerProfile, currentKc, isLoading, error, recommendAndLoadNextKc]);

  const handleNextAtom = () => {
    setShowFeedback(false);
    if (atomSequence && currentAtomIndex < atomSequence.atoms.length - 1) {
      setCurrentAtomIndex(prevIndex => prevIndex + 1);
    } else if (learnerProfile) {
      console.log("AdaptivePracticeModule: End of sequence, recommending next KC.");
      recommendAndLoadNextKc(learnerProfile);
    }
  };

  const handleQuestionAnswer = async (atom: ContentAtom, answerGiven: string | string[], isCorrectAnswer: boolean) => {
    if (!currentKc || !learnerProfile) {
      console.error("AdaptivePracticeModule: Cannot handle answer - missing KC or profile.");
      return;
    }

    console.log("AdaptivePracticeModule: Question answered. KC:", currentKc.kc_id, "Atom:", atom.atom_id, "Correct:", isCorrectAnswer);

    try {
      // Log the interaction using the refactored service
      await stealthAssessmentService.logQuestionAttempt({
        questionId: atom.atom_id,
        knowledgeComponentIds: atom.kc_ids && atom.kc_ids.length > 0 ? atom.kc_ids : [currentKc.kc_id],
        answerGiven: Array.isArray(answerGiven) ? answerGiven.join(', ') : answerGiven,
        isCorrect: isCorrectAnswer,
        timeTakenMs: Math.floor(Math.random() * 20000) + 5000,
        attemptsMade: 1
      }, 'adaptive-practice-module');

      // Update KC mastery (this is what would happen in real flow)
      console.log('📈 Updating KC mastery via LearnerProfileService...');
      const updatedProfile = await learnerProfileService.updateKcMastery(
        MOCK_USER_ID,
        currentKc.kc_id,
        {
          isCorrect: isCorrectAnswer,
          newAttempt: true,
          interactionType: 'QUESTION_ATTEMPT',
          interactionDetails: { 
            difficulty: 3, 
            responseTime: Math.floor(Math.random() * 20000) + 5000,
            atomId: atom.atom_id,
            timestamp: Date.now()
          }
        }
      );

      setLearnerProfile(updatedProfile);
      console.log("AdaptivePracticeModule: Profile updated after question submission:", updatedProfile);

    } catch (logError) {
      console.error("AdaptivePracticeModule: Error logging question attempt or updating profile:", logError);
    }

    setIsCorrect(isCorrectAnswer);
    const feedbackContent = atom.content as any;
    setFeedbackMessage(isCorrectAnswer ?
      (feedbackContent.correctFeedback || "Correct!") :
      (feedbackContent.generalIncorrectFeedback || "Not quite. Let's review.")
    );
    setShowFeedback(true);
  };

  // Service testing functions
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

  const currentAtom = atomSequence?.atoms[currentAtomIndex];

  // Show service testing interface if enabled
  if (showServiceTests) {
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
                onClick={() => setShowServiceTests(false)}
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
  }

  if (isLoading && !currentAtom && !error) {
    return (
      <Card className="w-full max-w-2xl mx-auto mt-10 shadow-xl bg-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center text-blue-300">Loading Adaptive Practice...</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-16 w-16 animate-spin text-blue-400 mb-6" />
          <p className="text-lg">Preparing your learning experience...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-2xl mx-auto mt-10 shadow-xl bg-red-900/20 border-red-700 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center text-red-300 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 mr-3" /> Error
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-10">
          <p className="text-lg mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => {
                setError(null);
                setIsLoading(true);
                if (learnerProfile) {
                  recommendAndLoadNextKc(learnerProfile);
                } else {
                  loadLearnerProfile();
                }
              }}
              variant="destructive" className="bg-red-500 hover:bg-red-600"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Try Again
            </Button>
            <Button
              onClick={() => setShowServiceTests(true)}
              variant="outline"
              className="text-white border-white"
            >
              <Database className="h-5 w-5 mr-2" />
              Service Tests
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isLoading && (!currentKc || !currentAtom)) {
    return (
      <Card className="w-full max-w-2xl mx-auto mt-10 shadow-xl bg-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center text-yellow-300">No Content Available</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-10">
          <Info className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <p className="text-lg mb-6">No learning content could be loaded at this moment. This might be because all available content has been completed or there's an issue fetching new material.</p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => {
                setError(null);
                setIsLoading(true);
                if (learnerProfile) recommendAndLoadNextKc(learnerProfile); else loadLearnerProfile();
              }}
              variant="outline"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Refresh Content
            </Button>
            <Button
              onClick={() => setShowServiceTests(true)}
              variant="outline"
              className="text-white border-white"
            >
              <Database className="h-5 w-5 mr-2" />
              Service Tests
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentAtom) {
    return (
      <Card className="w-full max-w-2xl mx-auto mt-10 shadow-xl bg-yellow-900/20 border-yellow-700 text-white">
        <CardHeader><CardTitle className="text-yellow-300">Preparing Content...</CardTitle></CardHeader>
        <CardContent><Loader2 className="h-8 w-8 animate-spin text-yellow-400" /></CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-4 md:mt-8 shadow-2xl bg-slate-800 text-slate-50 border border-slate-700">
      <CardHeader className="pb-4 bg-slate-700/50 rounded-t-lg">
        <CardTitle className="text-xl md:text-2xl font-bold text-center text-sky-300">
          Adaptive Practice: {currentKc.name}
        </CardTitle>
        {learnerProfile && currentKc && learnerProfile.kcMasteryMap[currentKc.kc_id] && (
          <p className="text-xs text-center text-slate-400 mt-1">
            User: {learnerProfile.userId} | KC Mastery: {learnerProfile.kcMasteryMap[currentKc.kc_id].masteryLevel.toFixed(2)}
          </p>
        )}
        <div className="flex justify-center mt-2">
          <Button
            onClick={() => setShowServiceTests(true)}
            variant="outline"
            size="sm"
            className="text-xs text-slate-300 border-slate-500"
          >
            <Database className="h-3 w-3 mr-1" />
            Service Tests
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 md:p-6 min-h-[200px] md:min-h-[300px] relative">
        {isLoading && currentAtom && (
          <div className="absolute inset-0 bg-slate-800/70 flex flex-col items-center justify-center z-10 rounded-b-lg">
            <Loader2 className="h-12 w-12 animate-spin text-sky-400" />
            <p className="mt-3 text-sky-200">Loading next item...</p>
          </div>
        )}

        {!isLoading && currentAtom.atom_type === 'TEXT_EXPLANATION' && (
          <TextExplanationAtom atom={currentAtom} />
        )}
        {!isLoading && currentAtom.atom_type === 'QUESTION_MULTIPLE_CHOICE' && (
          <QuestionCard
            key={currentAtom.atom_id}
            atom={currentAtom}
            onSubmitAnswer={(answer, isCorrectAnswer) => handleQuestionAnswer(currentAtom, answer, isCorrectAnswer)}
            disabled={showFeedback || isLoading}
          />
        )}

        {showFeedback && (
          <div className={`mt-4 p-3 rounded-md text-sm ${isCorrect ? 'bg-green-700/30 border border-green-500 text-green-200' : 'bg-red-700/30 border border-red-500 text-red-200'}`}>
            <p><strong>{isCorrect ? "Correct!" : "Review:"}</strong> {feedbackMessage}</p>
          </div>
        )}
      </CardContent>
      <div className="px-4 md:px-6 py-4 border-t border-slate-700 flex justify-end bg-slate-700/30 rounded-b-lg">
        <Button
          onClick={handleNextAtom}
          disabled={isLoading || (currentAtom.atom_type === 'QUESTION_MULTIPLE_CHOICE' && !showFeedback)}
          className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out transform hover:scale-105 disabled:opacity-60 disabled:transform-none disabled:shadow-none"
        >
          {isLoading && (!currentKc || !currentAtom || currentAtomIndex === (atomSequence?.atoms.length || 0) -1) ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Next'}
          {(!isLoading || (currentKc && currentAtom && currentAtomIndex < (atomSequence?.atoms.length || 0) -1)) && <ArrowRight className="h-5 w-5 ml-2" />}
        </Button>
      </div>
    </Card>
  );
};

export default AdaptivePracticeModule;
