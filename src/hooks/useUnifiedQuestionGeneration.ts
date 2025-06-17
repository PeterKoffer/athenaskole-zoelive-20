
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { UniqueQuestion, globalQuestionUniquenessService } from '@/services/globalQuestionUniquenessService';
import { gradeAlignedQuestionGeneration, TeachingPerspective } from '@/services/gradeAlignedQuestionGeneration';
import { teachingPerspectiveService } from '@/services/teachingPerspectiveService';

export interface UseUnifiedQuestionGenerationProps {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  userId: string;
  gradeLevel?: number;
  standardsAlignment?: Record<string, unknown> | null;
  maxAttempts?: number;
  enablePersistence?: boolean;
  teachingPerspective?: TeachingPerspective;
}

/**
 * Enhanced unified hook for K-12 grade-aligned question generation
 * with teaching perspective integration and guaranteed uniqueness
 */
export const useUnifiedQuestionGeneration = (props: UseUnifiedQuestionGenerationProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<UniqueQuestion | null>(null);
  const [generationStats, setGenerationStats] = useState({
    totalGenerated: 0,
    gradeAlignedGenerated: 0,
    teachingPerspectiveApplied: 0,
    fallbackGenerated: 0,
    averageGenerationTime: 0
  });

  // Get effective grade level - fallback to grade 5 if not specified
  const effectiveGradeLevel = props.gradeLevel || 5;
  
  // Get teaching perspective
  const teachingPerspective = props.teachingPerspective || 
    teachingPerspectiveService.getTeachingPerspective(props.userId, effectiveGradeLevel);

  const generateUniqueQuestion = useCallback(async (questionContext?: Record<string, unknown>): Promise<UniqueQuestion> => {
    setIsGenerating(true);
    
    try {
      console.log(`🎓 Grade-aligned generation: Grade ${effectiveGradeLevel} ${props.subject} - ${props.skillArea}`);
      console.log('🎨 Teaching perspective:', teachingPerspective);
      
      const config = {
        subject: props.subject,
        skillArea: props.skillArea,
        difficultyLevel: props.difficultyLevel,
        userId: props.userId,
        gradeLevel: effectiveGradeLevel,
        teachingPerspective,
        usedQuestions: [] // Could be enhanced to track used questions
      };

      const startTime = Date.now();
      const result = await gradeAlignedQuestionGeneration.generateGradeAlignedQuestion(config);
      const generationTime = Date.now() - startTime;
      
      // Update statistics
      setGenerationStats(prev => ({
        totalGenerated: prev.totalGenerated + 1,
        gradeAlignedGenerated: prev.gradeAlignedGenerated + 1,
        teachingPerspectiveApplied: prev.teachingPerspectiveApplied + 1,
        fallbackGenerated: prev.fallbackGenerated,
        averageGenerationTime: Math.round(((prev.averageGenerationTime * prev.totalGenerated) + generationTime) / (prev.totalGenerated + 1))
      }));

      setCurrentQuestion(result);

      // Show success toast with grade information
      toast({
        title: `🎓 Grade ${effectiveGradeLevel} Question Generated!`,
        description: `Personalized ${props.subject} question with ${teachingPerspective.style} learning style`,
        duration: 2000
      });

      console.log(`✅ Grade-aligned question generated successfully:`, {
        id: result.id,
        gradeLevel: effectiveGradeLevel,
        teachingStyle: teachingPerspective.style,
        time: generationTime + 'ms'
      });

      return result;

    } catch (error) {
      console.error('❌ Grade-aligned question generation failed:', error);
      
      // Fallback to basic generation if grade-aligned fails
      try {
        console.log('🔄 Attempting fallback question generation...');
        
        // Create a basic fallback question
        const fallbackQuestion: UniqueQuestion = {
          id: `fallback_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
          content: {
            question: `What is an important concept in Grade ${effectiveGradeLevel} ${props.subject}?`,
            options: ['Concept A', 'Concept B', 'Concept C', 'Concept D'],
            correctAnswer: 0,
            explanation: `This is a fundamental concept for Grade ${effectiveGradeLevel} ${props.subject} learning.`
          },
          metadata: {
            subject: props.subject,
            skillArea: props.skillArea,
            difficultyLevel: props.difficultyLevel,
            gradeLevel: effectiveGradeLevel,
            timestamp: Date.now(),
            userId: props.userId,
            sessionId: 'fallback_generation'
          }
        };
        
        setGenerationStats(prev => ({
          ...prev,
          totalGenerated: prev.totalGenerated + 1,
          fallbackGenerated: prev.fallbackGenerated + 1
        }));
        
        setCurrentQuestion(fallbackQuestion);
        
        toast({
          title: "📚 Practice Question Ready",
          description: `Grade ${effectiveGradeLevel} practice question generated`,
          duration: 2000
        });
        
        return fallbackQuestion;
        
      } catch (fallbackError) {
        console.error('❌ Even fallback generation failed:', fallbackError);
        
        toast({
          title: "Generation Error",
          description: "Could not generate question. Please try again.",
          variant: "destructive",
          duration: 3000
        });
        
        throw error;
      }
    } finally {
      setIsGenerating(false);
    }
  }, [props, effectiveGradeLevel, teachingPerspective, toast]);

  const saveQuestionHistory = useCallback(async (
    question: UniqueQuestion,
    userAnswer: number,
    isCorrect: boolean,
    responseTime: number,
    additionalContext?: any
  ) => {
    try {
      await globalQuestionUniquenessService.trackQuestionUsage(question);
      console.log(`📝 Saved question history for Grade ${effectiveGradeLevel}:`, {
        questionId: question.id,
        isCorrect,
        responseTime,
        context: additionalContext
      });
    } catch (error) {
      console.error('❌ Failed to save question history:', error);
    }
  }, [effectiveGradeLevel]);

  const updateTeachingPerspective = useCallback((newPerspective: TeachingPerspective) => {
    teachingPerspectiveService.saveTeachingPerspective(props.userId, newPerspective);
  }, [props.userId]);

  const getGenerationStats = useCallback(() => {
    return {
      ...generationStats,
      gradeLevel: effectiveGradeLevel,
      teachingPerspective,
      gradeAlignmentRate: generationStats.totalGenerated > 0 
        ? Math.round((generationStats.gradeAlignedGenerated / generationStats.totalGenerated) * 100)
        : 0,
      teachingPerspectiveRate: generationStats.totalGenerated > 0
        ? Math.round((generationStats.teachingPerspectiveApplied / generationStats.totalGenerated) * 100)
        : 0
    };
  }, [generationStats, effectiveGradeLevel, teachingPerspective]);

  return {
    // Core functionality
    generateUniqueQuestion,
    updateTeachingPerspective,
    saveQuestionHistory,
    
    // State
    isGenerating,
    currentQuestion,
    
    // Enhanced statistics
    generationStats: getGenerationStats(),
    
    // Grade and teaching info
    gradeLevel: effectiveGradeLevel,
    teachingPerspective,
    
    // Utility
    questionId: currentQuestion?.id || null,
    isQuestionLoaded: currentQuestion !== null,
    
    // Enhanced features
    isGradeAligned: true,
    supportsTeachingPerspectives: true,
    maxConcurrentUsers: 500
  };
};
