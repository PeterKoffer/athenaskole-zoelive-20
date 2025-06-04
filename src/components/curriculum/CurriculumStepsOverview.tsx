
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Lock, CheckCircle, Clock, BookOpen, Play } from 'lucide-react';
import { CurriculumStep, UserStepProgress } from '@/types/curriculum';
import { useAuth } from '@/hooks/useAuth';

interface CurriculumStepsOverviewProps {
  onStepSelect: (step: CurriculumStep) => void;
}

const CurriculumStepsOverview = ({ onStepSelect }: CurriculumStepsOverviewProps) => {
  const { user } = useAuth();
  const [steps, setSteps] = useState<CurriculumStep[]>([]);
  const [userProgress, setUserProgress] = useState<UserStepProgress[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for the 12 steps - in a real app, this would come from your database
  useEffect(() => {
    const mockSteps: CurriculumStep[] = [
      {
        id: '1',
        stepNumber: 1,
        title: 'Foundation Basics',
        description: 'Learn the fundamental concepts and basic skills',
        isCompleted: false,
        isLocked: false,
        estimatedTime: 45,
        difficulty: 'easy',
        curriculums: []
      },
      {
        id: '2',
        stepNumber: 2,
        title: 'Building Blocks',
        description: 'Understand core principles and building blocks',
        isCompleted: false,
        isLocked: true,
        estimatedTime: 60,
        difficulty: 'easy',
        curriculums: []
      },
      {
        id: '3',
        stepNumber: 3,
        title: 'Essential Skills',
        description: 'Develop essential skills for progression',
        isCompleted: false,
        isLocked: true,
        estimatedTime: 75,
        difficulty: 'medium',
        curriculums: []
      },
      {
        id: '4',
        stepNumber: 4,
        title: 'Intermediate Concepts',
        description: 'Explore intermediate level concepts',
        isCompleted: false,
        isLocked: true,
        estimatedTime: 90,
        difficulty: 'medium',
        curriculums: []
      },
      {
        id: '5',
        stepNumber: 5,
        title: 'Advanced Foundations',
        description: 'Master advanced foundational knowledge',
        isCompleted: false,
        isLocked: true,
        estimatedTime: 105,
        difficulty: 'medium',
        curriculums: []
      },
      {
        id: '6',
        stepNumber: 6,
        title: 'Complex Applications',
        description: 'Apply knowledge to complex scenarios',
        isCompleted: false,
        isLocked: true,
        estimatedTime: 120,
        difficulty: 'hard',
        curriculums: []
      },
      {
        id: '7',
        stepNumber: 7,
        title: 'Specialized Topics',
        description: 'Dive into specialized areas of study',
        isCompleted: false,
        isLocked: true,
        estimatedTime: 135,
        difficulty: 'hard',
        curriculums: []
      },
      {
        id: '8',
        stepNumber: 8,
        title: 'Expert Level',
        description: 'Reach expert-level understanding',
        isCompleted: false,
        isLocked: true,
        estimatedTime: 150,
        difficulty: 'hard',
        curriculums: []
      },
      {
        id: '9',
        stepNumber: 9,
        title: 'Mastery Phase',
        description: 'Achieve mastery of all concepts',
        isCompleted: false,
        isLocked: true,
        estimatedTime: 165,
        difficulty: 'hard',
        curriculums: []
      },
      {
        id: '10',
        stepNumber: 10,
        title: 'Integration Skills',
        description: 'Integrate all learned skills effectively',
        isCompleted: false,
        isLocked: true,
        estimatedTime: 180,
        difficulty: 'hard',
        curriculums: []
      },
      {
        id: '11',
        stepNumber: 11,
        title: 'Professional Application',
        description: 'Apply skills in professional contexts',
        isCompleted: false,
        isLocked: true,
        estimatedTime: 195,
        difficulty: 'hard',
        curriculums: []
      },
      {
        id: '12',
        stepNumber: 12,
        title: 'Excellence & Innovation',
        description: 'Achieve excellence and drive innovation',
        isCompleted: false,
        isLocked: true,
        estimatedTime: 210,
        difficulty: 'hard',
        curriculums: []
      }
    ];

    setSteps(mockSteps);
    setLoading(false);
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStepProgress = (stepId: string) => {
    const progress = userProgress.find(p => p.stepId === stepId);
    return progress ? Object.values(progress.curriculumProgress).filter(Boolean).length : 0;
  };

  const getTotalCurriculums = (step: CurriculumStep) => {
    return step.curriculums.length || 12; // Default to 12 curriculums per step
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white">Loading curriculum steps...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">12-Step Learning Journey</h1>
        <p className="text-gray-400">Complete each step to unlock the next level of learning</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((step) => {
          const progressCount = getStepProgress(step.id);
          const totalCurriculums = getTotalCurriculums(step);
          const progressPercentage = totalCurriculums > 0 ? (progressCount / totalCurriculums) * 100 : 0;

          return (
            <Card key={step.id} className={`bg-gray-800 border-gray-700 ${step.isLocked ? 'opacity-60' : ''}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                      {step.stepNumber}
                    </div>
                    {step.isCompleted && <CheckCircle className="w-5 h-5 text-green-400" />}
                    {step.isLocked && <Lock className="w-5 h-5 text-gray-400" />}
                  </div>
                  <Badge className={`${getDifficultyColor(step.difficulty)} text-white`}>
                    {step.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-white text-lg">{step.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-400 text-sm">{step.description}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{step.estimatedTime} min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{totalCurriculums} curriculums</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white">{progressCount}/{totalCurriculums}</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>

                <Button
                  onClick={() => onStepSelect(step)}
                  disabled={step.isLocked}
                  className={`w-full ${
                    step.isLocked 
                      ? 'bg-gray-600 cursor-not-allowed' 
                      : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  {step.isLocked ? (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Locked
                    </>
                  ) : step.isCompleted ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Review
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start Learning
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CurriculumStepsOverview;
