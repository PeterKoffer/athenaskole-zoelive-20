-- Fix the trigger function to have a secure search_path
create or replace function public.trigger_set_timestamp()
returns trigger 
language plpgsql 
security definer
set search_path = public, pg_temp
as $$
begin 
  new.updated_at = now(); 
  return new; 
end; 
$$;