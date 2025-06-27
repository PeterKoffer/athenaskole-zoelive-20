
// src/components/adaptive-learning/AdaptivePracticeModule.tsx
import React, { useState, useEffect, useCallback } from 'react';

// Service Imports
import learnerProfileService from '@/services/learnerProfile/LearnerProfileService'; 
import knowledgeComponentService from '@/services/knowledgeComponentService';
import aiCreativeDirectorService from '@/services/aiCreativeDirectorService';
import stealthAssessmentService from '@/services/stealthAssessment/StealthAssessmentService';

// MOCK_USER_ID Import
import { MOCK_USER_ID } from '@/services/learnerProfile/MockProfileService';

// Type Imports
import { LearnerProfile } from '@/types/learnerProfile';
import type { KnowledgeComponent } from '@/types/knowledgeComponent';
import type { AtomSequence, ContentAtom } from '@/types/content';

// UI Component Imports
import ServiceTestingInterface from '@/components/adaptive-learning/components/ServiceTestingInterface';
import LoadingState from '@/components/adaptive-learning/components/LoadingState';
import ErrorState from '@/components/adaptive-learning/components/ErrorState';
import EmptyContentState from '@/components/adaptive-learning/components/EmptyContentState';
import PracticeContent from '@/components/adaptive-learning/components/PracticeContent';

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
    console.log('🎯 AdaptivePracticeModule mounted - Starting content generation flow');
    loadLearnerProfile();
  }, []);

  const loadLearnerProfile = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      console.log("📊 Fetching learner profile for user:", MOCK_USER_ID);
      const profile = await learnerProfileService.getProfile(MOCK_USER_ID);
      setLearnerProfile(profile);
      console.log("✅ Learner profile loaded:", profile);
    } catch (err) {
      console.error("❌ Error loading learner profile:", err);
      setError("Failed to load learner profile. Please try again.");
      setIsLoading(false);
    }
  }, []);

  const createFallbackContent = useCallback((kc: KnowledgeComponent): AtomSequence => {
    console.log("🔄 Creating fallback content for KC:", kc.name);
    
    const fallbackAtoms: ContentAtom[] = [
      {
        atom_id: `fallback_explanation_${kc.id}_${Date.now()}`,
        atom_type: 'TEXT_EXPLANATION',
        content: {
          title: `Understanding ${kc.name}`,
          text: `Let's learn about ${kc.name}. This is an important mathematical concept that builds on your previous knowledge.`,
          examples: [
            "This concept is used in everyday math problems",
            "You'll use this skill in more advanced topics"
          ]
        },
        kc_ids: [kc.id],
        metadata: { source: 'fallback', difficulty: 0.5 }
      },
      {
        atom_id: `fallback_question_${kc.id}_${Date.now()}`,
        atom_type: 'QUESTION_MULTIPLE_CHOICE',
        content: {
          question: `Which of the following best describes ${kc.name}?`,
          options: [
            "A mathematical concept",
            "A type of equation", 
            "A calculation method",
            "A problem-solving strategy"
          ],
          correctAnswer: 0,
          correctFeedback: "Excellent! You understand this concept.",
          generalIncorrectFeedback: "Let's review this concept together."
        },
        kc_ids: [kc.id],
        metadata: { source: 'fallback', difficulty: 0.5 }
      }
    ];

    return {
      sequence_id: `fallback_sequence_${kc.id}_${Date.now()}`,
      atoms: fallbackAtoms,
      kc_id: kc.id,
      user_id: MOCK_USER_ID,
      created_at: new Date().toISOString()
    };
  }, []);

  const recommendAndLoadNextKc = useCallback(async (profile: LearnerProfile) => {
    try {
      setError(null);
      setIsLoading(true);
      console.log("🎯 Recommending next KC for profile:", profile.userId);
      
      const recommendedKcs = await knowledgeComponentService.recommendNextKcs(
        profile.userId, 
        1, 
        sessionKcs.map(kc => kc.id)
      );

      if (recommendedKcs.length === 0) {
        console.warn("⚠️ No more KCs to recommend");
        setError("No more Knowledge Components available for practice. Great job completing your learning session!");
        setCurrentKc(null);
        setAtomSequence(null);
        setIsLoading(false);
        return;
      }

      const nextKc = recommendedKcs[0];
      console.log("✅ Next KC recommended:", nextKc.name);
      setCurrentKc(nextKc);
      setSessionKcs(prevKcs => [...prevKcs, nextKc]);

      console.log("🎨 Requesting atom sequence from AI Creative Director...");
      
      try {
        const sequence = await aiCreativeDirectorService.getAtomSequenceForKc(nextKc.id, profile.userId);
        
        if (sequence && sequence.atoms && sequence.atoms.length > 0) {
          console.log("✅ AI-generated atom sequence received:", sequence.atoms.length, "atoms");
          setAtomSequence(sequence);
        } else {
          console.warn("⚠️ AI service returned empty sequence, using fallback");
          const fallbackSequence = createFallbackContent(nextKc);
          setAtomSequence(fallbackSequence);
        }
      } catch (aiError) {
        console.error("❌ AI Creative Director failed, using fallback content:", aiError);
        const fallbackSequence = createFallbackContent(nextKc);
        setAtomSequence(fallbackSequence);
      }

      setCurrentAtomIndex(0);
      setShowFeedback(false);
      
    } catch (err) {
      console.error("❌ Error in recommendAndLoadNextKc:", err);
      setError("Failed to load new content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [sessionKcs, createFallbackContent]);

  useEffect(() => {
    if (learnerProfile && !currentKc && !isLoading && !error) {
      console.log("🚀 Profile loaded, starting KC recommendation flow");
      recommendAndLoadNextKc(learnerProfile);
    }
  }, [learnerProfile, currentKc, isLoading, error, recommendAndLoadNextKc]);

  const handleNextAtom = () => {
    setShowFeedback(false);
    if (atomSequence && currentAtomIndex < atomSequence.atoms.length - 1) {
      setCurrentAtomIndex(prevIndex => prevIndex + 1);
    } else if (learnerProfile) {
      console.log("📚 End of sequence, loading next KC");
      recommendAndLoadNextKc(learnerProfile);
    }
  };

  const handleQuestionAnswer = async (atom: ContentAtom, answerGiven: string | string[], isCorrectAnswer: boolean) => {
    if (!currentKc || !learnerProfile) {
      console.error("❌ Cannot handle answer - missing KC or profile");
      return;
    }

    console.log("📝 Question answered:", {
      kc: currentKc.name,
      atom: atom.atom_id,
      correct: isCorrectAnswer
    });

    try {
      await stealthAssessmentService.logQuestionAttempt({
        questionId: atom.atom_id,
        knowledgeComponentIds: atom.kc_ids && atom.kc_ids.length > 0 ? atom.kc_ids : [currentKc.id],
        answerGiven: Array.isArray(answerGiven) ? answerGiven.join(', ') : answerGiven,
        isCorrect: isCorrectAnswer,
        timeTakenMs: Math.floor(Math.random() * 20000) + 5000,
        attemptsMade: 1
      }, 'adaptive-practice-module');

      console.log('📈 Updating KC mastery...');
      const updatedProfile = await learnerProfileService.updateKcMastery(
        MOCK_USER_ID,
        currentKc.id,
        {
          isCorrect: isCorrectAnswer,
          newAttempt: true,
          interactionType: 'QUESTION_ATTEMPT',
          interactionDetails: { 
            difficulty: (atom.metadata as any)?.difficulty || 0.5,
            responseTime: Math.floor(Math.random() * 20000) + 5000,
            atomId: atom.atom_id,
            timestamp: Date.now()
          }
        }
      );

      setLearnerProfile(updatedProfile);
      console.log("✅ Profile updated after question submission");

    } catch (logError) {
      console.error("❌ Error logging question attempt:", logError);
    }

    setIsCorrect(isCorrectAnswer);
    const feedbackContent = atom.content as any; 
    setFeedbackMessage(isCorrectAnswer ? 
      (feedbackContent.correctFeedback || "Correct! Well done!") : 
      (feedbackContent.generalIncorrectFeedback || "Let's review this concept together.")
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
