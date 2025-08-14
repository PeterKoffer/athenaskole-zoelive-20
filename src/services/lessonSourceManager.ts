// Service to manage lesson source priority and image handling
import { supabase } from '@/integrations/supabase/client';
import { buildDailyLesson } from '@/services/lesson/buildDailyLesson';
import { UniverseImageGeneratorService } from '@/services/UniverseImageGenerator';
import { UniversePacks, Prime100 } from '@/content/universe.catalog';
import { UniversePack, CanonicalSubject } from '@/content/types';

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
   * Generate AI lesson with proper image handling (last resort)
   */
  private static async generateAILesson(userId: string, date: string) {
    const grade = 6; // TODO: Get from user profile
    const gradeBand = grade <= 2 ? "K-2" : grade <= 5 ? "3-5" : grade <= 8 ? "6-8" : grade <= 10 ? "9-10" : "11-12";
    
    const lesson = await buildDailyLesson({
      userId,
      gradeBand,
      minutes: 150,
      dateISO: date,
    });

    // Ensure proper hero data
    const hero = lesson?.hero ?? {
      subject: lesson?.__fallback?.subject ?? "Cross-curricular",
      gradeBand,
      minutes: 150,
      title: lesson?.title ?? "Today's AI-Generated Universe",
      subtitle: lesson?.subtitle ?? lesson?.description ?? "An AI-crafted learning adventure",
      packId: lesson?.__packId ?? null
    };

    const finalLesson = { ...lesson, hero };

    // Handle image generation/retrieval
    let imageUrl = null;
    if (lesson?.meta?.imagePrompt || hero.title) {
      try {
        const prompt = lesson?.meta?.imagePrompt ?? `${hero.title} — ${hero.subject} for ${gradeBand}`;
        const img = await UniverseImageGeneratorService.getOrCreate({ 
          prompt, 
          packId: lesson.__packId 
        });
        imageUrl = img?.url;
      } catch (error) {
        console.warn('Image generation failed:', error);
        // Fallback to subject-based stock image
        imageUrl = this.getSubjectFallbackImage(hero.subject);
      }
    }

    return { lesson: finalLesson, imageUrl };
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