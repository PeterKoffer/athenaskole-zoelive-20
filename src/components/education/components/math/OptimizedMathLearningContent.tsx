
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Target, Brain } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import { useOptimizedLessonManager } from '../hooks/useOptimizedLessonManager';
import OptimizedQuestionActivity from '../OptimizedQuestionActivity';
import NelieIntroduction from '../NelieIntroduction';

interface OptimizedMathLearningContentProps {
  onBackToProgram: () => void;
}

const OptimizedMathLearningContent = ({ onBackToProgram }: OptimizedMathLearningContentProps) => {
  const { user } = useAuth();
  const [showIntroduction, setShowIntroduction] = useState(true);
  const [studentName, setStudentName] = useState('Student');
  const { stop: stopSpeaking } = useUnifiedSpeech();

  // Fetch student's name
  useEffect(() => {
    const fetchStudentName = async () => {
      if (!user?.id) return;

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name')
          .eq('user_id', user.id)
          .single();

        if (profile?.name) {
          setStudentName(profile.name.split(' ')[0]); // Use first name
        } else if (user.user_metadata?.name) {
          setStudentName(user.user_metadata.name.split(' ')[0]);
        }
      } catch (error) {
        console.log('Could not fetch student name, using default');
        if (user.user_metadata?.name) {
          setStudentName(user.user_metadata.name.split(' ')[0]);
        }
      }
    };

    fetchStudentName();
  }, [user]);

  // Stop speech when component unmounts or user navigates away
  useEffect(() => {
    const handleBeforeUnload = () => {
      stopSpeaking();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopSpeaking();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopSpeaking(); // Stop speech when component unmounts
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [stopSpeaking]);

  const {
    currentActivityIndex,
    currentActivity,
    totalRealActivities,
    timeElapsed,
    score,
    correctStreak,
    targetLessonLength,
    isInitializing,
    handleActivityComplete,
    handleReadRequest,
    isSpeaking,
    toggleMute
  } = useOptimizedLessonManager({
    subject: 'mathematics',
    skillArea: 'general_math',
    onLessonComplete: () => {
      stopSpeaking(); // Stop speech before navigating back
      onBackToProgram();
    }
  });

  const handleBackToProgram = () => {
    stopSpeaking(); // Stop speech before navigating back
    onBackToProgram();
  };

  const handleIntroductionComplete = () => {
    console.log('🎭 Introduction completed, starting optimized lesson');
    setShowIntroduction(false);
  };

  // Show introduction first
  if (showIntroduction) {
    return (
      <div className="min-h-screen w-full bg-gray-900 text-white">
        <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
          <NelieIntroduction
            subject="mathematics"
            skillArea="general_math"
            onIntroductionComplete={handleIntroductionComplete}
          />
        </div>
      </div>
    );
  }

  // Show loading state during initialization
  if (isInitializing) {
    return (
      <div className="min-h-screen w-full bg-gray-900 text-white">
        <div className="w-full max-w-4xl mx-auto px-4 py-6">
          <div className="bg-gray-800 border-gray-700 rounded-lg p-8 text-center">
            <Brain className="w-12 h-12 text-blue-400 animate-pulse mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Preparing Your Math Lesson</h3>
            <p className="text-gray-400">Setting up your personalized learning experience, {studentName}...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white">
      <div className="w-full space-y-0">
        {/* Header with student's name - Full width purple header */}
        <div className="w-full bg-gradient-to-r from-purple-900 to-blue-900 border-b border-purple-400">
          <div className="w-full max-w-4xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                onClick={handleBackToProgram}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Program
              </Button>
              
              <div className="flex items-center space-x-6 text-white">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')} / {targetLessonLength}:00</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>Score: {score}</span>
                </div>
                
                <div className="text-sm">
                  Activity {currentActivityIndex + 1} of {totalRealActivities}
                </div>
              </div>
            </div>
            
            <div className="text-center mt-4">
              <h1 className="text-xl font-bold text-white">
                Mathematics with Nelie - {studentName}'s Lesson
                {correctStreak > 0 && (
                  <span className="ml-2 text-green-400">🔥 {correctStreak} streak!</span>
                )}
              </h1>
            </div>
          </div>
        </div>

        {/* Control Panel - Full width dark section */}
        <div className="w-full bg-gray-800 border-b border-gray-700">
          <div className="w-full max-w-4xl mx-auto px-4 py-4">
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={toggleMute}
                className="border-purple-400 text-purple-200 bg-gray-700/50"
              >
                {isSpeaking ? 'Mute Nelie' : 'Unmute Nelie'}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleReadRequest}
                className="border-blue-400 text-blue-200 bg-gray-700/50"
              >
                Ask Nelie to Repeat
              </Button>
              
              {isSpeaking && (
                <Button
                  variant="outline"
                  onClick={stopSpeaking}
                  className="border-red-400 text-red-200 bg-gray-700/50"
                >
                  Stop Nelie
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Current Activity Content - Full width content area */}
        <div className="w-full px-4 py-6">
          <div className="w-full max-w-4xl mx-auto">
            {currentActivity ? (
              <div className="space-y-6">
                {currentActivity.type === 'interactive-game' ? (
                  <OptimizedQuestionActivity
                    subject="mathematics"
                    skillArea="general_math"
                    difficultyLevel={2}
                    onComplete={handleActivityComplete}
                    questionNumber={currentActivityIndex + 1}
                    totalQuestions={totalRealActivities}
                  />
                ) : (
                  // Content delivery activities - Remove card wrapper
                  <div className="bg-gray-800 border-gray-700 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">{currentActivity.title}</h2>
                    
                    <div className="text-gray-300 space-y-4">
                      {currentActivity.content?.text && (
                        <p className="text-lg leading-relaxed">{currentActivity.content.text}</p>
                      )}
                      
                      {currentActivity.content?.examples && (
                        <div className="bg-blue-900/30 rounded-lg p-4">
                          <h4 className="font-semibold text-blue-200 mb-2">Examples for {studentName}:</h4>
                          <ul className="space-y-2">
                            {currentActivity.content.examples.map((example: string, index: number) => (
                              <li key={index} className="text-blue-100">• {example}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6 text-center">
                      <Button
                        onClick={() => handleActivityComplete()}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8"
                      >
                        Continue, {studentName}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-red-900/50 border border-red-700 rounded-lg p-8 text-center">
                <h3 className="text-xl font-semibold text-white mb-2">No Content Available</h3>
                <p className="text-red-300">Please try refreshing the lesson, {studentName}.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizedMathLearningContent;
