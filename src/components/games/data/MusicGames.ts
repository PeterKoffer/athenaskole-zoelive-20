
import { CurriculumGame } from '../types/GameTypes';
import { staticDataService } from '@/services/staticDataService';

// Fallback data in case external data fails to load
const fallbackMusicGames: CurriculumGame[] = [
  {
    id: "music-rhythm-maker",
    title: "Rhythm Maker Studio",
    description: "Create your own musical compositions while learning about rhythm, melody, and musical notation!",
    emoji: "🎵",
    subject: "Music",
    gradeLevel: [2, 3, 4, 5],
    difficulty: "beginner",
    interactionType: "drawing",
    timeEstimate: "20-25 min",
    skillAreas: ["rhythm_recognition", "musical_notation", "creativity"],
    learningObjectives: [
      "Understand basic rhythm patterns",
      "Learn musical notation basics",
      "Express creativity through music"
    ],
    status: "coming-soon",
    rewards: {
      coins: 180,
      badges: ["Music Maker", "Rhythm Master"]
    }
  }
];

let cachedMusicGames: CurriculumGame[] | null = null;

export const getMusicGames = async (): Promise<CurriculumGame[]> => {
  if (cachedMusicGames) {
    return cachedMusicGames;
  }

  try {
    const games = await staticDataService.loadGamesData('music');
    cachedMusicGames = games.length > 0 ? games : fallbackMusicGames;
    return cachedMusicGames;
  } catch (error) {
    console.error('Failed to load music games, using fallback:', error);
    cachedMusicGames = fallbackMusicGames;
    return cachedMusicGames;
  }
};

// Export sync version for backward compatibility
export const musicGames: CurriculumGame[] = fallbackMusicGames;
