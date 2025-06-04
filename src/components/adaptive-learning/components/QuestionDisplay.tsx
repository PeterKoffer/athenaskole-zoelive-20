
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Volume2 } from 'lucide-react';
import ExplanationCard from './ExplanationCard';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';

interface QuestionDisplayProps {
  question: any;
  onAnswerSelect: (answerIndex: number) => void;
  hasAnswered: boolean;
  selectedAnswer?: number;
  autoSubmit?: boolean;
  subject: string;
  skillArea?: string;
  sessionId?: string;
  questionNumber?: number;
  totalQuestions?: number;
  responseStartTime?: Date;
}

const QuestionDisplay = ({
  question,
  onAnswerSelect,
  hasAnswered,
  selectedAnswer,
  autoSubmit = false,
  subject,
  skillArea = 'general',
  sessionId,
  questionNumber,
  totalQuestions,
  responseStartTime
}: QuestionDisplayProps) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { speak } = useSpeechSynthesis();

  // Show explanation after answering
  useEffect(() => {
    if (hasAnswered) {
      const timer = setTimeout(() => {
        setShowExplanation(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setShowExplanation(false);
    }
  }, [hasAnswered]);

  if (!question) {
    return <div>Loading question...</div>;
  }

  const handleAnswerClick = (answerIndex: number) => {
    if (hasAnswered) return;
    onAnswerSelect(answerIndex);
    if (autoSubmit) {
      setTimeout(() => setShowExplanation(true), 1000);
    }
  };

  const handleNelieRead = async () => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    
    // Create the text for Nelie to read
    let textToRead = `Hi! I'm Nelie, your AI tutor. Here's your question: ${question.question}`;
    
    // Add the answer options
    textToRead += ` Your options are: `;
    question.options.forEach((option: string, index: number) => {
      textToRead += `Option ${String.fromCharCode(65 + index)}: ${option}. `;
    });

    try {
      await speak(textToRead);
    } catch (error) {
      console.error('Speech failed:', error);
    }
    
    setIsSpeaking(false);
  };

  const getResponseTimeSeconds = (): number => {
    if (!responseStartTime || !hasAnswered) return 0;
    return Math.round((new Date().getTime() - responseStartTime.getTime()) / 1000);
  };

  const isCorrect = selectedAnswer === question.correct;

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          {/* Nelie Read Button - Prominent at the top */}
          <div className="text-center mb-6">
            <Button
              onClick={handleNelieRead}
              className={`${
                isSpeaking 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
              } text-white px-6 py-3 text-lg font-semibold rounded-full shadow-lg transition-all duration-200`}
            >
              <Volume2 className="w-5 h-5 mr-2" />
              {isSpeaking ? 'Nelie is Speaking...' : 'Ask Nelie to Read Question'}
            </Button>
          </div>

          <h2 className="text-xl font-semibold text-white mb-6 text-center">
            {question.question}
          </h2>
          
          <div className="grid gap-3">
            {question.options.map((option: string, index: number) => {
              const isSelected = selectedAnswer === index;
              const isCorrectAnswer = index === question.correct;
              let buttonStyle = "w-full p-4 text-left transition-all duration-200 border-2 ";
              
              if (hasAnswered) {
                if (isCorrectAnswer) {
                  buttonStyle += "border-green-500 bg-green-900/30 text-green-200 ";
                } else if (isSelected && !isCorrectAnswer) {
                  buttonStyle += "border-red-500 bg-red-900/30 text-red-200 ";
                } else {
                  buttonStyle += "border-gray-600 bg-gray-800 text-gray-400 ";
                }
              } else {
                buttonStyle += "border-gray-600 bg-gray-800 text-white hover:border-blue-500 hover:bg-blue-900/20 ";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                  disabled={hasAnswered}
                  className={buttonStyle}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base">
                      <span className="font-semibold mr-2">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </span>
                    {hasAnswered && (
                      <div className="ml-2">
                        {isCorrectAnswer && <CheckCircle className="w-5 h-5 text-green-400" />}
                        {isSelected && !isCorrectAnswer && <XCircle className="w-5 h-5 text-red-400" />}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <ExplanationCard
        explanation={question.explanation || "Great job! Keep up the good work."}
        subject={subject}
        skillArea={skillArea}
        isVisible={showExplanation}
        isCorrect={isCorrect}
        correctAnswer={hasAnswered ? question.options[question.correct] : undefined}
        questionData={question}
        userAnswer={hasAnswered ? question.options[selectedAnswer || 0] : undefined}
        responseTimeSeconds={getResponseTimeSeconds()}
        sessionId={sessionId}
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
      />
    </div>
  );
};

export default QuestionDisplay;
