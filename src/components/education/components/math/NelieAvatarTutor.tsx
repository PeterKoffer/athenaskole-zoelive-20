
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, MessageCircle, Lightbulb, RotateCcw } from 'lucide-react';
import { useUnifiedSpeech } from '@/hooks/useUnifiedSpeech';
import NELIEAvatar from '@/components/ai-tutor/NELIEAvatar';

interface NelieAvatarTutorProps {
  currentQuestion: number;
  totalQuestions: number;
  score: number;
  streak: number;
  onHelpRequest?: () => void;
}

const NelieAvatarTutor = ({
  currentQuestion,
  totalQuestions,
  score,
  streak,
  onHelpRequest
}: NelieAvatarTutorProps) => {
  const { speakAsNelie, isSpeaking, isEnabled, toggleEnabled, stop } = useUnifiedSpeech();
  const [showTips, setShowTips] = useState(false);
  const [lastSpokenQuestion, setLastSpokenQuestion] = useState(0);

  // Speak encouraging messages based on progress
  useEffect(() => {
    if (isEnabled && currentQuestion !== lastSpokenQuestion) {
      const messages = [
        "Great job! Let's tackle the next math challenge together!",
        "You're doing amazing! Keep up the fantastic work!",
        "Excellent progress! I'm here to help you succeed!",
        "Wonderful! You're becoming a math superstar!",
        "Outstanding effort! Let's continue our math adventure!",
        "Fantastic! You're mastering these concepts beautifully!"
      ];
      
      const message = messages[(currentQuestion - 1) % messages.length];
      
      if (currentQuestion > 1) {
        setTimeout(() => {
          speakAsNelie(message, false, 'math-encouragement');
        }, 1000);
      }
      
      setLastSpokenQuestion(currentQuestion);
    }
  }, [currentQuestion, isEnabled, speakAsNelie, lastSpokenQuestion]);

  // Speak celebration for streaks
  useEffect(() => {
    if (isEnabled && streak >= 3 && streak % 2 === 1) {
      const streakMessages = [
        `Amazing! You have a ${streak} question streak! You're on fire!`,
        `Incredible! ${streak} correct answers in a row! Keep it up!`,
        `Fantastic streak of ${streak}! You're a math champion!`
      ];
      
      const message = streakMessages[Math.floor(Math.random() * streakMessages.length)];
      setTimeout(() => {
        speakAsNelie(message, true, 'streak-celebration');
      }, 2000);
    }
  }, [streak, isEnabled, speakAsNelie]);

  const handleGiveHint = () => {
    const hints = [
      "Take your time and read the question carefully. What operation do you think we need?",
      "Look for key words in the problem. Words like 'total', 'altogether', or 'in all' often mean addition!",
      "Try drawing a picture or using your fingers to help visualize the problem.",
      "Break the problem into smaller steps. What information do we have, and what do we need to find?",
      "Remember, there's no rush! Think through each answer choice carefully."
    ];
    
    const hint = hints[Math.floor(Math.random() * hints.length)];
    speakAsNelie(hint, true, 'math-hint');
    if (onHelpRequest) onHelpRequest();
  };

  const handleEncouragement = () => {
    const encouragements = [
      "You're doing great! Every mistake is a chance to learn something new!",
      "I believe in you! You have all the skills needed to solve this problem!",
      "Remember, I'm here to help you every step of the way!",
      "You're becoming stronger at math with every question you try!",
      "Keep going! You're making excellent progress!"
    ];
    
    const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
    speakAsNelie(encouragement, true, 'math-encouragement');
  };

  const handleReadQuestion = () => {
    speakAsNelie("Let me read the current question for you again. Listen carefully!", true, 'question-repeat');
  };

  return (
    <Card className="bg-gradient-to-br from-purple-900/80 to-blue-900/80 border-purple-400/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            {/* Nelie Avatar */}
            <div className="relative">
              <NELIEAvatar 
                size="lg" 
                isActive={true} 
                isSpeaking={isSpeaking}
                className="drop-shadow-lg"
              />
              {isSpeaking && (
                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                  Speaking
                </div>
              )}
            </div>

            {/* Nelie Info */}
            <div>
              <h3 className="text-white font-bold text-lg">
                Hi! I'm Nelie! 🤖
              </h3>
              <p className="text-blue-200 text-sm">
                Your AI Math Tutor & Learning Companion
              </p>
              <div className="text-xs text-purple-200 mt-1">
                Question {currentQuestion} of {totalQuestions} • Score: {score}
                {streak > 0 && <span className="text-yellow-300"> • 🔥 {streak} streak!</span>}
              </div>
            </div>
          </div>

          {/* Voice Control */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleEnabled}
            className={`${isEnabled ? 'text-green-400 hover:text-green-300' : 'text-gray-400 hover:text-gray-300'}`}
          >
            {isEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>
        </div>

        {/* Nelie's Help Options */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGiveHint}
            className="bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 hover:text-white text-xs"
          >
            <Lightbulb className="w-3 h-3 mr-1" />
            Hint
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEncouragement}
            className="bg-green-600/30 hover:bg-green-600/50 text-green-200 hover:text-white text-xs"
          >
            <MessageCircle className="w-3 h-3 mr-1" />
            Encourage
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReadQuestion}
            className="bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 hover:text-white text-xs"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Repeat
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (isSpeaking) {
                stop();
              } else {
                setShowTips(!showTips);
              }
            }}
            className="bg-yellow-600/30 hover:bg-yellow-600/50 text-yellow-200 hover:text-white text-xs"
          >
            {isSpeaking ? 'Stop' : 'Tips'}
          </Button>
        </div>

        {/* Tips Panel */}
        {showTips && (
          <div className="mt-4 p-4 bg-black/30 rounded-lg border border-yellow-400/30">
            <h4 className="text-yellow-300 font-semibold text-sm mb-2">💡 Math Tips from Nelie:</h4>
            <ul className="text-yellow-100 text-xs space-y-1">
              <li>• Read each question twice before answering</li>
              <li>• Look for key words like "total", "left", "each"</li>
              <li>• Draw pictures to help visualize problems</li>
              <li>• Check your answer by working backwards</li>
              <li>• Don't worry about mistakes - they help us learn!</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NelieAvatarTutor;
