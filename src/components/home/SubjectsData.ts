
export interface Subject {
  title: string;
  description: string;
  keyAreas: string[];
  path: string;
  gradient: string;
  icon: string;
}

export const subjects: Subject[] = [
  {
    title: "Mathematics",
    description: "Master advanced mathematical concepts through AI-powered personalized learning paths with real-world problem solving.",
    keyAreas: ["Algebra", "Geometry", "Statistics"],
    path: "/learn/mathematics",
    gradient: "bg-gradient-to-br from-orange-400 to-red-500",
    icon: "🧮"
  },
  {
    title: "English Language Arts",
    description: "Develop exceptional reading, writing, and communication skills through immersive storytelling and creative expression.",
    keyAreas: ["Creative Writing", "Literature", "Grammar"],
    path: "/learn/english",
    gradient: "bg-gradient-to-br from-blue-400 to-indigo-500",
    icon: "📖"
  },
  {
    title: "Science & Technology",
    description: "Explore the wonders of science through virtual experiments, simulations, and hands-on discovery learning.",
    keyAreas: ["Physics", "Chemistry", "Biology"],
    path: "/learn/science",
    gradient: "bg-gradient-to-br from-green-400 to-emerald-500",
    icon: "🧪"
  },
  {
    title: "Computer Science",
    description: "Learn programming, AI, and computational thinking through gamified coding challenges and real projects.",
    keyAreas: ["Programming", "Algorithms", "AI/ML"],
    path: "/learn/computer-science",
    gradient: "bg-gradient-to-br from-yellow-400 to-orange-500",
    icon: "⚡"
  },
  {
    title: "Creative Arts",
    description: "Express your creativity through digital art, music composition, and multimedia storytelling projects.",
    keyAreas: ["Digital Art", "Music Theory", "Design"],
    path: "/learn/creative-arts",
    gradient: "bg-gradient-to-br from-pink-400 to-purple-500",
    icon: "🎭"
  },
  {
    title: "Music Discovery",
    description: "Explore rhythm, melody, and composition through interactive music theory and digital instrument mastery.",
    keyAreas: ["Music Theory", "Composition", "Performance"],
    path: "/learn/music",
    gradient: "bg-gradient-to-br from-purple-400 to-violet-500",
    icon: "🎼"
  },
  {
    title: "Mental Wellness",
    description: "Learn about understanding your feelings, developing healthy coping strategies, and supporting others. Nurture your mind for a balanced life.",
    keyAreas: ["Understanding Emotions", "Stress Management", "Mindfulness Practices", "Building Resilience", "Healthy Relationships"],
    path: "/learn/mental-wellness",
    gradient: "bg-gradient-to-br from-green-400 to-teal-500",
    icon: "🧘"
  },
  {
    title: "Language Lab",
    description: "Embark on a journey to learn new languages! Interactive lessons, vocabulary building, and grammar practice for languages around the world.",
    keyAreas: ["Vocabulary Practice", "Grammar Drills", "Pronunciation Basics", "Cultural Insights"],
    path: "/learn/language-lab",
    gradient: "bg-gradient-to-br from-blue-400 to-cyan-500",
    icon: "🗺️"
  },
  {
    title: "History & Religion",
    description: "Uncover the past to understand the present. This class takes you on a journey through world history, exploring pivotal events, influential figures, and the rise and fall of civilizations. We'll also delve into the rich tapestry of global religions, examining their origins, core beliefs, cultural impacts, and role in shaping societies across time.",
    keyAreas: ["Ancient Civilizations", "Major Empires", "World Wars", "Religious Studies", "Cultural Heritage"],
    path: "/learn/world-history-religions",
    gradient: "bg-gradient-to-br from-orange-400 to-red-500",
    icon: "🏺"
  },
  {
    title: "Global Geography",
    description: "Embark on an exploration of our planet. Global Geography goes beyond maps, teaching you about Earth's diverse landscapes, climates, and natural resources. Discover how human societies interact with their environment, the dynamics of population, urbanization, and the fascinating interplay between physical features and cultural development.",
    keyAreas: ["Physical Landscapes", "Climate Systems", "Human-Environment Interaction", "Population Dynamics", "Urban Studies"],
    path: "/learn/global-geography",
    gradient: "bg-gradient-to-br from-cyan-400 to-blue-500",
    icon: "🌏"
  },
  {
    title: "BodyLab",
    description: "Ignite your potential and energize your life! BodyLab is your interactive guide to healthy and active living. Through engaging lessons, we'll explore the benefits of nutrition, physical fitness, and mental well-being. Get ready for activities and insights that will inspire you to make informed choices for a vibrant, balanced life.",
    keyAreas: ["Nutrition Science", "Fitness Principles", "Mental Wellness", "Holistic Health", "Active Lifestyles"],
    path: "/learn/body-lab",
    gradient: "bg-gradient-to-br from-red-400 to-pink-500",
    icon: "🏃"
  },
  {
    title: "Life Essentials",
    description: "Prepare for your future with confidence. Life Essentials: Navigating Adulthood is your comprehensive guide to the practical realities of independent living. This class covers vital topics such as personal finance (budgeting, banking, investments, loans), managing a household, understanding taxes and insurance, making informed decisions about mortgages and cars, and navigating the world of work and careers. Gain the knowledge and foresight you need to plan ahead and thrive.",
    keyAreas: ["Personal Finance", "Household Management", "Career Development", "Civic Responsibilities", "Future Planning"],
    path: "/learn/life-essentials",
    gradient: "bg-gradient-to-br from-purple-400 to-pink-500",
    icon: "🎯"
  }
];
