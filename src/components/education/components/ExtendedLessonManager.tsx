import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Clock, Star, GamepadIcon } from 'lucide-react';
import { useSpeechSynthesis } from '@/components/adaptive-learning/hooks/useSpeechSynthesis';
import NelieAvatarSection from './NelieAvatarSection';
interface ExtendedLessonManagerProps {
  subject: string;
  skillArea: string;
  onLessonComplete: () => void;
  onBack: () => void;
}
interface LessonActivity {
  id: string;
  type: 'question' | 'game' | 'explanation' | 'practice';
  title: string;
  duration: number; // in seconds
  content: any;
}
const ExtendedLessonManager = ({
  subject,
  skillArea,
  onLessonComplete,
  onBack
}: ExtendedLessonManagerProps) => {
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [lessonStartTime] = useState(Date.now());
  const [activityStartTime, setActivityStartTime] = useState(Date.now());
  const [score, setScore] = useState(0);
  const [totalActivities] = useState(12); // 20 minutes with varied activities

  const {
    isSpeaking,
    autoReadEnabled,
    speakText,
    stopSpeaking,
    handleMuteToggle
  } = useSpeechSynthesis();

  // Generate 20 minutes worth of activities
  const generateLessonActivities = (): LessonActivity[] => {
    const activities: LessonActivity[] = [];

    // Introduction (2 minutes)
    activities.push({
      id: 'intro',
      type: 'explanation',
      title: 'Welcome to Mathematics with Nelie!',
      duration: 120,
      content: {
        text: "Hello! I'm so excited to learn mathematics with you today! We'll explore numbers, solve problems, and play some fun games together. Are you ready to become a math champion?",
        interactions: ['wave', 'smile']
      }
    });

    // Mathematics questions with explanations (12 minutes)
    const mathQuestions = [{
      question: "What is 8 + 7?",
      options: ["14", "15", "16", "17"],
      correct: 1,
      explanation: "When we add 8 + 7, we can count up: 8, 9, 10, 11, 12, 13, 14, 15! The answer is 15!"
    }, {
      question: "Which number comes after 29?",
      options: ["28", "30", "31", "27"],
      correct: 1,
      explanation: "After 29 comes 30! We're counting by ones: 28, 29, 30, 31. Great job!"
    }, {
      question: "What is 20 - 6?",
      options: ["12", "13", "14", "15"],
      correct: 2,
      explanation: "To find 20 - 6, we count backward: 20, 19, 18, 17, 16, 15, 14! The answer is 14!"
    }, {
      question: "How many sides does a triangle have?",
      options: ["2", "3", "4", "5"],
      correct: 1,
      explanation: "A triangle has 3 sides! Tri means three, so a triangle always has exactly 3 sides and 3 corners!"
    }, {
      question: "What is 5 × 3?",
      options: ["12", "15", "18", "20"],
      correct: 1,
      explanation: "5 × 3 means 5 groups of 3! We can count: 3, 6, 9, 12, 15! So 5 × 3 = 15!"
    }, {
      question: "Which is larger: 45 or 54?",
      options: ["45", "54", "They're equal", "Can't tell"],
      correct: 1,
      explanation: "54 is larger than 45! Look at the tens place: 5 tens (50) is bigger than 4 tens (40)!"
    }];
    mathQuestions.forEach((q, index) => {
      activities.push({
        id: `question-${index}`,
        type: 'question',
        title: `Math Question ${index + 1}`,
        duration: 120,
        content: q
      });
    });

    // Math games (4 minutes)
    activities.push({
      id: 'number-game',
      type: 'game',
      title: 'Number Detective Game',
      duration: 120,
      content: {
        text: "Let's play Number Detective! I'm thinking of a number between 1 and 20. It's even, and when you add 5 to it, you get 17. What number am I thinking of?",
        answer: 12,
        explanation: "The number is 12! It's even, and 12 + 5 = 17. You're such a great detective!"
      }
    });
    activities.push({
      id: 'pattern-game',
      type: 'game',
      title: 'Pattern Master',
      duration: 120,
      content: {
        text: "Complete this pattern: 2, 4, 6, 8, ?, 12. What comes next?",
        options: ["9", "10", "11", "10"],
        correct: 1,
        explanation: "The pattern is counting by 2s! 2, 4, 6, 8, 10, 12. You found the pattern!"
      }
    });

    // Review and celebration (2 minutes)
    activities.push({
      id: 'celebration',
      type: 'explanation',
      title: 'Amazing Work!',
      duration: 120,
      content: {
        text: "Wow! You did such fantastic work today! You solved math problems, played games, and learned so much. I'm so proud of you! Mathematics is everywhere around us, and you're becoming really good at it!",
        interactions: ['celebrate', 'applaud']
      }
    });
    return activities;
  };
  const [lessonActivities] = useState(generateLessonActivities());
  const currentActivity = lessonActivities[currentActivityIndex];
  const timeElapsed = Math.floor((Date.now() - lessonStartTime) / 1000);
  const totalLessonTime = 20 * 60; // 20 minutes

  // Auto-speak activity content
  useEffect(() => {
    if (currentActivity && autoReadEnabled) {
      setTimeout(() => {
        if (currentActivity.type === 'explanation') {
          speakText(currentActivity.content.text);
        } else if (currentActivity.type === 'question') {
          const questionText = `${currentActivity.title}: ${currentActivity.content.question}. Your options are: ${currentActivity.content.options.map((opt: string, i: number) => `${String.fromCharCode(65 + i)}: ${opt}`).join(', ')}`;
          speakText(questionText);
        } else if (currentActivity.type === 'game') {
          speakText(`Let's play a game! ${currentActivity.content.text}`);
        }
      }, 1000);
    }
  }, [currentActivityIndex, autoReadEnabled, speakText, currentActivity]);
  const handleActivityComplete = useCallback(() => {
    if (currentActivityIndex < lessonActivities.length - 1) {
      setCurrentActivityIndex(prev => prev + 1);
      setActivityStartTime(Date.now());
    } else {
      // Lesson complete
      stopSpeaking();
      onLessonComplete();
    }
  }, [currentActivityIndex, lessonActivities.length, onLessonComplete, stopSpeaking]);
  const handleAnswerSelect = (answerIndex: number) => {
    if (currentActivity.type === 'question') {
      const isCorrect = answerIndex === currentActivity.content.correct;
      if (isCorrect) {
        setScore(prev => prev + 1);
      }
      const feedback = isCorrect ? `Excellent! ${currentActivity.content.explanation}` : `Not quite right. ${currentActivity.content.explanation}`;
      speakText(feedback);

      // Auto-advance after explanation
      setTimeout(handleActivityComplete, 4000);
    }
  };
  if (!currentActivity) {
    return <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-8 text-center text-white">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p>Loading your lesson...</p>
        </CardContent>
      </Card>;
  }
  return <div className="space-y-6">
      {/* Progress Header */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-4">
              <Clock className="w-5 h-5 text-lime-400" />
              <span className="text-sm">
                {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')} / 20:00
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-sm">Score: {score}</span>
            </div>
            <div className="text-sm">
              Activity {currentActivityIndex + 1} of {lessonActivities.length}
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
            <div className="bg-lime-400 h-2 rounded-full transition-all duration-500" style={{
            width: `${timeElapsed / totalLessonTime * 100}%`
          }} />
          </div>
        </CardContent>
      </Card>

      {/* Nelie Avatar */}
      <NelieAvatarSection subject={subject} currentQuestionIndex={currentActivityIndex} totalQuestions={lessonActivities.length} isSpeaking={isSpeaking} autoReadEnabled={autoReadEnabled} onMuteToggle={handleMuteToggle} onReadQuestion={() => {
      if (currentActivity.type === 'explanation') {
        speakText(currentActivity.content.text);
      } else if (currentActivity.type === 'question') {
        const questionText = `${currentActivity.content.question}. Your options are: ${currentActivity.content.options.map((opt: string, i: number) => `${String.fromCharCode(65 + i)}: ${opt}`).join(', ')}`;
        speakText(questionText);
      }
    }} />

      {/* Activity Content */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            {currentActivity.type === 'game' && <GamepadIcon className="w-6 h-6 text-lime-400 mr-2" />}
            {currentActivity.type === 'question' && <Brain className="w-6 h-6 text-blue-400 mr-2" />}
            <h3 className="text-xl font-semibold text-white">{currentActivity.title}</h3>
          </div>

          {/* Explanation Activity */}
          {currentActivity.type === 'explanation' && <div className="space-y-4">
              <p className="text-lg text-gray-300 leading-relaxed">
                {currentActivity.content.text}
              </p>
              <Button onClick={handleActivityComplete} className="bg-lime-500 hover:bg-lime-600 text-black font-semibold">
                Continue Lesson
              </Button>
            </div>}

          {/* Question Activity */}
          {currentActivity.type === 'question' && <div className="space-y-6">
              <p className="text-lg text-white mb-6">
                {currentActivity.content.question}
              </p>
              <div className="space-y-3">
                {currentActivity.content.options.map((option: string, index: number) => <Button key={index} variant="outline" className="w-full text-left justify-start p-4 h-auto bg-gray-700 border-gray-600 text-white hover:bg-gray-600" onClick={() => handleAnswerSelect(index)}>
                    <span className="mr-3 font-semibold">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option}
                  </Button>)}
              </div>
            </div>}

          {/* Game Activity */}
          {currentActivity.type === 'game' && <div className="space-y-6">
              <p className="text-lg text-white mb-6">
                {currentActivity.content.text}
              </p>
              {currentActivity.content.options ? <div className="space-y-3">
                  {currentActivity.content.options.map((option: string, index: number) => <Button key={index} variant="outline" className="w-full text-left justify-start p-4 h-auto bg-gray-700 border-gray-600 text-white hover:bg-gray-600" onClick={() => handleAnswerSelect(index)}>
                      <span className="mr-3 font-semibold">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      {option}
                    </Button>)}
                </div> : <Button onClick={handleActivityComplete} className="bg-lime-500 hover:bg-lime-600 text-black font-semibold">
                  I solved it!
                </Button>}
            </div>}
        </CardContent>
      </Card>

      {/* Controls */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4 flex justify-between items-center">
          <Button variant="outline" onClick={onBack} className="border-gray-600 text-slate-950">
            Exit Lesson
          </Button>
          
          <div className="text-white text-sm">
            Estimated time remaining: {Math.max(0, Math.floor((totalLessonTime - timeElapsed) / 60))} minutes
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default ExtendedLessonManager;