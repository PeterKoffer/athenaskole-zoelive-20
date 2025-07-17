
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface StableMultipleChoiceRendererProps {
  atom: {
    atom_id: string;
    content: {
      question: string;
      options: string[];
      correct: number;
      explanation?: string;
    };
  };
  onComplete: (result: { isCorrect: boolean; selectedAnswer: number }) => void;
}

const StableMultipleChoiceRenderer = ({ atom, onComplete }: StableMultipleChoiceRendererProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const { question, options, correct, explanation } = atom.content;

  const handleAnswerSelect = (index: number) => {
    if (hasAnswered) return;
    
    setSelectedAnswer(index);
    setHasAnswered(true);
    setShowResult(true);
    
    const isCorrect = index === correct;
    
    setTimeout(() => {
      onComplete({ isCorrect, selectedAnswer: index });
    }, 2000);
  };

  const getOptionStyle = (index: number) => {
    if (!showResult) {
      return selectedAnswer === index 
        ? 'border-primary bg-primary/10' 
        : 'border-border hover:border-primary/50';
    }
    
    if (index === correct) {
      return 'border-green-500 bg-green-500/10 text-green-700';
    }
    
    if (index === selectedAnswer && index !== correct) {
      return 'border-red-500 bg-red-500/10 text-red-700';
    }
    
    return 'border-border bg-muted/30';
  };

  const getOptionIcon = (index: number) => {
    if (!showResult) return null;
    
    if (index === correct) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
    
    if (index === selectedAnswer && index !== correct) {
      return <XCircle className="w-5 h-5 text-red-600" />;
    }
    
    return null;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Question
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-lg font-medium leading-relaxed">
          {question}
        </div>
        
        <div className="grid gap-3">
          {options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className={`p-4 h-auto text-left justify-start transition-all ${getOptionStyle(index)}`}
              onClick={() => handleAnswerSelect(index)}
              disabled={hasAnswered}
            >
              <div className="flex items-center gap-3 w-full">
                <span className="flex-shrink-0 w-6 h-6 rounded-full border border-current flex items-center justify-center text-sm font-medium">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1">{option}</span>
                {getOptionIcon(index)}
              </div>
            </Button>
          ))}
        </div>
        
        {showResult && explanation && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Explanation:</h4>
            <p className="text-blue-800">{explanation}</p>
          </div>
        )}
        
        {showResult && (
          <div className="text-center text-sm text-muted-foreground">
            Moving to next question in a moment...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StableMultipleChoiceRenderer;
