import { CurriculumGame } from '@/components/games/types/GameTypes';
import { CurriculumStep } from '@/types/curriculum';

export class StaticDataService {
  private gameDataCache: Map<string, CurriculumGame[]> = new Map();
  private curriculumStepsCache: CurriculumStep[] | null = null;

  /**
   * Load games data from JSON files
   */
  async loadGamesData(subject: string): Promise<CurriculumGame[]> {
    const cacheKey = subject.toLowerCase();
    
    if (this.gameDataCache.has(cacheKey)) {
      return this.gameDataCache.get(cacheKey)!;
    }

    try {
      const fileName = `${subject.toLowerCase()}-games.json`;
      const response = await fetch(`/data/games/${fileName}`);
      
      if (!response.ok) {
        console.error(`Failed to load ${fileName}: ${response.status}`);
        return [];
      }

      const games: CurriculumGame[] = await response.json();
      this.gameDataCache.set(cacheKey, games);
      return games;
    } catch (error) {
      console.error(`Error loading games data for ${subject}:`, error);
      return [];
    }
  }

  /**
   * Load all games data from multiple JSON files
   */
  async loadAllGamesData(): Promise<CurriculumGame[]> {
    const gameFiles = [
      '/data/games/english-games.json',
      '/data/games/science-games.json',
      '/data/games/language-games.json',
      '/data/games/computerscience-games.json',
      '/data/games/socialstudies-games.json',
      '/data/games/music-games.json',
      '/data/games/immersive-games.json',
      '/data/games/coding-games.json',
      '/data/games/interactive-quiz-games.json',
      '/data/games/music-creative-games.json',
      '/data/games/ar-math-games.json'
    ];

    console.log('📚 Loading games from', gameFiles.length, 'files...');
    
    const allGames: CurriculumGame[] = [];
    
    for (const file of gameFiles) {
      try {
        const response = await fetch(file);
        if (response.ok) {
          const games: CurriculumGame[] = await response.json();
          allGames.push(...games);
          console.log(`✅ Loaded ${games.length} games from ${file}`);
        } else {
          console.warn(`⚠️ Could not load ${file}: ${response.status}`);
        }
      } catch (error) {
        console.warn(`⚠️ Failed to load ${file}:`, error);
      }
    }
    
    console.log(`🎮 Total games loaded: ${allGames.length}`);
    return allGames;
  }

  /**
   * Load curriculum steps from JSON file
   */
  async loadCurriculumSteps(): Promise<CurriculumStep[]> {
    if (this.curriculumStepsCache) {
      return this.curriculumStepsCache;
    }

    try {
      const response = await fetch('/data/curriculum-steps.json');
      
      if (!response.ok) {
        console.error(`Failed to load curriculum steps: ${response.status}`);
        return [];
      }

      const steps: CurriculumStep[] = await response.json();
      this.curriculumStepsCache = steps;
      return steps;
    } catch (error) {
      console.error('Error loading curriculum steps:', error);
      return [];
    }
  }

  /**
   * Clear caches - useful for development or when data updates
   */
  clearCache(): void {
    this.gameDataCache.clear();
    this.curriculumStepsCache = null;
  }
}

export const staticDataService = new StaticDataService();
