
import { Volume2 } from "lucide-react";
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';

interface TextWithSpeakerProps {
  text: string;
  children: React.ReactNode;
  context?: string;
  className?: string;
  buttonClassName?: string;
  showOnHover?: boolean;
  position?: 'inline' | 'corner';
}

const TextWithSpeaker = ({ 
  text, 
  children, 
  context = 'text-content',
  className = '',
  buttonClassName = '',
  showOnHover = true,
  position = 'inline'
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
      <div className={`relative ${className}`}>
        <button
          onClick={handleSpeak}
          className={`absolute top-2 right-2 z-10 p-2 rounded-full hover:bg-white/10 transition-all ${
            showOnHover ? 'opacity-0 group-hover:opacity-100' : 'opacity-70 hover:opacity-100'
          } ${buttonClassName}`}
          title="Ask Nelie to read this"
        >
          <Volume2 className="w-4 h-4 text-white" />
        </button>
        {children}
      </div>
    );
  }

  return (
    <div className={`flex items-start justify-between ${showOnHover ? 'group' : ''} ${className}`}>
      <div className="flex-1">
        {children}
      </div>
      <button
        onClick={handleSpeak}
        className={`ml-2 p-1 rounded hover:bg-white/10 transition-all ${
          showOnHover ? 'opacity-0 group-hover:opacity-100' : 'opacity-70 hover:opacity-100'
        } ${buttonClassName}`}
        title="Ask Nelie to read this"
      >
        <Volume2 className="w-4 h-4 text-current" />
      </button>
    </div>
  );
};

export default TextWithSpeaker;
