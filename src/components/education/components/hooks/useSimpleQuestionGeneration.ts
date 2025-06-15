import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UniqueQuestion } from '@/services/globalQuestionUniquenessService';

interface UseSimpleQuestionGenerationProps {
  subject: string;
  skillArea: string;
}

export const useSimpleQuestionGeneration = ({
  subject,
  skillArea
}: UseSimpleQuestionGenerationProps) => {
  const { user } = useAuth();
  const [questionCount, setQuestionCount] = useState(0);

  // Simple deterministic question generator to prevent duplicates
  const generateUniqueQuestion = useCallback((): UniqueQuestion => {
    const timestamp = Date.now();
    const questionId = `local_${timestamp}_${questionCount}_${Math.random().toString(36).substring(2, 8)}`;
    
    console.log('🎲 Generating simple unique question:', { questionId, questionCount, subject, skillArea });

    // Generate unique mathematical scenarios based on question count and timestamp
    const scenarios = [
      'Magical Forest Adventure', 'Space Station Mission', 'Underwater Exploration',
      'Dragon Kingdom Quest', 'Robot Factory Tour', 'Pirate Treasure Hunt',
      'Wizard Academy Class', 'Arctic Research Expedition', 'Jungle Safari Discovery',
      'Castle Building Project', 'Time Travel Journey', 'Superhero Training Day'
    ];

    const characters = [
      'Luna', 'Phoenix', 'Storm', 'River', 'Sky', 'Ocean', 'Forest', 'Star',
      'Sage', 'Quest', 'Nova', 'Echo', 'Blaze', 'Frost', 'Dawn', 'Ember'
    ];

    const scenarioIndex = questionCount % scenarios.length;
    const characterIndex = (questionCount + 3) % characters.length;
    
    const scenario = scenarios[scenarioIndex];
    const character = characters[characterIndex];
    
    // Generate unique numbers based on question count to ensure different problems
    const baseNum1 = 15 + (questionCount * 7) % 40;
    const baseNum2 = 8 + (questionCount * 3) % 25;
    
    // Add some randomness while keeping it deterministic per session
    const variation = Math.floor((timestamp / 1000) % 10);
    const num1 = baseNum1 + variation;
    const num2 = baseNum2 + (variation % 5);

    const operations = [
      { symbol: '+', word: 'collected and then found', result: num1 + num2 },
      { symbol: '-', word: 'had and gave away', result: Math.max(num1, num2) - Math.min(num1, num2) }
    ];

    const operationIndex = questionCount % operations.length;
    const operation = operations[operationIndex];
    
    let question: string;
    let correctAnswer: number;

    if (operation.symbol === '+') {
      question = `In the ${scenario}, ${character} ${operation.word} ${num1} magical crystals and then found ${num2} more crystals. How many crystals does ${character} have in total?`;
      correctAnswer = operation.result;
    } else {
      const larger = Math.max(num1, num2);
      const smaller = Math.min(num1, num2);
      question = `During the ${scenario}, ${character} started with ${larger} energy points and used ${smaller} points to cast a spell. How many energy points does ${character} have left?`;
      correctAnswer = larger - smaller;
    }

    // Generate wrong answers that are clearly different
    const wrongAnswers = [
      correctAnswer + 5 + (questionCount % 8),
      correctAnswer - 3 - (questionCount % 6),
      correctAnswer + 12 + (questionCount % 10)
    ].filter(ans => ans !== correctAnswer && ans > 0);

    // Ensure we have exactly 4 unique options
    while (wrongAnswers.length < 3) {
      const newWrong = correctAnswer + Math.floor(Math.random() * 20) - 10;
      if (newWrong > 0 && !wrongAnswers.includes(newWrong) && newWrong !== correctAnswer) {
        wrongAnswers.push(newWrong);
      }
    }

    const allOptions = [correctAnswer, ...wrongAnswers.slice(0, 3)]
      .sort(() => 0.5 - Math.random()); // Shuffle options

    const finalCorrectIndex = allOptions.indexOf(correctAnswer);

    const uniqueQuestion: UniqueQuestion = {
      id: questionId,
      content: {
        question,
        options: allOptions.map(String),
        correctAnswer: finalCorrectIndex,
        explanation: `${character} ${operation.symbol === '+' ? 'added the crystals together' : 'subtracted the points used'} to get ${correctAnswer}.`
      },
      metadata: {
        subject,
        skillArea,
        difficultyLevel: 2,
        timestamp,
        userId: user?.id || 'anonymous',
        sessionId: `session_${timestamp}`
      }
    };

    setQuestionCount(prev => prev + 1);
    
    console.log('✅ Generated unique question:', {
      questionId,
      questionNumber: questionCount + 1,
      correctAnswer: correctAnswer,
      scenario,
      character
    });

    return uniqueQuestion;
  }, [subject, skillArea, questionCount, user?.id]);

  return {
    generateUniqueQuestion,
    questionCount
  };
};
