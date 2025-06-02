
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Book, Target, Clock, Award } from 'lucide-react';

interface CurriculumStandard {
  id: string;
  code: string;
  name: string;
  description: string;
  grade_level: number;
  subject: string;
}

interface LearningObjective {
  id: string;
  title: string;
  description: string;
  difficulty_level: number;
  estimated_time_minutes: number;
  curriculum_standard: CurriculumStandard;
}

interface CurriculumAlignedContentProps {
  subject: string;
  onObjectiveSelect: (objective: LearningObjective) => void;
}

const CurriculumAlignedContent = ({ subject, onObjectiveSelect }: CurriculumAlignedContentProps) => {
  const { user } = useAuth();
  const [objectives, setObjectives] = useState<LearningObjective[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCurriculumContent();
    if (user) {
      loadUserProgress();
    }
  }, [subject, user]);

  const loadCurriculumContent = async () => {
    try {
      const { data, error } = await supabase
        .from('learning_objectives')
        .select(`
          id,
          title,
          description,
          difficulty_level,
          estimated_time_minutes,
          curriculum_standards!inner(
            id,
            code,
            name,
            description,
            grade_level,
            subject
          )
        `)
        .eq('curriculum_standards.subject', subject)
        .order('curriculum_standards.grade_level')
        .order('difficulty_level');

      if (error) {
        console.error('Error loading curriculum content:', error);
        return;
      }

      const formattedObjectives = data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        difficulty_level: item.difficulty_level,
        estimated_time_minutes: item.estimated_time_minutes,
        curriculum_standard: Array.isArray(item.curriculum_standards) 
          ? item.curriculum_standards[0] 
          : item.curriculum_standards
      }));

      setObjectives(formattedObjectives);
    } catch (error) {
      console.error('Error in loadCurriculumContent:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProgress = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('concept_mastery')
        .select('concept_name, mastery_level')
        .eq('user_id', user.id)
        .eq('subject', subject);

      if (error) {
        console.error('Error loading user progress:', error);
        return;
      }

      const progressMap = data.reduce((acc, item) => {
        acc[item.concept_name] = item.mastery_level * 100;
        return acc;
      }, {} as Record<string, number>);

      setUserProgress(progressMap);
    } catch (error) {
      console.error('Error in loadUserProgress:', error);
    }
  };

  const getDifficultyColor = (level: number) => {
    if (level <= 3) return 'bg-green-500';
    if (level <= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getProgressForObjective = (objective: LearningObjective) => {
    return userProgress[objective.title] || 0;
  };

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Book className="w-6 h-6 text-lime-400 animate-pulse mr-2" />
            <span className="text-white">Loading curriculum content...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Book className="w-5 h-5 text-lime-400" />
            <span>Standards-Aligned Learning Objectives</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {objectives.map((objective) => {
            const progress = getProgressForObjective(objective);
            const isCompleted = progress >= 80;
            
            return (
              <Card 
                key={objective.id} 
                className={`bg-gray-800 border-gray-700 cursor-pointer transition-all hover:border-lime-400 ${isCompleted ? 'border-green-500' : ''}`}
                onClick={() => onObjectiveSelect(objective)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-white font-medium">{objective.title}</h3>
                        {isCompleted && <Award className="w-4 h-4 text-green-400" />}
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{objective.description}</p>
                      <Badge variant="outline" className="text-xs">
                        {objective.curriculum_standard.code}
                      </Badge>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className={getDifficultyColor(objective.difficulty_level)}>
                        Level {objective.difficulty_level}
                      </Badge>
                      <div className="flex items-center text-gray-400 text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {objective.estimated_time_minutes}min
                      </div>
                    </div>
                  </div>
                  
                  {user && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Mastery Progress</span>
                        <span className="text-white">{Math.round(progress)}%</span>
                      </div>
                      <Progress 
                        value={progress} 
                        className="h-2"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
                    <span className="text-gray-400 text-xs">
                      Grade {objective.curriculum_standard.grade_level}
                    </span>
                    <Target className="w-4 h-4 text-lime-400" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default CurriculumAlignedContent;
