
import { CurriculumGame } from '../types/GameTypes';
import { curriculumGames } from '../data/GameData';

export const getGamesBySubject = (subject: string): CurriculumGame[] => {
  return curriculumGames.filter(game => game.subject === subject);
};

export const getGamesByGradeLevel = (gradeLevel: number): CurriculumGame[] => {
  return curriculumGames.filter(game => game.gradeLevel.includes(gradeLevel));
};

export const getGameById = (id: string): CurriculumGame | undefined => {
  return curriculumGames.find(game => game.id === id);
};

export const getGamesByDifficulty = (difficulty: string): CurriculumGame[] => {
  return curriculumGames.filter(game => game.difficulty === difficulty);
};

export const filterGames = (
  subject: string = "all",
  gradeLevel: string = "all", 
  difficulty: string = "all"
): CurriculumGame[] => {
  return curriculumGames.filter(game => {
    const subjectMatch = subject === "all" || game.subject === subject;
    const gradeMatch = gradeLevel === "all" || game.gradeLevel.includes(parseInt(gradeLevel));
    const difficultyMatch = difficulty === "all" || game.difficulty === difficulty;
    
    return subjectMatch && gradeMatch && difficultyMatch;
  });
};
