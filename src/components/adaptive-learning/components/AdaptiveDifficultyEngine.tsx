import React, { useState, useEffect } from 'react';
import { calculateRecommendedSessionTime, shouldAdjustDifficulty } from '@/utils/adaptiveLearningUtils';
import { useAuth } from '@/hooks/useAuth';
import { useUserProgress } from '@/services/progressPersistence';
import { SessionData, UserPerformanceData } from '../types/AnalyticsTypes';

interface AdaptiveDifficultyEngineProps {
  subject: string;
  skillArea: string;
  initialDifficulty: number;
  children: React.ReactNode;
  onDifficultyChange: (newDifficulty: number, reason: string) => void;
}

const AdaptiveDifficultyEngine: React.FC<AdaptiveDifficultyEngineProps> = ({
  subject,
  skillArea,
  initialDifficulty,
  children,
  onDifficultyChange,
}) => {
  const { user } = useAuth();
  const userId = user?.id || 'anonymous';
  const [currentDifficulty, setCurrentDifficulty] = useState(initialDifficulty);
  const { userProgress, fetchUserProgress } = useUserProgress(userId, subject, skillArea);

  useEffect(() => {
    fetchUserProgress();
  }, [userId, subject, skillArea, fetchUserProgress]);

  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [consecutiveIncorrect, setConsecutiveIncorrect] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  const handleQuestionAnswered = (isCorrect: boolean) => {
    setTotalAttempts(prev => prev + 1);

    if (isCorrect) {
      setConsecutiveCorrect(prev => prev + 1);
      setConsecutiveIncorrect(0);
    } else {
      setConsecutiveIncorrect(prev => prev + 1);
      setConsecutiveCorrect(0);
    }
  };

  useEffect(() => {
    if (!userProgress) return;

    // Use the correct property names from UserProgress interface
    const { accuracy } = userProgress;

    const adjustment = shouldAdjustDifficulty(
      accuracy,
      consecutiveCorrect,
      consecutiveIncorrect,
      totalAttempts
    );

    if (adjustment.shouldAdjust && adjustment.newLevel) {
      const newDifficulty = Math.max(1, Math.min(5, currentDifficulty + adjustment.newLevel));
      setCurrentDifficulty(newDifficulty);
      onDifficultyChange(newDifficulty, adjustment.reason || 'Difficulty adjusted');
    }
  }, [consecutiveCorrect, consecutiveIncorrect, totalAttempts, currentDifficulty, onDifficultyChange, userProgress]);

  const [sessionHistory, setSessionHistory] = useState<any[] | null>(null);
  const [userPerformance, setUserPerformance] = useState<any | null>(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      if (!user) return;

      try {
        const response = await fetch(`/api/get-user-sessions?userId=${user.id}&subject=${subject}&skillArea=${skillArea}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const sessionData = await response.json();
        setSessionHistory(sessionData);

        const performanceResponse = await fetch(`/api/get-user-performance?userId=${user.id}&subject=${subject}&skillArea=${skillArea}`);
        if (!performanceResponse.ok) {
          throw new Error(`HTTP error! status: ${performanceResponse.status}`);
        }
        const performanceData = await performanceResponse.json();
        setUserPerformance(performanceData);

      } catch (error) {
        console.error("Could not fetch analytics data:", error);
      }
    };

    fetchAnalyticsData();
  }, [user, subject, skillArea]);

  const castSessionData = (data: any[]): SessionData[] => {
    return data.map(item => ({
      ...item,
      user_feedback: typeof item.user_feedback === 'string'
        ? JSON.parse(item.user_feedback)
        : (item.user_feedback as Record<string, unknown>) || {}
    }));
  };

  const castUserPerformanceData = (data: any): UserPerformanceData => {
    return {
      ...data,
      strengths: typeof data.strengths === 'string'
        ? JSON.parse(data.strengths)
        : (data.strengths as Record<string, unknown>) || {},
      weaknesses: typeof data.weaknesses === 'string'
        ? JSON.parse(data.weaknesses)
        : (data.weaknesses as Record<string, unknown>) || {}
    };
  };

  const sessionData = castSessionData(sessionHistory || []);
  const performanceData = castUserPerformanceData(userPerformance);

  const recommendedTime = calculateRecommendedSessionTime(userProgress);

  return (
    <>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            difficulty: currentDifficulty,
            onQuestionAnswered: handleQuestionAnswered,
            recommendedSessionTime: recommendedTime,
            sessionData: [],
            userPerformance: null
          } as any);
        }
        return child;
      })}
    </>
  );
};

export default AdaptiveDifficultyEngine;
