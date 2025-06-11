
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
  const [generatedQuestions, setGeneratedQuestions] = useState<Set<string>>(new Set());
  const [questionCounter, setQuestionCounter] = useState(0);

  const generateUniqueQuestion = useCallback((): LessonActivity => {
    const currentCount = questionCounter + 1;
    setQuestionCounter(currentCount);

    // Generate truly unique mathematical questions
    const operations = ['+', '-', '*', '÷'];
    const operation = operations[currentCount % operations.length];
    
    // Create unique number combinations based on counter
    let num1: number, num2: number, result: number, questionText: string, explanation: string;
    
    switch (operation) {
      case '+':
        num1 = 15 + (currentCount * 3) % 50;
        num2 = 8 + (currentCount * 2) % 30;
        result = num1 + num2;
        questionText = `Sarah collected ${num1} seashells on Monday and ${num2} seashells on Tuesday. How many seashells did she collect in total?`;
        explanation = `Sarah collected ${num1} + ${num2} = ${result} seashells in total.`;
        break;
        
      case '-':
        num1 = 25 + (currentCount * 4) % 60;
        num2 = 8 + (currentCount * 2) % 20;
        if (num1 <= num2) num1 = num2 + 5; // Ensure positive result
        result = num1 - num2;
        questionText = `Tom had ${num1} marbles. He gave ${num2} marbles to his friend. How many marbles does Tom have left?`;
        explanation = `Tom had ${num1} marbles and gave away ${num2}, so he has ${num1} - ${num2} = ${result} marbles left.`;
        break;
        
      case '*':
        num1 = 3 + (currentCount % 8);
        num2 = 4 + (currentCount % 6);
        result = num1 * num2;
        questionText = `A bakery makes ${num1} rows of cupcakes with ${num2} cupcakes in each row. How many cupcakes are there in total?`;
        explanation = `${num1} rows × ${num2} cupcakes per row = ${result} cupcakes total.`;
        break;
        
      case '÷':
        result = 4 + (currentCount % 8);
        num2 = 3 + (currentCount % 5);
        num1 = result * num2;
        questionText = `A teacher needs to divide ${num1} students into groups of ${num2}. How many groups will there be?`;
        explanation = `${num1} ÷ ${num2} = ${result} groups.`;
        break;
        
      default:
        num1 = 10 + currentCount;
        num2 = 5 + currentCount;
        result = num1 + num2;
        questionText = `What is ${num1} + ${num2}?`;
        explanation = `${num1} + ${num2} = ${result}`;
    }

    // Generate wrong answers that are close but not correct
    const wrongAnswers = [
      result + 1,
      result - 1,
      result + Math.floor(Math.random() * 5) + 2
    ].filter(ans => ans !== result && ans > 0);

    // Ensure we have exactly 3 wrong answers
    while (wrongAnswers.length < 3) {
      const newWrong = result + Math.floor(Math.random() * 10) - 5;
      if (newWrong !== result && newWrong > 0 && !wrongAnswers.includes(newWrong)) {
        wrongAnswers.push(newWrong);
      }
    }

    const allOptions = [result, ...wrongAnswers.slice(0, 3)];
    
    // Shuffle options
    const shuffledOptions = allOptions
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value.toString());

    const correctIndex = shuffledOptions.findIndex(option => parseInt(option) === result);

    const uniqueId = `math-${subject}-${currentCount}-${Date.now()}`;
    
    // Track this question
    setGeneratedQuestions(prev => new Set([...prev, questionText]));

    return {
      id: uniqueId,
      title: `${subject} Practice Question ${currentCount}`,
      phase: 'interactive-game' as const,
      duration: 60,
      content: {
        question: questionText,
        options: shuffledOptions,
        correctAnswer: correctIndex,
        explanation
      }
    };
  }, [subject, skillArea, questionCounter]);

  const resetQuestions = useCallback(() => {
    setGeneratedQuestions(new Set());
    setQuestionCounter(0);
  }, []);

  return {
    generateUniqueQuestion,
    resetQuestions,
    questionCount: questionCounter
  };
};
