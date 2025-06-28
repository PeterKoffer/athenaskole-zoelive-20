
import type { EducationalContext } from './types';

export class EducationalContextMapper {
  static mapKcToEducationalContext(kcId: string, userId: string): EducationalContext {
    // Mathematics mappings
    const mathematicsMapping = {
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

    // Check if it's a math KC first
    if (mathematicsMapping[kcId as keyof typeof mathematicsMapping]) {
      return mathematicsMapping[kcId as keyof typeof mathematicsMapping];
    }

    // Extract subject and grade from KC ID pattern
    const subject = this.extractSubjectFromKcId(kcId);
    const gradeLevel = this.extractGradeLevelFromKcId(kcId);
    const skillArea = this.extractSkillAreaFromKcId(kcId);

    return this.generateSubjectContext(subject, skillArea, gradeLevel, userId);
  }

  private static extractSubjectFromKcId(kcId: string): string {
    if (kcId.includes('math')) return 'mathematics';
    if (kcId.includes('english') || kcId.includes('ela')) return 'english';
    if (kcId.includes('science')) return 'science';
    if (kcId.includes('cs') || kcId.includes('computer')) return 'computer_science';
    if (kcId.includes('music')) return 'music';
    if (kcId.includes('art') || kcId.includes('creative')) return 'creative_arts';
    if (kcId.includes('wellness') || kcId.includes('mental')) return 'mental_wellness';
    if (kcId.includes('language') || kcId.includes('lang')) return 'language_lab';
    if (kcId.includes('history') || kcId.includes('religion')) return 'history_religion';
    if (kcId.includes('geography') || kcId.includes('geo')) return 'geography';
    if (kcId.includes('body') || kcId.includes('health')) return 'body_lab';
    if (kcId.includes('life') || kcId.includes('essential')) return 'life_essentials';
    return 'mathematics'; // Default fallback
  }

  private static extractGradeLevelFromKcId(kcId: string): number {
    const gradeMatch = kcId.match(/g(\d+)/);
    return gradeMatch ? parseInt(gradeMatch[1]) : 5;
  }

  private static extractSkillAreaFromKcId(kcId: string): string {
    const parts = kcId.split('_');
    return parts.slice(3).join(' ').replace(/_/g, ' ') || 'general concepts';
  }

  private static generateSubjectContext(subject: string, skillArea: string, gradeLevel: number, userId: string): EducationalContext {
    const subjectContexts = {
      english: {
        teacherRequirements: {
          focusAreas: ['reading comprehension', 'vocabulary development', 'writing skills'],
          avoidTopics: ['mature content'],
          preferredQuestionTypes: ['multiple_choice', 'short_answer'],
          difficultyPreference: 'standard' as const
        },
        schoolStandards: {
          curriculum: 'common_core' as const,
          assessmentStyle: 'performance_based' as const,
          learningGoals: ['develop reading fluency', 'improve writing clarity'],
          mandatoryTopics: ['grammar', 'literature analysis']
        },
        studentAdaptation: {
          learningStyle: 'mixed' as const,
          previousPerformance: {
            accuracy: 0.75,
            averageTime: 60,
            strugglingConcepts: ['grammar rules'],
            masteredConcepts: ['basic vocabulary']
          },
          engagementLevel: 'medium' as const,
          preferredContexts: ['stories', 'real-world scenarios', 'creative writing']
        }
      },
      science: {
        teacherRequirements: {
          focusAreas: ['scientific method', 'hands-on experiments', 'observation skills'],
          avoidTopics: ['dangerous experiments'],
          preferredQuestionTypes: ['multiple_choice', 'experiment_based'],
          difficultyPreference: 'standard' as const
        },
        schoolStandards: {
          curriculum: 'state_standards' as const,
          assessmentStyle: 'performance_based' as const,
          learningGoals: ['understand scientific processes', 'develop inquiry skills'],
          mandatoryTopics: ['scientific method', 'basic physics concepts']
        },
        studentAdaptation: {
          learningStyle: 'kinesthetic' as const,
          previousPerformance: {
            accuracy: 0.70,
            averageTime: 45,
            strugglingConcepts: ['abstract concepts'],
            masteredConcepts: ['observation skills']
          },
          engagementLevel: 'high' as const,
          preferredContexts: ['nature', 'experiments', 'real-world phenomena']
        }
      },
      computer_science: {
        teacherRequirements: {
          focusAreas: ['logical thinking', 'problem solving', 'basic programming'],
          avoidTopics: ['complex algorithms'],
          preferredQuestionTypes: ['multiple_choice', 'coding_problems'],
          difficultyPreference: 'challenging' as const
        },
        schoolStandards: {
          curriculum: 'custom' as const,
          assessmentStyle: 'performance_based' as const,
          learningGoals: ['develop computational thinking', 'basic coding skills'],
          mandatoryTopics: ['algorithms', 'programming basics']
        },
        studentAdaptation: {
          learningStyle: 'visual' as const,
          previousPerformance: {
            accuracy: 0.80,
            averageTime: 50,
            strugglingConcepts: ['debugging'],
            masteredConcepts: ['logical thinking']
          },
          engagementLevel: 'high' as const,
          preferredContexts: ['games', 'interactive coding', 'problem solving']
        }
      },
      music: {
        teacherRequirements: {
          focusAreas: ['rhythm', 'melody', 'music theory basics'],
          avoidTopics: ['complex compositions'],
          preferredQuestionTypes: ['multiple_choice', 'audio_based'],
          difficultyPreference: 'standard' as const
        },
        schoolStandards: {
          curriculum: 'state_standards' as const,
          assessmentStyle: 'performance_based' as const,
          learningGoals: ['understand basic music theory', 'develop rhythm skills'],
          mandatoryTopics: ['notes', 'rhythm patterns']
        },
        studentAdaptation: {
          learningStyle: 'auditory' as const,
          previousPerformance: {
            accuracy: 0.75,
            averageTime: 40,
            strugglingConcepts: ['music notation'],
            masteredConcepts: ['rhythm recognition']
          },
          engagementLevel: 'high' as const,
          preferredContexts: ['songs', 'instruments', 'musical games']
        }
      },
      creative_arts: {
        teacherRequirements: {
          focusAreas: ['creativity', 'visual elements', 'artistic expression'],
          avoidTopics: ['art history complexity'],
          preferredQuestionTypes: ['multiple_choice', 'creative_projects'],
          difficultyPreference: 'standard' as const
        },
        schoolStandards: {
          curriculum: 'state_standards' as const,
          assessmentStyle: 'performance_based' as const,
          learningGoals: ['develop artistic skills', 'understand visual elements'],
          mandatoryTopics: ['color theory', 'basic design principles']
        },
        studentAdaptation: {
          learningStyle: 'visual' as const,
          previousPerformance: {
            accuracy: 0.80,
            averageTime: 60,
            strugglingConcepts: ['color mixing'],
            masteredConcepts: ['basic shapes']
          },
          engagementLevel: 'high' as const,
          preferredContexts: ['art projects', 'visual examples', 'hands-on activities']
        }
      }
    };

    // Get subject-specific context or use general template
    const subjectContext = subjectContexts[subject as keyof typeof subjectContexts] || {
      teacherRequirements: {
        focusAreas: ['critical thinking', 'problem solving'],
        avoidTopics: [],
        preferredQuestionTypes: ['multiple_choice'],
        difficultyPreference: 'standard' as const
      },
      schoolStandards: {
        curriculum: 'common_core' as const,
        assessmentStyle: 'traditional' as const,
        learningGoals: ['develop subject knowledge'],
        mandatoryTopics: []
      },
      studentAdaptation: {
        learningStyle: 'mixed' as const,
        previousPerformance: {
          accuracy: 0.75,
          averageTime: 45,
          strugglingConcepts: [],
          masteredConcepts: []
        },
        engagementLevel: 'medium' as const,
        preferredContexts: ['real-world applications']
      }
    };

    return {
      subject,
      skillArea,
      difficultyLevel: Math.max(1, Math.min(gradeLevel, 10)),
      gradeLevel,
      ...subjectContext
    };
  }
}
