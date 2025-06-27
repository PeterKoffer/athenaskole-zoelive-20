
import { supabase } from '@/integrations/supabase/client';
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
        learning_objectives: generatedContent.learningObjectives,
        estimated_time: generatedContent.estimatedTime
      };
    }

    return savedContent;
  }

  async saveFallbackContent(fallbackContent: AdaptiveContentRecord): Promise<any> {
    try {
      const { data: savedFallback } = await supabase
        .from('adaptive_content')
        .insert(fallbackContent)
        .select()
        .single();
      
      return savedFallback || fallbackContent;
    } catch (saveError) {
      console.error('❌ Error saving fallback content:', saveError);
      return fallbackContent;
    }
  }

  async getAtomsByKcId(kcId: string): Promise<ContentAtom[]> {
    const { data: atoms, error } = await supabase
      .from('content_atoms')
      .select('*')
      .contains('kc_ids', [kcId]);

    if (error) {
      console.error('❌ ContentRepository: Error fetching atoms:', error);
      throw error;
    }
    
    // Transform the data to match ContentAtom interface with proper field mapping
    const transformedAtoms: ContentAtom[] = (atoms || []).map(atom => ({
      atom_id: atom.id, // Map 'id' to 'atom_id'
      atom_type: atom.atom_type as 'TEXT_EXPLANATION' | 'QUESTION_MULTIPLE_CHOICE' | 'INTERACTIVE_EXERCISE',
      content: atom.content,
      kc_ids: atom.kc_ids || [], // Ensure it's always an array
      metadata: atom.metadata,
      version: atom.version,
      author_id: atom.author_id,
      created_at: atom.created_at,
      updated_at: atom.updated_at
    }));

    return transformedAtoms;
  }
}

export const contentRepository = new ContentRepository();
