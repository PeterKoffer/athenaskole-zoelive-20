import { useState } from 'react';
import { ActivityRenderer } from './activities/ActivityRenderer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';


export function TrainingGroundPreview() {
  const [activity, setActivity] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateActivity = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-adaptive-content', {
        body: {
          activityType: 'training-ground',
          subject: 'mathematics',
          gradeLevel: 5,
          performanceLevel: 'average',
          learningStyle: 'kinesthetic',
          interests: ['space', 'dinosaurs', 'building'],
          schoolPhilosophy: 'Experiential & creative learning',
          emphasis: 7,
          calendarKeywords: ['winter', 'exploration']
        }
      });

      if (error) {
        throw error;
      }

      if (data?.success && data?.trainingGroundActivity) {
        setActivity(data.trainingGroundActivity);
      } else {
        throw new Error('Failed to generate activity');
      }
    } catch (err) {
      console.error('Error generating activity:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const mockedAIResponse = {
    title: 'Dinosaur Habitat Designer',
    objective: 'Design a habitat for a specific dinosaur, considering its needs.',
    explanation: 'This activity helps you understand animal habitats by designing one for a dinosaur. You\'ll think about what dinosaurs needed to survive, like food, water, and shelter, and use your creativity to build a model or draw a picture of the habitat.',
    activity: {
      type: 'Art Challenge',
      instructions: '1. Choose a dinosaur (e.g., T-Rex, Stegosaurus, Triceratops).\n2. Research its diet, size, and where it lived.\n3. Gather materials like a shoebox, construction paper, clay, and small plants.\n4. Build a diorama of the habitat, including food and water sources, and a place for the dinosaur to rest.',
    },
    optionalExtension: 'Write a short story about a day in the life of your dinosaur in its new habitat.',
    studentSkillTargeted: 'Research and creative expression',
    learningStyleAdaptation: 'This is a hands-on activity that allows for creative expression and physical construction, perfect for a kinesthetic learner.',
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Training Ground Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Test the new AI-powered Training Ground with creative, engaging activities.
              </p>
              
              <div className="flex gap-4">
                <Button 
                  onClick={generateActivity}
                  disabled={loading}
                  className="bg-primary hover:bg-primary/90"
                >
                  {loading ? 'Generating...' : 'Generate New Activity'}
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => setActivity(mockedAIResponse)}
                >
                  Show Mock Activity
                </Button>
              </div>

              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-destructive">Error: {error}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {activity && (
          <ActivityRenderer
            activity={activity}
            onComplete={() => console.log('Activity completed!')}
            onRegenerate={generateActivity}
          />
        )}
      </div>
    </div>
  );
}
