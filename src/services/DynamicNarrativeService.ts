

// Predefined themes and fallback contexts (similar to what was in DailyUniverseGenerator)
// These will be used if AI generation fails or is not preferred.
const FALLBACK_THEMES = [
  {
    name: 'Galactic Research Mission',
    contexts: {
      default: "As part of our mission, let's investigate {objectiveTitle}.",
      Mathematics: "The ship's navigation system requires precise calculations for {objectiveTitle}.",
      Science: "Our sensors have detected an anomaly! We need to analyze data regarding {objectiveTitle}.",
      English: "We've intercepted a coded message. Let's decipher its meaning concerning {objectiveTitle}.",
      History: "Ancient alien ruins on this planet might hold clues about {objectiveTitle}. Let's research."
    },
    intro: "Welcome, Space Cadet! Today's Galactic Research Mission takes us to the Kepler-186f system. Prepare for exciting discoveries!",
    outro: "Mission accomplished, Cadet! Your findings have been invaluable. See you tomorrow for a new adventure!"
  },
  {
    name: 'Time Detective Agency',
    contexts: {
      default: "As a Time Detective, your next clue involves understanding {objectiveTitle}.",
      Mathematics: "The ancient calendar is off! We need to use our math skills with {objectiveTitle} to fix it.",
      Science: "The historical artifact is reacting strangely. Let's use our knowledge of {objectiveTitle} to understand why.",
      Language: "This old diary entry about {objectiveTitle} could crack the case!",
      History: "To solve the mystery of the missing crown, we must first learn about {objectiveTitle} from this era."
    },
    intro: "Greetings, Detective! A new temporal anomaly has occurred. Your mission, should you choose to accept it, is to unravel the clues across time!",
    outro: "Case closed, Detective! Your sharp mind has once again saved history. Until the next anomaly!"
  }
  // Add more themes like 'Guardian of the Living Forest', 'Young Inventor's Workshop'
];


import { DifficultyLevel } from './AdaptiveDifficultyEngine'; // Import DifficultyLevel
import { openaiContentService } from './openaiContentService';

export interface LearningObjectiveInput {
  objectiveId: string;
  objectiveTitle: string;
  subject: string;
  estimatedMinutes?: number;
  difficulty: DifficultyLevel; // Added difficulty
}

export interface DynamicNarrativeComponents {
  storylineIntro: string;
  storylineOutro: string;
  atomContexts: Array<{ // Array to maintain order from LLM if it implies sequence
    objectiveId: string;
    narrativeContext: string;
  }>;
  error?: string;
  fallbackUsed?: boolean;
}

interface AIResponseFormat {
  storylineIntro: string;
  atomContexts: Array<{
    objectiveId: string;
    narrativeContext: string;
  }>;
  storylineOutro: string;
}


class DynamicNarrativeService {
  private formatObjectivesForPrompt(objectives: LearningObjectiveInput[]): string {
    return objectives.map((obj, index) =>
      `${index + 1}. ID: "${obj.objectiveId}", Title: "${obj.objectiveTitle}", Subject: "${obj.subject}", Difficulty: "${obj.difficulty}"${obj.estimatedMinutes ? `, Duration: ${obj.estimatedMinutes} mins` : ''}`
    ).join('\n');
  }

  private generateFallbackNarrative(
    themeName: string,
    objectives: LearningObjectiveInput[] // objectives now include difficulty
  ): DynamicNarrativeComponents {
    const theme = FALLBACK_THEMES.find(t => t.name === themeName) || FALLBACK_THEMES[0];

    const atomContexts = objectives.map(obj => {
      // Fallback contexts don't currently adapt to difficulty, but they could be structured differently if needed.
      // For now, the narrative context will be generic, but the atom itself will have a difficulty property.
      const contextTemplate = theme.contexts[obj.subject as keyof typeof theme.contexts] || theme.contexts.default;
      return {
        objectiveId: obj.objectiveId,
        // Example: "The ship's navigation (easy) requires calculations for..."
        // For simplicity, fallback narrative won't explicitly mention difficulty in text, but the atom will have it.
        narrativeContext: contextTemplate.replace("{objectiveTitle}", `${obj.objectiveTitle}`)
      };
    });

    return {
      storylineIntro: theme.intro,
      storylineOutro: theme.outro,
      atomContexts,
      fallbackUsed: true,
    };
  }

  public async generateNarrative(
    themeName: string,
    studentAge: number, // or gradeLevel
    learningObjectives: LearningObjectiveInput[],
    _desiredAtomCount: number
  ): Promise<DynamicNarrativeComponents> {
    console.log(`[DynamicNarrativeService] Generating narrative for theme: ${themeName}, age: ${studentAge}, objectives: ${learningObjectives.length}`);

    const _gradeLevel = Math.max(1, studentAge - 5); // Example conversion
    const _formattedObjectives = this.formatObjectivesForPrompt(learningObjectives);


    try {
      // Use the correct method from openaiContentService
      const rawResponse = await openaiContentService.getOrGenerateContent(
        'narrative', 
        'story_generation', 
        1, 
        'system'
      );
      
      console.log("[DynamicNarrativeService] Raw AI Response:", rawResponse);

      // Attempt to parse the response as JSON
      // The AI might sometimes include ```json ... ``` or other text around the JSON.
      let jsonResponseString = typeof rawResponse === 'string' ? rawResponse : JSON.stringify(rawResponse);
      const jsonMatch = jsonResponseString.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        jsonResponseString = jsonMatch[1];
      } else {
        // Attempt to find the first '{' and last '}' if no markdown block
        const firstBrace = jsonResponseString.indexOf('{');
        const lastBrace = jsonResponseString.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          jsonResponseString = jsonResponseString.substring(firstBrace, lastBrace + 1);
        }
      }

      const parsedResponse = JSON.parse(jsonResponseString) as AIResponseFormat;

      // Basic validation of the parsed response
      if (
        !parsedResponse.storylineIntro ||
        !parsedResponse.storylineOutro ||
        !parsedResponse.atomContexts ||
        !Array.isArray(parsedResponse.atomContexts) ||
        parsedResponse.atomContexts.length !== learningObjectives.length || // Ensure context for every objective
        !parsedResponse.atomContexts.every(atom => atom.objectiveId && atom.narrativeContext)
      ) {
        console.error("[DynamicNarrativeService] AI response validation failed. Structure is incorrect or missing data.", parsedResponse);
        throw new Error("AI response validation failed.");
      }

      console.log("[DynamicNarrativeService] Successfully parsed and validated AI response.");
      return {
        storylineIntro: parsedResponse.storylineIntro,
        storylineOutro: parsedResponse.storylineOutro,
        atomContexts: parsedResponse.atomContexts,
        fallbackUsed: false,
      };

    } catch (error) {
      console.error("[DynamicNarrativeService] Error generating narrative with AI:", error);
      console.log("[DynamicNarrativeService] Using fallback narrative generation.");
      return this.generateFallbackNarrative(themeName, learningObjectives);
    }
  }
}

export default new DynamicNarrativeService();
