
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';

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
  const { speak } = useSpeechSynthesis();
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (isVisible && explanation) {
      setIsSpeaking(true);
      
      // Create the appropriate message to speak
      let speechText = explanation;
      if (!isCorrect && correctAnswer) {
        speechText = `That's incorrect. The correct answer is: ${correctAnswer}. ${explanation}`;
      }
      
      // Create utterance with event handlers
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
      
      // Stop any current speech and start new one
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    }
  }, [isVisible, explanation, onSpeechEnd, isCorrect, correctAnswer]);

  if (!isVisible) return null;

  const handleReadAloud = () => {
    let speechText = explanation;
    if (!isCorrect && correctAnswer) {
      speechText = `That's incorrect. The correct answer is: ${correctAnswer}. ${explanation}`;
    }
    speak(speechText);
  };

  return (
    <Card className={`${isCorrect ? 'bg-blue-900 border-blue-600' : 'bg-red-900 border-red-600'}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className={`text-lg font-semibold ${isCorrect ? 'text-blue-100' : 'text-red-100'}`}>
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
              Listen
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
          <p className="text-red-300 font-medium mb-2">
            Correct answer: {correctAnswer}
          </p>
        )}
        <p className={`${isCorrect ? 'text-blue-200' : 'text-red-200'}`}>{explanation}</p>
        {subject === 'science' && (
          <p className={`text-xs ${isCorrect ? 'text-blue-300' : 'text-red-300'} mt-2 italic`}>
            💡 Explanation will stay visible while Nelie is speaking
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ExplanationCard;
