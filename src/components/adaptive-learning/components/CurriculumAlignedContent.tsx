
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import CurriculumObjectivesList from './CurriculumObjectivesList';
import CurriculumLoadingState from './CurriculumLoadingState';

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

      const formattedObjectives: LearningObjective[] = data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        difficulty_level: item.difficulty_level,
        estimated_time_minutes: item.estimated_time_minutes || 0,
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

  if (loading) {
    return (
      <div className="space-y-4">
        <CurriculumLoadingState />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <CurriculumObjectivesList
        objectives={objectives}
        userProgress={userProgress}
        isAuthenticated={!!user}
        onObjectiveSelect={onObjectiveSelect}
      />
    </div>
  );
};

export default CurriculumAlignedContent;
