
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useDiverseQuestionGeneration } from '../hooks/useDiverseQuestionGeneration';
import { useGradeLevelContent } from '@/hooks/useGradeLevelContent';
import { userProgressService, UserProgress } from '@/services/userProgressService'; // Import userProgressService

interface ImprovedSessionManagerProps {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  gradeContentConfig: any;
  children: (sessionData: any) => React.ReactNode;
}

const ImprovedSessionManager = ({
  subject,
  skillArea,
  difficultyLevel,
  gradeContentConfig,
  children
}: ImprovedSessionManagerProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { gradeConfig } = useGradeLevelContent(subject);
  const { playCorrectAnswerSound, playWrongAnswerSound } = useSoundEffects(); // Instantiate sound effects hook

  // --- State for the session's activity list ---
  const [activityList, setActivityList] = useState<any[]>([]);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [isActivityListLoading, setIsActivityListLoading] = useState(true);
  
  // --- State for individual activity (question or game) ---
  // currentActivity is now derived: const currentActivity = activityList[currentActivityIndex];
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null); // Specific to questions
  const [showResult, setShowResult] = useState(false); // Specific to questions
  const [correctAnswers, setCorrectAnswers] = useState(0); // For UI display of current session correct count
  const [sessionStartTime] = useState(new Date());
  const [activityStartTime, setActivityStartTime] = useState(new Date());
  
  // --- State for session summary for persistence ---
  const [sessionQuestionsAttempted, setSessionQuestionsAttempted] = useState(0);
  const [sessionCorrectAnswers, setSessionCorrectAnswers] = useState(0);
  // const [sessionGamesCompleted, setSessionGamesCompleted] = useState(0); // Optional

  const TOTAL_ACTIVITIES_PER_SESSION = 6; // Configurable total activities
  
  // Use grade-appropriate difficulty if available
  const adjustedDifficulty = gradeConfig 
    ? Math.max(gradeConfig.difficultyRange[0], Math.min(gradeConfig.difficultyRange[1], difficultyLevel))
    : difficultyLevel;
  
  // Hook for question generation (will be used for question slots)
  const {
    isGenerating: isQuestionGenerating, // Renamed
    generateDiverseQuestion,
    saveQuestionHistory
  } = useDiverseQuestionGeneration({
    subject,
    skillArea,
    difficultyLevel: adjustedDifficulty,
    userId: user?.id || '',
    gradeLevel: gradeConfig?.userGrade,
    standardsAlignment: gradeContentConfig?.standard
  });

  // --- Daily Activity List Generation ---
  useEffect(() => {
    const generateActivityListForSession = async () => {
      if (!user?.id || !gradeContentConfig) return; // Ensure dependencies are ready

      setIsActivityListLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const cacheKey = `activityList_${user.id}_${subject}_${skillArea}_${adjustedDifficulty}_${gradeConfig?.userGrade || 'anyGrade'}_${today}`;
      
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        setActivityList(JSON.parse(cachedData));
        setIsActivityListLoading(false);
        console.log('📋 Loaded activity list from cache');
        return;
      }

      console.log('🔄 Generating new activity list for the day...');
      const newActivityList = [];
      const activityPattern = ['Q', 'Q', 'G', 'Q', 'Q', 'G']; // Example: Q=Question, G=Game

      // Simulated game data (replace with actual fetch from /data/games/SUBJECT-games.json and filter)
      let gameToUse = null;
      if (subject.toLowerCase() === 'mathematics') { // Only for math for this example
         gameToUse = {
          id: "math-addition-castle", title: "Addition Castle Quest", description: "Solve addition problems!", emoji: "🏰", subject: "Mathematics", gradeLevel: [1,2,3], difficulty: "beginner", interactionType: "drag-drop", timeEstimate:"10m", skillAreas:["addition"], learningObjectives:["Add numbers"], status:"available", rewards:{coins:10, badges:["Adder"]}
        };
      }

      for (let i = 0; i < TOTAL_ACTIVITIES_PER_SESSION; i++) {
        const activityTypeDesignation = activityPattern[i % activityPattern.length];
        let activity = null;

        if (activityTypeDesignation === 'G' && gameToUse) {
          activity = { type: 'interactive-game', gameData: { ...gameToUse, id: `${gameToUse.id}-${i}` }, uniqueId: `${gameToUse.id}-${Date.now()}-${i}` };
          console.log(`🎲 Added game to list: ${gameToUse.title}`);
        } else {
          try {
            const questionContext = gradeContentConfig ? { gradeLevel: gradeContentConfig.gradeLevel, standard: gradeContentConfig.standard, contentPrompt: gradeContentConfig.contentPrompt } : undefined;
            const question = await generateDiverseQuestion(questionContext);
            activity = { type: 'interactive-question', ...question, uniqueId: `q-${Date.now()}-${i}` };
            console.log(`📝 Added question to list: ${question.question.substring(0,30)}...`);
          } catch (e) {
            console.error("Failed to generate a question for activity list, adding placeholder:", e);
            activity = { type: 'error', message: 'Failed to load activity.', uniqueId: `err-${Date.now()}-${i}`, question: "Error loading activity." };
          }
        }
        if (activity) newActivityList.push(activity);
      }
      
      setActivityList(newActivityList);
      if (newActivityList.length > 0) {
        localStorage.setItem(cacheKey, JSON.stringify(newActivityList));
      }
      setIsActivityListLoading(false);
      console.log('✅ Generated new activity list and cached.');
    };

    generateActivityListForSession();
  }, [user?.id, subject, skillArea, adjustedDifficulty, gradeConfig, gradeContentConfig, generateDiverseQuestion, toast]); // Added toast

  const currentActivity = activityList[currentActivityIndex];

  const loadNextActivity = () => { // Renamed from loadNextQuestion
    if (currentActivityIndex < activityList.length - 1) {
      setCurrentActivityIndex(prev => prev + 1);
      // activityStartTime, selectedAnswer, showResult are reset in the useEffect below for currentActivity
    } else {
      // All activities complete - End of Session
      // Note: The actual number of correct answers for the *last* activity is updated in handleAnswerSelect/handleGameComplete
      // So, we use the state `sessionCorrectAnswers` and `sessionQuestionsAttempted` which are updated before loadNextActivity is called.
      const finalAttempted = sessionQuestionsAttempted; // This already includes the last question attempt
      const finalCorrect = sessionCorrectAnswers; // This already includes the last question's correctness

      toast({
        title: "Session Complete! 🎓",
        description: `You've completed all ${activityList.length} activities! Questions: ${finalCorrect}/${finalAttempted} correct.`,
        duration: 5000,
      });

      // Persist progress
      if (user?.id && finalAttempted > 0) { // Only save if questions were attempted
        const progressData: Partial<UserProgress> = {
          user_id: user.id,
          subject: subject,
          skill_area: skillArea,
          // This simplified version sets progress based on THIS session only.
          // A robust version would fetch existing progress and merge.
          attempts_count: finalAttempted,
          accuracy_rate: finalAttempted > 0 ? (finalCorrect / finalAttempted) * 100 : 0,
          // To properly update overall accuracy, we'd need existing total_correct and total_attempted.
          // For now, this reflects session accuracy.
          current_level: adjustedDifficulty,
          last_assessment: new Date().toISOString(),
        };
        console.log("📊 Saving session progress:", progressData);
        userProgressService.updateUserProgress(progressData)
          .then(success => {
            if (success) {
              toast({ title: "Progress Saved!", duration: 2000 });
            } else {
              toast({ title: "Failed to Save Progress", variant: "destructive", duration: 2000 });
            }
          });
      } else if (user?.id && finalAttempted === 0 && activityList.filter(a => a.type === 'interactive-game').length > 0) {
        // Handle session with only games (no questions attempted) - e.g. log completion
         const progressData: Partial<UserProgress> = {
          user_id: user.id,
          subject: subject,
          skill_area: skillArea,
          attempts_count: 0, // No questions
          accuracy_rate: 0,  // No questions
          current_level: adjustedDifficulty,
          last_assessment: new Date().toISOString(),
          // Could add a field like 'games_completed_count' if UserProgress supports it
        };
        console.log("📊 Saving game session completion (no questions):", progressData);
        userProgressService.updateUserProgress(progressData); // Save at least that the session was touched
      }
    }
  };

  // Effect to set activity start time when activity becomes current
  useEffect(() => {
    if (currentActivity) {
        setActivityStartTime(new Date());
    }
  }, [currentActivity]);

  const handleAnswerSelect = async (answerIndex: number) => {
    if (showResult || selectedAnswer !== null || !currentActivity || currentActivity.type !== 'interactive-question') return;
    
    setSessionQuestionsAttempted(prev => prev + 1); // Track attempt for persistence
    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === currentActivity.correct;
    const responseTime = Date.now() - activityStartTime.getTime();
    setShowResult(true);
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1); // For UI display
      setSessionCorrectAnswers(prev => prev + 1); // For persistence
      playCorrectAnswerSound();
    } else {
      playWrongAnswerSound();
    }

    await saveQuestionHistory(currentActivity, answerIndex, isCorrect, responseTime, {
      gradeLevel: gradeConfig?.userGrade,
      standardCode: gradeContentConfig?.standard?.code
    });

    toast({
      title: isCorrect ? "Correct! 🎉" : "Incorrect",
      description: isCorrect ? "Well done!" : currentActivity.explanation,
      duration: 2000,
      variant: isCorrect ? "default" : "destructive"
    });

    setTimeout(loadNextActivity, 3000);
  };

  const handleGameComplete = (gameScore: number) => {
    console.log(`🎮 Game completed with score: ${gameScore}`);
    playCorrectAnswerSound();
    // If games should count towards attempts/correctness for UserProgress:
    // setSessionQuestionsAttempted(prev => prev + 1);
    // setSessionCorrectAnswers(prev => prev + 1); // Assuming game completion is "correct"
    loadNextActivity();
  };

  const sessionData = {
    currentActivity,
    selectedAnswer,
    showResult,
    activityNumber: currentActivityIndex + 1, // Updated
    totalActivities: activityList.length,    // Updated
    correctAnswers,
    isGenerating: isQuestionGenerating || isActivityListLoading, // Updated
    gradeLevel: gradeConfig?.userGrade,
    loadNextActivity, // Updated
    handleAnswerSelect, // For questions
    handleGameComplete // For games
  };

  return <>{children(sessionData)}</>;
};

export default ImprovedSessionManager;
