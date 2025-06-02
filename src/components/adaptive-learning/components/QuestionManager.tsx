
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
        
        // Check if this question has been used before
        if (usedQuestions.includes(newQuestion.question)) {
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
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    
    const currentQuestion = sessionQuestions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion?.correct;
    
    // Give users more time to read the answer and explanation - increased from 1.5s to 5s
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
    }, 5000);

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
    handleAnswerSelect,
    setCurrentQuestionIndex,
    resetQuestions
  };
};
