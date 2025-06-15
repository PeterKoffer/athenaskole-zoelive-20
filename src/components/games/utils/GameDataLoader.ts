
import { CurriculumGame } from '../types/GameTypes';
import { staticDataService } from '@/services/staticDataService';
import { curriculumGames } from '../data/GameData';

// Cache for loaded games
let allGamesCache: CurriculumGame[] | null = null;

export const loadK12Games = async (): Promise<CurriculumGame[]> => {
  if (allGamesCache) {
    console.log('📋 Using cached games:', allGamesCache.length);
    return allGamesCache;
  }

  try {
    console.log('🌐 Loading K12 games from external sources...');
    const externalGames = await staticDataService.loadAllGamesData();
    
    // Combine external games with fallback games, removing duplicates
    const combinedGames = [...externalGames];
    
    // Add fallback games that aren't already present
    curriculumGames.forEach(fallbackGame => {
      if (!combinedGames.find(game => game.id === fallbackGame.id)) {
        combinedGames.push(fallbackGame);
      }
    });

    allGamesCache = combinedGames;
    console.log('✅ Successfully loaded', allGamesCache.length, 'total games');
    
    // Debug: Log geography games specifically
    const geographyGames = allGamesCache.filter(game => 
      game.subject.toLowerCase().includes('geography') ||
      game.title.toLowerCase().includes('geography') ||
      game.id.includes('geography')
    );
    console.log('🗺️ Geography games loaded:', geographyGames.map(g => ({ id: g.id, title: g.title, subject: g.subject })));
    
    return allGamesCache;
  } catch (error) {
    console.error('❌ Failed to load external games, using fallback:', error);
    allGamesCache = curriculumGames;
    return allGamesCache;
  }
};

export const getGamesByGrade = (gradeLevel: number): CurriculumGame[] => {
  if (!allGamesCache) {
    console.warn('⚠️ Games not loaded yet, using fallback data');
    return curriculumGames.filter(game => game.gradeLevel.includes(gradeLevel));
  }
  
  return allGamesCache.filter(game => game.gradeLevel.includes(gradeLevel));
};

export const getGamesBySubject = (subject: string): CurriculumGame[] => {
  if (!allGamesCache) {
    console.warn('⚠️ Games not loaded yet, using fallback data');
    return curriculumGames.filter(game => 
      game.subject.toLowerCase() === subject.toLowerCase()
    );
  }
  
  return allGamesCache.filter(game => 
    game.subject.toLowerCase() === subject.toLowerCase()
  );
};

export const getGameById = (gameId: string): CurriculumGame | undefined => {
  if (!allGamesCache) {
    console.warn('⚠️ Games not loaded yet, searching fallback data for:', gameId);
    return curriculumGames.find(game => game.id === gameId);
  }
  
  const foundGame = allGamesCache.find(game => game.id === gameId);
  if (foundGame) {
    console.log('🎯 Found game:', foundGame.title, '- Subject:', foundGame.subject);
  } else {
    console.warn('❌ Game not found:', gameId);
    console.log('📋 Available game IDs:', allGamesCache.map(g => g.id));
  }
  
  return foundGame;
};

// Clear cache function for development
export const clearGamesCache = () => {
  allGamesCache = null;
  console.log('🗑️ Games cache cleared');
};
