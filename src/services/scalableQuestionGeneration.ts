import { supabase } from '@/integrations/supabase/client';
import { globalQuestionUniquenessService, UniqueQuestion } from './globalQuestionUniquenessService';

export interface ScalableGenerationConfig {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  userId: string;
  gradeLevel?: number;
  studentName?: string;
  personalizedContext?: Record<string, any>;
  maxRetries?: number;
  cacheEnabled?: boolean;
}

export interface GenerationResult {
  question: UniqueQuestion;
  source: 'ai' | 'cache' | 'fallback';
  generationTime: number;
  attempts: number;
}

class ScalableQuestionGenerationService {
  private questionCache = new Map<string, UniqueQuestion[]>();
  private rateLimitTracker = new Map<string, { count: number; resetTime: number }>();
  private readonly MAX_REQUESTS_PER_MINUTE = 100; // Rate limiting for API calls
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

  /**
   * Generate questions with intelligent caching and rate limiting for scalability
   */
  async generateScalableQuestion(config: ScalableGenerationConfig): Promise<GenerationResult> {
    const startTime = Date.now();
    const cacheKey = this.getCacheKey(config);
    
    console.log(`🚀 Scalable generation for ${config.userId} - ${config.subject}:${config.skillArea}`);

    // 1. Try cache first for performance at scale
    if (config.cacheEnabled !== false) {
      const cachedQuestion = this.getCachedQuestion(cacheKey, config.userId);
      if (cachedQuestion) {
        return {
          question: cachedQuestion,
          source: 'cache',
          generationTime: Date.now() - startTime,
          attempts: 0
        };
      }
    }

    // 2. Check rate limits to prevent API overload
    if (!this.checkRateLimit(config.userId)) {
      console.log('⚠️ Rate limit exceeded, using fallback generation');
      return this.generateFallbackQuestion(config, startTime);
    }

    // 3. Try AI generation with retry logic
    const maxRetries = config.maxRetries || 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const aiQuestion = await this.generateWithAI(config, attempt);
        if (aiQuestion) {
          // Cache successful generation
          this.cacheQuestion(cacheKey, aiQuestion);
          
          return {
            question: aiQuestion,
            source: 'ai',
            generationTime: Date.now() - startTime,
            attempts: attempt
          };
        }
      } catch (error) {
        console.warn(`❌ AI generation attempt ${attempt} failed:`, error);
        
        // If we're approaching rate limits or on final attempt, use fallback
        if (attempt === maxRetries || !this.checkRateLimit(config.userId)) {
          break;
        }
      }
    }

    // 4. Fallback to guaranteed generation
    return this.generateFallbackQuestion(config, startTime);
  }

  /**
   * Generate question using AI with enhanced prompts for personalization
   */
  private async generateWithAI(config: ScalableGenerationConfig, attempt: number): Promise<UniqueQuestion | null> {
    this.trackRateLimit(config.userId);

    // Get previous questions to avoid duplicates
    const previousQuestions = globalQuestionUniquenessService.getUserQuestionHistory(
      config.userId,
      config.subject,
      10 // Last 10 questions for context
    );

    const response = await supabase.functions.invoke('generate-adaptive-content', {
      body: {
        subject: config.subject,
        skillArea: config.skillArea,
        difficultyLevel: config.difficultyLevel,
        userId: config.userId,
        gradeLevel: config.gradeLevel,
        previousQuestions,
        personalizedContext: {
          ...config.personalizedContext,
          studentName: config.studentName,
          attempt,
          scalableGeneration: true,
          requiresUniqueness: true
        },
        scalingMode: true,
        sessionId: `scalable_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
      }
    });

    if (response.error || !response.data?.generatedContent) {
      throw new Error('AI generation failed');
    }

    const content = response.data.generatedContent;
    
    const question: UniqueQuestion = {
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
        source: 'ai',
        attempt
      }
    };

    // Track for uniqueness
    await globalQuestionUniquenessService.trackQuestionUsage(question);
    
    return question;
  }

  /**
   * Generate reliable fallback question when AI is unavailable
   */
  private async generateFallbackQuestion(config: ScalableGenerationConfig, startTime: number): Promise<GenerationResult> {
    const fallbackGenerators = {
      mathematics: this.generateMathFallback,
      science: this.generateScienceFallback,
      english: this.generateEnglishFallback,
      'social-studies': this.generateSocialStudiesFallback
    };

    const generator = fallbackGenerators[config.subject as keyof typeof fallbackGenerators] || 
                    this.generateGenericFallback;

    const questionContent = await generator.call(this, config);
    
    const question: UniqueQuestion = {
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
        source: 'fallback'
      }
    };

    return {
      question,
      source: 'fallback',
      generationTime: Date.now() - startTime,
      attempts: 0
    };
  }

  // Fallback generators with enhanced variety
  private async generateMathFallback(config: ScalableGenerationConfig) {
    const scenarios = [
      'Space Mission Calculation', 'Cooking Recipe Math', 'Sports Statistics', 'Art Gallery Problem',
      'Music Beat Counting', 'Garden Planning', 'Shopping Budget', 'Travel Distance'
    ];
    
    const names = ['Alex', 'Sam', 'Jordan', 'Casey', 'Riley', 'Morgan', 'Taylor', 'Quinn'];
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    const name = config.studentName || names[Math.floor(Math.random() * names.length)];
    
    // Scale numbers based on difficulty
    const baseNum = 10 * config.difficultyLevel;
    const num1 = Math.floor(Math.random() * baseNum) + baseNum;
    const num2 = Math.floor(Math.random() * baseNum) + 5;
    
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let question: string;
    let correctAnswer: number;
    
    switch (operation) {
      case '+':
        question = `During the ${scenario}, ${name} collected ${num1} items and found ${num2} more. How many items does ${name} have in total?`;
        correctAnswer = num1 + num2;
        break;
      case '-':
        const larger = Math.max(num1, num2);
        const smaller = Math.min(num1, num2);
        question = `${name} started the ${scenario} with ${larger} points and used ${smaller} points. How many points are left?`;
        correctAnswer = larger - smaller;
        break;
      case '*':
        const factor1 = Math.min(num1, 12);
        const factor2 = Math.min(num2, 12);
        question = `For the ${scenario}, ${name} needs ${factor1} groups with ${factor2} items each. What's the total?`;
        correctAnswer = factor1 * factor2;
        break;
      default:
        question = `${name} has ${num1} items for the ${scenario}. How many is that?`;
        correctAnswer = num1;
    }

    const wrongAnswers = [
      correctAnswer + Math.floor(Math.random() * 5) + 1,
      Math.max(1, correctAnswer - Math.floor(Math.random() * 5) - 1),
      Math.floor(correctAnswer * 1.2) + 1
    ].filter(ans => ans !== correctAnswer && ans > 0);

    const allOptions = [correctAnswer, ...wrongAnswers.slice(0, 3)]
      .sort(() => Math.random() - 0.5);

    return {
      question,
      options: allOptions.map(String),
      correctAnswer: allOptions.indexOf(correctAnswer),
      explanation: `${name} calculated ${num1} ${operation} ${num2} = ${correctAnswer}.`
    };
  }

  private async generateScienceFallback(config: ScalableGenerationConfig) {
    const topics = [
      'Why do plants need sunlight to grow?',
      'What happens when water freezes?',
      'How do magnets work?',
      'Why do objects fall down?',
      'What makes the sky blue?',
      'How do birds fly?'
    ];

    const question = topics[Math.floor(Math.random() * topics.length)];
    const options = ['Scientific process A', 'Scientific process B', 'Scientific process C', 'Scientific process D'];

    return {
      question,
      options,
      correctAnswer: 0,
      explanation: 'This demonstrates an important scientific principle!'
    };
  }

  private async generateEnglishFallback(config: ScalableGenerationConfig) {
    const sentences = [
      'The curious scientist discovered a glowing crystal.',
      'The brave explorer found a hidden treasure.',
      'The clever student solved the difficult puzzle.',
      'The kind teacher helped every student succeed.'
    ];

    const sentence = sentences[Math.floor(Math.random() * sentences.length)];
    const words = sentence.split(' ');
    const targetWord = words[Math.floor(Math.random() * words.length)];

    return {
      question: `In the sentence "${sentence}", what type of word is "${targetWord}"?`,
      options: ['Noun', 'Verb', 'Adjective', 'Adverb'],
      correctAnswer: 0,
      explanation: `"${targetWord}" is an important part of this sentence structure.`
    };
  }

  private async generateSocialStudiesFallback(config: ScalableGenerationConfig) {
    const topics = [
      'What is democracy?',
      'Why do communities need rules?',
      'How do people trade goods?',
      'What makes a good citizen?'
    ];

    const question = topics[Math.floor(Math.random() * topics.length)];
    
    return {
      question,
      options: ['Community concept A', 'Community concept B', 'Community concept C', 'Community concept D'],
      correctAnswer: 0,
      explanation: 'This is an important concept for understanding how societies work.'
    };
  }

  private async generateGenericFallback(config: ScalableGenerationConfig) {
    return {
      question: `What is an important skill in ${config.subject}?`,
      options: ['Skill A', 'Skill B', 'Skill C', 'Skill D'],
      correctAnswer: 0,
      explanation: `This skill helps build understanding in ${config.subject}.`
    };
  }

  // Caching and rate limiting utilities
  private getCacheKey(config: ScalableGenerationConfig): string {
    return `${config.subject}_${config.skillArea}_${config.difficultyLevel}_${config.gradeLevel || 'default'}`;
  }

  private getCachedQuestion(cacheKey: string, userId: string): UniqueQuestion | null {
    const cached = this.questionCache.get(cacheKey);
    if (!cached || cached.length === 0) return null;

    // Get previously used questions for this user
    const usedQuestions = globalQuestionUniquenessService.getUserQuestionHistory(userId, '', 50);
    const unusedQuestions = cached.filter(q => !usedQuestions.includes(q.content.question));
    
    if (unusedQuestions.length > 0) {
      return unusedQuestions[Math.floor(Math.random() * unusedQuestions.length)];
    }

    return null;
  }

  private cacheQuestion(cacheKey: string, question: UniqueQuestion): void {
    if (!this.questionCache.has(cacheKey)) {
      this.questionCache.set(cacheKey, []);
    }
    
    const cached = this.questionCache.get(cacheKey)!;
    cached.push(question);
    
    // Keep cache size manageable
    if (cached.length > 20) {
      cached.shift();
    }

    // Set cache expiration
    setTimeout(() => {
      this.questionCache.delete(cacheKey);
    }, this.CACHE_DURATION);
  }

  private checkRateLimit(userId: string): boolean {
    const now = Date.now();
    const userLimit = this.rateLimitTracker.get(userId);
    
    if (!userLimit || now > userLimit.resetTime) {
      this.rateLimitTracker.set(userId, {
        count: 0,
        resetTime: now + 60000 // Reset every minute
      });
      return true;
    }
    
    return userLimit.count < this.MAX_REQUESTS_PER_MINUTE;
  }

  private trackRateLimit(userId: string): void {
    const userLimit = this.rateLimitTracker.get(userId);
    if (userLimit) {
      userLimit.count++;
    }
  }

  /**
   * Get generation statistics for monitoring system performance
   */
  getSystemStats() {
    return {
      cachedQuestions: this.questionCache.size,
      activeUsers: this.rateLimitTracker.size,
      cacheHitRate: this.calculateCacheHitRate(),
      systemLoad: this.calculateSystemLoad()
    };
  }

  private calculateCacheHitRate(): number {
    // Implementation for cache hit rate calculation
    return 0.75; // Placeholder
  }

  private calculateSystemLoad(): number {
    // Implementation for system load calculation
    return this.rateLimitTracker.size / 500; // Percentage of max capacity
  }
}

export const scalableQuestionGeneration = new ScalableQuestionGenerationService();
