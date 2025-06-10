import { userLearningProfileService } from '@/services/userLearningProfileService';
import { conceptMasteryService } from '@/services/conceptMasteryService';
import { getStandardsForGrade, getPrerequisiteStandards, findStandardById } from '@/data/curriculumStandards';
import type { CommonStandard } from '@/types/gradeStandards';

export interface PersonalizedLearningPath {
  id: string;
  userId: string;
  gradeLevel: number;
  currentLevel: PersonalizedLevel;
  targetLevel: PersonalizedLevel;
  learningSequence: LearningStep[];
  estimatedTimeWeeks: number;
  adaptationReasons: AdaptationReason[];
  createdAt: string;
  updatedAt: string;
}

export interface PersonalizedLevel {
  gradeLevel: number;
  masteryPercentage: number;
  strengthAreas: string[];
  growthAreas: string[];
  readinessIndicators: ReadinessIndicator[];
}

export interface LearningStep {
  id: string;
  standardId: string;
  standard: CommonStandard;
  prerequisitesMet: boolean;
  estimatedWeeks: number;
  priority: 'high' | 'medium' | 'low';
  adaptations: StepAdaptation[];
  completionCriteria: CompletionCriterion[];
  status: 'not_started' | 'in_progress' | 'mastered' | 'needs_review';
}

export interface StepAdaptation {
  type: 'difficulty' | 'pace' | 'method' | 'support';
  description: string;
  rationale: string;
}

export interface CompletionCriterion {
  type: 'accuracy' | 'consistency' | 'application' | 'understanding';
  threshold: number;
  description: string;
}

export interface ReadinessIndicator {
  area: string;
  ready: boolean;
  evidenceScore: number;
  gaps: string[];
}

export interface AdaptationReason {
  type: 'acceleration' | 'remediation' | 'differentiation' | 'accommodation';
  description: string;
  evidenceBased: string[];
}

class PersonalizedLearningPathGenerator {
  /**
   * Generate a personalized learning path for a student
   */
  async generateLearningPath(
    userId: string,
    gradeLevel: number,
    subjects: string[] = ['mathematics', 'english']
  ): Promise<PersonalizedLearningPath> {
    console.log(`🎯 Generating personalized learning path for user ${userId}, grade ${gradeLevel}`);

    // Gather student data
    const [profile, conceptMastery, recentPerformance] = await Promise.all([
      userLearningProfileService.getUserLearningProfile(userId),
      conceptMasteryService.getConceptMastery(userId),
      this.getRecentPerformanceData(userId)
    ]);

    // Analyze current level across subjects
    const currentLevel = await this.assessCurrentLevel(userId, gradeLevel, subjects, profile, conceptMastery);
    
    // Determine target level based on potential and growth trajectory
    const targetLevel = this.determineTargetLevel(currentLevel, profile, recentPerformance);
    
    // Generate learning sequence
    const learningSequence = await this.generateLearningSequence(
      userId,
      currentLevel,
      targetLevel,
      subjects,
      conceptMastery
    );

    // Calculate estimated time
    const estimatedTimeWeeks = this.calculateEstimatedTime(learningSequence);

    // Document adaptation reasons
    const adaptationReasons = this.documentAdaptationReasons(currentLevel, targetLevel, profile);

    const path: PersonalizedLearningPath = {
      id: `${userId}-path-${Date.now()}`,
      userId,
      gradeLevel,
      currentLevel,
      targetLevel,
      learningSequence,
      estimatedTimeWeeks,
      adaptationReasons,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log(`✅ Generated personalized path with ${learningSequence.length} learning steps`);
    return path;
  }

  /**
   * Assess student's current level across subjects
   */
  private async assessCurrentLevel(
    userId: string,
    gradeLevel: number,
    subjects: string[],
    profile: any,
    conceptMastery: any[]
  ): Promise<PersonalizedLevel> {
    const strengthAreas: string[] = [];
    const growthAreas: string[] = [];
    const readinessIndicators: ReadinessIndicator[] = [];

    let totalMastery = 0;
    let totalConcepts = 0;

    // Analyze each subject
    for (const subject of subjects) {
      const subjectStandards = getStandardsForGrade(gradeLevel, subject);
      const subjectMastery = conceptMastery.filter(cm => 
        this.isConceptRelatedToSubject(cm.conceptName, subject)
      );

      // Calculate subject mastery percentage
      let subjectMasterySum = 0;
      let subjectConceptCount = 0;

      subjectStandards.forEach(standard => {
        const relatedMastery = subjectMastery.find(sm => 
          this.isConceptRelatedToStandard(sm.conceptName, standard)
        );
        
        if (relatedMastery) {
          subjectMasterySum += relatedMastery.masteryLevel;
          subjectConceptCount += 1;
        }
        totalConcepts += 1;
      });

      const subjectMasteryPercent = subjectConceptCount > 0 ? 
        (subjectMasterySum / subjectConceptCount) * 100 : 0;

      totalMastery += subjectMasterySum;

      // Identify strengths and growth areas
      if (subjectMasteryPercent >= 80) {
        strengthAreas.push(subject);
      } else if (subjectMasteryPercent < 60) {
        growthAreas.push(subject);
      }

      // Assess readiness for next level concepts
      const readiness = this.assessReadinessForSubject(subject, gradeLevel, conceptMastery);
      readinessIndicators.push(readiness);
    }

    const overallMasteryPercent = totalConcepts > 0 ? (totalMastery / totalConcepts) * 100 : 0;

    return {
      gradeLevel,
      masteryPercentage: overallMasteryPercent,
      strengthAreas,
      growthAreas,
      readinessIndicators
    };
  }

  /**
   * Determine target level based on student's potential
   */
  private determineTargetLevel(
    currentLevel: PersonalizedLevel,
    profile: any,
    recentPerformance: any
  ): PersonalizedLevel {
    const currentGrade = currentLevel.gradeLevel;
    let targetGrade = currentGrade;
    let targetMastery = Math.min(85, currentLevel.masteryPercentage + 15); // Aim for 15% improvement

    // Check if student is ready for acceleration
    if (currentLevel.masteryPercentage >= 85 && 
        currentLevel.growthAreas.length === 0 &&
        profile?.overall_accuracy >= 85) {
      // Consider advancing to next grade level content
      targetGrade = Math.min(12, currentGrade + 1);
      targetMastery = 75; // Lower initial mastery expectation for advanced content
    }

    // Check if student needs remediation
    if (currentLevel.masteryPercentage < 50 || 
        currentLevel.growthAreas.length > currentLevel.strengthAreas.length) {
      // May need to reinforce previous grade concepts
      targetMastery = Math.max(70, currentLevel.masteryPercentage + 20); // Focus on substantial improvement
    }

    return {
      gradeLevel: targetGrade,
      masteryPercentage: targetMastery,
      strengthAreas: [...currentLevel.strengthAreas], // Build on strengths
      growthAreas: currentLevel.growthAreas.slice(0, 2), // Focus on top 2 growth areas
      readinessIndicators: this.projectReadinessIndicators(currentLevel.readinessIndicators, targetGrade)
    };
  }

  /**
   * Generate the learning sequence of steps
   */
  private async generateLearningSequence(
    userId: string,
    currentLevel: PersonalizedLevel,
    targetLevel: PersonalizedLevel,
    subjects: string[],
    conceptMastery: any[]
  ): Promise<LearningStep[]> {
    const learningSteps: LearningStep[] = [];

    // Start with remediation steps if needed
    if (currentLevel.masteryPercentage < 60) {
      const mediationSteps = await this.generateRemediationSteps(
        userId, 
        currentLevel.gradeLevel, 
        subjects, 
        conceptMastery
      );
      learningSteps.push(...mediationSteps);
    }

    // Add current grade level steps
    const currentGradeSteps = await this.generateGradeLevelSteps(
      userId,
      currentLevel.gradeLevel,
      subjects,
      conceptMastery
    );
    learningSteps.push(...currentGradeSteps);

    // Add advanced steps if targeting higher grade
    if (targetLevel.gradeLevel > currentLevel.gradeLevel) {
      const advancedSteps = await this.generateAdvancedSteps(
        userId,
        targetLevel.gradeLevel,
        subjects,
        conceptMastery
      );
      learningSteps.push(...advancedSteps);
    }

    // Sort by priority and prerequisites
    return this.sequenceLearningSteps(learningSteps);
  }

  /**
   * Generate remediation steps for foundational concepts
   */
  private async generateRemediationSteps(
    userId: string,
    gradeLevel: number,
    subjects: string[],
    conceptMastery: any[]
  ): Promise<LearningStep[]> {
    const remediationSteps: LearningStep[] = [];
    const remediationGrade = Math.max(1, gradeLevel - 1);

    for (const subject of subjects) {
      const previousStandards = getStandardsForGrade(remediationGrade, subject);
      
      for (const standard of previousStandards) {
        const mastery = conceptMastery.find(cm => 
          this.isConceptRelatedToStandard(cm.conceptName, standard)
        );

        if (!mastery || mastery.masteryLevel < 0.7) {
          const step: LearningStep = {
            id: `remediation-${standard.id}`,
            standardId: standard.id,
            standard,
            prerequisitesMet: true, // Remediation steps are foundational
            estimatedWeeks: 1,
            priority: 'high',
            adaptations: [
              {
                type: 'method',
                description: 'Multi-sensory approach with concrete examples',
                rationale: 'Foundational concept requires solid understanding'
              }
            ],
            completionCriteria: [
              {
                type: 'accuracy',
                threshold: 75,
                description: 'Achieve 75% accuracy on foundational concepts'
              }
            ],
            status: 'not_started'
          };
          remediationSteps.push(step);
        }
      }
    }

    return remediationSteps;
  }

  /**
   * Generate grade-level appropriate steps
   */
  private async generateGradeLevelSteps(
    userId: string,
    gradeLevel: number,
    subjects: string[],
    conceptMastery: any[]
  ): Promise<LearningStep[]> {
    const gradeLevelSteps: LearningStep[] = [];

    for (const subject of subjects) {
      const standards = getStandardsForGrade(gradeLevel, subject);
      
      for (const standard of standards) {
        const mastery = conceptMastery.find(cm => 
          this.isConceptRelatedToStandard(cm.conceptName, standard)
        );

        const masteryLevel = mastery?.masteryLevel || 0;
        let status: LearningStep['status'] = 'not_started';
        let priority: LearningStep['priority'] = 'medium';

        if (masteryLevel >= 0.8) {
          status = 'mastered';
          priority = 'low';
        } else if (masteryLevel >= 0.6) {
          status = 'in_progress';
          priority = 'medium';
        } else {
          status = 'not_started';
          priority = 'high';
        }

        const step: LearningStep = {
          id: `grade-${standard.id}`,
          standardId: standard.id,
          standard,
          prerequisitesMet: await this.checkPrerequisites(standard, conceptMastery),
          estimatedWeeks: this.estimateWeeksForStandard(standard),
          priority,
          adaptations: this.generateStepAdaptations(standard, masteryLevel),
          completionCriteria: this.generateCompletionCriteria(standard),
          status
        };
        gradeLevelSteps.push(step);
      }
    }

    return gradeLevelSteps;
  }

  /**
   * Generate advanced steps for acceleration
   */
  private async generateAdvancedSteps(
    userId: string,
    targetGrade: number,
    subjects: string[],
    conceptMastery: any[]
  ): Promise<LearningStep[]> {
    const advancedSteps: LearningStep[] = [];

    for (const subject of subjects) {
      const advancedStandards = getStandardsForGrade(targetGrade, subject);
      
      // Select foundational standards from the advanced grade
      const foundationalStandards = advancedStandards
        .filter(std => std.difficulty <= 4) // Only include easier advanced concepts
        .slice(0, 3); // Limit to 3 per subject

      for (const standard of foundationalStandards) {
        const step: LearningStep = {
          id: `advanced-${standard.id}`,
          standardId: standard.id,
          standard,
          prerequisitesMet: await this.checkPrerequisites(standard, conceptMastery),
          estimatedWeeks: this.estimateWeeksForStandard(standard) + 1, // Extra time for advanced content
          priority: 'low', // Lower priority than current grade
          adaptations: [
            {
              type: 'support',
              description: 'Additional scaffolding for advanced concept',
              rationale: 'Student is working above grade level'
            },
            {
              type: 'pace',
              description: 'Allow extra time for concept development',
              rationale: 'Advanced content requires deeper processing'
            }
          ],
          completionCriteria: [
            {
              type: 'understanding',
              threshold: 70,
              description: 'Demonstrate conceptual understanding of advanced topic'
            }
          ],
          status: 'not_started'
        };
        advancedSteps.push(step);
      }
    }

    return advancedSteps;
  }

  /**
   * Sequence learning steps based on prerequisites and priority
   */
  private sequenceLearningSteps(steps: LearningStep[]): LearningStep[] {
    // Create a dependency graph
    const graph = new Map<string, Set<string>>();
    const inDegree = new Map<string, number>();

    // Initialize graph
    steps.forEach(step => {
      graph.set(step.id, new Set());
      inDegree.set(step.id, 0);
    });

    // Add dependencies based on prerequisites
    steps.forEach(step => {
      const prerequisites = getPrerequisiteStandards(step.standardId);
      prerequisites.forEach(prereq => {
        const prereqStep = steps.find(s => s.standardId === prereq.id);
        if (prereqStep) {
          graph.get(prereqStep.id)?.add(step.id);
          inDegree.set(step.id, (inDegree.get(step.id) || 0) + 1);
        }
      });
    });

    // Topological sort with priority consideration
    const sequenced: LearningStep[] = [];
    const queue: LearningStep[] = [];

    // Start with steps that have no dependencies
    steps.forEach(step => {
      if (inDegree.get(step.id) === 0) {
        queue.push(step);
      }
    });

    // Sort queue by priority
    queue.sort((a, b) => {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    while (queue.length > 0) {
      const current = queue.shift()!;
      sequenced.push(current);

      // Update dependencies
      const dependents = graph.get(current.id) || new Set();
      dependents.forEach(dependentId => {
        const newInDegree = (inDegree.get(dependentId) || 0) - 1;
        inDegree.set(dependentId, newInDegree);

        if (newInDegree === 0) {
          const dependentStep = steps.find(s => s.id === dependentId);
          if (dependentStep) {
            queue.push(dependentStep);
          }
        }
      });

      // Re-sort queue to maintain priority order
      queue.sort((a, b) => {
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
    }

    return sequenced;
  }

  /**
   * Helper methods
   */
  private isConceptRelatedToSubject(conceptName: string, subject: string): boolean {
    const subjectKeywords: Record<string, string[]> = {
      mathematics: ['math', 'number', 'algebra', 'geometry', 'fraction', 'equation', 'calculation'],
      english: ['reading', 'writing', 'grammar', 'vocabulary', 'literature', 'language', 'text'],
      science: ['science', 'biology', 'chemistry', 'physics', 'experiment', 'hypothesis'],
      social_studies: ['history', 'geography', 'civics', 'government', 'culture', 'society']
    };

    const keywords = subjectKeywords[subject] || [];
    return keywords.some(keyword => 
      conceptName.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  private isConceptRelatedToStandard(conceptName: string, standard: CommonStandard): boolean {
    const standardText = `${standard.title} ${standard.description} ${standard.cluster}`.toLowerCase();
    const conceptWords = conceptName.toLowerCase().split(/\s+/);
    
    return conceptWords.some(word => 
      word.length > 3 && standardText.includes(word)
    );
  }

  private assessReadinessForSubject(
    subject: string, 
    gradeLevel: number, 
    conceptMastery: any[]
  ): ReadinessIndicator {
    const subjectMastery = conceptMastery.filter(cm => 
      this.isConceptRelatedToSubject(cm.conceptName, subject)
    );

    const averageMastery = subjectMastery.length > 0 
      ? subjectMastery.reduce((sum, cm) => sum + cm.masteryLevel, 0) / subjectMastery.length
      : 0;

    const gaps = subjectMastery
      .filter(cm => cm.masteryLevel < 0.6)
      .map(cm => cm.conceptName);

    return {
      area: subject,
      ready: averageMastery >= 0.7 && gaps.length <= 2,
      evidenceScore: averageMastery * 100,
      gaps
    };
  }

  private projectReadinessIndicators(
    currentIndicators: ReadinessIndicator[], 
    targetGrade: number
  ): ReadinessIndicator[] {
    return currentIndicators.map(indicator => ({
      ...indicator,
      ready: indicator.evidenceScore >= 75, // Higher bar for advanced grade
      evidenceScore: Math.min(85, indicator.evidenceScore + 10) // Project improvement
    }));
  }

  private async checkPrerequisites(standard: CommonStandard, conceptMastery: any[]): Promise<boolean> {
    const prerequisites = getPrerequisiteStandards(standard.id);
    
    if (prerequisites.length === 0) return true;

    const prerequisitesMet = prerequisites.every(prereq => {
      const mastery = conceptMastery.find(cm => 
        this.isConceptRelatedToStandard(cm.conceptName, prereq)
      );
      return mastery && mastery.masteryLevel >= 0.6;
    });

    return prerequisitesMet;
  }

  private estimateWeeksForStandard(standard: CommonStandard): number {
    // Base estimation on difficulty and grade level
    const baseWeeks = Math.ceil(standard.difficulty / 2);
    const gradeMultiplier = standard.gradeLevel <= 5 ? 1 : 1.2;
    
    return Math.ceil(baseWeeks * gradeMultiplier);
  }

  private generateStepAdaptations(standard: CommonStandard, masteryLevel: number): StepAdaptation[] {
    const adaptations: StepAdaptation[] = [];

    if (masteryLevel < 0.3) {
      adaptations.push({
        type: 'support',
        description: 'Provide additional scaffolding and concrete examples',
        rationale: 'Low current mastery requires foundational support'
      });
    }

    if (standard.difficulty >= 5) {
      adaptations.push({
        type: 'pace',
        description: 'Allow extended time for complex concept development',
        rationale: 'High complexity requires deeper processing time'
      });
    }

    if (masteryLevel > 0.7) {
      adaptations.push({
        type: 'method',
        description: 'Include application and extension activities',
        rationale: 'Strong foundation allows for advanced applications'
      });
    }

    return adaptations;
  }

  private generateCompletionCriteria(standard: CommonStandard): CompletionCriterion[] {
    const criteria: CompletionCriterion[] = [
      {
        type: 'accuracy',
        threshold: 80,
        description: 'Achieve 80% accuracy on standard-aligned assessments'
      }
    ];

    if (standard.difficulty >= 4) {
      criteria.push({
        type: 'application',
        threshold: 70,
        description: 'Successfully apply concept in varied contexts'
      });
    }

    if (standard.gradeLevel >= 6) {
      criteria.push({
        type: 'understanding',
        threshold: 75,
        description: 'Demonstrate deep conceptual understanding'
      });
    }

    return criteria;
  }

  private calculateEstimatedTime(learningSteps: LearningStep[]): number {
    return learningSteps.reduce((total, step) => total + step.estimatedWeeks, 0);
  }

  private documentAdaptationReasons(
    currentLevel: PersonalizedLevel,
    targetLevel: PersonalizedLevel,
    profile: any
  ): AdaptationReason[] {
    const reasons: AdaptationReason[] = [];

    if (targetLevel.gradeLevel > currentLevel.gradeLevel) {
      reasons.push({
        type: 'acceleration',
        description: `Student ready for Grade ${targetLevel.gradeLevel} content`,
        evidenceBased: [
          `High mastery (${currentLevel.masteryPercentage.toFixed(1)}%) in current grade`,
          `Strong performance in ${currentLevel.strengthAreas.join(', ')}`
        ]
      });
    }

    if (currentLevel.masteryPercentage < 60) {
      reasons.push({
        type: 'remediation',
        description: 'Foundational concepts need reinforcement',
        evidenceBased: [
          `Current mastery at ${currentLevel.masteryPercentage.toFixed(1)}%`,
          `Growth areas: ${currentLevel.growthAreas.join(', ')}`
        ]
      });
    }

    if (profile?.learning_style) {
      reasons.push({
        type: 'differentiation',
        description: `Adapted for ${profile.learning_style} learning style`,
        evidenceBased: [`Learning style preference: ${profile.learning_style}`]
      });
    }

    return reasons;
  }

  private async getRecentPerformanceData(userId: string): Promise<any> {
    // This would fetch recent performance metrics
    // For now, return mock data
    return {
      averageAccuracy: 75,
      consistencyScore: 80,
      growthRate: 5
    };
  }
}

export const personalizedLearningPathGenerator = new PersonalizedLearningPathGenerator();