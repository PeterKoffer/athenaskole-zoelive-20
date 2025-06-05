
import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Brain } from 'lucide-react';
import { useNelieVoice } from '@/components/adaptive-learning/hooks/useNelieVoice';
import NelieAvatarSection from './NelieAvatarSection';
import LessonProgressHeader from './LessonProgressHeader';
import LessonControlsFooter from './LessonControlsFooter';
import EnhancedActivityRenderer from './EnhancedActivityRenderer';
import { createMathematicsLesson, LessonActivity } from './EnhancedLessonContent';

interface ExtendedLessonManagerProps {
  subject: string;
  skillArea: string;
  onLessonComplete: () => void;
  onBack: () => void;
}

const ExtendedLessonManager = ({
  subject,
  skillArea,
  onLessonComplete,
  onBack
}: ExtendedLessonManagerProps) => {
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [lessonStartTime] = useState(Date.now());
  const [score, setScore] = useState(0);

  const {
    isSpeaking,
    autoReadEnabled,
    isReady,
    speakText,
    toggleMute,
    testSpeech
  } = useNelieVoice();

  // Generate lesson activities
  const [lessonActivities] = useState<LessonActivity[]>(() => {
    return createMathematicsLesson();
  });

  const currentActivity = lessonActivities[currentActivityIndex];
  const timeElapsed = Math.floor((Date.now() - lessonStartTime) / 1000);
  const totalLessonTime = 20 * 60;

  // Test speech when ready
  useEffect(() => {
    if (isReady && autoReadEnabled) {
      setTimeout(() => {
        testSpeech();
      }, 1000);
    }
  }, [isReady, autoReadEnabled, testSpeech]);

  // Auto-speak activity content
  useEffect(() => {
    if (currentActivity && autoReadEnabled && isReady) {
      console.log('🎯 New activity - Nelie will speak:', currentActivity.title);
      
      setTimeout(() => {
        let speechText = '';
        
        if (currentActivity.type === 'explanation') {
          speechText = `Let me explain: ${currentActivity.content.text}`;
        } else if (currentActivity.type === 'question') {
          speechText = `Here's your question: ${currentActivity.content.question}`;
        } else if (currentActivity.type === 'welcome') {
          speechText = currentActivity.content.message;
        } else {
          speechText = `Let's work on: ${currentActivity.title}`;
        }
        
        if (speechText) {
          console.log('🔊 Auto-speaking activity');
          speakText(speechText, true);
        }
      }, 1500);
    }
  }, [currentActivityIndex, currentActivity, autoReadEnabled, isReady, speakText]);

  const handleActivityComplete = useCallback((wasCorrect?: boolean) => {
    if (wasCorrect === true) {
      setScore(prev => prev + 10);
      
      const celebrations = [
        "Fantastic work! You're absolutely brilliant!",
        "Amazing! You're becoming such a great learner!"
      ];
      
      setTimeout(() => {
        const celebration = celebrations[Math.floor(Math.random() * celebrations.length)];
        speakText(celebration, true);
      }, 1000);
    }

    setTimeout(() => {
      if (currentActivityIndex < lessonActivities.length - 1) {
        setCurrentActivityIndex(prev => prev + 1);
      } else {
        setTimeout(() => {
          speakText("You've completed your lesson! Amazing work!", true);
        }, 1000);
        
        setTimeout(() => {
          onLessonComplete();
        }, 4000);
      }
    }, 2000);
  }, [currentActivityIndex, lessonActivities.length, onLessonComplete, speakText]);

  const handleReadQuestion = useCallback(() => {
    if (currentActivity) {
      if (isSpeaking) {
        console.log('🔇 User requested to stop Nelie');
        // Don't stop here - let them hear it out
        return;
      }
      
      let speechText = '';
      
      if (currentActivity.type === 'explanation') {
        speechText = `Let me explain: ${currentActivity.content.text}`;
      } else if (currentActivity.type === 'question') {
        speechText = `Here's your question: ${currentActivity.content.question}`;
      } else if (currentActivity.type === 'welcome') {
        speechText = currentActivity.content.message;
      } else {
        speechText = `Let me read this for you: ${currentActivity.title}`;
      }
      
      console.log('🔊 Manual repeat request:', speechText.substring(0, 50));
      speakText(speechText, true);
    }
  }, [currentActivity, isSpeaking, speakText]);

  if (!currentActivity) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-8 text-center text-white">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p>Loading your lesson...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <LessonProgressHeader
        timeElapsed={timeElapsed}
        score={score}
        currentActivityIndex={currentActivityIndex}
        totalActivities={lessonActivities.length}
      />

      {/* Nelie Avatar */}
      <NelieAvatarSection 
        subject={subject} 
        currentQuestionIndex={currentActivityIndex} 
        totalQuestions={lessonActivities.length} 
        isSpeaking={isSpeaking} 
        autoReadEnabled={autoReadEnabled} 
        onMuteToggle={toggleMute} 
        onReadQuestion={handleReadQuestion} 
      />

      {/* Activity Content */}
      <EnhancedActivityRenderer
        activity={currentActivity}
        onActivityComplete={handleActivityComplete}
        isNelieReady={isReady}
      />

      {/* Controls */}
      <LessonControlsFooter
        timeElapsed={timeElapsed}
        totalLessonTime={totalLessonTime}
        onBack={onBack}
      />
    </div>
  );
};

export default ExtendedLessonManager;
