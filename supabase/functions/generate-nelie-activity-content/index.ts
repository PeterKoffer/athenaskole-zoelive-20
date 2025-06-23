import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
// import { OpenAI } from 'https://deno.land/x/openai@v1.0.0/mod.ts'; // Example, if using OpenAI

console.log('Supabase function `generate-nelie-activity-content` init');

// --- Type Definitions (align with ActivityContentGenerator.ts expectations) ---
// These types would ideally be shared, but are duplicated here for function self-containment.
type ActivityType =
  | 'introduction'
  | 'content-delivery'
  | 'interactive-game'
  | 'application'
  | 'creative-exploration'
  | 'summary'
  | 'quiz' // Added quiz as it's often used
  | 'simulation'
  | 'adventure-game';

interface LessonActivityContent {
  // A generic structure, specific fields depend on ActivityType
  // This is a simplified version for the function's response.
  // The actual LessonActivityContent in LessonTypes.ts is more detailed per type.
  title?: string; // AI can suggest a title for the activity itself
  [key: string]: any;
}

interface DynamicContentRequest {
  subject: string;
  focusArea: string;
  activityType: ActivityType;
  difficulty: number;
  gradeLevel: number;
  promptDetails?: {
    persona?: string;
    tone?: string;
    style?: string;
    imagery?: string;
    requestType?: string; // e.g., 'engaging-introduction', 'varied-interactive-game'
    [key: string]: any;
  };
}

interface DynamicContentResponse {
  title?: string; // Title for the LessonActivity
  content: LessonActivityContent; // The actual content object for the activity
}
// --- End Type Definitions ---

// --- Prompt Engineering Core ---
function craftLLMPrompt(request: DynamicContentRequest): string {
  const { subject, focusArea, activityType, difficulty, gradeLevel, promptDetails } = request;

  const persona = promptDetails?.persona || "NELIE";
  const tone = promptDetails?.tone || "Infinitely patient, endlessly creative, encouraging, supportive, curious, celebratory of effort.";
  const style = promptDetails?.style || "Frame mistakes as learning opportunities. Encourage 'why' and 'how' questions. Use clear, concise language, age-appropriate for K-12.";
  const imageryInstruction = promptDetails?.imagery || "For explanations, describe vivid mental images or analogies. Make learning an adventure!";

  let specificInstructions = "";
  let outputFormatHint = ""; // Crucial for getting structured JSON from LLM

  switch (activityType) {
    case 'introduction':
      specificInstructions = `Generate an engaging introduction for a K-12 lesson on "${focusArea}" in ${subject}. Content should include a captivating hook, a real-world example, and 2-3 concise learning objectives. The student is at grade level ${gradeLevel} (difficulty: ${difficulty}/10).`;
      outputFormatHint = `Respond with a JSON object matching this structure: {"title": "Engaging Activity Title", "content": {"hook": "...", "realWorldExample": "...", "learningObjectives": ["...", "..."]}}`;
      break;
    case 'content-delivery':
      specificInstructions = `Generate educational content for "${focusArea}" in a ${subject} lesson. Explain the core concept clearly. Provide 1-2 illustrative examples. ${imageryInstruction}. The student is at grade level ${gradeLevel} (difficulty: ${difficulty}/10).`;
      outputFormatHint = `Respond with a JSON object matching this structure: {"title": "...", "content": {"introductionText": "...", "mainExplanation": "...", "examples": ["...", "..."], "segments": [{"title": "Sub-topic 1", "explanation": "...", "examples": ["..."]}]}}`;
      break;
    case 'interactive-game':
      specificInstructions = `Create a fun, multiple-choice quiz question for a K-12 ${subject} lesson on "${focusArea}". Include a question, 4 distinct options, the 0-indexed correct answer, and a brief explanation for the correct answer. The student is at grade level ${gradeLevel} (difficulty: ${difficulty}/10).`;
      outputFormatHint = `Respond with a JSON object matching this structure: {"title": "...", "content": {"gameType": "multiple-choice-quiz", "question": "...", "options": ["OptA", "OptB", "OptC", "OptD"], "correctAnswerIndex": N, "explanation": "..."}}`;
      break;
    case 'application':
      specificInstructions = `Design a problem-solving application task for "${focusArea}" in a ${subject} lesson. Provide a brief scenario, a clear task for the student, and 1-2 helpful hints. The student is at grade level ${gradeLevel} (difficulty: ${difficulty}/10).`;
      outputFormatHint = `Respond with a JSON object matching this structure: {"title": "...", "content": {"scenario": "...", "task": "...", "hints": ["...", "..."]}}`;
      break;
    case 'creative-exploration':
      specificInstructions = `Devise an open-ended creative prompt for "${focusArea}" in a ${subject} lesson. Encourage imagination and free expression. Provide 1-2 guidelines. The student is at grade level ${gradeLevel} (difficulty: ${difficulty}/10).`;
      outputFormatHint = `Respond with a JSON object matching this structure: {"title": "...", "content": {"creativePrompt": "...", "guidelines": ["...", "..."]}}`;
      break;
    case 'summary':
      specificInstructions = `Generate a concise summary for a K-12 lesson on "${focusArea}" in ${subject}. Include 2-3 key takeaways, a brief preview of potential next steps, and a final encouraging message. The student is at grade level ${gradeLevel} (difficulty: ${difficulty}/10).`;
      outputFormatHint = `Respond with a JSON object matching this structure: {"title": "...", "content": {"keyTakeaways": ["...", "..."], "nextStepsPreview": "...", "finalEncouragement": "..."}}`;
      break;
    default:
      specificInstructions = `Generate general educational content for "${focusArea}" in ${subject}. Grade: ${gradeLevel}, Difficulty: ${difficulty}/10.`;
      outputFormatHint = `Respond with a JSON object: {"title": "...", "content": {"text": "..."}}`;
  }

  // It's often better to put JSON instructions at the end or in system prompt
  return \`
    You are ${persona}, an AI Tutor.
    Your characteristics:
    - Tone: ${tone}
    - Style: ${style}
    - Imagery: ${imageryInstruction}

    Task: ${specificInstructions}

    IMPORTANT: Your entire response MUST be a single JSON object, structured exactly as follows, without any introductory text, conversational remarks, or markdown formatting:
    ${outputFormatHint}
  \`;
}
// --- End Prompt Engineering Core ---

serve(async (req: Request) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const requestBody: DynamicContentRequest = await req.json();
    console.log('Received request:', JSON.stringify(requestBody, null, 2));

    const llmPrompt = craftLLMPrompt(requestBody);
    console.log('Crafted LLM Prompt:', llmPrompt);

    // --- Placeholder for LLM API Call ---
    // const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    // if (!openaiApiKey) throw new Error("OPENAI_API_KEY environment variable not set.");
    // const openai = new OpenAI({ apiKey: openaiApiKey });
    //
    // const chatCompletion = await openai.chat.completions.create({
    //   messages: [{ role: 'user', content: llmPrompt }],
    //   model: 'gpt-3.5-turbo', // Or 'gpt-4' / 'gpt-4-1106-preview' for JSON mode
    //   // response_format: { type: "json_object" }, // For compatible models
    // });
    //
    // const llmResponseString = chatCompletion.choices[0].message.content;
    // if (!llmResponseString) {
    //   throw new Error("LLM returned empty content.");
    // }
    // console.log("Raw LLM Response String:", llmResponseString);
    // const parsedResponse: DynamicContentResponse = JSON.parse(llmResponseString);
    // --- End Placeholder ---

    // --- Mock Response (until LLM is integrated) ---
    // This mock attempts to return a structure based on the outputFormatHint.
    let mockContent: LessonActivityContent = { text: "This is mock content. LLM not called." };
    let mockTitle = \`Mock Activity: \${requestBody.focusArea}\`;

    // Simulate structure based on activity type for more realistic mocking
    switch (requestBody.activityType) {
        case 'introduction':
            mockTitle = \`Intro to \${requestBody.focusArea}\`;
            mockContent = { hook: "Mock Hook: Welcome to " + requestBody.focusArea + "!", realWorldExample: "Mock Example: This is used in everyday life when...", learningObjectives: ["Learn X", "Understand Y", "Apply Z"] };
            break;
        case 'content-delivery':
            mockTitle = \`Exploring \${requestBody.focusArea}\`;
            mockContent = { introductionText: "Let's learn about " + requestBody.focusArea, mainExplanation: "This is the main explanation for " + requestBody.focusArea + ". It's very interesting!", examples: ["Example 1", "Example 2"], segments: [{title: "Part 1", explanation: "Detail 1", examples: ["SegEx1"]}]};
            break;
        case 'interactive-game':
            mockTitle = \`\${requestBody.focusArea} Game Challenge\`;
            mockContent = { gameType: "multiple-choice-quiz", question: \`Mock Question: What is the capital of \${requestBody.focusArea} (if it's a place)?\`, options: ["Option 1", "Option 2", "Correct Answer", "Option 4"], correctAnswerIndex: 2, explanation: "The correct answer is Correct Answer because..." };
            break;
        case 'application':
            mockTitle = \`Apply Your Knowledge: \${requestBody.focusArea}\`;
            mockContent = { scenario: "Imagine a situation involving " + requestBody.focusArea + ".", task: "Your task is to solve problem X.", hints: ["Hint 1", "Hint 2"]};
            break;
        case 'creative-exploration':
            mockTitle = \`Get Creative with \${requestBody.focusArea}\`;
            mockContent = { creativePrompt: "Create something amazing related to " + requestBody.focusArea + "!", guidelines: ["Be imaginative!", "Use what you've learned."]};
            break;
        case 'summary':
            mockTitle = \`Summary of \${requestBody.focusArea}\`;
            mockContent = { keyTakeaways: ["Key takeaway 1 for " + requestBody.focusArea, "Key takeaway 2"], nextStepsPreview: "Next, we'll explore...", finalEncouragement: "Great job learning about " + requestBody.focusArea + "!"};
            break;
        default:
            mockContent = { text: \`This is mock content for \${requestBody.focusArea}. LLM not called.\` };
    }

    const mockResponse: DynamicContentResponse = {
        title: mockTitle,
        content: mockContent
    };
    // --- End Mock Response ---

    // Replace mockResponse with parsedResponse when LLM is integrated
    const responseToSend = mockResponse;

    return new Response(JSON.stringify(responseToSend), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in Supabase function:', error.message, error.stack);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
