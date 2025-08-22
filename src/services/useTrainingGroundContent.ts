// Training Ground AI Integration Hook
import { useState, useEffect } from 'react';
import { buildTrainingGroundPrompt } from './content/trainingGroundPromptBuilder';
import { invokeFn } from '@/supabase/functionsClient';
import { useAuth } from '@/hooks/useAuth';

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
  const { user, loading: authLoading } = useAuth();
  const [activity, setActivity] = useState<TrainingGroundActivity | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateActivity = async () => {
    if (!enabled || !subject) return;
    
    // Guard for auth
    if (authLoading || !user) {
      console.warn('Auth not ready, skipping Training Ground generation');
      setError('Please sign in to generate Training Ground content');
      return;
    }

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

      // Call AI service with the generated prompt
      console.log('🚀 Sending Training Ground prompt to AI:', prompt);
      
      // 🎯 FORCE Training Ground mode with explicit parameters
      const data = await invokeFn<any>('generate-adaptive-content', {
        type: 'training_ground',
        subject,
        gradeLevel: 5,
        studentInterests: ['animals', 'space'],
        timeBudgetMinutes: 25,
        numActivities: 7,
        skillArea: 'training_ground'
      });

      console.log('📨 Training Ground AI response:', data);

      if (data) {
        // Parse the Training Ground specific response
        const activityData = data.trainingGroundActivity || data.generatedContent || data;
        console.log('🎯 Parsed Training Ground activity:', activityData);
        
        if (activityData) {
          setActivity(activityData);
        } else {
          throw new Error('No Training Ground activity generated');
        }
      } else {
        throw new Error('No data received from AI service');
      }

    } catch (err: any) {
      console.error('Training Ground generation error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      
      // Don't retry on 400 errors (client issues)
      if (err?.status === 400) {
        console.warn('Client error - not retrying');
        return;
      }
      
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