import { useEffect, useState } from 'react';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import { useAuth } from '@/hooks/useAuth';
import { UserMetadata } from '@/types/auth'; // Import UserMetadata
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import WelcomeContent from './WelcomeContent';
import NelieAvatarDisplay from './NelieAvatarDisplay';

interface HomepageWelcomeProps {
  userName: string;
}

const HomepageWelcome = ({ userName }: HomepageWelcomeProps) => {
  const { user } = useAuth();
  const [hasWelcomedThisSession, setHasWelcomedThisSession] = useState(() => {
    return sessionStorage.getItem('nelieHomepageWelcomed') === 'true';
  });
  
  const [hasManuallyTriggered, setHasManuallyTriggered] = useState(false);
  const [actualUserName, setActualUserName] = useState(userName);
  
  const {
    isSpeaking,
    isEnabled,
    hasUserInteracted,
    isReady,
    speak,
    stop,
    toggleEnabled,
  } = useUnifiedSpeech();

  // Fetch user's actual name from profile
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
          const firstName = profile.name.split(' ')[0];
          setActualUserName(firstName);
        } else if ((user?.user_metadata as UserMetadata)?.name) {
          const firstName = (user.user_metadata as UserMetadata).name!.split(' ')[0];
          setActualUserName(firstName);
        } else if ((user?.user_metadata as UserMetadata)?.first_name) {
          setActualUserName((user.user_metadata as UserMetadata).first_name!);
        }
      } catch (error) {
        console.log('Could not fetch user name, using provided userName or fallback from user_metadata', error);
        const metadata = user?.user_metadata as UserMetadata | undefined;
        if (metadata?.name) {
          const firstName = metadata.name.split(' ')[0];
          setActualUserName(firstName);
        } else if (metadata?.first_name) {
          setActualUserName(metadata.first_name);
        }
      }
    };

    fetchUserName();
  }, [user]);

  console.log('🏠 Homepage Welcome State:', {
    hasWelcomedThisSession,
    hasManuallyTriggered,
    actualUserName,
    isSpeaking,
    isEnabled,
    hasUserInteracted,
    isReady
  });

  // Create the welcome message using the actual user name
  const welcomeMessage = `Hello ${actualUserName}! Welcome back to your learning platform! I'm Nelie, your AI learning companion, and I'm so excited to help you learn today! Click on any subject to start your learning adventure with me!`;

  // Auto-enable Nelie and trigger welcome speech after first interaction (but only if not manually triggered)
  useEffect(() => {
    if (
      isReady &&
      hasUserInteracted &&
      !hasWelcomedThisSession &&
      !hasManuallyTriggered &&
      !isEnabled
    ) {
      toggleEnabled();
    }
  }, [isReady, hasUserInteracted, hasWelcomedThisSession, hasManuallyTriggered, isEnabled, toggleEnabled]);

  // Welcome the user ONLY ONCE per session and only if not manually triggered
  useEffect(() => {
    if (
      isReady && 
      !hasWelcomedThisSession && 
      !hasManuallyTriggered &&
      isEnabled && 
      hasUserInteracted
    ) {
      console.log('🎤 Nelie auto-welcoming user to homepage - ONCE PER SESSION (Unified)');
      setHasWelcomedThisSession(true);
      sessionStorage.setItem('nelieHomepageWelcomed', 'true');
      setTimeout(() => {
        speak(welcomeMessage, true);
      }, 1500);
    }
  }, [isReady, hasWelcomedThisSession, hasManuallyTriggered, isEnabled, hasUserInteracted, userName, speak, welcomeMessage]);

  const handleStopSpeech = () => {
    console.log('🔊 Stopping Nelie speech');
    stop();
  };

  return (
    <Card className="bg-gradient-to-r from-purple-600 to-blue-600 border-none mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <WelcomeContent userName={actualUserName} />
          <NelieAvatarDisplay 
            isSpeaking={isSpeaking}
            onStopSpeech={handleStopSpeech}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default HomepageWelcome;
