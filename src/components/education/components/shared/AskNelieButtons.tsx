
import { useState } from 'react';
import { Button } from '@/components/ui/button';
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

  const handleReadAndExplain = async () => {
    if (isSpeaking) {
      stop();
      setIsExplaining(false);
      setIsReading(false);
      return;
    }

    setIsReading(true);
    setIsExplaining(false);
    
    const readAndExplainText = `${content}. Now let me explain this further: This concept is designed to make math easier and more intuitive for you. Practice using this strategy, and it will become second nature!`;
    
    try {
      await speakAsNelie(readAndExplainText, true, context);
    } finally {
      setIsReading(false);
    }
  };

  return (
    <div className={`flex flex-col sm:flex-row gap-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={handleExplainOnly}
        disabled={isReading}
        className={`flex items-center space-x-2 text-xs transition-all ${
          isExplaining 
            ? 'bg-purple-600 text-white border-purple-500' 
            : 'border-purple-400 text-purple-200 bg-gray-700/50 hover:bg-purple-600/20'
        }`}
      >
        <MessageCircle className="w-3 h-3" />
        <span>{isExplaining ? 'Explaining...' : 'Ask Nelie to Explain'}</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleReadAndExplain}
        disabled={isExplaining}
        className={`flex items-center space-x-2 text-xs transition-all ${
          isReading 
            ? 'bg-blue-600 text-white border-blue-500' 
            : 'border-blue-400 text-blue-200 bg-gray-700/50 hover:bg-blue-600/20'
        }`}
      >
        <Volume2 className="w-3 h-3" />
        <span>{isReading ? 'Reading...' : 'Ask Nelie to Read & Explain'}</span>
      </Button>
    </div>
  );
};

export default AskNelieButtons;
