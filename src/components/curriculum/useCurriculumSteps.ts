
import { useState, useEffect } from 'react';
import { CurriculumStep, UserStepProgress } from '@/types/curriculum';
import { useAuth } from '@/hooks/useAuth';
import { staticDataService } from '@/services/staticDataService';

export const useCurriculumSteps = () => {
  const { user } = useAuth();
  const [steps, setSteps] = useState<CurriculumStep[]>([]);
  const [userProgress, setUserProgress] = useState<UserStepProgress[]>([]);
  const [loading, setLoading] = useState(true);

  // Load steps from external data source with fallback
  useEffect(() => {
    const loadSteps = async () => {
      try {
        const externalSteps = await staticDataService.loadCurriculumSteps();
        
        if (externalSteps.length > 0) {
          setSteps(externalSteps);
        } else {
          // Fallback to mock data if external data fails to load
          const fallbackSteps: CurriculumStep[] = [
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
            }
          ];
          setSteps(fallbackSteps);
        }
      } catch (error) {
        console.error('Failed to load curriculum steps:', error);
        // Use minimal fallback data in case of error
        setSteps([
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
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadSteps();
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
