import { supabase } from '@/integrations/supabase/client';
import { AgeGroup, gradeToAgeGroup } from '@/lib/imageProfiles';

export class AdventureImageService {
  
  /**
   * Archive old generic images and reset generation flags
   */
  static async archiveOldImages(): Promise<{
    archivedImages: number;
    archiveFolder: string;
    message: string;
  }> {
    const { data, error } = await supabase.functions.invoke('archive-old-images');

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Regenerate ALL adventure images with new cinematic system
   */
  static async regenerateAllImages(options: {
    batchSize?: number;
    ageGroups?: AgeGroup[];
    forceRegenerate?: boolean;
  } = {}): Promise<{
    processed: number;
    successful: number;
    failed: number;
    ageGroups: AgeGroup[];
  }> {
    // First archive old images if requested
    if (options.forceRegenerate) {
      console.log('Archiving old images before regeneration...');
      await this.archiveOldImages();
    }

    // Then generate new ones
    return this.generateAgeImages({
      batchSize: options.batchSize || 10,
      ageGroups: options.ageGroups || ['child', 'teen', 'adult']
    });
  }
  
  /**
   * Import adventures from JSON data
   */
  static async importAdventures(adventures: any[]): Promise<{
    imported: number;
    skipped: number;
    errors: number;
    total: number;
  }> {
    const { data, error } = await supabase.functions.invoke('import-adventures', {
      body: { adventures }
    });

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Generate age-appropriate images for adventures in batches
   */
  static async generateAgeImages(options: {
    batchSize?: number;
    ageGroups?: AgeGroup[];
  } = {}): Promise<{
    processed: number;
    successful: number;
    failed: number;
    ageGroups: AgeGroup[];
  }> {
    const { data, error } = await supabase.functions.invoke('batch-generate-age-images', {
      body: {
        batchSize: options.batchSize || 5,
        ageGroups: options.ageGroups || ['child', 'teen', 'adult']
      }
    });

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Get adventures with generation status
   */
  static async getAdventuresStatus(): Promise<{
    total: number;
    childGenerated: number;
    teenGenerated: number;
    adultGenerated: number;
  }> {
    const { data: total } = await supabase
      .from('adventures')
      .select('id', { count: 'exact', head: true });

    const { data: childGenerated } = await supabase
      .from('adventures')
      .select('id', { count: 'exact', head: true })
      .eq('image_generated_child', true);

    const { data: teenGenerated } = await supabase
      .from('adventures')
      .select('id', { count: 'exact', head: true })
      .eq('image_generated_teen', true);

    const { data: adultGenerated } = await supabase
      .from('adventures')
      .select('id', { count: 'exact', head: true })
      .eq('image_generated_adult', true);

    return {
      total: total?.length || 0,
      childGenerated: childGenerated?.length || 0,
      teenGenerated: teenGenerated?.length || 0,
      adultGenerated: adultGenerated?.length || 0,
    };
  }

  /**
   * Get appropriate image URL for a user's grade
   */
  static getImageForGrade(adventure: any, grade: number): string | null {
    const ageGroup = gradeToAgeGroup(grade);
    
    switch (ageGroup) {
      case 'child':
        return adventure.image_url_child;
      case 'teen':
        return adventure.image_url_teen;
      case 'adult':
        return adventure.image_url_adult;
      default:
        return adventure.image_url_teen; // fallback
    }
  }

  /**
   * Get all adventures
   */
  static async getAllAdventures() {
    const { data, error } = await supabase
      .from('adventures')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  }
}