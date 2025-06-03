import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Volume2 } from 'lucide-react';
import { Question } from '../hooks/useQuestionGeneration';
import QuestionTimer from './QuestionTimer';

export interface QuestionDisplayProps {
  question: Question;
  onAnswerSelect: (selectedAnswer: number) => void;
  hasAnswered: boolean;
  selectedAnswer?: number;
  autoSubmit?: boolean;
  subject?: string;
}

const QuestionDisplay = ({ 
  question, 
  onAnswerSelect, 
  hasAnswered, 
  selectedAnswer,
  autoSubmit = false,
  subject = 'general'
}: QuestionDisplayProps) => {
  const [tempSelected, setTempSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Show explanation when answer is submitted
  useEffect(() => {
    if (hasAnswered && question.explanation) {
      setShowExplanation(true);
      
      // Read the explanation aloud with Nelie's voice
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(question.explanation);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        utterance.pitch = 1.2; // Higher pitch for female voice
        
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
        
        speechSynthesis.speak(utterance);
      }

      // For science subjects, keep explanation visible longer
      if (subject === 'science') {
        // Keep explanation visible for 15 seconds for science
        const timer = setTimeout(() => {
          setShowExplanation(false);
        }, 15000);
        
        return () => clearTimeout(timer);
      } else {
        // For other subjects, hide after 8 seconds
        const timer = setTimeout(() => {
          setShowExplanation(false);
        }, 8000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [hasAnswered, question.explanation, subject]);

  const handleOptionClick = (optionIndex: number) => {
    if (hasAnswered) return;

    if (autoSubmit) {
      onAnswerSelect(optionIndex);
    } else {
      setTempSelected(optionIndex);
    }
  };

  const handleSubmit = () => {
    if (tempSelected !== null) {
      onAnswerSelect(tempSelected);
    }
  };

  const handleTimeUp = () => {
    if (!hasAnswered) {
      // Auto-select a random answer if time runs out
      const randomAnswer = Math.floor(Math.random() * question.options.length);
      onAnswerSelect(randomAnswer);
    }
  };

  const readExplanationAloud = () => {
    if ('speechSynthesis' in window && question.explanation) {
      // Stop any current speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(question.explanation);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1.2; // Higher pitch for female voice
      
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
      
      speechSynthesis.speak(utterance);
    }
  };

  const getOptionStyle = (optionIndex: number) => {
    let baseStyle = "w-full text-left p-4 rounded-lg border transition-all duration-200 ";
    
    if (hasAnswered) {
      if (optionIndex === question.correct) {
        baseStyle += "bg-green-900 border-green-600 text-green-100 ";
      } else if (optionIndex === selectedAnswer) {
        baseStyle += "bg-red-900 border-red-600 text-red-100 ";
      } else {
        baseStyle += "bg-gray-700 border-gray-600 text-gray-400 ";
      }
    } else {
      if (tempSelected === optionIndex) {
        baseStyle += "bg-blue-900 border-blue-600 text-blue-100 ";
      } else {
        baseStyle += "bg-gray-800 border-gray-600 text-white hover:bg-gray-700 hover:border-gray-500 ";
      }
    }

    return baseStyle;
  };

  const getOptionIcon = (optionIndex: number) => {
    if (!hasAnswered) return null;
    
    if (optionIndex === question.correct) {
      return <CheckCircle className="w-5 h-5 text-green-400" />;
    } else if (optionIndex === selectedAnswer) {
      return <XCircle className="w-5 h-5 text-red-400" />;
    }
    
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Always show countdown timer for active questions */}
      <QuestionTimer
        initialTime={question.estimatedTime}
        onTimeUp={handleTimeUp}
        isActive={!hasAnswered}
      />

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-white">{question.question}</CardTitle>
            <Badge variant="outline" className="bg-purple-600 text-white border-purple-600">
              <Clock className="w-3 h-3 mr-1" />
              {question.estimatedTime}s
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(index)}
              disabled={hasAnswered}
              className={getOptionStyle(index)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 rounded-full bg-gray-600 text-white text-sm font-bold flex items-center justify-center">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>{option}</span>
                </div>
                {getOptionIcon(index)}
              </div>
            </button>
          ))}

          {!autoSubmit && !hasAnswered && tempSelected !== null && (
            <Button 
              onClick={handleSubmit}
              className="w-full bg-lime-400 hover:bg-lime-500 text-black font-semibold mt-4"
            >
              Submit Answer
            </Button>
          )}
        </CardContent>
      </Card>

      {hasAnswered && question.explanation && showExplanation && (
        <Card className="bg-blue-900 border-blue-600">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-blue-100">Explanation</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={readExplanationAloud}
                className="text-blue-200 border-blue-400 hover:bg-blue-800"
              >
                <Volume2 className="w-4 h-4 mr-2" />
                Listen
              </Button>
            </div>
            <p className="text-blue-200">{question.explanation}</p>
            {subject === 'science' && (
              <p className="text-xs text-blue-300 mt-2 italic">
                💡 Science explanation will stay visible for 15 seconds
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuestionDisplay;
