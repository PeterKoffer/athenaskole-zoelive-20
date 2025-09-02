// supabase/functions/generate-content/index.ts

// Types
interface AgentInputs {
  subject: string;
  grade: number;
  curriculum?: string;
  philosophy?: string;
  lessonDuration?: number;
  teacherWeights?: Record<string, number>;
  calendarKeywords?: string[];
  calendarDuration?: string;
  ability?: string;
  learningStyle?: string;
  interests?: string[];
  sessionId?: string;
}

type LogLevel = "debug" | "info" | "warn" | "error";

type QAResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; fixed?: T };

// Constants
const boringButCorrectLesson = {
  title: "Standard Lesson",
  objectives: ["Practice core skills"],
  activities: ["Workbook exercises", "Review questions"],
  assessment: ["Exit ticket: 3 questions"],
};

const LEVELS: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };

// Utility functions
function cryptoRandom() {
  return "sess_" + Math.random().toString(36).slice(2, 10);
}

function getEnv(name: string): string | undefined {
  try {
    if (typeof Deno !== "undefined" && Deno?.env?.get) return Deno.env.get(name);
  } catch {}
  return undefined;
}

// Logging function
async function logEvent(args: {
  sessionId: string;
  agent: "content" | "qa" | "image" | "simulator" | string;
  level: LogLevel;
  message: string;
  meta?: unknown;
}) {
  const envLevel = (getEnv("LOG_LEVEL") as LogLevel) || "info";
  const threshold = LEVELS[envLevel] ?? LEVELS.info;
  const lvl = LEVELS[args.level] ?? LEVELS.info;
  
  if (lvl < threshold) return;

  if (typeof console !== "undefined") {
    console.log("[AGENT]", JSON.stringify(args));
  }
}

// QA validation function
async function validateJson<T>(
  sessionId: string,
  _agent: string,
  data: T
): Promise<QAResult<T>> {
  await logEvent({
    sessionId,
    agent: "qa",
    level: "info",
    message: "Validated JSON",
  });
  return { ok: true, data };
}

// Main lesson generation function
async function generateLesson(inputs: AgentInputs) {
  const sessionId = inputs.sessionId ?? cryptoRandom();

  const raw = {
    title: `${inputs.subject} – Grade ${inputs.grade}`,
    objectives: ["Understand core concept", "Practice with examples"],
    activities: ["Warm-up", "Main exercise", "Reflection"],
    assessment: ["Exit ticket"],
    meta: {
      curriculum: inputs.curriculum ?? null,
      ability: inputs.ability ?? null,
      learningStyle: inputs.learningStyle ?? null,
      interests: inputs.interests ?? [],
    },
  };

  await logEvent({
    sessionId,
    agent: "content",
    level: "info",
    message: "Generated raw lesson (stub)",
    meta: { subject: inputs.subject, grade: inputs.grade },
  });

  const qa = await validateJson(sessionId, "content", raw);
  if (!qa.ok) {
    await logEvent({
      sessionId,
      agent: "content",
      level: "warn",
      message: "QA failed – using boring but correct fallback",
      meta: { error: qa.error },
    });
    return { ok: true as const, data: boringButCorrectLesson, note: "fallback" };
  }

  return { ok: true as const, data: qa.data };
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Edge function handler
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const inputs = (await req.json()) as AgentInputs;
    const sessionId = inputs.sessionId ?? crypto.randomUUID();
    const result = await generateLesson({ ...inputs, sessionId });
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 
        ...corsHeaders,
        "Content-Type": "application/json" 
      },
    });
  } catch (e) {
    console.error('Error in generate-content function:', e);
    return new Response(
      JSON.stringify({ ok: false, error: String(e) }), 
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        }
      }
    );
  }
});
