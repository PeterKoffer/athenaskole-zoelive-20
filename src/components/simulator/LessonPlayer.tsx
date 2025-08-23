import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import AITutor from '@/components/AITutor';
import DifficultySelector from './DifficultySelector';
import { generateEnhancedLesson } from '../education/components/utils/EnhancedLessonGenerator';
import ContentRenderer from './ContentRenderer';

interface LessonPlayerProps {
  lesson: any;
  onComplete: () => void;
}

const LessonPlayer: React.FC<LessonPlayerProps> = ({ lesson: initialLesson, onComplete }) => {
  const [lesson, setLesson] = useState(initialLesson);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [progress, setProgress] = useState<Record<number, any>>({});
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (currentPhaseIndex === lesson.phases.length - 1) {
      setCompleted(true);
    }
  }, [currentPhaseIndex, lesson.phases.length]);

  useEffect(() => {
    const newProgress = {
      ...progress,
      [currentPhaseIndex]: {
        ...progress[currentPhaseIndex],
        startTime: Date.now(),
      },
    };
    setProgress(newProgress);
  }, [currentPhaseIndex]);

  const handleNextPhase = () => {
    if (currentPhaseIndex < lesson.phases.length - 1) {
      const newProgress = {
        ...progress,
        [currentPhaseIndex]: {
          ...progress[currentPhaseIndex],
          endTime: Date.now(),
        },
      };
      setProgress(newProgress);
      setCurrentPhaseIndex(currentPhaseIndex + 1);
    }
  };

  const handlePreviousPhase = () => {
    if (currentPhaseIndex > 0) {
      setCurrentPhaseIndex(currentPhaseIndex - 1);
    }
  };

  const handleDifficultyChange = async (_difficulty: number) => {
    const newLesson = await generateEnhancedLesson(lesson.subject, lesson.skillArea, lesson.gradeLevel, lesson.learningStyle);
    setLesson(newLesson);
  };

  const currentPhase = lesson.phases[currentPhaseIndex];

  if (completed) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Lesson Complete!</h2>
          <Button onClick={onComplete}>Back to Universe</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-6 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{lesson.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <DifficultySelector onDifficultyChange={handleDifficultyChange} />
            <h2 className="text-2xl font-bold mb-4 mt-4">{currentPhase.title}</h2>
            <ContentRenderer content={currentPhase.content} />
            <div className="flex justify-between mt-4">
              <Button onClick={handlePreviousPhase} disabled={currentPhaseIndex === 0}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button onClick={handleNextPhase} disabled={currentPhaseIndex === lesson.phases.length - 1}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
        <AITutor />
      </div>
    </div>
  );
};

export default LessonPlayer;
