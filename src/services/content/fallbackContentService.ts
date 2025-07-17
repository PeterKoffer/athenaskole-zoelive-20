
import { AdaptiveContentRecord } from '../types/contentTypes';

export class FallbackContentService {
  private readonly usedQuestions = new Set<string>();
  private readonly fallbackQuestions = {
    mathematics: {
      addition: [
        'What is 15 + 27?',
        'Calculate 38 + 45.',
        'Sum up 123 + 456.'
      ],
      subtraction: [
        'What is 50 - 23?',
        'Calculate 100 - 37.',
        'Find the difference between 87 and 29.'
      ],
      multiplication: [
        'What is 8 × 7?',
        'Calculate 12 × 9.',
        'Multiply 15 by 6.'
      ],
      division: [
        'What is 48 ÷ 6?',
        'Calculate 81 ÷ 9.',
        'Divide 100 by 25.'
      ]
    },
    english: {
      vocabulary: [
        'What does "magnificent" mean?',
        'Choose a synonym for "happy".',
        'What is the opposite of "brave"?'
      ],
      grammar: [
        'Choose the correct verb tense:',
        'Identify the noun in the sentence.',
        'Which sentence is grammatically correct?'
      ],
      reading: [
        'What is the main idea of this text?',
        'What can you infer from this paragraph?',
        'What is the author\'s purpose?'
      ],
      writing: [
        'Which sentence uses proper punctuation?',
        'Combine the two sentences into one.',
        'Rewrite the sentence in the passive voice.'
      ]
    },
    science: {
      biology: [
        'What is the process of photosynthesis?',
        'What are the parts of a cell?',
        'What is the function of the mitochondria?'
      ],
      chemistry: [
        'What is the chemical formula for water?',
        'What is the difference between an acid and a base?',
        'What is a chemical reaction?'
      ],
      physics: [
        'What is the law of gravity?',
        'What is the difference between speed and velocity?',
        'What is an example of a simple machine?'
      ]
    },
    social_studies: {
      history: [
        'Who was the first president of the United States?',
        'What was the main cause of the Civil War?',
        'What was the Renaissance?'
      ],
      geography: [
        'What is the capital of France?',
        'What is the longest river in the world?',
        'What is the largest desert in the world?'
      ],
      civics: [
        'What are the three branches of government?',
        'What is the purpose of the Constitution?',
        'What are the rights and responsibilities of a citizen?'
      ]
    }
  };

  private getRandomInt(max: number): number {
    const randomBuffer = new Uint32Array(1);
    crypto.getRandomValues(randomBuffer);
    return randomBuffer[0] % max;
  }

  private getQuestion(subject: string, skillArea: string): string {
    const questions = this.fallbackQuestions[subject as keyof typeof this.fallbackQuestions]?.[skillArea as keyof typeof subjectQuestions] ||
                    [`Sample question for ${subject} - ${skillArea}`];

    let question = questions[this.getRandomInt(questions.length)];

    if (this.usedQuestions.has(question)) {
      const availableQuestions = questions.filter(q => !this.usedQuestions.has(q));
      if (availableQuestions.length > 0) {
        question = availableQuestions[this.getRandomInt(availableQuestions.length)];
      }
    }

    this.usedQuestions.add(question);
    return question;
  }

  createFallbackContent(subject: string, skillArea: string, difficultyLevel: number): AdaptiveContentRecord {
    const question = this.getQuestion(subject, skillArea);
    const defaultOptions = ['Option A', 'Option B', 'Option C', 'Option D'];

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
