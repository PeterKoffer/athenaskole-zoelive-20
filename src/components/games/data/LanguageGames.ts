
import { CurriculumGame } from '../types/GameTypes';
import { staticDataService } from '@/services/staticDataService';

// Fallback data in case external data fails to load
const fallbackLanguageGames: CurriculumGame[] = [
  {
    id: "spanish-fiesta",
    title: "Spanish Fiesta",
    description: "Learn Spanish vocabulary and basic conversation through cultural celebrations!",
    emoji: "🎉",
    subject: "Spanish",
    gradeLevel: [4, 5, 6, 7, 8, 9],
    difficulty: "beginner",
    interactionType: "multiple-choice",
    timeEstimate: "25-30 min",
    skillAreas: ["spanish_vocabulary", "basic_conversation", "culture", "pronunciation"],
    learningObjectives: [
      "Learn basic Spanish vocabulary",
      "Practice pronunciation",
      "Understand Hispanic culture"
    ],
    status: "available",
    rewards: {
      coins: 240,
      badges: ["Spanish Speaker", "Culture Explorer"]
    }
  }
];

let cachedLanguageGames: CurriculumGame[] | null = null;

export const getLanguageGames = async (): Promise<CurriculumGame[]> => {
  if (cachedLanguageGames) {
    return cachedLanguageGames;
  }

  try {
    const games = await staticDataService.loadGamesData('language');
    cachedLanguageGames = games.length > 0 ? games : fallbackLanguageGames;
    return cachedLanguageGames;
  } catch (error) {
    console.error('Failed to load language games, using fallback:', error);
    cachedLanguageGames = fallbackLanguageGames;
    return cachedLanguageGames;
  }
};

// Export sync version for backward compatibility
export const languageGames: CurriculumGame[] = fallbackLanguageGames;
