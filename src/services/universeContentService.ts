import { supabase } from '@/integrations/supabase/client';
import { invokeFn } from '@/supabase/safeInvoke';

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

export async function ensureUniverseContent(req: ContentRequest): Promise<ContentResponse> {
  console.log('🧠 Generating universe content for:', req.title);
  
  // Check if content already exists in adaptive_content table
  const { data: existing } = await supabase
    .from('adaptive_content')
    .select('*')
    .eq('subject', req.subject || 'general')
    .eq('difficulty_level', Math.max(1, Math.min(5, req.grade - 2)))
    .eq('content_type', 'universe_content')
    .maybeSingle();

  if (existing?.content) {
    console.log('✅ Using existing universe content');
    const content = existing.content as any;
    return {
      summary: content.summary || `Explore the fascinating world of ${req.title}!`,
      objectives: content.objectives || [`Learn about ${req.title}`],
      activities: content.activities || []
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

    // Save to adaptive_content table
    const { error } = await supabase.from('adaptive_content').upsert({
      subject: req.subject || 'general',
      skill_area: 'universe_exploration',
      difficulty_level: Math.max(1, Math.min(5, req.grade - 2)),
      content_type: 'universe_content',
      title: req.title,
      content: data as any,
      learning_objectives: data.objectives
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