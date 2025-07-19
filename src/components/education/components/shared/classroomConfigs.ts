
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
      backgroundImage: "/lovable-uploads/8e1166ab-d511-401c-9a58-99afe4508cfd.png", // Warm classroom with math formulas
      subjectColor: "purple",
      overlayOpacity: 0.7,
      environmentDescription: "A warm, inviting classroom with mathematical formulas and decorative elements, creating an atmosphere perfect for mathematical learning and discovery."
    },
    science: {
      subjectName: "Science", 
      primaryColor: "hsl(120, 100%, 50%)",
      secondaryColor: "hsl(200, 100%, 60%)",
      accentColor: "hsl(30, 100%, 60%)",
      loadingIcon: "🔬",
      loadingMessage: "Setting up your Science laboratory...",
      backgroundImage: "/lovable-uploads/52c7ffb7-b9b6-4277-a8ee-0407204a2e80.png", // Science classroom with lab equipment
      subjectColor: "green",
      overlayOpacity: 0.6,
      environmentDescription: "A modern science classroom with laboratory equipment and scientific displays, fostering curiosity and hands-on scientific exploration."
    },
    english: {
      subjectName: "English",
      primaryColor: "hsl(0, 100%, 70%)",
      secondaryColor: "hsl(220, 100%, 70%)",
      accentColor: "hsl(300, 100%, 60%)",
      loadingIcon: "📚",
      loadingMessage: "Opening your English library...",
      backgroundImage: "/lovable-uploads/6f4382dd-5d2e-4b03-be43-1d1b2bfe4355.png", // Traditional classroom with historical maps
      subjectColor: "red",
      overlayOpacity: 0.65,
      environmentDescription: "A traditional classroom setting with rich wooden furnishings and educational materials, perfect for literature study and language learning."
    },
    history: {
      subjectName: "History",
      primaryColor: "hsl(30, 100%, 60%)",
      secondaryColor: "hsl(200, 80%, 60%)",
      accentColor: "hsl(350, 100%, 70%)",
      loadingIcon: "🏛️",
      loadingMessage: "Traveling through history...",
      backgroundImage: "/lovable-uploads/53e02987-6fd2-4421-913f-50192f47250c.png", // History classroom with "The Coolest History" board
      subjectColor: "orange",
      overlayOpacity: 0.6,
      environmentDescription: "A cozy history classroom filled with books, historical artifacts, and educational displays that bring the past to life."
    },
    geography: {
      subjectName: "Geography",
      primaryColor: "hsl(120, 60%, 50%)",
      secondaryColor: "hsl(200, 80%, 60%)",
      accentColor: "hsl(60, 100%, 70%)",
      loadingIcon: "🌍",
      loadingMessage: "Exploring the world...",
      backgroundImage: "/lovable-uploads/5c04279f-4c4d-4606-9e37-a22a2a28169e.png", // Geography classroom with world map
      subjectColor: "green",
      overlayOpacity: 0.6,
      environmentDescription: "A geography classroom with world maps, globes, and geographical displays that inspire exploration and understanding of our world."
    },
    music: {
      subjectName: "Music",
      primaryColor: "hsl(270, 70%, 60%)",
      secondaryColor: "hsl(320, 80%, 60%)",
      accentColor: "hsl(45, 100%, 70%)",
      loadingIcon: "🎵",
      loadingMessage: "Tuning up your music room...",
      backgroundImage: "/lovable-uploads/1cada751-77be-46e9-80d6-e7534f8a588a.png", // Music classroom with instruments
      subjectColor: "purple",
      overlayOpacity: 0.6,
      environmentDescription: "A vibrant music classroom filled with various instruments and musical notation, creating an atmosphere of creativity and musical expression."
    },
    creative_arts: {
      subjectName: "Creative Arts",
      primaryColor: "hsl(340, 80%, 60%)",
      secondaryColor: "hsl(200, 70%, 60%)",
      accentColor: "hsl(50, 100%, 70%)",
      loadingIcon: "🎨",
      loadingMessage: "Setting up your art studio...",
      backgroundImage: "/lovable-uploads/e112f29e-ee22-464b-b154-947b58b505bd.png", // Art studio with easels and supplies
      subjectColor: "pink",
      overlayOpacity: 0.5,
      environmentDescription: "A bright art studio with easels, paints, and creative supplies, encouraging artistic expression and creative exploration."
    },
    computer_science: {
      subjectName: "Computer Science",
      primaryColor: "hsl(200, 90%, 60%)",
      secondaryColor: "hsl(280, 70%, 60%)",
      accentColor: "hsl(120, 80%, 70%)",
      loadingIcon: "💻",
      loadingMessage: "Booting up your computer lab...",
      backgroundImage: "/lovable-uploads/f51cb844-3dab-4e4c-83dd-ad65d46667ea.png", // Computer science classroom
      subjectColor: "blue",
      overlayOpacity: 0.7,
      environmentDescription: "A modern computer science classroom with technology and coding concepts, fostering digital literacy and computational thinking."
    },
    body_lab: {
      subjectName: "Body Lab",
      primaryColor: "hsl(120, 70%, 50%)",
      secondaryColor: "hsl(200, 80%, 60%)",
      accentColor: "hsl(30, 100%, 70%)",
      loadingIcon: "💪",
      loadingMessage: "Preparing your fitness lab...",
      backgroundImage: "/lovable-uploads/1bfa5669-ac1d-4bbf-9ad0-80578f845f46.png", // Gym/fitness classroom
      subjectColor: "green",
      overlayOpacity: 0.5,
      environmentDescription: "A well-equipped fitness classroom with exercise equipment and health education materials, promoting physical wellness and healthy living."
    },
    language_lab: {
      subjectName: "Language Lab",
      primaryColor: "hsl(240, 70%, 60%)",
      secondaryColor: "hsl(300, 60%, 60%)",
      accentColor: "hsl(60, 100%, 70%)",
      loadingIcon: "🗣️",
      loadingMessage: "Preparing your language lab...",
      backgroundImage: "/lovable-uploads/69bc4948-8053-46e5-ac74-cd7aef8f751d.png", // Modern language classroom
      subjectColor: "blue",
      overlayOpacity: 0.6,
      environmentDescription: "A modern language learning classroom with interactive displays and comfortable seating, perfect for multilingual communication and cultural exchange."
    }
  };

  return configs[subject.toLowerCase().replace('-', '_')] || configs.mathematics;
};
