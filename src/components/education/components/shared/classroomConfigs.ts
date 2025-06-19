
import { ClassroomConfig } from './ClassroomEnvironment';

export const CLASSROOM_CONFIGS: Record<string, ClassroomConfig> = {
  mathematics: {
    backgroundImage: '/lovable-uploads/5f9c6e95-d949-47f5-bb3a-08f0c1c84d72.png', // Modern math classroom with equations on blackboard
    subjectColor: '#1e1b4b', // Deep indigo for math
    accentColor: '#8b5cf6', // Purple accent
    overlayOpacity: 0, // No overlay
    subjectName: 'Mathematics',
    environmentDescription: 'Interactive Math Classroom with Nelie'
  },
  
  english: {
    backgroundImage: '/lovable-uploads/9159860b-6b0b-413c-abd0-a9eba4d31423.png', // Cozy teachers room classroom
    subjectColor: '#164e63', // Deep cyan for English
    accentColor: '#06b6d4', // Cyan accent
    overlayOpacity: 0, // No overlay
    subjectName: 'English Language Arts',
    environmentDescription: 'Creative Writing & Reading Classroom with Nelie'
  },
  
  science: {
    backgroundImage: '/lovable-uploads/ab7502b0-78bd-4d20-8254-3e5a2c355bfd.png', // Clean modern classroom with green chalkboard
    subjectColor: '#14532d', // Deep green for science
    accentColor: '#10b981', // Green accent
    overlayOpacity: 0, // No overlay
    subjectName: 'Science',
    environmentDescription: 'Discovery Science Lab with Nelie'
  },
  
  'computer-science': {
    backgroundImage: '/lovable-uploads/bb51f857-f561-4049-8eac-9f9d6868d1ee.png', // Modern computer science classroom
    subjectColor: '#0f172a', // Dark slate for CS
    accentColor: '#3b82f6', // Blue accent
    overlayOpacity: 0, // No overlay
    subjectName: 'Computer Science',
    environmentDescription: 'Technology Lab with Nelie'
  },

  music: {
    backgroundImage: '/lovable-uploads/4f04a56b-d49f-4093-b974-e56c182dbefd.png', // Music classroom with instruments and keyboards
    subjectColor: '#581c87', // Deep purple for music
    accentColor: '#a855f7', // Purple accent
    overlayOpacity: 0, // No overlay
    subjectName: 'Music',
    environmentDescription: 'Music Classroom with Nelie'
  },

  'creative-arts': {
    backgroundImage: '/lovable-uploads/aa5d1c92-da37-4dc9-b296-97e3a8959445.png', // Bright creative classroom with art supplies
    subjectColor: '#7c2d12', // Deep orange for creative arts
    accentColor: '#f97316', // Orange accent
    overlayOpacity: 0, // No overlay
    subjectName: 'Creative Arts',
    environmentDescription: 'Creative Arts Studio with Nelie'
  },

  language: {
    backgroundImage: '/lovable-uploads/c8289e41-3209-4615-9d1c-a88a36d97a9d.png', // History classroom for language/social studies
    subjectColor: '#be123c', // Deep rose for language
    accentColor: '#f43f5e', // Rose accent
    overlayOpacity: 0, // No overlay
    subjectName: 'Language Learning',
    environmentDescription: 'Language Learning Classroom with Nelie'
  },

  // Additional subject for geography/social studies
  geography: {
    backgroundImage: '/lovable-uploads/55794c6e-a3ae-477d-8b33-91c38b59faac.png', // Geography classroom with world map
    subjectColor: '#065f46', // Deep emerald for geography
    accentColor: '#10b981', // Emerald accent
    overlayOpacity: 0, // No overlay
    subjectName: 'Geography',
    environmentDescription: 'Geography & Social Studies Classroom with Nelie'
  },

  // Alternative music classroom
  'music-advanced': {
    backgroundImage: '/lovable-uploads/187b1fdd-cc92-4f4b-a966-804b5b76ea3a.png', // Advanced music classroom with full band setup
    subjectColor: '#581c87', // Deep purple for music
    accentColor: '#a855f7', // Purple accent
    overlayOpacity: 0, // No overlay
    subjectName: 'Advanced Music',
    environmentDescription: 'Advanced Music Performance Classroom with Nelie'
  },

  mentalWellness: {
    configName: "mentalWellness",
    backgroundImage: '/public/placeholder.svg', // Using placeholder for now
    backgroundColor: "bg-teal-700",
    // characterImageUrl: '', // Omitting for now
    primaryColor: "teal-400",
    secondaryColor: "cyan-300",
    greetingMessage: "Welcome to your Mental Wellness space. Let's explore and learn together.",
    loadingMessage: "Preparing a calm space for your Mental Wellness journey...",
    loadingIcon: "🧠",
    subjectColor: '#0f766e', // Teal-700
    accentColor: '#06b6d4', // Cyan-500
    overlayOpacity: 0,
    subjectName: 'Mental Wellness',
    environmentDescription: 'Calm Space for Mental Wellness with Nelie'
jules_wip_15189971815575095135
  },

  worldHistoryReligions: {
    configName: "worldHistoryReligions",
    subjectName: "World History & Religions",
    backgroundImage: '/public/placeholder.svg', // Placeholder: ancient scroll/map texture
    subjectColor: '#b45309', // amber-700
    accentColor: '#ef4444', // red-500
    // characterImageUrl: '/public/placeholder.svg', // Placeholder: historian/scholar avatar (omitting if not standard)
    greetingMessage: "Welcome to World History & Religions! Let's uncover the stories of our past.",
    loadingMessage: "Excavating historical records and sacred texts...",
    loadingIcon: "📜",
    environmentDescription: "An ancient library or archaeological site.",
    overlayOpacity: 0.6,
  },

  globalGeography: {
    configName: "globalGeography",
    subjectName: "Global Geography",
    backgroundImage: '/public/placeholder.svg', // Placeholder: world map/satellite image
    subjectColor: '#0369a1', // sky-700
    accentColor: '#22c55e', // green-500
    // characterImageUrl: '/public/placeholder.svg', // Placeholder: explorer/geographer avatar (omitting if not standard)
    greetingMessage: "Welcome to Global Geography! Ready to explore our amazing planet?",
    loadingMessage: "Charting a course across continents and oceans...",
    loadingIcon: "🌍",
    environmentDescription: "A vibrant world map or a view from a mountain top.",
    overlayOpacity: 0.5,
  },

  bodyLab: {
    configName: "bodyLab",
    subjectName: "BodyLab: Healthy Living",
    backgroundImage: '/public/placeholder.svg', // Placeholder: bright, energetic fitness/nature scene
    subjectColor: '#059669', // emerald-600
    accentColor: '#facc15', // yellow-400
    // characterImageUrl: '/public/placeholder.svg', // Placeholder: fitness coach/nutritionist avatar (omitting if not standard)
    greetingMessage: "Welcome to BodyLab! Let's energize your life.",
    loadingMessage: "Warming up for a session on health and fitness...",
    loadingIcon: "💪",
    environmentDescription: "A bright and modern fitness studio or a lush park.",
    overlayOpacity: 0.4,
  },

  lifeEssentials: {
    configName: "lifeEssentials",
    subjectName: "Life Essentials",
    backgroundImage: '/public/placeholder.svg', // Placeholder: organized desk/cityscape
    subjectColor: '#334155', // slate-700
    accentColor: '#a855f7', // purple-500
    // characterImageUrl: '/public/placeholder.svg', // Placeholder: mentor/advisor avatar (omitting if not standard)
    greetingMessage: "Welcome to Life Essentials! Let's prepare for your future.",
    loadingMessage: "Organizing tools and tips for navigating adulthood...",
    loadingIcon: "🛠️",
    environmentDescription: "A modern co-working space or a well-organized home office.",
    overlayOpacity: 0.5,
    main
  }
};

export const getClassroomConfig = (subject: string): ClassroomConfig => {
  const subjectKey = subject.toLowerCase().replace(/[^a-z-]/g, '');
  return CLASSROOM_CONFIGS[subjectKey] || CLASSROOM_CONFIGS.mathematics;
};
