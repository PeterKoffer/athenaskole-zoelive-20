
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { createFallbackQuestion } from '../utils/fallbackQuestions';

export interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  learningObjectives: string[];
  estimatedTime: number;
  conceptsCovered: string[];
}

interface UseReliableQuestionGenerationProps {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  userId: string;
}

export const useReliableQuestionGeneration = ({ 
  subject, 
  skillArea, 
  difficultyLevel, 
  userId 
}: UseReliableQuestionGenerationProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationAttempts, setGenerationAttempts] = useState(0);
  const [usedQuestionsCache, setUsedQuestionsCache] = useState<string[]>([]);

  const getUsedQuestions = useCallback(async () => {
    try {
      const { data: history } = await supabase
        .from('user_question_history')
        .select('question_text')
        .eq('user_id', userId)
        .eq('subject', subject)
        .eq('skill_area', skillArea)
        .order('asked_at', { ascending: false })
        .limit(100); // Increased to get more history

      const usedQuestions = history?.map(h => h.question_text) || [];
      
      // Also include questions from current session
      const allUsedQuestions = [...new Set([...usedQuestions, ...usedQuestionsCache])];
      
      console.log(`📚 Found ${allUsedQuestions.length} previously used questions for ${subject}/${skillArea}`);
      return allUsedQuestions;
    } catch (error) {
      console.warn('Could not fetch question history:', error);
      return usedQuestionsCache;
    }
  }, [userId, subject, skillArea, usedQuestionsCache]);

  const generateWithAI = useCallback(async (usedQuestions: string[]): Promise<Question | null> => {
    console.log('🤖 Attempting AI generation...');
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-adaptive-content', {
        body: {
          subject,
          skillArea,
          difficultyLevel,
          userId,
          previousQuestions: usedQuestions,
          avoidDuplicates: true
        }
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'AI generation failed');
      if (!data.generatedContent) throw new Error('No content generated');

      const content = data.generatedContent;
      
      // Validate structure
      if (!content.question || !Array.isArray(content.options) || typeof content.correct !== 'number') {
        throw new Error('Invalid content structure');
      }

      // Check if this question was already used
      if (usedQuestions.some(used => used.toLowerCase().trim() === content.question.toLowerCase().trim())) {
        console.log('⚠️ AI generated a duplicate question, rejecting...');
        return null;
      }

      return {
        question: content.question,
        options: content.options,
        correct: content.correct,
        explanation: content.explanation || 'No explanation provided',
        learningObjectives: content.learningObjectives || [],
        estimatedTime: content.estimatedTime || 30,
        conceptsCovered: [skillArea]
      };

    } catch (error) {
      console.error('AI generation failed:', error);
      return null;
    }
  }, [subject, skillArea, difficultyLevel, userId]);

  const generateQuestion = useCallback(async (): Promise<Question> => {
    setIsGenerating(true);
    setGenerationAttempts(prev => prev + 1);

    try {
      const usedQuestions = await getUsedQuestions();
      console.log(`📝 Generation attempt ${generationAttempts + 1}, avoiding ${usedQuestions.length} used questions`);

      // Try AI generation multiple times to avoid duplicates
      for (let attempt = 0; attempt < 3; attempt++) {
        const aiQuestion = await generateWithAI(usedQuestions);
        
        if (aiQuestion && !usedQuestions.includes(aiQuestion.question)) {
          console.log('✅ AI question generated successfully');
          
          // Add to cache to avoid duplicates in same session
          setUsedQuestionsCache(prev => [...prev, aiQuestion.question]);
          
          toast({
            title: "Fresh Question Generated! 🤖",
            description: "Nelie created a new question for you",
            duration: 2000
          });
          return aiQuestion;
        }
        
        console.log(`⚠️ Attempt ${attempt + 1} generated duplicate or invalid question, retrying...`);
      }

      // Fallback to pre-made questions with uniqueness check
      console.log('🔄 AI attempts exhausted, using fallback question');
      let fallbackQuestion = createFallbackQuestion();
      
      // Make fallback unique if needed
      let uniqueQuestionText = fallbackQuestion.question;
      let counter = 1;
      
      while (usedQuestions.some(used => used.toLowerCase().trim() === uniqueQuestionText.toLowerCase().trim())) {
        uniqueQuestionText = `${fallbackQuestion.question} (Version ${counter})`;
        counter++;
      }
      
      if (uniqueQuestionText !== fallbackQuestion.question) {
        fallbackQuestion = {
          ...fallbackQuestion,
          question: uniqueQuestionText
        };
      }

      // Add to cache
      setUsedQuestionsCache(prev => [...prev, fallbackQuestion.question]);

      toast({
        title: "Practice Question Ready",
        description: "Using backup question for continued learning",
        duration: 2000
      });

      return {
        ...fallbackQuestion,
        conceptsCovered: [skillArea]
      };

    } catch (error) {
      console.error('Question generation completely failed:', error);
      
      // Ultimate fallback with timestamp to ensure uniqueness
      const uniqueQuestion = `${subject} practice question - ${new Date().toLocaleTimeString()}`;
      
      return {
        question: uniqueQuestion,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correct: 0,
        explanation: 'This is a basic practice question.',
        learningObjectives: [skillArea],
        estimatedTime: 30,
        conceptsCovered: [skillArea]
      };
    } finally {
      setIsGenerating(false);
    }
  }, [getUsedQuestions, generateWithAI, generationAttempts, subject, skillArea, toast]);

  const saveQuestionHistory = useCallback(async (question: Question, userAnswer: number, isCorrect: boolean, responseTime: number) => {
    try {
      await supabase.from('user_question_history').insert({
        user_id: userId,
        subject,
        skill_area: skillArea,
        question_text: question.question,
        difficulty_level: difficultyLevel,
        concepts_covered: question.conceptsCovered,
        user_answer: userAnswer.toString(),
        correct_answer: question.correct.toString(),
        is_correct: isCorrect,
        response_time_seconds: Math.round(responseTime / 1000)
      });

      console.log('📚 Question history saved');
    } catch (error) {
      console.warn('Could not save question history:', error);
    }
  }, [userId, subject, skillArea, difficultyLevel]);

  return {
    isGenerating,
    generateQuestion,
    saveQuestionHistory,
    generationAttempts
  };
};
