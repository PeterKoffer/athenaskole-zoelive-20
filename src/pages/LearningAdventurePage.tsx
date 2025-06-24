import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type {
  LearningAdventure,
  StoryArc,
  Chapter,
  AdventureGenerationRequest // For the mock request
} from '@/types/learningAdventureTypes';
import type { CurrentAdventureState } from '@/types/learningAdventureDisplayTypes'; // Optional, using direct state here

import InitialChoiceScreen from '@/components/learning-adventure/InitialChoiceScreen';
import ChapterDisplay from '@/components/learning-adventure/ChapterDisplay';
import AdventureImageDisplay from '@/components/learning-adventure/AdventureImageDisplay'; // Added
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';

const LearningAdventurePage: React.FC = () => {
  const [adventure, setAdventure] = useState<LearningAdventure | undefined>(undefined);
  const [currentStoryArcId, setCurrentStoryArcId] = useState<string | undefined>(undefined);
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);

  const fetchAdventure = useCallback(async () => {
    setIsLoading(true);
    setError(undefined);

    // Mock request payload for the 'generate-nelie-learning-adventure' function
    const mockRequest: AdventureGenerationRequest = {
      targetAudience: { gradeLevelMin: 3, gradeLevelMax: 5 },
      themePrompt: "A day managing a new store in the city mall",
      desiredDurationType: "singleDay",
      // studentInterests and mandatorySubjectsOrSkills are optional in the type
      // but good to include for more tailored mock generation by the function.
      studentInterests: ["business", "helping customers"],
      mandatorySubjectsOrSkills: ["Mathematics", "Problem Solving"]
    };

    try {
      const { data, error: funcError } = await supabase.functions.invoke(
        'generate-nelie-learning-adventure',
        { body: mockRequest }
      );

      if (funcError) {
        throw funcError;
      }

      if (data) {
        setAdventure(data as LearningAdventure);
        // If there's no initial choice point, or if we want to auto-start the default arc
        if (!(data as LearningAdventure).initialChoicePoint) {
          setCurrentStoryArcId((data as LearningAdventure).defaultStoryArcId);
        } else if (!currentStoryArcId) {
           // If there IS a choice point, we wait for user selection, so don't set currentStoryArcId here
           // unless the logic requires a default to be pre-selected (not typical for choice points)
        }
        setCurrentChapterIndex(0); // Reset chapter index
      } else {
        throw new Error('No data returned from adventure generation function.');
      }
    } catch (e: any) {
      console.error('Failed to fetch learning adventure:', e);
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [currentStoryArcId]); // currentStoryArcId dependency removed to avoid re-fetching unless choice is made

  useEffect(() => {
    // Fetch only if adventure is not loaded yet.
    // If currentStoryArcId changes due to user choice, we don't re-fetch the whole adventure.
    if (!adventure) {
      fetchAdventure();
    }
  }, [adventure, fetchAdventure]);

  const handleChoiceMade = (arcId: string) => {
    setCurrentStoryArcId(arcId);
    setCurrentChapterIndex(0); // Start at the first chapter of the new arc
  };

  const currentArc: StoryArc | undefined = adventure && currentStoryArcId ? adventure.storyArcs[currentStoryArcId] : undefined;
  const currentChapter: Chapter | undefined = currentArc ? currentArc.chapters[currentChapterIndex] : undefined;

  const goToNextChapter = () => {
    if (currentArc && currentChapterIndex < currentArc.chapters.length - 1) {
      setCurrentChapterIndex(prev => prev + 1);
    }
  };

  const goToPreviousChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(prev => prev - 1);
    }
  };

  const isLastChapterOfArc = currentArc ? currentChapterIndex === currentArc.chapters.length - 1 : false;
  // Basic check if all arcs are "done" - this logic might need to be more sophisticated
  const areAllArcsDone = () => {
    if (!adventure) return false;
    // For now, assumes "done" if current arc is finished and there was no choice point, or only one arc.
    // More complex logic would track completion of all chosen/available arcs.
    if (adventure.initialChoicePoint && Object.keys(adventure.storyArcs).length > 1) {
        // If there were choices, we'd need a way to know if all *relevant* arcs are done.
        // For simplicity, we'll just consider the current arc's completion for now.
        return isLastChapterOfArc;
    }
    return isLastChapterOfArc; // If only one arc (default)
  };


  if (isLoading) {
    return <div className="p-4 text-center">Loading Learning Adventure... NELIE is thinking!</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error loading adventure: {error} <Button onClick={fetchAdventure}>Try Again</Button></div>;
  }

  if (!adventure) {
    return <div className="p-4 text-center">No adventure loaded. <Button onClick={fetchAdventure}>Load Adventure</Button></div>;
  }

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-purple-600 via-blue-500 to-teal-400 min-h-screen text-white">
      <Card className="max-w-3xl mx-auto bg-slate-800/70 backdrop-blur-md border-purple-400/50 text-white">
        <CardHeader className="text-center">
          <div className="flex justify-start mb-4">
            <Button variant="outline" onClick={() => window.location.href = '/'} className="text-white border-slate-300 hover:bg-slate-700">
              <Home className="mr-2 h-4 w-4" /> Home
            </Button>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
            {adventure.title}
          </CardTitle>
          {adventure.logline && <CardDescription className="text-purple-300 text-lg">{adventure.logline}</CardDescription>}
          {adventure.coverImagePrompt && (
            <div className="mt-4 rounded-lg overflow-hidden border border-purple-400/30">
              <AdventureImageDisplay
                imagePrompt={adventure.coverImagePrompt}
                altText={`Cover for ${adventure.title}`}
                className="w-full h-64 md:h-80" // Adjusted height
                aspectRatio="aspect-video"
              />
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {adventure.introductionNarrative && (!currentStoryArcId || currentChapterIndex === 0 && adventure.storyArcs[currentStoryArcId]?.chapters[0]?.chapterId === adventure.storyArcs[currentStoryArcId]?.chapters[0]?.chapterId) && (
            // Show overall adventure introduction only before first choice or at the very start of the first chosen/default chapter
            <Card className="bg-slate-700/60 p-4 border-blue-300/40">
              <CardHeader><CardTitle className="text-sky-300">Adventure Introduction</CardTitle></CardHeader>
              <CardContent>
                <p className="mb-3">{adventure.introductionNarrative}</p>
                <AdventureImageDisplay
                  imagePrompt={adventure.introductionImagePrompt}
                  altText="Introduction scene"
                  className="w-full h-56 rounded-md"
                  aspectRatio="aspect-video"
                />
              </CardContent>
            </Card>
          )}

          {!currentStoryArcId && adventure.initialChoicePoint ? (
            <InitialChoiceScreen
              choicePoint={adventure.initialChoicePoint}
              onChoiceMade={handleChoiceMade}
            />
          ) : currentChapter && currentArc ? (
            <>
              <ChapterDisplay chapter={currentChapter} />
              <div className="flex justify-between mt-6">
                <Button onClick={goToPreviousChapter} disabled={currentChapterIndex === 0} variant="outline" className="text-white border-slate-300 hover:bg-slate-700">
                  <ArrowLeft className="mr-2 h-4 w-4"/> Previous Chapter
                </Button>
                <Button onClick={goToNextChapter} disabled={isLastChapterOfArc} variant="outline" className="text-white border-slate-300 hover:bg-slate-700">
                  Next Chapter <ArrowRight className="ml-2 h-4 w-4"/>
                </Button>
              </div>
              {isLastChapterOfArc && (
                <Card className="mt-6 bg-slate-700/50 p-4 border-purple-300/40">
                  <CardHeader>
                    <CardTitle className="text-xl text-green-300">Arc Conclusion: {currentArc.arcTitle}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-3">{currentArc.arcConclusionNarrative}</p>
                    <AdventureImageDisplay
                      imagePrompt={currentArc.arcConclusionImagePrompt}
                      altText={`Conclusion for ${currentArc.arcTitle || 'arc'}`}
                      className="w-full h-56 rounded-md"
                      aspectRatio="aspect-video"
                    />
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
             <div className="text-center">Loading chapter or arc...</div>
          )}

          {areAllArcsDone() && adventure.conclusionNarrative && (
             <Card className="mt-8 bg-slate-700/50 p-6 border-green-400/50">
                <CardHeader>
                  <CardTitle className="text-2xl text-yellow-300">Adventure Completed!</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-3">{adventure.conclusionNarrative}</p>
                  <AdventureImageDisplay
                    imagePrompt={adventure.conclusionImagePrompt}
                    altText="Final adventure scene"
                    className="w-full h-64 rounded-md"
                    aspectRatio="aspect-video"
                  />
                </CardContent>
              </Card>
          )}
        </CardContent>
        <CardFooter className="text-xs text-center text-gray-400 pt-6">
            Learning Adventure ID: {adventure.adventureId}
        </CardFooter>
      </Card>
    </div>
  );
};

export default LearningAdventurePage;
