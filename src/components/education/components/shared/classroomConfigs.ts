
import { ClassroomConfig } from './ClassroomEnvironment';

export const getClassroomConfig = (subject: string): ClassroomConfig => {
  const configs: Record<string, ClassroomConfig> = {
    mathematics: {
      subjectName: "Mathematics",
      primaryColor: "hsl(280, 100%, 70%)",
      secondaryColor: "hsl(200, 100%, 70%)",
      accentColor: "hsl(50, 100%, 60%)",
      loadingIcon: "🧮",
      loadingMessage: "Preparing your Mathematics classroom...",
      backgroundImage: "https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      subjectColor: "purple",
      overlayOpacity: 0.7,
      environmentDescription: "A modern mathematics classroom with mathematical formulas and geometric patterns on the walls, designed to inspire mathematical thinking and problem-solving."
    },
    science: {
      subjectName: "Science", 
      primaryColor: "hsl(120, 100%, 50%)",
      secondaryColor: "hsl(200, 100%, 60%)",
      accentColor: "hsl(30, 100%, 60%)",
      loadingIcon: "🔬",
      loadingMessage: "Setting up your Science laboratory...",
      backgroundImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      subjectColor: "green",
      overlayOpacity: 0.6,
      environmentDescription: "A well-equipped science laboratory with modern equipment and periodic table displays, fostering scientific discovery and experimentation."
    },
    english: {
      subjectName: "English",
      primaryColor: "hsl(0, 100%, 70%)",
      secondaryColor: "hsl(220, 100%, 70%)",
      accentColor: "hsl(300, 100%, 60%)",
      loadingIcon: "📚",
      loadingMessage: "Opening your English library...",
      backgroundImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      subjectColor: "red",
      overlayOpacity: 0.65,
      environmentDescription: "A cozy library setting with books and literature displays, creating an atmosphere perfect for reading, writing, and language learning."
    },
    history: {
      subjectName: "History",
      primaryColor: "hsl(30, 100%, 60%)",
      secondaryColor: "hsl(200, 80%, 60%)",
      accentColor: "hsl(350, 100%, 70%)",
      loadingIcon: "🏛️",
      loadingMessage: "Traveling through history...",
      backgroundImage: "https://images.unsplash.com/photo-1461360228754-6e81c478b882?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
      subjectColor: "orange",
      overlayOpacity: 0.6,
      environmentDescription: "A classical setting with historical artifacts and timeline displays, immersing students in the rich tapestry of human history."
    }
  };

  return configs[subject.toLowerCase()] || configs.mathematics;
};
