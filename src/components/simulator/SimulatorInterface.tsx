
// Educational Simulator Interface - Main React component

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Target } from 'lucide-react';
import { nelieEngine } from '@/services/NELIEEngine';
import { DailyUniverse } from '@/types/learning';
import LessonPlayer from './LessonPlayer';

interface SimulatorInterfaceProps {
  studentProfile: any;
  onComplete?: () => void;
  onExit?: () => void;
}

const SimulatorInterface: React.FC<SimulatorInterfaceProps> = ({
  studentProfile,
  onComplete: _onComplete,
  onExit: _onExit
}) => {
  const [session, setSession] = useState<any | null>(null);
  const [universe, setUniverse] = useState<DailyUniverse | null>(null);
  const [activeLesson, setActiveLesson] = useState<any | null>(null);

  // Initialize simulation
  useEffect(() => {
    const initializeSimulation = async () => {
      try {
        console.log('🎮 Initializing NELIE session...');
        const newSession = await nelieEngine.startSession(studentProfile);
        setSession(newSession);
        
        const currentUniverse = nelieEngine.getCurrentUniverse();
        setUniverse(currentUniverse);
      } catch (error) {
        console.error('Failed to initialize NELIE session:', error);
      }
    };

    initializeSimulation();
  }, [studentProfile]);

  // Handle decision making
  const handleStartTask = (lesson: any) => {
    setActiveLesson(lesson);
  };

  const handleLessonComplete = () => {
    setActiveLesson(null);
  };

  if (activeLesson) {
    return <LessonPlayer lesson={activeLesson} onComplete={handleLessonComplete} />;
  }

  if (!session || !universe) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading simulation...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Target className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {(universe as any)?.title ?? universe.theme}
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {(universe as any)?.description ?? universe.storylineIntro}
          </p>
        </div>

        {/* Learning Objectives Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {(((universe as any)?.lessons) ?? []).map((lesson: any, index: number) => (
            <Card key={index} className="bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-semibold text-foreground leading-tight">
                    {lesson.lesson.title}
                  </CardTitle>
                  <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full ml-2 flex-shrink-0">
                    {lesson.lesson.subject}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {lesson.lesson.overview}
                </p>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="bg-muted px-2 py-1 rounded">
                    Grade {lesson.lesson.gradeLevel}
                  </span>
                  <span className="bg-muted px-2 py-1 rounded">
                    ~{Math.round(lesson.lesson.estimatedTotalDuration / 60)} min
                  </span>
                </div>

                <div>
                    <h4 className="text-sm font-semibold mb-2">Phases:</h4>
                    <ul className="list-disc list-inside">
                        {lesson.lesson.phases.map((phase: any, phaseIndex: number) => (
                            <li key={phaseIndex} className="text-xs">{phase.title}</li>
                        ))}
                    </ul>
                </div>

                <Button
                  onClick={() => handleStartTask(lesson.lesson)}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  size="sm"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Start Learning Journey
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer Message */}
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            🌟 Complete all tasks to unlock special achievements and advance your learning journey!
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimulatorInterface;
