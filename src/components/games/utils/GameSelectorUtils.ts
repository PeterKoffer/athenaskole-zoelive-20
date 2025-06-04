
export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "beginner": return "bg-green-900 text-green-400 border-green-400";
    case "intermediate": return "bg-yellow-900 text-yellow-400 border-yellow-400";
    case "advanced": return "bg-red-900 text-red-400 border-red-400";
    default: return "bg-gray-900 text-gray-400 border-gray-400";
  }
};

export const getSubjectColor = (subject: string) => {
  const colors: Record<string, string> = {
    "Mathematics": "bg-blue-900 text-blue-400 border-blue-400",
    "English": "bg-red-900 text-red-400 border-red-400",
    "Computer Science": "bg-purple-900 text-purple-400 border-purple-400",
    "History": "bg-orange-900 text-orange-400 border-orange-400",
    "Science": "bg-green-900 text-green-400 border-green-400",
    "Music": "bg-pink-900 text-pink-400 border-pink-400"
  };
  return colors[subject] || "bg-gray-900 text-gray-400 border-gray-400";
};
