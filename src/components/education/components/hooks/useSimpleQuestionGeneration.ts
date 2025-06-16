import { useState, useCallback } from 'react';
import { LessonActivity } from '../types/LessonTypes';

interface UseSimpleQuestionGenerationProps {
  subject: string;
  skillArea: string;
}

export const useSimpleQuestionGeneration = ({
  subject,
  skillArea
}: UseSimpleQuestionGenerationProps) => {
  const [questionCount, setQuestionCount] = useState(0);
  const [generatedQuestionIds, setGeneratedQuestionIds] = useState<Set<string>>(new Set());

  // Math question templates with high variety
  const mathQuestionTemplates = [
    // Addition problems
    {
      template: "Sarah has {a} stickers and receives {b} more from her friend. How many stickers does Sarah have now?",
      operation: "addition",
      generateValues: () => {
        const a = Math.floor(Math.random() * 50) + 10;
        const b = Math.floor(Math.random() * 30) + 5;
        return { a, b, answer: a + b };
      }
    },
    {
      template: "A bakery sold {a} cookies in the morning and {b} cookies in the afternoon. How many cookies did they sell in total?",
      operation: "addition",
      generateValues: () => {
        const a = Math.floor(Math.random() * 80) + 20;
        const b = Math.floor(Math.random() * 60) + 15;
        return { a, b, answer: a + b };
      }
    },
    {
      template: "There are {a} red balloons and {b} blue balloons at the party. How many balloons are there altogether?",
      operation: "addition",
      generateValues: () => {
        const a = Math.floor(Math.random() * 25) + 8;
        const b = Math.floor(Math.random() * 20) + 6;
        return { a, b, answer: a + b };
      }
    },
    // Subtraction problems
    {
      template: "Marcus had {a} marbles but lost {b} of them. How many marbles does Marcus have left?",
      operation: "subtraction",
      generateValues: () => {
        const b = Math.floor(Math.random() * 20) + 5;
        const a = b + Math.floor(Math.random() * 40) + 10;
        return { a, b, answer: a - b };
      }
    },
    {
      template: "A library had {a} books. They donated {b} books to schools. How many books are left in the library?",
      operation: "subtraction",
      generateValues: () => {
        const b = Math.floor(Math.random() * 35) + 10;
        const a = b + Math.floor(Math.random() * 50) + 20;
        return { a, b, answer: a - b };
      }
    },
    // Multiplication problems
    {
      template: "Each box contains {a} pencils. If there are {b} boxes, how many pencils are there in total?",
      operation: "multiplication",
      generateValues: () => {
        const a = Math.floor(Math.random() * 8) + 2;
        const b = Math.floor(Math.random() * 6) + 3;
        return { a, b, answer: a * b };
      }
    },
    {
      template: "A garden has {a} rows of flowers with {b} flowers in each row. How many flowers are in the garden?",
      operation: "multiplication",
      generateValues: () => {
        const a = Math.floor(Math.random() * 7) + 4;
        const b = Math.floor(Math.random() * 5) + 3;
        return { a, b, answer: a * b };
      }
    },
    // Division problems
    {
      template: "There are {total} candies to be shared equally among {b} children. How many candies does each child get?",
      operation: "division",
      generateValues: () => {
        const b = Math.floor(Math.random() * 6) + 2;
        const answer = Math.floor(Math.random() * 8) + 3;
        const total = b * answer;
        return { a: total, b, answer, total };
      }
    },
    // Fraction problems (pizza theme)
    {
      template: "A pizza is cut into {b} equal slices. If you eat {a} slices, what fraction of the pizza did you eat?",
      operation: "fraction",
      generateValues: () => {
        const b = [4, 6, 8, 12][Math.floor(Math.random() * 4)];
        const a = Math.floor(Math.random() * (b - 1)) + 1;
        return { a, b, answer: `${a}/${b}` };
      }
    },
    {
      template: "At the pizza factory, each pizza is divided into {b} equal pieces. A customer orders {a} pieces. What fraction of a whole pizza is this?",
      operation: "fraction",
      generateValues: () => {
        const b = [6, 8, 10, 12][Math.floor(Math.random() * 4)];
        const a = Math.floor(Math.random() * (b - 1)) + 1;
        return { a, b, answer: `${a}/${b}` };
      }
    }
  ];

  const generateWrongAnswers = (correctAnswer: any, operation: string) => {
    if (operation === 'fraction') {
      // For fractions, generate different fractions
      const [num, den] = correctAnswer.split('/').map(Number);
      return [
        `${num + 1}/${den}`,
        `${num}/${den + 2}`,
        `${Math.max(1, num - 1)}/${den}`
      ];
    } else {
      const correct = typeof correctAnswer === 'number' ? correctAnswer : parseInt(correctAnswer);
      return [
        correct + Math.floor(Math.random() * 10) + 1,
        correct - Math.floor(Math.random() * 8) - 1,
        correct + Math.floor(Math.random() * 15) + 5
      ].filter(ans => ans > 0 && ans !== correct);
    }
  };

  const generateUniqueQuestion = useCallback(() => {
    // Select a random template
    const template = mathQuestionTemplates[Math.floor(Math.random() * mathQuestionTemplates.length)];
    const values = template.generateValues();
    
    // Generate unique ID based on timestamp and random number
    const uniqueId = `${subject.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Ensure this exact question hasn't been generated
    if (generatedQuestionIds.has(uniqueId)) {
      return generateUniqueQuestion(); // Recursive call for true uniqueness
    }
    
    setGeneratedQuestionIds(prev => new Set([...prev, uniqueId]));
    setQuestionCount(prev => prev + 1);

    // Replace placeholders in template
    let questionText = template.template;
    Object.entries(values).forEach(([key, value]) => {
      questionText = questionText.replace(new RegExp(`{${key}}`, 'g'), value.toString());
    });

    const wrongAnswers = generateWrongAnswers(values.answer, template.operation);
    const allOptions = [values.answer.toString(), ...wrongAnswers.map(String)];
    
    // Shuffle options
    const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
    const correctIndex = shuffledOptions.indexOf(values.answer.toString());

    const activity: LessonActivity = {
      id: uniqueId,
      title: `${template.operation.charAt(0).toUpperCase() + template.operation.slice(1)} Challenge`,
      type: 'interactive-game',
      phase: 'interactive-game',
      duration: 120,
      phaseDescription: `Practice ${template.operation} skills`,
      content: {
        question: questionText,
        options: shuffledOptions,
        correctAnswer: correctIndex,
        explanation: `Great job! The answer is ${values.answer}. ${template.operation === 'fraction' ? 'Remember, fractions show parts of a whole!' : 'Keep practicing your math skills!'}`
      },
      metadata: {
        subject: subject,
        skillArea: skillArea,
        templateId: uniqueId,
        difficultyLevel: 1
      }
    };

    console.log(`✨ Generated UNIQUE ${subject} question #${questionCount + 1}:`, {
      id: uniqueId,
      operation: template.operation,
      question: questionText.substring(0, 50) + '...'
    });

    return activity;
  }, [subject, skillArea, questionCount, generatedQuestionIds]);

  const clearGeneratedQuestions = useCallback(() => {
    console.log('🔄 Clearing all generated questions for fresh start');
    setGeneratedQuestionIds(new Set());
    setQuestionCount(0);
  }, []);

  return {
    generateUniqueQuestion,
    clearGeneratedQuestions,
    questionCount,
    totalGenerated: generatedQuestionIds.size
  };
};
