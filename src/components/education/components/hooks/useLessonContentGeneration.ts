
import { useState, useEffect } from 'react';
import { LessonActivity } from '../types/LessonTypes';
import { SubjectSpecificTemplates } from '../utils/subjectSpecificTemplates';
import { createWelcomeActivity } from '../utils/welcomeActivityGenerator';

interface UseLessonContentGenerationProps {
  subject: string;
  skillArea?: string;
  gradeLevel?: number;
}

export const useLessonContentGeneration = ({
  subject,
  skillArea = 'general',
  gradeLevel = 6
}: UseLessonContentGenerationProps) => {
  const [baseLessonActivities, setBaseLessonActivities] = useState<LessonActivity[]>([]);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    const generateEnhancedLesson = async () => {
      console.log(`🌟 Generating ENHANCED ${subject} lesson with perfect content mix...`);
      setIsGenerating(true);

      try {
        // Get subject-specific template with perfect mix of activities
        const templateActivities = SubjectSpecificTemplates.getTemplateForSubject(
          subject,
          skillArea,
          gradeLevel
        );

        console.log(`✅ Generated ${templateActivities.length} enhanced activities for ${subject}:`, 
          templateActivities.map(a => `${a.title} (${a.type})`));

        setBaseLessonActivities(templateActivities);
      } catch (error) {
        console.error('❌ Error generating enhanced lesson:', error);
        
        // Fallback to basic welcome activity
        const fallbackActivity = createWelcomeActivity(subject);
        setBaseLessonActivities([fallbackActivity]);
      } finally {
        setIsGenerating(false);
      }
    };

    if (subject) {
      generateEnhancedLesson();
    }
  }, [subject, skillArea, gradeLevel]);

  const regenerateLesson = () => {
    console.log(`🔄 Regenerating enhanced ${subject} lesson...`);
    setBaseLessonActivities([]);
    setIsGenerating(true);
    
    // Trigger regeneration
    setTimeout(() => {
      const templateActivities = SubjectSpecificTemplates.getTemplateForSubject(
        subject,
        skillArea,
        gradeLevel
      );
      
      setBaseLessonActivities(templateActivities);
      setIsGenerating(false);
    }, 1000);
  };

  return {
    baseLessonActivities,
    isGenerating,
    regenerateLesson,
    totalEstimatedTime: baseLessonActivities.reduce((total, activity) => total + activity.duration, 0)
  };
};
