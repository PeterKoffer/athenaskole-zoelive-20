
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { aiLearningPathService } from '../../../services/aiLearningPathService';
import { conceptMasteryService } from '../../../services/conceptMasteryService';
import { Brain, TrendingUp, CheckCircle, Activity } from 'lucide-react';

interface AILearningStatus {
  currentFocus: string;
  nextObjectives: string[];
  adaptationReason: string;
  confidenceLevel: number;
  progressIndicator: string;
}

interface SmartRecommendationsProps {
  subject: string;
  onPathUpdate?: (newPath: any) => void;
}

const SmartRecommendations = ({ subject, onPathUpdate }: SmartRecommendationsProps) => {
  const { user } = useAuth();
  const [aiStatus, setAiStatus] = useState<AILearningStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdapting, setIsAdapting] = useState(false);

  useEffect(() => {
    if (user) {
      generateAILearningPath();
    }
  }, [user, subject]);

  const generateAILearningPath = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get student's current performance data
      const [aiRecommendations, weakConcepts, reviewConcepts] = await Promise.all([
        aiLearningPathService.getAdaptiveRecommendations(user.id, subject),
        conceptMasteryService.getWeakConcepts(user.id, subject, 0.6),
        conceptMasteryService.getConceptsNeedingReview(user.id, subject, 5)
      ]);

      // AI automatically determines the optimal learning path
      const currentFocus = determineCurrentFocus(weakConcepts, reviewConcepts);
      const nextObjectives = generateNextObjectives(weakConcepts, aiRecommendations);
      const adaptationReason = generateAdaptationReason(weakConcepts, reviewConcepts, aiRecommendations);
      const confidenceLevel = calculateConfidenceLevel(weakConcepts);
      const progressIndicator = generateProgressIndicator(weakConcepts, reviewConcepts);

      const aiLearningStatus: AILearningStatus = {
        currentFocus,
        nextObjectives,
        adaptationReason,
        confidenceLevel,
        progressIndicator
      };

      setAiStatus(aiLearningStatus);

      // Automatically generate and apply the personalized learning path
      if (onPathUpdate) {
        const optimizedPath = await aiLearningPathService.generatePersonalizedPath({
          userId: user.id,
          subject,
          weakAreas: weakConcepts.map(c => c.conceptName),
          preferredPace: 'medium',
          learningStyle: 'mixed'
        });
        
        if (optimizedPath) {
          onPathUpdate({ pathId: optimizedPath, focus: currentFocus });
        }
      }

    } catch (error) {
      console.error('Error generating AI learning path:', error);
    } finally {
      setLoading(false);
    }
  };

  const determineCurrentFocus = (weakConcepts: any[], reviewConcepts: any[]): string => {
    if (weakConcepts.length > 0) {
      const mostCritical = weakConcepts.find(c => c.masteryLevel < 0.3);
      if (mostCritical) {
        return `Strengthening ${mostCritical.conceptName}`;
      }
      return `Improving ${weakConcepts[0].conceptName}`;
    }
    
    if (reviewConcepts.length > 0) {
      return `Reviewing previously learned concepts`;
    }
    
    return `Ready for advanced concepts`;
  };

  const generateNextObjectives = (weakConcepts: any[], aiRecommendations: string[]): string[] => {
    const objectives: string[] = [];
    
    // Add weak concepts as priorities
    weakConcepts.slice(0, 2).forEach(concept => {
      objectives.push(`Master ${concept.conceptName}`);
    });
    
    // Add AI-suggested objectives
    if (aiRecommendations.length > 0) {
      objectives.push(aiRecommendations[0]);
    }
    
    // Fill with progression objectives
    if (objectives.length < 3) {
      objectives.push('Explore new challenging content');
    }
    
    return objectives.slice(0, 3);
  };

  const generateAdaptationReason = (weakConcepts: any[], reviewConcepts: any[], aiRecommendations: string[]): string => {
    if (weakConcepts.length > 2) {
      return `Focusing on fundamental concepts to build a stronger foundation`;
    }
    
    if (weakConcepts.length > 0) {
      return `Addressing specific knowledge gaps to optimize learning progress`;
    }
    
    if (reviewConcepts.length > 3) {
      return `Reinforcing previous learning to maintain knowledge retention`;
    }
    
    return `Ready for accelerated learning with more challenging content`;
  };

  const calculateConfidenceLevel = (weakConcepts: any[]): number => {
    if (weakConcepts.length === 0) return 0.95;
    if (weakConcepts.length <= 2) return 0.85;
    if (weakConcepts.length <= 4) return 0.70;
    return 0.60;
  };

  const generateProgressIndicator = (weakConcepts: any[], reviewConcepts: any[]): string => {
    const totalIssues = weakConcepts.length + reviewConcepts.length;
    
    if (totalIssues === 0) return "Excellent progress - ready for advanced challenges";
    if (totalIssues <= 2) return "Good progress - minor adjustments needed";
    if (totalIssues <= 4) return "Steady progress - focus areas identified";
    return "Building foundation - personalized support active";
  };

  const handleRefreshPath = async () => {
    setIsAdapting(true);
    await generateAILearningPath();
    setIsAdapting(false);
  };

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Brain className="w-6 h-6 text-lime-400 animate-pulse mr-2" />
            <span className="text-white">AI is analyzing your learning profile...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!aiStatus) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6 text-center">
          <Brain className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">Unable to generate learning path. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Brain className="w-5 h-5 text-lime-400" />
          <span>AI-Optimized Learning Path</span>
          <div className="ml-auto flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-lime-400 rounded-full"></div>
              <span className="text-xs text-lime-400">Active</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Focus */}
        <div className="bg-gray-800 border border-lime-500/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-lime-400" />
            <h3 className="text-white font-medium">Current Focus</h3>
          </div>
          <p className="text-lime-200 font-medium">{aiStatus.currentFocus}</p>
          <p className="text-gray-400 text-sm mt-1">{aiStatus.adaptationReason}</p>
        </div>

        {/* AI Confidence & Progress */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">AI Confidence</span>
              <span className="text-white font-semibold">
                {Math.round(aiStatus.confidenceLevel * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-lime-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${aiStatus.confidenceLevel * 100}%` }}
              />
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-gray-400 text-sm">Progress Status</span>
            </div>
            <p className="text-blue-200 text-sm">{aiStatus.progressIndicator}</p>
          </div>
        </div>

        {/* Next Objectives */}
        <div className="space-y-2">
          <h4 className="text-white font-medium flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>Next Learning Objectives</span>
          </h4>
          <div className="space-y-2">
            {aiStatus.nextObjectives.map((objective, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-3 flex items-center space-x-3">
                <div className="w-6 h-6 bg-lime-500/20 text-lime-400 rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                <span className="text-gray-300 text-sm flex-1">{objective}</span>
                <div className="w-2 h-2 bg-lime-400 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Auto-refresh indicator */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <div className="w-1 h-1 bg-gray-500 rounded-full animate-pulse"></div>
            <span>Path automatically optimizes based on your progress</span>
          </div>
          
          {isAdapting ? (
            <div className="flex items-center space-x-2 text-lime-400">
              <Brain className="w-4 h-4 animate-pulse" />
              <span className="text-xs">Adapting...</span>
            </div>
          ) : (
            <button
              onClick={handleRefreshPath}
              className="text-xs text-lime-400 hover:text-lime-300 transition-colors"
            >
              Refresh Path
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartRecommendations;
