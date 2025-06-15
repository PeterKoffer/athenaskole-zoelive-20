
import { CurriculumGame } from '../types/GameTypes';

let cachedGames: CurriculumGame[] | null = null;

export const loadK12Games = async (): Promise<CurriculumGame[]> => {
  if (cachedGames) {
    return cachedGames;
  }

  try {
    const gameFiles = [
      '/data/games/mathematics-k12-games.json',
      '/data/games/english-games.json',
      '/data/games/science-games.json',
      '/data/games/computerscience-games.json',
      '/data/games/socialstudies-games.json',
      '/data/games/language-games.json',
      '/data/games/music-games.json'
    ];

    const allGames: CurriculumGame[] = [];

    for (const file of gameFiles) {
      try {
        const response = await fetch(file);
        if (response.ok) {
          const games = await response.json();
          allGames.push(...games);
        }
      } catch (error) {
        console.warn(`Failed to load ${file}:`, error);
      }
    }

    // If we couldn't load any games, create some basic fallback games
    if (allGames.length === 0) {
      const fallbackGames: CurriculumGame[] = [];
      
      // Create 10 games per grade (K-12)
      for (let grade = 0; grade <= 12; grade++) {
        const subjects = ['Mathematics', 'English', 'Science', 'History'];
        
        subjects.forEach((subject, subjectIndex) => {
          for (let gameNum = 1; gameNum <= 3; gameNum++) {
            fallbackGames.push({
              id: `${subject.toLowerCase()}-grade${grade}-${gameNum}`,
              title: `${subject} Adventure ${gameNum}`,
              description: `Learn ${subject} concepts for Grade ${grade} in this engaging game!`,
              emoji: ['🎯', '📚', '🔬', '📜'][subjectIndex],
              subject,
              gradeLevel: [grade],
              difficulty: grade <= 3 ? 'beginner' : grade <= 8 ? 'intermediate' : 'advanced',
              interactionType: ['multiple-choice', 'drag-drop', 'click-sequence'][gameNum % 3] as any,
              timeEstimate: "15-25 min",
              skillAreas: [`${subject.toLowerCase()}_basics`, "problem_solving"],
              learningObjectives: [
                `Master Grade ${grade} ${subject} concepts`,
                "Develop critical thinking skills",
                "Apply knowledge to real scenarios"
              ],
              status: "available",
              rewards: {
                coins: 100 + (grade * 10) + (gameNum * 20),
                badges: [`${subject} Explorer`, `Grade ${grade} Champion`]
              }
            });
          }
        });
      }
      
      allGames.push(...fallbackGames);
    }

    cachedGames = allGames;
    console.log(`📚 Loaded ${allGames.length} K-12 games`);
    return allGames;
    
  } catch (error) {
    console.error('Failed to load K-12 games:', error);
    return [];
  }
};

export const getGamesByGrade = async (grade: number): Promise<CurriculumGame[]> => {
  const games = await loadK12Games();
  return games.filter(game => game.gradeLevel.includes(grade));
};

export const getGamesBySubject = async (subject: string): Promise<CurriculumGame[]> => {
  const games = await loadK12Games();
  return games.filter(game => game.subject === subject);
};

export const getGameById = async (id: string): Promise<CurriculumGame | undefined> => {
  const games = await loadK12Games();
  return games.find(game => game.id === id);
};
