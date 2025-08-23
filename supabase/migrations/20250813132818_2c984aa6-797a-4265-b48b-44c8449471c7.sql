-- 1) Recreate RPC as SECURITY INVOKER (don't bypass RLS)
create or replace function public.submit_score(
  p_game_id text,
  p_score integer,
  p_meta jsonb default '{}'::jsonb
) returns void
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
begin
  insert into public.scores (game_id, user_id, school_id, country, score, meta)
  values (
    p_game_id,
    auth.uid(),
    nullif(public.jwt_claim('school_id'), ''),
    nullif(public.jwt_claim('country'), ''),
    p_score,
    coalesce(p_meta, '{}'::jsonb)
  )
  on conflict (game_id, user_id, period) do update
    set score = greatest(excluded.score, public.scores.score),
        meta  = case when excluded.score > public.scores.score then excluded.meta else public.scores.meta end,
        updated_at = now();
end;
$$;

-- 2) Tighten EXECUTE privileges (least privilege)
revoke all on function public.submit_score(text, integer, jsonb) from public;
grant  execute on function public.submit_score(text, integer, jsonb) to authenticated, service_role;

-- (Optional) If you previously granted to anon, remove it explicitly:
revoke all on function public.submit_score(text, integer, jsonb) from anon;

-- 3) Double-check table grants are clean (no direct table GRANTs to PUBLIC)
revoke all on public.scores from public;