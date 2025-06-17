
import { useState, useRef } from 'react';
import { LessonActivity } from '../types/LessonTypes';

interface QuestionTemplate {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  skillArea: string;
}

// Diverse question templates following curriculum standards
const MATH_QUESTION_TEMPLATES: QuestionTemplate[] = [
  // Addition questions
  {
    id: 'add_1',
    question: 'Sarah has 24 stickers. She buys 15 more stickers. How many stickers does Sarah have now?',
    options: ['39', '35', '41', '37'],
    correctAnswer: 0,
    explanation: 'Sarah started with 24 stickers and bought 15 more. So 24 + 15 = 39 stickers.',
    skillArea: 'addition'
  },
  {
    id: 'add_2',
    question: 'A library has 156 books on the first shelf and 89 books on the second shelf. How many books are there in total?',
    options: ['245', '240', '250', '235'],
    correctAnswer: 0,
    explanation: 'We add the books from both shelves: 156 + 89 = 245 books total.',
    skillArea: 'addition'
  },
  
  // Subtraction questions
  {
    id: 'sub_1',
    question: 'Tom had 85 marbles. He gave 27 marbles to his friend. How many marbles does Tom have left?',
    options: ['58', '55', '60', '52'],
    correctAnswer: 0,
    explanation: 'Tom started with 85 marbles and gave away 27. So 85 - 27 = 58 marbles left.',
    skillArea: 'subtraction'
  },
  {
    id: 'sub_2',
    question: 'A school had 320 students. After summer break, 45 students moved away. How many students are left?',
    options: ['275', '280', '270', '285'],
    correctAnswer: 0,
    explanation: 'The school had 320 students and 45 moved away. So 320 - 45 = 275 students.',
    skillArea: 'subtraction'
  },

  // Multiplication questions
  {
    id: 'mult_1',
    question: 'A box contains 8 rows of candies with 6 candies in each row. How many candies are in the box?',
    options: ['48', '45', '50', '42'],
    correctAnswer: 0,
    explanation: 'There are 8 rows with 6 candies each. So 8 × 6 = 48 candies total.',
    skillArea: 'multiplication'
  },
  {
    id: 'mult_2',
    question: 'Emma buys 7 packs of stickers. Each pack has 12 stickers. How many stickers did Emma buy?',
    options: ['84', '80', '88', '76'],
    correctAnswer: 0,
    explanation: 'Emma bought 7 packs with 12 stickers each. So 7 × 12 = 84 stickers.',
    skillArea: 'multiplication'
  },

  // Division questions
  {
    id: 'div_1',
    question: 'There are 72 cookies to be shared equally among 9 children. How many cookies will each child get?',
    options: ['8', '7', '9', '6'],
    correctAnswer: 0,
    explanation: 'We divide 72 cookies among 9 children. So 72 ÷ 9 = 8 cookies each.',
    skillArea: 'division'
  },
  {
    id: 'div_2',
    question: 'A farmer collected 144 eggs and wants to pack them in boxes of 12. How many boxes will he need?',
    options: ['12', '10', '14', '11'],
    correctAnswer: 0,
    explanation: 'We divide 144 eggs by 12 eggs per box. So 144 ÷ 12 = 12 boxes.',
    skillArea: 'division'
  },

  // Fraction questions
  {
    id: 'frac_1',
    question: 'Lisa ate 3/8 of a pizza. How much pizza is left?',
    options: ['5/8', '4/8', '6/8', '2/8'],
    correctAnswer: 0,
    explanation: 'Lisa ate 3/8, so 8/8 - 3/8 = 5/8 of the pizza is left.',
    skillArea: 'fractions'
  },
  {
    id: 'frac_2',
    question: 'Which fraction is larger: 2/3 or 1/2?',
    options: ['2/3', '1/2', 'They are equal', 'Cannot compare'],
    correctAnswer: 0,
    explanation: '2/3 = 4/6 and 1/2 = 3/6. Since 4/6 > 3/6, we know 2/3 > 1/2.',
    skillArea: 'fractions'
  },

  // Pattern questions
  {
    id: 'pattern_1',
    question: 'What comes next in this pattern: 3, 6, 9, 12, ?',
    options: ['15', '14', '16', '13'],
    correctAnswer: 0,
    explanation: 'This pattern increases by 3 each time: 3, 6, 9, 12, 15.',
    skillArea: 'patterns'
  },
  {
    id: 'pattern_2',
    question: 'Complete the pattern: 2, 4, 8, 16, ?',
    options: ['32', '24', '28', '20'],
    correctAnswer: 0,
    explanation: 'Each number doubles: 2×2=4, 4×2=8, 8×2=16, 16×2=32.',
    skillArea: 'patterns'
  }
];

interface UseSimpleQuestionGenerationProps {
  subject: string;
  skillArea: string;
}

export const useSimpleQuestionGeneration = ({
  subject,
  skillArea
}: UseSimpleQuestionGenerationProps) => {
  const [sessionId] = useState(`session_${Date.now()}`);
  const usedQuestionIds = useRef<Set<string>>(new Set());

  const generateUniqueQuestion = (): LessonActivity => {
    // Filter out already used questions
    const availableQuestions = MATH_QUESTION_TEMPLATES.filter(
      template => !usedQuestionIds.current.has(template.id)
    );

    // If all questions used, reset
    if (availableQuestions.length === 0) {
      console.log('🔄 All questions used, resetting pool');
      usedQuestionIds.current.clear();
      availableQuestions.push(...MATH_QUESTION_TEMPLATES);
    }

    // Select random question
    const selectedTemplate = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    usedQuestionIds.current.add(selectedTemplate.id);

    console.log('📝 Generated unique question:', {
      id: selectedTemplate.id,
      skillArea: selectedTemplate.skillArea,
      question: selectedTemplate.question.substring(0, 50) + '...'
    });

    return {
      id: `question_${selectedTemplate.id}_${Date.now()}`,
      title: `${selectedTemplate.skillArea.charAt(0).toUpperCase() + selectedTemplate.skillArea.slice(1)} Challenge`,
      type: 'interactive-game',
      phase: 'interactive-game',
      duration: 180,
      metadata: {
        subject,
        skillArea: selectedTemplate.skillArea,
        templateId: selectedTemplate.id
      },
      content: {
        question: selectedTemplate.question,
        options: selectedTemplate.options,
        correctAnswer: selectedTemplate.correctAnswer,
        explanation: selectedTemplate.explanation
      }
    };
  };

  return {
    generateUniqueQuestion,
    sessionId
  };
};
