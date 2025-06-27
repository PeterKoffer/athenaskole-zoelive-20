
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, RefreshCw, Loader2, AlertTriangle, Info, Database } from 'lucide-react';
import learnerProfileService from '@/services/learnerProfile/LearnerProfileService';
import knowledgeComponentService from '@/services/knowledgeComponentService';
import aiCreativeDirectorService from '@/services/aiCreativeDirectorService';
import stealthAssessmentService from '@/services/stealthAssessment/StealthAssessmentService';
import { MOCK_USER_ID } from '@/services/learnerProfile/MockProfileService';
import { LearnerProfile } from '@/types/learnerProfile';
import type { KnowledgeComponent } from '@/types/knowledgeComponent';
import type { AtomSequence, ContentAtom } from '@/types/content';
import TextExplanationAtom from './atoms/TextExplanationAtom';
import QuestionCard from './cards/QuestionCard';
import ServiceTestingInterface from './components/ServiceTestingInterface';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import EmptyContentState from './components/EmptyContentState';
import PracticeContent from './components/PracticeContent';

const AdaptivePracticeModule: React.FC = () => {
  // Core learning states
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
  const [showServiceTests, setShowServiceTests] = useState(false);

  useEffect(() => {
    console.log('🎯 AdaptivePracticeModule mounted - Using refactored StealthAssessmentService');
    loadLearnerProfile();
  }, []);

  const loadLearnerProfile = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      console.log("AdaptivePracticeModule: Fetching learner profile for user:", MOCK_USER_ID);
      const profile = await learnerProfileService.getProfile(MOCK_USER_ID);
      setLearnerProfile(profile);
      console.log("AdaptivePracticeModule: Learner profile loaded:", profile);
    } catch (err) {
      console.error("AdaptivePracticeModule: Error loading learner profile:", err);
      setError("Failed to load learner profile. Please try again.");
      setIsLoading(false);
    }
  }, []);

  const recommendAndLoadNextKc = useCallback(async (profile: LearnerProfile) => {
    try {
      setError(null);
      setIsLoading(true);
      console.log("AdaptivePracticeModule: Recommending next KC for profile:", profile);
      const recommendedKcs = await knowledgeComponentService.recommendNextKcs(profile.userId, 1, sessionKcs.map(kc => kc.id));

      if (recommendedKcs.length === 0) {
        console.warn("AdaptivePracticeModule: No more KCs to recommend or all attempted in this session.");
        setError("No more new Knowledge Components to practice in this session, or an error occurred fetching them. Try refreshing or starting a new session later.");
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
        setError(`No content atoms found for the topic: ${nextKc.name}. Try another topic or check content availability.`);
      }
    } catch (err) {
      console.error("AdaptivePracticeModule: Error recommending or loading KC/atoms:", err);
      setError("Failed to load new content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [sessionKcs]);

  useEffect(() => {
    if (learnerProfile && !currentKc && !isLoading && !error) {
      console.log("AdaptivePracticeModule: Learner profile loaded, attempting to recommend KC.");
      recommendAndLoadNextKc(learnerProfile);
    }
  }, [learnerProfile, currentKc, isLoading, error, recommendAndLoadNextKc]);

  const handleNextAtom = () => {
    setShowFeedback(false);
    if (atomSequence && currentAtomIndex < atomSequence.atoms.length - 1) {
      setCurrentAtomIndex(prevIndex => prevIndex + 1);
    } else if (learnerProfile) {
      console.log("AdaptivePracticeModule: End of sequence, recommending next KC.");
      recommendAndLoadNextKc(learnerProfile);
    }
  };

  const handleQuestionAnswer = async (atom: ContentAtom, answerGiven: string | string[], isCorrectAnswer: boolean) => {
    if (!currentKc || !learnerProfile) {
      console.error("AdaptivePracticeModule: Cannot handle answer - missing KC or profile.");
      return;
    }

    console.log("AdaptivePracticeModule: Question answered. KC:", currentKc.id, "Atom:", atom.atom_id, "Correct:", isCorrectAnswer);

    try {
      // Log the interaction using the refactored service
      await stealthAssessmentService.logQuestionAttempt({
        questionId: atom.atom_id,
        knowledgeComponentIds: atom.kc_ids && atom.kc_ids.length > 0 ? atom.kc_ids : [currentKc.id],
        answerGiven: Array.isArray(answerGiven) ? answerGiven.join(', ') : answerGiven,
        isCorrect: isCorrectAnswer,
        timeTakenMs: Math.floor(Math.random() * 20000) + 5000,
        attemptsMade: 1
      }, 'adaptive-practice-module');

      // Update KC mastery
      console.log('📈 Updating KC mastery via LearnerProfileService...');
      const updatedProfile = await learnerProfileService.updateKcMastery(
        MOCK_USER_ID,
        currentKc.id,
        {
          isCorrect: isCorrectAnswer,
          newAttempt: true,
          interactionType: 'QUESTION_ATTEMPT',
          interactionDetails: { 
            difficulty: 3, 
            responseTime: Math.floor(Math.random() * 20000) + 5000,
            atomId: atom.atom_id,
            timestamp: Date.now()
          }
        }
      );

      setLearnerProfile(updatedProfile);
      console.log("AdaptivePracticeModule: Profile updated after question submission:", updatedProfile);

    } catch (logError) {
      console.error("AdaptivePracticeModule: Error logging question attempt or updating profile:", logError);
    }

    setIsCorrect(isCorrectAnswer);
    const feedbackContent = atom.content as any;
    setFeedbackMessage(isCorrectAnswer ?
      (feedbackContent.correctFeedback || "Correct!") :
      (feedbackContent.generalIncorrectFeedback || "Not quite. Let's review.")
    );
    setShowFeedback(true);
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    if (learnerProfile) {
      recommendAndLoadNextKc(learnerProfile);
    } else {
      loadLearnerProfile();
    }
  };

  const currentAtom = atomSequence?.atoms[currentAtomIndex];

  // Show service testing interface if enabled
  if (showServiceTests) {
    return (
      <ServiceTestingInterface 
        onBack={() => setShowServiceTests(false)}
      />
    );
  }

  if (isLoading && !currentAtom && !error) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState 
        error={error}
        onRetry={handleRetry}
        onShowServiceTests={() => setShowServiceTests(true)}
      />
    );
  }

  if (!isLoading && (!currentKc || !currentAtom)) {
    return (
      <EmptyContentState 
        onRefresh={handleRetry}
        onShowServiceTests={() => setShowServiceTests(true)}
      />
    );
  }

  if (!currentAtom) {
    return <LoadingState title="Preparing Content..." />;
  }

  return (
    <PracticeContent
      currentKc={currentKc}
      learnerProfile={learnerProfile}
      currentAtom={currentAtom}
      showFeedback={showFeedback}
      isCorrect={isCorrect}
      feedbackMessage={feedbackMessage}
      isLoading={isLoading}
      onQuestionAnswer={handleQuestionAnswer}
      onNextAtom={handleNextAtom}
      onShowServiceTests={() => setShowServiceTests(true)}
    />
  );
};

export default AdaptivePracticeModule;
