
import { useState, useEffect } from 'react';
import { Brain } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import { useOptimizedLessonManager } from '../hooks/useOptimizedLessonManager';
import OptimizedQuestionActivity from '../OptimizedQuestionActivity';
import NelieIntroduction from '../NelieIntroduction';
import MathLessonHeader from './MathLessonHeader';
import MathLessonControlPanel from './MathLessonControlPanel';
import MentalMathStrategies from './MentalMathStrategies';
import MathLessonContentRenderer from './MathLessonContentRenderer';

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
        <MathLessonHeader
          studentName={studentName}
          timeElapsed={timeElapsed}
          targetLessonLength={targetLessonLength}
          score={score}
          currentActivityIndex={currentActivityIndex}
          totalRealActivities={totalRealActivities}
          correctStreak={correctStreak}
          onBackToProgram={handleBackToProgram}
        />

        <MathLessonControlPanel
          isSpeaking={isSpeaking}
          onToggleMute={toggleMute}
          onReadRequest={handleReadRequest}
          onStopSpeaking={stopSpeaking}
        />

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
                  <>
                    {currentActivity.title?.toLowerCase().includes('mental math strategies') ? (
                      <MentalMathStrategies
                        studentName={studentName}
                        onComplete={() => handleActivityComplete()}
                      />
                    ) : (
                      <MathLessonContentRenderer
                        activity={currentActivity}
                        studentName={studentName}
                        onComplete={() => handleActivityComplete()}
                      />
                    )}
                  </>
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
