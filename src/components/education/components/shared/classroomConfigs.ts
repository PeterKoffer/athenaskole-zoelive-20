
import { ClassroomConfig } from './ClassroomEnvironment';

export const getClassroomConfig = (subject: string): ClassroomConfig => {
  const configs: Record<string, ClassroomConfig> = {
    mathematics: {
      subjectName: 'Mathematics',
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF',
      accentColor: '#60A5FA',
      loadingIcon: '🔢',
      loadingMessage: 'Preparing your mathematics lesson...',
      backgroundImage: '/lovable-uploads/4d3c531b-4f81-4d98-a776-79a7d1d92dca.png',
      subjectColor: '#3B82F6',
      overlayOpacity: 0.3,
      environmentDescription: 'Modern mathematics classroom with digital displays and learning tools'
    },
    english: {
      subjectName: 'English',
      primaryColor: '#10B981',
      secondaryColor: '#047857',
      accentColor: '#34D399',
      loadingIcon: '📚',
      loadingMessage: 'Preparing your English lesson...',
      backgroundImage: '/lovable-uploads/4d3c531b-4f81-4d98-a776-79a7d1d92dca.png',
      subjectColor: '#10B981',
      overlayOpacity: 0.3,
      environmentDescription: 'Cozy English classroom filled with books and literature'
    },
    science: {
      subjectName: 'Science',
      primaryColor: '#8B5CF6',
      secondaryColor: '#7C3AED',
      accentColor: '#A78BFA',
      loadingIcon: '🔬',
      loadingMessage: 'Preparing your science lesson...',
      backgroundImage: '/lovable-uploads/4d3c531b-4f81-4d98-a776-79a7d1d92dca.png',
      subjectColor: '#8B5CF6',
      overlayOpacity: 0.3,
      environmentDescription: 'Advanced science laboratory with modern equipment'
    },
    'computer-science': {
      subjectName: 'Computer Science',
      primaryColor: '#F59E0B',
      secondaryColor: '#D97706',
      accentColor: '#FBBF24',
      loadingIcon: '💻',
      loadingMessage: 'Preparing your computer science lesson...',
      backgroundImage: '/lovable-uploads/4d3c531b-4f81-4d98-a776-79a7d1d92dca.png',
      subjectColor: '#F59E0B',
      overlayOpacity: 0.3,
      environmentDescription: 'High-tech computer lab with multiple workstations'
    },
    'creative-arts': {
      subjectName: 'Creative Arts',
      primaryColor: '#EC4899',
      secondaryColor: '#DB2777',
      accentColor: '#F472B6',
      loadingIcon: '🎨',
      loadingMessage: 'Preparing your creative arts lesson...',
      backgroundImage: '/lovable-uploads/4d3c531b-4f81-4d98-a776-79a7d1d92dca.png',
      subjectColor: '#EC4899',
      overlayOpacity: 0.3,
      environmentDescription: 'Bright art studio with easels and creative supplies'
    },
    music: {
      subjectName: 'Music',
      primaryColor: '#8B5CF6',
      secondaryColor: '#7C3AED',
      accentColor: '#A78BFA',
      loadingIcon: '🎵',
      loadingMessage: 'Preparing your music lesson...',
      backgroundImage: '/lovable-uploads/4d3c531b-4f81-4d98-a776-79a7d1d92dca.png',
      subjectColor: '#8B5CF6',
      overlayOpacity: 0.3,
      environmentDescription: 'Music room with instruments and acoustic panels'
    },
    'mental-wellness': {
      subjectName: 'Mental Wellness',
      primaryColor: '#06B6D4',
      secondaryColor: '#0891B2',
      accentColor: '#22D3EE',
      loadingIcon: '🧠',
      loadingMessage: 'Preparing your mental wellness lesson...',
      backgroundImage: '/lovable-uploads/4d3c531b-4f81-4d98-a776-79a7d1d92dca.png',
      subjectColor: '#06B6D4',
      overlayOpacity: 0.3,
      environmentDescription: 'Calm and peaceful wellness room with soft lighting'
    },
    'language-lab': {
      subjectName: 'Language Lab',
      primaryColor: '#EF4444',
      secondaryColor: '#DC2626',
      accentColor: '#F87171',
      loadingIcon: '🌍',
      loadingMessage: 'Preparing your language lesson...',
      backgroundImage: '/lovable-uploads/4d3c531b-4f81-4d98-a776-79a7d1d92dca.png',
      subjectColor: '#EF4444',
      overlayOpacity: 0.3,
      environmentDescription: 'Interactive language laboratory with audio-visual equipment'
    },
    'history-religion': {
      subjectName: 'History & Religion',
      primaryColor: '#92400E',
      secondaryColor: '#78350F',
      accentColor: '#A16207',
      loadingIcon: '📜',
      loadingMessage: 'Preparing your history lesson...',
      backgroundImage: '/lovable-uploads/4d3c531b-4f81-4d98-a776-79a7d1d92dca.png',
      subjectColor: '#92400E',
      overlayOpacity: 0.3,
      environmentDescription: 'Classic history classroom with historical artifacts and maps'
    },
    geography: {
      subjectName: 'Geography',
      primaryColor: '#059669',
      secondaryColor: '#047857',
      accentColor: '#10B981',
      loadingIcon: '🗺️',
      loadingMessage: 'Preparing your geography lesson...',
      backgroundImage: '/lovable-uploads/4d3c531b-4f81-4d98-a776-79a7d1d92dca.png',
      subjectColor: '#059669',
      overlayOpacity: 0.3,
      environmentDescription: 'Geography classroom with globes, maps, and geographical models'
    },
    'body-lab': {
      subjectName: 'Body Lab',
      primaryColor: '#DC2626',
      secondaryColor: '#B91C1C',
      accentColor: '#EF4444',
      loadingIcon: '💪',
      loadingMessage: 'Preparing your body lab lesson...',
      backgroundImage: '/lovable-uploads/4d3c531b-4f81-4d98-a776-79a7d1d92dca.png',
      subjectColor: '#DC2626',
      overlayOpacity: 0.3,
      environmentDescription: 'Health and fitness laboratory with exercise equipment'
    },
    'life-essentials': {
      subjectName: 'Life Essentials',
      primaryColor: '#7C2D12',
      secondaryColor: '#6B2B0C',
      accentColor: '#92400E',
      loadingIcon: '📋',
      loadingMessage: 'Preparing your life essentials lesson...',
      backgroundImage: '/lovable-uploads/4d3c531b-4f81-4d98-a776-79a7d1d92dca.png',
      subjectColor: '#7C2D12',
      overlayOpacity: 0.3,
      environmentDescription: 'Practical life skills classroom with real-world tools'
    },
    'global-geography': {
      subjectName: 'Global Geography',
      primaryColor: '#0891B2',
      secondaryColor: '#0E7490',
      accentColor: '#06B6D4',
      loadingIcon: '🌍',
      loadingMessage: 'Preparing your global geography lesson...',
      backgroundImage: '/lovable-uploads/4d3c531b-4f81-4d98-a776-79a7d1d92dca.png',
      subjectColor: '#0891B2',
      overlayOpacity: 0.3,
      environmentDescription: 'International geography center with world maps and cultural displays'
    },
    'world-history-religions': {
      subjectName: 'World History & Religions',
      primaryColor: '#7C2D12',
      secondaryColor: '#6B2B0C',
      accentColor: '#92400E',
      loadingIcon: '🏛️',
      loadingMessage: 'Preparing your world history lesson...',
      backgroundImage: '/lovable-uploads/4d3c531b-4f81-4d98-a776-79a7d1d92dca.png',
      subjectColor: '#7C2D12',
      overlayOpacity: 0.3,
      environmentDescription: 'Historical hall with artifacts from world civilizations'
    }
  };

  return configs[subject] || {
    subjectName: subject.charAt(0).toUpperCase() + subject.slice(1),
    primaryColor: '#6366F1',
    secondaryColor: '#4F46E5',
    accentColor: '#818CF8',
    loadingIcon: '📖',
    loadingMessage: 'Preparing your lesson...',
    backgroundImage: '/lovable-uploads/4d3c531b-4f81-4d98-a776-79a7d1d92dca.png',
    subjectColor: '#6366F1',
    overlayOpacity: 0.3,
    environmentDescription: 'Modern learning environment designed for interactive education'
  };
};
