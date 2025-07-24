// Training Ground AI Integration Hook
import { useState, useEffect } from 'react';
import { buildTrainingGroundPrompt } from './content/trainingGroundPromptBuilder';

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

      // Call AI service with the generated prompt
      const response = await fetch('/api/functions/v1/generate-adaptive-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          skillArea: 'training_ground',
          customPrompt: prompt,
          responseFormat: 'training_ground_activity'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate training content');
      }

      const data = await response.json();
      
      // Parse the AI response
      if (data.generatedText) {
        try {
          const parsed = JSON.parse(data.generatedText);
          setActivity(parsed);
        } catch (parseError) {
          console.error('Failed to parse AI response:', parseError);
          setError('Failed to parse activity content');
        }
      } else {
        throw new Error('No content generated');
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