
export interface GradeLevel {
  grade: number;
  name: string;
  ageRange: string;
  description: string;
}

export interface CommonStandard {
  id: string;
  code: string;
  title: string;
  description: string;
  subject: string;
  gradeLevel: number; // Changed from grade to gradeLevel
  domain?: string;
  cluster?: string;
  difficulty: number; // Added required difficulty property
}

export interface GradeLevelMapping {
  grade: number;
  subjects: {
    [subject: string]: {
      standards: CommonStandard[];
      skillAreas: string[];
      difficultyRange: [number, number];
      prerequisites?: string[];
    };
  };
}

export interface CurriculumAlignment {
  standardId: string;
  standard: CommonStandard;
  gradeLevel: number;
  isPrerequisite: boolean;
  masteryLevel: number;
}

export const GRADE_LEVELS: GradeLevel[] = [
  { grade: 1, name: "1st Grade", ageRange: "6-7", description: "Foundation learning and basic skills" },
  { grade: 2, name: "2nd Grade", ageRange: "7-8", description: "Building fundamental concepts" },
  { grade: 3, name: "3rd Grade", ageRange: "8-9", description: "Expanding knowledge base" },
  { grade: 4, name: "4th Grade", ageRange: "9-10", description: "Intermediate skill development" },
  { grade: 5, name: "5th Grade", ageRange: "10-11", description: "Elementary mastery" },
  { grade: 6, name: "6th Grade", ageRange: "11-12", description: "Middle school preparation" },
  { grade: 7, name: "7th Grade", ageRange: "12-13", description: "Middle school development" },
  { grade: 8, name: "8th Grade", ageRange: "13-14", description: "Pre-high school preparation" },
  { grade: 9, name: "9th Grade", ageRange: "14-15", description: "High school foundation" },
  { grade: 10, name: "10th Grade", ageRange: "15-16", description: "Intermediate high school" },
  { grade: 11, name: "11th Grade", ageRange: "16-17", description: "Advanced high school" },
  { grade: 12, name: "12th Grade", ageRange: "17-18", description: "College preparation" }
];
