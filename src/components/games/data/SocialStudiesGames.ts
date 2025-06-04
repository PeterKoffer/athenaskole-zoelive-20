
import { CurriculumGame } from '../types/GameTypes';

export const socialStudiesGames: CurriculumGame[] = [
  {
    id: "history-time-travel",
    title: "Time Travel Chronicles",
    description: "Travel through different historical periods and learn about important events and figures!",
    emoji: "⏰",
    subject: "History",
    gradeLevel: [5, 6, 7, 8],
    difficulty: "intermediate",
    interactionType: "multiple-choice",
    timeEstimate: "25-30 min",
    skillAreas: ["historical_knowledge", "chronological_thinking", "cause_and_effect"],
    learningObjectives: [
      "Understand historical chronology",
      "Learn about key historical figures",
      "Analyze cause and effect relationships"
    ],
    status: "available",
    rewards: {
      coins: 275,
      badges: ["Time Traveler", "History Scholar"]
    }
  },
  {
    id: "american-revolution-simulator",
    title: "American Revolution Simulator",
    description: "Experience key events of the American Revolution and understand the path to independence!",
    emoji: "🇺🇸",
    subject: "History",
    gradeLevel: [5, 6, 7, 8],
    difficulty: "intermediate",
    interactionType: "strategy",
    timeEstimate: "35-40 min",
    skillAreas: ["american_history", "revolution", "colonial_america", "independence"],
    learningObjectives: [
      "Understand causes of revolution",
      "Learn key historical figures",
      "Analyze historical consequences"
    ],
    status: "available",
    rewards: {
      coins: 310,
      badges: ["History Scholar", "Patriot"]
    }
  },
  {
    id: "world-geography-quest",
    title: "World Geography Quest",
    description: "Travel the globe and learn about countries, capitals, and geographic features!",
    emoji: "🌍",
    subject: "Geography",
    gradeLevel: [3, 4, 5, 6, 7],
    difficulty: "intermediate",
    interactionType: "multiple-choice",
    timeEstimate: "25-30 min",
    skillAreas: ["geography", "countries", "capitals", "continents", "landmarks"],
    learningObjectives: [
      "Identify world countries",
      "Locate major geographic features",
      "Understand cultural diversity"
    ],
    status: "available",
    rewards: {
      coins: 230,
      badges: ["Geography Expert", "World Explorer"]
    }
  },
  {
    id: "economics-marketplace",
    title: "Economics Marketplace",
    description: "Learn supply and demand, budgeting, and economic principles through market simulations!",
    emoji: "💰",
    subject: "Social Studies",
    gradeLevel: [8, 9, 10, 11, 12],
    difficulty: "intermediate",
    interactionType: "strategy",
    timeEstimate: "35-40 min",
    skillAreas: ["economics", "supply_demand", "budgeting", "market_economy"],
    learningObjectives: [
      "Understand supply and demand",
      "Learn budgeting skills",
      "Analyze market trends"
    ],
    status: "available",
    rewards: {
      coins: 340,
      badges: ["Economics Expert", "Market Master"]
    }
  }
];
