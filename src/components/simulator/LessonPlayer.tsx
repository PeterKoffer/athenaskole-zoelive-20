import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import AITutor from '@/components/AITutor';
import DifficultySelector from './DifficultySelector';
import { generateEnhancedLesson } from '../education/components/utils/EnhancedLessonGenerator';

interface LessonPlayerProps {
  lesson: any;
}

const LessonPlayer: React.FC<LessonPlayerProps> = ({ lesson: initialLesson }) => {
  const [lesson, setLesson] = useState(initialLesson);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);

  const handleNextPhase = () => {
    if (currentPhaseIndex < lesson.phases.length - 1) {
      setCurrentPhaseIndex(currentPhaseIndex + 1);
    }
  };

  const handlePreviousPhase = () => {
    if (currentPhaseIndex > 0) {
      setCurrentPhaseIndex(currentPhaseIndex - 1);
    }
  };

  const handleDifficultyChange = async (difficulty: number) => {
    const newLesson = await generateEnhancedLesson(lesson.subject, lesson.skillArea, lesson.gradeLevel, lesson.learningStyle);
    setLesson(newLesson);
  };

  const currentPhase = lesson.phases[currentPhaseIndex];

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
            <p>{currentPhase.phaseDescription}</p>
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
