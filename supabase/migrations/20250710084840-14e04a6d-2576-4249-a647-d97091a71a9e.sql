-- Migration: Create learner profile and knowledge component mastery tables

-- Table: profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    overall_mastery DOUBLE PRECISION DEFAULT 0.0,
    preferences JSONB,
    recent_performance JSONB, -- Stores an array of numbers, e.g., [0.8, 0.5, 0.9]
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS 'Stores learner profile information, linking to authenticated users.';
COMMENT ON COLUMN public.profiles.user_id IS 'References the authenticated user in auth.users.';
COMMENT ON COLUMN public.profiles.overall_mastery IS 'An aggregated mastery score across all KCs, calculated by the application.';
COMMENT ON COLUMN public.profiles.preferences IS 'Stores LearnerPreferences object, e.g., { learningStyle: "visual", difficultyPreference: 0.7, sessionLength: 30 }.';
COMMENT ON COLUMN public.profiles.recent_performance IS 'Stores an array of recent performance scores, e.g., last 5 interaction scores.';

-- Enable Row Level Security (RLS) for profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow individual user read access to their own profile"
ON public.profiles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow individual user to create their own profile"
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow individual user to update their own profile"
ON public.profiles FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Table: knowledge_component_mastery (kc_mastery)
CREATE TABLE IF NOT EXISTS public.knowledge_component_mastery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    kc_id TEXT NOT NULL,
    mastery_level DOUBLE PRECISION DEFAULT 0.5,
    attempts INTEGER DEFAULT 0,
    correct_attempts INTEGER DEFAULT 0,
    last_attempt_timestamp TIMESTAMPTZ,
    history JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_kc UNIQUE (user_id, kc_id)
);

COMMENT ON TABLE public.knowledge_component_mastery IS 'Stores mastery information for each knowledge component per user.';
COMMENT ON COLUMN public.knowledge_component_mastery.kc_id IS 'Identifier for the knowledge component (e.g., "kc-math-addition-1").';
COMMENT ON COLUMN public.knowledge_component_mastery.mastery_level IS 'Current mastery level (0.0 to 1.0) for this KC.';
COMMENT ON COLUMN public.knowledge_component_mastery.history IS 'A capped array of recent InteractionEvent objects related to this KC.';

ALTER TABLE public.knowledge_component_mastery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow individual user read access to their own kc_mastery"
ON public.knowledge_component_mastery FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow individual user to create their own kc_mastery"
ON public.knowledge_component_mastery FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow individual user to update their own kc_mastery"
ON public.knowledge_component_mastery FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE TRIGGER set_kc_mastery_updated_at
BEFORE UPDATE ON public.knowledge_component_mastery
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();