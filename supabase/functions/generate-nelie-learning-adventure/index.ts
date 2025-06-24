import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
// Assuming types are in a relative path accessible from Supabase functions
// Adjust if your project structure places compiled types elsewhere or uses a different import mechanism for shared types.

// --- Type Imports ---
// It's often better to define types directly in the function or use a shared, compiled library
// if direct import from TS source is problematic in the Deno/Supabase environment.
// For this blueprint, we'll define them inline but acknowledge they should mirror those in:
// '../../../src/types/learningAdventureTypes.ts'
// '../../../src/components/education/components/types/LessonTypes.ts'

console.log('Supabase function `generate-nelie-learning-adventure` init');

// --- START INLINED TYPE DEFINITIONS (Mirroring learningAdventureTypes.ts & LessonTypes.ts) ---

type ActivityType =
  | 'introduction'
  | 'content-delivery'
  | 'interactive-game'
  | 'application'
  | 'creative-exploration'
  | 'summary'
  | 'quiz'
  | 'simulation'
  | 'adventure-game';

// Simplified LessonActivity for the purpose of EmbeddedActivityRequest
interface BasicLessonActivity {
  id: string;
  type: ActivityType;
  title: string;
  // ... other essential fields that might be pre-filled ...
  content?: any; // If some content can be pre-defined
}

interface EmbeddedActivityRequest {
  activityType: ActivityType;
  subject: string;
  skillArea: string;
  focusArea?: string;
  promptOverride?: string;
  activityImagePrompt?: string;
  difficulty?: number;
}

interface ChoiceOption {
  id: string;
  displayText: string;
  description?: string;
  choiceImagePrompt?: string;
  linkedStoryArcId: string;
}

interface InitialChoicePoint {
  narrativeLeadingToChoice?: string;
  prompt: string;
  options: ChoiceOption[];
}

interface Chapter {
  chapterId: string;
  chapterTitle: string;
  narrativeText: string;
  chapterImagePrompt?: string;
  embeddedActivities: Array<BasicLessonActivity | EmbeddedActivityRequest>;
}

interface StoryArc {
  storyArcId: string;
  arcTitle?: string;
  arcIntroductionNarrative?: string;
  chapters: Chapter[];
  arcConclusionNarrative?: string;
  arcConclusionImagePrompt?: string;
}

type AdventureDurationType = 'singleDay' | 'multiDay' | 'weekLong' | 'continuousArc';

interface LearningAdventure {
  adventureId: string;
  title: string;
  theme?: string;
  logline?: string;
  targetAudience?: {
    gradeLevelMin: number;
    gradeLevelMax: number;
  };
  targetDurationType: AdventureDurationType;
  estimatedTotalDays?: number;
  coverImagePrompt?: string;
  introductionNarrative: string;
  introductionImagePrompt?: string;
  learningObjectivesSummary?: string[];
  mainCharacters?: Array<{
    name: string;
    role: string;
    description?: string;
  }>;
  initialChoicePoint?: InitialChoicePoint;
  storyArcs: Record<string, StoryArc>;
  defaultStoryArcId: string;
  conclusionNarrative?: string;
  conclusionImagePrompt?: string;
  subjectsCovered?: string[];
  skillsDeveloped?: string[];
  tags?: string[];
}

interface AdventureGenerationRequest {
  targetAudience: { gradeLevelMin: number; gradeLevelMax: number };
  themePrompt: string;
  desiredDurationType: AdventureDurationType;
  studentInterests?: string[];
  mandatorySubjectsOrSkills?: string[];
}
// --- END INLINED TYPE DEFINITIONS ---


// --- Prompt Engineering Core ---
function craftLLMLearningAdventurePrompt(request: AdventureGenerationRequest): string {
  const { targetAudience, themePrompt, desiredDurationType, studentInterests, mandatorySubjectsOrSkills } = request;

  const personaInstructions = \`
    You are NELIE, an expert AI curriculum designer and storyteller for K-12 education.
    Your goal is to create highly engaging, narrative-driven Learning Adventures.
    The tone should be: Infinitely patient, endlessly creative, encouraging, supportive, curious, and celebratory of effort.
    The style should: Make learning an adventure. Frame challenges within the story. Use clear, age-appropriate language for grades \${targetAudience.gradeLevelMin}-\${targetAudience.gradeLevelMax}.
    Visuals: For every narrative segment (introduction, choices, chapters, conclusion) and key activities, provide a text prompt suitable for an AI image generator to create an illustrative image. These prompts should be descriptive and thematic (e.g., "A vibrant bustling medieval marketplace, children bartering goods, sunny day, cartoon style").
    Learning Integration: Seamlessly weave in opportunities for learning activities covering subjects like \${(mandatorySubjectsOrSkills || ['Mathematics', 'English']).join(', ')} and interests like \${(studentInterests || ['mystery', 'building things']).join(', ')}.
  \`;

  let durationSpecifics = "";
  if (desiredDurationType === 'singleDay') {
    durationSpecifics = "The adventure should be completable in a single school day, consisting of about 3-5 main chapters or stages."
  } else if (desiredDurationType === 'multiDay') {
    durationSpecifics = "The adventure should span 2-3 school days, with about 2-3 chapters per day."
  } else if (desiredDurationType === 'weekLong') {
    durationSpecifics = "The adventure is designed for a full school week (5 days), with distinct goals and 1-2 chapters per day."
  }


  const mainTask = \`
    Based on the theme "\${themePrompt}", generate a complete LearningAdventure JSON object.
    \${durationSpecifics}
    The adventure must include:
    1.  'adventureId': A unique ID (e.g., "adv_theme_timestamp").
    2.  'title': An exciting title for the adventure.
    3.  'theme': The primary theme based on the prompt.
    4.  'logline': A catchy one-sentence summary.
    5.  'targetAudience': Use the provided grade levels.
    6.  'targetDurationType': Use the provided duration type.
    7.  'coverImagePrompt': A general prompt for the adventure's cover.
    8.  'introductionNarrative': A captivating start to the story.
    9.  'introductionImagePrompt': An image prompt for the intro.
    10. 'learningObjectivesSummary': 3-4 student-friendly learning goals.
    11. 'initialChoicePoint' (OPTIONAL but PREFERRED if the theme allows for meaningful divergence): If included, it needs 'narrativeLeadingToChoice', a clear 'prompt', and 2-3 'ChoiceOption' objects. Each 'ChoiceOption' needs 'id', 'displayText', 'description' (optional), 'choiceImagePrompt', and 'linkedStoryArcId'.
    12. 'storyArcs': A record object of StoryArc items. If there's an 'initialChoicePoint', include StoryArcs for each 'linkedStoryArcId'. If no choice point, provide one StoryArc under a 'defaultStoryArcId'.
    13. 'defaultStoryArcId': The ID of the default/first story arc.
    14. Each 'StoryArc' needs 'storyArcId', 'arcTitle', 'arcIntroductionNarrative' (optional), 2-4 'Chapter' objects, and 'arcConclusionNarrative' with 'arcConclusionImagePrompt'.
    15. Each 'Chapter' needs 'chapterId', 'chapterTitle', 'narrativeText' (advancing this arc's story), 'chapterImagePrompt', and an 'embeddedActivities' array with 1-2 'EmbeddedActivityRequest' objects.
    16. Each 'EmbeddedActivityRequest' needs 'activityType' (randomly select from 'introduction', 'content-delivery', 'interactive-game', 'application', 'creative-exploration', 'summary'), 'subject' (relevant to the chapter and mandatory subjects), 'skillArea' (specific skill), 'focusArea' (more specific topic), 'difficulty' (1-5 based on chapter progression and target grade), and 'activityImagePrompt'.
    17. 'conclusionNarrative': An overall adventure conclusion.
    18. 'conclusionImagePrompt': An image prompt for the overall conclusion.
    19. 'subjectsCovered': List of main subjects.
    20. 'skillsDeveloped': List of key skills.
    21. 'tags': Relevant keywords.
  \`;

  const outputStructureReminder = \`
    IMPORTANT: Your entire response MUST be a single, valid JSON object that strictly conforms to the LearningAdventure interface structure (including all nested types like StoryArc, Chapter, ChoiceOption, EmbeddedActivityRequest).
    Do NOT include any markdown formatting (e.g., \`\`\`json), comments, or conversational text outside of the JSON structure itself.
    Example of an EmbeddedActivityRequest: {"activityType": "interactive-game", "subject": "Mathematics", "skillArea": "Percentages", "focusArea": "Calculating Discounts", "difficulty": 3, "activityImagePrompt": "A vibrant graphic showing a 20% off sale tag on a t-shirt, cartoon style."}
    Example for chapterImagePrompt: "A bustling view inside a newly opened sporting goods store, customers browsing, bright and colorful, cartoon style."
  \`;

  return \`\${personaInstructions}

TASK:
\${mainTask}

OUTPUT FORMAT:
\${outputStructureReminder}\`;
}
// --- End Prompt Engineering Core ---

// --- Mock Response Generator ---
function generateMockLearningAdventure(request: AdventureGenerationRequest): LearningAdventure {
  const adventureId = \`adv_\${Date.now()}\`;
  const choiceArc1Id = "arc_sport_store_management";
  const choiceArc2Id = "arc_book_worm_paradise";
  const defaultArcIdToUse = request.initialChoicePoint ? choiceArc1Id : "arc_default_path";


  const commonActivityRequest: EmbeddedActivityRequest = {
     activityType: 'interactive-game',
     subject: request.mandatorySubjectsOrSkills?.[0] || 'Mathematics',
     skillArea: 'Basic Operations',
     focusArea: 'Calculating Total Costs',
     activityImagePrompt: 'An illustration of a friendly robot cashier helping a child at a checkout counter with various items, bright and cheerful.',
     difficulty: Math.floor((request.targetAudience.gradeLevelMin + request.targetAudience.gradeLevelMax) / 2) // Average difficulty
  };

  const activityTypesCycle: ActivityType[] = ['content-delivery', 'interactive-game', 'application', 'creative-exploration'];


  return {
    adventureId,
    title: \`The Great \${request.themePrompt} Challenge!\`,
    theme: request.themePrompt,
    logline: "Embark on an exciting journey to achieve your goal in the world of " + request.themePrompt + "!",
    targetAudience: request.targetAudience,
    targetDurationType: request.desiredDurationType,
    estimatedTotalDays: request.desiredDurationType === 'singleDay' ? 1 : (request.desiredDurationType === 'weekLong' ? 5 : 3),
    coverImagePrompt: \`A vibrant and whimsical cover image for a K-12 learning adventure about "\${request.themePrompt}", featuring diverse kids and a friendly robot helper, NELIE, embarking on an exciting quest. Style: Pixar animated movie poster.\`,
    introductionNarrative: \`Welcome, brave adventurer! The world of "\${request.themePrompt}" awaits your unique talents. NELIE, your trusty AI guide, is here to help you on this grand quest! Are you ready to explore, learn, and make your mark?\`,
    introductionImagePrompt: "A diverse group of excited K-12 students with NELIE, a friendly and encouraging robot, looking towards a fantastical representation of the adventure's theme, wide angle, full of wonder.",
    learningObjectivesSummary: [\`Understand key concepts related to \${request.themePrompt}.\`, \`Apply \${(request.mandatorySubjectsOrSkills || ["problem-solving"])[0]} skills in new ways.\`, "Develop creative thinking and decision-making abilities."],
    mainCharacters: [{name: "NELIE", role: "Your AI Learning Companion", description: "A friendly, knowledgeable robot eager to help you succeed!"}],
    initialChoicePoint: {
      narrativeLeadingToChoice: "Your adventure begins with a crucial decision! NELIE presents you with two paths:",
      prompt: "Which path will you choose to start your journey into " + request.themePrompt + "?",
      options: [
        { id: "opt_A", displayText: "Path of the Clever Strategist", description: "Focus on planning and smart resource use.", choiceImagePrompt: "A fork in a path, one side showing a brain with gears turning, the other a treasure chest. Path A is highlighted.", linkedStoryArcId: choiceArc1Id },
        { id: "opt_B", displayText: "Path of the Bold Explorer", description: "Dive into challenges and discover new things.", choiceImagePrompt: "A fork in a path, one side showing a brain with gears, the other a treasure chest with an adventurous explorer. Path B is highlighted.", linkedStoryArcId: choiceArc2Id },
      ],
    },
    storyArcs: {
      [choiceArc1Id]: {
        storyArcId: choiceArc1Id,
        arcTitle: "The Clever Strategist's Journey",
        arcIntroductionNarrative: "Wise choice! Planning and strategy will be your greatest tools. Your first challenge appears...",
        chapters: [
          { chapterId: \`\${choiceArc1Id}_ch1\`, chapterTitle: "Chapter 1: Gathering Resources", narrativeText: "Every great plan starts with the right resources. Let's identify what we need for our first task in the world of \${request.themePrompt}.", chapterImagePrompt: \`A K-12 student with NELIE, thoughtfully listing items on a futuristic notepad, related to "\${request.themePrompt}", bright and organized.\`, embeddedActivities: [
            {...commonActivityRequest, activityType: activityTypesCycle[0], subject: (request.mandatorySubjectsOrSkills || ['Mathematics'])[0] || 'Mathematics', skillArea: "Resource Management", focusArea: "Listing Needs", activityImagePrompt: "A checklist with items related to the theme, vibrant icons."},
            {...commonActivityRequest, activityType: activityTypesCycle[1], subject: (request.mandatorySubjectsOrSkills || ['English'])[1] || 'English', skillArea: "Communication", focusArea: "Explaining Your Plan", activityImagePrompt: "A child confidently explaining a plan to NELIE."}
          ]},
          { chapterId: \`\${choiceArc1Id}_ch2\`, chapterTitle: "Chapter 2: Overcoming Obstacles", narrativeText: "A tricky situation! We need to use our wits to solve this puzzle that blocks our path.", chapterImagePrompt: \`A student and NELIE facing a fun, puzzle-like obstacle related to "\${request.themePrompt}", determined expressions.\`, embeddedActivities: [
             {...commonActivityRequest, activityType: activityTypesCycle[2], subject: (request.mandatorySubjectsOrSkills || ['Science'])[0] || 'Science', skillArea: "Problem Analysis", focusArea: "Finding Solutions", activityImagePrompt: "A lightbulb icon above a student's head, thinking hard."}
          ]},
        ],
        arcConclusionNarrative: "Fantastic strategizing! You've successfully navigated the challenges with your brilliant planning!",
        arcConclusionImagePrompt: "A certificate or badge saying 'Master Strategist' with thematic elements from \${request.themePrompt}."
      },
      [choiceArc2Id]: {
        storyArcId: choiceArc2Id,
        arcTitle: "The Bold Explorer's Path",
        arcIntroductionNarrative: "An adventurous spirit! Let's charge ahead and see what wonders await in the world of \${request.themePrompt}.",
        chapters: [
          { chapterId: \`\${choiceArc2Id}_ch1\`, chapterTitle: "Chapter 1: Uncharted Territories", narrativeText: "We're the first to explore this part of \${request.themePrompt}! What amazing discoveries will we make?", chapterImagePrompt: \`A K-12 student and NELIE with explorer gear (like hats and binoculars) looking at a mysterious, exciting new area related to "\${request.themePrompt}".\`, embeddedActivities: [
            {...commonActivityRequest, activityType: activityTypesCycle[0], subject: (request.mandatorySubjectsOrSkills || ['Geography'])[0] || 'Geography', skillArea: "Observation", focusArea: "Describing New Finds", activityImagePrompt: "A magnifying glass over a curious object related to the theme."},
            {...commonActivityRequest, activityType: activityTypesCycle[1], subject: (request.mandatorySubjectsOrSkills || ['Art'])[1] || 'Art', skillArea: "Creative Expression", focusArea: "Sketching Discoveries", activityImagePrompt: "A student sketching in a notepad, inspired by the surroundings."}
          ]},
           { chapterId: \`\${choiceArc2Id}_ch2\`, chapterTitle: "Chapter 2: The Great Test", narrativeText: "A legend speaks of a great test here. It's time to show our courage and knowledge!", chapterImagePrompt: \`A student and NELIE standing before an ancient, intriguing structure or challenge related to "\${request.themePrompt}".\`, embeddedActivities: [
             {...commonActivityRequest, activityType: activityTypesCycle[3], subject: (request.mandatorySubjectsOrSkills || ['History'])[0] || 'History', skillArea: "Critical Thinking", focusArea: "Solving an Ancient Riddle", activityImagePrompt: "Scrolls and ancient symbols, with a student pondering."}
          ]},
        ],
        arcConclusionNarrative: "Your bravery and curiosity have led to amazing discoveries! Well done, bold explorer!",
        arcConclusionImagePrompt: "A medal of valor with 'Fearless Explorer' and thematic elements from \${request.themePrompt}."
      },
    },
    defaultStoryArcId: defaultArcIdToUse,
    conclusionNarrative: \`Congratulations! You've completed your Learning Adventure in "\${request.themePrompt}". NELIE is so proud of all you've learned and achieved. Keep exploring, keep learning, and always stay curious!\`,
    conclusionImagePrompt: "A grand celebration scene with diverse K-12 students and NELIE, fireworks, and symbols of achievement related to the adventure's theme. Style: Joyful, Pixar animated.",
    subjectsCovered: request.mandatorySubjectsOrSkills || ["Mathematics", "English", "Problem Solving"],
    skillsDeveloped: ["Critical Thinking", "Creativity", ...(request.mandatorySubjectsOrSkills || ["Decision Making"])],
    tags: ["K-12", "Educational Game", "Story-Driven Learning", request.themePrompt, ...(request.studentInterests || [])]
  };
}
// --- End Mock Response Generator ---

serve(async (req: Request) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // Allow any origin
    'Access-Control-Allow-Methods': 'POST, OPTIONS', // Allow POST and OPTIONS
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', // Specify allowed headers
   };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405,
      });
    }
    const requestBody: AdventureGenerationRequest = await req.json();
    // console.log('Received Adventure Generation Request:', JSON.stringify(requestBody, null, 2)); // Can be verbose

    const llmPrompt = craftLLMLearningAdventurePrompt(requestBody);
    // console.log('Crafted LLM Adventure Prompt (length):', llmPrompt.length);
    // console.log('LLM PROMPT:', llmPrompt); // For debugging the prompt itself

    // --- Placeholder for LLM API Call ---
    // For actual LLM call, you'd use Deno.env.get for API keys and fetch/OpenAI client
    // const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
    // if (!openAIApiKey) throw new Error("OPENAI_API_KEY not set");
    // const llmResponse = await fetch("https://api.openai.com/v1/chat/completions", {
    //   method: "POST",
    //   headers: {
    //     "Authorization": \`Bearer \${openAIApiKey}\`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     model: "gpt-3.5-turbo-0125", // Or gpt-4-turbo-preview if available and budget allows
    //     messages: [{ role: "user", content: llmPrompt }],
    //     response_format: { type: "json_object" }, // Ensure model supports this
    //     temperature: 0.7,
    //   }),
    // });
    // if (!llmResponse.ok) {
    //   const errorBody = await llmResponse.text();
    //   throw new Error(\`LLM API request failed with status \${llmResponse.status}: \${errorBody}\`);
    // }
    // const llmJson = await llmResponse.json();
    // const jsonString = llmJson.choices[0]?.message?.content;
    // if (!jsonString) throw new Error("LLM returned empty or malformed content.");
    // const parsedAdventure: LearningAdventure = JSON.parse(jsonString);
    // --- End Placeholder ---

    // --- Use Mock Response ---
    console.log("Using Mock Response for generate-nelie-learning-adventure");
    const mockAdventure = generateMockLearningAdventure(requestBody);
    // --- End Mock Response ---

    const responseToSend = mockAdventure; // Replace with parsedAdventure when LLM is live

    return new Response(JSON.stringify(responseToSend), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in Supabase function generate-nelie-learning-adventure:', error.message, error.stack);
    return new Response(JSON.stringify({ error: error.message, stack: error.stack }), { // Include stack in dev
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
