-- Admins can read all events (others restricted by existing policies)
DROP POLICY IF EXISTS "admins read all events" ON public.events;
CREATE POLICY "admins read all events"
ON public.events
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Retention: keep events for 30 days (requires pg_cron)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Idempotent scheduling: unschedule existing job name (if any), then schedule again
DO $$
DECLARE
  _jobid int;
BEGIN
  SELECT jobid INTO _jobid FROM cron.job WHERE jobname = 'nelie_events_retention_daily' LIMIT 1;
  IF _jobid IS NOT NULL THEN
    PERFORM cron.unschedule(_jobid);
  END IF;

  PERFORM cron.schedule(
    'nelie_events_retention_daily',
    '0 3 * * *',
    $$ delete from public.events where created_at < now() - interval '30 days' $$
  );
END$$;