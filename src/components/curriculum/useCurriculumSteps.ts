
import { useState, useEffect } from 'react';
import { CurriculumStep, UserStepProgress } from '@/types/curriculum';
import { useAuth } from '@/hooks/useAuth';

export const useCurriculumSteps = () => {
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

  const getStepProgress = (stepId: string) => {
    const progress = userProgress.find(p => p.stepId === stepId);
    return progress ? Object.values(progress.curriculumProgress).filter(Boolean).length : 0;
  };

  const getTotalCurriculums = (step: CurriculumStep) => {
    return step.curriculums.length || 12; // Default to 12 curriculums per step
  };

  return {
    steps,
    userProgress,
    loading,
    getStepProgress,
    getTotalCurriculums
  };
};
