
import { useState } from 'react';
import { MessageCircle, Volume2 } from 'lucide-react';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';

interface AskNelieButtonsProps {
  content: string;
  context?: string;
  className?: string;
}

const AskNelieButtons = ({ content, context = 'explanation', className = '' }: AskNelieButtonsProps) => {
  const [isExplaining, setIsExplaining] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const { speakAsNelie, isSpeaking, stop } = useUnifiedSpeech();

  const handleReadOnly = async () => {
    if (isSpeaking) {
      stop();
      setIsExplaining(false);
      setIsReading(false);
      return;
    }

    setIsReading(true);
    setIsExplaining(false);
    
    try {
      await speakAsNelie(content, true, context);
    } finally {
      setIsReading(false);
    }
  };

  const handleExplainOnly = async () => {
    if (isSpeaking) {
      stop();
      setIsExplaining(false);
      setIsReading(false);
      return;
    }

    setIsExplaining(true);
    setIsReading(false);
    
    const explanationText = `Let me explain this concept: ${content}. This is an important idea to understand because it helps you solve problems more efficiently.`;
    
    try {
      await speakAsNelie(explanationText, true, context);
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <div className={`flex gap-1 ${className}`}>
      <button
        onClick={handleReadOnly}
        disabled={isExplaining}
        className={`p-1 rounded transition-all ${
          isReading 
            ? 'bg-blue-600 text-white' 
            : 'text-blue-300 hover:bg-blue-600/20 hover:text-blue-200'
        }`}
        title="Ask Nelie to Read"
      >
        <Volume2 className="w-4 h-4" />
      </button>
      
      <button
        onClick={handleExplainOnly}
        disabled={isReading}
        className={`p-1 rounded transition-all ${
          isExplaining 
            ? 'bg-purple-600 text-white' 
            : 'text-purple-300 hover:bg-purple-600/20 hover:text-purple-200'
        }`}
        title="Ask Nelie to Explain"
      >
        <MessageCircle className="w-4 h-4" />
      </button>
    </div>
  );
};

export default AskNelieButtons;
