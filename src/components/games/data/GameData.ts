
import { CurriculumGame } from '../types/GameTypes';
import { staticDataService } from '@/services/staticDataService';
import { mathematicsGames, getMathematicsGames } from './MathematicsGames';
import { englishGames } from './EnglishGames';
import { computerScienceGames } from './ComputerScienceGames';
import { scienceGames } from './ScienceGames';
import { socialStudiesGames } from './SocialStudiesGames';
import { languageGames } from './LanguageGames';
import { musicGames, getMusicGames } from './MusicGames';

// Synchronous export for backward compatibility (uses fallback data)
export const curriculumGames: CurriculumGame[] = [
  ...mathematicsGames,
  ...englishGames,
  ...computerScienceGames,
  ...scienceGames,
  ...socialStudiesGames,
  ...languageGames,
  ...musicGames
];

// Async function to load all games from external sources
export const loadAllGamesData = async (): Promise<CurriculumGame[]> => {
  try {
    const allGames = await staticDataService.loadAllGamesData();
    return allGames.length > 0 ? allGames : curriculumGames;
  } catch (error) {
    console.error('Failed to load games data, using fallback:', error);
    return curriculumGames;
  }
};
