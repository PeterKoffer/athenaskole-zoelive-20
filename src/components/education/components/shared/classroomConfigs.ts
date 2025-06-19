export interface ClassroomConfig {
  subjectName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  loadingIcon?: string;
  loadingMessage?: string;
}

export const getClassroomConfig = (subject: string): ClassroomConfig => {
  const configs: Record<string, ClassroomConfig> = {
    mathematics: {
      subjectName: "Mathematics",
      primaryColor: "#4CAF50", // Green
      secondaryColor: "#81C784", // Light Green
      accentColor: "#388E3C", // Dark Green
    },
    languageArts: {
      subjectName: "Language Arts",
      primaryColor: "#FF9800", // Orange
      secondaryColor: "#FFB74D", // Light Orange
      accentColor: "#F57C00", // Dark Orange
    },
    science: {
      subjectName: "Science",
      primaryColor: "#2196F3", // Blue
      secondaryColor: "#64B5F6", // Light Blue
      accentColor: "#1976D2", // Dark Blue
    },
    socialStudies: {
      subjectName: "Social Studies",
      primaryColor: "#9C27B0", // Purple
      secondaryColor: "#BA68C8", // Light Purple
      accentColor: "#7B1FA2", // Dark Purple
    },
    bodyLab: {
      subjectName: "BodyLab",
      primaryColor: "#E91E63", // Pink
      secondaryColor: "#F06292", // Light Pink
      accentColor: "#C2185B", // Dark Pink
      loadingIcon: '💪',
      loadingMessage: 'Warming up BodyLab...',
    },
    globalGeography: {
      subjectName: "Global Geography",
      primaryColor: "#607D8B", // Grey
      secondaryColor: "#90A4AE", // Light Grey
      accentColor: "#455A64", // Dark Grey
      loadingIcon: '🌍',
      loadingMessage: 'Loading geographical data...',
    },
    lifeEssentials: {
      subjectName: "Life Essentials",
      primaryColor: "#795548", // Brown
      secondaryColor: "#A1887F", // Light Brown
      accentColor: "#5D4037", // Dark Brown
      loadingIcon: '🛠️',
      loadingMessage: 'Loading Life Essentials...',
    },
    worldHistoryReligions: {
      subjectName: "World History & Religions",
      primaryColor: "#FFC107", // Amber
      secondaryColor: "#FFD54F", // Light Amber
      accentColor: "#FF8F00", // Dark Amber
      loadingIcon: '📜',
      loadingMessage: 'Loading historical records...',
    },
    default: {
      subjectName: "Learning",
      primaryColor: "#673AB7", // Deep Purple
      secondaryColor: "#9575CD", // Light Deep Purple
      accentColor: "#512DA8", // Dark Deep Purple
      loadingIcon: '📚',
      loadingMessage: 'Loading...',
    }
  };

  return configs[subject] || configs.default;
};
