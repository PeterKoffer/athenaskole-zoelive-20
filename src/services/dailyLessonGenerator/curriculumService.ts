
import { StudentProgressData } from './types';

export class CurriculumService {
  /**
   * Determine focus areas based on grade level and student progress
   */
  static determineFocusAreas(subject: string, gradeLevel: number, studentProgress: StudentProgressData): string[] {
    const gradeBasedSkills = this.getGradeSkills(subject, gradeLevel);
    
    // Prioritize weaknesses, then add grade-appropriate skills
    const focusAreas = [
      ...studentProgress.weaknesses.slice(0, 2), // Address top 2 weaknesses
      ...gradeBasedSkills.filter(skill => !studentProgress.masteredConcepts.includes(skill))
    ];

    return focusAreas.length > 0 ? focusAreas : gradeBasedSkills;
  }

  /**
   * Get grade-appropriate skills for the subject
   */
  static getGradeSkills(subject: string, gradeLevel: number): string[] {
    const skillMap: Record<string, Record<string, string[]>> = {
      mathematics: {
        'K-2': ['number_recognition', 'basic_addition', 'basic_subtraction', 'shapes', 'counting'],
        '3-5': ['multiplication', 'division', 'fractions', 'decimals', 'geometry_basics'],
        '6-8': ['algebra_basics', 'ratios', 'proportions', 'integers', 'coordinate_plane'],
        '9-12': ['algebra', 'geometry', 'trigonometry', 'statistics', 'calculus_prep']
      },
      english: {
        'K-2': ['phonics', 'sight_words', 'basic_reading', 'sentence_structure'],
        '3-5': ['reading_comprehension', 'vocabulary', 'grammar', 'writing_basics'],
        '6-8': ['literature_analysis', 'essay_writing', 'research_skills', 'advanced_grammar'],
        '9-12': ['critical_thinking', 'rhetorical_analysis', 'advanced_writing', 'literature_interpretation']
      },
      science: {
        'K-2': ['observation', 'classification', 'basic_life_science', 'weather'],
        '3-5': ['scientific_method', 'ecosystems', 'matter', 'energy'],
        '6-8': ['earth_science', 'biology_basics', 'chemistry_intro', 'physics_intro'],
        '9-12': ['advanced_biology', 'chemistry', 'physics', 'environmental_science']
      }
    };

    const gradeRange = gradeLevel <= 2 ? 'K-2' : 
                      gradeLevel <= 5 ? '3-5' : 
                      gradeLevel <= 8 ? '6-8' : '9-12';

    return skillMap[subject.toLowerCase()]?.[gradeRange] || ['general_skills'];
  }
}
