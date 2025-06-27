// src/components/adaptive-learning/AdaptivePracticeModule.tsx
import React, { useState, useEffect, useCallback } from 'react';
import learnerProfileService from '@/services/learnerProfileService'; // Default import (from main)
import knowledgeComponentService from '@/services/knowledgeComponentService'; // Default import (from main)
import aiCreativeDirectorService from '@/services/aiCreativeDirectorService'; // Default import (from main)
import stealthAssessmentService from '@/services/stealthAssessmentService'; // Default import (from main)
import type { LearnerProfile } from '@/types/learner'; // Using LearnerProfile type (likely updated on main)
import type { KnowledgeComponent } from '@/types/knowledgeComponent'; // Using KnowledgeComponent type (likely updated on main)
import type { AtomSequence, ContentAtom } from '@/types/content';
// Corrected path for InteractionEventType based on Lovable agent's fixes
import { InteractionEventType } from '@/types/stealthAssessment'; 

import TextExplanationAtom from './atoms/TextExplanationAtom'; // PLEASE VERIFY THIS PATH
import QuestionCard from './cards/QuestionCard'; // PLEASE VERIFY THIS PATH
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, RefreshCw, Loader2, AlertTriangle, Info } from 'lucide-react';

// Using UUID format MOCK_USER_ID (from main)
const MOCK_USER_ID = '00000000-0000-0000-0000-000000000001'; 

const AdaptivePracticeModule: React.FC = () => {
  const [learnerProfile, setLearnerProfile] = useState<LearnerProfile | null>(null);
  const [currentKc, setCurrentKc] = useState<KnowledgeComponent | null>(null);
  const [atomSequence, setAtomSequence] = useState<AtomSequence | null>(null);
  const [currentAtomIndex, setCurrentAtomIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionKcs, setSessionKcs] = useState<KnowledgeComponent[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const loadLearnerProfile = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      console.log("AdaptivePracticeModule: Fetching learner profile for user:", MOCK_USER_ID);
      const profile = await learnerProfileService.getProfile(MOCK_USER_ID);
      setLearnerProfile(profile);
      console.log("AdaptivePracticeModule: Learner profile loaded:", profile);
      setIsLoading(false); // Corrected: set isLoading to false after profile is loaded
    } catch (err) {
      console.error("AdaptivePracticeModule: Error loading learner profile:", err);
      setError("Failed to load learner profile. Please try again.");
      setIsLoading(false);
    }
  }, []);

  const recommendAndLoadNextKc = useCallback(async (profile: LearnerProfile, excludedKcIds: string[]) => {
    try {
      setError(null);
      setIsLoading(true);
      console.log("AdaptivePracticeModule: Recommending next KC for profile:", profile);
      console.log("AdaptivePracticeModule: Excluding already attempted KC IDs in this session:", excludedKcIds);
      const recommendedKcs = await knowledgeComponentService.recommendNextKcs(profile.userId, 1, excludedKcIds);
      
      if (recommendedKcs.length === 0) {
        console.warn("AdaptivePracticeModule: No more KCs to recommend or all attempted in this session.");
        setError("No more new Knowledge Components to practice in this session. You've covered a lot! Try refreshing for a new set or check back later.");
        setCurrentKc(null);
        setAtomSequence(null);
        setIsLoading(false); 
        return;
      }
      const nextKc = recommendedKcs[0];
      console.log("AdaptivePracticeModule: Next KC recommended:", nextKc);
      setCurrentKc(nextKc);
      setSessionKcs(prevKcs => [...prevKcs, nextKc]); 

      console.log("AdaptivePracticeModule: Requesting atom sequence for KC:", nextKc.id);
      const sequence = await aiCreativeDirectorService.getAtomSequenceForKc(nextKc.id, profile.userId);
      setAtomSequence(sequence);
      setCurrentAtomIndex(0);
      setShowFeedback(false); 
      console.log("AdaptivePracticeModule: Atom sequence received:", sequence);

      if (!sequence || sequence.atoms.length === 0) {
        console.warn("AdaptivePracticeModule: No atoms found for KC:", nextKc.id);
        setError(`No content atoms found for the topic: ${nextKc.name}. Please try refreshing for another topic.`);
      }
    } catch (err) {
      console.error("AdaptivePracticeModule: Error recommending or loading KC/atoms:", err);
      setError("Failed to load new content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []); 

  useEffect(() => {
    console.log("AdaptivePracticeModule: Initializing...");
    loadLearnerProfile();
  }, [loadLearnerProfile]);

  useEffect(() => {
    if (learnerProfile && !currentKc && !isLoading && !error) { 
      console.log("AdaptivePracticeModule: Learner profile available, no current KC, not loading, and no error. Attempting to recommend KC.");
      const excludedIds = sessionKcs.map(kc => kc.id);
      recommendAndLoadNextKc(learnerProfile, excludedIds);
    }
  }, [learnerProfile, currentKc, isLoading, error, recommendAndLoadNextKc, sessionKcs]);

  const handleNextAtom = () => {
    setShowFeedback(false); 
    if (atomSequence && currentAtomIndex < atomSequence.atoms.length - 1) {
      setCurrentAtomIndex(prevIndex => prevIndex + 1);
    } else if (learnerProfile) {
      console.log("AdaptivePracticeModule: End of sequence, recommending next KC.");
      const excludedIds = sessionKcs.map(kc => kc.id);
      recommendAndLoadNextKc(learnerProfile, excludedIds);
    }
  };
  
  const handleQuestionAnswer = async (atom: ContentAtom, answerGiven: string | string[], isCorrectAnswer: boolean) => {
    if (!currentKc || !learnerProfile) {
      console.error("AdaptivePracticeModule: Cannot handle answer - missing KC or profile.");
      return;
    }

    console.log("AdaptivePracticeModule: Question answered. KC:", currentKc.id, "Atom:", atom.atom_id, "Correct:", isCorrectAnswer);
    
    const eventData = { 
      questionId: atom.atom_id, 
      kc_ids: atom.kc_ids && atom.kc_ids.length > 0 ? atom.kc_ids : [currentKc.id],
      answerGiven: answerGiven,
      isCorrect: isCorrectAnswer,
      timestamp: new Date().toISOString(),
    };

    try {
      await stealthAssessmentService.logInteractionEvent({
        event_type: InteractionEventType.QUESTION_ATTEMPT,
        user_id: learnerProfile.userId,
        event_data: eventData, 
        kc_ids: eventData.kc_ids,
        content_atom_id: atom.atom_id,
        is_correct: isCorrectAnswer,
      });
      
      const updatedProfile = await learnerProfileService.getProfile(MOCK_USER_ID);
      setLearnerProfile(updatedProfile);
      console.log("AdaptivePracticeModule: Profile refetched after question submission:", updatedProfile);

    } catch (logError) {
      console.error("AdaptivePracticeModule: Error logging question attempt or refetching profile:", logError);
    }

    setIsCorrect(isCorrectAnswer);
    const feedbackContent = atom.content as any; 
    setFeedbackMessage(isCorrectAnswer ? 
      (feedbackContent.correctFeedback || "Correct!") : 
      (feedbackContent.generalIncorrectFeedback || "Not quite. Let's review.")
    );
    setShowFeedback(true);
  };

  const currentAtom = atomSequence?.atoms[currentAtomIndex];

  if (isLoading && !currentAtom && !error) {
    return (
      <Card className="w-full max-w-2xl mx-auto mt-10 shadow-xl bg-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center text-blue-300">Loading Adaptive Practice...</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-16 w-16 animate-spin text-blue-400 mb-6" />
          <p className="text-lg">Preparing your learning experience...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-2xl mx-auto mt-10 shadow-xl bg-red-900/20 border-red-700 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center text-red-300 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 mr-3" /> Error
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-10">
          <p className="text-lg mb-6">{error}</p>
          <Button 
            onClick={() => { 
              setError(null); 
              setIsLoading(true); 
              if (learnerProfile) {
                 const excludedIds = sessionKcs.map(kc => kc.id);
                 recommendAndLoadNextKc(learnerProfile, excludedIds);
              } else {
                 loadLearnerProfile(); 
              }
            }} 
            variant="destructive" className="bg-red-500 hover:bg-red-600"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  if (!isLoading && (!currentKc || !currentAtom)) { 
    return (
      <Card className="w-full max-w-2xl mx-auto mt-10 shadow-xl bg-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center text-yellow-300">No Content Available</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-10">
          <Info className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <p className="text-lg mb-6">No new learning content could be loaded right now. You might have completed all available topics for this session, or there was an issue fetching new material.</p>
           <Button 
            onClick={() => { 
              setError(null);
              setIsLoading(true); 
              if (learnerProfile) {
                const excludedIds = sessionKcs.map(kc => kc.id);
                recommendAndLoadNextKc(learnerProfile, excludedIds);
              }
              else loadLearnerProfile(); 
            }} 
            variant="outline"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Refresh Content
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  if (!currentAtom) { 
    return (
         <Card className="w-full max-w-2xl mx-auto mt-10 shadow-xl bg-yellow-900/20 border-yellow-700 text-white">
            <CardHeader><CardTitle className="text-yellow-300">Preparing Content...</CardTitle></CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-48">
                <Loader2 className="h-12 w-12 animate-spin text-yellow-400" />
                <p className="mt-3 text-yellow-200">Just a moment...</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-4 md:mt-8 shadow-2xl bg-slate-800 text-slate-50 border border-slate-700">
      <CardHeader className="pb-4 bg-slate-700/50 rounded-t-lg">
        <CardTitle className="text-xl md:text-2xl font-bold text-center text-sky-300">
          Adaptive Practice: {currentKc.name} 
        </CardTitle>
        {learnerProfile && currentKc && learnerProfile.kcMasteryMap && learnerProfile.kcMasteryMap[currentKc.id] && (
          <p className="text-xs text-center text-slate-400 mt-1">
            User: {learnerProfile.userId} | KC Mastery: {learnerProfile.kcMasteryMap[currentKc.id].masteryLevel.toFixed(2)}
          </p>
        )}
         {learnerProfile && currentKc && (!learnerProfile.kcMasteryMap || !learnerProfile.kcMasteryMap[currentKc.id]) && (
          <p className="text-xs text-center text-slate-400 mt-1">
            User: {learnerProfile.userId} | KC Mastery: N/A
          </p>
        )}
      </CardHeader>
      <CardContent className="p-4 md:p-6 min-h-[200px] md:min_h-[300px] relative">
        {isLoading && currentAtom && ( 
          <div className="absolute inset-0 bg-slate-800/70 flex flex-col items-center justify-center z-10 rounded-b-lg">
            <Loader2 className="h-12 w-12 animate-spin text-sky-400" />
            <p className="mt-3 text-sky-200">Loading next item...</p>
          </div>
        )}

        {!isLoading && currentAtom.atom_type === 'TEXT_EXPLANATION' && (
          <TextExplanationAtom atom={currentAtom} />
        )}
        {!isLoading && currentAtom.atom_type === 'QUESTION_MULTIPLE_CHOICE' && (
          <QuestionCard
            key={currentAtom.atom_id} 
            atom={currentAtom}
            onSubmitAnswer={(answer, isCorrectAnswer) => handleQuestionAnswer(currentAtom, answer, isCorrectAnswer)}
            disabled={showFeedback || isLoading}
          />
        )}
        
        {showFeedback && (
          <div className={`mt-4 p-3 rounded-md text-sm ${isCorrect ? 'bg-green-700/30 border border-green-500 text-green-200' : 'bg-red-700/30 border border-red-500 text-red-200'}`}>
            <p><strong>{isCorrect ? "Correct!" : "Review:"}</strong> {feedbackMessage}</p>
          </div>
        )}
      </CardContent>
      <div className="px-4 md:px-6 py-4 border-t border-slate-700 flex justify-end bg-slate-700/30 rounded-b-lg">
        <Button 
          onClick={handleNextAtom} 
          disabled={isLoading || (currentAtom.atom_type === 'QUESTION_MULTIPLE_CHOICE' && !showFeedback)}
          className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out transform hover:scale-105 disabled:opacity-60 disabled:transform-none disabled:shadow-none"
        >
          {isLoading && currentAtomIndex === (atomSequence?.atoms.length || 0) -1 ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Next'} 
          {(!isLoading || !(currentAtomIndex === (atomSequence?.atoms.length || 0) -1)) && <ArrowRight className="h-5 w-5 ml-2" />}
        </Button>
      </div>
    </Card>
  );
};

export default AdaptivePracticeModule;