
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { aiLearningPathService } from '../../../services/aiLearningPathService';
import { conceptMasteryService } from '../../../services/conceptMasteryService';
import { Lightbulb, Target, Clock, TrendingUp, Brain, Star } from 'lucide-react';

interface Recommendation {
  id: string;
  type: 'concept' | 'skill' | 'pace' | 'strategy';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  estimatedImpact: string;
}

interface SmartRecommendationsProps {
  subject: string;
  onRecommendationApply?: (recommendation: Recommendation) => void;
}

const SmartRecommendations = ({ subject, onRecommendationApply }: SmartRecommendationsProps) => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      generateRecommendations();
    }
  }, [user, subject]);

  const generateRecommendations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get adaptive recommendations from AI service
      const aiRecommendations = await aiLearningPathService.getAdaptiveRecommendations(user.id, subject);
      
      // Get weak concepts
      const weakConcepts = await conceptMasteryService.getWeakConcepts(user.id, subject, 0.6);
      
      // Get concepts needing review
      const reviewConcepts = await conceptMasteryService.getConceptsNeedingReview(user.id, subject, 5);

      // Generate comprehensive recommendations
      const generatedRecommendations: Recommendation[] = [];

      // AI-based recommendations
      aiRecommendations.forEach((rec, index) => {
        generatedRecommendations.push({
          id: `ai-${index}`,
          type: 'strategy',
          title: 'AI Recommendation',
          description: rec,
          priority: 'high',
          actionable: true,
          estimatedImpact: 'High - Based on your learning patterns'
        });
      });

      // Weak concepts recommendations
      if (weakConcepts.length > 0) {
        const topWeakConcepts = weakConcepts.slice(0, 3);
        topWeakConcepts.forEach((concept, index) => {
          generatedRecommendations.push({
            id: `weak-${index}`,
            type: 'concept',
            title: `Focus on ${concept.conceptName}`,
            description: `Your mastery level is ${Math.round(concept.masteryLevel * 100)}%. Additional practice could significantly improve your understanding.`,
            priority: concept.masteryLevel < 0.3 ? 'high' : 'medium',
            actionable: true,
            estimatedImpact: 'Medium - Improve foundation knowledge'
          });
        });
      }

      // Review recommendations
      if (reviewConcepts.length > 0) {
        generatedRecommendations.push({
          id: 'review-1',
          type: 'concept',
          title: 'Review Previous Concepts',
          description: `${reviewConcepts.length} concepts haven't been practiced recently. Regular review helps maintain knowledge.`,
          priority: 'medium',
          actionable: true,
          estimatedImpact: 'Medium - Maintain knowledge retention'
        });
      }

      // Study pattern recommendations
      generatedRecommendations.push({
        id: 'pattern-1',
        type: 'strategy',
        title: 'Optimize Study Sessions',
        description: 'Consider shorter, more frequent study sessions for better retention.',
        priority: 'low',
        actionable: true,
        estimatedImpact: 'Low - Improve efficiency'
      });

      // Skill advancement recommendations
      const masteredCount = weakConcepts.filter(c => c.masteryLevel >= 0.8).length;
      if (masteredCount > 3) {
        generatedRecommendations.push({
          id: 'advance-1',
          type: 'skill',
          title: 'Ready for Advanced Topics',
          description: 'You\'ve mastered several fundamental concepts. Consider exploring more challenging material.',
          priority: 'medium',
          actionable: true,
          estimatedImpact: 'High - Accelerate learning progress'
        });
      }

      setRecommendations(generatedRecommendations);
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'concept': return <Brain className="w-4 h-4" />;
      case 'skill': return <Target className="w-4 h-4" />;
      case 'pace': return <Clock className="w-4 h-4" />;
      case 'strategy': return <TrendingUp className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const handleApplyRecommendation = (recommendation: Recommendation) => {
    if (onRecommendationApply) {
      onRecommendationApply(recommendation);
    }
    
    // Remove applied recommendation
    setRecommendations(prev => prev.filter(r => r.id !== recommendation.id));
  };

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-lime-400 animate-pulse mr-2" />
            <span className="text-white">Generating personalized recommendations...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Star className="w-5 h-5 text-lime-400" />
          <span>Smart Learning Recommendations</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.length === 0 ? (
          <div className="text-center py-8">
            <Star className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">Great job! You're doing well across all areas.</p>
            <Button onClick={generateRecommendations} variant="outline">
              Refresh Recommendations
            </Button>
          </div>
        ) : (
          recommendations.map((recommendation) => (
            <Card key={recommendation.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-start justify-between space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getTypeIcon(recommendation.type)}
                      <h3 className="text-white font-medium">{recommendation.title}</h3>
                      <Badge className={getPriorityColor(recommendation.priority)}>
                        {recommendation.priority}
                      </Badge>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{recommendation.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{recommendation.estimatedImpact}</span>
                      {recommendation.actionable && (
                        <Button
                          size="sm"
                          onClick={() => handleApplyRecommendation(recommendation)}
                          className="bg-lime-500 hover:bg-lime-600"
                        >
                          Apply
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
        
        <div className="flex justify-center pt-4">
          <Button onClick={generateRecommendations} variant="outline" size="sm">
            <Lightbulb className="w-4 h-4 mr-2" />
            Refresh Recommendations
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartRecommendations;
