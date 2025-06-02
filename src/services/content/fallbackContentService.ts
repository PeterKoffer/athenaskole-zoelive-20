
import { AdaptiveContentRecord } from '../types/contentTypes';

export class FallbackContentService {
  private readonly fallbackQuestions = {
    matematik: {
      addition: 'What is 15 + 27?',
      subtraction: 'What is 50 - 23?',
      multiplication: 'What is 8 × 7?',
      division: 'What is 48 ÷ 6?'
    },
    dansk: {
      spelling: 'Which word is spelled correctly?',
      grammar: 'Choose the correct sentence structure:',
      reading: 'What is the main idea of this text?',
      writing: 'Which sentence uses proper punctuation?'
    },
    engelsk: {
      vocabulary: 'What does "magnificent" mean?',
      grammar: 'Choose the correct verb tense:',
      reading: 'What is the author\'s purpose?',
      speaking: 'How do you pronounce this word?'
    },
    naturteknik: {
      science: 'What is the process of photosynthesis?',
      technology: 'How does a simple machine work?',
      experiments: 'What happens when you mix these chemicals?',
      nature: 'Which animal is a mammal?'
    }
  };

  createFallbackContent(subject: string, skillArea: string, difficultyLevel: number): AdaptiveContentRecord {
    const defaultOptions = ['Option A', 'Option B', 'Option C', 'Option D'];
    const subjectQuestions = this.fallbackQuestions[subject as keyof typeof this.fallbackQuestions];
    const question = subjectQuestions?.[skillArea as keyof typeof subjectQuestions] || 
                    `Sample question for ${subject} - ${skillArea}`;

    const contentData = {
      question,
      options: defaultOptions,
      correct: 0,
      explanation: `This is a sample question for ${subject} in the ${skillArea} area.`,
      learningObjectives: [`Understanding ${skillArea} concepts in ${subject}`]
    };

    return {
      subject,
      skill_area: skillArea,
      difficulty_level: difficultyLevel,
      title: question,
      content: contentData as any,
      learning_objectives: [`Understanding ${skillArea} concepts in ${subject}`],
      estimated_time: 30
    };
  }
}

export const fallbackContentService = new FallbackContentService();
