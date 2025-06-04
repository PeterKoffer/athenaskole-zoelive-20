
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Volume2, VolumeX } from 'lucide-react';

interface QuestionDisplayProps {
  question: string;
  options: string[];
  selectedAnswer: number | null;
  correctAnswer: number;
  showResult: boolean;
  explanation?: string;
  standardInfo?: {
    code: string;
    title: string;
  };
  questionNumber: number;
  totalQuestions: number;
  onAnswerSelect: (index: number) => void;
  hasAnswered?: boolean;
  autoSubmit?: boolean;
  subject?: string;
}

const QuestionDisplay = ({
  question,
  options,
  selectedAnswer,
  correctAnswer,
  showResult,
  explanation,
  standardInfo,
  questionNumber,
  totalQuestions,
  onAnswerSelect,
  hasAnswered = false,
  autoSubmit = false,
  subject = ''
}: QuestionDisplayProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoReadEnabled, setAutoReadEnabled] = useState(true);
  const hasAutoRead = useRef(false);

  // Clean up question text and provide fallback for technical IDs
  const cleanQuestionText = (text: string) => {
    // If the question looks like a technical ID, provide a proper fallback
    if (text.includes('Practice question') && text.match(/\d{13,}-\d+/)) {
      if (subject === 'music') {
        return 'Which of the following is a major scale?';
      }
      return 'What is the correct answer to this practice question?';
    }
    
    return text
      .replace(/\(ID:\s*[^)]+\)/gi, '') // Remove (ID: ...) patterns
      .replace(/\(Question\s*\d+[^)]*\)/gi, '') // Remove (Question X) patterns
      .replace(/\s+/g, ' ') // Clean up extra spaces
      .trim();
  };

  const stopSpeaking = () => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const speakText = async (text: string) => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    try {
      setIsSpeaking(true);
      speechSynthesis.cancel(); // Stop any current speech

      // Small delay to ensure cancellation is processed
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        utterance.pitch = 1.2; // Higher pitch for Nelie
        utterance.volume = 1.0;

        // Try to use a female voice for Nelie
        const voices = speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice => 
          voice.name.toLowerCase().includes('female') ||
          voice.name.toLowerCase().includes('woman') ||
          voice.name.toLowerCase().includes('samantha') ||
          voice.name.toLowerCase().includes('karen') ||
          voice.name.toLowerCase().includes('victoria') ||
          voice.name.toLowerCase().includes('zira') ||
          (voice.name.toLowerCase().includes('alex') && voice.lang.includes('en'))
        );

        if (femaleVoice) {
          utterance.voice = femaleVoice;
        }

        utterance.onend = () => {
          setIsSpeaking(false);
        };

        utterance.onerror = () => {
          setIsSpeaking(false);
        };

        speechSynthesis.speak(utterance);
      }, 100);
    } catch (error) {
      console.error('Speech synthesis error:', error);
      setIsSpeaking(false);
    }
  };

  const readQuestionAndOptions = () => {
    const cleanQuestion = cleanQuestionText(question);
    const optionsText = options.map((option, index) => 
      `Option ${String.fromCharCode(65 + index)}: ${option}`
    ).join('. ');
    
    const fullText = `Question: ${cleanQuestion}. The options are: ${optionsText}`;
    speakText(fullText);
  };

  const readExplanation = () => {
    if (explanation) {
      const correctOptionText = `The correct answer is ${String.fromCharCode(65 + correctAnswer)}: ${options[correctAnswer]}`;
      const fullText = `${correctOptionText}. ${explanation}`;
      speakText(fullText);
    }
  };

  // Handle mute button click
  const handleMuteToggle = () => {
    if (autoReadEnabled) {
      // Turning off auto-read and stopping current speech
      setAutoReadEnabled(false);
      stopSpeaking();
    } else {
      // Turning on auto-read
      setAutoReadEnabled(true);
    }
  };

  // Auto-read question when it first appears
  useEffect(() => {
    if (autoReadEnabled && !hasAutoRead.current && !showResult) {
      hasAutoRead.current = true;
      setTimeout(() => {
        readQuestionAndOptions();
      }, 1000); // Small delay to let the UI settle
    }
  }, [question, autoReadEnabled]);

  // Auto-read explanation when result is shown
  useEffect(() => {
    if (autoReadEnabled && showResult && explanation) {
      setTimeout(() => {
        readExplanation();
      }, 1500); // Delay to let the result UI appear
    }
  }, [showResult, explanation, autoReadEnabled]);

  // Reset auto-read flag when question changes
  useEffect(() => {
    hasAutoRead.current = false;
  }, [question]);

  // Stop speaking when component unmounts
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const getOptionClassName = (index: number) => {
    if (selectedAnswer === index) {
      if (showResult) {
        return selectedAnswer === correctAnswer
          ? 'bg-green-600 border-green-500 text-white'
          : 'bg-red-600 border-red-500 text-white';
      }
      return 'bg-blue-600 border-blue-500 text-white';
    }
    
    if (showResult && index === correctAnswer) {
      return 'bg-green-600 border-green-500 text-white';
    }
    
    return 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white flex-1">
          {cleanQuestionText(question)}
        </h3>
        
        <div className="flex items-center space-x-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleMuteToggle}
            className="text-slate-950"
            title={autoReadEnabled ? "Mute Nelie" : "Unmute Nelie"}
          >
            {autoReadEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={readQuestionAndOptions}
            className="text-slate-950"
            disabled={isSpeaking || !autoReadEnabled}
          >
            <Volume2 className="w-4 h-4 mr-2" />
            {isSpeaking ? 'Nelie is reading...' : 'Ask Nelie to read'}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {options.map((option: string, index: number) => (
          <Button
            key={index}
            variant="outline"
            className={`w-full text-left justify-start p-4 h-auto ${getOptionClassName(index)}`}
            onClick={() => onAnswerSelect(index)}
            disabled={showResult || selectedAnswer !== null}
          >
            <span className="mr-3 font-semibold">
              {String.fromCharCode(65 + index)}.
            </span>
            {option}
            {showResult && index === correctAnswer && (
              <CheckCircle className="w-5 h-5 ml-auto text-green-400" />
            )}
            {showResult && selectedAnswer === index && index !== correctAnswer && (
              <XCircle className="w-5 h-5 ml-auto text-red-400" />
            )}
          </Button>
        ))}
      </div>

      {showResult && explanation && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-white font-medium">Explanation:</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={readExplanation}
              className="text-slate-950"
              disabled={isSpeaking || !autoReadEnabled}
            >
              <Volume2 className="w-4 h-4 mr-1" />
              Listen
            </Button>
          </div>
          <p className="text-gray-300">{explanation}</p>
          <p className="text-gray-400 text-sm mt-2">
            {questionNumber < totalQuestions ? 'Next grade-appropriate question coming up...' : 'Session completing...'}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestionDisplay;
