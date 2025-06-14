
import { ClassroomConfig } from './ClassroomEnvironment';

export const CLASSROOM_CONFIGS: Record<string, ClassroomConfig> = {
  mathematics: {
    backgroundImage: '/lovable-uploads/cbb7dd63-109c-4bd4-b49c-cbfc55dea8a1.png', // Math classroom with equations
    subjectColor: '#1e1b4b', // Deep indigo for math
    accentColor: '#8b5cf6', // Purple accent
    overlayOpacity: 0.85,
    subjectName: 'Mathematics',
    environmentDescription: 'Interactive Math Classroom with Nelie'
  },
  
  english: {
    backgroundImage: '/lovable-uploads/cbb7dd63-109c-4bd4-b49c-cbfc55dea8a1.png', // Using math classroom for now
    subjectColor: '#164e63', // Deep cyan for English
    accentColor: '#06b6d4', // Cyan accent
    overlayOpacity: 0.85,
    subjectName: 'English Language Arts',
    environmentDescription: 'Creative Writing & Reading Classroom with Nelie'
  },
  
  science: {
    backgroundImage: '/lovable-uploads/4cc17a8b-1d30-4146-993f-7b97b7e6be5b.png', // Science classroom with "Science in History"
    subjectColor: '#14532d', // Deep green for science
    accentColor: '#10b981', // Green accent
    overlayOpacity: 0.85,
    subjectName: 'Science',
    environmentDescription: 'Discovery Science Lab with Nelie'
  },
  
  computerscience: {
    backgroundImage: '/lovable-uploads/4cc17a8b-1d30-4146-993f-7b97b7e6be5b.png', // Using science classroom for now
    subjectColor: '#0f172a', // Dark slate for CS
    accentColor: '#3b82f6', // Blue accent
    overlayOpacity: 0.85,
    subjectName: 'Computer Science',
    environmentDescription: 'Technology Lab with Nelie'
  },

  music: {
    backgroundImage: '/lovable-uploads/cbb7dd63-109c-4bd4-b49c-cbfc55dea8a1.png', // Using math classroom for now
    subjectColor: '#581c87', // Deep purple for music
    accentColor: '#a855f7', // Purple accent
    overlayOpacity: 0.85,
    subjectName: 'Music',
    environmentDescription: 'Music Classroom with Nelie'
  },

  creative: {
    backgroundImage: '/lovable-uploads/cbb7dd63-109c-4bd4-b49c-cbfc55dea8a1.png', // Using math classroom for now
    subjectColor: '#7c2d12', // Deep orange for creative arts
    accentColor: '#f97316', // Orange accent
    overlayOpacity: 0.85,
    subjectName: 'Creative Arts',
    environmentDescription: 'Creative Arts Studio with Nelie'
  },

  language: {
    backgroundImage: '/lovable-uploads/cbb7dd63-109c-4bd4-b49c-cbfc55dea8a1.png', // Using math classroom for now
    subjectColor: '#be123c', // Deep rose for language
    accentColor: '#f43f5e', // Rose accent
    overlayOpacity: 0.85,
    subjectName: 'Language Learning',
    environmentDescription: 'Language Learning Classroom with Nelie'
  }
};

export const getClassroomConfig = (subject: string): ClassroomConfig => {
  return CLASSROOM_CONFIGS[subject] || CLASSROOM_CONFIGS.mathematics;
};
