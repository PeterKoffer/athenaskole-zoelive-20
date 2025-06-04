
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
  duration: number;
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
  const [score, setScore] = useState(0);
  const [waitingForAnswer, setWaitingForAnswer] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const {
    isSpeaking,
    autoReadEnabled,
    speakText,
    stopSpeaking,
    handleMuteToggle
  } = useSpeechSynthesis();

  // Generate lesson activities
  const generateLessonActivities = (): LessonActivity[] => {
    const activities: LessonActivity[] = [];

    // Introduction
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

    // Mathematics questions
    const mathQuestions = [
      {
        question: "What is 8 + 7?",
        options: ["14", "15", "16", "17"],
        correct: 1,
        explanation: "When we add 8 + 7, we can count up: 8, 9, 10, 11, 12, 13, 14, 15! The answer is 15!"
      },
      {
        question: "Which number comes after 29?",
        options: ["28", "30", "31", "27"],
        correct: 1,
        explanation: "After 29 comes 30! We're counting by ones: 28, 29, 30, 31. Great job!"
      },
      {
        question: "What is 20 - 6?",
        options: ["12", "13", "14", "15"],
        correct: 2,
        explanation: "To find 20 - 6, we count backward: 20, 19, 18, 17, 16, 15, 14! The answer is 14!"
      },
      {
        question: "How many sides does a triangle have?",
        options: ["2", "3", "4", "5"],
        correct: 1,
        explanation: "A triangle has 3 sides! Tri means three, so a triangle always has exactly 3 sides and 3 corners!"
      },
      {
        question: "What is 5 × 3?",
        options: ["12", "15", "18", "20"],
        correct: 1,
        explanation: "5 × 3 means 5 groups of 3! We can count: 3, 6, 9, 12, 15! So 5 × 3 = 15!"
      }
    ];

    mathQuestions.forEach((q, index) => {
      activities.push({
        id: `question-${index}`,
        type: 'question',
        title: `Math Question ${index + 1}`,
        duration: 120,
        content: q
      });
    });

    // Celebration
    activities.push({
      id: 'celebration',
      type: 'explanation',
      title: 'Amazing Work!',
      duration: 120,
      content: {
        text: "Wow! You did such fantastic work today! You solved math problems and learned so much. I'm so proud of you! Mathematics is everywhere around us, and you're becoming really good at it!",
        interactions: ['celebrate', 'applaud']
      }
    });

    return activities;
  };

  const [lessonActivities] = useState(generateLessonActivities());
  const currentActivity = lessonActivities[currentActivityIndex];
  const timeElapsed = Math.floor((Date.now() - lessonStartTime) / 1000);
  const totalLessonTime = 20 * 60;

  // Speak activity content when it changes
  useEffect(() => {
    if (currentActivity && autoReadEnabled && !hasAnswered) {
      // Clear any previous speech first
      stopSpeaking();
      
      setTimeout(() => {
        if (currentActivity.type === 'explanation') {
          speakText(currentActivity.content.text);
        } else if (currentActivity.type === 'question') {
          const questionText = `${currentActivity.content.question}. Your options are: ${currentActivity.content.options.map((opt: string, i: number) => `${String.fromCharCode(65 + i)}: ${opt}`).join(', ')}`;
          speakText(questionText);
          setWaitingForAnswer(true);
        } else if (currentActivity.type === 'game') {
          speakText(`Let's play a game! ${currentActivity.content.text}`);
        }
      }, 1000);
    }
  }, [currentActivityIndex, autoReadEnabled]);

  // Reset states when activity changes
  useEffect(() => {
    setHasAnswered(false);
    setSelectedAnswer(null);
    setShowResult(false);
    setWaitingForAnswer(false);
  }, [currentActivityIndex]);

  const handleActivityComplete = useCallback(() => {
    stopSpeaking();
    
    if (currentActivityIndex < lessonActivities.length - 1) {
      setCurrentActivityIndex(prev => prev + 1);
    } else {
      onLessonComplete();
    }
  }, [currentActivityIndex, lessonActivities.length, onLessonComplete, stopSpeaking]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (hasAnswered || !waitingForAnswer || currentActivity.type !== 'question') {
      return;
    }

    console.log('🎯 Answer selected:', answerIndex);
    
    setSelectedAnswer(answerIndex);
    setHasAnswered(true);
    setShowResult(true);
    setWaitingForAnswer(false);

    const isCorrect = answerIndex === currentActivity.content.correct;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    const feedback = isCorrect ? `Excellent! ${currentActivity.content.explanation}` : `Not quite right. ${currentActivity.content.explanation}`;
    
    // Stop current speech and speak feedback
    stopSpeaking();
    setTimeout(() => {
      speakText(feedback);
    }, 500);

    // Auto-advance after 4 seconds
    setTimeout(() => {
      handleActivityComplete();
    }, 4000);
  };

  if (!currentActivity) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-8 text-center text-white">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p>Loading your lesson...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
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
          
          <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
            <div 
              className="bg-lime-400 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${(currentActivityIndex + 1) / lessonActivities.length * 100}%` }} 
            />
          </div>
        </CardContent>
      </Card>

      {/* Nelie Avatar */}
      <NelieAvatarSection 
        subject={subject} 
        currentQuestionIndex={currentActivityIndex} 
        totalQuestions={lessonActivities.length} 
        isSpeaking={isSpeaking} 
        autoReadEnabled={autoReadEnabled} 
        onMuteToggle={handleMuteToggle} 
        onReadQuestion={() => {
          if (currentActivity.type === 'explanation') {
            speakText(currentActivity.content.text);
          } else if (currentActivity.type === 'question') {
            const questionText = `${currentActivity.content.question}. Your options are: ${currentActivity.content.options.map((opt: string, i: number) => `${String.fromCharCode(65 + i)}: ${opt}`).join(', ')}`;
            speakText(questionText);
          }
        }} 
      />

      {/* Activity Content */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            {currentActivity.type === 'game' && <GamepadIcon className="w-6 h-6 text-lime-400 mr-2" />}
            {currentActivity.type === 'question' && <Brain className="w-6 h-6 text-blue-400 mr-2" />}
            <h3 className="text-xl font-semibold text-white">{currentActivity.title}</h3>
          </div>

          {/* Explanation Activity */}
          {currentActivity.type === 'explanation' && (
            <div className="space-y-4">
              <p className="text-lg text-gray-300 leading-relaxed">
                {currentActivity.content.text}
              </p>
              <Button 
                onClick={handleActivityComplete} 
                className="bg-lime-500 hover:bg-lime-600 text-black font-semibold"
              >
                Continue Lesson
              </Button>
            </div>
          )}

          {/* Question Activity */}
          {currentActivity.type === 'question' && (
            <div className="space-y-6">
              <p className="text-lg text-white mb-6">
                {currentActivity.content.question}
              </p>
              
              <div className="space-y-3">
                {currentActivity.content.options.map((option: string, index: number) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={`w-full text-left justify-start p-4 h-auto transition-all duration-200 ${
                      selectedAnswer === index
                        ? showResult
                          ? selectedAnswer === currentActivity.content.correct
                            ? 'bg-green-600 border-green-500 text-white'
                            : 'bg-red-600 border-red-500 text-white'
                          : 'bg-blue-600 border-blue-500 text-white'
                        : showResult && index === currentActivity.content.correct
                        ? 'bg-green-600 border-green-500 text-white'
                        : 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                    }`}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={hasAnswered}
                  >
                    <span className="mr-3 font-semibold">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option}
                  </Button>
                ))}
              </div>

              {showResult && (
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mt-4">
                  <div className="flex items-center mb-2">
                    <span className={
                      selectedAnswer === currentActivity.content.correct 
                        ? 'text-green-400 font-semibold' 
                        : 'text-red-400 font-semibold'
                    }>
                      {selectedAnswer === currentActivity.content.correct ? 'Correct! 🎉' : 'Not quite right'}
                    </span>
                  </div>
                  <p className="text-gray-300">{currentActivity.content.explanation}</p>
                </div>
              )}
            </div>
          )}

          {/* Game Activity */}
          {currentActivity.type === 'game' && (
            <div className="space-y-6">
              <p className="text-lg text-white mb-6">
                {currentActivity.content.text}
              </p>
              <Button 
                onClick={handleActivityComplete} 
                className="bg-lime-500 hover:bg-lime-600 text-black font-semibold"
              >
                I solved it!
              </Button>
            </div>
          )}
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
    </div>
  );
};

export default ExtendedLessonManager;
