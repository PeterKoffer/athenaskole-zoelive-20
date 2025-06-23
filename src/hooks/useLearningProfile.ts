
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface UserLearningProfile {
  user_id: string;
  attention_span_minutes: number;
  average_response_time: number;
  consistency_score: number;
  current_difficulty_level: number;
  difficulty_adjustments: Record<string, unknown>;
  engagement_patterns: Record<string, unknown>;
  frustration_indicators: Record<string, unknown>;
  last_updated: string;
  learning_pace: string;
  learning_preferences: Record<string, unknown>;
  motivation_triggers: Record<string, unknown>;
  optimal_session_length: number;
  performance_trends: Record<string, unknown>;
  problem_solving_approach: string;
  retention_rate: number;
  social_learning_preference: string;
  strengths: string[];
  subject_preferences: Record<string, unknown>;
  task_completion_rate: number;
  weaknesses: string[];
  learning_style?: string;
  total_sessions?: number;
  accuracy_rate?: number; // Added to match the property being used in session updates
}

export const useLearningProfile = (subject?: string, skillArea?: string) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserLearningProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProfile = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      // Mock implementation - replace with actual API call
      const mockProfile: UserLearningProfile = {
        user_id: user.id,
        attention_span_minutes: 25,
        average_response_time: 3.5,
        consistency_score: 0.8,
        current_difficulty_level: 2,
        difficulty_adjustments: {},
        engagement_patterns: {},
        frustration_indicators: {},
        last_updated: new Date().toISOString(),
        learning_pace: 'moderate',
        learning_preferences: {},
        motivation_triggers: {},
        optimal_session_length: 20,
        performance_trends: {},
        problem_solving_approach: 'systematic',
        retention_rate: 0.75,
        social_learning_preference: 'individual',
        strengths: ['problem-solving', 'pattern-recognition'],
        subject_preferences: {},
        task_completion_rate: 0.85,
        weaknesses: ['time-management'],
        learning_style: 'visual',
        total_sessions: 10,
        accuracy_rate: 0.75
      };
      setProfile(mockProfile);
    } catch (error) {
      console.error('Error fetching learning profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserLearningProfile>) => {
    if (!user?.id) return;
    
    try {
      // Mock implementation - replace with actual API call
      setProfile(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      console.error('Error updating learning profile:', error);
    }
  };

  const getRecommendedDifficulty = () => {
    if (!profile) return 1;
    return profile.current_difficulty_level;
  };

  const getPersonalizedSettings = () => {
    if (!profile) return { optimalSessionLength: 20, learningPace: 'moderate', preferences: {} };
    return {
      optimalSessionLength: profile.optimal_session_length,
      learningPace: profile.learning_pace,
      preferences: profile.learning_preferences,
      attentionSpan: profile.attention_span_minutes
    };
  };

  useEffect(() => {
    fetchProfile();
  }, [user?.id]);

  return {
    profile,
    isLoading,
    fetchProfile,
    updateProfile,
    getRecommendedDifficulty,
    getPersonalizedSettings
  };
};
