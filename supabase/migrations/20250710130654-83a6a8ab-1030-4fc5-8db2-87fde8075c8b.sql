
-- Check if the user profile exists and examine its data
SELECT 
    user_id,
    overall_mastery,
    preferences,
    recent_performance,
    created_at,
    updated_at
FROM public.profiles 
WHERE user_id = 'ab8d3007-ed4c-4a27-93b9-8cdf6eed1b8b';

-- Check knowledge component mastery data for this user
SELECT 
    kc_id,
    mastery_level,
    attempts,
    correct_attempts,
    last_attempt_timestamp,
    history,
    created_at,
    updated_at
FROM public.knowledge_component_mastery 
WHERE user_id = 'ab8d3007-ed4c-4a27-93b9-8cdf6eed1b8b'
ORDER BY created_at DESC;

-- Get a count of total records for this user in both tables
SELECT 
    'profiles' as table_name,
    COUNT(*) as record_count
FROM public.profiles 
WHERE user_id = 'ab8d3007-ed4c-4a27-93b9-8cdf6eed1b8b'
UNION ALL
SELECT 
    'knowledge_component_mastery' as table_name,
    COUNT(*) as record_count
FROM public.knowledge_component_mastery 
WHERE user_id = 'ab8d3007-ed4c-4a27-93b9-8cdf6eed1b8b';
