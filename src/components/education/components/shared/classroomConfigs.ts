
import { ClassroomConfig } from './ClassroomEnvironment';

// Classroom configurations for each subject using the provided Unsplash images
const classroomConfigs: Record<string, ClassroomConfig> = {
  'mathematics': {
    subjectName: 'Mathematics',
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    accentColor: '#60A5FA',
    backgroundImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    subjectColor: '#3B82F6',
    overlayOpacity: 0.7,
    environmentDescription: 'Modern technology-focused learning environment perfect for mathematical computations and programming logic'
  },
  'science': {
    subjectName: 'Science',
    primaryColor: '#10B981',
    secondaryColor: '#059669',
    accentColor: '#34D399',
    backgroundImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    subjectColor: '#10B981',
    overlayOpacity: 0.6,
    environmentDescription: 'Natural mountain summit environment inspiring exploration and discovery in earth sciences'
  },
  'history-religion': {
    subjectName: 'History & Religion',
    primaryColor: '#F59E0B',
    secondaryColor: '#D97706',
    accentColor: '#FBBF24',
    backgroundImage: 'https://images.unsplash.com/photo-1473177104440-ffee2f376098?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    subjectColor: '#F59E0B',
    overlayOpacity: 0.5,
    environmentDescription: 'Sacred cathedral interior providing a contemplative atmosphere for studying history and religious traditions'
  },
  'world-history-religions': {
    subjectName: 'World History & Religions',
    primaryColor: '#F59E0B',
    secondaryColor: '#D97706',
    accentColor: '#FBBF24',
    backgroundImage: 'https://images.unsplash.com/photo-1473177104440-ffee2f376098?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    subjectColor: '#F59E0B',
    overlayOpacity: 0.5,
    environmentDescription: 'Majestic cathedral setting perfect for exploring world religions and historical traditions'
  },
  'english': {
    subjectName: 'English',
    primaryColor: '#8B5CF6',
    secondaryColor: '#7C3AED',
    accentColor: '#A78BFA',
    backgroundImage: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    subjectColor: '#8B5CF6',
    overlayOpacity: 0.6,
    environmentDescription: 'Clean architectural environment fostering clear thinking and structured language learning'
  },
  'language-lab': {
    subjectName: 'Language Lab',
    primaryColor: '#F97316',
    secondaryColor: '#EA580C',
    accentColor: '#FB923C',
    backgroundImage: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    subjectColor: '#F97316',
    overlayOpacity: 0.6,
    environmentDescription: 'Modern architectural space designed for immersive language learning experiences'
  },
  'geography': {
    subjectName: 'Geography',
    primaryColor: '#059669',
    secondaryColor: '#047857',
    accentColor: '#10B981',
    backgroundImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    subjectColor: '#059669',
    overlayOpacity: 0.6,
    environmentDescription: 'Stunning mountain landscape perfect for studying geographical formations and natural environments'
  },
  'global-geography': {
    subjectName: 'Global Geography',
    primaryColor: '#0891B2',
    secondaryColor: '#0E7490',
    accentColor: '#06B6D4',
    backgroundImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    subjectColor: '#0891B2',
    overlayOpacity: 0.6,
    environmentDescription: 'Expansive mountain vista representing the vastness of global geographical study'
  },
  'computer-science': {
    subjectName: 'Computer Science',
    primaryColor: '#6366F1',
    secondaryColor: '#4F46E5',
    accentColor: '#818CF8',
    backgroundImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    subjectColor: '#6366F1',
    overlayOpacity: 0.7,
    environmentDescription: 'High-tech programming environment with Java code display, perfect for computer science learning'
  },
  'creative-arts': {
    subjectName: 'Creative Arts',
    primaryColor: '#EC4899',
    secondaryColor: '#DB2777',
    accentColor: '#F472B6',
    backgroundImage: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    subjectColor: '#EC4899',
    overlayOpacity: 0.5,
    environmentDescription: 'Clean, minimalist architectural space inspiring creativity and artistic expression'
  },
  'music': {
    subjectName: 'Music',
    primaryColor: '#8B5CF6',
    secondaryColor: '#7C3AED',
    accentColor: '#A78BFA',
    backgroundImage: 'https://images.unsplash.com/photo-1473177104440-ffee2f376098?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    subjectColor: '#8B5CF6',
    overlayOpacity: 0.4,
    environmentDescription: 'Resonant cathedral interior with excellent acoustics for musical education and appreciation'
  },
  'body-lab': {
    subjectName: 'Body Lab',
    primaryColor: '#DC2626',
    secondaryColor: '#B91C1C',
    accentColor: '#EF4444',
    backgroundImage: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    subjectColor: '#DC2626',
    overlayOpacity: 0.6,
    environmentDescription: 'Clinical architectural environment perfect for studying human anatomy and physiology'
  },
  'mental-wellness': {
    subjectName: 'Mental Wellness',
    primaryColor: '#06B6D4',
    secondaryColor: '#0891B2',
    accentColor: '#22D3EE',
    backgroundImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    subjectColor: '#06B6D4',
    overlayOpacity: 0.5,
    environmentDescription: 'Peaceful mountain environment promoting mental clarity and wellness practices'
  },
  'life-essentials': {
    subjectName: 'Life Essentials',
    primaryColor: '#64748B',
    secondaryColor: '#475569',
    accentColor: '#94A3B8',
    backgroundImage: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    subjectColor: '#64748B',
    overlayOpacity: 0.6,
    environmentDescription: 'Practical architectural setting ideal for learning essential life skills and daily living'
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
