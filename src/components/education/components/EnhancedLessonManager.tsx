
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
  
  // Use consolidated speech with enhanced initialization
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

  // Auto-enable user interaction immediately when component loads
  useEffect(() => {
    console.log('🎯 EnhancedLessonManager: Auto-enabling user interaction');
    
    // Enable user interaction immediately without waiting for user click
    const enableInteraction = () => {
      if (!consolidatedSpeech.hasUserInteracted) {
        consolidatedSpeech.enableUserInteraction();
        console.log('✅ User interaction enabled for speech system');
      }
    };

    // Enable immediately
    enableInteraction();
    
    // Also enable on any user interaction
    const handleUserInteraction = () => {
      enableInteraction();
    };

    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('touchstart', handleUserInteraction, { once: true });
    
    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [consolidatedSpeech]);

  // Test speech when ready
  useEffect(() => {
    if (consolidatedSpeech.isReady && consolidatedSpeech.hasUserInteracted && consolidatedSpeech.isEnabled) {
      // Welcome message when everything is ready
      setTimeout(() => {
        console.log('🔊 Playing welcome message');
        consolidatedSpeech.speak("Hello! I'm Nelie, your learning companion. I'm ready to help guide you through today's lesson!", true);
      }, 1500);
    }
  }, [consolidatedSpeech.isReady, consolidatedSpeech.hasUserInteracted, consolidatedSpeech.isEnabled]);

  const handleMuteToggle = useCallback(() => {
    console.log('🔊 Mute toggle clicked, current state:', consolidatedSpeech.isEnabled);
    consolidatedSpeech.toggleEnabled();
  }, [consolidatedSpeech]);

  const handleReadRequestWrapper = useCallback(() => {
    console.log('🔊 Read request clicked for activity:', currentActivity?.title);
    
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
        console.log('🔊 Speaking text:', speechText.substring(0, 50) + '...');
        consolidatedSpeech.speak(speechText, true);
      }
    }
  }, [currentActivity, consolidatedSpeech]);

  if (!currentActivity) {
    return (
      <div className="min-h-screen w-full overflow-x-hidden bg-gray-900 p-2 sm:p-4">
        <Card className="bg-gray-900 border-gray-800 w-full max-w-4xl mx-auto">
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
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-900">
      <div className="w-full max-w-4xl mx-auto p-2 sm:p-4 space-y-4 sm:space-y-6">
        {/* Speech Test Card - only show for admin users */}
        {isAdmin() && <SpeechTestCard />}

        {/* Progress Header */}
        <div className="w-full">
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
              🎤 Nelie's voice is {consolidatedSpeech.isEnabled ? 'enabled' : 'muted'} - 
              {consolidatedSpeech.isSpeaking ? ' Currently speaking...' : ' Ready to help!'}
            </p>
            <p className="text-green-400 text-xs mt-1">
              Speech ready: {consolidatedSpeech.isReady ? 'Yes' : 'Loading...'} | 
              User interaction: {consolidatedSpeech.hasUserInteracted ? 'Yes' : 'Pending'}
            </p>
          </CardContent>
        </Card>

        {/* Nelie Avatar Section */}
        <div className="w-full">
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
    </div>
  );
};

export default EnhancedLessonManager;
