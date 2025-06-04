
import { BookOpen, Calculator, PenTool, Beaker, Music } from "lucide-react";

export const dailyActivities = [
  {
    id: "english",
    title: "English Reading",
    description: "Improve your reading comprehension with AI-generated stories and questions",
    icon: BookOpen,
    duration: "20 min",
    level: "Beginner",
    color: "from-blue-500 to-purple-600",
    aiEnhanced: true,
    subject: "english",
    skillArea: "reading_comprehension"
  },
  {
    id: "mathematics", 
    title: "Mathematics",
    description: "Practice math problems tailored to your level with step-by-step guidance",
    icon: Calculator,
    duration: "25 min",
    level: "Intermediate",
    color: "from-green-500 to-blue-600",
    aiEnhanced: true,
    subject: "mathematics",
    skillArea: "arithmetic"
  },
  {
    id: "creative_writing",
    title: "Creative Writing", 
    description: "Express yourself through AI-guided storytelling and creative exercises",
    icon: PenTool,
    duration: "30 min",
    level: "Beginner",
    color: "from-pink-500 to-red-600",
    aiEnhanced: true,
    subject: "creative_writing",
    skillArea: "storytelling"
  },
  {
    id: "music",
    title: "Music Discovery",
    description: "Explore rhythm, melody, and musical theory with interactive AI lessons",
    icon: Music,
    duration: "25 min",
    level: "Beginner",
    color: "from-orange-500 to-yellow-600",
    aiEnhanced: true,
    subject: "music",
    skillArea: "music_theory"
  },
  {
    id: "science",
    title: "Science Discovery",
    description: "Explore the wonders of science with interactive AI-powered lessons", 
    icon: Beaker,
    duration: "25 min",
    level: "Intermediate",
    color: "from-purple-500 to-indigo-600",
    aiEnhanced: true,
    subject: "science",
    skillArea: "general_science"
  }
];
