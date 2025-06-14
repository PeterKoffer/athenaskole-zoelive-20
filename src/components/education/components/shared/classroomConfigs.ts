
import { ClassroomConfig } from './ClassroomEnvironment';

export const CLASSROOM_CONFIGS: Record<string, ClassroomConfig> = {
  mathematics: {
    backgroundImage: '/lovable-uploads/07757147-84dc-4515-8288-c8150519c3bf.png',
    subjectColor: '#1e1b4b', // Deep indigo for math
    accentColor: '#8b5cf6', // Purple accent
    overlayOpacity: 0.85,
    subjectName: 'Mathematics',
    environmentDescription: 'Interactive Math Classroom with Nelie'
  },
  
  english: {
    backgroundImage: '/lovable-uploads/07757147-84dc-4515-8288-c8150519c3bf.png',
    subjectColor: '#164e63', // Deep cyan for English
    accentColor: '#06b6d4', // Cyan accent
    overlayOpacity: 0.85,
    subjectName: 'English Language Arts',
    environmentDescription: 'Creative Writing & Reading Classroom with Nelie'
  },
  
  science: {
    backgroundImage: '/lovable-uploads/07757147-84dc-4515-8288-c8150519c3bf.png',
    subjectColor: '#14532d', // Deep green for science
    accentColor: '#10b981', // Green accent
    overlayOpacity: 0.85,
    subjectName: 'Science',
    environmentDescription: 'Discovery Science Lab with Nelie'
  },
  
  // Add more subjects as needed
  computerscience: {
    backgroundImage: '/lovable-uploads/07757147-84dc-4515-8288-c8150519c3bf.png',
    subjectColor: '#0f172a', // Dark slate for CS
    accentColor: '#3b82f6', // Blue accent
    overlayOpacity: 0.85,
    subjectName: 'Computer Science',
    environmentDescription: 'Technology Lab with Nelie'
  }
};

export const getClassroomConfig = (subject: string): ClassroomConfig => {
  return CLASSROOM_CONFIGS[subject] || CLASSROOM_CONFIGS.mathematics;
};
