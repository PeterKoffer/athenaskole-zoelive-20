
import { Calculator, BookOpen, Globe, Palette } from "lucide-react";

export const dailyActivities = [{
  id: "matematik",
  title: "Mathematics",
  description: "AI-tilpasset matematik med brøker og geometri",
  icon: Calculator,
  duration: "30 min",
  level: "Foundation",
  color: "from-blue-400 to-blue-600",
  aiEnhanced: true
}, {
  id: "dansk", 
  title: "English",
  description: "AI-drevet læsning og stavning",
  icon: BookOpen,
  duration: "25 min",
  level: "Foundation", 
  color: "from-green-400 to-green-600",
  aiEnhanced: true
}, {
  id: "engelsk",
  title: "Foreign Language", 
  description: "Lær nye ord med AI-assistance",
  icon: Globe,
  duration: "20 min",
  level: "Foundation",
  color: "from-purple-400 to-purple-600",
  aiEnhanced: false
}, {
  id: "kreativ",
  title: "Creative Time",
  description: "Tegn og skriv historier",
  icon: Palette, 
  duration: "15 min",
  level: "Foundation",
  color: "from-pink-400 to-pink-600",
  aiEnhanced: false
}];
