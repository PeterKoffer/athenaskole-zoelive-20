
export interface ClassroomConfig {
  subjectName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  loadingIcon?: string;
  loadingMessage?: string;
  backgroundImage: string;
  subjectColor: string;
  overlayOpacity: number;
  environmentDescription: string; // Made required
}

export const getClassroomConfig = (subject: string): ClassroomConfig => {
  const configs: Record<string, ClassroomConfig> = {
    mathematics: {
      subjectName: "Mathematics",
      primaryColor: "#4CAF50",
      secondaryColor: "#81C784",
      accentColor: "#388E3C",
      backgroundImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&h=800&fit=crop",
      subjectColor: "#4CAF50",
      overlayOpacity: 0.7,
      environmentDescription: "A bright mathematics classroom with equations and geometric shapes"
    },
    languageArts: {
      subjectName: "Language Arts",
      primaryColor: "#FF9800",
      secondaryColor: "#FFB74D",
      accentColor: "#F57C00",
      backgroundImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop",
      subjectColor: "#FF9800",
      overlayOpacity: 0.7,
      environmentDescription: "A cozy library setting with books and writing materials"
    },
    english: {
      subjectName: "English",
      primaryColor: "#FF9800",
      secondaryColor: "#FFB74D",
      accentColor: "#F57C00",
      backgroundImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop",
      subjectColor: "#FF9800",
      overlayOpacity: 0.7,
      environmentDescription: "A cozy library setting with books and writing materials"
    },
    science: {
      subjectName: "Science",
      primaryColor: "#2196F3",
      secondaryColor: "#64B5F6",
      accentColor: "#1976D2",
      backgroundImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=800&fit=crop",
      subjectColor: "#2196F3",
      overlayOpacity: 0.7,
      environmentDescription: "A modern laboratory with scientific equipment and experiments"
    },
    socialStudies: {
      subjectName: "Social Studies",
      primaryColor: "#9C27B0",
      secondaryColor: "#BA68C8",
      accentColor: "#7B1FA2",
      backgroundImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=800&fit=crop",
      subjectColor: "#9C27B0",
      overlayOpacity: 0.7,
      environmentDescription: "A classroom with maps, globes, and historical artifacts"
    },
    bodyLab: {
      subjectName: "BodyLab",
      primaryColor: "#E91E63",
      secondaryColor: "#F06292",
      accentColor: "#C2185B",
      loadingIcon: '💪',
      loadingMessage: 'Warming up BodyLab...',
      backgroundImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=800&fit=crop",
      subjectColor: "#E91E63",
      overlayOpacity: 0.7,
      environmentDescription: "An active fitness space with exercise equipment"
    },
    globalGeography: {
      subjectName: "Global Geography",
      primaryColor: "#607D8B",
      secondaryColor: "#90A4AE",
      accentColor: "#455A64",
      loadingIcon: '🌍',
      loadingMessage: 'Loading geographical data...',
      backgroundImage: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=800&fit=crop",
      subjectColor: "#607D8B",
      overlayOpacity: 0.7,
      environmentDescription: "A classroom with world maps and geographical displays"
    },
    lifeEssentials: {
      subjectName: "Life Essentials",
      primaryColor: "#795548",
      secondaryColor: "#A1887F",
      accentColor: "#5D4037",
      loadingIcon: '🛠️',
      loadingMessage: 'Loading Life Essentials...',
      backgroundImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=800&fit=crop",
      subjectColor: "#795548",
      overlayOpacity: 0.7,
      environmentDescription: "A practical learning space with life skills materials"
    },
    worldHistoryReligions: {
      subjectName: "World History & Religions",
      primaryColor: "#FFC107",
      secondaryColor: "#FFD54F",
      accentColor: "#FF8F00",
      loadingIcon: '📜',
      loadingMessage: 'Loading historical records...',
      backgroundImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=800&fit=crop",
      subjectColor: "#FFC107",
      overlayOpacity: 0.7,
      environmentDescription: "A classical classroom with historical artifacts and timelines"
    },
    mentalWellness: {
      subjectName: "Mental Wellness",
      primaryColor: "#4CAF50",
      secondaryColor: "#81C784",
      accentColor: "#388E3C",
      loadingIcon: '🧘',
      loadingMessage: 'Loading Mental Wellness...',
      backgroundImage: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=1200&h=800&fit=crop",
      subjectColor: "#4CAF50",
      overlayOpacity: 0.7,
      environmentDescription: "A peaceful mindfulness and wellness space"
    },
    music: {
      subjectName: "Music",
      primaryColor: "#9C27B0",
      secondaryColor: "#BA68C8",
      accentColor: "#7B1FA2",
      loadingIcon: '🎵',
      loadingMessage: 'Loading Music Discovery...',
      backgroundImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=800&fit=crop",
      subjectColor: "#9C27B0",
      overlayOpacity: 0.7,
      environmentDescription: "A creative music studio with instruments and sound equipment"
    },
    creativeArts: {
      subjectName: "Creative Arts",
      primaryColor: "#E91E63",
      secondaryColor: "#F06292",
      accentColor: "#C2185B",
      loadingIcon: '🎨',
      loadingMessage: 'Loading Creative Arts...',
      backgroundImage: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200&h=800&fit=crop",
      subjectColor: "#E91E63",
      overlayOpacity: 0.7,
      environmentDescription: "An inspiring art studio with creative materials and artwork"
    },
    computerScience: {
      subjectName: "Computer Science",
      primaryColor: "#2196F3",
      secondaryColor: "#64B5F6",
      accentColor: "#1976D2",
      loadingIcon: '💻',
      loadingMessage: 'Loading Computer Science...',
      backgroundImage: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=1200&h=800&fit=crop",
      subjectColor: "#2196F3",
      overlayOpacity: 0.7,
      environmentDescription: "A modern computer lab with technology and coding workstations"
    },
    languageLab: {
      subjectName: "Language Lab",
      primaryColor: "#FF5722",
      secondaryColor: "#FF8A65",
      accentColor: "#D84315",
      loadingIcon: '🌐',
      loadingMessage: 'Loading Language Lab...',
      backgroundImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=800&fit=crop",
      subjectColor: "#FF5722",
      overlayOpacity: 0.7,
      environmentDescription: "A multicultural language learning environment with world flags and materials"
    },
    default: {
      subjectName: "Learning",
      primaryColor: "#673AB7",
      secondaryColor: "#9575CD",
      accentColor: "#512DA8",
      loadingIcon: '📚',
      loadingMessage: 'Loading...',
      backgroundImage: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=1200&h=800&fit=crop",
      subjectColor: "#673AB7",
      overlayOpacity: 0.7,
      environmentDescription: "A versatile learning environment"
    }
  };

  return configs[subject] || configs.default;
};
