-- Fix the update_updated_at_column function to have proper search path
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql security definer set search_path = public;