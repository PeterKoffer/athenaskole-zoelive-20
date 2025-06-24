
import React from 'react';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import CustomSpeakerIcon from '@/components/ui/custom-speaker-icon';

interface TextWithSpeakerProps {
  text: string;
  context: string;
  position?: 'corner' | 'inline';
  showOnHover?: boolean;
  children: React.ReactNode;
}

const TextWithSpeaker = ({ 
  text, 
  context, 
  position = 'corner', 
  showOnHover = true,
  children 
}: TextWithSpeakerProps) => {
  const { speakAsNelie, isSpeaking, stop } = useUnifiedSpeech();

  const handleSpeak = async () => {
    if (isSpeaking) {
      stop();
    } else {
      await speakAsNelie(text, true, context);
    }
  };

  if (position === 'corner') {
    return (
      <div className="relative">
        <button
          onClick={handleSpeak}
          className={`absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 shadow-lg backdrop-blur-sm border border-sky-400/30 ${
            showOnHover ? 'opacity-0 hover:opacity-100 group-hover:opacity-100' : 'opacity-90 hover:opacity-100'
          }`}
          title="Ask Nelie to read this"
        >
          <CustomSpeakerIcon className="w-4 h-4" size={16} color="#0ea5e9" />
        </button>
        {children}
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {children}
      <button
        onClick={handleSpeak}
        className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 shadow-lg backdrop-blur-sm border border-sky-400/30"
        title="Ask Nelie to read this"
      >
        <CustomSpeakerIcon className="w-4 h-4" size={16} color="#0ea5e9" />
      </button>
    </div>
  );
};

export default TextWithSpeaker;
