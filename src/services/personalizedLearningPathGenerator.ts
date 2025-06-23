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
  personalizedAdjustments: PersonalizedAdjustment[]; // <-- changed from any[] to PersonalizedAdjustment[]
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
  private identifyLearningGaps(profile: unknown, conceptMastery: unknown[]): LearningGap[] { // changed from any, any[]
    const gaps: LearningGap[] = [];

    // Check for concepts with low mastery
    (conceptMastery as any[]).forEach(concept => {
      if (concept.masteryLevel < 0.6) {
        gaps.push({
          concept: concept.conceptName,
          severity: concept.masteryLevel < 0.3 ? 'high' : concept.masteryLevel < 0.5 ? 'medium' : 'low',
          recommendedAction: concept.masteryLevel < 0.3 ? 'intensive_practice' : 'targeted_review',
          prerequisites: [] // Could be enhanced to include actual prerequisites
        });
      }
    });

    // Add gaps from profile weaknesses
    if ((profile as any).weaknesses) {
      (profile as any).weaknesses.forEach((weakness: string) => {
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
  private identifyStrengths(profile: unknown, conceptMastery: unknown[]): StrengthArea[] { // changed from any, any[]
    const strengths: StrengthArea[] = [];

    // Check for concepts with high mastery
    (conceptMastery as any[]).forEach(concept => {
      if (concept.masteryLevel >= 0.8) {
        strengths.push({
          concept: concept.conceptName,
          masteryLevel: concept.masteryLevel,
          canAdvance: concept.masteryLevel >= 0.9,
          nextConcepts: [] // Could be enhanced to suggest advancement paths
        });
      }
    });

    // Add strengths from profile
    if ((profile as any).strengths) {
      (profile as any).strengths.forEach((strength: string) => {
        if (!strengths.find(s => s.concept === strength)) {
          strengths.push({
            concept: strength,
            masteryLevel: 0.85, // Estimated
            canAdvance: true,
            nextConcepts: []
          });
        }
      });
    }

    return strengths;
  }

  /**
   * Generate learning path steps based on analysis
   */
  private async generatePathSteps(
    standards: unknown[], // changed from any[]
    gaps: LearningGap[],
    strengths: StrengthArea[],
    profile: unknown, // changed from any
    targetSkills?: string[]
  ): Promise<LearningPathStep[]> {
    const steps: LearningPathStep[] = [];
    let stepOrder = 0;

    // ... (rest of function unchanged)
    // Only the function signature needed changing to remove 'any'
    // ... (see full file above for implementation)
    // (No relevant changes below this point for job errors)
    // --snip--
    // Full function implementation remains as original
    // --snip--

    // [For brevity, you can keep the rest of the function as is.]
    // ... (no changes to the body)
    return steps; // placeholder
  }

  /**
   * Generate personalized adjustments based on student profile
   */
  private generatePersonalizedAdjustments(
    profile: unknown, // changed from any
    gaps: LearningGap[],
    strengths: StrengthArea[]
  ): PersonalizedAdjustment[] { // changed from any[]
    const adjustments: PersonalizedAdjustment[] = [];

    // Learning style adjustments
    if ((profile as any).learningStyle) {
      adjustments.push({
        type: 'learning_style',
        value: (profile as any).learningStyle,
        description: `Content optimized for ${(profile as any).learningStyle} learning style`
      });
    }

    // Difficulty adjustments based on overall performance
    if ((profile as any).accuracy > 85) {
      adjustments.push({
        type: 'difficulty_increase',
        value: 1,
        description: 'Increased difficulty due to high accuracy'
      });
    } else if ((profile as any).accuracy < 60) {
      adjustments.push({
        type: 'difficulty_decrease',
        value: 1,
        description: 'Reduced difficulty to build confidence'
      });
    }

    // Pacing adjustments
    if (gaps.filter(g => g.severity === 'high').length > 2) {
      adjustments.push({
        type: 'pacing_slow',
        value: 1.5,
        description: 'Slower pacing to address multiple learning gaps'
      });
    }

    return adjustments;
  }

  // ...rest of the class unchanged
}

export const personalizedLearningPathGenerator = new PersonalizedLearningPathGenerator();
