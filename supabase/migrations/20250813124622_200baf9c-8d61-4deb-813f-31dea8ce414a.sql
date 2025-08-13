-- Scores: one row per (game, user, period). Keep only best score per period.
CREATE TABLE IF NOT EXISTS public.scores (
  game_id     text NOT NULL,
  user_id     uuid NOT NULL,
  school_id   text NULL,
  country     text NULL,
  period      date NOT NULL DEFAULT current_date, -- daily boards to start
  score       integer NOT NULL CHECK (score >= 0),
  meta        jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (game_id, user_id, period)
);

-- Helpful function to read JWT claims (school/country)
CREATE OR REPLACE FUNCTION public.jwt_claim(text) RETURNS text
LANGUAGE sql STABLE AS $$
  SELECT coalesce( current_setting('request.jwt.claims', true)::jsonb ->> $1, '' );
$$;

-- Enable RLS
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;

-- Write: self only
DROP POLICY IF EXISTS "insert own score" ON public.scores;
CREATE POLICY "insert own score" ON public.scores
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update own score" ON public.scores;
CREATE POLICY "update own score" ON public.scores
FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Read: allow everyone to read leaderboard rows
DROP POLICY IF EXISTS "read scores" ON public.scores;
CREATE POLICY "read scores" ON public.scores
FOR SELECT TO authenticated
USING (true);

-- Upsert RPC: will *only* write your own row, and stamps school/country from JWT
CREATE OR REPLACE FUNCTION public.submit_score(
  p_game_id text, p_score integer, p_meta jsonb DEFAULT '{}'::jsonb
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.scores (game_id, user_id, school_id, country, score, meta)
  VALUES (
    p_game_id,
    auth.uid(),
    nullif(jwt_claim('school_id'), ''),
    nullif(jwt_claim('country'), ''),
    p_score,
    coalesce(p_meta, '{}'::jsonb)
  )
  ON CONFLICT (game_id, user_id, period) DO UPDATE
    SET score = GREATEST(excluded.score, public.scores.score),
        meta = CASE WHEN excluded.score > public.scores.score THEN excluded.meta ELSE public.scores.meta END,
        updated_at = now();
END;
$$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS scores_game_period_idx ON public.scores (game_id, period, score DESC);
CREATE INDEX IF NOT EXISTS scores_school_idx ON public.scores (school_id, period, score DESC);
CREATE INDEX IF NOT EXISTS scores_country_idx ON public.scores (country, period, score DESC);

-- Trigger for updated_at
CREATE TRIGGER update_scores_updated_at
  BEFORE UPDATE ON public.scores
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_set_timestamp();