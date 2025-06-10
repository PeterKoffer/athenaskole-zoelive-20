
import { CommonStandard, GradeLevelMapping } from '@/types/gradeStandards';

export class CommonStandardsAPI {
  private standards: Map<string, CommonStandard[]> = new Map();
  private isInitialized: boolean = false;
  
  constructor() {
    this.initializeStandards();
  }

  private async initializeStandards() {
    if (this.isInitialized) return;

    try {
      // Try to load standards from external JSON file
      const response = await fetch('/data/common-standards.json');
      
      if (response.ok) {
        const externalStandards = await response.json();
        
        // Convert external data to Map format
        for (const [subject, standards] of Object.entries(externalStandards)) {
          this.standards.set(subject.toLowerCase(), standards as CommonStandard[]);
        }
        
        this.isInitialized = true;
        return;
      }
    } catch (error) {
      console.error('Failed to load external standards data:', error);
    }

    // Fallback to hardcoded standards if external data fails
    this.initializeFallbackStandards();
    this.isInitialized = true;
  }

  private initializeFallbackStandards() {
    // Mathematics Standards by Grade
    this.standards.set('mathematics', [
      // Grade 1
      { id: '1.OA.1', code: '1.OA.1', title: 'Addition and Subtraction within 20', description: 'Use addition and subtraction within 20 to solve problems', subject: 'mathematics', gradeLevel: 1, domain: 'Operations & Algebraic Thinking', difficulty: 1 },
      { id: '1.NBT.1', code: '1.NBT.1', title: 'Count to 120', description: 'Count to 120, starting at any number less than 120', subject: 'mathematics', gradeLevel: 1, domain: 'Number & Operations in Base Ten', difficulty: 1 },
      
      // Grade 2
      { id: '2.OA.1', code: '2.OA.1', title: 'Addition and Subtraction within 100', description: 'Use addition and subtraction within 100 to solve problems', subject: 'mathematics', gradeLevel: 2, domain: 'Operations & Algebraic Thinking', difficulty: 2 },
      { id: '2.NBT.5', code: '2.NBT.5', title: 'Fluently add and subtract within 100', description: 'Fluently add and subtract within 100 using strategies', subject: 'mathematics', gradeLevel: 2, domain: 'Number & Operations in Base Ten', difficulty: 2 },
      
      // Grade 3
      { id: '3.OA.8', code: '3.OA.8', title: 'Two-step word problems', description: 'Solve two-step word problems using four operations', subject: 'mathematics', gradeLevel: 3, domain: 'Operations & Algebraic Thinking', difficulty: 3 },
      { id: '3.NBT.2', code: '3.NBT.2', title: 'Addition and subtraction within 1000', description: 'Fluently add and subtract within 1000', subject: 'mathematics', gradeLevel: 3, domain: 'Number & Operations in Base Ten', difficulty: 3 },
    ]);

    // English Language Arts Standards by Grade
    this.standards.set('english', [
      // Grade 1-3
      { id: '1.RF.3', code: '1.RF.3', title: 'Phonics and word recognition', description: 'Know and apply grade-level phonics and word analysis skills', subject: 'english', gradeLevel: 1, domain: 'Reading: Foundational Skills', difficulty: 1 },
      { id: '2.RL.1', code: '2.RL.1', title: 'Reading comprehension', description: 'Ask and answer questions about key details in a text', subject: 'english', gradeLevel: 2, domain: 'Reading: Literature', difficulty: 2 },
      { id: '3.W.1', code: '3.W.1', title: 'Opinion writing', description: 'Write opinion pieces on topics or texts', subject: 'english', gradeLevel: 3, domain: 'Writing', difficulty: 3 },
    ]);

    // Science Standards by Grade
    this.standards.set('science', [
      // Elementary Science
      { id: '1.LS1.1', code: '1-LS1-1', title: 'Living vs Non-living', description: 'Use materials to design solutions based on how plants and animals use their parts', subject: 'science', gradeLevel: 1, domain: 'Life Science', difficulty: 1 },
      { id: '2.PS1.1', code: '2-PS1-1', title: 'Properties of materials', description: 'Plan and conduct investigations to describe and classify materials', subject: 'science', gradeLevel: 2, domain: 'Physical Science', difficulty: 2 },
      { id: '5.ESS1.1', code: '5-ESS1-1', title: 'Solar system', description: 'Develop a model to describe the sun as a star', subject: 'science', gradeLevel: 5, domain: 'Earth & Space Science', difficulty: 5 },
    ]);
  }

  async getStandardsByGradeAndSubject(grade: number, subject: string): Promise<CommonStandard[]> {
    await this.initializeStandards();
    const subjectStandards = this.standards.get(subject.toLowerCase()) || [];
    return subjectStandards.filter(standard => standard.gradeLevel === grade);
  }

  async getStandardById(standardId: string): Promise<CommonStandard | undefined> {
    await this.initializeStandards();
    for (const [subject, standards] of this.standards.entries()) {
      const found = standards.find(s => s.id === standardId);
      if (found) return found;
    }
    return undefined;
  }

  async getPrerequisiteStandards(grade: number, subject: string): Promise<CommonStandard[]> {
    await this.initializeStandards();
    const subjectStandards = this.standards.get(subject.toLowerCase()) || [];
    return subjectStandards.filter(standard => 
      standard.gradeLevel < grade && 
      standard.gradeLevel >= Math.max(1, grade - 2)
    );
  }

  getDifficultyRangeForGrade(grade: number): [number, number] {
    // Grade-appropriate difficulty ranges
    if (grade <= 2) return [1, 2];
    if (grade <= 5) return [grade - 1, grade + 1];
    if (grade <= 8) return [grade - 2, grade + 1];
    return [grade - 2, grade + 2];
  }

  async getSkillAreasForGradeAndSubject(grade: number, subject: string): Promise<string[]> {
    const standards = await this.getStandardsByGradeAndSubject(grade, subject);
    const domains = [...new Set(standards.map(s => s.domain).filter(Boolean))];
    return domains as string[];
  }

  // Synchronous methods for backward compatibility (use fallback data)
  getStandardsByGradeAndSubjectSync(grade: number, subject: string): CommonStandard[] {
    if (!this.isInitialized) {
      this.initializeFallbackStandards();
    }
    const subjectStandards = this.standards.get(subject.toLowerCase()) || [];
    return subjectStandards.filter(standard => standard.gradeLevel === grade);
  }

  getStandardByIdSync(standardId: string): CommonStandard | undefined {
    if (!this.isInitialized) {
      this.initializeFallbackStandards();
    }
    for (const [subject, standards] of this.standards.entries()) {
      const found = standards.find(s => s.id === standardId);
      if (found) return found;
    }
    return undefined;
  }

  getPrerequisiteStandardsSync(grade: number, subject: string): CommonStandard[] {
    if (!this.isInitialized) {
      this.initializeFallbackStandards();
    }
    const subjectStandards = this.standards.get(subject.toLowerCase()) || [];
    return subjectStandards.filter(standard => 
      standard.gradeLevel < grade && 
      standard.gradeLevel >= Math.max(1, grade - 2)
    );
  }

  getSkillAreasForGradeAndSubjectSync(grade: number, subject: string): string[] {
    const standards = this.getStandardsByGradeAndSubjectSync(grade, subject);
    const domains = [...new Set(standards.map(s => s.domain).filter(Boolean))];
    return domains as string[];
  }
}

export const commonStandardsAPI = new CommonStandardsAPI();
