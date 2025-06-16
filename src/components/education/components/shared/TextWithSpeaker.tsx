
import { Volume2 } from "lucide-react";
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';

interface TextWithSpeakerProps {
  text: string;
  children: React.ReactNode;
  context?: string;
  className?: string;
  buttonClassName?: string;
  showOnHover?: boolean;
}

const TextWithSpeaker = ({ 
  text, 
  children, 
  context = 'text-content',
  className = '',
  buttonClassName = '',
  showOnHover = true
}: TextWithSpeakerProps) => {
  const { speakAsNelie, isSpeaking, stop } = useUnifiedSpeech();

  const handleSpeak = async () => {
    if (isSpeaking) {
      stop();
    } else {
      await speakAsNelie(text, true, context);
    }
  };

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
