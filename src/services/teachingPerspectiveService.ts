
import { TeachingPerspective } from './gradeAlignedQuestionGeneration';

export class TeachingPerspectiveService {
  /**
   * Get teaching perspective from user preferences or default
   */
  static getTeachingPerspective(userId: string, gradeLevel: number): TeachingPerspective {
    // Try to get from localStorage first
    const stored = localStorage.getItem(`teachingPerspective_${userId}`);
    
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.warn('Failed to parse stored teaching perspective:', error);
      }
    }
    
    // Return grade-appropriate default
    return this.getGradeAppropriateDefault(gradeLevel);
  }

  /**
   * Save teaching perspective for user
   */
  static saveTeachingPerspective(userId: string, perspective: TeachingPerspective): void {
    localStorage.setItem(`teachingPerspective_${userId}`, JSON.stringify(perspective));
  }

  /**
   * Get grade-appropriate default teaching perspective
   */
  private static getGradeAppropriateDefault(gradeLevel: number): TeachingPerspective {
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

  /**
   * Update teaching perspective based on student performance
   */
  static adaptTeachingPerspective(
    currentPerspective: TeachingPerspective,
    studentPerformance: {
      accuracy: number;
      timeSpent: number;
      strugglingAreas: string[];
    }
  ): TeachingPerspective {
    const adapted = { ...currentPerspective };

    // If student is struggling (low accuracy), increase scaffolding
    if (studentPerformance.accuracy < 0.6) {
      adapted.scaffolding = adapted.scaffolding === 'low' ? 'medium' : 'high';
    }

    // If student is taking too long, adjust style to more supportive
    if (studentPerformance.timeSpent > 300) { // 5 minutes
      if (adapted.style === 'reading-writing') {
        adapted.style = 'visual';
      }
    }

    // If student excels, reduce scaffolding to challenge them more
    if (studentPerformance.accuracy > 0.9) {
      adapted.scaffolding = adapted.scaffolding === 'high' ? 'medium' : 'low';
    }

    return adapted;
  }
}

export const teachingPerspectiveService = TeachingPerspectiveService;
