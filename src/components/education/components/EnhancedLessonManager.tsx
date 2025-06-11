
import { Card, CardContent } from '@/components/ui/card';
import { useExtendedLessonManager } from './hooks/useExtendedLessonManager';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import NelieAvatarSection from './NelieAvatarSection';
import LessonProgressHeader from './LessonProgressHeader';
import LessonProgressSection from './LessonProgressSection';
import LessonActivitySpeechManager from './LessonActivitySpeechManager';
import EnhancedActivityRenderer from './EnhancedActivityRenderer';
import SpeechTestCard from './SpeechTestCard';
import { useSimpleMobileSpeech } from '@/hooks/useSimpleMobileSpeech';
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
  
  // Use simplified speech system
  const simpleSpeech = useSimpleMobileSpeech();
  
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

  // Auto-enable speech on component mount
  useEffect(() => {
    console.log('🎯 Auto-enabling speech interaction');
    simpleSpeech.enableUserInteraction();
    
    // Welcome message after a delay
    if (simpleSpeech.isReady && simpleSpeech.hasUserInteracted) {
      setTimeout(() => {
        simpleSpeech.speak("Hello! I'm Nelie, your learning companion. Let's start your lesson!", true);
      }, 2000);
    }
  }, [simpleSpeech.isReady, simpleSpeech.hasUserInteracted]);

  const handleMuteToggle = useCallback(() => {
    simpleSpeech.toggleEnabled();
  }, [simpleSpeech]);

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
        simpleSpeech.speak(speechText, true);
      }
    }
  }, [currentActivity, simpleSpeech]);

  if (!currentActivity) {
    return (
      <div className="min-h-screen w-full bg-gray-900 p-2 sm:p-4">
        <div className="w-full max-w-4xl mx-auto">
          <Card className="bg-gray-900 border-gray-800 w-full">
            <CardContent className="p-4 sm:p-8 text-center text-white">
              <div className="animate-spin w-6 h-6 sm:w-8 sm:h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-sm sm:text-base">Nelie is preparing your {targetLessonLength}-minute lesson...</p>
              {questionsGenerated > 0 && (
                <p className="text-xs sm:text-sm text-gray-400 mt-2">
                  Generated {questionsGenerated} questions so far
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-900">
      <div className="w-full max-w-4xl mx-auto p-2 sm:p-4 space-y-4 sm:space-y-6">
        {/* Speech Test Card - only show for admin users */}
        {isAdmin() && <SpeechTestCard />}

        {/* Progress Header - Fixed positioning */}
        <div className="w-full sticky top-0 z-10 bg-gray-900 pb-2">
          <LessonProgressHeader
            timeElapsed={timeElapsed}
            score={score}
            currentActivityIndex={currentActivityIndex}
            totalActivities={lessonActivities.length}
          />
        </div>

        {/* Lesson info card */}
        <Card className="bg-blue-900/20 border-blue-700 w-full">
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <span className="text-blue-300">
                {targetLessonLength}-minute lesson
              </span>
              <span className="hidden sm:inline text-blue-400">•</span>
              <span className="text-blue-400">
                {questionsGenerated} questions generated
              </span>
            </div>
            <p className="text-blue-400 text-xs mt-1">
              Interactive questions and learning content
            </p>
          </CardContent>
        </Card>

        {/* Speech Status */}
        <Card className="bg-green-900/20 border-green-700 w-full">
          <CardContent className="p-3 sm:p-4 text-center">
            <p className="text-green-300 text-xs sm:text-sm">
              🎤 Nelie's voice is {simpleSpeech.isEnabled ? 'enabled' : 'muted'} - 
              {simpleSpeech.isSpeaking ? ' Currently speaking...' : ' Ready to help!'}
            </p>
            <p className="text-green-400 text-xs mt-1">
              Speech ready: {simpleSpeech.isReady ? 'Yes' : 'Loading...'} | 
              User interaction: {simpleSpeech.hasUserInteracted ? 'Yes' : 'Pending'}
            </p>
          </CardContent>
        </Card>

        {/* Nelie Avatar Section */}
        <div className="w-full">
          <NelieAvatarSection 
            subject={subject} 
            currentQuestionIndex={currentActivityIndex} 
            totalQuestions={lessonActivities.length} 
            isSpeaking={simpleSpeech.isSpeaking} 
            autoReadEnabled={simpleSpeech.isEnabled} 
            onMuteToggle={handleMuteToggle} 
            onReadQuestion={handleReadRequestWrapper} 
          />
        </div>

        {/* Progress Bar */}
        <div className="w-full">
          <LessonProgressSection
            currentActivityIndex={currentActivityIndex}
            totalActivities={lessonActivities.length}
            currentActivityTitle={currentActivity.title}
          />
        </div>

        {/* Speech Manager - handles auto-speaking when activities change */}
        <LessonActivitySpeechManager
          currentActivity={currentActivity}
          currentActivityIndex={currentActivityIndex}
          autoReadEnabled={simpleSpeech.isEnabled && simpleSpeech.hasUserInteracted}
          isReady={simpleSpeech.isReady && simpleSpeech.hasUserInteracted}
          speakText={simpleSpeech.speak}
          stopSpeaking={simpleSpeech.stop}
        />

        {/* Activity Content */}
        <div className="w-full">
          <EnhancedActivityRenderer
            activity={currentActivity}
            onActivityComplete={handleActivityComplete}
            isNelieReady={simpleSpeech.isReady && simpleSpeech.hasUserInteracted}
          />
        </div>
      </div>
    </div>
  );
};

export default EnhancedLessonManager;
