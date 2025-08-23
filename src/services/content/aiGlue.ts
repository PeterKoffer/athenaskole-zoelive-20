import { invokeFn } from '@/supabase/functionsClient';
import type { AdaptiveContentRes } from '@/types/api';

// AI content generation and pack building
type BuildFromPackArgs = {
  pack: any;
  minutes: number;
  gradeBand: string;
  country: string;
  ai: boolean | { embellishments: number };
};

type LessonStructure = {
  activities: any[];
  hero?: {
    subject: string;
    gradeBand: string;
    minutes: number;
    title: string;
    subtitle?: string;
    packId: string;
  };
};

export async function buildFromPack(args: BuildFromPackArgs): Promise<LessonStructure> {
  console.log("Building lesson from pack:", args);
  
  if (args.ai === false) {
    // Pure offline mode - generate structured activities without AI
    return generateOfflineActivities(args);
  } else if (args.ai === true) {
    // Pure AI mode - use pack as brief for AI generation
    return generateAIActivities(args);
  } else {
    // Hybrid mode with limited AI embellishments
    return generateHybridActivities(args);
  }
}

async function generateOfflineActivities(args: BuildFromPackArgs): Promise<LessonStructure> {
  const { pack, minutes } = args;
  
  // Generate structured offline activities based on the pack
  const baseActivities = [
    {
      type: "introduction",
      title: `Welcome to ${pack.title}`,
      content: pack.description,
      duration: 10,
      interactive: false
    },
    {
      type: "exploration",
      title: "Hands-on Discovery",
      content: `Explore ${pack.subject} concepts through guided activities and experiments.`,
      duration: Math.floor(minutes * 0.4),
      interactive: true
    },
    {
      type: "practice",
      title: "Apply Your Knowledge", 
      content: `Practice ${pack.subject} skills with engaging exercises and challenges.`,
      duration: Math.floor(minutes * 0.3),
      interactive: true
    },
    {
      type: "reflection",
      title: "Reflect and Connect",
      content: "Think about what you've learned and how it connects to your world.",
      duration: Math.floor(minutes * 0.2),
      interactive: false
    }
  ];
  
  return { activities: baseActivities };
}

async function generateAIActivities(args: BuildFromPackArgs): Promise<LessonStructure> {
  const { pack } = args;
  
  try {
    // Use the existing AI content generation
    const data = await invokeFn<AdaptiveContentRes>('generate-adaptive-content', {
      type: 'lesson-activity',
      subject: pack.subject,
      skillArea: 'general',
      gradeLevel: pack.gradeLevel || 6,
      difficultyLevel: pack.gradeLevel || 6,
      prompt: `Create an engaging ${pack.subject} lesson based on: ${pack.description}. Title: ${pack.title}. Make it interactive and age-appropriate.`
    });

    // Transform AI response into structured activities
    if (data?.content) {
      return {
        activities: [
          {
            type: "ai-generated",
            title: pack.title,
            content: data.content,
            aiGenerated: true,
            source: "openai"
          }
        ]
      };
    }
  } catch (error) {
    console.error("AI generation error:", error);
  }
  
  // Fallback to offline if AI fails
  return generateOfflineActivities(args);
}

async function generateHybridActivities(args: BuildFromPackArgs): Promise<LessonStructure> {
  const { pack } = args;
  const embellishmentCount = (args.ai as any)?.embellishments || 2;
  
  // Start with offline base
  const baseLesson = await generateOfflineActivities(args);
  
  try {
    // Add AI embellishments
    const data = await invokeFn<AdaptiveContentRes>('generate-adaptive-content', {
      type: 'lesson-activity',
      subject: pack.subject,
      skillArea: 'general', 
      gradeLevel: pack.gradeLevel || 6,
      difficultyLevel: pack.gradeLevel || 6,
      prompt: `Create ${embellishmentCount} short, engaging activities to enhance a ${pack.subject} lesson about: ${pack.description}`
    });

    if (data?.content) {
      baseLesson.activities.push({
        type: "ai-embellishment",
        title: "AI-Enhanced Activity",
        content: data.content,
        aiGenerated: true,
        hybrid: true
      });
    }
  } catch (error) {
    console.error("AI embellishment failed:", error);
  }
  
  return baseLesson;
}