// Training Ground AI Integration Hook
import { useState, useEffect } from 'react';
import { buildTrainingGroundPrompt } from './content/trainingGroundPromptBuilder';
import { supabase } from '@/integrations/supabase/client';

interface TrainingGroundActivity {
  title: string;
  objective: string;
  explanation: string;
  activity: {
    type: string;
    instructions: string;
  };
  optionalExtension: string;
  studentSkillTargeted: string;
  learningStyleAdaptation: string;
}

interface UseTrainingGroundContentProps {
  subject: string;
  enabled?: boolean;
}

export function useTrainingGroundContent({ subject, enabled = true }: UseTrainingGroundContentProps) {
  const [activity, setActivity] = useState<TrainingGroundActivity | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateActivity = async () => {
    if (!enabled || !subject) return;

    setLoading(true);
    setError(null);

    try {
      // Build dynamic prompt using real app data
      const prompt = buildTrainingGroundPrompt({
        subject,
        // TODO: Replace with actual data fetchers
        studentProfile: {
          id: 'student-123',
          gradeStep: 5,
          performanceLevel: 'on-track',
          learningStyle: 'visual',
          interests: ['animals', 'space'],
          classId: 'class-456'
        },
        teacherSettings: {
          classId: 'class-456',
          subjectWeights: { [subject]: 8 }
        },
        schoolSettings: {
          schoolId: 'school-789',
          teachingPerspective: 'hands-on, creative learning'
        }
      });

      // Call AI service with the generated prompt using Supabase client
      console.log('🚀 Sending Training Ground prompt to AI:', prompt);
      
      // 🎯 FORCE Training Ground mode with explicit parameters
      const { data, error } = await supabase.functions.invoke('generate-adaptive-content', {
        body: {
          subject,
          skillArea: 'training_ground',  // This triggers TG mode
          activityType: 'training-ground', // This triggers TG mode  
          customPrompt: prompt,
          responseFormat: 'training_ground_activity',
          gradeLevel: 5,
          type: 'training_ground_activity'
        }
      });

      console.log('📨 Training Ground AI response:', { data, error });

      if (error) {
        throw new Error(`AI service error: ${error.message}`);
      }

      if (!data?.success) {
        throw new Error(data?.error || 'AI generation failed');
      }

      // Parse the Training Ground specific response
      const activityData = data.trainingGroundActivity || data.generatedContent;
      console.log('🎯 Parsed Training Ground activity:', activityData);
      
      if (activityData) {
        setActivity(activityData);
      } else {
        throw new Error('No Training Ground activity generated');
      }

    } catch (err) {
      console.error('Training Ground generation error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      
      // Fallback activity
      setActivity({
        title: `${subject.charAt(0).toUpperCase() + subject.slice(1)} Adventure`,
        objective: `Practice key ${subject} skills`,
        explanation: `Let's explore ${subject} with a fun activity!`,
        activity: {
          type: 'Interactive Challenge',
          instructions: `Complete the ${subject} challenge at your own pace.`
        },
        optionalExtension: 'Try creating your own version!',
        studentSkillTargeted: `Core ${subject} skills`,
        learningStyleAdaptation: 'Visual and interactive elements'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (enabled && subject) {
      generateActivity();
    }
  }, [subject, enabled]);

  return {
    activity,
    loading,
    error,
    regenerate: generateActivity
  };
}