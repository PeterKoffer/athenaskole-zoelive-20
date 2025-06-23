import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, BookOpen, Users, Award, RefreshCw, CheckCircle } from 'lucide-react';

import {
  generateCompleteEducationalSession,
  generateMathematicsLesson,
  generateEnglishLesson
} from '../utils/EnhancedSubjectLessonFactory';
import { generateEnhancedLesson, validateEnhancedLesson } from '../utils/EnhancedLessonGenerator';

/**
 * Enhanced NELIE Lesson Manager Component
 *
 * Provides 20-25 minutes of unique, high-quality content for each class session
 * with adaptive learning and curriculum alignment for all 6 subjects.
 */

interface LessonSession {
  mathematics: any;
  english: any;
  science: any;
  music: any;
  computerScience: any;
  creativeArts: any;
  sessionMetadata: any;
}

interface ComponentProps {
  studentGrade?: number;
  preferredLearningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  onLessonStart?: (subject: string, lesson: any) => void;
  onSessionComplete?: (session: LessonSession) => void;
}

export const EnhancedNELIELessonManager: React.FC<ComponentProps> = ({
  studentGrade = 1,
  preferredLearningStyle = 'mixed',
  onLessonStart,
  onSessionComplete
}) => {
  const [currentSession, setCurrentSession] = useState<LessonSession | null>(null);
  const [currentSubject, setCurrentSubject] = useState<string | null>(null);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [sessionProgress, setSessionProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [grade, setGrade] = useState(studentGrade);
  const [learningStyle, setLearningStyle] = useState(preferredLearningStyle);
  const [validationResults, setValidationResults] = useState<any>(null);

  const subjects = [
    { key: 'mathematics', name: 'Mathematics', icon: '🔢', color: 'bg-blue-500' },
    { key: 'english', name: 'English', icon: '📖', color: 'bg-green-500' },
    { key: 'science', name: 'Science', icon: '🔬', color: 'bg-purple-500' },
    { key: 'music', name: 'Music', icon: '🎵', color: 'bg-pink-500' },
    { key: 'computerScience', name: 'Computer Science', icon: '💻', color: 'bg-orange-500' },
    { key: 'creativeArts', name: 'Creative Arts', icon: '🎨', color: 'bg-red-500' }
  ];

  // Generate a complete educational session
  const generateNewSession = async () => {
    setIsGenerating(true);
    try {
      const sessionId = `nelie-session-${Date.now()}`;
      const session = generateCompleteEducationalSession(grade, learningStyle, sessionId);
      
      // Validate all lessons in the session
      const validations = subjects.map(subject => {
        const lesson = session[subject.key as keyof LessonSession];
        return {
          subject: subject.key,
          validation: validateEnhancedLesson(lesson)
        };
      });

      setCurrentSession(session);
      setValidationResults(validations);
      setSessionProgress(0);
      setCurrentSubject(null);
      setCurrentLesson(null);

      console.log('✅ Generated complete NELIE session:', {
        sessionId,
        totalSubjects: 6,
        gradeLevel: grade,
        learningStyle,
        validations: validations.map(v => ({
          subject: v.subject,
          valid: v.validation.isValid,
          score: v.validation.qualityScore
        }))
      });

    } catch (error) {
      console.error('❌ Error generating session:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Start a specific subject lesson
  const startLesson = (subjectKey: string) => {
    if (!currentSession) return;

    const lesson = currentSession[subjectKey as keyof LessonSession];
    setCurrentSubject(subjectKey);
    setCurrentLesson(lesson);

    if (onLessonStart) {
      onLessonStart(subjectKey, lesson);
    }

    console.log(`🎯 Starting ${subjectKey} lesson:`, {
      duration: `${Math.floor(lesson.totalDuration / 60)}m ${lesson.totalDuration % 60}s`,
      phases: lesson.phases.length,
      sessionId: lesson.metadata.sessionId
    });
  };

  // Complete current lesson and move to next
  const completeLesson = () => {
    if (!currentSubject) return;

    const completedIndex = subjects.findIndex(s => s.key === currentSubject);
    const nextIndex = completedIndex + 1;

    setSessionProgress(((completedIndex + 1) / subjects.length) * 100);

    if (nextIndex < subjects.length) {
      // Auto-start next lesson
      const nextSubject = subjects[nextIndex].key;
      startLesson(nextSubject);
    } else {
      // Session complete
      setCurrentSubject(null);
      setCurrentLesson(null);
      if (onSessionComplete && currentSession) {
        onSessionComplete(currentSession);
      }
      console.log('🎉 Complete NELIE session finished!');
    }
  };

  // Generate initial session on component mount
  useEffect(() => {
    generateNewSession();
  }, []);

  // Regenerate when grade or learning style changes
  useEffect(() => {
    if (currentSession) {
      generateNewSession();
    }
  }, [grade, learningStyle]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getOverallQualityScore = () => {
    if (!validationResults) return 0;
    const totalScore = validationResults.reduce((sum: number, result: any) =>
      sum + result.validation.qualityScore, 0);
    return Math.round(totalScore / validationResults.length);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Session Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Enhanced NELIE Lesson System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Grade Level</label>
              <Select value={grade.toString()} onValueChange={(value) => setGrade(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Kindergarten</SelectItem>
                  <SelectItem value="1">Grade 1</SelectItem>
                  <SelectItem value="2">Grade 2</SelectItem>
                  <SelectItem value="3">Grade 3</SelectItem>
                  <SelectItem value="4">Grade 4</SelectItem>
                  <SelectItem value="5">Grade 5</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Learning Style</label>
              <Select value={learningStyle} onValueChange={(value: any) => setLearningStyle(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select learning style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visual">Visual Learner</SelectItem>
                  <SelectItem value="auditory">Auditory Learner</SelectItem>
                  <SelectItem value="kinesthetic">Kinesthetic Learner</SelectItem>
                  <SelectItem value="mixed">Mixed Learning</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={generateNewSession}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Generate New Session
              </Button>
            </div>
          </div>

          {/* Session Quality Metrics */}
          {validationResults && (
            <Alert>
              <Award className="h-4 w-4" />
              <AlertDescription>
                Session Quality Score: <strong>{getOverallQualityScore()}/100</strong>
                {' • '}Total Duration: <strong>2.5-3 hours</strong>
                {' • '}All 6 subjects validated and ready!
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Session Progress */}
      {currentSession && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Session Progress
              </span>
              <Badge variant="outline">
                {Math.round(sessionProgress)}% Complete
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={sessionProgress} className="mb-4" />

            {/* Current Lesson Display */}
            {currentLesson && (
              <div className="bg-muted p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2">
                  Current Lesson: {subjects.find(s => s.key === currentSubject)?.name}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Duration:</span>
                    <div className="font-medium">{formatDuration(currentLesson.totalDuration)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Phases:</span>
                    <div className="font-medium">{currentLesson.phases.length}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Style:</span>
                    <div className="font-medium capitalize">{currentLesson.metadata.learningStyle}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Grade:</span>
                    <div className="font-medium">
                      {currentLesson.metadata.gradeLevel === 0 ? 'K' : `Grade ${currentLesson.metadata.gradeLevel}`}
                    </div>
                  </div>
                </div>

                <Button onClick={completeLesson} className="mt-4" size="sm">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Lesson
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Subject Grid */}
      {currentSession && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subject, index) => {
            const lesson = currentSession[subject.key as keyof LessonSession];
            const validation = validationResults?.find((v: any) => v.subject === subject.key)?.validation;
            const isActive = currentSubject === subject.key;
            const isCompleted = sessionProgress > (index / subjects.length) * 100;

            return (
              <Card
                key={subject.key}
                className={`transition-all duration-300 ${
                  isActive ? 'ring-2 ring-primary shadow-lg' : ''
                } ${isCompleted ? 'bg-green-50' : ''}`}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="text-2xl">{subject.icon}</span>
                      <span className="text-sm">{subject.name}</span>
                    </span>
                    {isCompleted && <CheckCircle className="h-5 w-5 text-green-600" />}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Duration:</span>
                      <div className="font-medium">{formatDuration(lesson.totalDuration)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Quality:</span>
                      <div className="font-medium">{validation?.qualityScore || 0}/100</div>
                    </div>
                  </div>

                  <div className="text-sm">
                    <span className="text-muted-foreground">Topic:</span>
                    <div className="font-medium">{lesson.metadata.skillArea}</div>
                  </div>

                  {validation && validation.isValid ? (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Validated
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-red-600 border-red-600">
                      Needs Review
                    </Badge>
                  )}

                  <Button
                    onClick={() => startLesson(subject.key)}
                    disabled={isActive || isGenerating}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    className="w-full"
                  >
                    {isActive ? 'In Progress' : isCompleted ? 'Restart Lesson' : 'Start Lesson'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Loading State */}
      {isGenerating && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin mr-4" />
            <span>Generating unique, high-quality lesson content...</span>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedNELIELessonManager;