
import { ClassroomConfig } from './ClassroomEnvironment';

// Classroom configurations for each subject using the provided Unsplash images
const classroomConfigs: Record<string, ClassroomConfig> = {
  'mathematics': {
    subjectName: 'Mathematics',
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    accentColor: '#60A5FA',
    backgroundImage: '/lovable-uploads/e8c77180-c952-401c-9f41-7bfb74d94967.png',
    subjectColor: '#3B82F6',
    overlayOpacity: 0.7,
    environmentDescription: 'Bright mathematics classroom with blue walls and math equations on blackboard'
  },
  'science': {
    subjectName: 'Science',
    primaryColor: '#10B981',
    secondaryColor: '#059669',
    accentColor: '#34D399',
    backgroundImage: '/lovable-uploads/3e7290ac-38f6-419d-af42-91ed54e26b77.png',
    subjectColor: '#10B981',
    overlayOpacity: 0.6,
    environmentDescription: 'Clean classroom with green blackboard perfect for science learning'
  },
  'history-religion': {
    subjectName: 'History & Religion',
    primaryColor: '#F59E0B',
    secondaryColor: '#D97706',
    accentColor: '#FBBF24',
    backgroundImage: '/lovable-uploads/5533306d-0f97-4375-b7ef-14fc095edef3.png',
    subjectColor: '#F59E0B',
    overlayOpacity: 0.5,
    environmentDescription: 'Classic history classroom with historical artifacts and world maps'
  },
  'world-history-religions': {
    subjectName: 'World History & Religions',
    primaryColor: '#F59E0B',
    secondaryColor: '#D97706',
    accentColor: '#FBBF24',
    backgroundImage: '/lovable-uploads/5533306d-0f97-4375-b7ef-14fc095edef3.png',
    subjectColor: '#F59E0B',
    overlayOpacity: 0.5,
    environmentDescription: 'Traditional history classroom with world maps and historical displays'
  },
  'english': {
    subjectName: 'English',
    primaryColor: '#8B5CF6',
    secondaryColor: '#7C3AED',
    accentColor: '#A78BFA',
    backgroundImage: '/lovable-uploads/d584a37f-9a21-40b7-b3b3-e22ce9b91e5a.png',
    subjectColor: '#8B5CF6',
    overlayOpacity: 0.6,
    environmentDescription: 'Classic classroom with teacher and beautiful lighting perfect for language learning'
  },
  'language-lab': {
    subjectName: 'Language Lab',
    primaryColor: '#F97316',
    secondaryColor: '#EA580C',
    accentColor: '#FB923C',
    backgroundImage: '/lovable-uploads/9d6652ab-9a6c-41b4-b243-88ec0f5add86.png',
    subjectColor: '#F97316',
    overlayOpacity: 0.6,
    environmentDescription: 'Modern language classroom with interactive learning environment'
  },
  'geography': {
    subjectName: 'Geography',
    primaryColor: '#059669',
    secondaryColor: '#047857',
    accentColor: '#10B981',
    backgroundImage: '/lovable-uploads/93c21ec1-4014-4170-ba94-cc79740fb673.png',
    subjectColor: '#059669',
    overlayOpacity: 0.6,
    environmentDescription: 'Geography classroom with world map and geographical learning materials'
  },
  'global-geography': {
    subjectName: 'Global Geography',
    primaryColor: '#0891B2',
    secondaryColor: '#0E7490',
    accentColor: '#06B6D4',
    backgroundImage: '/lovable-uploads/93c21ec1-4014-4170-ba94-cc79740fb673.png',
    subjectColor: '#0891B2',
    overlayOpacity: 0.6,
    environmentDescription: 'Global geography classroom with world maps and geographical displays'
  },
  'computer-science': {
    subjectName: 'Computer Science',
    primaryColor: '#6366F1',
    secondaryColor: '#4F46E5',
    accentColor: '#818CF8',
    backgroundImage: '/lovable-uploads/d6dd5b62-fafb-483a-be80-1fb5d88c9b3a.png',
    subjectColor: '#6366F1',
    overlayOpacity: 0.7,
    environmentDescription: 'Modern neutral classroom with mathematical displays perfect for computer science'
  },
  'creative-arts': {
    subjectName: 'Creative Arts',
    primaryColor: '#EC4899',
    secondaryColor: '#DB2777',
    accentColor: '#F472B6',
    backgroundImage: '/lovable-uploads/21d261a5-4b71-4ced-a38c-416551e6cd98.png',
    subjectColor: '#EC4899',
    overlayOpacity: 0.5,
    environmentDescription: 'Art studio classroom with easels, paints, and creative materials'
  },
  'music': {
    subjectName: 'Music',
    primaryColor: '#8B5CF6',
    secondaryColor: '#7C3AED',
    accentColor: '#A78BFA',
    backgroundImage: '/lovable-uploads/408db6c6-e5cd-429a-bc22-2f64f8292f91.png',
    subjectColor: '#8B5CF6',
    overlayOpacity: 0.4,
    environmentDescription: 'Music classroom with instruments, musical notes and performance space'
  },
  'body-lab': {
    subjectName: 'Body Lab',
    primaryColor: '#DC2626',
    secondaryColor: '#B91C1C',
    accentColor: '#EF4444',
    backgroundImage: '/lovable-uploads/ad6b4ccb-090c-4c29-844f-cc5f14e30695.png',
    subjectColor: '#DC2626',
    overlayOpacity: 0.6,
    environmentDescription: 'Physical education and body lab classroom with exercise equipment'
  },
  'mental-wellness': {
    subjectName: 'Mental Wellness',
    primaryColor: '#06B6D4',
    secondaryColor: '#0891B2',
    accentColor: '#22D3EE',
    backgroundImage: '/lovable-uploads/58ffa4c0-eb2a-4fae-b767-033618be64fb.png',
    subjectColor: '#06B6D4',
    overlayOpacity: 0.5,
    environmentDescription: 'Calm and peaceful classroom environment for mental wellness activities'
  },
  'life-essentials': {
    subjectName: 'Life Essentials',
    primaryColor: '#64748B',
    secondaryColor: '#475569',
    accentColor: '#94A3B8',
    backgroundImage: '/lovable-uploads/58ffa4c0-eb2a-4fae-b767-033618be64fb.png',
    subjectColor: '#64748B',
    overlayOpacity: 0.6,
    environmentDescription: 'Practical classroom setting for learning essential life skills'
  }
};

export const getClassroomConfig = (subject: string): ClassroomConfig => {
  const config = classroomConfigs[subject];
  if (!config) {
    console.warn(`No classroom config found for subject: ${subject}, using default`);
    return classroomConfigs['mathematics']; // Default fallback
  }
  return config;
};

export const getAllClassroomConfigs = (): Record<string, ClassroomConfig> => {
  return classroomConfigs;
};
