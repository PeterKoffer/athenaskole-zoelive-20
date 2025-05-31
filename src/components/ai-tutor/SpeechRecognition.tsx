
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Volume2, RotateCcw } from "lucide-react";

interface SpeechRecognitionProps {
  targetText: string;
  language: string;
  onScoreUpdate: (score: number) => void;
}

const SpeechRecognition = ({ targetText, language, onScoreUpdate }: SpeechRecognitionProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [pronunciationScore, setPronunciationScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setTranscription(transcript);
        analyzePronunciation(transcript, targetText);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [language, targetText]);

  const analyzePronunciation = (spoken: string, target: string) => {
    // Simple pronunciation analysis - in production, use more sophisticated algorithms
    const similarity = calculateSimilarity(spoken.toLowerCase(), target.toLowerCase());
    const score = Math.round(similarity * 100);
    setPronunciationScore(score);
    onScoreUpdate(score);

    if (score >= 90) {
      setFeedback("Perfect pronunciation! 🌟");
    } else if (score >= 75) {
      setFeedback("Really good! Try again to improve 👍");
    } else if (score >= 60) {
      setFeedback("Good try! Focus on pronunciation 🎯");
    } else {
      setFeedback("Try again - listen to the example first 🔄");
    }
  };

  const calculateSimilarity = (str1: string, str2: string): number => {
    const words1 = str1.split(' ');
    const words2 = str2.split(' ');
    let matches = 0;
    
    words1.forEach(word1 => {
      if (words2.some(word2 => word2.includes(word1) || word1.includes(word2))) {
        matches++;
      }
    });
    
    return matches / Math.max(words1.length, words2.length);
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      setTranscription("");
      setPronunciationScore(null);
      setFeedback("");
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const playTargetAudio = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(targetText);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const reset = () => {
    setTranscription("");
    setPronunciationScore(null);
    setFeedback("");
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-6 space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Pronunciation Practice</h3>
          <div className="bg-gray-700 p-3 rounded-lg mb-4">
            <p className="text-white font-medium">Say: "{targetText}"</p>
            <Button
              variant="outline"
              size="sm"
              onClick={playTargetAudio}
              className="mt-2 text-gray-300 border-gray-600 hover:bg-gray-600"
            >
              <Volume2 className="w-4 h-4 mr-1" />
              Listen to example
            </Button>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <Button
            onClick={isListening ? stopListening : startListening}
            className={`${
              isListening 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-green-600 hover:bg-green-700'
            } transition-colors`}
            size="lg"
          >
            {isListening ? (
              <>
                <MicOff className="w-5 h-5 mr-2" />
                Stop
              </>
            ) : (
              <>
                <Mic className="w-5 h-5 mr-2" />
                Start recording
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={reset}
            className="text-gray-300 border-gray-600 hover:bg-gray-600"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {isListening && (
          <div className="text-center">
            <div className="animate-pulse">
              <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-2"></div>
              <p className="text-gray-300">Listening...</p>
            </div>
          </div>
        )}

        {transcription && (
          <div className="space-y-3">
            <div className="bg-gray-700 p-3 rounded-lg">
              <p className="text-gray-300 text-sm">You said:</p>
              <p className="text-white font-medium">"{transcription}"</p>
            </div>

            {pronunciationScore !== null && (
              <div className="text-center space-y-2">
                <Badge 
                  variant="outline"
                  className={`text-lg px-4 py-2 ${
                    pronunciationScore >= 90 ? 'bg-green-600 text-white border-green-600' :
                    pronunciationScore >= 75 ? 'bg-blue-600 text-white border-blue-600' :
                    pronunciationScore >= 60 ? 'bg-yellow-600 text-white border-yellow-600' :
                    'bg-orange-600 text-white border-orange-600'
                  }`}
                >
                  {pronunciationScore}% accuracy
                </Badge>
                <p className="text-gray-300">{feedback}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpeechRecognition;
