
import type { EducationalContext } from './types';

export class EducationalContextMapper {
  static mapKcToEducationalContext(kcId: string, userId: string): EducationalContext {
    const baseMapping = {
      'kc_math_g5_multiply_decimals': {
        subject: 'mathematics',
        skillArea: 'decimal multiplication',
        difficultyLevel: 5,
        gradeLevel: 5,
        teacherRequirements: {
          focusAreas: ['place value understanding', 'computational fluency'],
          avoidTopics: ['complex word problems'],
          preferredQuestionTypes: ['multiple_choice'],
          difficultyPreference: 'standard' as const
        },
        schoolStandards: {
          curriculum: 'common_core' as const,
          assessmentStyle: 'traditional' as const,
          learningGoals: ['5.NBT.7 - multiply decimals to hundredths'],
          mandatoryTopics: ['decimal place value', 'multiplication strategies']
        },
        studentAdaptation: {
          learningStyle: 'mixed' as const,
          previousPerformance: {
            accuracy: 0.75,
            averageTime: 45,
            strugglingConcepts: ['decimal place value'],
            masteredConcepts: ['basic multiplication']
          },
          engagementLevel: 'medium' as const,
          preferredContexts: ['money', 'measurement', 'real-world applications']
        }
      },
      'kc_math_g4_subtract_fractions_likedenom': {
        subject: 'mathematics',
        skillArea: 'fraction subtraction with like denominators',
        difficultyLevel: 4,
        gradeLevel: 4,
        teacherRequirements: {
          focusAreas: ['conceptual understanding', 'visual representations'],
          avoidTopics: ['unlike denominators'],
          preferredQuestionTypes: ['multiple_choice'],
          difficultyPreference: 'standard' as const
        },
        schoolStandards: {
          curriculum: 'common_core' as const,
          assessmentStyle: 'traditional' as const,
          learningGoals: ['4.NF.3 - understand fraction subtraction'],
          mandatoryTopics: ['fraction concepts', 'like denominators']
        },
        studentAdaptation: {
          learningStyle: 'visual' as const,
          previousPerformance: {
            accuracy: 0.70,
            averageTime: 50,
            strugglingConcepts: ['fraction concepts'],
            masteredConcepts: ['basic subtraction']
          },
          engagementLevel: 'medium' as const,
          preferredContexts: ['food', 'sharing', 'parts of wholes']
        }
      }
    };

    return baseMapping[kcId as keyof typeof baseMapping] || {
      subject: 'mathematics',
      skillArea: 'general math concepts',
      difficultyLevel: 5,
      gradeLevel: 5,
      teacherRequirements: {
        focusAreas: ['problem solving'],
        avoidTopics: [],
        preferredQuestionTypes: ['multiple_choice'],
        difficultyPreference: 'standard' as const
      },
      schoolStandards: {
        curriculum: 'common_core' as const,
        assessmentStyle: 'traditional' as const,
        learningGoals: ['mathematical thinking'],
        mandatoryTopics: []
      },
      studentAdaptation: {
        learningStyle: 'mixed' as const,
        previousPerformance: {
          accuracy: 0.75,
          averageTime: 40,
          strugglingConcepts: [],
          masteredConcepts: []
        },
        engagementLevel: 'medium' as const,
        preferredContexts: ['real-world']
      }
    };
  }
}
