
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
    <Card className="bg-white border-2 border-gray-300 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <CardTitle className="text-2xl font-bold text-gray-800">Question</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-8">
        <p className="text-gray-900 text-xl font-semibold leading-relaxed">
          {content.question}
        </p>
        
        <div className="space-y-4">
          {content.options.map((option, index) => {
            let buttonVariant: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link" = "outline";
            let buttonClass = "w-full justify-start text-left h-auto p-6 text-lg font-medium transition-all duration-200 border-2";
            
            if (hasAnswered) {
              if (index === content.correctAnswer) {
                buttonVariant = "default";
                buttonClass += " bg-green-100 border-green-500 text-green-800 hover:bg-green-200";
              } else if (index === selectedAnswer && index !== content.correctAnswer) {
                buttonVariant = "destructive";
                buttonClass += " bg-red-100 border-red-500 text-red-800 hover:bg-red-200";
              } else {
                buttonClass += " bg-gray-50 border-gray-300 text-gray-600";
              }
            } else if (selectedAnswer === index) {
              buttonClass += " border-blue-500 bg-blue-50 text-blue-800";
            } else {
              buttonClass += " border-gray-300 text-gray-800 hover:border-blue-400 hover:bg-blue-50";
            }

            return (
              <Button
                key={index}
                variant={buttonVariant}
                className={buttonClass}
                onClick={() => handleOptionSelect(index)}
                disabled={disabled}
              >
                <span className="mr-4 font-bold text-xl bg-gray-200 text-gray-800 w-8 h-8 rounded-full flex items-center justify-center">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1 text-left">{option}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
