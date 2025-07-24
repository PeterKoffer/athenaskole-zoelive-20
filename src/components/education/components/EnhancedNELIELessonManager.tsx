
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Play, Pause, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

import { generateEnhancedLesson, EnhancedLessonConfig } from './utils/EnhancedLessonGenerator';

interface EnhancedNELIELessonManagerProps {
  subject: string;
  skillArea: string;
  onBack: () => void;
}

const EnhancedNELIELessonManager = ({ subject, skillArea, onBack }: EnhancedNELIELessonManagerProps) => {
  const [lesson, setLesson] = useState<EnhancedLessonConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    initializeLesson();
  }, [subject, skillArea]);

  const initializeLesson = async () => {
    setIsLoading(true);
    try {
      // Check if there's an existing session
      const existingSession = sessionStorage.getItem(`lesson_${subject}_${skillArea}`);
      
      if (existingSession) {
        const sessionData = JSON.parse(existingSession);
        console.log('Restoring existing session:', sessionData);
        setLesson(sessionData);
      } else {
        // Generate new lesson
        const newLesson = await generateEnhancedLesson(subject, skillArea);
        console.log('Generated new lesson:', newLesson);
        setLesson(newLesson);
        
        // Save to session storage
        sessionStorage.setItem(`lesson_${subject}_${skillArea}`, JSON.stringify(newLesson));
      }
    } catch (error) {
      console.error('Error initializing lesson:', error);
      // Fallback lesson
      const fallbackLesson: EnhancedLessonConfig = {
        sessionId: `fallback_${Date.now()}`,
        title: `${subject} - ${skillArea}`,
        overview: `Interactive ${subject} lesson focusing on ${skillArea}`,
        gradeLevel: 3,
        learningStyle: 'mixed',
        subject,
        skillArea,
        difficulty: 1,
        estimatedTotalDuration: 20,
        estimatedDuration: 20,
        objectives: [`Learn ${skillArea} concepts`],
        learningObjectives: [`Learn ${skillArea} concepts`],
        prerequisites: [],
        assessmentCriteria: ['Understanding of concepts'],
        assessmentMethods: ['Interactive exercises'],
        materials: ['Interactive content'],
        extensions: ['Practice exercises'],
        keywords: [subject, skillArea],
        phases: []
      };
      setLesson(fallbackLesson);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartLesson = () => {
    setIsActive(true);
  };

  const handlePauseLesson = () => {
    setIsActive(false);
  };

  const handleNextPhase = () => {
    if (lesson?.phases && currentPhaseIndex < lesson.phases.length - 1) {
      setCurrentPhaseIndex(prev => prev + 1);
    } else {
      handleCompleteLesson();
    }
  };

  const handleCompleteLesson = () => {
    setIsActive(false);
    // Save completion to session storage
    if (lesson) {
      const completionData = {
        ...lesson,
        completed: true,
        completedAt: new Date().toISOString()
      };
      sessionStorage.setItem(`lesson_${subject}_${skillArea}_completed`, JSON.stringify(completionData));
    }
  };

  if (isLoading) {
    return (
      <Card className="max-w-4xl mx-auto bg-gray-900 border-gray-800">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-lime-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white">Preparing your enhanced lesson...</p>
        </CardContent>
      </Card>
    );
  }

  if (!lesson) {
    return (
      <Card className="max-w-4xl mx-auto bg-red-900 border-red-700">
        <CardContent className="p-8 text-center text-white">
          <h3 className="text-lg font-semibold mb-2">Lesson Error</h3>
          <p className="text-red-300 mb-4">Unable to load lesson content.</p>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="bg-blue-600 text-white">
                Grade {lesson.gradeLevel}
              </Badge>
              <Badge variant="outline" className="bg-purple-600 text-white">
                {lesson.learningStyle}
              </Badge>
            </div>
          </div>
          
          <div>
            <CardTitle className="text-white text-2xl mb-2">
              {lesson.title}
            </CardTitle>
            <p className="text-gray-400">{lesson.overview}</p>
          </div>
        </CardHeader>
      </Card>

      {/* Lesson Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <BookOpen className="w-5 h-5 text-lime-400" />
                <span>Lesson Content</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isActive ? (
                <div className="text-center py-8">
                  <Play className="w-16 h-16 text-lime-400 mx-auto mb-4" />
                  <h3 className="text-white text-lg font-semibold mb-2">
                    Ready to Start Learning?
                  </h3>
                  <p className="text-gray-400 mb-6">
                    This lesson will take approximately {lesson.estimatedTotalDuration} minutes
                  </p>
                  <Button
                    onClick={handleStartLesson}
                    className="bg-lime-500 hover:bg-lime-600 text-black font-semibold"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Lesson
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-semibold">
                      Interactive Learning Session
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePauseLesson}
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </Button>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-6">
                    <p className="text-white mb-4">
                      Welcome to your {subject} lesson on {skillArea}!
                    </p>
                    <p className="text-gray-300 mb-6">
                      In this interactive session, we'll explore key concepts and practice together.
                    </p>
                    
                    <Button
                      onClick={handleNextPhase}
                      className="bg-lime-500 hover:bg-lime-600 text-black"
                    >
                      Continue Learning
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Learning Objectives */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">Learning Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {lesson.learningObjectives?.map((objective, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-lime-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{objective}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Progress */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Duration</span>
                  <span className="text-white">{lesson.estimatedTotalDuration} min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Difficulty</span>
                  <Badge variant="outline">{lesson.difficulty}/5</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Status</span>
                  <span className="text-lime-400">
                    {isActive ? 'In Progress' : 'Ready'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnhancedNELIELessonManager;
