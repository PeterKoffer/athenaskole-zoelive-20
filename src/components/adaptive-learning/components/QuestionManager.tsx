
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
}

export interface QuestionManagerData {
  sessionQuestions: Question[];
  currentQuestionIndex: number;
  answers: number[];
  isGenerating: boolean;
  generationError: string | null;
  hasTriedFallback: boolean;
  generateNextQuestion: () => Promise<void>;
  handleAnswerSelect: (selectedAnswer: number, onComplete?: () => void) => void;
  setCurrentQuestionIndex: (index: number | ((prev: number) => number)) => void;
  resetQuestions: () => void;
}

export const useQuestionManager = ({ subject, skillArea, difficultyLevel, userId, totalQuestions }: QuestionManagerProps): QuestionManagerData => {
  const { toast } = useToast();
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [hasTriedFallback, setHasTriedFallback] = useState(false);

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

    console.log('🎯 Generating next question...');
    const usedQuestions = sessionQuestions.map(q => q.question);
    
    try {
      console.log('⏰ Starting AI generation with 30s timeout...');
      const newQuestion = await generateQuestion(usedQuestions);
      
      if (newQuestion) {
        console.log('✅ AI question generated successfully');
        setSessionQuestions(prev => [...prev, newQuestion]);
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
        setSessionQuestions(prev => [...prev, fallbackQuestion]);
        setHasTriedFallback(true);
        
        toast({
          title: "Using Backup Question",
          description: "AI generation failed, using a practice question",
          duration: 3000
        });
      } else {
        console.error('💥 Both AI and fallback failed');
        toast({
          title: "Error",
          description: "Could not generate question. Please try again.",
          variant: "destructive"
        });
      }
    }
  }, [generateQuestion, sessionQuestions, totalQuestions, hasTriedFallback, toast]);

  const handleAnswerSelect = useCallback((selectedAnswer: number, onComplete?: () => void) => {
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    
    const currentQuestion = sessionQuestions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion?.correct;
    
    // Auto-advance to next question after a short delay
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
    }, 1500);

    // Show feedback toast
    toast({
      title: isCorrect ? "Correct!" : "Incorrect",
      description: isCorrect ? "Well done!" : "Try again next time",
      variant: isCorrect ? "default" : "destructive"
    });
  }, [answers, sessionQuestions, currentQuestionIndex, totalQuestions, generateNextQuestion, toast]);

  const resetQuestions = useCallback(() => {
    setCurrentQuestionIndex(0);
    setSessionQuestions([]);
    setAnswers([]);
    setHasTriedFallback(false);
  }, []);

  return {
    sessionQuestions,
    currentQuestionIndex,
    answers,
    isGenerating,
    generationError,
    hasTriedFallback,
    generateNextQuestion,
    handleAnswerSelect,
    setCurrentQuestionIndex,
    resetQuestions
  };
};
