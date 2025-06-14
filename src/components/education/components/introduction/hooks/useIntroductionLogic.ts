
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import { supabase } from '@/integrations/supabase/client';

interface UseIntroductionLogicProps {
  introduction: {
    title: string;
    sections: Array<{ title: string; text: string }>;
  };
  subject: string;
  onIntroductionComplete: () => void;
}

export const useIntroductionLogic = ({
  introduction,
  subject,
  onIntroductionComplete
}: UseIntroductionLogicProps) => {
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

  const currentContent = introduction.sections[currentSection];

  console.log('🎭 Class Introduction:', {
    subject,
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

  const handleStartLesson = () => {
    console.log('🔇 User choosing to start lesson - stopping speech and advancing');
    stop();
    onIntroductionComplete();
  };

  const handleProceedWithoutSpeech = () => {
    console.log('🔇 User choosing to proceed without speech');
    stop();
    onIntroductionComplete();
  };

  const isComplete = currentSection >= introduction.sections.length - 1 && !isSpeaking;

  return {
    // State
    hasStarted,
    currentSection,
    userName,
    canProceedWithoutSpeech,
    currentContent,
    isComplete,
    
    // Speech state
    isSpeaking,
    isEnabled,
    hasUserInteracted,
    
    // Handlers
    handleManualStart,
    handleManualRead,
    handleSkip,
    handleStartLesson,
    handleProceedWithoutSpeech,
    toggleEnabled
  };
};
