
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Play } from 'lucide-react';
import RobotAvatar from '@/components/ai-tutor/RobotAvatar';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { getSubjectIntroduction } from './utils/subjectIntroductions';

interface UnifiedClassIntroductionProps {
  subject: string;
  skillArea?: string;
  userLevel?: string;
  onIntroductionComplete: () => void;
}

const UnifiedClassIntroduction = ({
  subject,
  skillArea,
  userLevel = 'beginner',
  onIntroductionComplete
}: UnifiedClassIntroductionProps) => {
  const { user } = useAuth();
  const [hasStarted, setHasStarted] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [userName, setUserName] = useState('Student');
  const [canProceedWithoutSpeech, setCanProceedWithoutSpeech] = useState(false);
  
  const {
    isSpeaking,
    isEnabled,
    hasUserInteracted,
    isReady,
    speakAsNelie,
    stop,
    toggleEnabled,
    enableUserInteraction
  } = useUnifiedSpeech();

  // Fetch user's name from profile
  useEffect(() => {
    const fetchUserName = async () => {
      if (!user?.id) return;

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name')
          .eq('user_id', user.id)
          .single();

        if (profile?.name) {
          setUserName(profile.name.split(' ')[0]); // Use first name
        } else if (user.user_metadata?.name) {
          setUserName(user.user_metadata.name.split(' ')[0]); // Fallback to auth metadata
        }
      } catch (error) {
        console.log('Could not fetch user name, using default');
        if (user.user_metadata?.name) {
          setUserName(user.user_metadata.name.split(' ')[0]);
        }
      }
    };

    fetchUserName();
  }, [user]);

  // Allow proceeding without speech after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setCanProceedWithoutSpeech(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const introduction = getSubjectIntroduction(subject, skillArea, userLevel, userName);
  const currentContent = introduction.sections[currentSection];

  console.log('🎭 Class Introduction:', {
    subject,
    skillArea,
    userName,
    currentSection,
    totalSections: introduction.sections.length,
    hasStarted,
    isSpeaking,
    canProceedWithoutSpeech
  });

  // Auto-start introduction when component mounts and speech is ready (only if user has interacted)
  useEffect(() => {
    if (isReady && isEnabled && hasUserInteracted && !hasStarted) {
      console.log('🎯 Auto-starting class introduction');
      setHasStarted(true);
      setTimeout(() => {
        speakAsNelie(currentContent.text, true, `intro-${subject}-${currentSection}`);
      }, 1000);
    }
  }, [isReady, isEnabled, hasUserInteracted, hasStarted, currentContent.text, speakAsNelie, subject, currentSection]);

  // Auto-advance to next section when speaking finishes
  useEffect(() => {
    if (hasStarted && !isSpeaking && currentSection < introduction.sections.length - 1) {
      const timer = setTimeout(() => {
        setCurrentSection(prev => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (hasStarted && !isSpeaking && currentSection >= introduction.sections.length - 1) {
      // Introduction complete
      const timer = setTimeout(() => {
        onIntroductionComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [hasStarted, isSpeaking, currentSection, introduction.sections.length, onIntroductionComplete]);

  // Speak new section content when section changes
  useEffect(() => {
    if (hasStarted && currentSection > 0 && isEnabled) {
      setTimeout(() => {
        speakAsNelie(currentContent.text, true, `intro-${subject}-${currentSection}`);
      }, 500);
    }
  }, [currentSection, hasStarted, currentContent.text, speakAsNelie, subject, isEnabled]);

  const handleManualStart = () => {
    if (!hasStarted) {
      setHasStarted(true);
      if (!hasUserInteracted) {
        enableUserInteraction();
      }
      if (isEnabled || !hasUserInteracted) {
        setTimeout(() => {
          speakAsNelie(currentContent.text, true, `intro-${subject}-${currentSection}`);
        }, 200);
      }
    }
  };

  const handleManualRead = () => {
    if (!hasUserInteracted) {
      enableUserInteraction();
    }
    if (isSpeaking) {
      stop();
    } else {
      speakAsNelie(currentContent.text, true, `intro-${subject}-${currentSection}`);
    }
  };

  const handleSkip = () => {
    stop();
    onIntroductionComplete();
  };

  // Handle "Start Lesson" button click - stop speech and advance immediately
  const handleStartLesson = () => {
    console.log('🔇 User choosing to start lesson - stopping speech and advancing');
    stop();
    onIntroductionComplete();
  };

  // Allow skipping to lesson without any speech interaction
  const handleProceedWithoutSpeech = () => {
    console.log('🔇 User choosing to proceed without speech');
    stop();
    onIntroductionComplete();
  };

  const isComplete = currentSection >= introduction.sections.length - 1 && !isSpeaking;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <Card className="bg-gradient-to-r from-purple-900 to-blue-900 border-purple-400">
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <RobotAvatar 
                  size="xl" 
                  isActive={true} 
                  isSpeaking={isSpeaking}
                />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {introduction.title}
              </h2>
              <p className="text-purple-200">
                Welcome to your {subject} class with Nelie, {userName}!
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="flex justify-center mb-6">
              <div className="flex space-x-2">
                {introduction.sections.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index <= currentSection 
                        ? 'bg-purple-400' 
                        : 'bg-purple-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Current Content */}
            <div className="bg-purple-800/50 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                {currentContent.title}
              </h3>
              <p className="text-purple-100 leading-relaxed text-lg">
                {currentContent.text}
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              {!hasStarted ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleManualStart}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Introduction with Nelie
                  </Button>
                  
                  {canProceedWithoutSpeech && (
                    <Button
                      onClick={handleProceedWithoutSpeech}
                      variant="outline"
                      className="border-gray-400 text-gray-200 bg-gray-800/50 px-6 py-3"
                    >
                      Start Lesson Without Speech
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => toggleEnabled()}
                    className="border-purple-400 text-purple-200 bg-purple-800/50"
                  >
                    {isEnabled ? <VolumeX className="w-4 h-4 mr-2" /> : <Volume2 className="w-4 h-4 mr-2" />}
                    {isEnabled ? 'Mute Nelie' : 'Unmute Nelie'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleManualRead}
                    className="border-purple-400 text-purple-200 bg-purple-800/50"
                    disabled={!isEnabled && hasUserInteracted}
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    {isSpeaking ? 'Stop Reading' : 'Read Again'}
                  </Button>
                  
                  {isComplete ? (
                    <Button
                      onClick={onIntroductionComplete}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                    >
                      Start Class
                    </Button>
                  ) : (
                    <>
                      {/* Show "Start Lesson" button when Nelie has started speaking */}
                      {(isSpeaking || hasStarted) && (
                        <Button
                          onClick={handleStartLesson}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                        >
                          Start Lesson
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        onClick={handleSkip}
                        className="border-gray-400 text-gray-200 bg-gray-800/50"
                      >
                        Skip Introduction
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Status Indicator */}
            {hasStarted && (
              <div className="text-center mt-4">
                <p className="text-purple-300 text-sm">
                  {isSpeaking ? (
                    <>
                      <div className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                      Nelie is speaking...
                    </>
                  ) : isComplete ? (
                    'Introduction complete! Ready to start your class.'
                  ) : (
                    'Moving to next section...'
                  )}
                </p>
              </div>
            )}

            {/* Help Text for Direct Navigation */}
            {!hasStarted && (
              <div className="text-center mt-4">
                <p className="text-purple-300 text-sm">
                  You can start with Nelie's voice guidance or proceed directly to the lesson
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UnifiedClassIntroduction;
