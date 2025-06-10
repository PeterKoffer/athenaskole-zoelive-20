
import { CurriculumGame } from '../types/GameTypes';
import { staticDataService } from '@/services/staticDataService';

// Fallback data in case external data fails to load
const fallbackSocialStudiesGames: CurriculumGame[] = [
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
  }
];

let cachedSocialStudiesGames: CurriculumGame[] | null = null;

export const getSocialStudiesGames = async (): Promise<CurriculumGame[]> => {
  if (cachedSocialStudiesGames) {
    return cachedSocialStudiesGames;
  }

  try {
    const games = await staticDataService.loadGamesData('socialstudies');
    cachedSocialStudiesGames = games.length > 0 ? games : fallbackSocialStudiesGames;
    return cachedSocialStudiesGames;
  } catch (error) {
    console.error('Failed to load social studies games, using fallback:', error);
    cachedSocialStudiesGames = fallbackSocialStudiesGames;
    return cachedSocialStudiesGames;
  }
};

// Export sync version for backward compatibility
export const socialStudiesGames: CurriculumGame[] = fallbackSocialStudiesGames;
