
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Volume2 } from "lucide-react";
import { Question } from "./types";
import CustomSpeakerIcon from '@/components/ui/custom-speaker-icon';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';

interface QuestionCardProps {
  question: Question;
  selectedAnswer: string;
  showResult: boolean;
  isCorrect: boolean;
  selectedLanguage: string;
  onAnswerSelect: (answerIndex: number) => void;
  onCheckAnswer: () => void;
}

const QuestionCard = ({ 
  question, 
  selectedAnswer, 
  showResult, 
  isCorrect, 
  selectedLanguage,
  onAnswerSelect, 
  onCheckAnswer 
}: QuestionCardProps) => {
  const { speakAsNelie, isSpeaking, stop } = useUnifiedSpeech();

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage === 'spanish' ? 'es-ES' : 
                      selectedLanguage === 'french' ? 'fr-FR' :
                      selectedLanguage === 'german' ? 'de-DE' :
                      selectedLanguage === 'italian' ? 'it-IT' : 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleSpeakQuestion = async () => {
    if (isSpeaking) {
      stop();
    } else {
      await speakAsNelie(question.question, true, 'language-question');
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="relative p-8">
        <button
          onClick={handleSpeakQuestion}
          className="absolute top-4 right-4 z-20 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 shadow-lg backdrop-blur-sm border border-sky-400/30 opacity-90 hover:opacity-100"
          title="Ask Nelie to read this"
        >
          <CustomSpeakerIcon className="w-4 h-4" size={16} color="#0ea5e9" />
        </button>
        
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-4 pr-12">
              {question.question}
            </h3>
            {question.audio && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => playAudio(question.audio!)}
                className="text-gray-300 border-gray-600 hover:bg-gray-700"
              >
                <Volume2 className="w-4 h-4 mr-2" />
                Listen
              </Button>
            )}
          </div>

          <div className="grid gap-3">
            {question.options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className={`h-12 text-left justify-start ${
                  selectedAnswer === index.toString()
                    ? showResult
                      ? isCorrect && parseInt(selectedAnswer) === index
                        ? 'bg-green-600 border-green-500 text-white'
                        : parseInt(selectedAnswer) === index
                        ? 'bg-red-600 border-red-500 text-white'
                        : question.correct === index
                        ? 'bg-green-600 border-green-500 text-white'
                        : 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-blue-600 border-blue-500 text-white'
                    : showResult && question.correct === index
                    ? 'bg-green-600 border-green-500 text-white'
                    : 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                }`}
                onClick={() => !showResult && onAnswerSelect(index)}
                disabled={showResult}
              >
                {option}
              </Button>
            ))}
          </div>

          {!showResult && (
            <Button
              onClick={onCheckAnswer}
              disabled={!selectedAnswer}
              className="w-full bg-gradient-to-r from-purple-400 to-cyan-400 hover:from-purple-500 hover:to-cyan-500 text-white border-none"
            >
              Check Answer
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
