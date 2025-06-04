
import { CommonStandard, GradeLevelMapping } from '@/types/gradeStandards';

export class CommonStandardsAPI {
  private standards: Map<string, CommonStandard[]> = new Map();
  
  constructor() {
    this.initializeStandards();
  }

  private initializeStandards() {
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
      
      // Grade 4-5
      { id: '4.OA.3', code: '4.OA.3', title: 'Multi-step word problems', description: 'Solve multistep word problems with whole numbers and remainders', subject: 'mathematics', gradeLevel: 4, domain: 'Operations & Algebraic Thinking', difficulty: 4 },
      { id: '5.NBT.7', code: '5.NBT.7', title: 'Decimal operations', description: 'Add, subtract, multiply, and divide decimals to hundredths', subject: 'mathematics', gradeLevel: 5, domain: 'Number & Operations in Base Ten', difficulty: 5 },
      
      // Grade 6-8
      { id: '6.RP.3', code: '6.RP.3', title: 'Ratios and proportions', description: 'Use ratio and rate reasoning to solve problems', subject: 'mathematics', gradeLevel: 6, domain: 'Ratios & Proportional Relationships', difficulty: 6 },
      { id: '7.EE.4', code: '7.EE.4', title: 'Linear equations', description: 'Use variables to represent quantities in linear equations', subject: 'mathematics', gradeLevel: 7, domain: 'Expressions & Equations', difficulty: 7 },
      { id: '8.F.1', code: '8.F.1', title: 'Functions', description: 'Understand that a function is a rule that assigns exactly one output', subject: 'mathematics', gradeLevel: 8, domain: 'Functions', difficulty: 8 },
      
      // Grade 9-12
      { id: 'A.REI.4', code: 'A-REI.4', title: 'Quadratic equations', description: 'Solve quadratic equations in one variable', subject: 'mathematics', gradeLevel: 9, domain: 'Algebra', difficulty: 9 },
      { id: 'G.CO.1', code: 'G-CO.1', title: 'Geometric transformations', description: 'Know precise definitions of geometric transformations', subject: 'mathematics', gradeLevel: 10, domain: 'Geometry', difficulty: 10 },
      { id: 'F.TF.5', code: 'F-TF.5', title: 'Trigonometric functions', description: 'Choose trigonometric functions to model periodic phenomena', subject: 'mathematics', gradeLevel: 11, domain: 'Functions', difficulty: 11 },
      { id: 'S.ID.6', code: 'S-ID.6', title: 'Statistical analysis', description: 'Represent data on two quantitative variables on a scatter plot', subject: 'mathematics', gradeLevel: 12, domain: 'Statistics', difficulty: 12 }
    ]);

    // English Language Arts Standards by Grade
    this.standards.set('english', [
      // Grade 1-3
      { id: '1.RF.3', code: '1.RF.3', title: 'Phonics and word recognition', description: 'Know and apply grade-level phonics and word analysis skills', subject: 'english', gradeLevel: 1, domain: 'Reading: Foundational Skills', difficulty: 1 },
      { id: '2.RL.1', code: '2.RL.1', title: 'Reading comprehension', description: 'Ask and answer questions about key details in a text', subject: 'english', gradeLevel: 2, domain: 'Reading: Literature', difficulty: 2 },
      { id: '3.W.1', code: '3.W.1', title: 'Opinion writing', description: 'Write opinion pieces on topics or texts', subject: 'english', gradeLevel: 3, domain: 'Writing', difficulty: 3 },
      
      // Grade 4-6
      { id: '4.RI.2', code: '4.RI.2', title: 'Main idea and details', description: 'Determine the main idea and explain how details support it', subject: 'english', gradeLevel: 4, domain: 'Reading: Informational Text', difficulty: 4 },
      { id: '5.L.5', code: '5.L.5', title: 'Figurative language', description: 'Demonstrate understanding of figurative language', subject: 'english', gradeLevel: 5, domain: 'Language', difficulty: 5 },
      { id: '6.W.2', code: '6.W.2', title: 'Informative writing', description: 'Write informative/explanatory texts', subject: 'english', gradeLevel: 6, domain: 'Writing', difficulty: 6 },
      
      // Grade 7-9
      { id: '7.RL.4', code: '7.RL.4', title: 'Literary analysis', description: 'Determine the meaning of words and phrases in context', subject: 'english', gradeLevel: 7, domain: 'Reading: Literature', difficulty: 7 },
      { id: '8.SL.4', code: '8.SL.4', title: 'Presentations', description: 'Present claims and findings with relevant evidence', subject: 'english', gradeLevel: 8, domain: 'Speaking & Listening', difficulty: 8 },
      { id: '9.W.1', code: '9-10.W.1', title: 'Argumentative writing', description: 'Write arguments to support claims with valid reasoning', subject: 'english', gradeLevel: 9, domain: 'Writing', difficulty: 9 },
      
      // Grade 10-12
      { id: '10.RL.5', code: '9-10.RL.5', title: 'Text structure analysis', description: 'Analyze how an author\'s choices create meaning', subject: 'english', gradeLevel: 10, domain: 'Reading: Literature', difficulty: 10 },
      { id: '11.RI.7', code: '11-12.RI.7', title: 'Multiple sources integration', description: 'Integrate information from diverse sources', subject: 'english', gradeLevel: 11, domain: 'Reading: Informational Text', difficulty: 11 },
      { id: '12.L.3', code: '11-12.L.3', title: 'Language conventions', description: 'Apply knowledge of language conventions', subject: 'english', gradeLevel: 12, domain: 'Language', difficulty: 12 }
    ]);

    // Science Standards by Grade
    this.standards.set('science', [
      // Elementary Science
      { id: '1.LS1.1', code: '1-LS1-1', title: 'Living vs Non-living', description: 'Use materials to design solutions based on how plants and animals use their parts', subject: 'science', gradeLevel: 1, domain: 'Life Science', difficulty: 1 },
      { id: '2.PS1.1', code: '2-PS1-1', title: 'Properties of materials', description: 'Plan and conduct investigations to describe and classify materials', subject: 'science', gradeLevel: 2, domain: 'Physical Science', difficulty: 2 },
      { id: '3.LS4.3', code: '3-LS4-3', title: 'Environmental changes', description: 'Construct an argument that some animals form groups for survival', subject: 'science', gradeLevel: 3, domain: 'Life Science', difficulty: 3 },
      
      // Middle School Science
      { id: '5.ESS1.1', code: '5-ESS1-1', title: 'Solar system', description: 'Develop a model to describe the sun as a star', subject: 'science', gradeLevel: 5, domain: 'Earth & Space Science', difficulty: 5 },
      { id: '6.ETS1.1', code: 'MS-ETS1-1', title: 'Engineering design', description: 'Define criteria and constraints of a design problem', subject: 'science', gradeLevel: 6, domain: 'Engineering Design', difficulty: 6 },
      { id: '7.LS2.1', code: 'MS-LS2-1', title: 'Ecosystems', description: 'Analyze and interpret data on scale of ecosystems', subject: 'science', gradeLevel: 7, domain: 'Life Science', difficulty: 7 },
      { id: '8.PS1.1', code: 'MS-PS1-1', title: 'Atomic structure', description: 'Develop models to describe atomic composition', subject: 'science', gradeLevel: 8, domain: 'Physical Science', difficulty: 8 },
      
      // High School Science
      { id: '9.PS2.1', code: 'HS-PS2-1', title: 'Forces and motion', description: 'Analyze data to support Newton\'s second law of motion', subject: 'science', gradeLevel: 9, domain: 'Physics', difficulty: 9 },
      { id: '10.LS1.5', code: 'HS-LS1-5', title: 'Photosynthesis', description: 'Use a model to illustrate how photosynthesis transforms light energy', subject: 'science', gradeLevel: 10, domain: 'Biology', difficulty: 10 },
      { id: '11.PS1.1', code: 'HS-PS1-1', title: 'Periodic table', description: 'Use the periodic table to predict properties of elements', subject: 'science', gradeLevel: 11, domain: 'Chemistry', difficulty: 11 },
      { id: '12.ESS3.2', code: 'HS-ESS3-2', title: 'Human impact', description: 'Evaluate technologies that reduce human impact on environment', subject: 'science', gradeLevel: 12, domain: 'Environmental Science', difficulty: 12 }
    ]);
  }

  getStandardsByGradeAndSubject(grade: number, subject: string): CommonStandard[] {
    const subjectStandards = this.standards.get(subject.toLowerCase()) || [];
    return subjectStandards.filter(standard => standard.gradeLevel === grade);
  }

  getStandardById(standardId: string): CommonStandard | undefined {
    for (const [subject, standards] of this.standards.entries()) {
      const found = standards.find(s => s.id === standardId);
      if (found) return found;
    }
    return undefined;
  }

  getPrerequisiteStandards(grade: number, subject: string): CommonStandard[] {
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

  getSkillAreasForGradeAndSubject(grade: number, subject: string): string[] {
    const standards = this.getStandardsByGradeAndSubject(grade, subject);
    const domains = [...new Set(standards.map(s => s.domain).filter(Boolean))];
    return domains as string[];
  }
}

export const commonStandardsAPI = new CommonStandardsAPI();
