export interface Class {
  id: string;
  name: string;
  subject: string;
  grade: number;
  students: number;
  teacher: string;
}

export interface LessonCoverage {
  id: string;
  classId: string;
  className: string;
  date: string;
  status: 'present' | 'missing' | 'incomplete';
  lesson?: {
    title: string;
    duration: number;
    objectives: string[];
  };
}

export interface LessonCoverageFilters {
  classId?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: 'all' | 'present' | 'missing' | 'incomplete';
}

export interface LessonCoverageStats {
  totalClasses: number;
  totalDays: number;
  presentLessons: number;
  missingLessons: number;
  incompleteLessons: number;
  coveragePercentage: number;
}