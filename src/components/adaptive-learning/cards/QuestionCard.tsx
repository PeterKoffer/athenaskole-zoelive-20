
// src/components/adaptive-learning/cards/QuestionCard.tsx

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ContentAtom } from '@/types/content';

interface QuestionCardProps {
  atom: ContentAtom;
  onSubmitAnswer: (answer: string | string[], isCorrect: boolean) => void;
  disabled?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ atom, onSubmitAnswer, disabled = false }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const content = atom.content as {
    question: string;
    options: string[];
    correctAnswer: number;
    correctFeedback?: string;
    generalIncorrectFeedback?: string;
  };

  const handleOptionSelect = (index: number) => {
    if (hasAnswered || disabled) return;
    
    setSelectedAnswer(index);
    setHasAnswered(true);
    
    const isCorrect = index === content.correctAnswer;
    onSubmitAnswer(content.options[index], isCorrect);
  };

  return (
    <Card className="bg-slate-700/50 border-slate-600">
      <CardHeader>
        <CardTitle className="text-lg text-sky-300">Question</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-slate-200 text-lg font-medium">
          {content.question}
        </p>
        
        <div className="space-y-2">
          {content.options.map((option, index) => {
            let buttonVariant: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link" = "outline";
            let buttonClass = "w-full justify-start text-left h-auto p-4 text-slate-200 border-slate-600 hover:border-sky-400";
            
            if (hasAnswered) {
              if (index === content.correctAnswer) {
                buttonVariant = "default";
                buttonClass += " bg-green-600 border-green-500 text-white";
              } else if (index === selectedAnswer && index !== content.correctAnswer) {
                buttonVariant = "destructive";
                buttonClass += " bg-red-600 border-red-500 text-white";
              }
            } else if (selectedAnswer === index) {
              buttonClass += " border-sky-400 bg-sky-900/30";
            }

            return (
              <Button
                key={index}
                variant={buttonVariant}
                className={buttonClass}
                onClick={() => handleOptionSelect(index)}
                disabled={disabled}
              >
                <span className="mr-3 font-semibold">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
