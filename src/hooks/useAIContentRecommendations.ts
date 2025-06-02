
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { aiContentRecommendationService, ContentRecommendation } from '@/services/aiContentRecommendationService';

export const useAIContentRecommendations = (subject: string, limit: number = 5) => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<ContentRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const data = await aiContentRecommendationService.getRecommendations(
        user.id,
        subject,
        limit
      );
      setRecommendations(data);
    } catch (err) {
      setError('Failed to fetch content recommendations');
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [user, subject, limit]);

  return {
    recommendations,
    loading,
    error,
    refetch: fetchRecommendations
  };
};
