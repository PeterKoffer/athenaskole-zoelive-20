
import { useState } from 'react';
import { invokeFn } from '@/supabase/functionsClient';
import type { AdaptiveContentRes } from '@/types/api';

interface CodeSuggestionRequest {
  prompt: string;
  context?: string;
  language?: string;
  includeSupabase?: boolean;
}

interface CodeSuggestionResponse {
  success: boolean;
  suggestion?: string;
  language?: string;
  error?: string;
  timestamp: string;
}

export const useCodeSuggestions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCodeSuggestion = async (request: CodeSuggestionRequest): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔄 Requesting code suggestion:', request);

      const data = await invokeFn<AdaptiveContentRes>('generate-code-suggestions', request);

      const response = data as CodeSuggestionResponse;

      if (!response.success) {
        throw new Error(response.error || 'Failed to generate code suggestion');
      }

      console.log('✅ Code suggestion generated successfully');
      return response.suggestion || null;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('💥 Error generating code suggestion:', errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const generateSupabaseQuery = async (description: string, context?: string): Promise<string | null> => {
    return generateCodeSuggestion({
      prompt: `Generate a Supabase query for: ${description}`,
      context,
      language: 'typescript',
      includeSupabase: true
    });
  };

  const generateReactComponent = async (description: string, context?: string): Promise<string | null> => {
    return generateCodeSuggestion({
      prompt: `Create a React component for: ${description}`,
      context,
      language: 'typescript'
    });
  };

  const generateUtilityFunction = async (description: string, language: string = 'typescript'): Promise<string | null> => {
    return generateCodeSuggestion({
      prompt: `Create a utility function for: ${description}`,
      language
    });
  };

  return {
    generateCodeSuggestion,
    generateSupabaseQuery,
    generateReactComponent,
    generateUtilityFunction,
    isLoading,
    error
  };
};
