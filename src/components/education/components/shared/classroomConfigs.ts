
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
      backgroundImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1600&h=900&fit=crop",
      subjectColor: "#4CAF50",
      overlayOpacity: 0.7,
      environmentDescription: "A bright mathematics classroom with equations and geometric shapes"
    },
    languageArts: {
      subjectName: "Language Arts",
      primaryColor: "#FF9800",
      secondaryColor: "#FFB74D",
      accentColor: "#F57C00",
      backgroundImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1600&h=900&fit=crop",
      subjectColor: "#FF9800",
      overlayOpacity: 0.7,
      environmentDescription: "A cozy library setting with books and writing materials"
    },
    english: {
      subjectName: "English",
      primaryColor: "#FF9800",
      secondaryColor: "#FFB74D",
      accentColor: "#F57C00",
      backgroundImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1600&h=900&fit=crop",
      subjectColor: "#FF9800",
      overlayOpacity: 0.7,
      environmentDescription: "A cozy library setting with books and writing materials"
    },
    science: {
      subjectName: "Science",
      primaryColor: "#2196F3",
      secondaryColor: "#64B5F6",
      accentColor: "#1976D2",
      backgroundImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600&h=900&fit=crop",
      subjectColor: "#2196F3",
      overlayOpacity: 0.7,
      environmentDescription: "A modern laboratory with scientific equipment and experiments"
    },
    computer_science: {
      subjectName: "Computer Science",
      primaryColor: "#9C27B0",
      secondaryColor: "#BA68C8",
      accentColor: "#7B1FA2",
      backgroundImage: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=1600&h=900&fit=crop",
      subjectColor: "#9C27B0",
      overlayOpacity: 0.7,
      environmentDescription: "A modern tech lab with computers and coding displays"
    },
    music: {
      subjectName: "Music",
      primaryColor: "#E91E63",
      secondaryColor: "#F06292",
      accentColor: "#C2185B",
      backgroundImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1600&h=900&fit=crop",
      subjectColor: "#E91E63",
      overlayOpacity: 0.7,
      environmentDescription: "A vibrant music room with instruments and musical notes"
    },
    creative_arts: {
      subjectName: "Creative Arts",
      primaryColor: "#FF5722",
      secondaryColor: "#FF8A65",
      accentColor: "#D84315",
      backgroundImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&h=900&fit=crop",
      subjectColor: "#FF5722",
      overlayOpacity: 0.7,
      environmentDescription: "A colorful art studio with paints, brushes, and creative works"
    },
    default: {
      subjectName: "Learning",
      primaryColor: "#607D8B",
      secondaryColor: "#90A4AE",
      accentColor: "#455A64",
      backgroundImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600&h=900&fit=crop",
      subjectColor: "#607D8B",
      overlayOpacity: 0.7,
      environmentDescription: "A modern learning environment with educational tools"
    }
  };

  return configs[subject] || configs.default;
};
