// Simplified Multi-Prompt Adventure Generation Edge Function with Budget Control
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { BudgetGuard, extractUsageFromLLMResponse, type StepName } from "../_shared/BudgetGuard.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Initialize Supabase client for caching
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

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

// Cache key generation for lesson content
function generateLessonCacheKey(context: any): string {
  const keyData = {
    title: context.title,
    subject: context.subject,
    gradeLevel: context.gradeLevel,
    interests: context.interests?.sort() || [],
    version: 'v2.0' // Update when prompt changes
  };
  return btoa(JSON.stringify(keyData));
}

// Cache key generation for images  
function generateImageCacheKey(prompt: string): string {
  const normalizedPrompt = prompt.toLowerCase().trim().replace(/\s+/g, ' ');
  return btoa(normalizedPrompt);
}

// Check for cached lesson content
async function getCachedLesson(cacheKey: string) {
  try {
    const { data, error } = await supabase
      .from('adventure_lesson_cache')
      .select('lesson_data, created_at')
      .eq('content_hash', cacheKey)
      .maybeSingle();
    
    if (error) {
      logError('Error checking lesson cache:', error);
      return null;
    }
    
    if (data) {
      logSuccess(`✅ Found cached lesson from ${data.created_at}`);
      return data.lesson_data;
    }
    
    return null;
  } catch (error) {
    logError('Cache lookup failed:', error);
    return null;
  }
}

// Save lesson to cache
async function saveLessonToCache(cacheKey: string, lessonData: any, context: any) {
  try {
    const { error } = await supabase
      .from('adventure_lesson_cache')
      .upsert({
        content_hash: cacheKey,
        adventure_title: context.title,
        subject: context.subject,
        grade_level: context.gradeLevel,
        lesson_data: lessonData
      });
    
    if (error) {
      logError('Error saving to lesson cache:', error);
    } else {
      logSuccess('✅ Lesson saved to cache');
    }
  } catch (error) {
    logError('Cache save failed:', error);
  }
}

// Check for cached image
async function getCachedImage(promptHash: string) {
  try {
    const { data, error } = await supabase
      .from('adventure_image_cache')
      .select('image_url, image_data, created_at')
      .eq('prompt_hash', promptHash)
      .maybeSingle();
    
    if (error) {
      logError('Error checking image cache:', error);
      return null;
    }
    
    if (data) {
      logSuccess(`✅ Found cached image from ${data.created_at}`);
      return data.image_url || data.image_data;
    }
    
    return null;
  } catch (error) {
    logError('Image cache lookup failed:', error);
    return null;
  }
}

// Save image to cache
async function saveImageToCache(promptHash: string, prompt: string, imageUrl: string, adventureTitle: string) {
  try {
    const { error } = await supabase
      .from('adventure_image_cache')
      .upsert({
        prompt_hash: promptHash,
        adventure_title: adventureTitle,
        prompt: prompt,
        image_url: imageUrl
      });
    
    if (error) {
      logError('Error saving to image cache:', error);
    } else {
      logSuccess('✅ Image saved to cache');
    }
  } catch (error) {
    logError('Image cache save failed:', error);
  }
}

// Budget-aware AI call
async function callOpenAI(model: string, system: string, user: string, max_tokens: number): Promise<{text: string; usage?: any; raw: any}> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    logError('OpenAI API key not configured');
    throw new Error('OpenAI API key not configured');
  }

  logInfo(`🤖 Calling OpenAI (${model}, max_tokens: ${max_tokens})...`);

  try {
    const requestBody: any = {
      model,
      messages: [
        { role: 'system', content: system + ' You MUST return valid JSON only. No additional text before or after the JSON.' },
        { role: 'user', content: user }
      ],
      max_tokens,
      temperature: 0.3
    };

    logInfo(`🤖 Calling OpenAI (${model}, max_tokens: ${max_tokens})...`);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logError(`OpenAI API error: ${response.status}`, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    let text = data.choices?.[0]?.message?.content ?? "";
    const usage = extractUsageFromLLMResponse(data);
    
    // Clean up the response text to extract only JSON
    text = text.trim();
    if (text.startsWith('```json')) {
      text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    // Extract JSON from text if there's extra content
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      text = jsonMatch[0];
    }
    
    logSuccess('✅ OpenAI response received');
    logInfo(`📝 Cleaned response: ${text.substring(0, 200)}...`);
    
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

    // Parse JSON response with enhanced error handling
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      logError(`❌ Error generating hook ${parseError}`);
      logError(`❌ Raw OpenAI response: ${text}`);
      // Return enhanced hook fallback
      return {
        data: {
          text: `Welcome to your exciting ${context.title} adventure! You've stumbled upon something incredible that needs your ${context.subject} expertise. The challenge ahead will test your knowledge, creativity, and problem-solving skills. Are you ready to prove what you can do and make a real difference? Let's discover what amazing discoveries await!`,
          beats: ["Exciting discovery", "Challenge presentation", "Call to adventure"],
          image_prompt: `adventure learning environment for ${context.subject}, students engaged in discovery, warm inspiring atmosphere`,
          reading_time_sec: 45
        }
      };
    }
    
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

    // Parse JSON response with enhanced error handling  
    let data;
    try {
      const match = text.match(/\{[\s\S]*\}/);
      const jsonText = match ? match[0] : text;
      data = JSON.parse(jsonText);
    } catch (parseError) {
      logError('JSON parsing failed for phaseplan, using comprehensive educational fallback', parseError);
      // Return comprehensive 12-step educational structure
      return {
        data: {
          title: context.title,
          description: "An immersive learning adventure that engages students through hands-on exploration and creative problem-solving!",
          learning_objectives: [
            `Master key concepts in ${context.subject} through interactive activities`,
            "Develop critical thinking and problem-solving skills", 
            "Apply knowledge to real-world scenarios and challenges"
          ],
          phases: [
            {
              name: "🎯 Adventure Hook",
              duration: 10,
              type: "hook", 
              description: "Capture curiosity with an intriguing challenge that connects to real-world applications",
              activities: [{
                name: "Mission Discovery",
                duration: 10,
                type: "discussion",
                instructions: `Welcome to your ${context.subject} adventure! You've discovered something amazing that needs your expertise. Let's explore what makes this challenge exciting and how your skills will help solve it.`,
                materials: ["Adventure scenario", "Discussion prompts"],
                interaction: "class",
                engagement_element: "Real-world problem that students want to solve"
              }],
              assessment: "Observe student curiosity and initial engagement with the topic",
              differentiation: "Use visuals, storytelling, and interactive elements to engage all learners"
            },
            {
              name: "🧠 Knowledge Activation",
              duration: 15,
              type: "exploration",
              description: "Connect new learning to existing knowledge and experiences", 
              activities: [{
                name: "What We Know",
                duration: 15,
                type: "hands-on",
                instructions: `Share what you already know about ${context.subject}! Work with a partner to create a mind map of your existing knowledge and experiences related to today's challenge.`,
                materials: ["Mind map templates", "Colored markers", "Sticky notes"],
                interaction: "pairs",
                engagement_element: "Students become experts by sharing their knowledge"
              }],
              assessment: "Listen to student discussions and review mind maps",
              differentiation: "Allow multiple ways to share knowledge: drawing, writing, speaking"
            },
            {
              name: "🚀 Hands-On Investigation", 
              duration: 25,
              type: "exploration",
              description: "Students discover key concepts through guided investigation",
              activities: [{
                name: "Expert Investigation",
                duration: 25,
                type: "hands-on",
                instructions: `Time to become a ${context.subject} expert! Work in teams to investigate the core concepts through hands-on activities. Use the investigation materials to explore, test, and discover key principles.`,
                materials: ["Investigation kit", "Recording sheets", "Digital tools", "Reference materials"],
                interaction: "groups",
                engagement_element: "Students act as real experts making authentic discoveries"
              }],
              assessment: "Observe student discoveries and check understanding through questioning",
              differentiation: "Provide different complexity levels and multiple investigation paths"
            },
            {
              name: "💡 Concept Mastery",
              duration: 20,
              type: "instruction",
              description: "Connect discoveries to formal learning and key concepts",
              activities: [{
                name: "Making Connections", 
                duration: 20,
                type: "discussion",
                instructions: "Share your discoveries with the class! Let's connect what you found to the key concepts and see how everything fits together. You'll create a class knowledge bank of insights.",
                materials: ["Concept connection charts", "Key vocabulary cards", "Digital collaboration tools"],
                interaction: "class",
                engagement_element: "Student discoveries become the foundation for formal learning"
              }],
              assessment: "Check understanding through concept mapping and peer explanations",
              differentiation: "Use multiple representations: visual, verbal, kinesthetic"
            },
            {
              name: "🎨 Creative Challenge",
              duration: 30,
              type: "practice",
              description: "Apply learning creatively to solve authentic problems",
              activities: [{
                name: "Innovation Challenge",
                duration: 30,
                type: "creative",
                instructions: `Now for the ultimate challenge! Use everything you've learned to create an innovative solution. You can build, design, write, or create something that demonstrates your mastery of ${context.subject} concepts.`,
                materials: ["Creation supplies", "Building materials", "Art supplies", "Technology tools", "Design templates"],
                interaction: "individual", 
                engagement_element: "Students showcase learning through personal creativity and innovation"
              }],
              assessment: "Evaluate creativity, accuracy of content, and application of concepts",
              differentiation: "Offer multiple creation options to suit different strengths and interests"
            },
            {
              name: "🎯 Reflection & Next Steps",
              duration: 15,
              type: "reflection",
              description: "Students reflect on learning and plan future applications",
              activities: [{
                name: "Adventure Reflection",
                duration: 15,
                type: "reflection",
                instructions: "Reflect on your learning journey! What did you discover? What surprised you? How will you use this knowledge in the future? Share your biggest insights and next steps.",
                materials: ["Reflection journals", "Digital reflection tools", "Peer sharing protocols"],
                interaction: "individual",
                engagement_element: "Students celebrate their growth and plan future learning"
              }],
              assessment: "Review reflection responses and plan follow-up activities", 
              differentiation: "Offer multiple reflection formats: writing, drawing, video, verbal"
            }
          ],
          total_duration: 115,
          key_concepts: [
            `Core ${context.subject} principles and concepts`,
            "Critical thinking and problem-solving strategies",
            "Real-world application and transfer", 
            "Creative innovation and design thinking"
          ],
          success_criteria: [
            "Students can explain key concepts in their own words",
            "Students can apply learning to solve new problems", 
            "Students can work effectively with others and communicate ideas",
            "Students demonstrate creative thinking and innovation"
          ],
          extension_activities: [
            "Advanced challenge problems for fast finishers",
            "Independent research and exploration project",
            "Peer teaching and mentoring opportunities",
            "Community connection and real-world application"
          ]
        }
      };
    }
    
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

    // Generate cache key for this lesson
    const cacheKey = generateLessonCacheKey(context);
    
    // Check if we have this lesson cached
    const cachedLesson = await getCachedLesson(cacheKey);
    if (cachedLesson) {
      logSuccess('🚀 Using cached lesson - no generation needed!');
      return new Response(JSON.stringify({
        success: true,
        lesson: cachedLesson,
        source: 'cache',
        timestamp: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    logInfo('🔄 No cached version found, generating new lesson...');

    // Generate adventure with budget control
    const adventure = await generateBudgetAdventure(context);

    logSuccess('✅ Adventure generation completed');

    // The adventure returned from generateBudgetAdventure is already a complete lesson
    const finalLesson = adventure;

    // Save to cache for future use
    await saveLessonToCache(cacheKey, finalLesson, context);

    return new Response(JSON.stringify({
      success: true,
      lesson: finalLesson,
      source: 'generated',
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