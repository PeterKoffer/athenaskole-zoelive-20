
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface StableMultipleChoiceRendererProps {
  question: string;
  options: string[];
  correctAnswer: number;
  onAnswerSelect: (index: number) => void;
  selectedAnswer: number | null;
}

const StableMultipleChoiceRenderer = ({
  question,
  options,
  correctAnswer,
  onAnswerSelect,
  selectedAnswer
}: StableMultipleChoiceRendererProps) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">{question}</h3>
        <div className="space-y-3">
          {options.map((option, index) => (
            <Button
              key={index}
              onClick={() => onAnswerSelect(index)}
              variant={selectedAnswer === index ? "default" : "outline"}
              className={`w-full text-left justify-start p-4 h-auto ${
                selectedAnswer === index 
                  ? "bg-blue-600 hover:bg-blue-700" 
                  : "bg-gray-700 hover:bg-gray-600 border-gray-600"
              }`}
            >
              <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
              {option}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StableMultipleChoiceRenderer;
