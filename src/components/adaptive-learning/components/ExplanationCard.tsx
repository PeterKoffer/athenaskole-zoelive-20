
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';

interface ExplanationCardProps {
  explanation: string;
  subject: string;
  isVisible: boolean;
  onSpeechEnd?: () => void;
  isCorrect?: boolean;
  correctAnswer?: string;
}

const ExplanationCard = ({ 
  explanation, 
  subject, 
  isVisible, 
  onSpeechEnd,
  isCorrect = true,
  correctAnswer
}: ExplanationCardProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to explanation when it becomes visible
  useEffect(() => {
    if (isVisible && cardRef.current) {
      setTimeout(() => {
        cardRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
      }, 200);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const handleReadAloud = () => {
    // Prevent multiple speech instances
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    let speechText = explanation;
    if (!isCorrect && correctAnswer) {
      speechText = `That's incorrect. The correct answer is: ${correctAnswer}. ${explanation}`;
    }
    
    setIsSpeaking(true);
    
    // Stop any existing speech first
    speechSynthesis.cancel();
    
    // Small delay to ensure cancel is processed
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      
      // Try to use a female voice if available
      const voices = speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('woman') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('karen') ||
        voice.name.toLowerCase().includes('victoria') ||
        (voice.name.toLowerCase().includes('alex') && voice.lang.includes('en'))
      );
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      
      utterance.onend = () => {
        setIsSpeaking(false);
        onSpeechEnd?.();
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
        onSpeechEnd?.();
      };
      
      speechSynthesis.speak(utterance);
    }, 100);
  };

  return (
    <Card ref={cardRef} className={`${isCorrect ? 'bg-blue-900 border-blue-600' : 'bg-red-900 border-red-600'} mt-4`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className={`text-lg font-semibold text-center flex-1 ${isCorrect ? 'text-blue-100' : 'text-red-100'}`}>
            {isCorrect ? 'Explanation' : 'Correction'}
          </h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReadAloud}
              className={`${isCorrect ? 'text-blue-200 border-blue-400 hover:bg-blue-800' : 'text-red-200 border-red-400 hover:bg-red-800'}`}
            >
              <Volume2 className="w-4 h-4 mr-2" />
              {isSpeaking ? 'Stop Nelie' : 'Listen to Nelie'}
            </Button>
            {isSpeaking && (
              <div className={`flex items-center ${isCorrect ? 'text-blue-300' : 'text-red-300'}`}>
                <div className={`w-2 h-2 ${isCorrect ? 'bg-blue-400' : 'bg-red-400'} rounded-full animate-pulse mr-1`}></div>
                <span className="text-xs">Nelie is speaking...</span>
              </div>
            )}
          </div>
        </div>
        {!isCorrect && correctAnswer && (
          <p className="text-red-300 font-medium mb-2 text-center">
            Correct answer: {correctAnswer}
          </p>
        )}
        <p className={`text-center ${isCorrect ? 'text-blue-200' : 'text-red-200'}`}>{explanation}</p>
      </CardContent>
    </Card>
  );
};

export default ExplanationCard;
