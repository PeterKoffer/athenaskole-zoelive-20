
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import ClassroomEnvironment from '../shared/ClassroomEnvironment';
import { getClassroomConfig } from '../shared/classroomConfigs';
import { LessonActivity } from '../types/LessonTypes';

interface UniversalLearningMainContentProps {
  subject: string;
  skillArea: string;
  studentName: string;
  timeElapsed: number;
  targetLessonLength: number;
  score: number;
  currentActivityIndex: number;
  totalRealActivities: number;
  correctStreak: number;
  currentActivity: LessonActivity | null;
  isSpeaking: boolean;
  onBackToProgram: () => void;
  onToggleMute: () => void;
  onReadRequest: () => void;
  onStopSpeaking: () => void;
  onActivityComplete: (result: any) => void;
}

const UniversalLearningMainContent = ({
  subject,
  skillArea,
  studentName,
  timeElapsed,
  targetLessonLength,
  score,
  currentActivityIndex,
  totalRealActivities,
  correctStreak,
  currentActivity,
  isSpeaking,
  onBackToProgram,
  onToggleMute,
  onReadRequest,
  onStopSpeaking,
  onActivityComplete
}: UniversalLearningMainContentProps) => {
  const [showWelcomeTemplate, setShowWelcomeTemplate] = useState(true);
  const classroomConfig = getClassroomConfig(subject);

  const getSubjectWelcomeContent = (subjectName: string) => {
    switch (subjectName.toLowerCase()) {
      case 'mathematics':
        return {
          emoji: '🔢',
          title: 'Mathematics Magic with Nelie!',
          description: 'Ready to explore the amazing world of numbers?',
          welcomeMessage: `Welcome to the most exciting math adventure ever, ${studentName}! Today we're exploring ${skillArea} through amazing games, fun challenges, and cool discoveries that will make you feel like a math wizard!`,
          tipMessage: 'Math is everywhere around us - let\'s discover the patterns and solve amazing puzzles together!'
        };
      case 'english':
        return {
          emoji: '📚',
          title: 'English Adventures with Nelie!',
          description: 'Ready to explore the world of words and stories?',
          welcomeMessage: `Hello ${studentName}! Welcome to an amazing English adventure where we'll discover the magic of words, stories, and language together!`,
          tipMessage: 'Every word you learn opens new doors to amazing stories and ideas!'
        };
      case 'science':
        return {
          emoji: '🔬',
          title: 'Science Discoveries with Nelie!',
          description: 'Ready to explore the wonders of our world?',
          welcomeMessage: `Hi ${studentName}! Get ready for an incredible science adventure where we'll discover amazing facts about our world and how everything works!`,
          tipMessage: 'Science is all around us - let\'s explore and discover the secrets of nature together!'
        };
      case 'music':
        return {
          emoji: '🎵',
          title: 'Musical Magic with Nelie!',
          description: 'Ready to explore the beautiful world of music?',
          welcomeMessage: `Welcome ${studentName}! Let's dive into the wonderful world of music where we'll explore rhythm, melody, and harmony together!`,
          tipMessage: 'Music speaks to our hearts - let\'s create beautiful sounds and discover musical magic!'
        };
      case 'computer-science':
        return {
          emoji: '💻',
          title: 'Coding Adventures with Nelie!',
          description: 'Ready to explore the digital world?',
          welcomeMessage: `Hello ${studentName}! Welcome to the exciting world of coding where we'll learn to think like programmers and create amazing things!`,
          tipMessage: 'Coding is like solving puzzles - let\'s build something incredible together!'
        };
      case 'creative-arts':
        return {
          emoji: '🎨',
          title: 'Creative Magic with Nelie!',
          description: 'Ready to unleash your artistic creativity?',
          welcomeMessage: `Hi ${studentName}! Welcome to the colorful world of creative arts where your imagination will come to life!`,
          tipMessage: 'Art is about expressing yourself - let your creativity flow and create something beautiful!'
        };
      default:
        return {
          emoji: '⭐',
          title: 'Learning Adventure with Nelie!',
          description: 'Ready for an amazing educational journey?',
          welcomeMessage: `Welcome ${studentName}! Let's embark on an incredible learning adventure together!`,
          tipMessage: 'Every lesson is a new adventure - let\'s learn and have fun!'
        };
    }
  };

  const subjectContent = getSubjectWelcomeContent(subject);

  const handleStartLearning = () => {
    setShowWelcomeTemplate(false);
  };

  if (showWelcomeTemplate) {
    return (
      <ClassroomEnvironment config={classroomConfig}>
        <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
          <Card className="bg-black/50 border-purple-400/50 backdrop-blur-sm">
            <CardContent className="p-8">
              {/* Subject Welcome Header */}
              <div className="text-center mb-8">
                <div className="text-6xl mb-4 animate-bounce">{subjectContent.emoji}</div>
                <h1 className="text-4xl font-bold text-white mb-4">{subjectContent.title}</h1>
                <div className="text-2xl text-purple-200 mb-6">
                  {subjectContent.description}
                </div>
              </div>

              {/* Welcome Message */}
              <div className="bg-blue-900/40 rounded-lg p-8 border border-blue-400/30 mb-6">
                <div className="text-blue-100 text-xl leading-relaxed text-center mb-4">
                  {subjectContent.welcomeMessage}
                </div>
                <div className="text-yellow-200 text-lg text-center">
                  💡 {subjectContent.tipMessage}
                </div>
              </div>

              {/* Progress Info */}
              <div className="bg-purple-900/30 border border-purple-400/30 rounded-lg p-6 mb-6">
                <div className="text-center text-white">
                  <h3 className="text-lg font-semibold mb-2">Your Learning Session</h3>
                  <p className="text-purple-200">
                    🎯 Target: {Math.round(targetLessonLength / 60)} minutes of engaging learning
                  </p>
                  <p className="text-purple-200">
                    📚 Activities: {totalRealActivities} interactive challenges prepared just for you!
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  onClick={handleStartLearning}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold px-8 py-3 text-lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Learning Adventure!
                </Button>
                
                <Button
                  onClick={onBackToProgram}
                  variant="outline"
                  className="border-gray-400 text-white hover:bg-gray-700"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Program
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ClassroomEnvironment>
    );
  }

  // Show actual lesson content when welcome template is dismissed
  return (
    <ClassroomEnvironment config={classroomConfig}>
      <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Lesson Header */}
        <div className="flex items-center justify-between bg-black/50 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center space-x-4">
            <Button
              onClick={onBackToProgram}
              variant="outline"
              size="sm"
              className="border-gray-400 text-white hover:bg-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="text-white">
              <h2 className="text-lg font-semibold">{subject.charAt(0).toUpperCase() + subject.slice(1)} Learning</h2>
              <p className="text-sm text-gray-300">Activity {currentActivityIndex + 1} of {totalRealActivities}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={isSpeaking ? onStopSpeaking : onReadRequest}
              variant="outline"
              size="sm"
              className="border-purple-400 text-purple-200 hover:bg-purple-700"
            >
              {isSpeaking ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            <Button
              onClick={onToggleMute}
              variant="outline"
              size="sm"
              className="border-gray-400 text-gray-300 hover:bg-gray-700"
            >
              <VolumeX className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Current Activity Content */}
        {currentActivity && (
          <Card className="bg-black/50 border-purple-400/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">{currentActivity.title}</h3>
                <div className="text-lg text-purple-200 mb-6">
                  {currentActivity.content?.text || `Welcome to ${subject} learning with Nelie!`}
                </div>
                
                {/* Sample Interactive Content */}
                <div className="space-y-4">
                  <Button
                    onClick={() => onActivityComplete({ success: true, score: 100 })}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold px-6 py-3"
                  >
                    Complete Activity
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress Bar */}
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center justify-between text-white text-sm mb-2">
            <span>Progress</span>
            <span>{Math.round((timeElapsed / targetLessonLength) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-400 to-blue-400 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((timeElapsed / targetLessonLength) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </ClassroomEnvironment>
  );
};

export default UniversalLearningMainContent;
