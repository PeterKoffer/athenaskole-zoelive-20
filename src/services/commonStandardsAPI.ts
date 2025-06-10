
import { CommonStandard } from '@/types/gradeStandards';
import { getAllStandards, getStandardsByGrade, getFilteredStandards } from '@/data/curriculumStandards';

export class CommonStandardsAPI {
  static async getStandardsByGradeAndSubject(grade: number, subject: string): Promise<CommonStandard[]> {
    console.log('Getting standards for grade:', grade, 'subject:', subject);
    return getFilteredStandards(subject, grade);
  }

  static async getSkillAreasForGradeAndSubject(grade: number, subject: string): Promise<string[]> {
    console.log('Getting skill areas for grade:', grade, 'subject:', subject);
    
    const standards = getFilteredStandards(subject, grade);
    const skillAreas = [...new Set(standards.map(s => s.domain || s.cluster || 'General'))];
    
    return skillAreas.length > 0 ? skillAreas : ['General'];
  }

  static getDifficultyRangeForGrade(grade: number): [number, number] {
    console.log('Getting difficulty range for grade:', grade);
    
    // Base difficulty on grade level
    const baseLevel = Math.max(1, grade);
    return [Math.max(1, baseLevel - 1), Math.min(10, baseLevel + 1)];
  }

  static async getPrerequisiteStandards(grade: number, subject: string): Promise<CommonStandard[]> {
    console.log('Getting prerequisites for grade:', grade, 'subject:', subject);
    
    // Get standards from previous grades as prerequisites
    const previousGrade = Math.max(0, grade - 1);
    return getFilteredStandards(subject, previousGrade);
  }
}

export const commonStandardsAPI = CommonStandardsAPI;
