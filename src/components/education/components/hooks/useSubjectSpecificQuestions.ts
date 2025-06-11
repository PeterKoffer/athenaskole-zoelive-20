
import { useState, useCallback } from 'react';
import { useUnifiedQuestionGeneration } from '@/hooks/useUnifiedQuestionGeneration';
import { useAuth } from '@/hooks/useAuth';

interface UseSubjectSpecificQuestionsProps {
  subject: string;
  skillArea: string;
  usedQuestionIds: string[];
  onQuestionUsed: (questionId: string) => void;
}

export const useSubjectSpecificQuestions = ({
  subject,
  skillArea,
  usedQuestionIds,
  onQuestionUsed
}: UseSubjectSpecificQuestionsProps) => {
  const { user } = useAuth();
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const [sessionQuestions, setSessionQuestions] = useState<string[]>([]);

  // Use the unified question generation system
  const {
    generateUniqueQuestion,
    isGenerating: isUnifiedGenerating,
    currentQuestion
  } = useUnifiedQuestionGeneration({
    subject,
    skillArea,
    difficultyLevel: 3,
    userId: user?.id || 'anonymous',
    gradeLevel: 5,
    maxAttempts: 8, // Increased attempts
    enablePersistence: true
  });

  const generateQuestion = useCallback(async () => {
    if (isGeneratingQuestion || isUnifiedGenerating) {
      console.log('🚫 Question generation already in progress');
      return null;
    }

    setIsGeneratingQuestion(true);
    console.log('🎯 Generating TRULY unique question...', { 
      subject, 
      skillArea, 
      excludeCount: usedQuestionIds.length,
      sessionCount: sessionQuestions.length
    });

    try {
      // Enhanced uniqueness context with more variation
      const uniqueContext = {
        timestamp: Date.now(),
        sessionId: Math.random().toString(36).substring(7),
        attemptNumber: Math.floor(Math.random() * 1000),
        avoidQuestions: [...usedQuestionIds, ...sessionQuestions],
        forceUniqueContent: true,
        diversityLevel: 'maximum',
        variationSeed: Math.floor(Math.random() * 10000),
        sessionQuestionCount: sessionQuestions.length,
        requireDifferentStructure: sessionQuestions.length > 0
      };

      const uniqueQuestion = await generateUniqueQuestion(uniqueContext);
      
      if (!uniqueQuestion) {
        console.warn('⚠️ No unique question generated after multiple attempts');
        return null;
      }

      // Enhanced duplicate checking
      const questionText = uniqueQuestion.question.toLowerCase().trim();
      const isDuplicate = [...usedQuestionIds, ...sessionQuestions].some(used => {
        const usedText = used.toLowerCase().trim();
        // More strict similarity checking
        const similarity = calculateSimilarity(questionText, usedText);
        return similarity > 0.7; // 70% similarity threshold
      });

      if (isDuplicate) {
        console.warn('⚠️ Generated question too similar to existing ones, creating fallback');
        throw new Error('Question too similar');
      }

      // Convert to lesson activity format
      const correctAnswerIndex = (uniqueQuestion as any).correctAnswer ?? 
                                (uniqueQuestion as any).correct_answer ?? 
                                ((uniqueQuestion as any).answer ? parseInt((uniqueQuestion as any).answer.toString()) : 0) ?? 
                                0;

      const dynamicQuestion = {
        id: `unique-${subject}-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        title: `${subject} Practice Question`,
        phase: 'interactive-game' as const,
        duration: 60,
        content: {
          question: uniqueQuestion.question,
          options: uniqueQuestion.options,
          correctAnswer: correctAnswerIndex,
          explanation: uniqueQuestion.explanation || 'Great job working through this problem!'
        }
      };
      
      // Track this question to prevent repetition
      setSessionQuestions(prev => [...prev, uniqueQuestion.question]);
      onQuestionUsed(dynamicQuestion.id);
      
      console.log('✅ Generated UNIQUE question:', {
        id: dynamicQuestion.id,
        question: uniqueQuestion.question.substring(0, 50) + '...',
        options: uniqueQuestion.options.length,
        sessionTotal: sessionQuestions.length + 1
      });
      
      return dynamicQuestion;
      
    } catch (error) {
      console.error('❌ Error generating unique question:', error);
      
      // Create a truly unique fallback with enhanced variation
      const timestamp = Date.now();
      const randomSeed = Math.floor(Math.random() * 100000);
      const sessionVariation = sessionQuestions.length + 1;
      
      // Generate truly unique numbers for math problems
      let num1 = 13 + (randomSeed % 47) + sessionVariation * 3;
      let num2 = 7 + (randomSeed % 23) + sessionVariation * 2;
      const operation = ['+', '-', '*'][randomSeed % 3];
      
      let result, questionText, explanation;
      
      switch (operation) {
        case '+':
          result = num1 + num2;
          questionText = `Explorer Maya found ${num1} ancient coins in treasure chest A. She then discovered ${num2} more coins in treasure chest B. How many coins did Maya find in total?`;
          explanation = `Maya found ${num1} + ${num2} = ${result} coins in total.`;
          break;
        case '-':
          if (num1 < num2) [num1, num2] = [num2, num1]; // Ensure positive result
          result = num1 - num2;
          questionText = `Captain Alex had ${num1} magic crystals. During the adventure, ${num2} crystals were used to power the ship. How many crystals does Alex have left?`;
          explanation = `Alex had ${num1} crystals and used ${num2}, leaving ${num1} - ${num2} = ${result} crystals.`;
          break;
        case '*':
          const smallNum1 = Math.min(num1 % 12 + 1, 12);
          const smallNum2 = Math.min(num2 % 8 + 1, 8);
          result = smallNum1 * smallNum2;
          questionText = `Wizard Sam needs to arrange ${smallNum1} rows of magical potions with ${smallNum2} potions in each row. How many potions are there in total?`;
          explanation = `${smallNum1} rows × ${smallNum2} potions per row = ${result} potions total.`;
          break;
      }
      
      const fallbackQuestion = {
        id: `fallback-${subject}-${timestamp}-${randomSeed}`,
        title: `${subject} Practice Question`,
        phase: 'interactive-game' as const,
        duration: 60,
        content: {
          question: questionText,
          options: [
            result.toString(),
            (result + 1 + (randomSeed % 3)).toString(),
            (result - 1 - (randomSeed % 2)).toString(),
            (result + 5 + (randomSeed % 4)).toString()
          ].sort(() => Math.random() - 0.5), // Randomize option order
          correctAnswer: 0, // Will need to be recalculated after sorting
          explanation
        }
      };
      
      // Find correct answer index after randomization
      const correctIndex = fallbackQuestion.content.options.findIndex(option => option === result.toString());
      fallbackQuestion.content.correctAnswer = correctIndex;
      
      setSessionQuestions(prev => [...prev, questionText]);
      onQuestionUsed(fallbackQuestion.id);
      
      console.log('✅ Generated UNIQUE fallback question:', fallbackQuestion.id);
      return fallbackQuestion;
    } finally {
      setIsGeneratingQuestion(false);
    }
  }, [
    subject, 
    skillArea, 
    usedQuestionIds, 
    onQuestionUsed, 
    isGeneratingQuestion, 
    isUnifiedGenerating,
    generateUniqueQuestion,
    sessionQuestions
  ]);

  // Helper function to calculate text similarity
  const calculateSimilarity = (text1: string, text2: string): number => {
    const words1 = text1.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const words2 = text2.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    
    if (words1.length === 0 || words2.length === 0) return 0;
    
    const commonWords = words1.filter(word => words2.includes(word));
    return commonWords.length / Math.max(words1.length, words2.length);
  };

  return {
    generateQuestion,
    isGeneratingQuestion: isGeneratingQuestion || isUnifiedGenerating,
    sessionQuestionCount: sessionQuestions.length
  };
};
