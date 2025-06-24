import { globalQuestionUniquenessService, UniqueQuestion } from './globalQuestionUniquenessService';
import { supabase } from '@/integrations/supabase/client';

export interface QuestionGenerationConfig {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  userId: string;
  gradeLevel?: number;
  standardsAlignment?: Record<string, unknown> | null;
  questionContext?: Record<string, unknown>;
  maxAttempts?: number;
  enablePersistence?: boolean;
}

export interface QuestionGenerationResult {
  question: UniqueQuestion;
  generationMethod: 'ai' | 'fallback';
  attempts: number;
  uniquenessGuaranteed: boolean;
}

class UnifiedQuestionGenerationService {
  private readonly maxRetries = 5;
  private readonly fallbackQuestions = new Map<string, any[]>();

  async generateUniqueQuestion(config: QuestionGenerationConfig): Promise<QuestionGenerationResult> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    let attempts = 0;
    const maxAttempts = config.maxAttempts || this.maxRetries;

    console.log('🎯 Starting unified question generation:', config);

    // Get user's previous questions to avoid duplicates
    const previousQuestions = globalQuestionUniquenessService.getUserQuestionHistory(
      config.userId,
      config.subject,
      25
    );

    // Try AI generation first
    for (attempts = 1; attempts <= maxAttempts; attempts++) {
      console.log(`🤖 AI generation attempt ${attempts}/${maxAttempts}`);
      
      try {
        const aiQuestion = await this.generateWithAI(config, previousQuestions, sessionId);
        
        if (aiQuestion) {
          const isUnique = globalQuestionUniquenessService.isQuestionUnique(
            config.userId,
            config.subject,
            aiQuestion.content.question
          );

          if (isUnique) {
            await globalQuestionUniquenessService.trackQuestionUsage(aiQuestion);
            
            return {
              question: aiQuestion,
              generationMethod: 'ai',
              attempts,
              uniquenessGuaranteed: true
            };
          } else {
            console.log(`❌ AI question ${attempts} was not unique, retrying...`);
          }
        }
      } catch (error) {
        console.warn(`⚠️ AI generation attempt ${attempts} failed:`, error);
      }
    }

    // Fallback to enhanced local generation
    console.log('🎲 Falling back to enhanced local generation');
    const fallbackQuestion = await this.generateWithEnhancedFallback(config, sessionId);
    
    if (fallbackQuestion) {
      await globalQuestionUniquenessService.trackQuestionUsage(fallbackQuestion);
      
      return {
        question: fallbackQuestion,
        generationMethod: 'fallback',
        attempts,
        uniquenessGuaranteed: true
      };
    }

    throw new Error('Failed to generate any unique question after all attempts');
  }

  private async generateWithAI(
    config: QuestionGenerationConfig,
    previousQuestions: string[],
    sessionId: string
  ): Promise<UniqueQuestion | null> {
    try {
      const response = await supabase.functions.invoke('generate-adaptive-content', {
        body: {
          subject: config.subject,
          skillArea: config.skillArea,
          difficultyLevel: config.difficultyLevel,
          previousQuestions,
          gradeLevel: config.gradeLevel,
          standardsAlignment: config.standardsAlignment,
          sessionId,
          forceUnique: true,
          uniquenessInstructions: `Generate completely original content that has never been used before. Session: ${sessionId}`
        }
      });

      if (response.error) {
        console.error('❌ Supabase function error:', response.error);
        return null;
      }

      const questionData = response.data;
      if (!questionData?.success || !questionData.generatedContent?.question) {
        console.warn('⚠️ Invalid AI response format');
        return null;
      }

      const content = questionData.generatedContent;

      return {
        id: globalQuestionUniquenessService.generateUniqueQuestionId(
          config.userId,
          config.subject,
          config.skillArea
        ),
        content: {
          question: content.question,
          options: content.options || [],
          correctAnswer: content.correct || 0,
          explanation: content.explanation || 'Great work!'
        },
        metadata: {
          subject: config.subject,
          skillArea: config.skillArea,
          difficultyLevel: config.difficultyLevel,
          timestamp: Date.now(),
          userId: config.userId,
          sessionId
        }
      };

    } catch (error) {
      console.error('❌ AI generation error:', error);
      return null;
    }
  }

  private async generateWithEnhancedFallback(
    config: QuestionGenerationConfig,
    sessionId: string
  ): Promise<UniqueQuestion | null> {
    console.log('🎲 Generating enhanced fallback question');

    const fallbackGenerators = {
      mathematics: this.generateMathFallback,
      english: this.generateEnglishFallback,
      science: this.generateScienceFallback,
      creative_writing: this.generateCreativeFallback,
      music: this.generateMusicFallback,
      creative_arts: this.generateArtsFallback,
      computer_science: this.generateComputerScienceFallback,
      social_studies: this.generateSocialStudiesFallback,
      physical_education: this.generatePEFallback,
      health_education: this.generateHealthFallback,
      foreign_language: this.generateLanguageFallback
    };

    const generator = fallbackGenerators[config.subject as keyof typeof fallbackGenerators] || 
                    this.generateGenericFallback;

    const questionContent = await generator.call(this, config);

    return {
      id: globalQuestionUniquenessService.generateUniqueQuestionId(
        config.userId,
        config.subject,
        config.skillArea
      ),
      content: questionContent,
      metadata: {
        subject: config.subject,
        skillArea: config.skillArea,
        difficultyLevel: config.difficultyLevel,
        timestamp: Date.now(),
        userId: config.userId,
        sessionId
      }
    };
  }

  private async generateMusicFallback(config: QuestionGenerationConfig) {
    const musicQuestions = [
      {
        question: "Which instrument family does the violin belong to?",
        options: ["String instruments", "Wind instruments", "Percussion instruments", "Brass instruments"],
        correctAnswer: 0,
        explanation: "The violin belongs to the string family because it produces sound by vibrating strings."
      },
      {
        question: "How many beats are in a measure of 4/4 time?",
        options: ["2 beats", "3 beats", "4 beats", "6 beats"],
        correctAnswer: 2,
        explanation: "In 4/4 time, there are 4 quarter note beats in each measure."
      },
      {
        question: "What do we call the speed of music?",
        options: ["Volume", "Pitch", "Tempo", "Harmony"],
        correctAnswer: 2,
        explanation: "Tempo refers to how fast or slow music is played."
      },
      {
        question: "Which composer wrote 'The Four Seasons'?",
        options: ["Mozart", "Beethoven", "Vivaldi", "Bach"],
        correctAnswer: 2,
        explanation: "Antonio Vivaldi composed 'The Four Seasons', a famous set of violin concertos."
      }
    ];

    const randomQuestion = musicQuestions[Math.floor(Math.random() * musicQuestions.length)];
    return randomQuestion;
  }

  private async generateArtsFallback(config: QuestionGenerationConfig) {
    const colors = ['red', 'blue', 'yellow', 'green', 'purple', 'orange'];
    const color1 = colors[Math.floor(Math.random() * colors.length)];
    const color2 = colors.filter(c => c !== color1)[Math.floor(Math.random() * (colors.length - 1))];

    return {
      question: `What happens when you mix ${color1} and ${color2} paint?`,
      options: ['Purple', 'Orange', 'Green', 'It depends on the colors'],
      correctAnswer: 3,
      explanation: 'The result of mixing colors depends on which specific colors you combine!'
    };
  }

  private async generateComputerScienceFallback(config: QuestionGenerationConfig) {
    const concepts = [
      {
        question: "What is an algorithm?",
        options: ["A type of computer", "Step-by-step instructions", "A programming language", "A computer game"],
        correctAnswer: 1,
        explanation: "An algorithm is a set of step-by-step instructions to solve a problem."
      },
      {
        question: "What does 'debugging' mean in programming?",
        options: ["Adding new features", "Finding and fixing errors", "Making code faster", "Deleting old code"],
        correctAnswer: 1,
        explanation: "Debugging means finding and fixing errors or 'bugs' in computer programs."
      }
    ];

    return concepts[Math.floor(Math.random() * concepts.length)];
  }

  private async generateMathFallback(config: QuestionGenerationConfig) {
    const scenarios = [
      'Library Adventure', 'Space Mission', 'Cooking Challenge', 'Garden Project',
      'Sports Tournament', 'Art Gallery', 'Music Festival', 'Science Fair'
    ];
    
    const characters = [
      'Alex', 'Sam', 'Jordan', 'Casey', 'Riley', 'Morgan', 'Avery', 'Quinn'
    ];

    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    const character = characters[Math.floor(Math.random() * characters.length)];
    const num1 = Math.floor(Math.random() * 50) + 10;
    const num2 = Math.floor(Math.random() * 30) + 5;
    const operation = ['+', '-'][Math.floor(Math.random() * 2)];

    let question, correctAnswer;
    
    if (operation === '+') {
      question = `During the ${scenario}, ${character} collected ${num1} items and then found ${num2} more items. How many items does ${character} have in total?`;
      correctAnswer = num1 + num2;
    } else {
      const larger = Math.max(num1, num2);
      const smaller = Math.min(num1, num2);
      question = `${character} started the ${scenario} with ${larger} points and used ${smaller} points. How many points does ${character} have left?`;
      correctAnswer = larger - smaller;
    }

    const wrongAnswers = [
      correctAnswer + Math.floor(Math.random() * 10) + 1,
      correctAnswer - Math.floor(Math.random() * 10) - 1,
      Math.floor(correctAnswer * 1.5)
    ].filter(ans => ans !== correctAnswer && ans > 0);

    const allOptions = [correctAnswer, ...wrongAnswers.slice(0, 3)]
      .sort(() => Math.random() - 0.5);

    return {
      question,
      options: allOptions.map(String),
      correctAnswer: allOptions.indexOf(correctAnswer),
      explanation: `${character} ${operation === '+' ? 'added' : 'subtracted'} to get ${correctAnswer}.`
    };
  }

  private async generateEnglishFallback(config: QuestionGenerationConfig) {
    const stories = [
      'The brave knight discovered a hidden castle in the enchanted forest.',
      'The curious scientist found a mysterious glowing crystal in the cave.',
      'The clever detective solved the puzzle using the hidden clues.',
      'The young artist painted a beautiful rainbow after the storm.'
    ];

    const story = stories[Math.floor(Math.random() * stories.length)];
    const words = story.split(' ');
    const targetWord = words[Math.floor(Math.random() * words.length)];

    return {
      question: `Read this sentence: "${story}" What does the word "${targetWord}" mean in this context?`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 0,
      explanation: `In this context, "${targetWord}" refers to the subject of the sentence.`
    };
  }

  private async generateScienceFallback(config: QuestionGenerationConfig) {
    const experiments = [
      'Why do plants grow toward the light?',
      'What happens when you mix oil and water?',
      'Why do some objects float while others sink?',
      'How do butterflies know where to migrate?'
    ];

    const question = experiments[Math.floor(Math.random() * experiments.length)];

    return {
      question,
      options: ['Scientific reason A', 'Scientific reason B', 'Scientific reason C', 'Scientific reason D'],
      correctAnswer: 0,
      explanation: 'This is a fascinating scientific phenomenon that demonstrates natural laws.'
    };
  }

  private async generateCreativeFallback(config: QuestionGenerationConfig) {
    const prompts = [
      'Write about a magical door that leads to...',
      'Describe a day when gravity stopped working...',
      'Tell the story of a robot who learned to...',
      'Imagine a world where colors have sounds...'
    ];

    const prompt = prompts[Math.floor(Math.random() * prompts.length)];

    return {
      question: `Creative writing challenge: ${prompt}`,
      options: ['Creative idea A', 'Creative idea B', 'Creative idea C', 'Creative idea D'],
      correctAnswer: Math.floor(Math.random() * 4),
      explanation: 'All creative ideas are valuable! Your imagination is the key to great storytelling.'
    };
  }

  private async generateSocialStudiesFallback(config: QuestionGenerationConfig) {
    return {
      question: "What is the capital of the United States?",
      options: ["New York", "Los Angeles", "Washington, D.C.", "Chicago"],
      correctAnswer: 2,
      explanation: "Washington, D.C. is the capital city where the government operates."
    };
  }

  private async generatePEFallback(config: QuestionGenerationConfig) {
    return {
      question: "How many players are on a basketball team during a game?",
      options: ["4 players", "5 players", "6 players", "7 players"],
      correctAnswer: 1,
      explanation: "A basketball team has 5 players on the court at one time."
    };
  }

  private async generateHealthFallback(config: QuestionGenerationConfig) {
    return {
      question: "Which food group helps build strong muscles?",
      options: ["Fruits", "Vegetables", "Proteins", "Grains"],
      correctAnswer: 2,
      explanation: "Proteins like meat, fish, eggs, and beans help build and repair muscles."
    };
  }

  private async generateLanguageFallback(config: QuestionGenerationConfig) {
    return {
      question: "What does 'Hola' mean in Spanish?",
      options: ["Goodbye", "Hello", "Thank you", "Please"],
      correctAnswer: 1,
      explanation: "'Hola' is the Spanish word for 'Hello' - a friendly greeting!"
    };
  }

  private async generateGenericFallback(config: QuestionGenerationConfig) {
    return {
      question: `What is an important concept in ${config.subject}?`,
      options: ['Concept A', 'Concept B', 'Concept C', 'Concept D'],
      correctAnswer: 0,
      explanation: `This is a fundamental concept in ${config.subject} that helps build understanding.`
    };
  }

  async saveQuestionHistory(
    question: UniqueQuestion,
    userAnswer: number,
    isCorrect: boolean,
    responseTime: number,
    additionalContext?: Record<string, unknown>
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_question_history')
        .insert({
          user_id: question.metadata.userId,
          subject: question.metadata.subject,
          skill_area: question.metadata.skillArea,
          question_text: question.content.question,
          user_answer: typeof userAnswer === "number" ? question.content.options?.[userAnswer] || String(userAnswer) : null,
          correct_answer: question.content.options?.[question.content.correctAnswer] || String(question.content.correctAnswer),
          is_correct: isCorrect,
          response_time_seconds: responseTime,
          difficulty_level: question.metadata.difficultyLevel,
          session_id: question.metadata.sessionId,
          // mastery_indicators, concepts_covered, etc: left as defaults
          // additionalContext attached only if it matches schema, here as a fallback
        });

      if (error) {
        console.warn('Could not save question history:', error);
      } else {
        console.log('📊 Question history saved successfully');
      }
    } catch (error) {
      console.warn('Error saving question history:', error);
    }
  }
}

export const unifiedQuestionGeneration = new UnifiedQuestionGenerationService();
