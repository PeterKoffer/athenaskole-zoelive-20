
import { CurriculumStep } from "@/types/curriculum";
import { CommonStandard, GRADE_LEVELS } from "@/types/gradeStandards";
import { getFilteredStandards } from "./curriculumStandards";

/**
 * CurriculumStepGradeMapEntry:
 * - Connects a curriculum step (e.g., "Foundation Basics") with grade, subject, domains, and concrete skills.
 */
export interface CurriculumStepGradeMapEntry {
  stepId: string;           // e.g., "1"
  stepTitle: string;        // e.g., "Foundation Basics"
  gradeLevel: number;       // e.g., 1
  gradeName: string;        // e.g., "1st Grade"
  subject: string;          // e.g., "mathematics"
  domains: string[];        // e.g., ["Number & Operations", "Addition & Subtraction"]
  skills: string[];         // e.g., ["counting", "basic addition", ...]
  standards: CommonStandard[]; // List of standard objects covered in this step
}

// Example static mapping for demonstration (expand as needed)
export const curriculumStepGradeMap: CurriculumStepGradeMapEntry[] = [
  // 1st Grade, Step 1 - Foundation Basics, Mathematics
  {
    stepId: "1",
    stepTitle: "Foundation Basics",
    gradeLevel: 1,
    gradeName: "1st Grade",
    subject: "mathematics",
    domains: ["Operations & Algebraic Thinking", "Number & Operations in Base Ten"],
    skills: ["counting", "number recognition", "addition within 20", "subtraction within 20"],
    standards: getFilteredStandards("mathematics", 1)
  },
  // 2nd Grade, Step 1 - Foundation Basics, Mathematics
  {
    stepId: "1",
    stepTitle: "Foundation Basics",
    gradeLevel: 2,
    gradeName: "2nd Grade",
    subject: "mathematics",
    domains: ["Operations & Algebraic Thinking", "Number & Operations in Base Ten"],
    skills: ["addition within 100", "subtraction within 100", "understanding place value"],
    standards: getFilteredStandards("mathematics", 2)
  },
  // 3rd Grade, Step 3 (Essential Skills), English
  {
    stepId: "3",
    stepTitle: "Essential Skills",
    gradeLevel: 3,
    gradeName: "3rd Grade",
    subject: "english",
    domains: ["Writing", "Reading: Literature"],
    skills: ["reading comprehension", "writing basics", "vocabulary development"],
    standards: getFilteredStandards("english", 3)
  },
  // Add more mappings for other steps, grades, subjects as your curriculum expands.
];

/**
 * Utility: getCurriculumForStep
 * Retrieve curriculum details for any step, grade, and subject.
 */
export function getCurriculumForStep(
  stepId: string,
  gradeLevel: number,
  subject: string
): CurriculumStepGradeMapEntry | undefined {
  return curriculumStepGradeMap.find(
    entry => entry.stepId === stepId &&
             entry.gradeLevel === gradeLevel &&
             entry.subject === subject.toLowerCase()
  );
}

/**
 * Utility: listAllCurriculumStepsForGrade
 * Retrieve a list of all steps mapped for a given grade/subject.
 */
export function listAllCurriculumStepsForGrade(
  gradeLevel: number,
  subject: string
): CurriculumStepGradeMapEntry[] {
  return curriculumStepGradeMap.filter(
    entry => entry.gradeLevel === gradeLevel &&
             entry.subject === subject.toLowerCase()
  );
}

