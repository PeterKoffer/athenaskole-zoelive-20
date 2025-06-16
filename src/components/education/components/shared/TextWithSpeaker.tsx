
import CustomSpeakerIcon from '@/components/ui/custom-speaker-icon';
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
          className={`absolute top-3 right-3 z-20 p-2 rounded-full bg-sky-500/90 hover:bg-sky-400 transition-all duration-200 shadow-lg backdrop-blur-sm ${
            showOnHover ? 'opacity-80 group-hover:opacity-100' : 'opacity-90 hover:opacity-100'
          } ${buttonClassName}`}
          title="Ask Nelie to read this"
        >
          <CustomSpeakerIcon className="w-4 h-4 text-white" size={16} />
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
        className={`ml-2 p-2 rounded-full bg-sky-500/80 hover:bg-sky-400 transition-all duration-200 ${
          showOnHover ? 'opacity-0 group-hover:opacity-100' : 'opacity-80 hover:opacity-100'
        } ${buttonClassName}`}
        title="Ask Nelie to read this"
      >
        <CustomSpeakerIcon className="w-4 h-4 text-white" size={16} />
      </button>
    </div>
  );
};

export default TextWithSpeaker;
