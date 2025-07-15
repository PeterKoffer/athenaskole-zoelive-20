export interface StudentProfile {
  id: string;
  name: string;
  gradeLevel: number;
  learningStyle: 'mixed' | 'visual' | 'auditory' | 'kinesthetic';
  interests: string[];
  progress: {
    [subject: string]: {
      [skill: string]: number;
    };
  };
}
