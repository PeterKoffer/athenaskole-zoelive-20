
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Award, BookOpen, ArrowRight } from 'lucide-react';
import { LessonActivity } from '../types/LessonTypes';

interface ActivitySummaryProps {
  activity: LessonActivity;
  timeRemaining: number;
  onContinue: () => void;
  onAnswerSubmit: (wasCorrect: boolean) => void;
}

const ActivitySummary = ({ activity, timeRemaining, onContinue, onAnswerSubmit }: ActivitySummaryProps) => {
  const [showAssessment, setShowAssessment] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleShowAssessment = () => {
    setShowAssessment(true);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setShowResult(true);
    const isCorrect = selectedAnswer === activity.content.selfAssessment?.correctAnswer;
    
    setTimeout(() => {
      onAnswerSubmit(isCorrect);
    }, 2500);
  };

  return (
    <Card className="bg-gradient-to-br from-emerald-900 to-teal-900 border-emerald-400">
      <CardContent className="p-8">
        <div className="flex items-center mb-6">
          <Award className="w-8 h-8 text-emerald-400 mr-3" />
          <div>
            <h3 className="text-2xl font-bold text-white">{activity.title}</h3>
            <p className="text-emerald-200 text-sm">{activity.phaseDescription}</p>
          </div>
        </div>
        
        {!showAssessment ? (
          <div className="space-y-6">
            <div className="bg-emerald-800/30 rounded-lg p-6">
              <h4 className="text-emerald-300 font-bold text-xl mb-4">🎯 Key Takeaways</h4>
              <ul className="space-y-3">
                {activity.content.keyTakeaways?.map((takeaway, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-emerald-100 leading-relaxed">{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-teal-800/30 rounded-lg p-6">
              <h4 className="text-teal-300 font-bold text-lg mb-3">🚀 What's Next?</h4>
              <p className="text-teal-100 leading-relaxed">{activity.content.nextTopicSuggestion}</p>
            </div>
            
            <div className="text-center">
              <Button
                onClick={handleShowAssessment}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3"
              >
                Quick Self-Assessment <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-xl text-white mb-6 font-medium leading-relaxed">
              <span className="text-emerald-300 font-semibold">Final Check: </span>
              {activity.content.selfAssessment?.question}
            </div>
            
            <div className="space-y-3 mb-6">
              {activity.content.selfAssessment?.options?.map((option: string, index: number) => (
                <Button
                  key={index}
                  variant={selectedAnswer === index ? "default" : "outline"}
                  className={`w-full text-left justify-start p-4 h-auto transition-all duration-200 ${
                    showResult
                      ? index === activity.content.selfAssessment?.correctAnswer
                        ? "bg-green-600 border-green-400 text-white"
                        : selectedAnswer === index
                        ? "bg-red-600 border-red-400 text-white"
                        : "bg-gray-700 border-gray-600 text-gray-300"
                      : selectedAnswer === index
                      ? "bg-emerald-500 text-white transform scale-105"
                      : "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                >
                  <span className="mr-3 font-bold text-lg">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                  {showResult && index === activity.content.selfAssessment?.correctAnswer && (
                    <CheckCircle className="w-5 h-5 ml-auto text-green-200" />
                  )}
                  {showResult && selectedAnswer === index && index !== activity.content.selfAssessment?.correctAnswer && (
                    <XCircle className="w-5 h-5 ml-auto text-red-200" />
                  )}
                </Button>
              ))}
            </div>

            {showResult && (
              <div className={`p-4 rounded-lg mb-4 ${
                selectedAnswer === activity.content.selfAssessment?.correctAnswer 
                  ? 'bg-green-800/50 border border-green-600' 
                  : 'bg-orange-800/50 border border-orange-600'
              }`}>
                <div className="flex items-center mb-2">
                  <Award className="w-6 h-6 text-yellow-400 mr-2" />
                  <span className="font-bold text-lg text-emerald-300">
                    Lesson Complete! You've mastered today's concepts!
                  </span>
                </div>
                <p className="text-gray-200 leading-relaxed">
                  Congratulations on completing this comprehensive learning journey!
                </p>
              </div>
            )}

            {!showResult && (
              <div className="flex justify-between items-center">
                <div className="text-emerald-300">Final Phase: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</div>
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                >
                  Complete Lesson
                </Button>
              </div>
            )}
          </div>
        )}
        
        <div className="text-center text-emerald-300 mt-6">
          Phase 6 of 6 • Summary & Next Steps
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivitySummary;
