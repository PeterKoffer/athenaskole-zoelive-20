
import { CurriculumGame } from '../types/GameTypes';
import { staticDataService } from '@/services/staticDataService';

// Fallback data in case external data fails to load
const fallbackMathematicsGames: CurriculumGame[] = [
  {
    id: "math-addition-castle",
    title: "Addition Castle Quest",
    description: "Help the brave knight solve addition problems to unlock castle doors and rescue the princess!",
    emoji: "🏰",
    subject: "Mathematics",
    gradeLevel: [1, 2, 3],
    difficulty: "beginner",
    interactionType: "click-sequence",
    timeEstimate: "15-20 min",
    skillAreas: ["basic_addition", "number_recognition", "problem_solving"],
    learningObjectives: [
      "Master single-digit addition",
      "Understand number relationships",
      "Apply addition in story contexts"
    ],
    status: "available",
    rewards: {
      coins: 150,
      badges: ["Math Explorer", "Castle Defender"]
    }
  }
];

let cachedMathematicsGames: CurriculumGame[] | null = null;

export const getMathematicsGames = async (): Promise<CurriculumGame[]> => {
  if (cachedMathematicsGames) {
    return cachedMathematicsGames;
  }

  try {
    const games = await staticDataService.loadGamesData('mathematics');
    cachedMathematicsGames = games.length > 0 ? games : fallbackMathematicsGames;
    return cachedMathematicsGames;
  } catch (error) {
    console.error('Failed to load mathematics games, using fallback:', error);
    cachedMathematicsGames = fallbackMathematicsGames;
    return cachedMathematicsGames;
  }
};

// Export sync version for backward compatibility
export const mathematicsGames: CurriculumGame[] = fallbackMathematicsGames;
