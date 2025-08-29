
import { supabase } from '@/lib/supabaseClient';
import { GeneratedContent, AdaptiveContentRecord } from '../types/contentTypes';
import type { ContentAtom } from '@/types/content';

export class ContentRepository {
  async getExistingContent(subject: string, skillArea: string, difficultyLevel: number): Promise<any> {
    const { data: existingContent, error: fetchError } = await supabase
      .from('adaptive_content')
      .select('*')
      .eq('subject', subject)
      .eq('skill_area', skillArea)
      .eq('difficulty_level', difficultyLevel)
      .limit(1);

    if (fetchError) {
      console.error('❌ Error fetching existing content:', fetchError);
      return null;
    }

    return existingContent && existingContent.length > 0 ? existingContent[0] : null;
  }

  async saveGeneratedContent(
    subject: string,
    skillArea: string,
    difficultyLevel: number,
    generatedContent: GeneratedContent
  ): Promise<any> {
    const { data: savedContent, error: saveError } = await supabase
      .from('adaptive_content')
      .insert({
        subject,
        skill_area: skillArea,
        difficulty_level: difficultyLevel,
        title: generatedContent.question,
        content: generatedContent as any,
        content_type: 'question',
        learning_objectives: generatedContent.learningObjectives,
        estimated_time: generatedContent.estimatedTime
      })
      .select()
      .single();

    if (saveError) {
      console.error('❌ Error saving generated content:', saveError);
      return {
        subject,
        skill_area: skillArea,
        difficulty_level: difficultyLevel,
        title: generatedContent.question,
        content: generatedContent,
        content_type: 'question',
        learning_objectives: generatedContent.learningObjectives,
        estimated_time: generatedContent.estimatedTime
      };
    }

    return savedContent;
  }

  async saveFallbackContent(fallbackContent: AdaptiveContentRecord): Promise<any> {
    try {
      const contentWithType = {
        ...fallbackContent,
        content_type: 'question'
      };

      const { data: savedFallback } = await supabase
        .from('adaptive_content')
        .insert(contentWithType)
        .select()
        .single();
      
      return savedFallback || contentWithType;
    } catch (saveError) {
      console.error('❌ Error saving fallback content:', saveError);
      return {
        ...fallbackContent,
        content_type: 'question'
      };
    }
  }

  async getAtomsByKcId(_kcId: string): Promise<ContentAtom[]> {
    console.log('⚠️ ContentRepository.getAtomsByKcId called - now using AI generation instead');
    
    // This method is now legacy - AI generation handles content creation
    // Return empty array to trigger AI generation path
    return [];
  }
}

export const contentRepository = new ContentRepository();
