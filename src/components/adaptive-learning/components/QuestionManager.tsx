import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuestionGeneration, Question } from "../hooks/useQuestionGeneration";
import { createFallbackQuestion } from "../utils/fallbackQuestions";

export interface QuestionManagerProps {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  userId: string;
  totalQuestions: number;
  allowRecap?: boolean; // New prop to enable recap questions
}

export interface QuestionManagerData {
  sessionQuestions: Question[];
  currentQuestionIndex: number;
  answers: number[];
  isGenerating: boolean;
  generationError: string | null;
  hasTriedFallback: boolean;
  generateNextQuestion: () => Promise<void>;
  generateRecapQuestion: () => Promise<void>; // New method for recap questions
  handleAnswerSelect: (selectedAnswer: number, onComplete?: () => void) => void;
  setCurrentQuestionIndex: (index: number | ((prev: number) => number)) => void;
  resetQuestions: () => void;
}

export const useQuestionManager = ({ subject, skillArea, difficultyLevel, userId, totalQuestions, allowRecap = false }: QuestionManagerProps): QuestionManagerData => {
  const { toast } = useToast();
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [hasTriedFallback, setHasTriedFallback] = useState(false);
  const [questionAttempts, setQuestionAttempts] = useState<Set<string>>(new Set());

  const { 
    generateQuestion, 
    isGenerating, 
    error: generationError 
  } = useQuestionGeneration({
    subject,
    skillArea,
    difficultyLevel,
    userId
  });

  const generateNextQuestion = useCallback(async () => {
    if (sessionQuestions.length >= totalQuestions) {
      console.log('🛑 Already have enough questions');
      return;
    }

    console.log('🎯 Generating next question for subject:', subject);
    
    // Create a comprehensive list of used questions to ensure uniqueness
    const usedQuestions = Array.from(new Set([
      ...sessionQuestions.map(q => q.question),
      ...Array.from(questionAttempts)
    ]));
    
    console.log('📋 Used questions count:', usedQuestions.length);
    
    try {
      console.log('⏰ Starting AI generation with 30s timeout...');
      const newQuestion = await generateQuestion(usedQuestions);
      
      if (newQuestion) {
        console.log('✅ AI question generated successfully:', newQuestion.question);
        
        // Check if this question has been used before (unless it's a recap question)
        const currentQuestion = newQuestion as Question & { isRecap?: boolean };
        if (!currentQuestion.isRecap && usedQuestions.includes(newQuestion.question)) {
          console.log('⚠️ Duplicate question detected, retrying...');
          // Add to attempts and try again
          setQuestionAttempts(prev => new Set([...prev, newQuestion.question]));
          
          if (usedQuestions.length < 10) { // Prevent infinite loops
            return generateNextQuestion();
          }
        }
        
        setSessionQuestions(prev => [...prev, newQuestion]);
        setQuestionAttempts(prev => new Set([...prev, newQuestion.question]));
        setHasTriedFallback(false);
      } else {
        console.log('⚠️ AI generation returned null, trying fallback...');
        throw new Error('AI generation returned null');
      }
    } catch (error) {
      console.error('❌ AI generation failed:', error);
      
      if (!hasTriedFallback) {
        console.log('🔄 Using fallback question due to AI failure...');
        const fallbackQuestion = createFallbackQuestion();
        
        // Ensure fallback is unique too
        if (!usedQuestions.includes(fallbackQuestion.question)) {
          setSessionQuestions(prev => [...prev, fallbackQuestion]);
          setQuestionAttempts(prev => new Set([...prev, fallbackQuestion.question]));
          setHasTriedFallback(true);
          
          toast({
            title: "Using Backup Question",
            description: "AI generation failed, using a practice question",
            duration: 3000
          });
        } else {
          console.log('⚠️ Even fallback question is duplicate, creating unique one...');
          const uniqueFallback = {
            ...fallbackQuestion,
            question: `${fallbackQuestion.question} (Question ${sessionQuestions.length + 1})`
          };
          setSessionQuestions(prev => [...prev, uniqueFallback]);
          setHasTriedFallback(true);
        }
      } else {
        console.error('💥 Both AI and fallback failed');
        toast({
          title: "Error",
          description: "Could not generate unique question. Please try again.",
          variant: "destructive"
        });
      }
    }
  }, [generateQuestion, sessionQuestions, totalQuestions, hasTriedFallback, toast, subject, questionAttempts]);

  const handleAnswerSelect = useCallback((selectedAnswer: number, onComplete?: () => void) => {
    const currentQuestion = sessionQuestions[currentQuestionIndex];
    
    if (!currentQuestion) {
      console.error('❌ No current question available for answer validation');
      return;
    }

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    
    // Fix the answer validation logic
    const isCorrect = selectedAnswer === currentQuestion.correct;
    
    console.log('🎯 Answer validation:', {
      selectedAnswer,
      correctAnswer: currentQuestion.correct,
      isCorrect,
      question: currentQuestion.question
    });
    
    // Show immediate feedback
    toast({
      title: isCorrect ? "Correct!" : "Incorrect",
      description: isCorrect ? "Well done!" : `The correct answer was: ${currentQuestion.options[currentQuestion.correct]}`,
      variant: isCorrect ? "default" : "destructive",
      duration: 3000
    });
    
    // Only proceed to next question after explanation time - reduced to 2s to speed up lesson flow
    setTimeout(() => {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      
      // Generate next question if needed
      if (nextIndex < totalQuestions && sessionQuestions.length <= nextIndex) {
        generateNextQuestion();
      }
      
      // Complete session if this was the last question
      if (nextIndex >= totalQuestions && onComplete) {
        onComplete();
      }
    }, 2000);

  }, [answers, sessionQuestions, currentQuestionIndex, totalQuestions, generateNextQuestion, toast]);

  const generateRecapQuestion = useCallback(async () => {
    if (!allowRecap) {
      console.log('🚫 Recap not enabled for this session');
      return;
    }

    console.log('🔄 Generating recap question for subject:', subject);
    
    try {
      // For now, just use a fallback question marked as recap
      const recapQuestion: Question = {
        ...createFallbackQuestion(),
        isRecap: true
      };

      setSessionQuestions(prev => [...prev, recapQuestion]);
      
      toast({
        title: "Recap Question Ready",
        description: "Let's review what you've learned!",
        duration: 3000
      });
      
      console.log('✅ Recap question generated:', recapQuestion.question);
    } catch (error) {
      console.error('❌ Failed to generate recap question:', error);
      toast({
        title: "Recap Error",
        description: "Could not generate recap question",
        variant: "destructive"
      });
    }
  }, [allowRecap, subject, toast]);

  const resetQuestions = useCallback(() => {
    setCurrentQuestionIndex(0);
    setSessionQuestions([]);
    setAnswers([]);
    setHasTriedFallback(false);
    setQuestionAttempts(new Set());
  }, []);

  return {
    sessionQuestions,
    currentQuestionIndex,
    answers,
    isGenerating,
    generationError,
    hasTriedFallback,
    generateNextQuestion,
    generateRecapQuestion,
    handleAnswerSelect,
    setCurrentQuestionIndex,
    resetQuestions
  };
};
