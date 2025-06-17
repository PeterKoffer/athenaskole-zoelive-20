
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Volume2, VolumeX, Play, Pause, Home } from 'lucide-react';
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
          title: 'Mathematics with Nelie!',
          subtitle: 'Ready for an amazing adventure?',
          welcomeMessage: `Hello ${studentName}! I'm Nelie, your math learning companion! Today we're going to explore the amazing world of numbers, patterns, and problem-solving together.`,
          tips: [
            'Take your time with each problem - there\'s no rush!',
            'Ask Nelie to repeat if you need to hear something again',
            'Math is like solving puzzles - have fun with it!',
            'Every mistake is a chance to learn something new!'
          ],
          readyMessage: 'Ready to start your math adventure!',
          lessonInfo: 'Starting lesson automatically in 5 seconds...'
        };
      case 'english':
        return {
          title: 'English with Nelie!',
          subtitle: 'Ready for an amazing adventure?',
          welcomeMessage: `Hello ${studentName}! I'm Nelie, your English learning companion! Today we're going to explore the wonderful world of words, stories, and language together.`,
          tips: [
            'Read carefully and take your time with each question',
            'Ask Nelie to repeat if you need to hear something again',
            'Every new word you learn opens new possibilities!',
            'Practice makes your reading and writing stronger!'
          ],
          readyMessage: 'Ready to start your English adventure!',
          lessonInfo: 'Starting lesson automatically in 5 seconds...'
        };
      case 'science':
        return {
          title: 'Science with Nelie!',
          subtitle: 'Ready for an amazing adventure?',
          welcomeMessage: `Hello ${studentName}! I'm Nelie, your science learning companion! Today we're going to explore the incredible world of discovery and investigation together.`,
          tips: [
            'Think like a scientist - ask questions and explore!',
            'Ask Nelie to repeat if you need to hear something again',
            'Science is all around us - look for patterns everywhere!',
            'Every experiment teaches us something new!'
          ],
          readyMessage: 'Ready to start your science adventure!',
          lessonInfo: 'Starting lesson automatically in 5 seconds...'
        };
      case 'music':
        return {
          title: 'Music with Nelie!',
          subtitle: 'Ready for an amazing adventure?',
          welcomeMessage: `Hello ${studentName}! I'm Nelie, your music learning companion! Today we're going to explore the beautiful world of rhythm, melody, and harmony together.`,
          tips: [
            'Listen carefully to the rhythms and melodies around you',
            'Ask Nelie to repeat if you need to hear something again',
            'Music is a universal language - express yourself!',
            'Every note you learn adds to your musical journey!'
          ],
          readyMessage: 'Ready to start your music adventure!',
          lessonInfo: 'Starting lesson automatically in 5 seconds...'
        };
      case 'computer-science':
        return {
          title: 'Computer Science with Nelie!',
          subtitle: 'Ready for an amazing adventure?',
          welcomeMessage: `Hello ${studentName}! I'm Nelie, your coding learning companion! Today we're going to explore the exciting world of programming and technology together.`,
          tips: [
            'Think step-by-step like a computer programmer',
            'Ask Nelie to repeat if you need to hear something again',
            'Coding is like building with digital blocks!',
            'Every line of code you learn is a new superpower!'
          ],
          readyMessage: 'Ready to start your coding adventure!',
          lessonInfo: 'Starting lesson automatically in 5 seconds...'
        };
      case 'creative-arts':
        return {
          title: 'Creative Arts with Nelie!',
          subtitle: 'Ready for an amazing adventure?',
          welcomeMessage: `Hello ${studentName}! I'm Nelie, your art learning companion! Today we're going to explore the colorful world of creativity and artistic expression together.`,
          tips: [
            'Let your imagination flow freely and creatively',
            'Ask Nelie to repeat if you need to hear something again',
            'Art is about expressing your unique vision!',
            'Every creation you make is beautifully unique!'
          ],
          readyMessage: 'Ready to start your art adventure!',
          lessonInfo: 'Starting lesson automatically in 5 seconds...'
        };
      default:
        return {
          title: `${subject.charAt(0).toUpperCase() + subject.slice(1)} with Nelie!`,
          subtitle: 'Ready for an amazing adventure?',
          welcomeMessage: `Hello ${studentName}! I'm Nelie, your learning companion! Today we're going to explore the exciting world of ${subject} together.`,
          tips: [
            'Take your time and think through each challenge',
            'Ask Nelie to repeat if you need to hear something again',
            'Learning is an adventure - enjoy the journey!',
            'Every step forward makes you stronger and smarter!'
          ],
          readyMessage: 'Ready to start your learning adventure!',
          lessonInfo: 'Starting lesson automatically in 5 seconds...'
        };
    }
  };

  const subjectContent = getSubjectWelcomeContent(subject);

  const handleStartIntroductionWithNelie = () => {
    setShowWelcomeTemplate(false);
  };

  const handleStartLessonWithoutSpeech = () => {
    setShowWelcomeTemplate(false);
  };

  if (showWelcomeTemplate) {
    return (
      <ClassroomEnvironment config={classroomConfig}>
        <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* Header Section with Home button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => window.location.href = '/'}
                variant="outline"
                size="sm"
                className="border-gray-400 text-white hover:bg-gray-700 bg-black/50"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              
              <Button
                onClick={onBackToProgram}
                variant="outline"
                size="sm"
                className="border-gray-400 text-white hover:bg-gray-700 bg-black/50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-400 text-white hover:bg-gray-700 bg-black/50"
              >
                Sound Off
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-400 text-white hover:bg-gray-700 bg-black/50"
              >
                Ask Nelie to Repeat
              </Button>
            </div>
          </div>

          {/* Main Welcome Card */}
          <Card className="bg-black/70 border-purple-400/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">
                  Welcome to {subjectContent.title}
                </h1>
                <div className="text-2xl text-purple-200 mb-6">
                  {subjectContent.subtitle}
                </div>
              </div>

              {/* Welcome Message */}
              <div className="bg-blue-900/40 rounded-lg p-6 border border-blue-400/30 mb-6">
                <div className="text-blue-100 text-lg leading-relaxed text-center">
                  {subjectContent.welcomeMessage}
                </div>
              </div>

              {/* Progress Info */}
              <div className="text-center text-white mb-6">
                <p className="text-lg">Step 1 of 1</p>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div className="bg-purple-400 h-2 rounded-full w-full"></div>
                </div>
              </div>

              {/* Tips Section */}
              <div className="bg-green-900/30 border border-green-400/30 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-green-300 mb-4 flex items-center">
                  💡 {subject.charAt(0).toUpperCase() + subject.slice(1)} Learning Tips
                </h3>
                <ul className="space-y-2">
                  {subjectContent.tips.map((tip, index) => (
                    <li key={index} className="text-green-200 flex items-start">
                      <span className="mr-2">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons - NO purple ready box here */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  onClick={handleStartIntroductionWithNelie}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold px-6 py-3"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Introduction with Nelie
                </Button>
                
                <Button
                  onClick={handleStartLessonWithoutSpeech}
                  variant="outline"
                  className="border-gray-400 text-white hover:bg-gray-700 bg-black/30"
                >
                  Start Lesson Without Speech
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
