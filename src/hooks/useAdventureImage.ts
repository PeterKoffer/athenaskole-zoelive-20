import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client'; // Adjust path if needed

interface UseAdventureImageReturn {
  imageUrl?: string;
  isLoading: boolean;
  error?: string;
  fetchImage: (prompt: string) => void;
  currentFetchedPrompt?: string; // To check which prompt generated the current image/error
}

export const useAdventureImage = (): UseAdventureImageReturn => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [currentFetchedPrompt, setCurrentFetchedPrompt] = useState<string | undefined>(undefined);

  // Using useCallback to memoize fetchImage
  const fetchImage = useCallback(async (prompt: string) => {
    if (!prompt) {
      // Clear everything if prompt is empty
      setImageUrl(undefined);
      setError(undefined);
      setIsLoading(false);
      setCurrentFetchedPrompt(undefined);
      return;
    }

    // Avoid re-fetching if the same prompt is already loading or successfully loaded
    // However, allow re-fetch if there was an error previously for this prompt
    if (isLoading && currentFetchedPrompt === prompt) return;
    if (!error && imageUrl && currentFetchedPrompt === prompt) return;

    console.log(`useAdventureImage: Initiating fetch for prompt: "\${prompt}"`);
    setIsLoading(true);
    setError(undefined);
    // Set currentFetchedPrompt immediately to indicate what we are fetching
    // This helps in scenarios where component re-renders with same prompt while fetch is in progress
    setCurrentFetchedPrompt(prompt);
    // Clear previous image only when starting a new fetch for a *different* prompt
    // or if the current prompt is being re-fetched after an error.
    if (currentFetchedPrompt !== prompt || error) {
        setImageUrl(undefined);
    }


    try {
      const { data, error: funcError } = await supabase.functions.invoke(
        'generate-adventure-image',
        { body: { textPrompt: prompt } }
      );

      if (funcError) {
        throw funcError;
      }

      if (data?.imageUrl) {
        setImageUrl(data.imageUrl);
        setError(undefined); // Clear any previous error for this prompt
      } else if (data?.error) {
        throw new Error(data.errorMessage || data.error);
      } else {
        throw new Error('Invalid response from image generation service.');
      }
    } catch (e: any) {
      console.error(\`useAdventureImage: Failed to generate or fetch image for prompt "\${prompt}":\`, e);
      setError(e.message || 'Could not load image.');
      setImageUrl('/placeholder.svg'); // Fallback to a generic placeholder SVG
    } finally {
      // Only set isLoading to false if the current prompt is the one that just finished
      // This prevents a quick succession of calls from messing up the loading state
      if (currentFetchedPrompt === prompt) {
          setIsLoading(false);
      }
    }
  }, [isLoading, currentFetchedPrompt, error, imageUrl]); // Added dependencies

  // Effect to clear state if the hook is somehow re-instantiated or unmounted/remounted
  // This is more for cleanup if the hook instance itself is new, not for prompt changes.
  useEffect(() => {
    return () => {
      setImageUrl(undefined);
      setIsLoading(false);
      setError(undefined);
      setCurrentFetchedPrompt(undefined);
    };
  }, []);

  return { imageUrl, isLoading, error, fetchImage, currentFetchedPrompt };
};
