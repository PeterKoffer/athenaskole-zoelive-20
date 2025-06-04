
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Star, Trophy, Brain, Heart } from 'lucide-react';
import { LessonActivity } from './EnhancedLessonContent';

interface EnhancedActivityRendererProps {
  activity: LessonActivity;
  onActivityComplete: (wasCorrect?: boolean) => void;
  isNelieReady: boolean;
}

const EnhancedActivityRenderer = ({
  activity,
  onActivityComplete,
  isNelieReady
}: EnhancedActivityRendererProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(activity.duration);

  // Timer for activity duration
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Auto-advance for explanations and welcome messages
          if (activity.type === 'explanation' || activity.type === 'welcome') {
            setTimeout(() => onActivityComplete(), 500);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activity, onActivityComplete]);

  // Reset state when activity changes
  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeRemaining(activity.duration);
  }, [activity]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setShowResult(true);
    const isCorrect = selectedAnswer === activity.content.correct;
    
    // Wait a moment for result to show, then complete
    setTimeout(() => {
      onActivityComplete(isCorrect);
    }, 3000);
  };

  const handleContinue = () => {
    onActivityComplete();
  };

  const renderWelcomeActivity = () => (
    <Card className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-purple-400">
      <CardContent className="p-8 text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4 animate-bounce">👋</div>
          <Star className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-pulse" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">{activity.title}</h2>
        <p className="text-xl text-purple-200 mb-6">{activity.content.message}</p>
        
        {isNelieReady && (
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-300">Nelie is speaking to you...</span>
          </div>
        )}
        
        <div className="text-purple-300">
          Lesson starting in {timeRemaining} seconds...
        </div>
      </CardContent>
    </Card>
  );

  const renderExplanationActivity = () => (
    <Card className="bg-gradient-to-br from-blue-900 to-cyan-900 border-blue-400">
      <CardContent className="p-8">
        <div className="flex items-center mb-6">
          <Brain className="w-8 h-8 text-blue-400 mr-3" />
          <h3 className="text-2xl font-bold text-white">{activity.title}</h3>
        </div>
        
        <div className="text-lg text-blue-100 mb-6 leading-relaxed">
          {activity.content.text}
        </div>
        
        {activity.content.examples && (
          <div className="bg-blue-800/30 rounded-lg p-4 mb-6">
            <h4 className="text-blue-200 font-semibold mb-3">Examples:</h4>
            <ul className="list-disc list-inside text-blue-100 space-y-1">
              {activity.content.examples.map((example: string, index: number) => (
                <li key={index}>{example}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div className="text-blue-300">
            Time remaining: {timeRemaining}s
          </div>
          <Button onClick={handleContinue} className="bg-blue-600 hover:bg-blue-700">
            Continue Learning
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderQuestionActivity = () => (
    <Card className="bg-gradient-to-br from-green-900 to-emerald-900 border-green-400">
      <CardContent className="p-8">
        <div className="flex items-center mb-6">
          <Trophy className="w-8 h-8 text-green-400 mr-3" />
          <h3 className="text-2xl font-bold text-white">{activity.title}</h3>
        </div>
        
        {activity.content.story && (
          <div className="bg-green-800/30 rounded-lg p-4 mb-6">
            <h4 className="text-green-200 font-semibold mb-2">Story:</h4>
            <p className="text-green-100 leading-relaxed">{activity.content.story}</p>
          </div>
        )}
        
        <div className="text-xl text-white mb-6 font-medium">
          {activity.content.question}
        </div>
        
        <div className="space-y-3 mb-6">
          {activity.content.options.map((option: string, index: number) => (
            <Button
              key={index}
              variant={selectedAnswer === index ? "default" : "outline"}
              className={`w-full text-left justify-start p-4 h-auto transition-all duration-200 ${
                showResult
                  ? index === activity.content.correct
                    ? "bg-green-600 border-green-400 text-white"
                    : selectedAnswer === index
                    ? "bg-red-600 border-red-400 text-white"
                    : "bg-gray-700 border-gray-600 text-gray-300"
                  : selectedAnswer === index
                  ? "bg-green-500 text-white transform scale-105"
                  : "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              }`}
              onClick={() => handleAnswerSelect(index)}
              disabled={showResult}
            >
              <span className="mr-3 font-bold text-lg">
                {String.fromCharCode(65 + index)}.
              </span>
              {option}
              {showResult && index === activity.content.correct && (
                <CheckCircle className="w-5 h-5 ml-auto text-green-200" />
              )}
              {showResult && selectedAnswer === index && index !== activity.content.correct && (
                <XCircle className="w-5 h-5 ml-auto text-red-200" />
              )}
            </Button>
          ))}
        </div>

        {showResult && (
          <div className={`p-4 rounded-lg mb-4 ${
            selectedAnswer === activity.content.correct 
              ? 'bg-green-800/50 border border-green-600' 
              : 'bg-red-800/50 border border-red-600'
          }`}>
            <div className="flex items-center mb-2">
              {selectedAnswer === activity.content.correct ? (
                <CheckCircle className="w-6 h-6 text-green-400 mr-2" />
              ) : (
                <XCircle className="w-6 h-6 text-red-400 mr-2" />
              )}
              <span className={`font-bold text-lg ${
                selectedAnswer === activity.content.correct ? 'text-green-300' : 'text-red-300'
              }`}>
                {selectedAnswer === activity.content.correct ? 'Excellent!' : 'Not quite right!'}
              </span>
            </div>
            <p className="text-gray-200 leading-relaxed">{activity.content.explanation}</p>
            {activity.content.encouragement && (
              <p className="text-blue-300 mt-2 italic">{activity.content.encouragement}</p>
            )}
          </div>
        )}

        {!showResult ? (
          <div className="flex justify-between items-center">
            <div className="text-green-300">Time: {timeRemaining}s</div>
            <Button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              Submit Answer
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-green-300 mb-2">Moving to next activity...</div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderGameActivity = () => (
    <Card className="bg-gradient-to-br from-purple-900 to-pink-900 border-purple-400">
      <CardContent className="p-8">
        <div className="flex items-center mb-6">
          <Star className="w-8 h-8 text-purple-400 mr-3" />
          <h3 className="text-2xl font-bold text-white">{activity.title}</h3>
        </div>
        
        <div className="text-lg text-purple-100 mb-6 leading-relaxed">
          {activity.content.gameType === 'pattern' && (
            <div>
              <p className="mb-4">Look at this number pattern:</p>
              <div className="flex justify-center space-x-4 mb-6">
                {activity.content.sequence.map((num: any, index: number) => (
                  <div key={index} className={`w-16 h-16 rounded-lg flex items-center justify-center text-2xl font-bold ${
                    num === "?" ? "bg-yellow-500 text-black animate-pulse" : "bg-purple-600 text-white"
                  }`}>
                    {num}
                  </div>
                ))}
              </div>
              <p>What number comes next?</p>
            </div>
          )}
          
          {activity.content.gameType === 'counting' && (
            <div>
              <p className="mb-4">{activity.content.challenge}</p>
              <div className="flex justify-center space-x-4 mb-6">
                {activity.content.sequence.map((num: any, index: number) => (
                  <div key={index} className={`w-16 h-16 rounded-lg flex items-center justify-center text-2xl font-bold ${
                    num === "?" ? "bg-yellow-500 text-black animate-pulse" : "bg-purple-600 text-white"
                  }`}>
                    {num}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-3 mb-6">
          {activity.content.options.map((option: any, index: number) => (
            <Button
              key={index}
              variant={selectedAnswer === index ? "default" : "outline"}
              className={`w-full text-left justify-start p-4 h-auto ${
                showResult
                  ? index === activity.content.correct
                    ? "bg-green-600 border-green-400 text-white"
                    : selectedAnswer === index
                    ? "bg-red-600 border-red-400 text-white"
                    : "bg-gray-700 border-gray-600 text-gray-300"
                  : selectedAnswer === index
                  ? "bg-purple-500 text-white"
                  : "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              }`}
              onClick={() => handleAnswerSelect(index)}
              disabled={showResult}
            >
              <span className="text-2xl font-bold mr-4">{option}</span>
              {showResult && index === activity.content.correct && (
                <CheckCircle className="w-5 h-5 ml-auto text-green-200" />
              )}
            </Button>
          ))}
        </div>

        {showResult && (
          <div className="bg-purple-800/50 border border-purple-600 p-4 rounded-lg mb-4">
            <p className="text-purple-100 leading-relaxed">{activity.content.explanation}</p>
            {activity.content.extension && (
              <p className="text-purple-200 mt-2 text-sm">{activity.content.extension}</p>
            )}
          </div>
        )}

        {!showResult ? (
          <Button
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            Submit Answer
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );

  const renderCelebrationActivity = () => (
    <Card className="bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900 border-yellow-400">
      <CardContent className="p-8 text-center">
        <div className="mb-6">
          <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4 animate-bounce" />
          <div className="flex justify-center space-x-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-8 h-8 text-yellow-400 animate-pulse" style={{animationDelay: `${i * 0.2}s`}} />
            ))}
          </div>
        </div>
        
        <h2 className="text-4xl font-bold text-white mb-4">{activity.title}</h2>
        
        {activity.content.achievements && (
          <div className="bg-yellow-800/30 rounded-lg p-6 mb-6">
            <h3 className="text-yellow-200 font-bold text-xl mb-4">Your Amazing Achievements:</h3>
            <ul className="space-y-2">
              {activity.content.achievements.map((achievement: string, index: number) => (
                <li key={index} className="flex items-center text-yellow-100">
                  <Heart className="w-5 h-5 text-red-400 mr-3" />
                  {achievement}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <p className="text-xl text-yellow-200 mb-6">{activity.content.encouragement}</p>
        
        <Button onClick={handleContinue} className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold">
          Complete Lesson 🎉
        </Button>
      </CardContent>
    </Card>
  );

  switch (activity.type) {
    case 'welcome':
      return renderWelcomeActivity();
    case 'explanation':
      return renderExplanationActivity();
    case 'question':
      return renderQuestionActivity();
    case 'game':
      return renderGameActivity();
    case 'celebration':
      return renderCelebrationActivity();
    default:
      return renderExplanationActivity();
  }
};

export default EnhancedActivityRenderer;
