
import { CurriculumGame } from '../types/GameTypes';
import { staticDataService } from '@/services/staticDataService';

// Fallback data in case external data fails to load
const fallbackScienceGames: CurriculumGame[] = [
  {
    id: "science-lab-experiments",
    title: "Virtual Science Lab",
    description: "Conduct safe virtual experiments and learn about scientific methods and principles!",
    emoji: "🔬",
    subject: "Science",
    gradeLevel: [4, 5, 6],
    difficulty: "intermediate",
    interactionType: "simulation",
    timeEstimate: "30-35 min",
    skillAreas: ["scientific_method", "observation", "hypothesis_testing"],
    learningObjectives: [
      "Learn scientific method steps",
      "Practice making observations",
      "Test hypotheses safely"
    ],
    status: "beta",
    rewards: {
      coins: 300,
      badges: ["Young Scientist", "Lab Expert"]
    }
  }
];

let cachedScienceGames: CurriculumGame[] | null = null;

export const getScienceGames = async (): Promise<CurriculumGame[]> => {
  if (cachedScienceGames) {
    return cachedScienceGames;
  }

  try {
    const games = await staticDataService.loadGamesData('science');
    cachedScienceGames = games.length > 0 ? games : fallbackScienceGames;
    return cachedScienceGames;
  } catch (error) {
    console.error('Failed to load science games, using fallback:', error);
    cachedScienceGames = fallbackScienceGames;
    return cachedScienceGames;
  }
};

// Export sync version for backward compatibility
export const scienceGames: CurriculumGame[] = fallbackScienceGames;
