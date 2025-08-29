// @ts-nocheck
import { supabase } from '@/lib/supabaseClient';
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
  personalizedAdjustments: any[];
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
  private identifyLearningGaps(profile: any, conceptMastery: any[]): LearningGap[] {
    const gaps: LearningGap[] = [];

    // Check for concepts with low mastery
    conceptMastery.forEach(concept => {
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
    if (profile.weaknesses) {
      profile.weaknesses.forEach((weakness: string) => {
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
  private identifyStrengths(profile: any, conceptMastery: any[]): StrengthArea[] {
    const strengths: StrengthArea[] = [];

    // Check for concepts with high mastery
    conceptMastery.forEach(concept => {
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
    if (profile.strengths) {
      profile.strengths.forEach((strength: string) => {
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
    standards: any[],
    gaps: LearningGap[],
    strengths: StrengthArea[],
    profile: any,
    targetSkills?: string[]
  ): Promise<LearningPathStep[]> {
    const steps: LearningPathStep[] = [];
    let stepOrder = 0;

    // First, address critical gaps (high severity)
    const criticalGaps = gaps.filter(g => g.severity === 'high');
    for (const gap of criticalGaps) {
      const standard = standards.find(s => 
        s.title.toLowerCase().includes(gap.concept.toLowerCase()) ||
        s.description.toLowerCase().includes(gap.concept.toLowerCase())
      );

      if (standard) {
        steps.push({
          id: `step-${stepOrder}`,
          title: `Foundation: ${gap.concept}`,
          description: `Build strong foundation in ${gap.concept}`,
          standardId: standard.id,
          difficultyLevel: Math.max(1, standard.difficulty - 1), // Reduce difficulty for gaps
          estimatedMinutes: 45, // More time for foundation building
          prerequisites: gap.prerequisites,
          skills: [gap.concept],
          isCompleted: false,
          order: stepOrder++
        });
      }
    }

    // Then, address medium priority gaps
    const mediumGaps = gaps.filter(g => g.severity === 'medium');
    for (const gap of mediumGaps) {
      const standard = standards.find(s => 
        s.title.toLowerCase().includes(gap.concept.toLowerCase()) ||
        s.description.toLowerCase().includes(gap.concept.toLowerCase())
      );

      if (standard) {
        steps.push({
          id: `step-${stepOrder}`,
          title: `Strengthen: ${gap.concept}`,
          description: `Improve understanding of ${gap.concept}`,
          standardId: standard.id,
          difficultyLevel: standard.difficulty,
          estimatedMinutes: 30,
          prerequisites: gap.prerequisites,
          skills: [gap.concept],
          isCompleted: false,
          order: stepOrder++
        });
      }
    }

    // Add grade-level standards that aren't gaps
    const remainingStandards = standards.filter(standard => 
      !gaps.some(gap => 
        standard.title.toLowerCase().includes(gap.concept.toLowerCase()) ||
        standard.description.toLowerCase().includes(gap.concept.toLowerCase())
      )
    );

    for (const standard of remainingStandards.slice(0, 8)) { // Limit to prevent overly long paths
      steps.push({
        id: `step-${stepOrder}`,
        title: standard.title,
        description: standard.description,
        standardId: standard.id,
        difficultyLevel: standard.difficulty,
        estimatedMinutes: 25,
        prerequisites: [],
        skills: [standard.domain || 'general'],
        isCompleted: false,
        order: stepOrder++
      });
    }

    // Finally, add advancement opportunities for strengths
    const advancementOpportunities = strengths.filter(s => s.canAdvance);
    for (const strength of advancementOpportunities.slice(0, 3)) { // Limit advancement steps
      const relatedStandard = standards.find(s => 
        s.title.toLowerCase().includes(strength.concept.toLowerCase()) ||
        s.description.toLowerCase().includes(strength.concept.toLowerCase())
      );

      if (relatedStandard) {
        steps.push({
          id: `step-${stepOrder}`,
          title: `Advanced: ${strength.concept}`,
          description: `Explore advanced concepts in ${strength.concept}`,
          standardId: relatedStandard.id,
          difficultyLevel: Math.min(10, relatedStandard.difficulty + 1), // Increase difficulty for strengths
          estimatedMinutes: 35,
          prerequisites: [strength.concept],
          skills: [strength.concept],
          isCompleted: false,
          order: stepOrder++
        });
      }
    }

    return steps;
  }

  /**
   * Generate personalized adjustments based on student profile
   */
  private generatePersonalizedAdjustments(
    profile: any,
    gaps: LearningGap[],
    strengths: StrengthArea[]
  ): any[] {
    const adjustments: any[] = [];

    // Learning style adjustments
    if (profile.learningStyle) {
      adjustments.push({
        type: 'learning_style',
        value: profile.learningStyle,
        description: `Content optimized for ${profile.learningStyle} learning style`
      });
    }

    // Difficulty adjustments based on overall performance
    if (profile.accuracy > 85) {
      adjustments.push({
        type: 'difficulty_increase',
        value: 1,
        description: 'Increased difficulty due to high accuracy'
      });
    } else if (profile.accuracy < 60) {
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

  /**
   * Update learning path progress
   */
  async updatePathProgress(
    pathId: string,
    stepId: string,
    completed: boolean,
    score?: number
  ): Promise<void> {
    console.log(`Updating path progress: ${pathId}, step: ${stepId}, completed: ${completed}`);
    
    try {
      // This would typically update the database
      // For now, just log the update
      console.log('Path progress updated successfully');
    } catch (error) {
      console.error('Error updating path progress:', error);
      throw new Error('Failed to update learning path progress');
    }
  }

  /**
   * Get learning path for a user
   */
  async getLearningPath(userId: string, subject: string): Promise<PersonalizedLearningPath | null> {
    console.log(`Getting learning path for user: ${userId}, subject: ${subject}`);
    
    try {
      // This would typically query the database
      // For now, return null to trigger path generation
      return null;
    } catch (error) {
      console.error('Error getting learning path:', error);
      return null;
    }
  }
}

export const personalizedLearningPathGenerator = new PersonalizedLearningPathGenerator();
