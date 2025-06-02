
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Brain, TrendingUp, Clock, Target } from 'lucide-react';

interface ConceptMastery {
  id: string;
  concept_name: string;
  subject: string;
  mastery_level: number;
  practice_count: number;
  correct_attempts: number;
  total_attempts: number;
  last_practice: string;
  created_at: string;
}

interface ConceptMasteryTrackerProps {
  subject: string;
  skillArea?: string;
}

const ConceptMasteryTracker = ({ subject, skillArea }: ConceptMasteryTrackerProps) => {
  const { user } = useAuth();
  const [concepts, setConcepts] = useState<ConceptMastery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadConceptMastery();
    }
  }, [user, subject, skillArea]);

  const loadConceptMastery = async () => {
    if (!user) return;

    try {
      let query = supabase
        .from('concept_mastery')
        .select('*')
        .eq('user_id', user.id)
        .eq('subject', subject)
        .order('mastery_level', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Error loading concept mastery:', error);
        return;
      }

      setConcepts(data || []);
    } catch (error) {
      console.error('Error in loadConceptMastery:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateConceptMastery = async (conceptName: string, isCorrect: boolean) => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('update_concept_mastery', {
        p_user_id: user.id,
        p_concept_name: conceptName,
        p_subject: subject,
        p_is_correct: isCorrect
      });

      if (error) {
        console.error('Error updating concept mastery:', error);
        return;
      }

      // Reload concept mastery data
      await loadConceptMastery();
    } catch (error) {
      console.error('Error in updateConceptMastery:', error);
    }
  };

  const getMasteryLevel = (level: number) => {
    if (level >= 0.8) return { label: 'Mastered', color: 'bg-green-500' };
    if (level >= 0.6) return { label: 'Proficient', color: 'bg-lime-500' };
    if (level >= 0.4) return { label: 'Developing', color: 'bg-yellow-500' };
    if (level >= 0.2) return { label: 'Emerging', color: 'bg-orange-500' };
    return { label: 'Beginning', color: 'bg-red-500' };
  };

  const getAccuracyRate = (concept: ConceptMastery) => {
    if (concept.total_attempts === 0) return 0;
    return Math.round((concept.correct_attempts / concept.total_attempts) * 100);
  };

  const getDaysSinceLastPractice = (lastPractice: string) => {
    const days = Math.floor((Date.now() - new Date(lastPractice).getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Brain className="w-6 h-6 text-lime-400 animate-pulse mr-2" />
            <span className="text-white">Loading concept mastery...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (concepts.length === 0) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Brain className="w-5 h-5 text-lime-400" />
            <span>Concept Mastery</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-center">
            Start practicing to track your concept mastery progress!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Brain className="w-5 h-5 text-lime-400" />
          <span>Concept Mastery Tracking</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {concepts.map((concept) => {
          const masteryInfo = getMasteryLevel(concept.mastery_level);
          const accuracyRate = getAccuracyRate(concept);
          const daysSinceLastPractice = getDaysSinceLastPractice(concept.last_practice);
          
          return (
            <Card key={concept.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-medium capitalize">
                    {concept.concept_name.replace(/_/g, ' ')}
                  </h3>
                  <Badge className={masteryInfo.color}>
                    {masteryInfo.label}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Mastery Level</span>
                      <span className="text-white">{Math.round(concept.mastery_level * 100)}%</span>
                    </div>
                    <Progress 
                      value={concept.mastery_level * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <TrendingUp className="w-4 h-4 text-lime-400" />
                      </div>
                      <div className="text-white font-medium">{accuracyRate}%</div>
                      <div className="text-gray-400 text-xs">Accuracy</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Target className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="text-white font-medium">{concept.practice_count}</div>
                      <div className="text-gray-400 text-xs">Sessions</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Clock className="w-4 h-4 text-yellow-400" />
                      </div>
                      <div className="text-white font-medium">{daysSinceLastPractice}</div>
                      <div className="text-gray-400 text-xs">Days ago</div>
                    </div>
                  </div>
                  
                  {daysSinceLastPractice > 7 && (
                    <div className="bg-yellow-900/30 border border-yellow-700 rounded p-2">
                      <p className="text-yellow-200 text-xs">
                        ⚠️ Consider reviewing this concept - it's been {daysSinceLastPractice} days since last practice
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default ConceptMasteryTracker;
