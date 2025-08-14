// Service to manage lesson source priority and image handling
import { supabase } from '@/integrations/supabase/client';
import { UniverseImageGeneratorService } from '@/services/UniverseImageGenerator';
import { UniversePacks, Prime100 } from '@/content/universe.catalog';
import { UniversePack, CanonicalSubject } from '@/content/types';
// import { PromptService } from '@/services/promptService'; // TODO: Enable when AI integration ready
import { validateLessonStructure, StructuredLesson } from '@/services/lessonSchema';

export interface LessonSource {
  type: 'planned' | 'teacher-choice' | 'universe-fallback' | 'ai-suggestion';
  lesson: any;
  imageUrl?: string;
  isFromTeacher?: boolean;
}

export class LessonSourceManager {
  
  /**
   * Get lesson for a specific date following priority order:
   * 1. Planned lessons from calendar (teacher-approved)
   * 2. Teacher-selected universe (teacher choice mode)
   * 3. Universe DB fallback (from your 200 curated universes)
   * 4. Generic AI suggestion (last resort only)
   */
  static async getLessonForDate(userId: string, date: string, userRole?: string): Promise<LessonSource> {
    
    // Priority 1: Check for planned lessons from calendar
    const plannedLesson = await this.getPlannedLesson(date, userRole);
    if (plannedLesson) {
      const lessonData = plannedLesson.lesson_data as any;
      return {
        type: 'planned',
        lesson: lessonData,
        imageUrl: lessonData?.hero?.imageUrl || undefined,
        isFromTeacher: true
      };
    }

    // Priority 2: Teacher choice mode (future implementation)
    // For now, skip to universe fallback

    // Priority 3: Universe DB fallback - select from your 200 curated universes
    const universeLesson = await this.generateUniverseLesson(userId, date);
    if (universeLesson) {
      return {
        type: 'universe-fallback',
        lesson: universeLesson.lesson,
        imageUrl: universeLesson.imageUrl || undefined,
        isFromTeacher: false
      };
    }

    // Priority 4: Last resort - generic AI (should rarely happen)
    const aiLesson = await this.generateAILesson(userId, date);
    return {
      type: 'ai-suggestion',
      lesson: aiLesson.lesson,
      imageUrl: aiLesson.imageUrl || undefined,
      isFromTeacher: false
    };
  }

  /**
   * Get planned lesson from calendar/lesson_plans table
   */
  private static async getPlannedLesson(date: string, userRole?: string) {
    try {
      let query = supabase
        .from('lesson_plans')
        .select('*')
        .eq('plan_date', date);

      // Students only see published lessons
      if (userRole !== 'teacher') {
        query = query.eq('status', 'published');
      }

      const { data } = await query.single();
      return data;
    } catch (error) {
      // No planned lesson found
      return null;
    }
  }

  /**
   * Generate lesson from curated universe database (200 universes)
   */
  private static async generateUniverseLesson(_userId: string, _date: string) {
    const grade = 6; // TODO: Get from user profile
    const gradeBand = grade <= 2 ? "K-2" : grade <= 5 ? "3-5" : grade <= 8 ? "6-8" : grade <= 10 ? "9-10" : "11-12";
    
    // Get user preferences (mock for now - replace with actual user profile)
    const userSubjectPreference = "Mathematics"; // TODO: Get from user profile
    
    // Select universe from our 200 curated universes
    const selectedUniverse = this.selectUniverseFromCatalog(userSubjectPreference, gradeBand);
    
    if (!selectedUniverse) {
      return null; // Will fall back to AI generation
    }

    // Create lesson from selected universe
    const lesson = {
      title: selectedUniverse.title,
      description: `Explore the world of ${selectedUniverse.title}`,
      subject: selectedUniverse.subjectHint,
      universe: selectedUniverse,
      hero: {
        title: selectedUniverse.title,
        subtitle: `A curated learning universe for ${gradeBand}`,
        subject: selectedUniverse.subjectHint,
        gradeBand,
        minutes: 150,
        packId: selectedUniverse.id
      },
      meta: {
        imagePrompt: selectedUniverse.imagePrompt
      },
      __packId: selectedUniverse.id
    };

    // Handle image generation/retrieval
    let imageUrl = null;
    try {
      const img = await UniverseImageGeneratorService.getOrCreate({ 
        prompt: selectedUniverse.imagePrompt, 
        packId: selectedUniverse.id 
      });
      imageUrl = img?.url;
    } catch (error) {
      console.warn('Image generation failed:', error);
      // Fallback to subject-based stock image
      imageUrl = this.getSubjectFallbackImage(selectedUniverse.subjectHint);
    }

    return { lesson, imageUrl };
  }

  /**
   * Select a universe from the catalog based on subject and grade preferences
   */
  private static selectUniverseFromCatalog(preferredSubject: CanonicalSubject, _gradeBand: string): UniversePack | null {
    // First try to match by subject
    const subjectMatches = Prime100.filter(universe => 
      universe.subjectHint === preferredSubject || 
      universe.crossSubjects?.includes(preferredSubject)
    );

    if (subjectMatches.length > 0) {
      // Random selection from subject matches
      return subjectMatches[Math.floor(Math.random() * subjectMatches.length)];
    }

    // Fallback to any universe from Prime100
    if (Prime100.length > 0) {
      return Prime100[Math.floor(Math.random() * Prime100.length)];
    }

    // Last resort: any universe from full catalog
    if (UniversePacks.length > 0) {
      return UniversePacks[Math.floor(Math.random() * UniversePacks.length)];
    }

    return null;
  }

  /**
   * Generate structured AI lesson using master prompt (last resort)
   */
  private static async generateAILesson(_userId: string, date: string) {
    try {
      // Get the master prompt from database  
      // const masterPrompt = await PromptService.getPrompt('daily_program');
      
      // Prepare context with Prime 100 universe catalog
      // const universeContext = Prime100.map(u => `${u.title} (${u.category})`).join(', ');
      const grade = 6; // TODO: Get from user profile
      const gradeBand = grade <= 2 ? "K-2" : grade <= 5 ? "3-5" : grade <= 8 ? "6-8" : grade <= 10 ? "9-10" : "11-12";
      
      // For now, create a structured lesson using the universe catalog
      // TODO: Use master prompt with actual AI service call like OpenAI
      console.log('Using master prompt for lesson generation (AI service integration pending)');

      // TODO: Replace with actual AI service call
      // For now, create a structured lesson that matches the schema
      const structuredLesson: StructuredLesson = {
        universeName: Prime100[Math.floor(Math.random() * Prime100.length)].title,
        universeCategory: "Science & Exploration",
        gradeRange: gradeBand,
        durationMinutes: 150,
        summary: "An engaging exploration of scientific concepts through hands-on activities and discovery.",
        imagePrompt: "Educational science laboratory scene with colorful experiments, students engaged in discovery, modern classroom setting, bright and inspiring atmosphere",
        hero: {
          title: "Science Discovery Lab",
          subtitle: "Explore, experiment, and discover the wonders of science",
          subject: "Science",
          gradeBand,
          minutes: 150
        },
        activities: [
          {
            id: "visual-hook-1",
            kind: "visual_hook",
            title: "Laboratory Setup Exploration",
            minutes: 20,
            description: "Students explore the virtual laboratory and identify scientific equipment.",
            props: ["virtual lab interface", "equipment cards", "safety goggles"],
            deliverables: ["equipment identification worksheet"],
            tags: ["science", "laboratory", "equipment"]
          },
          {
            id: "investigate-1", 
            kind: "investigate",
            title: "Hypothesis Formation",
            minutes: 30,
            description: "Students form hypotheses about their upcoming experiments.",
            props: ["observation sheets", "hypothesis templates"],
            deliverables: ["written hypothesis"],
            tags: ["scientific method", "hypothesis", "investigation"]
          },
          {
            id: "practice-1",
            kind: "practice",
            title: "Controlled Experiments",
            minutes: 60,
            description: "Students conduct hands-on experiments with proper controls.",
            props: ["experiment materials", "measurement tools", "data sheets"],
            deliverables: ["experiment results", "data tables"],
            tags: ["experimentation", "data collection", "scientific method"]
          },
          {
            id: "reflect-1",
            kind: "reflect",
            title: "Results Analysis",
            minutes: 40,
            description: "Students analyze their results and draw conclusions.",
            props: ["calculators", "graph paper", "analysis templates"],
            deliverables: ["results analysis", "conclusion statements"],
            tags: ["analysis", "conclusions", "reflection"]
          }
        ],
        ageVariants: {
          "K-2": "Use simple observations and basic sorting activities with lots of visual aids.",
          "3-5": "Include basic measurement and simple data recording with guided hypothesis formation.",
          "6-8": "Focus on controlled variables and detailed data analysis with scientific reasoning.",
          "9-10": "Incorporate advanced statistical analysis and complex experimental design.",
          "11-12": "Include peer review, advanced data interpretation, and connections to real-world research."
        }
      };

      // Validate the structure
      if (!validateLessonStructure(structuredLesson)) {
        throw new Error('Generated lesson does not match required schema');
      }

      // Handle image generation
      let imageUrl = null;
      try {
        const img = await UniverseImageGeneratorService.getOrCreate({ 
          prompt: structuredLesson.imagePrompt, 
          packId: `ai-${date}` 
        });
        imageUrl = img?.url;
      } catch (error) {
        console.warn('Image generation failed:', error);
        imageUrl = this.getSubjectFallbackImage(structuredLesson.hero.subject);
      }

      return { lesson: structuredLesson, imageUrl };
      
    } catch (error) {
      console.error('Structured AI lesson generation failed:', error);
      
      // Fallback to basic lesson structure
      const fallbackLesson = {
        title: "Learning Adventure",
        description: "An educational experience designed for today.",
        hero: {
          title: "Today's Learning Adventure", 
          subtitle: "Discover something new",
          subject: "Cross-curricular",
          gradeBand: "6-8",
          minutes: 150
        }
      };

      const imageUrl = this.getSubjectFallbackImage("default");
      return { lesson: fallbackLesson, imageUrl };
    }
  }

  /**
   * Get fallback image based on subject
   */
  private static getSubjectFallbackImage(subject: string): string {
    const subjectImages: Record<string, string> = {
      'Mathematics': '/placeholder.svg?height=400&width=600&text=Mathematics',
      'Science': '/placeholder.svg?height=400&width=600&text=Science',
      'English': '/placeholder.svg?height=400&width=600&text=English',
      'History': '/placeholder.svg?height=400&width=600&text=History',
      'Art': '/placeholder.svg?height=400&width=600&text=Art',
      'Physical Education': '/placeholder.svg?height=400&width=600&text=PE',
      'default': '/placeholder.svg?height=400&width=600&text=Learning'
    };
    
    return subjectImages[subject] || subjectImages.default;
  }

  /**
   * Save lesson to calendar/lesson_plans (for teacher approval)
   */
  static async saveLessonToPlan(userId: string, date: string, lesson: any, orgId: string, classId?: string) {
    try {
      const { error } = await supabase
        .from('lesson_plans')
        .insert({
          teacher_id: userId,
          org_id: orgId,
          class_id: classId,
          plan_date: date,
          lesson_data: lesson,
          status: 'draft'
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error saving lesson to plan:', error);
      return false;
    }
  }
}