
import { Message } from "./types";
import CustomSpeakerIcon from '@/components/ui/custom-speaker-icon';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';

interface ChatMessageProps {
  message: Message;
  children?: React.ReactNode;
}

const ChatMessage = ({ message, children }: ChatMessageProps) => {
  const { speakAsNelie, isSpeaking, stop } = useUnifiedSpeech();

  const handleSpeak = async () => {
    if (isSpeaking) {
      stop();
    } else {
      await speakAsNelie(message.content, true, 'chat-message');
    }
  };

  return (
    <div>
      <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
        <div
          className={`relative max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
            message.role === 'user'
              ? 'bg-gradient-to-r from-purple-400 to-cyan-400 text-white'
              : 'bg-gray-800 text-gray-100 border border-gray-700'
          }`}
        >
          <button
            onClick={handleSpeak}
            className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 shadow-lg backdrop-blur-sm border border-sky-400/30 opacity-90 hover:opacity-100"
            title="Ask Nelie to read this"
          >
            <CustomSpeakerIcon className="w-3 h-3" size={12} color="#0ea5e9" />
          </button>
          <p className="text-sm leading-relaxed text-center whitespace-pre-wrap pr-8">{message.content}</p>
          <p className="text-xs opacity-70 mt-2 text-center">
            {message.timestamp.toLocaleTimeString('da-DK')}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
};

export default ChatMessage;
