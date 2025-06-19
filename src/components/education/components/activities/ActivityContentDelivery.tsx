
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import CustomSpeakerIcon from '@/components/ui/custom-speaker-icon';
import { LessonActivity } from '../types/LessonTypes';
import TextWithSpeaker from '../shared/TextWithSpeaker';

interface ActivityContentDeliveryProps {
  activity: LessonActivity;
  onActivityComplete: (wasCorrect?: boolean) => void;
}

const ActivityContentDelivery = ({ activity, onActivityComplete }: ActivityContentDeliveryProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [startTime] = useState(Date.now());

  console.log('🎭 ActivityContentDelivery rendering:', {
    activityId: activity.id,
    title: activity.title,
    selectedAnswer,
    showResult
  });

  const segment = activity.content.segments?.[0];
  const displayTitle = activity.content.uniqueTheme || activity.title;
  const mainExplanation = activity.content.uniqueScenario || segment?.explanation || activity.content.text || 'Content coming soon...';
  const conceptTitle = activity.content.uniqueScenario ? 'Scenario Focus' : (segment?.concept || 'Learning Content');

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    console.log('🎯 User selected answer:', answerIndex);
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null || showResult || !segment?.checkQuestion) return;
    
    const responseTime = Date.now() - startTime;
    const correctAnswerIndex = segment.checkQuestion.correctAnswer;
    const isCorrect = selectedAnswer === correctAnswerIndex;
    
    console.log('✅ Activity submitted:', {
      selectedAnswer,
      correctAnswer: correctAnswerIndex,
      isCorrect,
      responseTime,
      activityId: activity.id
    });
    
    setShowResult(true);
    
    setTimeout(() => {
      onActivityComplete(isCorrect);
    }, 2000);
  };

  const handleNext = () => {
    console.log('➡️ Moving to next activity');
    onActivityComplete();
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>{displayTitle}</span>
          {activity.content.uniqueTheme && activity.title && activity.title !== displayTitle &&
            <span className="text-xs text-purple-300 ml-2">(Original Title: {activity.title})</span>}
          <Button
            variant="outline"
            size="sm"
            onClick={() => playAudio(mainExplanation)}
            className="border-gray-600 text-white bg-gray-700 hover:bg-gray-600"
          >
            <CustomSpeakerIcon className="w-4 h-4" size={16} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <TextWithSpeaker
          text={mainExplanation}
          context="activity-content-explanation"
          position="corner"
          showOnHover={false}
        >
          <div className="bg-gray-700 border border-gray-600 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">
              {conceptTitle}
            </h3>
            <p className="text-gray-200 text-lg leading-relaxed">
              {mainExplanation}
            </p>
          </div>
        </TextWithSpeaker>
        
        {segment?.checkQuestion && (
          <div className="space-y-4">
            <TextWithSpeaker
              text={segment.checkQuestion.question}
              context="activity-question"
              position="corner"
              showOnHover={false}
            >
              <div className="bg-blue-900/20 rounded-lg p-4">
                <h4 className="text-lg font-medium text-white">
                  {segment.checkQuestion.question}
                </h4>
              </div>
            </TextWithSpeaker>
            
            <div className="space-y-3">
              {segment.checkQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`w-full text-left justify-start p-4 h-auto transition-colors ${
                    selectedAnswer === index
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                >
                  <span className="mr-3 font-semibold">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </Button>
              ))}
            </div>

            {showResult && (
              <TextWithSpeaker
                text={segment.checkQuestion.explanation}
                context="activity-explanation"
                position="corner"
                showOnHover={false}
              >
                <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    {selectedAnswer === segment.checkQuestion.correctAnswer ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                    <p className={`font-semibold ${
                      selectedAnswer === segment.checkQuestion.correctAnswer 
                        ? 'text-green-400' 
                        : 'text-red-400'
                    }`}>
                      {selectedAnswer === segment.checkQuestion.correctAnswer ? 'Excellent!' : 'Try again next time!'}
                    </p>
                  </div>
                  <p className="text-gray-300">
                    {segment.checkQuestion.explanation}
                  </p>
                </div>
              </TextWithSpeaker>
            )}

            <div className="flex justify-end">
              {!showResult ? (
                <Button
                  onClick={handleSubmit}
                  disabled={selectedAnswer === null}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Continue
                </Button>
              )}
            </div>
          </div>
        )}
        
        {!segment?.checkQuestion && (
          <div className="flex justify-end">
            <Button
              onClick={handleNext}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Continue
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityContentDelivery;
