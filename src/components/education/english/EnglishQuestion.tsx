
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CustomSpeakerIcon from '@/components/ui/custom-speaker-icon';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';

interface EnglishQuestionProps {
  activity: {
    type: string;
    title: string;
    content: string;
    question: string;
    options: string[];
    correct: number;
  };
  onAnswer: (isCorrect: boolean, responseTime: number) => void;
  disabled?: boolean;
}

const EnglishQuestion = ({ activity, onAnswer, disabled }: EnglishQuestionProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [startTime] = useState(Date.now());
  const { speakAsNelie, isSpeaking, stop } = useUnifiedSpeech();

  const handleSpeakContent = async () => {
    if (isSpeaking) {
      stop();
    } else {
      await speakAsNelie(activity.content, true, 'english-content');
    }
  };

  const handleSpeakQuestion = async () => {
    if (isSpeaking) {
      stop();
    } else {
      await speakAsNelie(activity.question, true, 'english-question');
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult || disabled) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    const responseTime = Date.now() - startTime;
    const isCorrect = selectedAnswer === activity.correct;
    
    setShowResult(true);
    onAnswer(isCorrect, responseTime);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowResult(false);
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="relative p-6">
        <button
          onClick={handleSpeakQuestion}
          className="absolute top-4 right-4 z-20 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 shadow-lg backdrop-blur-sm border border-sky-400/30 opacity-90 hover:opacity-100"
          title="Ask Nelie to read this"
        >
          <CustomSpeakerIcon className="w-4 h-4" size={16} color="#0ea5e9" />
        </button>

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white pr-12">
            {activity.title}
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSpeakContent}
            className="border-gray-600 text-white bg-gray-700 hover:bg-gray-600"
          >
            <CustomSpeakerIcon className="w-4 h-4" size={16} />
          </Button>
        </div>

        <div className="relative bg-gray-700 border border-gray-600 rounded-lg p-4 mb-6">
          <button
            onClick={handleSpeakContent}
            className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 shadow-lg backdrop-blur-sm border border-sky-400/30 opacity-90 hover:opacity-100"
            title="Ask Nelie to read this"
          >
            <CustomSpeakerIcon className="w-3 h-3" size={12} color="#0ea5e9" />
          </button>
          <p className="text-gray-200 text-lg leading-relaxed pr-8">
            {activity.content}
          </p>
        </div>

        <h4 className="text-lg font-medium mb-4 text-white">
          {activity.question}
        </h4>

        <div className="space-y-3 mb-6">
          {activity.options.map((option, index) => (
            <Button
              key={index}
              variant={selectedAnswer === index ? "default" : "outline"}
              className={`w-full text-left justify-start p-4 h-auto ${
                selectedAnswer === index
                  ? "bg-green-500 text-white"
                  : "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              }`}
              onClick={() => handleAnswerSelect(index)}
              disabled={showResult || disabled}
            >
              <span className="mr-3 font-semibold">
                {String.fromCharCode(65 + index)}.
              </span>
              {option}
            </Button>
          ))}
        </div>

        {showResult && (
          <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 mb-4">
            <p className={`font-semibold ${
              selectedAnswer === activity.correct 
                ? 'text-green-400' 
                : 'text-red-400'
            }`}>
              {selectedAnswer === activity.correct ? 'Excellent!' : 'Try again next time!'}
            </p>
            <p className="text-gray-300 mt-2">
              The correct answer is: {activity.options[activity.correct]}
            </p>
          </div>
        )}

        <div className="flex justify-end">
          {!showResult ? (
            <Button
              onClick={handleSubmit}
              disabled={selectedAnswer === null || disabled}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Submit Answer
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Continue
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnglishQuestion;
