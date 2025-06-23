
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserProgress, progressPersistence } from '@/services/progressPersistence';

interface AdaptiveDifficultyEngineProps {
  subject: string;
  skillArea: string;
  initialDifficulty: number;
  onDifficultyChange: (newDifficulty: number) => void;
}

export const AdaptiveDifficultyEngine = ({
  subject,
  skillArea,
  initialDifficulty,
  onDifficultyChange
}: AdaptiveDifficultyEngineProps) => {
  const { user } = useAuth();
  const [currentDifficulty, setCurrentDifficulty] = useState(initialDifficulty);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    const loadUserProgress = async () => {
      if (!user?.id) return;
      
      const progress = await progressPersistence.getUserProgress(user.id, subject, skillArea);
      setUserProgress(progress);
      
      if (progress) {
        setCurrentDifficulty(progress.current_level);
        onDifficultyChange(progress.current_level);
      }
    };

    loadUserProgress();
  }, [user?.id, subject, skillArea, onDifficultyChange]);

  const adjustDifficulty = async (isCorrect: boolean, responseTime: number) => {
    if (!user?.id || !userProgress) return;

    let adjustment = 0;
    
    // Simple difficulty adjustment logic
    if (isCorrect && responseTime < 10000) { // Quick correct answer
      adjustment = 0.1;
    } else if (isCorrect) { // Slow correct answer
      adjustment = 0.05;
    } else { // Incorrect answer
      adjustment = -0.1;
    }

    const newDifficulty = Math.max(1, Math.min(5, currentDifficulty + adjustment));
    
    if (newDifficulty !== currentDifficulty) {
      setCurrentDifficulty(newDifficulty);
      onDifficultyChange(newDifficulty);
      
      // Update user progress
      await progressPersistence.updateUserProgress(user.id, subject, skillArea, {
        current_level: newDifficulty,
        last_assessment: new Date().toISOString()
      });
    }
  };

  return null; // This is a logic-only component
};
