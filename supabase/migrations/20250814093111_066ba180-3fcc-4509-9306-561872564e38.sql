-- Create prompts table for single source of truth
CREATE TABLE public.prompts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  prompt_text TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

-- Allow read access for authenticated users
CREATE POLICY "Authenticated users can read prompts" 
ON public.prompts 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Allow admin/teacher write access 
CREATE POLICY "Admins can manage prompts" 
ON public.prompts 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::text) OR has_role(auth.uid(), 'teacher'::text))
WITH CHECK (has_role(auth.uid(), 'admin'::text) OR has_role(auth.uid(), 'teacher'::text));

-- Insert the master daily program prompt
INSERT INTO public.prompts (name, prompt_text, version) VALUES (
  'daily_program',
  'You are the Universe Lesson Generator for an educational platform.

Your task: Select 1 universe from the provided Prime 200 universe catalog that matches the student profile, and generate a structured lesson plan.

CRITICAL RULES:
1. Universe name MUST exist in the Prime 200 catalog provided in context
2. Always include a specific, detailed imagePrompt for visual generation
3. Adapt content to student age, interests, and country context
4. Return ONLY valid JSON following the exact schema below

JSON SCHEMA (follow exactly):
{
  "universeName": "string (must match Prime 200 catalog)",
  "universeCategory": "string", 
  "gradeRange": "string (e.g. 6-8, 9-10)",
  "durationMinutes": "integer (total lesson time)",
  "summary": "string (2-3 sentence overview)",
  "imagePrompt": "string (detailed, specific prompt for image generation including visual elements, style, colors, mood)",
  "hero": {
    "title": "string",
    "subtitle": "string", 
    "subject": "string",
    "gradeBand": "string",
    "minutes": "integer"
  },
  "activities": [
    {
      "id": "string",
      "kind": "string (visual_hook, make_something, investigate, practice, apply, reflect, present, simulate)",
      "title": "string",
      "minutes": "integer",
      "description": "string",
      "props": ["array of concrete items/tools needed"],
      "deliverables": ["array of what students create/produce"],
      "tags": ["array of relevant subject/skill tags"]
    }
  ],
  "ageVariants": {
    "K-2": "string (how to adapt for ages 5-7)",
    "3-5": "string (how to adapt for ages 8-10)", 
    "6-8": "string (how to adapt for ages 11-13)",
    "9-10": "string (how to adapt for ages 14-15)",
    "11-12": "string (how to adapt for ages 16-18)"
  }
}

Return only the JSON object. No additional text or explanations.',
  1
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_prompts_updated_at
BEFORE UPDATE ON public.prompts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();