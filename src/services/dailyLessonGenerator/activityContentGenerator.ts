import {
    LessonActivity,
    LessonActivityContent,
    InteractiveGameContent,
    ContentDeliveryContent,
    ApplicationContent,
    IntroductionContent,
    CreativeExplorationContent,
    SummaryContent,
    ActivityType
} from '@/components/education/components/types/LessonTypes';
import { StudentProgressData } from './types';
import { supabase } from '@/integrations/supabase/client'; // Ensure Supabase client is imported

// --- Type Definitions (contract with Supabase function) ---
// These interfaces define the expected structure for requests to and responses from the Supabase Edge Function.
// It's crucial that these align with the types defined within the Edge Function itself.
interface DynamicContentRequest {
  subject: string;
  focusArea: string;
  activityType: ActivityType;
  difficulty: number;
  gradeLevel: number;
  promptDetails?: Record<string, any>;
}

interface DynamicContentResponse {
  title?: string;
  content: LessonActivityContent;
}
// --- End Type Definitions ---

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
    activityType: ActivityType,
    difficulty: number,
    gradeLevel: number
  ): Promise<DynamicContentResponse> {
    const baseRequest: DynamicContentRequest = {
      subject,
      focusArea,
      activityType,
      difficulty,
      gradeLevel,
      // NELIE_PERSONA_PROMPT_DETAILS are now added within each specific create method's promptDetails
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
          aiResponse = null;
      }
    } catch (error) {
      console.error(`Error calling Supabase function for ${activityType}:`, error);
      aiResponse = null;
    }

    if (aiResponse) {
      return aiResponse;
    }

    console.warn(`Supabase function call failed or returned null/invalid data for ${activityType}. Using fallback content.`);
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
        default:
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
    activityType: ActivityType
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
      title: generatedContentResponse.title || `${focusArea.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Activity`,
      type: activityType,
      phase: activityType,
      duration: 180,
      phaseDescription: `Engage with ${focusArea.replace(/_/g, ' ')}`,
      content: generatedContentResponse.content,
    };
  }

  // --- Specific Content Creation Methods (Now using Supabase) ---
  private static async invokeNelieContentFunction(request: DynamicContentRequest): Promise<DynamicContentResponse | null> {
    console.log(`Invoking Supabase function 'generate-nelie-activity-content' for type: ${request.activityType}`);
    const { data, error } = await supabase.functions.invoke(
      'generate-nelie-activity-content',
      { body: request }
    );

    if (error) {
      console.error(`Supabase function call failed for ${request.activityType}:`, error);
      return null;
    }
    // It's good practice to validate the structure of 'data' here
    // For example, check if data.content exists and has expected fields for the activityType
    if (data && data.content) {
      // Basic validation: ensure 'content' is an object. More specific checks could be added.
      if (typeof data.content !== 'object' || data.content === null) {
        console.warn(`Unexpected content structure (not an object or null) from Supabase function for ${request.activityType}:`, data);
        return null;
      }
      return data as DynamicContentResponse;
    } else {
      console.warn(`Unexpected response structure (no data or data.content missing) from Supabase function for ${request.activityType}:`, data);
      return null;
    }
  }

  private static async createIntroductionContent(subject: string, focusArea: string, difficulty: number, gradeLevel: number, baseRequest: DynamicContentRequest): Promise<DynamicContentResponse | null> {
    const promptDetails = {
      ...NELIE_PERSONA_PROMPT_DETAILS,
      requestType: 'engaging-introduction',
      elements: ['hook', 'realWorldExample', 'learningObjectives'],
    };
    const request: DynamicContentRequest = { ...baseRequest, activityType: 'introduction', promptDetails };
    return this.invokeNelieContentFunction(request);
  }

  private static async createContentDeliveryContent(subject: string, focusArea: string, difficulty: number, gradeLevel: number, baseRequest: DynamicContentRequest): Promise<DynamicContentResponse | null> {
    const promptDetails = {
      ...NELIE_PERSONA_PROMPT_DETAILS,
      requestType: 'engaging-explanation-with-imagery',
      numSegments: Math.max(2, Math.floor(difficulty / 2)),
      includeExamples: true,
      imageryEmphasis: "vivid mental images and analogies",
    };
    const request: DynamicContentRequest = { ...baseRequest, activityType: 'content-delivery', promptDetails };
    return this.invokeNelieContentFunction(request);
  }

  private static async createInteractiveGameContent(subject: string, focusArea: string, difficulty: number, gradeLevel: number, baseRequest: DynamicContentRequest): Promise<DynamicContentResponse | null> {
    const promptDetails = {
      ...NELIE_PERSONA_PROMPT_DETAILS,
      requestType: 'varied-interactive-game',
      desiredMechanics: ['multiple-choice', 'true-false', 'fill-in-the-blank'],
      topicComplexity: difficulty,
    };
    const request: DynamicContentRequest = { ...baseRequest, activityType: 'interactive-game', promptDetails };
    const aiResponse = await this.invokeNelieContentFunction(request);

    // Specific fallback for math if AI fails, otherwise generic fallback will be caught by generateActivityContent
    if (!aiResponse && subject.toLowerCase() === 'mathematics') {
        console.warn("Supabase call failed for Math game, using specific Math fallback.");
        return {
            content: this.createFallbackInteractiveGameContent(subject, focusArea, difficulty, gradeLevel, true),
            title: `${focusArea} Math Challenge (Fallback)`,
        };
    }
    return aiResponse;
  }

  private static async createApplicationContent(subject: string, focusArea: string, difficulty: number, gradeLevel: number, baseRequest: DynamicContentRequest): Promise<DynamicContentResponse | null> {
    const promptDetails = {
      ...NELIE_PERSONA_PROMPT_DETAILS,
      requestType: 'realistic-application-scenario',
      numHints: Math.max(1, 3 - Math.floor(difficulty / 3)),
    };
    const request: DynamicContentRequest = { ...baseRequest, activityType: 'application', promptDetails };
    return this.invokeNelieContentFunction(request);
  }

  private static async createCreativeExplorationContent(subject: string, focusArea: string, difficulty: number, gradeLevel: number, baseRequest: DynamicContentRequest): Promise<DynamicContentResponse | null> {
    const promptDetails = {
      ...NELIE_PERSONA_PROMPT_DETAILS,
      requestType: 'open-ended-creative-prompt',
      freedomLevel: difficulty,
    };
    const request: DynamicContentRequest = { ...baseRequest, activityType: 'creative-exploration', promptDetails };
    return this.invokeNelieContentFunction(request);
  }

  private static async createSummaryContent(subject: string, focusArea: string, difficulty: number, gradeLevel: number, baseRequest: DynamicContentRequest): Promise<DynamicContentResponse | null> {
    const promptDetails = {
      ...NELIE_PERSONA_PROMPT_DETAILS,
      requestType: 'concise-summary-and-lookahead',
      elements: ['keyTakeaways', 'nextStepsPreview', 'finalEncouragement'],
    };
    const request: DynamicContentRequest = { ...baseRequest, activityType: 'summary', promptDetails };
    return this.invokeNelieContentFunction(request);
  }

  // --- Fallback Content Creation Methods (Remain Unchanged) ---
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
      const options = [correctAnswer.toString(), (correctAnswer + 5).toString(), (Math.max(0, correctAnswer - 3)).toString(), (correctAnswer + 10).toString()].sort(() => Math.random() - 0.5);
      const correctIndex = options.findIndex(opt => opt === correctAnswer.toString());
      return {
        gameType: "multiple-choice-quiz",
        question,
        options,
        correctAnswerIndex: correctIndex,
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
        title: "First Big Idea",
        explanation: `One super important idea in ${focusArea.replace(/_/g, ' ')} is [concept 1]. It's like the foundation of a house!`,
        examples: [`Here's how [concept 1] works...`]
      },{
        title: "Another Cool Idea",
        explanation: `Next up is [concept 2] in ${focusArea.replace(/_/g, ' ')}. This builds on what we just learned and makes it even more interesting!`,
        examples: [`Let's look at [concept 2] with an example...`]
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
