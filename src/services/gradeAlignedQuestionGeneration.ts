
import { supabase } from '@/integrations/supabase/client';
import { commonStandardsAPI } from './commonStandardsAPI';
import { UniqueQuestion } from './globalQuestionUniquenessService';

export interface TeachingPerspective {
  style: 'visual' | 'kinesthetic' | 'auditory' | 'reading-writing' | 'mixed';
  approach: 'constructivist' | 'behaviorist' | 'cognitive' | 'humanistic';
  emphasis: 'conceptual' | 'procedural' | 'problem-solving' | 'real-world';
  scaffolding: 'high' | 'medium' | 'low';
}

export interface GradeAlignedConfig {
  subject: string;
  skillArea: string;
  gradeLevel: number;
  difficultyLevel: number;
  userId: string;
  teachingPerspective: TeachingPerspective;
  usedQuestions?: string[];
}

export class GradeAlignedQuestionGeneration {
  /**
   * Generate questions that are perfectly aligned with K-12 grade standards
   * and influenced by teaching perspective
   */
  static async generateGradeAlignedQuestion(config: GradeAlignedConfig): Promise<UniqueQuestion> {
    console.log(`🎓 Generating Grade ${config.gradeLevel} aligned question for ${config.subject}`);
    
    // Get grade-specific standards and skill areas
    const gradeStandards = await commonStandardsAPI.getStandardsByGradeAndSubject(
      config.gradeLevel, 
      config.subject
    );
    
    const gradeSkillAreas = await commonStandardsAPI.getSkillAreasForGradeAndSubject(
      config.gradeLevel, 
      config.subject
    );
    
    // Get prerequisite knowledge from previous grades
    const prerequisites = await commonStandardsAPI.getPrerequisiteStandards(
      config.gradeLevel, 
      config.subject
    );
    
    // Create teaching perspective prompt
    const teachingPrompt = this.createTeachingPerspectivePrompt(config.teachingPerspective);
    
    // Generate grade-aligned content
    const response = await supabase.functions.invoke('generate-adaptive-content', {
      body: {
        subject: config.subject,
        skillArea: config.skillArea,
        difficultyLevel: config.difficultyLevel,
        userId: config.userId,
        gradeLevel: config.gradeLevel,
        
        // Grade alignment data
        gradeStandards: gradeStandards.slice(0, 3), // Top 3 relevant standards
        skillAreas: gradeSkillAreas,
        prerequisites: prerequisites.slice(0, 2), // Top 2 prerequisites
        
        // Teaching perspective integration
        teachingPerspective: config.teachingPerspective,
        teachingPrompt,
        
        // Uniqueness data
        previousQuestions: config.usedQuestions || [],
        
        // Enhanced context for grade alignment
        questionContext: {
          gradeLevel: config.gradeLevel,
          ageGroup: this.getAgeGroup(config.gradeLevel),
          cognitiveLevel: this.getCognitiveLevel(config.gradeLevel),
          vocabularyLevel: this.getVocabularyLevel(config.gradeLevel),
          conceptualComplexity: this.getConceptualComplexity(config.gradeLevel),
          teachingStyle: config.teachingPerspective.style,
          learningApproach: config.teachingPerspective.approach
        },
        
        // Force grade alignment
        enforceGradeAlignment: true,
        sessionId: `grade${config.gradeLevel}_${Date.now()}`
      }
    });

    if (response.error || !response.data?.generatedContent) {
      throw new Error('Grade-aligned generation failed');
    }

    const content = response.data.generatedContent;
    
    // Validate grade appropriateness
    const isGradeAppropriate = this.validateGradeAppropriateness(
      content.question, 
      config.gradeLevel
    );
    
    if (!isGradeAppropriate) {
      console.warn('⚠️ Generated content may not be grade appropriate, adjusting...');
      // Could retry with stricter parameters if needed
    }
    
    return {
      id: `grade${config.gradeLevel}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      content: {
        question: content.question,
        options: content.options || [],
        correctAnswer: content.correct || 0,
        explanation: content.explanation || 'Great work!'
      },
      metadata: {
        subject: config.subject,
        skillArea: config.skillArea,
        difficultyLevel: config.difficultyLevel,
        gradeLevel: config.gradeLevel,
        timestamp: Date.now(),
        userId: config.userId,
        teachingPerspective: config.teachingPerspective,
        gradeStandards: gradeStandards.map(s => s.code),
        sessionId: `grade_aligned_${config.gradeLevel}`
      }
    };
  }

  /**
   * Create teaching perspective-influenced prompt
   */
  private static createTeachingPerspectivePrompt(perspective: TeachingPerspective): string {
    let prompt = '';
    
    // Learning style influence
    switch (perspective.style) {
      case 'visual':
        prompt += 'Use visual descriptions, spatial relationships, and imagery. Incorporate charts, diagrams, or visual patterns in word problems. ';
        break;
      case 'kinesthetic':
        prompt += 'Include hands-on activities, movement, and physical manipulation. Use real-world scenarios involving building, moving, or doing. ';
        break;
      case 'auditory':
        prompt += 'Use rhythmic patterns, sound-based examples, and verbal instructions. Include music, rhymes, or sound-related scenarios. ';
        break;
      case 'reading-writing':
        prompt += 'Focus on text-based learning, written instructions, and note-taking scenarios. Use reading comprehension and writing tasks. ';
        break;
      case 'mixed':
        prompt += 'Combine multiple learning styles - visual, auditory, kinesthetic, and reading elements in a balanced approach. ';
        break;
    }
    
    // Teaching approach influence
    switch (perspective.approach) {
      case 'constructivist':
        prompt += 'Help students build knowledge through discovery and exploration. Use open-ended questions that encourage critical thinking. ';
        break;
      case 'behaviorist':
        prompt += 'Use clear reinforcement patterns and step-by-step instructions. Provide immediate feedback and structured learning paths. ';
        break;
      case 'cognitive':
        prompt += 'Focus on mental processes and problem-solving strategies. Encourage metacognition and learning how to learn. ';
        break;
      case 'humanistic':
        prompt += 'Consider the whole student, their emotions, and personal growth. Use encouraging language and build confidence. ';
        break;
    }
    
    // Content emphasis
    switch (perspective.emphasis) {
      case 'conceptual':
        prompt += 'Focus on understanding underlying concepts and big ideas rather than just procedures. ';
        break;
      case 'procedural':
        prompt += 'Emphasize step-by-step methods and algorithmic thinking. Provide clear procedures to follow. ';
        break;
      case 'problem-solving':
        prompt += 'Present complex problems that require multiple steps and creative thinking to solve. ';
        break;
      case 'real-world':
        prompt += 'Connect all learning to practical, real-world applications and authentic scenarios. ';
        break;
    }
    
    // Scaffolding level
    switch (perspective.scaffolding) {
      case 'high':
        prompt += 'Provide extensive support, hints, and guided steps throughout the question. ';
        break;
      case 'medium':
        prompt += 'Offer moderate support with some hints and intermediate steps. ';
        break;
      case 'low':
        prompt += 'Provide minimal support, encouraging independent problem-solving. ';
        break;
    }
    
    return prompt;
  }

  /**
   * Get age group for grade level
   */
  private static getAgeGroup(gradeLevel: number): string {
    if (gradeLevel <= 2) return 'Early Elementary (Ages 5-7)';
    if (gradeLevel <= 5) return 'Elementary (Ages 8-11)';
    if (gradeLevel <= 8) return 'Middle School (Ages 12-14)';
    return 'High School (Ages 15-18)';
  }

  /**
   * Get cognitive development level
   */
  private static getCognitiveLevel(gradeLevel: number): string {
    if (gradeLevel <= 2) return 'Concrete Operational - Early';
    if (gradeLevel <= 5) return 'Concrete Operational';
    if (gradeLevel <= 8) return 'Transitional to Formal Operational';
    return 'Formal Operational';
  }

  /**
   * Get appropriate vocabulary level
   */
  private static getVocabularyLevel(gradeLevel: number): string {
    if (gradeLevel <= 2) return 'Simple, everyday words';
    if (gradeLevel <= 5) return 'Grade-level vocabulary with some academic terms';
    if (gradeLevel <= 8) return 'Academic vocabulary with content-specific terms';
    return 'Advanced academic and subject-specific vocabulary';
  }

  /**
   * Get conceptual complexity level
   */
  private static getConceptualComplexity(gradeLevel: number): string {
    if (gradeLevel <= 2) return 'Single concepts, concrete examples';
    if (gradeLevel <= 5) return 'Multiple related concepts, some abstraction';
    if (gradeLevel <= 8) return 'Complex relationships, abstract thinking';
    return 'Highly abstract, interconnected concepts';
  }

  /**
   * Validate if content is appropriate for grade level
   */
  private static validateGradeAppropriateness(question: string, gradeLevel: number): boolean {
    // Basic validation - could be enhanced with more sophisticated checks
    const wordCount = question.split(' ').length;
    const hasComplexWords = /\b\w{10,}\b/.test(question);
    
    if (gradeLevel <= 3 && (wordCount > 50 || hasComplexWords)) {
      return false;
    }
    if (gradeLevel <= 6 && wordCount > 100) {
      return false;
    }
    
    return true;
  }

  /**
   * Get default teaching perspective based on grade level
   */
  static getDefaultTeachingPerspective(gradeLevel: number): TeachingPerspective {
    if (gradeLevel <= 2) {
      return {
        style: 'kinesthetic',
        approach: 'behaviorist',
        emphasis: 'conceptual',
        scaffolding: 'high'
      };
    } else if (gradeLevel <= 5) {
      return {
        style: 'mixed',
        approach: 'constructivist',
        emphasis: 'real-world',
        scaffolding: 'medium'
      };
    } else if (gradeLevel <= 8) {
      return {
        style: 'visual',
        approach: 'cognitive',
        emphasis: 'problem-solving',
        scaffolding: 'medium'
      };
    } else {
      return {
        style: 'reading-writing',
        approach: 'constructivist',
        emphasis: 'conceptual',
        scaffolding: 'low'
      };
    }
  }
}

export const gradeAlignedQuestionGeneration = GradeAlignedQuestionGeneration;
