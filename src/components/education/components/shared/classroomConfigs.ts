
export interface ClassroomConfig {
  subjectName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  loadingIcon?: string;
  loadingMessage?: string;
  backgroundImage: string; // Made required to match ClassroomEnvironment
  subjectColor?: string;
  overlayOpacity?: number;
  environmentDescription?: string;
}

export const getClassroomConfig = (subject: string): ClassroomConfig => {
  const configs: Record<string, ClassroomConfig> = {
    mathematics: {
      subjectName: "Mathematics",
      primaryColor: "#4CAF50", // Green
      secondaryColor: "#81C784", // Light Green
      accentColor: "#388E3C", // Dark Green
      backgroundImage: "/images/math-classroom.jpg",
      subjectColor: "#4CAF50",
      overlayOpacity: 0.7,
      environmentDescription: "A bright mathematics classroom with equations and geometric shapes"
    },
    languageArts: {
      subjectName: "Language Arts",
      primaryColor: "#FF9800", // Orange
      secondaryColor: "#FFB74D", // Light Orange
      accentColor: "#F57C00", // Dark Orange
      backgroundImage: "/images/language-classroom.jpg",
      subjectColor: "#FF9800",
      overlayOpacity: 0.7,
      environmentDescription: "A cozy library setting with books and writing materials"
    },
    english: {
      subjectName: "English",
      primaryColor: "#FF9800", // Orange
      secondaryColor: "#FFB74D", // Light Orange
      accentColor: "#F57C00", // Dark Orange
      backgroundImage: "/images/language-classroom.jpg",
      subjectColor: "#FF9800",
      overlayOpacity: 0.7,
      environmentDescription: "A cozy library setting with books and writing materials"
    },
    science: {
      subjectName: "Science",
      primaryColor: "#2196F3", // Blue
      secondaryColor: "#64B5F6", // Light Blue
      accentColor: "#1976D2", // Dark Blue
      backgroundImage: "/images/science-classroom.jpg",
      subjectColor: "#2196F3",
      overlayOpacity: 0.7,
      environmentDescription: "A modern laboratory with scientific equipment and experiments"
    },
    socialStudies: {
      subjectName: "Social Studies",
      primaryColor: "#9C27B0", // Purple
      secondaryColor: "#BA68C8", // Light Purple
      accentColor: "#7B1FA2", // Dark Purple
      backgroundImage: "/images/social-studies-classroom.jpg",
      subjectColor: "#9C27B0",
      overlayOpacity: 0.7,
      environmentDescription: "A classroom with maps, globes, and historical artifacts"
    },
    bodyLab: {
      subjectName: "BodyLab",
      primaryColor: "#E91E63", // Pink
      secondaryColor: "#F06292", // Light Pink
      accentColor: "#C2185B", // Dark Pink
      loadingIcon: '💪',
      loadingMessage: 'Warming up BodyLab...',
      backgroundImage: "/images/bodylab-classroom.jpg",
      subjectColor: "#E91E63",
      overlayOpacity: 0.7,
      environmentDescription: "An active fitness space with exercise equipment"
    },
    globalGeography: {
      subjectName: "Global Geography",
      primaryColor: "#607D8B", // Grey
      secondaryColor: "#90A4AE", // Light Grey
      accentColor: "#455A64", // Dark Grey
      loadingIcon: '🌍',
      loadingMessage: 'Loading geographical data...',
      backgroundImage: "/images/geography-classroom.jpg",
      subjectColor: "#607D8B",
      overlayOpacity: 0.7,
      environmentDescription: "A classroom with world maps and geographical displays"
    },
    lifeEssentials: {
      subjectName: "Life Essentials",
      primaryColor: "#795548", // Brown
      secondaryColor: "#A1887F", // Light Brown
      accentColor: "#5D4037", // Dark Brown
      loadingIcon: '🛠️',
      loadingMessage: 'Loading Life Essentials...',
      backgroundImage: "/images/life-essentials-classroom.jpg",
      subjectColor: "#795548",
      overlayOpacity: 0.7,
      environmentDescription: "A practical learning space with life skills materials"
    },
    worldHistoryReligions: {
      subjectName: "World History & Religions",
      primaryColor: "#FFC107", // Amber
      secondaryColor: "#FFD54F", // Light Amber
      accentColor: "#FF8F00", // Dark Amber
      loadingIcon: '📜',
      loadingMessage: 'Loading historical records...',
      backgroundImage: "/images/history-classroom.jpg",
      subjectColor: "#FFC107",
      overlayOpacity: 0.7,
      environmentDescription: "A classical classroom with historical artifacts and timelines"
    },
    mentalWellness: {
      subjectName: "Mental Wellness",
      primaryColor: "#4CAF50", // Green
      secondaryColor: "#81C784", // Light Green
      accentColor: "#388E3C", // Dark Green
      loadingIcon: '🧘',
      loadingMessage: 'Loading Mental Wellness...',
      backgroundImage: "/images/wellness-classroom.jpg",
      subjectColor: "#4CAF50",
      overlayOpacity: 0.7,
      environmentDescription: "A peaceful mindfulness and wellness space"
    },
    default: {
      subjectName: "Learning",
      primaryColor: "#673AB7", // Deep Purple
      secondaryColor: "#9575CD", // Light Deep Purple
      accentColor: "#512DA8", // Dark Deep Purple
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
