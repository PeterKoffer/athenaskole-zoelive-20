
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserMetadata } from '@/types/auth'; // Import UserMetadata
import { commonStandardsAPI } from '@/services/commonStandardsAPI';
import { CommonStandard } from '@/types/gradeStandards';
import { resolveLearnerGrade } from '@/lib/grade';

export interface GradeContentConfig {
  userGrade: number;
  subject: string;
  appropriateStandards: CommonStandard[];
  skillAreas: string[];
  difficultyRange: [number, number];
  prerequisites: CommonStandard[];
}

export const useGradeLevelContent = (subject: string) => {
  const { user } = useAuth();
  const [gradeConfig, setGradeConfig] = useState<GradeContentConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && subject) {
      loadGradeConfiguration();
    }
  }, [user, subject]);

  const loadGradeConfiguration = async () => {
    try {
      setLoading(true);
      
      // Get user's grade level (defaulting to grade 1 if not set)
      const userGrade = getUserGradeLevel();
      
      // Get appropriate standards for the user's grade - await the promises
      const appropriateStandards = await commonStandardsAPI.getStandardsByGradeAndSubject(userGrade, subject);
      
      // Get skill areas for this grade and subject - await the promise
      const skillAreas = await commonStandardsAPI.getSkillAreasForGradeAndSubject(userGrade, subject);
      
      // Get difficulty range appropriate for this grade
      const difficultyRange = commonStandardsAPI.getDifficultyRangeForGrade(userGrade);
      
      // Get prerequisite standards from previous grades - await the promise
      const prerequisites = await commonStandardsAPI.getPrerequisiteStandards(userGrade, subject);

      const config: GradeContentConfig = {
        userGrade,
        subject,
        appropriateStandards,
        skillAreas,
        difficultyRange,
        prerequisites
      };

      console.log('📚 Grade-level content configuration:', config);
      setGradeConfig(config);

    } catch (error) {
      console.error('❌ Error loading grade configuration:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserGradeLevel = (): number => {
    const metadata = user?.user_metadata as UserMetadata | undefined;
    return resolveLearnerGrade(metadata?.grade_level, metadata?.age);
  };

  const isContentAppropriate = (contentGrade: number, contentDifficulty: number): boolean => {
    if (!gradeConfig) return true;
    
    const [minDiff, maxDiff] = gradeConfig.difficultyRange;
    return contentGrade >= gradeConfig.userGrade - 1 && 
           contentGrade <= gradeConfig.userGrade + 1 &&
           contentDifficulty >= minDiff && 
           contentDifficulty <= maxDiff;
  };

  const getStandardForSkillArea = (skillArea: string): CommonStandard | undefined => {
    if (!gradeConfig) return undefined;
    
    return gradeConfig.appropriateStandards.find(standard => 
      standard.domain === skillArea || 
      standard.title.toLowerCase().includes(skillArea.toLowerCase())
    );
  };

  return {
    gradeConfig,
    loading,
    isContentAppropriate,
    getStandardForSkillArea,
    getUserGradeLevel: () => gradeConfig?.userGrade ?? 6
  };
};
