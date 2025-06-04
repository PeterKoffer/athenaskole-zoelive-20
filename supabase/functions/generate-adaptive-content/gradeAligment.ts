
import { GeneratedContent } from './types.ts';

export interface GradeDescriptor {
  vocab: string;
  examples: string;
  cognitive: string;
}

export const gradeDescriptors: Record<number, GradeDescriptor> = {
  1: { vocab: "simple, concrete words", examples: "everyday objects and basic counting", cognitive: "recognition and recall" },
  2: { vocab: "basic vocabulary with simple sentences", examples: "familiar situations and small numbers", cognitive: "basic understanding and application" },
  3: { vocab: "grade-appropriate terms with clear explanations", examples: "school and community contexts", cognitive: "analysis of simple problems" },
  4: { vocab: "intermediate vocabulary", examples: "real-world applications", cognitive: "problem-solving with multiple steps" },
  5: { vocab: "more advanced terminology", examples: "complex real-world scenarios", cognitive: "synthesis and evaluation" },
  6: { vocab: "middle school level vocabulary", examples: "abstract concepts with concrete examples", cognitive: "analytical thinking" },
  7: { vocab: "pre-algebra terminology", examples: "scientific and mathematical reasoning", cognitive: "logical analysis" },
  8: { vocab: "advanced middle school concepts", examples: "complex problem scenarios", cognitive: "abstract reasoning" },
  9: { vocab: "high school foundation vocabulary", examples: "academic and real-world applications", cognitive: "critical thinking" },
  10: { vocab: "intermediate academic vocabulary", examples: "complex analysis scenarios", cognitive: "synthesis and evaluation" },
  11: { vocab: "advanced academic concepts", examples: "sophisticated real-world problems", cognitive: "advanced critical thinking" },
  12: { vocab: "college-preparatory terminology", examples: "complex academic scenarios", cognitive: "sophisticated analysis and synthesis" }
};

export function getGradeDescriptor(gradeLevel?: number, difficultyLevel?: number): GradeDescriptor {
  const grade = gradeLevel || Math.min(12, Math.max(1, difficultyLevel || 6));
  return gradeDescriptors[grade] || gradeDescriptors[6];
}

export function getAgeRange(grade: number): string {
  if (grade === 1) return 'ages 6-7';
  if (grade === 12) return 'ages 17-18';
  return `grade ${grade}`;
}
