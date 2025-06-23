        nelie-foundational-principles
import {
    LessonActivity,
    LessonActivityContent,
    InteractiveGameContent,
    ContentDeliveryContent,
    ApplicationContent,
    IntroductionContent,
    CreativeExplorationContent,
    SummaryContent,
    ActivityType // Added to use for type safety
} from '@/components/education/components/types/LessonTypes';
import { LessonActivity } from '@/components/education/components/types/LessonTypes';
        main
import { StudentProgressData } from './types';

// --- Conceptual AI Service ---
interface DynamicContentRequest {
  subject: string;
  focusArea: string;
  activityType: ActivityType; // Updated to use imported ActivityType
  difficulty: number;
  gradeLevel: number;
  promptDetails?: Record<string, any>;
}

interface DynamicContentResponse {
  title?: string;
  content: LessonActivityContent;
}

const aiContentService = {
  generateDynamicActivityContent: async (request: DynamicContentRequest): Promise<DynamicContentResponse | null> => {
    console.log(`[AI Service Request] Generating content for ${request.subject} - ${request.focusArea} (${request.activityType}) with persona: ${request.promptDetails?.persona}`);
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate AI processing

    // Example AI responses for new types (and existing ones for completeness)
    if (request.activityType === 'introduction' && request.subject.toLowerCase() === 'mathematics') {
        return {
            title: `Let's Explore ${request.focusArea}!`,
            content: {
                hook: `AI: Ever wondered how ${request.focusArea} shapes our world? It's like a secret code!`,
                realWorldExample: `AI: Think about when you share cookies (division) or build with blocks (geometry)! That's ${request.focusArea} in action.`,
                learningObjectives: [`Understand basic ${request.focusArea}`, `Apply ${request.focusArea} to simple problems`],
            } as IntroductionContent,
        };
    }
    if (request.activityType === 'creative-exploration' && request.subject.toLowerCase() === 'art') {
        return {
            title: `Unleash Your Inner ${request.focusArea} Artist!`,
            content: {
                creativePrompt: `AI: Imagine you are a tiny explorer in a giant's garden. Using what we learned about ${request.focusArea}, draw or write a story about three amazing things you discover!`,
                guidelines: ["Use bright colors!", "Think about different textures.", "Let your imagination soar!"],
                submissionType: "image-drawing"
            } as CreativeExplorationContent,
        };
    }
    if (request.activityType === 'summary' && request.subject.toLowerCase() === 'science') {
        return {
            title: `Wrapping Up ${request.focusArea}`,
            content: {
                keyTakeaways: [`AI: ${request.focusArea} is all about understanding X.`, `AI: We learned how Y affects Z in ${request.focusArea}.`, `AI: Remember the importance of Q.`],
                nextStepsPreview: `AI: Next, we'll see how ${request.focusArea} connects to even bigger ideas!`,
                finalEncouragement: `AI: You did a great job exploring ${request.focusArea} today! Keep that curious mind buzzing!`,
            } as SummaryContent,
        };
    }
    if (request.activityType === 'interactive-game' && request.subject.toLowerCase() === 'science') {
        return {
            title: `The Amazing World of ${request.focusArea}`,
            content: {
                question: `AI Generated: What is the powerhouse of the cell in ${request.focusArea}?`,
                options: ["Mitochondria", "Nucleus", "Ribosome", "Chloroplast"],
                correctAnswerIndex: 0,
                explanation: "AI Explanation: Mitochondria are known as the powerhouses of the cell.",
                gameType: "multiple-choice-quiz",
            } as InteractiveGameContent,
        };
    }
    if (request.activityType === 'content-delivery' && request.subject.toLowerCase() === 'history') {
        return {
            title: `A Journey Through ${request.focusArea}`,
            content: {
                introductionText: `AI Generated: Welcome to an exciting exploration of ${request.focusArea}!`,
                mainExplanation: `AI Generated: ${request.focusArea} is a fascinating topic. Let's dive deep into its various aspects, understanding its significance and impact using vivid analogies.`,
                examples: [`AI Example: The Great Wall related to ${request.focusArea}`, `AI Example: The Pyramids and their connection to ${request.focusArea}`],
                segments: [
                    { title: "Key Event 1", explanation: `AI: Detailed explanation of key event 1 in ${request.focusArea}`, examples: ["Example A"] },
                    { title: "Key Figure", explanation: `AI: Detailed explanation of a key figure in ${request.focusArea}`, examples: ["Example B"] },
                ],
            } as ContentDeliveryContent,
        };
    }
    return null; // Default to null for other cases to test fallbacks
  },
};
// --- End Conceptual AI Service ---

const NELIE_PERSONA_PROMPT_DETAILS = {
  persona: "NELIE",
  tone: "Infinitely patient, endlessly creative, encouraging, supportive, curious, celebratory of effort.",
  style: "Frame mistakes as learning opportunities. Encourage 'why' and 'how' questions. Use clear, concise language, age-appropriate for K-12.",
  imagery: "For explanations, describe vivid mental images or analogies. Make learning an adventure!",
};

export class ActivityContentGenerator {
  static async generateActivityContent(
    subject: string,
    focusArea: string,
    activityType: ActivityType, // Updated to use imported ActivityType
    difficulty: number,
    gradeLevel: number
  ): Promise<DynamicContentResponse> {
    const baseRequest: DynamicContentRequest = {
      subject,
      focusArea,
      activityType,
      difficulty,
      gradeLevel,
    };

    let aiResponse: DynamicContentResponse | null = null;
    try {
      switch (activityType) {
        case 'introduction':
          aiResponse = await this.createIntroductionContent(subject, focusArea, difficulty, gradeLevel, baseRequest);
          break;
        case 'content-delivery':
          aiResponse = await this.createContentDeliveryContent(subject, focusArea, difficulty, gradeLevel, baseRequest);
          break;
        case 'interactive-game':
          aiResponse = await this.createInteractiveGameContent(subject, focusArea, difficulty, gradeLevel, baseRequest);
          break;
        case 'application':
          aiResponse = await this.createApplicationContent(subject, focusArea, difficulty, gradeLevel, baseRequest);
          break;
        case 'creative-exploration':
          aiResponse = await this.createCreativeExplorationContent(subject, focusArea, difficulty, gradeLevel, baseRequest);
          break;
        case 'summary':
          aiResponse = await this.createSummaryContent(subject, focusArea, difficulty, gradeLevel, baseRequest);
          break;
        default:
          console.warn(`Unknown activity type: ${activityType}. Using generic fallback.`);
          // Fallback for unknown type, though type system should prevent this.
          aiResponse = null;
      }
    } catch (error) {
      console.error(`Error calling AI content service for ${activityType}:`, error);
      aiResponse = null;
    }

    if (aiResponse) {
      return aiResponse;
    }

    console.warn(`AI service failed or returned null for ${activityType}. Using fallback content.`);
    let fallbackContent: LessonActivityContent;
    let fallbackTitle = `${focusArea.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Session`;

    switch (activityType) {
        case 'introduction':
          fallbackContent = this.createFallbackIntroductionContent(subject, focusArea, gradeLevel);
          fallbackTitle = `Welcome to ${focusArea.replace(/_/g, ' ')}`;
          break;
        case 'content-delivery':
          fallbackContent = this.createFallbackContentDeliveryContent(subject, focusArea, gradeLevel);
          break;
        case 'interactive-game':
          fallbackContent = this.createFallbackInteractiveGameContent(subject, focusArea, difficulty, gradeLevel);
          break;
        case 'application':
          fallbackContent = this.createFallbackApplicationContent(subject, focusArea, difficulty, gradeLevel);
          break;
        case 'creative-exploration':
          fallbackContent = this.createFallbackCreativeExplorationContent(subject, focusArea, gradeLevel);
          fallbackTitle = `Explore Your Creativity with ${focusArea.replace(/_/g, ' ')}`;
          break;
        case 'summary':
          fallbackContent = this.createFallbackSummaryContent(subject, focusArea, gradeLevel);
          fallbackTitle = `Reviewing ${focusArea.replace(/_/g, ' ')}`;
          break;
        default: // Should not be reached if activityType is validated, but as a safeguard:
          fallbackContent = { genericPlaceholder: `No content available for unknown type: ${activityType}` };
          break;
    }

    return { content: fallbackContent, title: fallbackTitle };
  }

  static async createCurriculumActivity(
    lessonId: string,
    index: number,
    subject: string,
    skillArea: string,
    focusArea: string,
    gradeLevel: number,
    studentProgress: StudentProgressData,
    activityType: ActivityType // Updated to use imported ActivityType
  ): Promise<LessonActivity> {
    const activityId = `${lessonId}-activity-${index}`;
    const difficulty = this.calculateDifficulty(studentProgress, gradeLevel);

    const generatedContentResponse = await this.generateActivityContent(
      subject,
      focusArea,
      activityType,
      difficulty,
      gradeLevel
    );

    return {
      id: activityId,
        nelie-foundational-principles
      title: generatedContentResponse.title || `${focusArea.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Activity`,
      type: activityType,
      phase: activityType, // Assuming type and phase are the same for all current types
      duration: 180,
      phaseDescription: `Engage with ${focusArea.replace(/_/g, ' ')}`,
      content: generatedContentResponse.content,
      title: `${focusArea.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Challenge`,
      type: this.mapActivityTypeToPhase(activityType),
      phase: this.mapActivityTypeToPhase(activityType),
      duration: 180,
      phaseDescription: `Learn about ${focusArea.replace(/_/g, ' ')}`,
      metadata: {
        subject,
        skillArea,
        gradeLevel,
        difficultyLevel: difficulty
      },
      content
        main
    };
  }

  // --- Specific Content Creation Methods (using AI Service) ---
  private static async createIntroductionContent(subject: string, focusArea: string, difficulty: number, gradeLevel: number, baseRequest: DynamicContentRequest): Promise<DynamicContentResponse | null> {
    const promptDetails = {
      ...NELIE_PERSONA_PROMPT_DETAILS,
      requestType: 'engaging-introduction',
      elements: ['hook', 'realWorldExample', 'learningObjectives'],
    };
    const request: DynamicContentRequest = { ...baseRequest, activityType: 'introduction', promptDetails };
    const aiResponse = await aiContentService.generateDynamicActivityContent(request);
    if (aiResponse?.content && 'hook' in aiResponse.content) return aiResponse;
    console.warn("AI response for introduction was not structured as expected.");
    return null;
  }

  private static async createContentDeliveryContent(subject: string, focusArea: string, difficulty: number, gradeLevel: number, baseRequest: DynamicContentRequest): Promise<DynamicContentResponse | null> {
    const promptDetails = {
      ...NELIE_PERSONA_PROMPT_DETAILS,
      requestType: 'engaging-explanation-with-imagery',
      numSegments: Math.max(2, Math.floor(difficulty / 2)),
      includeExamples: true,
      imageryEmphasis: "vivid mental images and analogies", // Specific instruction
    };
    const request: DynamicContentRequest = { ...baseRequest, activityType: 'content-delivery', promptDetails };
    const aiResponse = await aiContentService.generateDynamicActivityContent(request);
    if (aiResponse?.content && 'mainExplanation' in aiResponse.content) return aiResponse;
    console.warn("AI response for content delivery was not structured as expected.");
    return null;
  }

  private static async createInteractiveGameContent(subject: string, focusArea: string, difficulty: number, gradeLevel: number, baseRequest: DynamicContentRequest): Promise<DynamicContentResponse | null> {
    const promptDetails = {
      ...NELIE_PERSONA_PROMPT_DETAILS,
      requestType: 'varied-interactive-game',
      desiredMechanics: ['multiple-choice', 'true-false', 'fill-in-the-blank'],
      topicComplexity: difficulty,
    };
    const request: DynamicContentRequest = { ...baseRequest, activityType: 'interactive-game', promptDetails };
    const aiResponse = await aiContentService.generateDynamicActivityContent(request);
    if (aiResponse?.content && 'question' in aiResponse.content) return aiResponse;
    console.warn("AI response for game content was not structured as expected.");
     // Fallback to specialized math game if AI fails for math
    if (subject.toLowerCase() === 'mathematics') {
      return {
        content: this.createFallbackInteractiveGameContent(subject, focusArea, difficulty, gradeLevel, true),
        title: `${focusArea} Math Challenge (Fallback)`,
      };
    }
    return null;
  }

  private static async createApplicationContent(subject: string, focusArea: string, difficulty: number, gradeLevel: number, baseRequest: DynamicContentRequest): Promise<DynamicContentResponse | null> {
    const promptDetails = {
      ...NELIE_PERSONA_PROMPT_DETAILS,
      requestType: 'realistic-application-scenario',
      numHints: Math.max(1, 3 - Math.floor(difficulty / 3)),
    };
    const request: DynamicContentRequest = { ...baseRequest, activityType: 'application', promptDetails };
    const aiResponse = await aiContentService.generateDynamicActivityContent(request);
    if (aiResponse?.content && 'scenario' in aiResponse.content) return aiResponse;
    console.warn("AI response for application content was not structured as expected.");
    return null;
  }

  private static async createCreativeExplorationContent(subject: string, focusArea: string, difficulty: number, gradeLevel: number, baseRequest: DynamicContentRequest): Promise<DynamicContentResponse | null> {
    const promptDetails = {
      ...NELIE_PERSONA_PROMPT_DETAILS,
      requestType: 'open-ended-creative-prompt',
      freedomLevel: difficulty, // Higher difficulty might mean more open prompts
    };
    const request: DynamicContentRequest = { ...baseRequest, activityType: 'creative-exploration', promptDetails };
    const aiResponse = await aiContentService.generateDynamicActivityContent(request);
    if (aiResponse?.content && 'creativePrompt' in aiResponse.content) return aiResponse;
    console.warn("AI response for creative exploration was not structured as expected.");
    return null;
  }

  private static async createSummaryContent(subject: string, focusArea: string, difficulty: number, gradeLevel: number, baseRequest: DynamicContentRequest): Promise<DynamicContentResponse | null> {
    const promptDetails = {
      ...NELIE_PERSONA_PROMPT_DETAILS,
      requestType: 'concise-summary-and-lookahead',
      elements: ['keyTakeaways', 'nextStepsPreview', 'finalEncouragement'],
    };
    const request: DynamicContentRequest = { ...baseRequest, activityType: 'summary', promptDetails };
    const aiResponse = await aiContentService.generateDynamicActivityContent(request);
    if (aiResponse?.content && 'keyTakeaways' in aiResponse.content) return aiResponse;
    console.warn("AI response for summary was not structured as expected.");
    return null;
  }

  // --- Fallback Content Creation Methods ---
  private static createFallbackIntroductionContent(subject: string, focusArea: string, gradeLevel: number): IntroductionContent {
    return {
      hook: `Get ready to explore the amazing world of ${focusArea.replace(/_/g, ' ')}! It's more exciting than you think!`,
      realWorldExample: `Did you know ${focusArea.replace(/_/g, ' ')} is used all around us? For example, when [simple real-world example related to focus area, e.g., 'baking a cake' for fractions].`,
      learningObjectives: [
        `Understand the basics of ${focusArea.replace(/_/g, ' ')}.`,
        `See how ${focusArea.replace(/_/g, ' ')} applies to fun situations.`
      ],
    };
  }

  private static createFallbackInteractiveGameContent(subject: string, focusArea: string, difficulty: number, gradeLevel: number, isMathSpecialFallback: boolean = false): InteractiveGameContent {
    if (subject.toLowerCase() === 'mathematics' || isMathSpecialFallback) {
      const num1 = Math.floor(Math.random() * 20) + (difficulty * 5);
      const num2 = Math.floor(Math.random() * 10) + (difficulty * 2);
      const question = `Emma has ${num1} stickers and her friend gives her ${num2} more. How many stickers does Emma have now?`;
      const correctAnswer = num1 + num2;
      return {
        gameType: "multiple-choice-quiz",
        question,
        options: [correctAnswer.toString(), (correctAnswer + 5).toString(), (Math.max(0, correctAnswer - 3)).toString(), (correctAnswer + 10).toString()].sort(() => Math.random() - 0.5),
        correctAnswerIndex: -1, // This would need to be dynamically set if options are shuffled. For fixed, it's easier.
                                // Let's assume the correct answer is always the first one for simplicity in fallback, then shuffle.
                                // For a real fallback, you'd find the index after shuffling.
        explanation: `Emma started with ${num1} and got ${num2} more, so ${num1} + ${num2} = ${correctAnswer}. Keep up the great work!`,
      };
    }
    return {
      gameType: "generic-quiz",
      question: `Let's test your knowledge on ${focusArea.replace(/_/g, ' ')}! What is the main idea? (Difficulty: ${difficulty})`,
      options: ["Option Alpha", "Option Beta", "Option Gamma", "Option Delta"],
      correctAnswerIndex: 0,
      explanation: "This is a fallback game. The first option is usually a good guess! 😉 NELIE encourages you to always try your best!",
    };
  }

  private static createFallbackContentDeliveryContent(subject: string, focusArea: string, gradeLevel: number): ContentDeliveryContent {
    return {
      introductionText: `Hello! I'm NELIE, and I'm so excited to help you learn about ${focusArea.replace(/_/g, ' ')} today!`,
      mainExplanation: `Let's dive into ${focusArea.replace(/_/g, ' ')}! Think of it like [insert simple analogy here, e.g., 'building with LEGOs' for sentence structure]. It's all about understanding the pieces and how they fit together.`,
      examples: [`For example, a common part of ${focusArea} is...`, `Another way to see ${focusArea} in action is...`],
      segments: [{
        nelie-foundational-principles
        title: "First Big Idea",
        explanation: `One super important idea in ${focusArea.replace(/_/g, ' ')} is [concept 1]. It's like the foundation of a house!`,
        examples: [`Here's how [concept 1] works...`]
      },{
        title: "Another Cool Idea",
        explanation: `Next up is [concept 2] in ${focusArea.replace(/_/g, ' ')}. This builds on what we just learned and makes it even more interesting!`,
        examples: [`Let's look at [concept 2] with an example...`]
        title: focusArea.replace(/_/g, ' '),
        explanation: `Understanding ${focusArea.replace(/_/g, ' ')} is an important skill that builds your knowledge step by step.`,
        examples: [`Example for ${focusArea}`, `Another way to think about ${focusArea}`]
        main
      }]
    };
  }

  private static createFallbackApplicationContent(subject: string, focusArea: string, difficulty: number, gradeLevel: number): ApplicationContent {
    return {
      scenario: `Imagine you're a super problem-solver, and your mission, should you choose to accept it, involves ${focusArea.replace(/_/g, ' ')}!`,
      task: `Your challenge is to use your amazing ${focusArea.replace(/_/g, ' ')} skills to figure out [simple problem statement related to focus area]. What will you do?`,
      hints: [
        "Remember what we learned about [key aspect of focus area]?",
        "Think step-by-step, like a detective!",
        "You've got this! NELIE believes in you!"
      ],
      solutionSteps: [
        { step: 1, description: "First, let's remember what [key aspect of focus area] means." },
        { step: 2, description: "Next, how does that apply to this particular challenge?" },
        { step: 3, description: "Then, what's your brilliant solution or answer?" }
      ]
    };
  }

  private static createFallbackCreativeExplorationContent(subject: string, focusArea: string, gradeLevel: number): CreativeExplorationContent {
    return {
      creativePrompt: `Let your imagination run wild with ${focusArea.replace(/_/g, ' ')}! Can you draw a picture, write a short story, or even make up a song about [simple, fun theme related to focus area, e.g., 'what plants would look like on Mars' for biology]?`,
      guidelines: [
        "There are no wrong answers here, just your amazing ideas!",
        "Have fun and be creative!",
        "Think about what makes ${focusArea.replace(/_/g, ' ')} special."
      ],
      submissionType: "text-or-image"
    };
  }

  private static createFallbackSummaryContent(subject: string, focusArea: string, gradeLevel: number): SummaryContent {
    return {
      keyTakeaways: [
        `Wow, we learned so much about ${focusArea.replace(/_/g, ' ')}!`,
        `Remember that [key point 1 about focus area] is super important.`,
        `And don't forget how [key point 2 about focus area] works!`
      ],
      nextStepsPreview: `Guess what? Next time, we'll see how ${focusArea.replace(/_/g, ' ')} helps us understand even cooler things!`,
      finalEncouragement: `You did an absolutely fantastic job today exploring ${focusArea.replace(/_/g, ' ')}! NELIE is so proud of your effort. Keep learning and stay curious!`,
    };
  }

  private static calculateDifficulty(studentProgress: StudentProgressData, gradeLevel: number): number {
    let baseDifficulty = Math.min(gradeLevel, 5);
    baseDifficulty = Math.max(baseDifficulty, 1);
    if (studentProgress.overallAccuracy > 85 && studentProgress.lessonsCompleted > 3) {
      baseDifficulty = Math.min(baseDifficulty + 1, 10);
    } else if (studentProgress.overallAccuracy < 65 && studentProgress.lessonsCompleted > 3) {
      baseDifficulty = Math.max(baseDifficulty - 1, 1);
    }
    return baseDifficulty;
  }
}
