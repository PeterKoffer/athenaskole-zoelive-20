-- Universe Image System Observability Queries
-- Copy-paste these into Supabase SQL Editor for monitoring

-- 1. Image source distribution (AI vs fallback ratio)
SELECT 
  source,
  count(*) as total,
  round(count(*) * 100.0 / sum(count(*)) over (), 1) as percentage
FROM universe_images 
GROUP BY source
ORDER BY total DESC;

-- 2. Recent bulk job performance
SELECT 
  id,
  started_at,
  finished_at,
  total,
  success,
  failed,
  skipped,
  round(success * 100.0 / NULLIF(total, 0), 1) as success_rate_pct,
  extract(epoch from (finished_at - started_at)) as duration_seconds,
  notes
FROM universe_image_jobs
ORDER BY started_at DESC
LIMIT 10;

-- 3. Images generated per day (trend analysis)
SELECT 
  date_trunc('day', created_at) as date,
  source,
  count(*) as images_generated
FROM universe_images
WHERE created_at >= current_date - interval '7 days'
GROUP BY 1, 2
ORDER BY 1 DESC, 2;

-- 4. Universe coverage analysis
-- Shows which universes have images vs those that don't
WITH universe_stats AS (
  SELECT 
    ui.universe_id,
    ui.source,
    ui.created_at as image_generated_at,
    CASE WHEN ui.universe_id IS NOT NULL THEN 'has_image' ELSE 'missing_image' END as status
  FROM universe_images ui
)
SELECT 
  status,
  count(*) as total
FROM universe_stats
GROUP BY status;

-- 5. Performance metrics (generation times)
-- Note: Only available for recent generations with duration tracking
SELECT 
  source,
  count(*) as total_requests,
  round(avg(duration_ms), 0) as avg_duration_ms,
  round(min(duration_ms), 0) as min_duration_ms,
  round(max(duration_ms), 0) as max_duration_ms
FROM (
  -- This would need to be tracked in a separate metrics table
  -- For now, we can estimate based on job timing
  SELECT 
    'bulk' as source,
    extract(epoch from (finished_at - started_at)) * 1000 / NULLIF(total, 0) as duration_ms
  FROM universe_image_jobs
  WHERE finished_at IS NOT NULL AND total > 0
) metrics
GROUP BY source;

-- 6. Find universes that failed generation
SELECT 
  universe_id,
  source,
  image_url,
  created_at
FROM universe_images
WHERE source = 'fallback'
ORDER BY created_at DESC
LIMIT 20;

-- 7. Storage usage estimation
SELECT 
  count(*) as total_images,
  count(*) FILTER (WHERE source = 'ai') as ai_images,
  count(*) FILTER (WHERE source = 'fallback') as fallback_images,
  round(count(*) FILTER (WHERE source = 'ai') * 1.5, 1) as estimated_storage_mb -- Rough estimate: 1.5MB per AI image
FROM universe_images;

-- 8. Daily generation rate (for capacity planning)
SELECT 
  date_trunc('day', created_at) as date,
  count(*) as images_generated,
  count(*) FILTER (WHERE source = 'ai') as ai_generated,
  count(*) FILTER (WHERE source = 'fallback') as fallbacks_used
FROM universe_images
WHERE created_at >= current_date - interval '30 days'
GROUP BY 1
ORDER BY 1 DESC;

-- 9. Job queue health check
SELECT 
  COUNT(*) as total_jobs,
  COUNT(*) FILTER (WHERE finished_at IS NOT NULL) as completed_jobs,
  COUNT(*) FILTER (WHERE finished_at IS NULL) as running_jobs,
  MAX(started_at) as last_job_started,
  MAX(finished_at) as last_job_completed
FROM universe_image_jobs;

-- 10. Error rate monitoring
SELECT 
  date_trunc('hour', started_at) as hour,
  COUNT(*) as total_jobs,
  SUM(failed) as total_failures,
  SUM(success) as total_successes,
  round(SUM(failed) * 100.0 / NULLIF(SUM(total), 0), 1) as failure_rate_pct
FROM universe_image_jobs
WHERE started_at >= current_timestamp - interval '24 hours'
GROUP BY 1
ORDER BY 1 DESC;
