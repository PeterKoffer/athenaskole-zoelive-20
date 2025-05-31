
import { BookOpen, Calculator, Globe, Palette } from "lucide-react";

export const dailyActivities = [{
  id: "matematik",
  title: "Mathematics",
  description: "Work with fractions and geometry",
  icon: <Calculator className="w-6 h-6" />,
  duration: "30 min",
  level: "Foundation",
  color: "from-blue-400 to-blue-600"
}, {
  id: "dansk",
  title: "English",
  description: "Read stories and practice spelling",
  icon: <BookOpen className="w-6 h-6" />,
  duration: "25 min",
  level: "Foundation",
  color: "from-green-400 to-green-600"
}, {
  id: "engelsk",
  title: "Foreign Language",
  description: "Learn new words and pronunciation",
  icon: <Globe className="w-6 h-6" />,
  duration: "20 min",
  level: "Foundation",
  color: "from-purple-400 to-purple-600"
}, {
  id: "kreativ",
  title: "Creative Time",
  description: "Draw and write stories",
  icon: <Palette className="w-6 h-6" />,
  duration: "15 min",
  level: "Foundation",
  color: "from-pink-400 to-pink-600"
}];
