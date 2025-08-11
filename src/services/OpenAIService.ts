
import { supabase } from '@/integrations/supabase/client';
import { Universe } from './UniverseGenerator';

export const openAIService = {
  async generateUniverse(prompt: string, _signal?: AbortSignal): Promise<Universe> {
    console.log('🤖 OpenAI Service: Generating universe via Supabase Edge Function');
    console.log('📋 Prompt:', typeof prompt === 'string' ? prompt.substring(0, 100) + '...' : prompt);
    
    try {
      const requestData = {
        prompt: typeof prompt === 'string' ? prompt : JSON.stringify(prompt),
        type: 'universe_generation'
      };

      console.log('📞 Calling generate-adaptive-content edge function for universe generation');
      
      const { data, error } = await supabase.functions.invoke('generate-adaptive-content', {
        body: requestData
      });

      console.log('📨 Edge function response:', { data, error });

      if (error) {
        console.error('❌ Edge function error:', error);
        throw new Error(`Edge function error: ${error.message}`);
      }

      if (!data || !data.success) {
        console.error('❌ Edge function returned error:', data?.error);
        // Instead of throwing, return a fallback universe
        return this.createFallbackUniverse(prompt);
      }

      // If we have generated content, try to parse it as a universe
      if (data.generatedContent) {
        console.log('✅ Successfully received generated content');
        
        // Convert the complex objects to simple strings for compatibility
        const characters = Array.isArray(data.generatedContent.characters) 
          ? data.generatedContent.characters.map((char: any) => 
              typeof char === 'string' ? char : `${char.name || 'Character'} - ${char.description || char.role || 'A helpful character'}`
            )
          : [
              "The Learning Guide - Your helpful companion",
              "Curious Explorer - A fellow student",
              "Wisdom Keeper - Provides hints and encouragement"
            ];

        const locations = Array.isArray(data.generatedContent.locations) 
          ? data.generatedContent.locations.map((loc: any) => 
              typeof loc === 'string' ? loc : `${loc.name || 'Location'} - ${loc.description || 'An interesting place to explore'}`
            )
          : [
              "Discovery Hall - Where new concepts are introduced",
              "Practice Grounds - Where skills are developed", 
              "Achievement Center - Where progress is celebrated"
            ];

        const activities = Array.isArray(data.generatedContent.activities) 
          ? data.generatedContent.activities.map((act: any) => 
              typeof act === 'string' ? act : `${act.name || 'Activity'} - ${act.description || 'An engaging learning experience'}`
            )
          : [
              "Interactive lessons and guided exploration",
              "Hands-on practice with immediate feedback",
              "Creative challenges and problem-solving",
              "Collaborative learning experiences"
            ];

        const universe: Universe = {
          id: `universe-${Date.now()}`,
          title: data.generatedContent.title || 'Generated Learning Universe',
          description: data.generatedContent.description || 'An exciting learning adventure awaits!',
          theme: typeof prompt === 'string' ? prompt : 'Learning Adventure',
          image: data.generatedContent.image || '/lovable-uploads/07757147-84dc-4515-8288-c8150519c3bf.png',
          characters,
          locations,
          activities
        };

        console.log('✅ Successfully created universe:', universe.title);
        return universe;
      }

      // Fallback if no content was generated
      return this.createFallbackUniverse(prompt);

    } catch (error: any) {
      console.error('❌ Universe generation failed:', error);
      
      if (error.name === 'AbortError') {
        console.log('🛑 Request was aborted');
        throw error;
      }
      
      // Return fallback instead of throwing
      console.log('🔄 Returning fallback universe due to error');
      return this.createFallbackUniverse(prompt);
    }
  },

  createFallbackUniverse(prompt: string | any): Universe {
    const themeText = typeof prompt === 'string' ? prompt : 'learning adventure';

    return {
      id: `fallback-universe-${Date.now()}`,
      title: `Learning Universe: ${themeText}`,
      description: `An educational journey exploring ${themeText} through interactive experiences and discovery.`,
      theme: themeText,
      image: '/lovable-uploads/07757147-84dc-4515-8288-c8150519c3bf.png',
      characters: [
        "Professor Explorer - Your knowledgeable guide",
        "Curious Sam - A fellow learner on the journey",
        "Wise Owl - Provides helpful hints and tips"
      ],
      locations: [
        "The Discovery Library - Where knowledge begins",
        "Practice Plaza - Where skills are honed",
        "Achievement Academy - Where progress is celebrated"
      ],
      activities: [
        "Interactive lessons with guided exploration",
        "Hands-on practice exercises", 
        "Creative projects and experiments",
        "Collaborative learning challenges"
      ]
    };
  }
};
