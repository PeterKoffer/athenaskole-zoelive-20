// Simplified Multi-Prompt Adventure Generation Edge Function with Budget Control
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { BudgetGuard, extractUsageFromLLMResponse, type StepName } from "../_shared/BudgetGuard.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Enhanced logging
function logInfo(message: string, data?: any) {
  const timestamp = new Date().toISOString();
  if (data) {
    console.log(`[${timestamp}] ℹ️  ${message}`, JSON.stringify(data, null, 2));
  } else {
    console.log(`[${timestamp}] ℹ️  ${message}`);
  }
}

function logError(message: string, error?: any) {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ❌ ${message}`, error);
}

function logSuccess(message: string, data?: any) {
  const timestamp = new Date().toISOString();
  if (data) {
    console.log(`[${timestamp}] ✅ ${message}`, JSON.stringify(data, null, 2));
  } else {
    console.log(`[${timestamp}] ✅ ${message}`);
  }
}

// Budget Guard Configuration
const PLANNED_STEPS: StepName[] = ["hook", "phaseplan", "narrative", "quiz", "writing", "scenario", "images", "exit", "validator"];

function modelSpec(name: string, in_cost: number, out_cost: number, maxOut = 2048) {
  return { name, in_per_mtok: in_cost, out_per_mtok: out_cost, max_output_tokens: maxOut };
}

const budgetGuard = new BudgetGuard({
  plannedSteps: PLANNED_STEPS,
  tokenBudgetTotal: Number(Deno.env.get("TOKEN_BUDGET_TOTAL") ?? "18000"),
  costCapUSD: Deno.env.get("COST_CAP_USD") ? Number(Deno.env.get("COST_CAP_USD")) : undefined,
  jsonMinified: (Deno.env.get("USE_JSON_MINIFIED") ?? "true").toLowerCase() === "true",
  reserveForCritical: 1500,
  modelMap: {
    hook: modelSpec(Deno.env.get("MODEL_HOOK") ?? "gpt-4o-mini", 0.15, 0.6, 256),
    phaseplan: modelSpec(Deno.env.get("MODEL_PHASEPLAN") ?? "gpt-4o-mini", 0.15, 0.6, 1024),
    narrative: modelSpec(Deno.env.get("MODEL_NARRATIVE") ?? "gpt-4o-mini", 0.15, 0.6, 512),
    quiz: modelSpec(Deno.env.get("MODEL_QUIZ") ?? "gpt-4o-mini", 0.15, 0.6, 700),
    writing: modelSpec(Deno.env.get("MODEL_WRITING") ?? "gpt-4o-mini", 0.15, 0.6, 900),
    scenario: modelSpec(Deno.env.get("MODEL_SCENARIO") ?? "gpt-4o-mini", 0.15, 0.6, 600),
    minigame: modelSpec(Deno.env.get("MODEL_MINIGAME") ?? "gpt-4o-mini", 0.15, 0.6, 400),
    images: modelSpec(Deno.env.get("MODEL_IMAGES") ?? "gpt-4o-mini", 0.15, 0.6, 160),
    exit: modelSpec(Deno.env.get("MODEL_EXIT") ?? "gpt-4o-mini", 0.15, 0.6, 180),
    validator: modelSpec(Deno.env.get("MODEL_VALIDATOR") ?? "gpt-4o-mini", 0.15, 0.6, 200),
    enrichment: modelSpec(Deno.env.get("MODEL_ENRICH") ?? "gpt-4o-mini", 0.15, 0.6, 200),
  },
  stepConfig: {
    hook: { priority: 1, default_max_output_tokens: 180 },
    phaseplan: { priority: 1, default_max_output_tokens: 900 },
    narrative: { priority: 2, default_max_output_tokens: 400 },
    quiz: { priority: 1, default_max_output_tokens: 700 },
    writing: { priority: 1, default_max_output_tokens: 900 },
    scenario: { priority: 2, default_max_output_tokens: 600 },
    minigame: { priority: 3, default_max_output_tokens: 300 },
    images: { priority: 3, default_max_output_tokens: 140 },
    exit: { priority: 2, default_max_output_tokens: 150 },
    validator: { priority: 1, default_max_output_tokens: 120 },
    enrichment: { priority: 3, default_max_output_tokens: 180 },
  },
});

// Budget-aware AI call
async function callOpenAI(model: string, system: string, user: string, max_tokens: number): Promise<{text: string; usage?: any; raw: any}> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    logError('OpenAI API key not configured');
    throw new Error('OpenAI API key not configured');
  }

  logInfo(`🤖 Calling OpenAI (${model}, max_tokens: ${max_tokens})...`);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user }
        ],
        max_tokens,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logError(`OpenAI API error: ${response.status}`, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content ?? "";
    const usage = extractUsageFromLLMResponse(data);
    
    logSuccess('✅ OpenAI response received');
    return { text, usage, raw: data };

  } catch (error) {
    logError('Error calling OpenAI', error);
    
    // Check if it's a quota/billing error
    if (error?.message?.includes('quota') || error?.message?.includes('billing')) {
      logError('❌ OpenAI quota/billing limit reached - using fallback response');
      throw new Error('QUOTA_EXCEEDED');
    }
    
    throw error;
  }
}

// Generate hook step
async function generateHook(context: any) {
  const begin = budgetGuard.beginStep("hook");
  if (!begin.allowed) {
    logInfo(`❌ Hook step skipped: ${begin.reason}`);
    return { skipped: true, reason: begin.reason };
  }

  const system = `You are an inspiring teacher who creates engaging lesson introductions. You must create curiosity and motivation in students. Return valid JSON.`;
  
  const user = `Write an inspiring and engaging introduction to the lesson "${context.title}" for grade ${context.gradeLevel} in the subject ${context.subject}.

REQUIREMENTS:
- Start with an exciting scenario, problem, or question that captures students' attention
- Explain why this topic is relevant to students in their daily lives
- Ask provocative questions that make students think
- Use language appropriate for the age group
- Create anticipation and curiosity

Return JSON format:
{
  "text": "Engaging and inspiring introduction text that motivates students (150-200 words)",
  "hook_question": "A provocative question that starts discussion",
  "real_world_connection": "How the topic relates to students' everyday lives",
  "image_prompt": "Description for generating an inspiring image that supports the intro"
}`;

  try {
    const { text, usage } = await callOpenAI(begin.model.name, system, user, begin.max_tokens);
    budgetGuard.finishStep(begin.logIndex, usage);

    // Parse JSON response
    const match = text.match(/\{[\s\S]*\}/);
    const jsonText = match ? match[0] : text;
    const data = JSON.parse(jsonText);
    
    logSuccess('✅ Hook generated successfully');
    return { data };
  } catch (error) {
    budgetGuard.finishStep(begin.logIndex, null);
    
    if (error?.message === 'QUOTA_EXCEEDED') {
      logError('❌ OpenAI quota exceeded - using enhanced fallback');
      return { 
        data: { 
          text: `Ready to explore ${context.subject}? Let's dive into "${context.title}" and discover amazing things together!`,
          hook_question: `What do you already know about ${context.title.toLowerCase()}?`,
          real_world_connection: `Understanding ${context.title.toLowerCase()} helps us in our daily lives and future careers.`,
          image_prompt: `students exploring ${context.subject} topic together with excitement and curiosity` 
        } 
      };
    }
    
    logError('Error generating hook', error);
    return { 
      data: { 
        text: "Welcome to an exciting learning adventure!", 
        image_prompt: "students learning together" 
      } 
    };
  }
}

// Generate phase plan step
async function generatePhaseplan(context: any) {
  const begin = budgetGuard.beginStep("phaseplan");
  if (!begin.allowed) {
    logInfo(`❌ Phaseplan step skipped: ${begin.reason}`);
    return { skipped: true, reason: begin.reason };
  }

  const system = `You are an experienced education expert and teacher trainer. You design detailed, engaging learning sequences with concrete learning activities. Always return valid JSON.`;
  
  const prompt = `Design a complete learning sequence for "${context.title}" for grade ${context.gradeLevel} in the subject ${context.subject}.

REQUIREMENTS FOR LEARNING CONTENT:
- Each phase should contain concrete learning activities with step-by-step instructions
- Include practical exercises, discussions, and hands-on activities  
- Add reflection questions and learning evaluation
- Design should be interactive and student-engaging
- Include both individual and group tasks

Return JSON format:
{
  "title": "${context.title}",
  "description": "Detailed description of the entire learning sequence (100-150 words)",
  "learning_objectives": [
    "Concrete learning objective 1",
    "Concrete learning objective 2", 
    "Concrete learning objective 3"
  ],
  "phases": [
    {
      "name": "Phase name",
      "duration": 30,
      "type": "introduction|exploration|practice|reflection|assessment",
      "description": "Brief description of the phase's purpose",
      "activities": [
        {
          "name": "Activity name",
          "duration": 10,
          "type": "discussion|exercise|game|project|quiz|reflection",
          "instructions": "Detailed step-by-step instructions for the activity",
          "materials": ["necessary materials"],
          "interaction": "individual|pairs|groups|class"
        }
      ],
      "assessment": "How students' learning is evaluated in this phase",
      "reflection_questions": ["Reflection questions for students"]
    }
  ],
  "total_duration": 180,
  "key_concepts": ["Important concepts that are learned"],
  "extension_activities": ["Extra activities for fast learners"]
}`;

  try {
    const { text, usage } = await callOpenAI(begin.model.name, system, prompt, begin.max_tokens);
    budgetGuard.finishStep(begin.logIndex, usage);

    // Parse JSON response
    const match = text.match(/\{[\s\S]*\}/);
    const jsonText = match ? match[0] : text;
    const data = JSON.parse(jsonText);
    
    logSuccess('✅ Phaseplan generated successfully');
    return { data };
  } catch (error) {
    budgetGuard.finishStep(begin.logIndex, null);
    
    if (error?.message === 'QUOTA_EXCEEDED') {
      logError('❌ OpenAI quota exceeded - using enhanced phaseplan fallback');
      return {
        data: {
          title: context.title,
          description: `An engaging ${context.subject} adventure that combines hands-on learning with real-world applications. Students will explore ${context.title.toLowerCase()} through interactive activities, collaborative projects, and meaningful discussions.`,
          learning_objectives: [
            `Understand key concepts related to ${context.title.toLowerCase()}`,
            `Apply ${context.subject} knowledge to solve real-world problems`,
            `Develop critical thinking and collaboration skills`,
            `Reflect on learning and make connections to daily life`
          ],
          phases: [
            {
              name: "Exploration & Discovery",
              duration: 45,
              type: "exploration",
              description: "Students explore the topic through hands-on activities and guided discovery",
              activities: [
                {
                  name: "Interactive Investigation",
                  duration: 25,
                  type: "hands-on",
                  instructions: `Investigate ${context.title.toLowerCase()} through practical exploration and observation`,
                  materials: ["Investigation materials", "Notebooks", "Collaboration tools"],
                  interaction: "small_groups"
                },
                {
                  name: "Knowledge Sharing",
                  duration: 20,
                  type: "discussion",
                  instructions: "Share discoveries and build collective understanding",
                  materials: ["Presentation space", "Sharing tools"],
                  interaction: "class"
                }
              ]
            },
            {
              name: "Application & Practice",
              duration: 50,
              type: "application",
              description: "Students apply their learning through practical projects and challenges",
              activities: [
                {
                  name: "Creative Challenge",
                  duration: 35,
                  type: "project",
                  instructions: `Create a project that demonstrates understanding of ${context.title.toLowerCase()}`,
                  materials: ["Project materials", "Creative supplies", "Planning sheets"],
                  interaction: "individual_pairs"
                },
                {
                  name: "Peer Review",
                  duration: 15,
                  type: "collaboration",
                  instructions: "Present projects and provide constructive feedback",
                  materials: ["Feedback forms", "Presentation space"],
                  interaction: "class"
                }
              ]
            },
            {
              name: "Reflection & Connection",
              duration: 25,
              type: "reflection",
              description: "Students reflect on their learning and make connections to the real world",
              activities: [
                {
                  name: "Learning Reflection",
                  duration: 15,
                  type: "reflection",
                  instructions: "Think about what you learned and how it connects to your life",
                  materials: ["Reflection journals", "Guiding questions"],
                  interaction: "individual"
                },
                {
                  name: "Future Planning",
                  duration: 10,
                  type: "discussion",
                  instructions: "Discuss how this learning will help in future studies and life",
                  materials: ["Discussion prompts"],
                  interaction: "class"
                }
              ]
            }
          ]
        }
      };
    }
    
    logError('Error generating phaseplan', error);
    // Enhanced 12-step fallback structure
    return {
      data: {
        title: context.title,
        description: "An immersive learning adventure that engages students through hands-on exploration and creative problem-solving!",
        learning_objectives: [
          "Develop deep understanding through hands-on exploration",
          "Apply knowledge to solve real-world challenges", 
          "Collaborate effectively and communicate ideas clearly"
        ],
        phases: [
          {
            name: "🎯 Adventure Hook",
            duration: 10,
            type: "hook",
            description: "Capture curiosity with an intriguing challenge",
            activities: [
              {
                name: "Mystery Challenge",
                duration: 10,
                type: "discussion",
                instructions: "Present students with an interesting problem or scenario related to the topic that they'll solve throughout the lesson.",
                materials: ["Presentation slides", "Props or visuals"],
                interaction: "class",
                engagement_element: "Real-world mystery that students want to solve"
              }
            ],
            assessment: "Observe student curiosity and initial engagement",
            differentiation: "Use visuals and verbal explanations to support all learners"
          },
          {
            name: "🔍 Knowledge Activation", 
            duration: 10,
            type: "exploration",
            description: "Connect new learning to existing knowledge",
            activities: [
              {
                name: "What Do We Know?",
                duration: 10,
                type: "discussion",
                instructions: "Have students share what they already know about the topic through think-pair-share.",
                materials: ["Sticky notes", "Chart paper"],
                interaction: "pairs",
                engagement_element: "Students become the experts by sharing knowledge"
              }
            ],
            assessment: "Listen to student discussions to gauge prior knowledge",
            differentiation: "Allow multiple ways to share (drawing, writing, speaking)"
          },
          {
            name: "🎯 Mission Objectives",
            duration: 5,
            type: "instruction", 
            description: "Set clear, student-friendly learning goals",
            activities: [
              {
                name: "Today's Mission",
                duration: 5,
                type: "presentation",
                instructions: "Present learning objectives as mission goals that students will achieve.",
                materials: ["Mission board", "Student checklists"],
                interaction: "class",
                engagement_element: "Frame learning as an exciting mission to complete"
              }
            ],
            assessment: "Check that students understand the objectives",
            differentiation: "Use visual mission board and verbal explanations"
          },
          {
            name: "🚀 Hands-On Exploration",
            duration: 20,
            type: "exploration",
            description: "Students discover key concepts through activity",
            activities: [
              {
                name: "Discovery Lab",
                duration: 20,
                type: "hands-on",
                instructions: "Students work in small groups to explore the topic through hands-on materials and guided questions.",
                materials: ["Exploration materials", "Question cards", "Recording sheets"],
                interaction: "groups",
                engagement_element: "Students act as scientists/investigators making discoveries"
              }
            ],
            assessment: "Circulate and observe student discoveries",
            differentiation: "Provide different complexity levels of materials"
          },
          {
            name: "📚 Concept Connection",
            duration: 15,
            type: "instruction",
            description: "Connect discoveries to formal learning",
            activities: [
              {
                name: "Making Sense",
                duration: 15,
                type: "discussion",
                instructions: "Students share discoveries and teacher helps connect to key concepts and vocabulary.",
                materials: ["Concept map", "Key vocabulary cards"],
                interaction: "class",
                engagement_element: "Students' discoveries become the foundation for formal learning"
              }
            ],
            assessment: "Check understanding through questioning and concept mapping",
            differentiation: "Use multiple representations (visual, verbal, kinesthetic)"
          },
          {
            name: "🎨 Creative Application",
            duration: 25,
            type: "practice",
            description: "Students apply learning in creative ways",
            activities: [
              {
                name: "Create & Share",
                duration: 25,
                type: "creative",
                instructions: "Students create something original that demonstrates their understanding (poster, model, presentation, etc.).",
                materials: ["Art supplies", "Building materials", "Technology tools"],
                interaction: "individual",
                engagement_element: "Students showcase learning through personal creativity"
              }
            ],
            assessment: "Evaluate creativity and accuracy of content",
            differentiation: "Offer multiple creation options to suit different strengths"
          },
          {
            name: "🎯 Mission Reflection",
            duration: 15,
            type: "reflection", 
            description: "Students reflect on learning and next steps",
            activities: [
              {
                name: "Adventure Debrief",
                duration: 15,
                type: "reflection",
                instructions: "Students reflect on what they learned, what surprised them, and how they can use this knowledge.",
                materials: ["Reflection journals", "Exit tickets"],
                interaction: "individual",
                engagement_element: "Students celebrate their learning journey"
              }
            ],
            assessment: "Review reflection responses for understanding",
            differentiation: "Offer multiple reflection formats (writing, drawing, verbal)"
          }
        ],
        total_duration: 100,
        key_concepts: ["Hands-on exploration", "Real-world application", "Creative expression", "Collaborative learning"],
        success_criteria: [
          "Students can explain key concepts in their own words",
          "Students can apply learning to solve problems",
          "Students can work effectively with others"
        ],
        extension_activities: [
          "Advanced challenge problems for fast finishers",
          "Independent research project",
          "Peer teaching opportunity",
          "Creative extension with technology integration"
        ]
      }
    };
  }
}

// Budget-controlled adventure generator
async function generateBudgetAdventure(context: any) {
  logInfo('🚀 Starting budget-controlled adventure generation', context);
  
  // Generate hook
  const hookResult = await generateHook(context);
  
  // Generate main phase plan
  const phasePlanResult = await generatePhaseplan(context);
  
  // Use enhanced phaseplan data with proper 12-step structure or our rich fallback
  const adventureData = phasePlanResult.data;

  // Ensure we have a complete lesson structure
  const completeLesson = {
    title: adventureData.title || context.title,
    subject: adventureData.subject || context.subject,
    gradeLevel: context.gradeLevel || "6-8",
    scenario: adventureData.description || "An immersive learning adventure that engages students through hands-on exploration and creative problem-solving!",
    learningObjectives: adventureData.learning_objectives || ["Learn through hands-on experience", "Develop creative skills"],
    stages: adventureData.phases?.map((phase: any, index: number) => ({
      id: `stage-${index + 1}`,
      title: phase.name || `Phase ${index + 1}`,
      description: phase.description || "Educational activity with clear learning objectives",
      duration: phase.duration || 15,
      storyText: phase.description,
      activities: phase.activities?.map((activity: any) => ({
        type: activity.type === 'discussion' || activity.type === 'hands-on' || activity.type === 'creative' ? 'creativeTask' : 
              activity.type === 'applied_problem_set' ? 'multipleChoice' : 'creativeTask',
        title: activity.name || phase.name || "Learning Activity",
        instructions: activity.instructions || "Complete this educational activity to continue your learning journey!",
        content: activity.type === 'applied_problem_set' && activity.generated?.quiz_set ? {
          question: activity.generated.quiz_set.items?.[0]?.stem || "What is the correct answer?",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: 0,
          explanation: activity.generated.quiz_set.items?.[0]?.explanation || "This demonstrates the concept we're learning about.",
          points: 10
        } : undefined
      })) || [{
        type: 'creativeTask',
        title: phase.name || "Learning Activity",
        instructions: activity?.instructions || phase.description || "Complete this educational activity to demonstrate your understanding!",
      }],
      materials: phase.activities?.[0]?.materials || ["Learning materials", "Activity workspace"],
      assessmentCriteria: [phase.assessment || "Demonstrates understanding of key concepts", "Shows creative thinking and problem-solving"]
    })) || [],
    estimatedTime: adventureData.total_duration || 100
  };

  logSuccess('✅ Budget adventure generated successfully');
  return completeLesson;
}

// Main request handler
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    logInfo('📋 Handling CORS preflight');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logInfo('🚀 Starting generate-adventure-multipart function');

    const requestData = await req.json();
    logInfo('📨 Received request data', {
      adventure: requestData.adventure?.title,
      subject: requestData.adventure?.subject
    });

    // Extract context
    const context = {
      title: requestData.adventure?.title || 'Learning Adventure',
      subject: requestData.adventure?.subject || 'General',
      gradeLevel: requestData.adventure?.gradeLevel || 7,
      interests: requestData.studentProfile?.interests || ['learning']
    };

    logInfo('📋 Adventure context', context);

    // Generate adventure with budget control
    const adventure = await generateBudgetAdventure(context);

    logSuccess('✅ Adventure generation completed');

    return new Response(JSON.stringify({
      success: true,
      lesson: {
        title: adventure.title,
        subject: context.subject,
        gradeLevel: context.gradeLevel,
        scenario: adventure.description,
        learningObjectives: ["Learn through hands-on experience", "Develop creative skills"],
        stages: (adventure.phases || []).map((phase: any, index: number) => ({
          id: `stage-${index + 1}`,
          title: phase.name || `Stage ${index + 1}`,
          description: phase.activity || "Adventure activity",
          duration: phase.duration || 30,
          storyText: phase.activity,
          activities: [{
            type: 'creativeTask',
            title: phase.name || `Stage ${index + 1}`,
            instructions: phase.activity || "Complete this stage to continue your adventure!"
          }]
        })),
        estimatedTime: (adventure.phases || []).reduce((total: number, phase: any) => total + (phase.duration || 30), 0)
      },
      generationType: 'multi-prompt-budget-controlled',
      timestamp: new Date().toISOString(),
      meta: {
        budget: budgetGuard.report()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    logError('❌ Error in generate-adventure-multipart', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Unknown error occurred',
      lesson: {
        title: "Test Adventure",
        description: "A simple test adventure",
        stages: [
          {
            name: "Test Phase",
            duration: 30,
            activity: "Test activity"
          }
        ],
        activities: []
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200, // Return 200 even on error to avoid CORS issues
    });
  }
});