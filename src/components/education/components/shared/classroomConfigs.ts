
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
      backgroundImage: "/images/math-classroom.jpg",
      subjectColor: "#4CAF50",
      overlayOpacity: 0.7,
      environmentDescription: "A bright mathematics classroom with equations and geometric shapes"
    },
    languageArts: {
      subjectName: "Language Arts",
      primaryColor: "#FF9800",
      secondaryColor: "#FFB74D",
      accentColor: "#F57C00",
      backgroundImage: "/images/language-classroom.jpg",
      subjectColor: "#FF9800",
      overlayOpacity: 0.7,
      environmentDescription: "A cozy library setting with books and writing materials"
    },
    english: {
      subjectName: "English",
      primaryColor: "#FF9800",
      secondaryColor: "#FFB74D",
      accentColor: "#F57C00",
      backgroundImage: "/images/language-classroom.jpg",
      subjectColor: "#FF9800",
      overlayOpacity: 0.7,
      environmentDescription: "A cozy library setting with books and writing materials"
    },
    science: {
      subjectName: "Science",
      primaryColor: "#2196F3",
      secondaryColor: "#64B5F6",
      accentColor: "#1976D2",
      backgroundImage: "/images/science-classroom.jpg",
      subjectColor: "#2196F3",
      overlayOpacity: 0.7,
      environmentDescription: "A modern laboratory with scientific equipment and experiments"
    },
    socialStudies: {
      subjectName: "Social Studies",
      primaryColor: "#9C27B0",
      secondaryColor: "#BA68C8",
      accentColor: "#7B1FA2",
      backgroundImage: "/images/social-studies-classroom.jpg",
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
      backgroundImage: "/images/bodylab-classroom.jpg",
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
      backgroundImage: "/images/geography-classroom.jpg",
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
      backgroundImage: "/images/life-essentials-classroom.jpg",
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
      backgroundImage: "/images/history-classroom.jpg",
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
      backgroundImage: "/images/wellness-classroom.jpg",
      subjectColor: "#4CAF50",
      overlayOpacity: 0.7,
      environmentDescription: "A peaceful mindfulness and wellness space"
    },
    default: {
      subjectName: "Learning",
      primaryColor: "#673AB7",
      secondaryColor: "#9575CD",
      accentColor: "#512DA8",
      loadingIcon: '📚',
      loadingMessage: 'Loading...',
      backgroundImage: "/images/default-classroom.jpg",
      subjectColor: "#673AB7",
      overlayOpacity: 0.7,
      environmentDescription: "A versatile learning environment"
    }
  };

  return configs[subject] || configs.default;
};
