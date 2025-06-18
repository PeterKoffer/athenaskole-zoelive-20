
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { SessionData, UserPerformanceData } from '../types/analytics';

interface DifficultyMetrics {
  currentLevel: number;
  recommendedLevel: number;
  confidenceScore: number;
  adaptationReason: string;
  lastUpdated: string;
}

interface PerformanceData {
  accuracy: number;
  responseTime: number;
  consecutiveCorrect: number;
  consecutiveIncorrect: number;
  recentSessions: SessionData[];
}

export const useAdaptiveDifficulty = (subject: string, skillArea: string) => {
  const { user } = useAuth();
  const [difficultyMetrics, setDifficultyMetrics] = useState<DifficultyMetrics>({
    currentLevel: 2,
    recommendedLevel: 2,
    confidenceScore: 0.5,
    adaptationReason: 'Initial assessment',
    lastUpdated: new Date().toISOString()
  });

  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    accuracy: 0,
    responseTime: 0,
    consecutiveCorrect: 0,
    consecutiveIncorrect: 0,
    recentSessions: []
  });

  useEffect(() => {
    if (user) {
      loadPerformanceData();
    }
  }, [user, subject, skillArea]);

  const loadPerformanceData = async () => {
    if (!user) return;

    try {
      // Get recent learning sessions
      const { data: sessions } = await supabase
        .from('learning_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('subject', subject)
        .eq('skill_area', skillArea)
        .order('created_at', { ascending: false })
        .limit(10);

      // Get user performance data
      const { data: performance } = await supabase
        .from('user_performance')
        .select('*')
        .eq('user_id', user.id)
        .eq('subject', subject)
        .eq('skill_area', skillArea)
        .single();

      if (sessions) {
        const recentPerformance = calculatePerformanceMetrics(sessions);
        setPerformanceData(recentPerformance);
        
        // Calculate adaptive difficulty
        const newDifficulty = calculateAdaptiveDifficulty(recentPerformance, performance);
        setDifficultyMetrics(newDifficulty);
      }
    } catch (error) {
      console.error('Error loading performance data:', error);
    }
  };

  const calculatePerformanceMetrics = (sessions: SessionData[]): PerformanceData => {
    if (sessions.length === 0) {
      return {
        accuracy: 0,
        responseTime: 0,
        consecutiveCorrect: 0,
        consecutiveIncorrect: 0,
        recentSessions: []
      };
    }

    // Calculate accuracy
    const totalScore = sessions.reduce((acc, session) => acc + (session.score || 0), 0);
    const accuracy = totalScore / sessions.length;

    // Calculate average response time
    const totalTime = sessions.reduce((acc, session) => acc + (session.time_spent || 0), 0);
    const avgResponseTime = totalTime / sessions.length;

    // Calculate consecutive streaks
    let consecutiveCorrect = 0;
    let consecutiveIncorrect = 0;
    
    for (const session of sessions) {
      if ((session.score || 0) >= 70) {
        consecutiveCorrect++;
        consecutiveIncorrect = 0;
      } else {
        consecutiveIncorrect++;
        consecutiveCorrect = 0;
      }
      
      if (consecutiveCorrect >= 3 || consecutiveIncorrect >= 3) break;
    }

    return {
      accuracy,
      responseTime: avgResponseTime,
      consecutiveCorrect,
      consecutiveIncorrect,
      recentSessions: sessions
    };
  };

  const calculateAdaptiveDifficulty = (performance: PerformanceData, userPerformance: UserPerformanceData | null): DifficultyMetrics => {
    let recommendedLevel = difficultyMetrics.currentLevel;
    let confidenceScore = 0.5;
    let adaptationReason = 'Maintaining current level';

    // Difficulty adjustment rules
    if (performance.accuracy >= 85 && performance.consecutiveCorrect >= 3) {
      // Increase difficulty if performing very well
      recommendedLevel = Math.min(10, difficultyMetrics.currentLevel + 1);
      confidenceScore = 0.8;
      adaptationReason = 'High accuracy and consecutive correct answers';
    } else if (performance.accuracy <= 50 || performance.consecutiveIncorrect >= 3) {
      // Decrease difficulty if struggling
      recommendedLevel = Math.max(1, difficultyMetrics.currentLevel - 1);
      confidenceScore = 0.7;
      adaptationReason = 'Low accuracy or consecutive incorrect answers';
    } else if (performance.accuracy >= 70 && performance.accuracy < 85) {
      // Optimal difficulty range
      confidenceScore = 0.9;
      adaptationReason = 'Optimal difficulty - good challenge level';
    } else if (performance.responseTime > 300) { // More than 5 minutes per question
      // If taking too long, might be too difficult
      recommendedLevel = Math.max(1, difficultyMetrics.currentLevel - 1);
      confidenceScore = 0.6;
      adaptationReason = 'Extended response time indicates difficulty';
    }

    // Consider historical performance
    if (userPerformance) {
      const historicalAccuracy = userPerformance.accuracy_rate;
      if (historicalAccuracy > performance.accuracy + 20) {
        // Current performance significantly below historical - reduce difficulty
        recommendedLevel = Math.max(1, recommendedLevel - 1);
        adaptationReason += ' (Below historical performance)';
      }
    }

    return {
      currentLevel: difficultyMetrics.currentLevel,
      recommendedLevel,
      confidenceScore,
      adaptationReason,
      lastUpdated: new Date().toISOString()
    };
  };

  const applyDifficultyAdjustment = async () => {
    if (!user) return false;

    try {
      // Update current level to recommended level
      setDifficultyMetrics(prev => ({
        ...prev,
        currentLevel: prev.recommendedLevel,
        lastUpdated: new Date().toISOString()
      }));

      // Log the difficulty adjustment
      await supabase.from('ai_interactions').insert({
        user_id: user.id,
        ai_service: 'adaptive_difficulty',
        interaction_type: 'difficulty_adjustment',
        subject,
        skill_area: skillArea,
        difficulty_level: difficultyMetrics.recommendedLevel,
        success: true,
        response_data: {
          previousLevel: difficultyMetrics.currentLevel,
          newLevel: difficultyMetrics.recommendedLevel,
          reason: difficultyMetrics.adaptationReason,
          confidence: difficultyMetrics.confidenceScore
        }
      });

      return true;
    } catch (error) {
      console.error('Error applying difficulty adjustment:', error);
      return false;
    }
  };

  const getDifficultyRecommendation = () => {
    const levelDiff = difficultyMetrics.recommendedLevel - difficultyMetrics.currentLevel;
    
    if (levelDiff > 0) {
      return {
        type: 'increase',
        message: `Ready for level ${difficultyMetrics.recommendedLevel}? Your performance suggests you can handle more challenging content.`,
        confidence: difficultyMetrics.confidenceScore
      };
    } else if (levelDiff < 0) {
      return {
        type: 'decrease',
        message: `Consider level ${difficultyMetrics.recommendedLevel}. This adjustment may help you learn more effectively.`,
        confidence: difficultyMetrics.confidenceScore
      };
    } else {
      return {
        type: 'maintain',
        message: `Level ${difficultyMetrics.currentLevel} is optimal for your current skill level.`,
        confidence: difficultyMetrics.confidenceScore
      };
    }
  };

  return {
    difficultyMetrics,
    performanceData,
    applyDifficultyAdjustment,
    getDifficultyRecommendation,
    refreshMetrics: loadPerformanceData
  };
};

export default useAdaptiveDifficulty;
