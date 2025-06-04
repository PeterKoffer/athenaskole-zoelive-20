
import { CurriculumGame } from '../types/GameTypes';
import { mathematicsGames } from './MathematicsGames';
import { englishGames } from './EnglishGames';
import { computerScienceGames } from './ComputerScienceGames';
import { scienceGames } from './ScienceGames';
import { socialStudiesGames } from './SocialStudiesGames';
import { languageGames } from './LanguageGames';
import { musicGames } from './MusicGames';

export const curriculumGames: CurriculumGame[] = [
  ...mathematicsGames,
  ...englishGames,
  ...computerScienceGames,
  ...scienceGames,
  ...socialStudiesGames,
  ...languageGames,
  ...musicGames
];
