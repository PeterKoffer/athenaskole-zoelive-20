
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, Brain } from 'lucide-react';
import { ContentAtom } from '@/types/content';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import CustomSpeakerIcon from '@/components/ui/custom-speaker-icon';
import { SpeakableCard } from '@/components/ui/speakable-card';

interface ContentAtomRendererProps {
  atom: ContentAtom;
  onComplete: (result: { isCorrect: boolean; selectedAnswer: number; timeSpent: number }) => void;
}

const ContentAtomRenderer: React.FC<ContentAtomRendererProps> = ({ atom, onComplete }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [startTime] = useState(Date.now());
  const { speakAsNelie, isSpeaking, stop } = useUnifiedSpeech();

  // Auto-read content when atom changes
  useEffect(() => {
    if (atom.atom_type === 'TEXT_EXPLANATION') {
      const textToSpeak = `${atom.content.title}. ${atom.content.explanation}`;
      setTimeout(() => {
        speakAsNelie(textToSpeak, false, 'atom-explanation');
      }, 1000);
    } else if (atom.atom_type === 'QUESTION_MULTIPLE_CHOICE') {
      setTimeout(() => {
        speakAsNelie(atom.content.question, false, 'atom-question');
      }, 1000);
    }
  }, [atom, speakAsNelie]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const timeSpent = Date.now() - startTime;
    const isCorrect = answerIndex === atom.content.correctAnswer;
    
    // Provide immediate feedback via speech
    if (isCorrect) {
      speakAsNelie("Excellent! That's the correct answer!", false, 'feedback-correct');
    } else {
      speakAsNelie("Not quite right, but keep learning!", false, 'feedback-incorrect');
    }
    
    // Auto-complete after feedback
    setTimeout(() => {
      onComplete({ isCorrect, selectedAnswer: answerIndex, timeSpent });
    }, 2500);
  };

  const handleContinue = () => {
    const timeSpent = Date.now() - startTime;
    onComplete({ isCorrect: true, selectedAnswer: 0, timeSpent });
  };

  if (atom.atom_type === 'TEXT_EXPLANATION') {
    const speakText = `${atom.content.title}. ${atom.content.explanation}. ${atom.content.examples ? 'Examples: ' + atom.content.examples.join('. ') : ''}`;
    
    return (
      <SpeakableCard
        speakText={speakText}
        context="explanation-content"
        className="bg-slate-800 border-slate-700"
      >
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Brain className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-blue-300 font-medium">Understanding</span>
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-4">
            {atom.content.title}
          </h3>
          
          <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
            <p className="text-gray-200 leading-relaxed">
              {atom.content.explanation}
            </p>
          </div>

          {atom.content.examples && atom.content.examples.length > 0 && (
            <div className="bg-blue-900/30 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-200 mb-3">Examples:</h4>
              <ul className="space-y-2">
                {atom.content.examples.map((example: string, index: number) => (
                  <li key={index} className="text-blue-100 flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>{example}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-center pt-4">
            <Button
              onClick={handleContinue}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold"
            >
              Continue
            </Button>
          </div>
        </CardContent>
      </SpeakableCard>
    );
  }

  if (atom.atom_type === 'QUESTION_MULTIPLE_CHOICE') {
    const speakText = `${atom.content.question}. The options are: ${atom.content.options.map((opt: string, i: number) => `Option ${String.fromCharCode(65 + i)}: ${opt}`).join('. ')}`;
    
    return (
      <SpeakableCard
        speakText={speakText}
        context="question-content"
        className="bg-slate-800 border-slate-700"
      >
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-400" />
              <span className="text-sm text-orange-300 font-medium">Grade 5 Math Question</span>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-white leading-relaxed">
            {atom.content.question}
          </h3>

          <div className="grid gap-3">
            {atom.content.options.map((option: string, index: number) => {
              let buttonClass = "w-full text-left p-4 rounded-lg border-2 transition-all duration-200";
              
              if (showResult) {
                if (index === atom.content.correctAnswer) {
                  buttonClass += " bg-green-600 border-green-500 text-white";
                } else if (index === selectedAnswer && index !== atom.content.correctAnswer) {
                  buttonClass += " bg-red-600 border-red-500 text-white";
                } else {
                  buttonClass += " bg-gray-700 border-gray-600 text-gray-300";
                }
              } else if (selectedAnswer === index) {
                buttonClass += " bg-blue-600 border-blue-500 text-white";
              } else {
                buttonClass += " bg-gray-700 border-gray-600 text-white hover:bg-gray-600";
              }

              return (
                <Button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={buttonClass}
                  variant="outline"
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-lg">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-base">{option}</span>
                  </div>
                </Button>
              );
            })}
          </div>

          {showResult && (
            <div className={`p-4 rounded-lg border ${
              selectedAnswer === atom.content.correctAnswer 
                ? 'bg-green-900/50 border-green-500' 
                : 'bg-red-900/50 border-red-500'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                {selectedAnswer === atom.content.correctAnswer ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
                <span className="font-semibold text-white">
                  {selectedAnswer === atom.content.correctAnswer ? 'Correct!' : 'Not quite right'}
                </span>
              </div>
              {atom.content.explanation && (
                <p className="text-gray-200 mt-2">
                  {atom.content.explanation}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </SpeakableCard>
    );
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardContent className="p-6 text-center">
        <p className="text-gray-400">Unknown content type: {atom.atom_type}</p>
      </CardContent>
    </Card>
  );
};

export default ContentAtomRenderer;
