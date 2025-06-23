
// K-12 Curriculum Manager - Maps content to grade levels and standards
export interface CurriculumStandard {
  id: string;
  subject: string;
  gradeLevel: number;
  domain: string;
  standard: string;
  description: string;
  prerequisite_ids: string[];
  learning_objectives: string[];
  estimated_time_minutes: number;
  difficulty_progression: number[];
}

export interface LearningUnit {
  id: string;
  title: string;
  curriculum_standards: CurriculumStandard[];
  skill_areas: string[];
  estimated_duration_minutes: number;
  activity_types: ('question' | 'game' | 'exploration' | 'practice')[];
  mastery_requirements: {
    accuracy_threshold: number;
    consistency_requirement: number;
  };
}

export class CurriculumManager {
  // K-12 Mathematics Curriculum Structure
  private static MATH_CURRICULUM: Record<number, LearningUnit[]> = {
    1: [
      {
        id: 'grade1-counting-numbers',
        title: 'Counting and Number Recognition',
        curriculum_standards: [{
          id: '1.NBT.1',
          subject: 'mathematics',
          gradeLevel: 1,
          domain: 'Number and Operations in Base Ten',
          standard: '1.NBT.1',
          description: 'Count to 120, starting at any number less than 120',
          prerequisite_ids: [],
          learning_objectives: ['Count forward from any number', 'Recognize number patterns', 'Write numbers 1-120'],
          estimated_time_minutes: 45,
          difficulty_progression: [1, 2, 3]
        }],
        skill_areas: ['counting', 'number_recognition', 'basic_numeracy'],
        estimated_duration_minutes: 45,
        activity_types: ['question', 'game', 'practice'],
        mastery_requirements: { accuracy_threshold: 80, consistency_requirement: 3 }
      },
      {
        id: 'grade1-addition-basics',
        title: 'Basic Addition Within 20',
        curriculum_standards: [{
          id: '1.OA.1',
          subject: 'mathematics', 
          gradeLevel: 1,
          domain: 'Operations and Algebraic Thinking',
          standard: '1.OA.1',
          description: 'Use addition and subtraction within 20 to solve word and number problems',
          prerequisite_ids: ['1.NBT.1'],
          learning_objectives: ['Add numbers within 20', 'Solve simple word problems', 'Understand addition concepts'],
          estimated_time_minutes: 50,
          difficulty_progression: [1, 2, 3, 4]
        }],
        skill_areas: ['addition', 'problem_solving', 'word_problems'],
        estimated_duration_minutes: 50,
        activity_types: ['question', 'game', 'exploration', 'practice'],
        mastery_requirements: { accuracy_threshold: 75, consistency_requirement: 4 }
      }
    ],
    // Add more grades as needed
    5: [
      {
        id: 'grade5-fractions-operations',
        title: 'Adding and Subtracting Fractions',
        curriculum_standards: [{
          id: '5.NF.1',
          subject: 'mathematics',
          gradeLevel: 5,
          domain: 'Number and Operations—Fractions',
          standard: '5.NF.1',
          description: 'Add and subtract fractions with unlike denominators',
          prerequisite_ids: ['4.NF.3'],
          learning_objectives: ['Find common denominators', 'Add fractions with different denominators', 'Subtract fractions with different denominators'],
          estimated_time_minutes: 60,
          difficulty_progression: [2, 3, 4, 5]
        }],
        skill_areas: ['fractions', 'operations', 'equivalent_fractions'],
        estimated_duration_minutes: 60,
        activity_types: ['question', 'game', 'exploration', 'practice'],
        mastery_requirements: { accuracy_threshold: 75, consistency_requirement: 5 }
      }
    ]
  };

  static getCurriculumForGrade(subject: string, gradeLevel: number): LearningUnit[] {
    if (subject.toLowerCase() === 'mathematics') {
      return this.MATH_CURRICULUM[gradeLevel] || [];
    }
    // Add other subjects as needed
    return [];
  }

  static getPrerequisites(unitId: string): string[] {
    // Find prerequisites for a specific learning unit
    for (const grade of Object.values(this.MATH_CURRICULUM)) {
      const unit = grade.find(u => u.id === unitId);
      if (unit) {
        return unit.curriculum_standards.flatMap(s => s.prerequisite_ids);
      }
    }
    return [];
  }

  static estimateStudentReadiness(studentProfile: any, unit: LearningUnit): number {
    // Calculate readiness score (0-100) based on prerequisites mastery
    const prerequisites = unit.curriculum_standards.flatMap(s => s.prerequisite_ids);
    if (prerequisites.length === 0) return 100;

    const masteredPrereqs = prerequisites.filter(prereq => 
      studentProfile.mastered_concepts?.includes(prereq)
    );
    
    return (masteredPrereqs.length / prerequisites.length) * 100;
  }
}
