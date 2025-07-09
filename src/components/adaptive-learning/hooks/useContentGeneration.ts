
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { aiCreativeDirectorService } from '@/services/aiCreativeDirectorService';

export const useContentGeneration = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateContent = useCallback(async (prompt: string, context: any) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      console.log('🎨 Generating content with AI Creative Director');
      const result = await aiCreativeDirectorService.generateCreativeContent(prompt, context);
      
      toast({
        title: "Content Generated",
        description: "AI Creative Director has generated new content",
        duration: 3000
      });
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate content';
      setError(errorMessage);
      
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000
      });
      
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [toast]);

  const getAtomSequence = useCallback(async (kcId: string, userId: string) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      console.log('🔄 Getting atom sequence for KC:', kcId);
      const result = await aiCreativeDirectorService.getAtomSequenceForKc(kcId, userId);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get atom sequence';
      setError(errorMessage);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return {
    generateContent,
    getAtomSequence,
    isGenerating,
    error
  };
};
