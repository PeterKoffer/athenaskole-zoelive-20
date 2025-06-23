
import { supabase } from '@/integrations/supabase/client';
import { getStandardsByGrade, findStandardByCode } from '@/data/curriculumStandards';
import { userLearningProfileService } from './userLearningProfileService';
import { conceptMasteryService } from './conceptMasteryService';

export interface LearningPathStep {
  id: string;
  title: string;
  description: string;
  standardId: string;
  difficultyLevel: number;
  estimatedMinutes: number;
  prerequisites: string[];
  skills: string[];
  isCompleted: boolean;
  order: number;
}

export interface PersonalizedAdjustment {
  type: string;
  value: unknown;
  description: string;
}

export interface PersonalizedLearningPath {
  id: string;
  userId: string;
  subject: string;
  gradeLevel: number;
  title: string;
  description: string;
  totalSteps: number;
  currentStep: number;
  estimatedCompletionTime: number;
  steps: LearningPathStep[];
  personalizedAdjustments: PersonalizedAdjustment[];
  createdAt: string;
  updatedAt: string;
}

export interface LearningGap {
  concept: string;
  severity: 'low' | 'medium' | 'high';
  recommendedAction: string;
  prerequisites: string[];
}

export interface StrengthArea {
  concept: string;
  masteryLevel: number;
  canAdvance: boolean;
  nextConcepts: string[];
}

class PersonalizedLearningPathGenerator {
  /**
   * Generate a personalized learning path for a student
   */
  async generateLearningPath(
    userId: string,
    subject: string,
    gradeLevel: number,
    targetSkills?: string[]
  ): Promise<PersonalizedLearningPath> {
    console.log(`🎯 Generating personalized learning path for user ${userId}, subject: ${subject}, grade: ${gradeLevel}`);

    try {
      // Get user's learning profile and current performance
      const [profile, conceptMastery] = await Promise.all([
        userLearningProfileService.getLearningProfile(userId, subject),
        conceptMasteryService.getConceptMastery(userId, subject)
      ]);

      // Analyze learning gaps and strengths
      const learningGaps = this.identifyLearningGaps(profile, conceptMastery);
      const strengths = this.identifyStrengths(profile, conceptMastery);

      // Get curriculum standards for the grade level
      const gradeStandards = getStandardsByGrade(gradeLevel);
      const subjectStandards = gradeStandards.filter(s => s.subject === subject);

      // Generate learning path steps based on gaps, strengths, and curriculum
      const steps = await this.generatePathSteps(
        subjectStandards,
        learningGaps,
        strengths,
        profile,
        targetSkills
      );

      // Calculate total estimated time
      const estimatedCompletionTime = steps.reduce((total, step) => total + step.estimatedMinutes, 0);

      // Generate personalized adjustments
      const personalizedAdjustments = this.generatePersonalizedAdjustments(profile, learningGaps, strengths);

      const learningPath: PersonalizedLearningPath = {
        id: `${userId}-${subject}-${Date.now()}`,
        userId,
        subject,
        gradeLevel,
        title: `Personalized ${subject.charAt(0).toUpperCase() + subject.slice(1)} Path`,
        description: `Customized learning journey based on your strengths and areas for improvement`,
        totalSteps: steps.length,
        currentStep: 0,
        estimatedCompletionTime,
        steps,
        personalizedAdjustments,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log(`✅ Generated learning path with ${steps.length} steps`);
      return learningPath;

    } catch (error) {
      console.error('❌ Error generating learning path:', error);
      throw new Error('Failed to generate personalized learning path');
    }
  }

  /**
   * Identify learning gaps based on user performance
   */
  private identifyLearningGaps(profile: unknown, conceptMastery: unknown[]): LearningGap[] {
    const gaps: LearningGap[] = [];

    // Check for concepts with low mastery
    (conceptMastery as Array<{conceptName: string; masteryLevel: number}>).forEach(concept => {
      if (concept.masteryLevel < 0.6) {
        gaps.push({
          concept: concept.conceptName,
          severity: concept.masteryLevel < 0.3 ? 'high' : concept.masteryLevel < 0.5 ? 'medium' : 'low',
          recommendedAction: concept.masteryLevel < 0.3 ? 'intensive_practice' : 'targeted_review',
          prerequisites: []
        });
      }
    });

    // Add gaps from profile weaknesses
    if ((profile as {weaknesses?: string[]}).weaknesses) {
      (profile as {weaknesses: string[]}).weaknesses.forEach((weakness: string) => {
        if (!gaps.find(g => g.concept === weakness)) {
          gaps.push({
            concept: weakness,
            severity: 'medium',
            recommendedAction: 'focused_practice',
            prerequisites: []
          });
        }
      });
    }

    return gaps;
  }

  /**
   * Identify strength areas where student can advance
   */
  private identifyStrengths(profile: unknown, conceptMastery: unknown[]): StrengthArea[] {
    const strengths: StrengthArea[] = [];

    // Check for concepts with high mastery
    (conceptMastery as Array<{conceptName: string; masteryLevel: number}>).forEach(concept => {
      if (concept.masteryLevel >= 0.8) {
        strengths.push({
          concept: concept.conceptName,
          masteryLevel: concept.masteryLevel,
          canAdvance: concept.masteryLevel >= 0.9,
          nextConcepts: []
        });
      }
    });

    return strengths;
  }

  /**
   * Generate learning path steps
   */
  private async generatePathSteps(
    standards: any[],
    gaps: LearningGap[],
    strengths: StrengthArea[],
    profile: unknown,
    targetSkills?: string[]
  ): Promise<LearningPathStep[]> {
    const steps: LearningPathStep[] = [];

    // Generate steps based on learning gaps (priority items)
    gaps.forEach((gap, index) => {
      steps.push({
        id: `gap-${index}`,
        title: `Master ${gap.concept}`,
        description: `Address learning gap in ${gap.concept}`,
        standardId: '',
        difficultyLevel: gap.severity === 'high' ? 2 : gap.severity === 'medium' ? 3 : 4,
        estimatedMinutes: 30,
        prerequisites: gap.prerequisites,
        skills: [gap.concept],
        isCompleted: false,
        order: index
      });
    });

    return steps;
  }

  /**
   * Generate personalized adjustments
   */
  private generatePersonalizedAdjustments(
    profile: unknown, 
    gaps: LearningGap[], 
    strengths: StrengthArea[]
  ): PersonalizedAdjustment[] {
    const adjustments: PersonalizedAdjustment[] = [];

    // Add adjustment based on learning style
    if ((profile as {learningStyle?: string}).learningStyle) {
      adjustments.push({
        type: 'learning_style',
        value: (profile as {learningStyle: string}).learningStyle,
        description: `Content adapted for ${(profile as {learningStyle: string}).learningStyle} learning style`
      });
    }

    return adjustments;
  }
}

export const personalizedLearningPathGenerator = new PersonalizedLearningPathGenerator();
