
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Lightbulb, Target, Clock, Brain } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface LearningAtom {
  id: string;
  title: string;
  content: any;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number;
  learningObjectives: string[];
  interactionType: 'multiple-choice' | 'text-input' | 'drag-drop';
}

interface AdaptiveLearningAtomRendererProps {
  atom: LearningAtom;
  onComplete: (success: boolean, timeSpent: number) => void;
}

const AdaptiveLearningAtomRenderer: React.FC<AdaptiveLearningAtomRendererProps> = ({
  atom,
  onComplete
}) => {
  const { user } = useAuth();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [startTime] = useState(Date.now());
  const [progress, setProgress] = useState(0);
  const [currentHint, setCurrentHint] = useState(0);
  const [showHints, setShowHints] = useState(false);

  // Sample content structure
  const questionData = {
    easy: {
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correct: 1,
      hints: ["Think about counting", "Add one more to 3"]
    },
    medium: {
      question: "What is 15 × 8?",
      options: ["120", "125", "115", "130"],
      correct: 0,
      hints: ["Break it down: 15 × 8 = 15 × 10 - 15 × 2", "10 × 15 = 150, 2 × 15 = 30"]
    },
    hard: {
      question: "Solve: 3x + 7 = 22",
      options: ["x = 4", "x = 5", "x = 6", "x = 7"],
      correct: 1,
      hints: ["Subtract 7 from both sides first", "Then divide by 3"]
    }
  };

  const currentQuestion = questionData[atom.difficulty as keyof typeof questionData];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => Math.min(prev + 1, 100));
    }, (atom.estimatedTime * 1000) / 100);

    return () => clearInterval(timer);
  }, [atom.estimatedTime]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const isCorrect = answerIndex === currentQuestion.correct;
    const timeSpent = Date.now() - startTime;
    
    if (isCorrect) {
      toast.success("Correct! Well done!");
    } else {
      toast.error("Not quite right. Let's learn from this!");
    }

    // Save interaction event
    if (user) {
      saveInteractionEvent(isCorrect, timeSpent);
    }

    setTimeout(() => {
      onComplete(isCorrect, timeSpent);
    }, 2000);
  };

  const saveInteractionEvent = async (isCorrect: boolean, timeSpent: number) => {
    if (!user) return;

    try {
      await supabase.from('ai_interactions').insert({
        user_id: user.id,
        interaction_type: 'learning_atom_completion',
        ai_service: 'adaptive_learning',
        success: isCorrect,
        processing_time_ms: timeSpent,
        response_data: {
          atom_id: atom.id,
          difficulty: atom.difficulty,
          selected_answer: selectedAnswer,
          correct_answer: currentQuestion.correct,
          time_spent: timeSpent
        }
      });
    } catch (error) {
      console.error('Error saving interaction event:', error);
    }
  };

  const toggleHints = () => {
    setShowHints(!showHints);
  };

  const nextHint = () => {
    if (currentHint < currentQuestion.hints.length - 1) {
      setCurrentHint(currentHint + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-900 to-purple-900 border-blue-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              {atom.title}
            </CardTitle>
            <Badge variant="secondary" className="bg-blue-100 text-blue-900">
              {atom.difficulty}
            </Badge>
          </div>
          <div className="flex items-center space-x-4 text-blue-200">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span className="text-sm">{atom.estimatedTime}min</span>
            </div>
            <div className="flex items-center">
              <Target className="w-4 h-4 mr-1" />
              <span className="text-sm">{atom.learningObjectives.length} objectives</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Progress */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Progress</span>
            <span className="text-sm text-gray-300">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </CardContent>
      </Card>

      {/* Question */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentQuestion.options.map((option: string, index: number) => (
            <Button
              key={index}
              variant="outline"
              className={`w-full text-left justify-start p-4 h-auto ${
                selectedAnswer === index
                  ? showResult
                    ? selectedAnswer === currentQuestion.correct
                      ? 'bg-green-600 border-green-500 text-white'
                      : 'bg-red-600 border-red-500 text-white'
                    : 'bg-blue-600 border-blue-500 text-white'
                  : showResult && index === currentQuestion.correct
                  ? 'bg-green-600 border-green-500 text-white'
                  : 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
              }`}
              onClick={() => handleAnswerSelect(index)}
              disabled={showResult}
            >
              <span className="mr-3 font-semibold">
                {String.fromCharCode(65 + index)}.
              </span>
              {option}
              {showResult && index === currentQuestion.correct && (
                <CheckCircle className="w-5 h-5 ml-auto text-green-400" />
              )}
              {showResult && selectedAnswer === index && index !== currentQuestion.correct && (
                <XCircle className="w-5 h-5 ml-auto text-red-400" />
              )}
            </Button>
          ))}

          {/* Hints */}
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={toggleHints}
              className="text-yellow-300 border-yellow-600 hover:bg-yellow-900"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              {showHints ? 'Hide Hints' : 'Show Hints'}
            </Button>

            {showHints && (
              <div className="mt-3 p-4 bg-yellow-900 border border-yellow-700 rounded-lg">
                <p className="text-yellow-100 mb-2">{currentQuestion.hints[currentHint]}</p>
                {currentHint < currentQuestion.hints.length - 1 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={nextHint}
                    className="text-yellow-300 border-yellow-600"
                  >
                    Next Hint
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Learning Objectives */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Learning Objectives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {atom.learningObjectives.map((objective, index) => (
              <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-900">
                {objective}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdaptiveLearningAtomRenderer;
