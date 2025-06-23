
import { useState, useEffect, useCallback } from 'react';
import { progressPersistence, UserProgress } from '@/services/progressPersistence';

export const useUserProgress = (userId: string, subject: string, skillArea: string) => {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProgress = useCallback(async () => {
    if (!userId || !subject || !skillArea) return;

    setIsLoading(true);
    setError(null);

    try {
      const progress = await progressPersistence.getUserProgress(userId, subject, skillArea);
      setUserProgress(progress);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user progress');
      console.error('Error fetching user progress:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, subject, skillArea]);

  const updateProgress = useCallback(async (progressData: any) => {
    if (!userId || !subject || !skillArea) return;

    try {
      await progressPersistence.updateUserProgress(userId, subject, skillArea, progressData);
      await fetchUserProgress(); // Refresh the data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user progress');
      console.error('Error updating user progress:', err);
    }
  }, [userId, subject, skillArea, fetchUserProgress]);

  useEffect(() => {
    fetchUserProgress();
  }, [fetchUserProgress]);

  return {
    userProgress,
    isLoading,
    error,
    fetchUserProgress,
    updateProgress
  };
};
