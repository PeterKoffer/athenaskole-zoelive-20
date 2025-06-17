
import { StableQuestionTemplate } from './types';

export const mathTemplates: StableQuestionTemplate[] = [
  {
    id: 'math_addition_gems',
    subject: 'mathematics',
    skillArea: 'addition',
    type: 'word_problem',
    difficultyLevel: 1,
    template: 'At the {location}, {character} collected {num1} {item}. Later, they found {num2} more {item}. How many {item} does {character} have in total?',
    variables: {
      location: ['magical forest', 'crystal cave', 'treasure island', 'enchanted garden', 'wonder park', 'star valley', 'rainbow bridge'],
      character: ['Explorer Maya', 'Scientist Luna', 'Detective Riley', 'Captain Alex', 'Artist Sam', 'Chef Jordan', 'Pilot Casey'],
      item: ['gems', 'crystals', 'coins', 'flowers', 'shells', 'books', 'stars'],
      num1: [15, 23, 18, 27, 31, 19, 25, 22, 16, 29],
      num2: [12, 16, 14, 18, 13, 21, 17, 19, 15, 24]
    },
    correctAnswerFormula: 'num1 + num2',
    explanationTemplate: '{character} started with {num1} {item} and found {num2} more. So {num1} + {num2} = {answer}.'
  },
  {
    id: 'math_subtraction_adventure',
    subject: 'mathematics',
    skillArea: 'subtraction',
    type: 'word_problem',
    difficultyLevel: 1,
    template: '{character} started their {adventure} with {num1} {item}. They used {num2} {item} to {action}. How many {item} does {character} have left?',
    variables: {
      character: ['Brave Knight Zoe', 'Space Explorer Max', 'Ocean Diver Aria', 'Mountain Climber Leo', 'Forest Ranger Nova'],
      adventure: ['epic quest', 'space mission', 'underwater expedition', 'mountain adventure', 'jungle exploration'],
      item: ['energy points', 'magic supplies', 'tools', 'food portions', 'special coins'],
      num1: [45, 52, 38, 41, 49, 36, 44, 47, 43, 50],
      num2: [18, 23, 16, 19, 21, 14, 17, 20, 15, 22],
      action: ['solve puzzles', 'power their ship', 'build equipment', 'feed animals', 'unlock doors']
    },
    correctAnswerFormula: 'num1 - num2',
    explanationTemplate: '{character} had {num1} {item} and used {num2}. So {num1} - {num2} = {answer}.'
  },
  {
    id: 'math_multiplication_groups',
    subject: 'mathematics',
    skillArea: 'multiplication',
    type: 'word_problem',
    difficultyLevel: 2,
    template: 'In the {location}, there are {num1} groups of {item}. Each group has {num2} {item}. How many {item} are there in total?',
    variables: {
      location: ['enchanted orchard', 'robot factory', 'butterfly garden', 'star observatory', 'music hall', 'art studio'],
      item: ['magical apples', 'dancing robots', 'colorful butterflies', 'twinkling stars', 'musical notes', 'paint brushes'],
      num1: [6, 7, 8, 9, 4, 5, 3],
      num2: [7, 6, 5, 4, 8, 9, 12]
    },
    correctAnswerFormula: 'num1 * num2',
    explanationTemplate: 'There are {num1} groups with {num2} {item} each. So {num1} × {num2} = {answer}.'
  }
];
