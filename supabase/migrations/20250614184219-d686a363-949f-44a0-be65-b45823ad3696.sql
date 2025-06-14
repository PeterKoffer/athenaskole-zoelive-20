
-- Add avatar_color column to profiles table
ALTER TABLE public.profiles ADD COLUMN avatar_color text DEFAULT 'from-purple-400 to-cyan-400';
