
import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Brain } from 'lucide-react';
import { useSpeechSynthesis } from '@/components/adaptive-learning/hooks/useSpeechSynthesis';
import NelieAvatarSection from './NelieAvatarSection';
import LessonProgressHeader from './LessonProgressHeader';
import LessonControlsFooter from './LessonControlsFooter';
import LessonActivityManager from './LessonActivityManager';

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

  const {
    isSpeaking,
    autoReadEnabled,
    speakText,
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
      },
      {
        question: "Which is larger: 45 or 54?",
        options: ["45", "54", "They are equal", "Cannot tell"],
        correct: 1,
        explanation: "54 is larger than 45! Look at the tens place: 54 has 5 tens and 45 has 4 tens, so 54 is bigger!"
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

    // Game activity
    activities.push({
      id: 'game',
      type: 'game',
      title: 'Number Detective Game',
      duration: 180,
      content: {
        text: "Let's play Number Detective! I'm thinking of a number between 1 and 20. It's an even number, and when you add 5 to it, you get 17. Can you find my mystery number?",
        answer: "The mystery number is 12! Because 12 + 5 = 17, and 12 is even!"
      }
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

  const handleActivityComplete = useCallback(() => {
    if (currentActivityIndex < lessonActivities.length - 1) {
      setCurrentActivityIndex(prev => prev + 1);
    } else {
      onLessonComplete();
    }
  }, [currentActivityIndex, lessonActivities.length, onLessonComplete]);

  const handleScoreUpdate = useCallback((newScore: number) => {
    setScore(newScore);
  }, []);

  const handleReadQuestion = useCallback(() => {
    if (currentActivity.type === 'explanation') {
      speakText(currentActivity.content.text);
    } else if (currentActivity.type === 'question') {
      const questionText = `${currentActivity.content.question}. Your options are: ${currentActivity.content.options.map((opt: string, i: number) => `${String.fromCharCode(65 + i)}: ${opt}`).join(', ')}`;
      speakText(questionText);
    } else if (currentActivity.type === 'game') {
      speakText(`Let's play a game! ${currentActivity.content.text}`);
    }
  }, [currentActivity, speakText]);

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
      <LessonProgressHeader
        timeElapsed={timeElapsed}
        score={score}
        currentActivityIndex={currentActivityIndex}
        totalActivities={lessonActivities.length}
      />

      {/* Nelie Avatar */}
      <NelieAvatarSection 
        subject={subject} 
        currentQuestionIndex={currentActivityIndex} 
        totalQuestions={lessonActivities.length} 
        isSpeaking={isSpeaking} 
        autoReadEnabled={autoReadEnabled} 
        onMuteToggle={handleMuteToggle} 
        onReadQuestion={handleReadQuestion} 
      />

      {/* Activity Content */}
      <LessonActivityManager
        activities={lessonActivities}
        currentActivityIndex={currentActivityIndex}
        score={score}
        onActivityComplete={handleActivityComplete}
        onScoreUpdate={handleScoreUpdate}
      />

      {/* Controls */}
      <LessonControlsFooter
        timeElapsed={timeElapsed}
        totalLessonTime={totalLessonTime}
        onBack={onBack}
      />
    </div>
  );
};

export default ExtendedLessonManager;
