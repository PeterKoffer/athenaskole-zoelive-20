-- Linter fix-pack: explicit search_path and least-privilege EXECUTE on helper functions

-- 1) Ensure explicit search_path on SECURITY DEFINER/helper functions
ALTER FUNCTION public.events_set_user_id()
  SET search_path = public;

ALTER FUNCTION public.purge_old_events()
  SET search_path = public;

ALTER FUNCTION public.has_role(uuid, text)
  SET search_path = public;

-- 2) Least-privilege EXECUTE privileges
-- purge_old_events: only high-privileged roles should be able to execute directly
REVOKE ALL ON FUNCTION public.purge_old_events() FROM PUBLIC, authenticated, anon;
GRANT EXECUTE ON FUNCTION public.purge_old_events() TO postgres, supabase_admin;

-- events_set_user_id: revoke broad EXECUTE (triggers don't require it, but safe to tidy)
REVOKE ALL ON FUNCTION public.events_set_user_id() FROM PUBLIC, authenticated, anon;
GRANT EXECUTE ON FUNCTION public.events_set_user_id() TO postgres, supabase_admin;

-- has_role: callable by app roles (policies evaluate under these roles);
REVOKE ALL ON FUNCTION public.has_role(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, text) TO authenticated, anon, service_role;