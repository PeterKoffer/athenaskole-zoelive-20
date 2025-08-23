import { supabase } from '@/integrations/supabase/client';
import { invokeFn } from '@/supabase/functionsClient';

export interface ContentRequest {
  universeId: string;
  title: string;
  grade: number;
  subject?: string;
  locale?: string;
}

export interface ContentResponse {
  summary: string;
  objectives: string[];
  activities: Array<{ 
    title: string; 
    steps: string[];
    duration?: number;
    type?: string;
  }>;
}

export interface UniverseContent {
  id?: string;
  universe_id: string;
  summary: string;
  objectives: string[];
  activities: any[];
  created_at?: string;
  updated_at?: string;
}

export async function ensureUniverseContent(req: ContentRequest): Promise<ContentResponse> {
  console.log('🧠 Generating universe content for:', req.title);
  
  // Check if content already exists
  const { data: existing } = await supabase
    .from('universe_content')
    .select('*')
    .eq('universe_id', req.universeId)
    .maybeSingle();

  if (existing) {
    console.log('✅ Using existing universe content');
    return {
      summary: existing.summary,
      objectives: existing.objectives,
      activities: existing.activities
    };
  }

  // Generate new content via OpenAI
  try {
    const prompt = `Create educational content for a learning universe about "${req.title}"${req.subject ? ` (${req.subject})` : ""} for grade ${req.grade} students.

Return JSON with:
- summary: Brief engaging description (2-3 sentences)
- objectives: Array of 3-4 learning objectives 
- activities: Array of 4-6 hands-on activities, each with title and steps array

Focus on interactive, age-appropriate content that encourages exploration and discovery.`;

    const data = await invokeFn<ContentResponse>('generate-adaptive-content', {
      systemPrompt: 'You are an expert educational content creator. Return only valid JSON.',
      userPrompt: prompt,
      model: 'gpt-4o-mini',
      temperature: 0.7
    });

    // Save to database
    const { error } = await supabase.from('universe_content').upsert({
      universe_id: req.universeId,
      summary: data.summary,
      objectives: data.objectives,
      activities: data.activities,
    });

    if (error) {
      console.warn('Failed to save universe content:', error);
    } else {
      console.log('✅ Universe content generated and saved');
    }

    return data;
  } catch (error) {
    console.error('Failed to generate universe content:', error);
    
    // Fallback content
    return {
      summary: `Explore the fascinating world of ${req.title}! This interactive learning experience is designed for grade ${req.grade} students.`,
      objectives: [
        `Understand key concepts related to ${req.title}`,
        'Develop critical thinking skills',
        'Apply knowledge through hands-on activities',
        'Build confidence in learning'
      ],
      activities: [
        {
          title: 'Introduction & Discovery',
          steps: [
            'Watch an engaging introduction video',
            'Explore interactive visual elements',
            'Discuss what you already know about the topic'
          ]
        },
        {
          title: 'Hands-On Exploration',
          steps: [
            'Complete interactive exercises',
            'Work with real-world examples',
            'Practice problem-solving skills'
          ]
        },
        {
          title: 'Creative Application',
          steps: [
            'Design your own project',
            'Share your discoveries',
            'Reflect on what you learned'
          ]
        }
      ]
    };
  }
}