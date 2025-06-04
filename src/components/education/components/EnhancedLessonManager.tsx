
import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useReliableSpeech } from '@/components/adaptive-learning/hooks/useReliableSpeech';
import { createMathematicsLesson, createEnglishLesson, createScienceLesson, LessonActivity } from './EnhancedLessonContent';
import NelieAvatarSection from './NelieAvatarSection';
import LessonProgressHeader from './LessonProgressHeader';
import EnhancedActivityRenderer from './EnhancedActivityRenderer';

interface EnhancedLessonManagerProps {
  subject: string;
  skillArea: string;
  onLessonComplete: () => void;
  onBack: () => void;
}

const EnhancedLessonManager = ({
  subject,
  skillArea,
  onLessonComplete,
  onBack
}: EnhancedLessonManagerProps) => {
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [lessonStartTime] = useState(Date.now());
  const [score, setScore] = useState(0);
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState(0);

  const {
    isSpeaking,
    autoReadEnabled,
    speakText,
    stopSpeaking,
    toggleMute,
    isReady
  } = useReliableSpeech();

  // Generate lesson content based on subject
  const generateLessonActivities = useCallback((): LessonActivity[] => {
    switch (subject.toLowerCase()) {
      case 'mathematics':
        return createMathematicsLesson();
      case 'english':
        return createEnglishLesson();
      case 'science':
        return createScienceLesson();
      default:
        return createMathematicsLesson(); // fallback
    }
  }, [subject]);

  const [lessonActivities] = useState(generateLessonActivities());
  const currentActivity = lessonActivities[currentActivityIndex];
  const timeElapsed = Math.floor((Date.now() - lessonStartTime) / 1000);

  // Auto-speak when activity changes
  useEffect(() => {
    if (currentActivity && autoReadEnabled && isReady) {
      console.log('🎯 New activity, Nelie will speak:', currentActivity.title);
      
      // Small delay to ensure UI is ready
      setTimeout(() => {
        speakText(currentActivity.speech, true); // High priority speech
      }, 1000);
    }
  }, [currentActivityIndex, autoReadEnabled, isReady, currentActivity, speakText]);

  const handleActivityComplete = useCallback((wasCorrect?: boolean) => {
    console.log('✅ Activity completed, wasCorrect:', wasCorrect);
    
    if (wasCorrect === true) {
      setTotalCorrectAnswers(prev => prev + 1);
      setScore(prev => prev + 10);
      
      // Nelie celebrates correct answers
      const celebrations = [
        "Fantastic work! You're absolutely brilliant!",
        "Amazing! You're becoming such a great learner!",
        "Wonderful! Your thinking is incredible!",
        "Excellent! I'm so proud of you!",
        "Outstanding! You're a true champion!"
      ];
      
      setTimeout(() => {
        const celebration = celebrations[Math.floor(Math.random() * celebrations.length)];
        speakText(celebration);
      }, 1500);
    }

    // Move to next activity after a brief pause
    setTimeout(() => {
      if (currentActivityIndex < lessonActivities.length - 1) {
        console.log('📍 Moving to next activity');
        setCurrentActivityIndex(prev => prev + 1);
      } else {
        console.log('🎉 Lesson complete!');
        
        // Final celebration from Nelie
        setTimeout(() => {
          speakText("You've completed your lesson! You did absolutely amazing work today. I'm so proud of how much you've learned!", true);
        }, 1000);
        
        setTimeout(() => {
          onLessonComplete();
        }, 3000);
      }
    }, 1000);
  }, [currentActivityIndex, lessonActivities.length, onLessonComplete, speakText]);

  const handleReadRequest = useCallback(() => {
    if (currentActivity) {
      if (isSpeaking) {
        stopSpeaking();
      } else {
        speakText(currentActivity.speech, true);
      }
    }
  }, [currentActivity, isSpeaking, speakText, stopSpeaking]);

  const handleMuteToggle = useCallback(() => {
    toggleMute();
  }, [toggleMute]);

  if (!currentActivity) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-8 text-center text-white">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Nelie is preparing your amazing lesson...</p>
        </CardContent>
      </Card>
    );
  }

  const progressPercentage = ((currentActivityIndex + 1) / lessonActivities.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <LessonProgressHeader
        timeElapsed={timeElapsed}
        score={score}
        currentActivityIndex={currentActivityIndex}
        totalActivities={lessonActivities.length}
      />

      {/* Nelie Avatar Section */}
      <NelieAvatarSection 
        subject={subject} 
        currentQuestionIndex={currentActivityIndex} 
        totalQuestions={lessonActivities.length} 
        isSpeaking={isSpeaking} 
        autoReadEnabled={autoReadEnabled} 
        onMuteToggle={handleMuteToggle} 
        onReadQuestion={handleReadRequest} 
      />

      {/* Progress Bar */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-medium">Lesson Progress</span>
            <span className="text-gray-300">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <span>Activity {currentActivityIndex + 1} of {lessonActivities.length}</span>
            <span>{currentActivity.title}</span>
          </div>
        </CardContent>
      </Card>

      {/* Activity Content */}
      <EnhancedActivityRenderer
        activity={currentActivity}
        onActivityComplete={handleActivityComplete}
        isNelieReady={isReady}
      />
    </div>
  );
};

export default EnhancedLessonManager;
