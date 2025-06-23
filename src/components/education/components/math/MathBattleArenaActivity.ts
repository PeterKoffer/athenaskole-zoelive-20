

import { LessonActivity } from '../types/LessonTypes';

export const mathBattleArenaActivity: LessonActivity = {
  id: 'math-battle-arena-1',
  title: '⚔️ Math Battle Arena',
  type: 'quiz',
  phase: 'interactive-game',
  duration: 180,
  phaseDescription: 'Epic math battle challenge',
  metadata: {
    subject: 'mathematics',
    skillArea: 'general_math'
  },
  content: {
    question: 'A dragon has 147 gold coins. It finds a treasure chest with 3 times as many coins. How many coins does the dragon have now?',
    options: ['441 coins', '588 coins', '294 coins', '735 coins'],
    correctAnswer: 1,
    explanation: 'The treasure chest has 147 × 3 = 441 coins. Total: 147 + 441 = 588 coins! Victory is yours!',
    battleScenario: '🐉 You face a fierce math dragon! Solve this problem to cast your spell and win the battle! 🗡️'
  }
};

