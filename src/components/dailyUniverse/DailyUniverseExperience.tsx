
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import UniverseAtomRenderer from './UniverseAtomRenderer';
import DailyUniverseGenerator, { DailyUniverse, LearningAtom } from '@/services/dailyUniverse/DailyUniverseGenerator';
import UniverseSessionManager from '@/services/dailyUniverse/UniverseSessionManager';
import { 
  Sparkles, 
  Clock, 
  Target, 
  ArrowLeft,
  RefreshCw,
  Calendar
} from 'lucide-react';

interface DailyUniverseExperienceProps {
  curriculumSteps: any[];
  studentAge?: number;
}

const DailyUniverseExperience = ({ curriculumSteps, studentAge = 8 }: DailyUniverseExperienceProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [universe, setUniverse] = useState<DailyUniverse | null>(null);
  const [currentAtomIndex, setCurrentAtomIndex] = useState(0);
  const [completedAtoms, setCompletedAtoms] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    if (user) {
      initializeDailyUniverse();
    }
  }, [user]);

  const initializeDailyUniverse = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const today = new Date().toISOString().split('T')[0];

      // Generate new daily universe
      const newUniverse = await DailyUniverseGenerator.generateDailyUniverse(
        user.id,
        studentAge,
        today,
        curriculumSteps
      );

      setUniverse(newUniverse);
      UniverseSessionManager.setCurrentUniverse(newUniverse);

      // Load any existing progress
      const existingProgress = await UniverseSessionManager.loadUniverseProgress(user.id, newUniverse.id);
      if (existingProgress) {
        setCurrentAtomIndex(existingProgress.currentAtomIndex);
        setCompletedAtoms(existingProgress.completedAtoms);
        setTotalTimeSpent(existingProgress.totalTimeSpent);
      }

    } catch (error) {
      console.error('Failed to initialize daily universe:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAtomStart = (atomIndex: number) => {
    console.log(`Starting atom ${atomIndex}:`, universe?.learningAtoms[atomIndex]?.curriculumObjective);
    // Here you would typically navigate to a specific learning activity
    // For now, we'll simulate completion after a short delay
    setTimeout(() => {
      handleAtomComplete(atomIndex);
    }, 2000);
  };

  const handleAtomComplete = async (atomIndex: number) => {
    if (!user || !universe) return;

    const atom = universe.learningAtoms[atomIndex];
    const timeSpent = atom.estimatedMinutes * 60; // Convert to seconds

    try {
      await UniverseSessionManager.completeAtom(
        user.id,
        atom.id,
        timeSpent,
        `Completed: ${atom.curriculumObjective}`
      );

      // Update local state
      setCompletedAtoms(prev => [...prev, atom.id]);
      setTotalTimeSpent(prev => prev + timeSpent);
      
      // Move to next atom if not at the end
      if (atomIndex < universe.learningAtoms.length - 1) {
        setCurrentAtomIndex(atomIndex + 1);
      }

      console.log(`✅ Completed atom: ${atom.curriculumObjective}`);
    } catch (error) {
      console.error('Failed to complete atom:', error);
    }
  };

  const handleRegenerateUniverse = async () => {
    if (!user) return;
    
    await UniverseSessionManager.resetDailyProgress(user.id);
    setCompletedAtoms([]);
    setCurrentAtomIndex(0);
    setTotalTimeSpent(0);
    await initializeDailyUniverse();
  };

  const getOverallProgress = () => {
    if (!universe) return 0;
    return (completedAtoms.length / universe.learningAtoms.length) * 100;
  };

  const getEstimatedTimeRemaining = () => {
    if (!universe) return 0;
    const remainingAtoms = universe.learningAtoms.slice(currentAtomIndex);
    return remainingAtoms.reduce((total, atom) => total + atom.estimatedMinutes, 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <Sparkles className="w-16 h-16 mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold mb-2">Creating Your Daily Universe...</h2>
          <p className="text-purple-200">Weaving together your learning adventure</p>
        </div>
      </div>
    );
  }

  if (!universe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold mb-4">Unable to create today's universe</h2>
            <Button onClick={initializeDailyUniverse} className="bg-purple-600 hover:bg-purple-700">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/daily-program')}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Daily Program
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleRegenerateUniverse}
                className="text-white hover:bg-white/20"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                New Universe
              </Button>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="w-5 h-5 mr-2 text-purple-200" />
                <span className="text-purple-200">{currentDate}</span>
              </div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                {universe.theme.title}
              </h1>
              <p className="text-lg text-purple-100 mb-4">{universe.theme.setting}</p>
              
              <div className="flex items-center justify-center space-x-6 text-sm">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-blue-300" />
                  <span>{getEstimatedTimeRemaining()} min remaining</span>
                </div>
                <div className="flex items-center">
                  <Target className="w-4 h-4 mr-1 text-green-300" />
                  <span>{completedAtoms.length}/{universe.learningAtoms.length} completed</span>
                </div>
              </div>
              
              <div className="mt-4">
                <Progress value={getOverallProgress()} className="h-3 bg-white/20" />
                <p className="text-xs text-purple-200 mt-1">{Math.round(getOverallProgress())}% Complete</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Narrative Introduction */}
        <Card className="bg-white/5 backdrop-blur-lg border-white/10 text-white mb-6">
          <CardContent className="p-6">
            <div className="text-center">
              <Sparkles className="w-8 h-8 mx-auto mb-3 text-yellow-300" />
              <p className="text-lg leading-relaxed">{universe.overallNarrative}</p>
            </div>
          </CardContent>
        </Card>

        {/* Learning Atoms */}
        <div className="space-y-4">
          {universe.learningAtoms.map((atom, index) => (
            <UniverseAtomRenderer
              key={atom.id}
              atom={atom}
              isActive={index === currentAtomIndex}
              isCompleted={completedAtoms.includes(atom.id)}
              onStart={() => handleAtomStart(index)}
              onComplete={() => handleAtomComplete(index)}
              progress={index === currentAtomIndex ? 50 : 0} // Simulated progress
            />
          ))}
        </div>

        {/* Completion celebration */}
        {completedAtoms.length === universe.learningAtoms.length && (
          <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white mt-6">
            <CardContent className="p-6 text-center">
              <Sparkles className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">🎉 Universe Complete! 🎉</h2>
              <p className="text-lg mb-4">
                Congratulations! You've successfully completed your journey through {universe.theme.title}!
              </p>
              <div className="flex justify-center space-x-4">
                <Button 
                  onClick={() => navigate('/daily-program')}
                  className="bg-white text-green-600 hover:bg-gray-100"
                >
                  Return to Daily Program
                </Button>
                <Button 
                  onClick={handleRegenerateUniverse}
                  variant="outline"
                  className="border-white text-white hover:bg-white/20"
                >
                  Start New Universe
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DailyUniverseExperience;
