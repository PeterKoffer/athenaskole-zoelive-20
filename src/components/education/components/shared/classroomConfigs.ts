
import { ClassroomConfig } from './ClassroomEnvironment';

export const CLASSROOM_CONFIGS: Record<string, ClassroomConfig> = {
  mathematics: {
    backgroundImage: '/lovable-uploads/7da0d8ba-b565-4d22-b0e1-d7a2216fced8.png',
    subjectColor: '#1e1b4b', // Deep indigo for math
    accentColor: '#8b5cf6', // Purple accent
    overlayOpacity: 0.85,
    subjectName: 'Mathematics',
    environmentDescription: 'Interactive Math Classroom with Nelie'
  },
  
  english: {
    backgroundImage: '/lovable-uploads/7da0d8ba-b565-4d22-b0e1-d7a2216fced8.png',
    subjectColor: '#164e63', // Deep cyan for English
    accentColor: '#06b6d4', // Cyan accent
    overlayOpacity: 0.85,
    subjectName: 'English Language Arts',
    environmentDescription: 'Creative Writing & Reading Classroom with Nelie'
  },
  
  science: {
    backgroundImage: '/lovable-uploads/7da0d8ba-b565-4d22-b0e1-d7a2216fced8.png',
    subjectColor: '#14532d', // Deep green for science
    accentColor: '#10b981', // Green accent
    overlayOpacity: 0.85,
    subjectName: 'Science',
    environmentDescription: 'Discovery Science Lab with Nelie'
  },
  
  computerscience: {
    backgroundImage: '/lovable-uploads/7da0d8ba-b565-4d22-b0e1-d7a2216fced8.png',
    subjectColor: '#0f172a', // Dark slate for CS
    accentColor: '#3b82f6', // Blue accent
    overlayOpacity: 0.85,
    subjectName: 'Computer Science',
    environmentDescription: 'Technology Lab with Nelie'
  },

  music: {
    backgroundImage: '/lovable-uploads/7da0d8ba-b565-4d22-b0e1-d7a2216fced8.png',
    subjectColor: '#581c87', // Deep purple for music
    accentColor: '#a855f7', // Purple accent
    overlayOpacity: 0.85,
    subjectName: 'Music',
    environmentDescription: 'Music Classroom with Nelie'
  },

  creative: {
    backgroundImage: '/lovable-uploads/7da0d8ba-b565-4d22-b0e1-d7a2216fced8.png',
    subjectColor: '#7c2d12', // Deep orange for creative arts
    accentColor: '#f97316', // Orange accent
    overlayOpacity: 0.85,
    subjectName: 'Creative Arts',
    environmentDescription: 'Creative Arts Studio with Nelie'
  },

  language: {
    backgroundImage: '/lovable-uploads/7da0d8ba-b565-4d22-b0e1-d7a2216fced8.png',
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
