import { Card, CardContent } from '@/components/ui/card';
import { useExtendedLessonManager } from './hooks/useExtendedLessonManager';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import NelieAvatarSection from './NelieAvatarSection';
import LessonProgressHeader from './LessonProgressHeader';
import LessonProgressSection from './LessonProgressSection';
import LessonActivitySpeechManager from './LessonActivitySpeechManager';
import EnhancedActivityRenderer from './EnhancedActivityRenderer';
import SpeechTestCard from './SpeechTestCard';
import { useConsolidatedSpeech } from '@/hooks/useConsolidatedSpeech';
import { useCallback, useEffect } from 'react';

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
  const { isAdmin } = useRoleAccess();
  
  // Use consolidated speech instead of the complex lesson manager speech
  const consolidatedSpeech = useConsolidatedSpeech();
  
  const {
    currentActivityIndex,
    lessonActivities,
    currentActivity,
    timeElapsed,
    score,
    questionsGenerated,
    targetLessonLength,
    handleActivityComplete,
    handleReadRequest
  } = useExtendedLessonManager({
    subject,
    skillArea,
    onLessonComplete
  });

  // Enable user interaction on any click in the lesson area
  useEffect(() => {
    const handleUserInteraction = () => {
      if (!consolidatedSpeech.hasUserInteracted) {
        consolidatedSpeech.enableUserInteraction();
        console.log('✅ User interaction enabled for speech');
      }
    };

    // Add click listener to document
    document.addEventListener('click', handleUserInteraction, { once: true });
    
    return () => {
      document.removeEventListener('click', handleUserInteraction);
    };
  }, [consolidatedSpeech]);

  // Test speech when ready and user has interacted
  useEffect(() => {
    if (consolidatedSpeech.isReady && consolidatedSpeech.hasUserInteracted && consolidatedSpeech.isEnabled) {
      // Brief delay to ensure everything is ready
      setTimeout(() => {
        consolidatedSpeech.speak("Hello! I'm Nelie, your learning companion. I'm here to help guide you through today's lesson!", true);
      }, 2000);
    }
  }, [consolidatedSpeech.isReady, consolidatedSpeech.hasUserInteracted, consolidatedSpeech.isEnabled]);

  const handleMuteToggle = useCallback(() => {
    consolidatedSpeech.toggleEnabled();
  }, [consolidatedSpeech]);

  const handleReadRequestWrapper = useCallback(() => {
    if (currentActivity) {
      let speechText = '';
      
      if (currentActivity.phase === 'content-delivery') {
        speechText = `Let me explain: ${currentActivity.content.segments?.[0]?.explanation || currentActivity.content.text || currentActivity.title}`;
      } else if (currentActivity.phase === 'interactive-game') {
        speechText = `Here's your question: ${currentActivity.content.question || 'Take your time to think about this.'}`;
      } else if (currentActivity.phase === 'introduction') {
        speechText = currentActivity.content.hook || currentActivity.title;
      } else {
        speechText = `Let me read this for you: ${currentActivity.title}`;
      }
      
      if (speechText.trim()) {
        consolidatedSpeech.speak(speechText, true);
      }
    }
  }, [currentActivity, consolidatedSpeech]);

  if (!currentActivity) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-8 text-center text-white">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Nelie is preparing your {targetLessonLength}-minute lesson...</p>
          {questionsGenerated > 0 && (
            <p className="text-sm text-gray-400 mt-2">
              Generated {questionsGenerated} questions so far
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4">
      {/* Speech Test Card - only show for admin users */}
      {isAdmin() && <SpeechTestCard />}

      {/* Progress Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <LessonProgressHeader
          timeElapsed={timeElapsed}
          score={score}
          currentActivityIndex={currentActivityIndex}
          totalActivities={lessonActivities.length}
        />
      </div>

      {/* Lesson info card */}
      <Card className="bg-blue-900/20 border-blue-700">
        <CardContent className="p-4 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm">
            <span className="text-blue-300">
              {targetLessonLength}-minute lesson
            </span>
            <span className="hidden sm:inline text-blue-400">•</span>
            <span className="text-blue-400">
              {questionsGenerated} questions generated
            </span>
          </div>
          <p className="text-blue-400 text-xs mt-1">
            Adaptive content that grows with your learning
          </p>
        </CardContent>
      </Card>

      {/* User Interaction Prompt */}
      {!consolidatedSpeech.hasUserInteracted && (
        <Card className="bg-yellow-900/20 border-yellow-700">
          <CardContent className="p-4 text-center">
            <p className="text-yellow-300">
              👆 Click anywhere to enable Nelie's voice guidance!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Nelie Avatar Section */}
      <div className="flex justify-center">
        <NelieAvatarSection 
          subject={subject} 
          currentQuestionIndex={currentActivityIndex} 
          totalQuestions={lessonActivities.length} 
          isSpeaking={consolidatedSpeech.isSpeaking} 
          autoReadEnabled={consolidatedSpeech.isEnabled} 
          onMuteToggle={handleMuteToggle} 
          onReadQuestion={handleReadRequestWrapper} 
        />
      </div>

      {/* Progress Bar */}
      <LessonProgressSection
        currentActivityIndex={currentActivityIndex}
        totalActivities={lessonActivities.length}
        currentActivityTitle={currentActivity.title}
      />

      {/* Speech Manager - handles auto-speaking when activities change */}
      <LessonActivitySpeechManager
        currentActivity={currentActivity}
        currentActivityIndex={currentActivityIndex}
        autoReadEnabled={consolidatedSpeech.isEnabled && consolidatedSpeech.hasUserInteracted}
        isReady={consolidatedSpeech.isReady && consolidatedSpeech.hasUserInteracted}
        speakText={consolidatedSpeech.speak}
        stopSpeaking={consolidatedSpeech.stop}
      />

      {/* Activity Content */}
      <div className="w-full">
        <EnhancedActivityRenderer
          activity={currentActivity}
          onActivityComplete={handleActivityComplete}
          isNelieReady={consolidatedSpeech.isReady && consolidatedSpeech.hasUserInteracted}
        />
      </div>
    </div>
  );
};

export default EnhancedLessonManager;
