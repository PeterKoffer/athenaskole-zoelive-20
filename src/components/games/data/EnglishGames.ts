
import { CurriculumGame } from '../types/GameTypes';
import { staticDataService } from '@/services/staticDataService';

// Fallback data in case external data fails to load
const fallbackEnglishGames: CurriculumGame[] = [
  {
    id: "reading-adventure-forest",
    title: "Reading Adventure Forest",
    description: "Journey through an enchanted forest by reading comprehension passages and solving word puzzles!",
    emoji: "📚",
    subject: "English",
    gradeLevel: [2, 3, 4],
    difficulty: "beginner",
    interactionType: "multiple-choice",
    timeEstimate: "~25 min",
    skillAreas: ["reading_comprehension", "vocabulary", "inference"],
    learningObjectives: [
      "Improve reading fluency",
      "Build vocabulary knowledge", 
      "Practice comprehension strategies"
    ],
    status: "available",
    rewards: {
      coins: 200,
      badges: ["Book Worm", "Forest Explorer"]
    }
  }
];

let cachedEnglishGames: CurriculumGame[] | null = null;

export const getEnglishGames = async (): Promise<CurriculumGame[]> => {
  if (cachedEnglishGames) {
    return cachedEnglishGames;
  }

  try {
    const games = await staticDataService.loadGamesData('english');
    cachedEnglishGames = games.length > 0 ? games : fallbackEnglishGames;
    return cachedEnglishGames;
  } catch (error) {
    console.error('Failed to load english games, using fallback:', error);
    cachedEnglishGames = fallbackEnglishGames;
    return cachedEnglishGames;
  }
};

// Export sync version for backward compatibility
export const englishGames: CurriculumGame[] = fallbackEnglishGames;
