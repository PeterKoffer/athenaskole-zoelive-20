
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
      backgroundImage: "/lovable-uploads/4cc17a8b-1d30-4146-993f-7b97b7e6be5b.png", // Mathematics classroom
      subjectColor: "#4CAF50",
      overlayOpacity: 0.7,
      environmentDescription: "A modern mathematics classroom with interactive whiteboard and mathematical tools"
    },
    languageArts: {
      subjectName: "Language Arts",
      primaryColor: "#FF9800",
      secondaryColor: "#FFB74D",
      accentColor: "#F57C00",
      backgroundImage: "/lovable-uploads/c4321823-91d4-4b19-8f72-b00613b2603a.png", // English/Language Arts classroom
      subjectColor: "#FF9800",
      overlayOpacity: 0.7,
      environmentDescription: "A warm English classroom with books and educational materials"
    },
    english: {
      subjectName: "English",
      primaryColor: "#FF9800",
      secondaryColor: "#FFB74D",
      accentColor: "#F57C00",
      backgroundImage: "/lovable-uploads/c4321823-91d4-4b19-8f72-b00613b2603a.png", // English classroom
      subjectColor: "#FF9800",
      overlayOpacity: 0.7,
      environmentDescription: "A warm English classroom with books and educational materials"
    },
    science: {
      subjectName: "Science",
      primaryColor: "#2196F3",
      secondaryColor: "#64B5F6",
      accentColor: "#1976D2",
      backgroundImage: "/lovable-uploads/4f04a56b-d49f-4093-b974-e56c182dbefd.png", // Science laboratory
      subjectColor: "#2196F3",
      overlayOpacity: 0.7,
      environmentDescription: "A modern science laboratory with equipment and experimental setups"
    },
    computer_science: {
      subjectName: "Computer Science",
      primaryColor: "#9C27B0",
      secondaryColor: "#BA68C8",
      accentColor: "#7B1FA2",
      backgroundImage: "/lovable-uploads/6cd62bdc-48a0-49e9-bcd0-aba0c756a278.png", // Computer lab
      subjectColor: "#9C27B0",
      overlayOpacity: 0.7,
      environmentDescription: "A modern tech classroom with computers and digital learning tools"
    },
    'computer-science': {
      subjectName: "Computer Science",
      primaryColor: "#9C27B0",
      secondaryColor: "#BA68C8",
      accentColor: "#7B1FA2",
      backgroundImage: "/lovable-uploads/6cd62bdc-48a0-49e9-bcd0-aba0c756a278.png", // Computer lab
      subjectColor: "#9C27B0",
      overlayOpacity: 0.7,
      environmentDescription: "A modern tech classroom with computers and digital learning tools"
    },
    music: {
      subjectName: "Music",
      primaryColor: "#E91E63",
      secondaryColor: "#F06292",
      accentColor: "#C2185B",
      backgroundImage: "/lovable-uploads/94aa529a-ae27-4300-b5f0-f414268f6785.png", // Music classroom
      subjectColor: "#E91E63",
      overlayOpacity: 0.7,
      environmentDescription: "A vibrant music classroom with instruments and musical notation"
    },
    creative_arts: {
      subjectName: "Creative Arts",
      primaryColor: "#FF5722",
      secondaryColor: "#FF8A65",
      accentColor: "#D84315",
      backgroundImage: "/lovable-uploads/8c823620-22c3-424b-a10f-c9dbef745b76.png", // Art classroom
      subjectColor: "#FF5722",
      overlayOpacity: 0.7,
      environmentDescription: "A colorful art classroom with creative supplies and student artwork"
    },
    'creative-arts': {
      subjectName: "Creative Arts",
      primaryColor: "#FF5722",
      secondaryColor: "#FF8A65",
      accentColor: "#D84315",
      backgroundImage: "/lovable-uploads/8c823620-22c3-424b-a10f-c9dbef745b76.png", // Art classroom
      subjectColor: "#FF5722",
      overlayOpacity: 0.7,
      environmentDescription: "A colorful art classroom with creative supplies and student artwork"
    },
    'fine-arts': {
      subjectName: "Fine Arts",
      primaryColor: "#FF5722",
      secondaryColor: "#FF8A65",
      accentColor: "#D84315",
      backgroundImage: "/lovable-uploads/2c1a716d-f174-46e7-ba77-85b334751f7f.png", // Fine arts studio
      subjectColor: "#FF5722",
      overlayOpacity: 0.7,
      environmentDescription: "A professional art studio with easels, canvases, and artistic materials"
    },
    'world-history': {
      subjectName: "World History",
      primaryColor: "#8D6E63",
      secondaryColor: "#A1887F",
      accentColor: "#6D4C41",
      backgroundImage: "/lovable-uploads/58a2af6c-6ad5-44f3-afc2-5da54b215e02.png", // History classroom
      subjectColor: "#8D6E63",
      overlayOpacity: 0.7,
      environmentDescription: "A traditional classroom with historical maps and educational materials"
    },
    'world-history-religions': {
      subjectName: "World History & Religions",
      primaryColor: "#8D6E63",
      secondaryColor: "#A1887F",
      accentColor: "#6D4C41",
      backgroundImage: "/lovable-uploads/58a2af6c-6ad5-44f3-afc2-5da54b215e02.png", // History classroom
      subjectColor: "#8D6E63",
      overlayOpacity: 0.7,
      environmentDescription: "A traditional classroom with historical maps and educational materials"
    },
    history_religion: {
      subjectName: "History & Religion",
      primaryColor: "#8D6E63",
      secondaryColor: "#A1887F",
      accentColor: "#6D4C41",
      backgroundImage: "/lovable-uploads/58a2af6c-6ad5-44f3-afc2-5da54b215e02.png", // History classroom
      subjectColor: "#8D6E63",
      overlayOpacity: 0.7,
      environmentDescription: "A traditional classroom with historical maps and educational materials"
    },
    geography: {
      subjectName: "Geography",
      primaryColor: "#4CAF50",
      secondaryColor: "#81C784",
      accentColor: "#388E3C",
      backgroundImage: "/lovable-uploads/9f597860-f509-47db-9bea-9ba445e633ec.png", // Geography classroom
      subjectColor: "#4CAF50",
      overlayOpacity: 0.7,
      environmentDescription: "A geography classroom with world maps, globes, and geographical resources"
    },
    'global-geography': {
      subjectName: "Global Geography",
      primaryColor: "#4CAF50",
      secondaryColor: "#81C784",
      accentColor: "#388E3C",
      backgroundImage: "/lovable-uploads/9f597860-f509-47db-9bea-9ba445e633ec.png", // Geography classroom
      subjectColor: "#4CAF50",
      overlayOpacity: 0.7,
      environmentDescription: "A geography classroom with world maps, globes, and geographical resources"
    },
    'life-essentials': {
      subjectName: "Life Essentials",
      primaryColor: "#607D8B",
      secondaryColor: "#90A4AE",
      accentColor: "#455A64",
      backgroundImage: "/lovable-uploads/9a45857a-4de9-4a4f-a5a4-24150e41914a.png", // Life skills classroom
      subjectColor: "#607D8B",
      overlayOpacity: 0.7,
      environmentDescription: "A clean, modern classroom focused on practical life skills education"
    },
    life_essentials: {
      subjectName: "Life Essentials",
      primaryColor: "#607D8B",
      secondaryColor: "#90A4AE",
      accentColor: "#455A64",
      backgroundImage: "/lovable-uploads/9a45857a-4de9-4a4f-a5a4-24150e41914a.png", // Life skills classroom
      subjectColor: "#607D8B",
      overlayOpacity: 0.7,
      environmentDescription: "A clean, modern classroom focused on practical life skills education"
    },
    'mental-wellness': {
      subjectName: "Mental Wellness",
      primaryColor: "#9C27B0",
      secondaryColor: "#BA68C8",
      accentColor: "#7B1FA2",
      backgroundImage: "/lovable-uploads/5f9c6e95-d949-47f5-bb3a-08f0c1c84d72.png", // Wellness classroom
      subjectColor: "#9C27B0",
      overlayOpacity: 0.7,
      environmentDescription: "A calming wellness classroom designed for mindfulness and emotional learning"
    },
    mental_wellness: {
      subjectName: "Mental Wellness",
      primaryColor: "#9C27B0",
      secondaryColor: "#BA68C8",
      accentColor: "#7B1FA2",
      backgroundImage: "/lovable-uploads/5f9c6e95-d949-47f5-bb3a-08f0c1c84d72.png", // Wellness classroom
      subjectColor: "#9C27B0",
      overlayOpacity: 0.7,
      environmentDescription: "A calming wellness classroom designed for mindfulness and emotional learning"
    },
    'body-lab': {
      subjectName: "BodyLab",
      primaryColor: "#FF5722",
      secondaryColor: "#FF8A65",
      accentColor: "#D84315",
      backgroundImage: "/lovable-uploads/aa5d1c92-da37-4dc9-b296-97e3a8959445.png", // Health/fitness lab
      subjectColor: "#FF5722",
      overlayOpacity: 0.7,
      environmentDescription: "A health and wellness laboratory for learning about the human body"
    },
    body_lab: {
      subjectName: "BodyLab",
      primaryColor: "#FF5722",
      secondaryColor: "#FF8A65",
      accentColor: "#D84315",
      backgroundImage: "/lovable-uploads/aa5d1c92-da37-4dc9-b296-97e3a8959445.png", // Health/fitness lab
      subjectColor: "#FF5722",
      overlayOpacity: 0.7,
      environmentDescription: "A health and wellness laboratory for learning about the human body"
    },
    'language-lab': {
      subjectName: "Language Lab",
      primaryColor: "#FF9800",
      secondaryColor: "#FFB74D",
      accentColor: "#F57C00",
      backgroundImage: "/lovable-uploads/ab7502b0-78bd-4d20-8254-3e5a2c355bfd.png", // Language lab
      subjectColor: "#FF9800",
      overlayOpacity: 0.7,
      environmentDescription: "A modern language laboratory with audio-visual learning equipment"
    },
    language_lab: {
      subjectName: "Language Lab",
      primaryColor: "#FF9800",
      secondaryColor: "#FFB74D",
      accentColor: "#F57C00",
      backgroundImage: "/lovable-uploads/ab7502b0-78bd-4d20-8254-3e5a2c355bfd.png", // Language lab
      subjectColor: "#FF9800",
      overlayOpacity: 0.7,
      environmentDescription: "A modern language laboratory with audio-visual learning equipment"
    },
    default: {
      subjectName: "Learning",
      primaryColor: "#607D8B",
      secondaryColor: "#90A4AE",
      accentColor: "#455A64",
      backgroundImage: "/lovable-uploads/9a45857a-4de9-4a4f-a5a4-24150e41914a.png", // General classroom
      subjectColor: "#607D8B",
      overlayOpacity: 0.7,
      environmentDescription: "A modern learning environment with educational tools"
    }
  };

  return configs[subject] || configs.default;
};
