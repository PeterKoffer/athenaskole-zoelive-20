
import { CurriculumGame } from '../types/GameTypes';
import { staticDataService } from '@/services/staticDataService';

// Fallback data in case external data fails to load
const fallbackComputerScienceGames: CurriculumGame[] = [
  {
    id: "coding-robot-challenge",
    title: "Robot Programming Challenge",
    description: "Program your robot companion to navigate mazes and solve puzzles using basic coding concepts!",
    emoji: "🤖",
    subject: "Computer Science",
    gradeLevel: [3, 4, 5, 6],
    difficulty: "intermediate",
    interactionType: "drag-drop",
    timeEstimate: "25-30 min",
    skillAreas: ["basic_programming", "logical_thinking", "sequencing"],
    learningObjectives: [
      "Understand programming sequences",
      "Practice logical problem solving",
      "Learn basic coding concepts"
    ],
    status: "available",
    rewards: {
      coins: 250,
      badges: ["Code Master", "Robot Engineer"]
    }
  }
];

let cachedComputerScienceGames: CurriculumGame[] | null = null;

export const getComputerScienceGames = async (): Promise<CurriculumGame[]> => {
  if (cachedComputerScienceGames) {
    return cachedComputerScienceGames;
  }

  try {
    const games = await staticDataService.loadGamesData('computerscience');
    cachedComputerScienceGames = games.length > 0 ? games : fallbackComputerScienceGames;
    return cachedComputerScienceGames;
  } catch (error) {
    console.error('Failed to load computer science games, using fallback:', error);
    cachedComputerScienceGames = fallbackComputerScienceGames;
    return cachedComputerScienceGames;
  }
};

// Export sync version for backward compatibility
export const computerScienceGames: CurriculumGame[] = fallbackComputerScienceGames;
