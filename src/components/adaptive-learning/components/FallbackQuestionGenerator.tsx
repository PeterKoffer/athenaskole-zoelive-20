
import { Question } from '../hooks/types';

interface FallbackQuestionGeneratorProps {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
}

export class FallbackQuestionGenerator {
  static generateFallbackQuestion(subject: string, skillArea: string, difficultyLevel: number): Question {
    console.log('🔄 Generating fallback question for', subject, skillArea);
    
    if (subject.toLowerCase() === 'mathematics') {
      return this.generateMathQuestion(difficultyLevel);
    }
    
    return this.generateGenericQuestion(subject, skillArea, difficultyLevel);
  }

  private static generateMathQuestion(difficultyLevel: number): Question {
    const num1 = Math.floor(Math.random() * (10 * difficultyLevel)) + 1;
    const num2 = Math.floor(Math.random() * (10 * difficultyLevel)) + 1;
    const correctAnswer = num1 + num2;
    
    const wrongAnswers = [
      correctAnswer + Math.floor(Math.random() * 5) + 1,
      correctAnswer - Math.floor(Math.random() * 5) - 1,
      correctAnswer + Math.floor(Math.random() * 10) + 5
    ];
    
    const options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
    const correctIndex = options.indexOf(correctAnswer);
    
    return {
      id: `fallback-math-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      question: `What is ${num1} + ${num2}?`,
      options: options.map(String),
      correct: correctIndex,
      explanation: `${num1} + ${num2} = ${correctAnswer}. This is a basic addition problem.`,
      learningObjectives: ['Basic Addition', 'Number Operations'],
      estimatedTime: 30,
      conceptsCovered: ['arithmetic', 'addition']
    };
  }

  private static generateGenericQuestion(subject: string, skillArea: string, difficultyLevel: number): Question {
    return {
      id: `fallback-generic-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      question: `What is an important concept in ${subject}?`,
      options: ['Concept A', 'Concept B', 'Concept C', 'Concept D'],
      correct: 0,
      explanation: `This is a fundamental concept in ${subject}.`,
      learningObjectives: [skillArea],
      estimatedTime: 30,
      conceptsCovered: [skillArea]
    };
  }
}
