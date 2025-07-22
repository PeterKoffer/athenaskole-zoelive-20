export interface Student {
  id: string;
  name: string;
  email: string;
  enrollmentDate: string;
  progress: number;
  attendance: number;
  grades: { subject: string; grade: number }[];
}

export interface Class {
  id: string;
  name: string;
  grade: string;
  teacher: string;
  subject: string;
  students: Student[];
  schedule: string;
  room: string;
  capacity: number;
}

export interface SchoolStats {
  totalStudents: number;
  totalTeachers: number;
  averageProgress: number;
  attendanceRate: number;
}

export interface StudentProfile {
  personalInfo: {
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: string;
    nationality: string;
    idNumber: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    emergencyContact: string;
    emergencyPhone: string;
  };
  academicInfo: {
    grade: string;
    previousSchool: string;
    startDate: string;
    subjects: string[];
    specialNeeds: string;
    notes: string;
    currentStepId?: string; // optional: ID of the step (e.g., "1")
  };
  parentInfo: {
    parentName: string;
    parentEmail: string;
    parentPhone: string;
    parentAddress: string;
    relationship: string;
  };
  classId?: string; // optional field for class assignment
}

export interface RegistrationStep {
  id: number;
  title: string;
  icon: any;
}

// Teaching Perspective Setting for a school
export type TeachingPerspectiveType = "none" | "mild-christian" | "strong-christian" | "secular" | "custom";

export interface TeachingPerspectiveSettings {
  perspective: TeachingPerspectiveType;
  strength: number; // 1-10, how much the perspective influences teaching
  wishes?: string;  // Wishes, requests, or topics to emphasize
  avoid?: string;   // Topics or themes to avoid
  lastUpdated?: string;
  subjectWeights?: { [subjectId: string]: number };
}
