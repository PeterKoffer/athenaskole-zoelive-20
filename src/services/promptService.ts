// Single source of truth for all AI prompts
import { supabase } from '@/lib/supabaseClient';

export interface PromptRecord {
  id: string;
  name: string;
  prompt_text: string;
  version: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export class PromptService {
  /**
   * Get the current active prompt by name
   */
  static async getPrompt(name: string): Promise<string> {
    const { data, error } = await supabase
      .from('prompts')
      .select('prompt_text')
      .eq('name', name)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error(`Error fetching prompt "${name}":`, error);
      throw new Error(`Prompt not found: ${name}`);
    }

    return data.prompt_text;
  }

  /**
   * Update a prompt and increment version
   */
  static async updatePrompt(name: string, promptText: string): Promise<void> {
    // Get current version
    const { data: current } = await supabase
      .from('prompts')
      .select('version')
      .eq('name', name)
      .single();

    const newVersion = (current?.version || 0) + 1;

    const { error } = await supabase
      .from('prompts')
      .update({
        prompt_text: promptText,
        version: newVersion,
        updated_at: new Date().toISOString()
      })
      .eq('name', name);

    if (error) {
      throw new Error(`Failed to update prompt: ${error.message}`);
    }
  }

  /**
   * Get all prompts for admin management
   */
  static async getAllPrompts(): Promise<PromptRecord[]> {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .order('name');

    if (error) {
      throw new Error(`Failed to fetch prompts: ${error.message}`);
    }

    return data || [];
  }
}