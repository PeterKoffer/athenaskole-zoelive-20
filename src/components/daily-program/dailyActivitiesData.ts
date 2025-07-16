
import { 
  BookOpen, 
  Calculator, 
  Microscope, 
  Music, 
  Palette, 
  Heart, 
  Brain, 
  Globe, 
  Monitor, 
  Home, 
  MapPin, 
  Clock 
} from "lucide-react";

export const dailyActivities = [
  {
    id: "mathematics",
    title: "Mathematics",
    description: "Problem-solving and logical thinking with interactive exercises",
    icon: Calculator,
    duration: "20 min",
    level: "Adaptive",
    color: "bg-gradient-to-br from-blue-600 to-purple-600",
    aiEnhanced: true,
    subject: "mathematics",
    skillArea: "general_mathematics"
  },
  {
    id: "english",
    title: "English",
    description: "Reading comprehension, vocabulary, and language skills",
    icon: BookOpen,
    duration: "25 min",
    level: "Grade-appropriate",
    color: "bg-gradient-to-br from-green-600 to-teal-600",
    aiEnhanced: true,
    subject: "english",
    skillArea: "general_english"
  },
  {
    id: "science",
    title: "Science",
    description: "Explore the wonders of the natural world through experiments",
    icon: Microscope,
    duration: "30 min",
    level: "Exploratory",
    color: "bg-gradient-to-br from-orange-600 to-red-600",
    aiEnhanced: true,
    subject: "science",
    skillArea: "general_science"
  },
  {
    id: "music",
    title: "Music",
    description: "Rhythm, melody, and musical creativity sessions",
    icon: Music,
    duration: "15 min",
    level: "Creative",
    color: "bg-gradient-to-br from-purple-600 to-pink-600",
    aiEnhanced: false,
    subject: "music",
    skillArea: "general_music"
  },
  {
    id: "creative-arts",
    title: "Creative Arts",
    description: "Express yourself through drawing, painting, and digital art",
    icon: Palette,
    duration: "20 min",
    level: "Artistic",
    color: "bg-gradient-to-br from-pink-600 to-rose-600",
    aiEnhanced: false,
    subject: "creative_arts",
    skillArea: "general_arts"
  },
  {
    id: "body-lab",
    title: "Body Lab",
    description: "Physical fitness and body awareness activities",
    icon: Heart,
    duration: "25 min",
    level: "Active",
    color: "bg-gradient-to-br from-red-600 to-orange-600",
    aiEnhanced: false,
    subject: "body_lab",
    skillArea: "physical_fitness"
  },
  {
    id: "mental-wellness",
    title: "Mental Wellness",
    description: "Mindfulness, emotional intelligence, and mental health",
    icon: Brain,
    duration: "15 min",
    level: "Reflective",
    color: "bg-gradient-to-br from-indigo-600 to-blue-600",
    aiEnhanced: false,
    subject: "mental_wellness",
    skillArea: "emotional_intelligence"
  },
  {
    id: "language-lab",
    title: "Language Lab",
    description: "Learn new languages with interactive conversations",
    icon: Globe,
    duration: "20 min",
    level: "Conversational",
    color: "bg-gradient-to-br from-cyan-600 to-blue-600",
    aiEnhanced: true,
    subject: "language_lab",
    skillArea: "foreign_languages"
  },
  {
    id: "computer-science",
    title: "Computer Science",
    description: "Programming, logic, and computational thinking",
    icon: Monitor,
    duration: "30 min",
    level: "Logical",
    color: "bg-gradient-to-br from-gray-600 to-slate-600",
    aiEnhanced: true,
    subject: "computer_science",
    skillArea: "programming"
  },
  {
    id: "life-essentials",
    title: "Life Essentials",
    description: "Practical life skills and everyday knowledge",
    icon: Home,
    duration: "20 min",
    level: "Practical",
    color: "bg-gradient-to-br from-amber-600 to-yellow-600",
    aiEnhanced: false,
    subject: "life_essentials",
    skillArea: "life_skills"
  },
  {
    id: "geography",
    title: "Geography",
    description: "Explore the world, cultures, and places around the globe",
    icon: MapPin,
    duration: "25 min",
    level: "Exploratory",
    color: "bg-gradient-to-br from-emerald-600 to-green-600",
    aiEnhanced: false,
    subject: "geography",
    skillArea: "world_studies"
  },
  {
    id: "history-religion",
    title: "History & Religion",
    description: "Understanding the past and diverse belief systems",
    icon: Clock,
    duration: "30 min",
    level: "Analytical",
    color: "bg-gradient-to-br from-stone-600 to-gray-600",
    aiEnhanced: false,
    subject: "history_religion",
    skillArea: "historical_studies"
  }
];

console.log('📚 Daily activities data loaded:', {
  count: dailyActivities.length,
  activities: dailyActivities.map(a => a.id)
});
