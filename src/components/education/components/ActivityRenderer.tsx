
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

interface ActivityRendererProps {
  activity: any;
  onComplete: (success: boolean, timeSpent: number) => void;
  timeRemaining: number;
}

const ActivityRenderer = ({ activity, onComplete, timeRemaining }: ActivityRendererProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [startTime] = useState(Date.now());

  if (!activity) {
    return (
      <Card className="bg-purple-900/30 border-purple-700">
        <CardContent className="p-6 text-center">
          <div className="text-purple-200">Loading activity...</div>
        </CardContent>
      </Card>
    );
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const isCorrect = selectedAnswer === activity.content.correctAnswer;
    
    setShowResult(true);
    
    setTimeout(() => {
      onComplete(isCorrect, timeSpent);
    }, 2000);
  };

  if (activity.type === 'introduction') {
    return (
      <Card className="bg-gradient-to-br from-purple-900 to-blue-900 border-purple-400">
        <CardHeader>
          <CardTitle className="text-white text-center">{activity.title}</CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <div className="text-purple-100 text-lg mb-6">
            {activity.content.hook}
          </div>
          <Button 
            onClick={() => onComplete(true, 3)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Let's Start Learning!
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (activity.type === 'interactive-game' && activity.content.question) {
    return (
      <Card className="bg-purple-900/30 border-purple-700">
        <CardHeader>
          <CardTitle className="text-white">{activity.title}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-purple-100 text-lg mb-6">
            {activity.content.question}
          </div>
          
          {!showResult && (
            <>
              <div className="space-y-3 mb-6">
                {activity.content.options?.map((option: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full p-3 text-left rounded-lg border transition-colors ${
                      selectedAnswer === index
                        ? 'bg-purple-600 border-purple-400 text-white'
                        : 'bg-purple-800/50 border-purple-600 text-purple-200 hover:bg-purple-700/50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              
              <Button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              >
                Submit Answer
              </Button>
            </>
          )}
          
          {showResult && (
            <div className="text-center">
              {selectedAnswer === activity.content.correctAnswer ? (
                <div className="text-green-400 flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 mr-2" />
                  <span className="text-xl font-bold">Correct!</span>
                </div>
              ) : (
                <div className="text-red-400 flex items-center justify-center mb-4">
                  <XCircle className="w-8 h-8 mr-2" />
                  <span className="text-xl font-bold">Not quite right</span>
                </div>
              )}
              <div className="text-purple-200">
                {activity.content.explanation}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-purple-900/30 border-purple-700">
      <CardHeader>
        <CardTitle className="text-white">{activity.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="text-purple-100 mb-4">
          {activity.content.text || activity.phaseDescription}
        </div>
        <Button 
          onClick={() => onComplete(true, 5)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Continue
        </Button>
      </CardContent>
    </Card>
  );
};

export default ActivityRenderer;
