import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Volume2 } from 'lucide-react';
import ExplanationCard from './ExplanationCard';
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
  const handleReadQuestion = () => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(question.question);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    utterance.pitch = 1.2;
    const voices = speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('samantha') || voice.name.toLowerCase().includes('karen'));
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    speechSynthesis.speak(utterance);
  };
  const getResponseTimeSeconds = (): number => {
    if (!responseStartTime || !hasAnswered) return 0;
    return Math.round((new Date().getTime() - responseStartTime.getTime()) / 1000);
  };
  const isCorrect = selectedAnswer === question.correct;
  return <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-xl font-semibold text-white flex-1 pr-4">
              {question.question}
            </h2>
            <Button variant="outline" size="sm" onClick={handleReadQuestion} className="border-gray-600 shrink-0 text-slate-950 bg-slate-50">
              <Volume2 className="w-4 h-4 mr-2" />
              {isSpeaking ? 'Stop' : 'Listen'}
            </Button>
          </div>
          
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
            return <button key={index} onClick={() => handleAnswerClick(index)} disabled={hasAnswered} className={buttonStyle}>
                  <div className="flex items-center justify-between">
                    <span className="text-base">{option}</span>
                    {hasAnswered && <div className="ml-2">
                        {isCorrectAnswer && <CheckCircle className="w-5 h-5 text-green-400" />}
                        {isSelected && !isCorrectAnswer && <XCircle className="w-5 h-5 text-red-400" />}
                      </div>}
                  </div>
                </button>;
          })}
          </div>
        </CardContent>
      </Card>

      <ExplanationCard explanation={question.explanation || "Great job! Keep up the good work."} subject={subject} skillArea={skillArea} isVisible={showExplanation} isCorrect={isCorrect} correctAnswer={hasAnswered ? question.options[question.correct] : undefined} questionData={question} userAnswer={hasAnswered ? question.options[selectedAnswer || 0] : undefined} responseTimeSeconds={getResponseTimeSeconds()} sessionId={sessionId} questionNumber={questionNumber} totalQuestions={totalQuestions} />
    </div>;
};
export default QuestionDisplay;