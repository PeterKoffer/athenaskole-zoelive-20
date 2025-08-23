DO $$
DECLARE
  v_owner uuid;

  subjects         text[] := ARRAY[
    'Native language','Mathematics','Language lab','Science',
    'History & Religion','Geography','Computer and technology','Creative arts',
    'Music discovery','Physical education','Mental Wellness','Life Essentials'
  ];

  subject_slugs    text[] := ARRAY[
    'native-language','mathematics','language-lab','science',
    'history-religion','geography','computer-and-technology','creative-arts',
    'music-discovery','physical-education','mental-wellness','life-essentials'
  ];

  subject_category jsonb := '{
    "native-language":"Native Language & Literacy",
    "mathematics":"Mathematics & Quantitative Reasoning",
    "language-lab":"World Languages Lab",
    "science":"Science & Exploration",
    "history-religion":"History & Religion",
    "geography":"Geography & Global Studies",
    "computer-and-technology":"Computer & Technology",
    "creative-arts":"Creative Arts & Media Production",
    "music-discovery":"Music Discovery & Performance",
    "physical-education":"Physical Education & Movement",
    "mental-wellness":"Mental Wellness",
    "life-essentials":"Life Essentials"
  }'::jsonb;

BEGIN
  -- reuse a valid owner_id to satisfy FK
  SELECT owner_id INTO v_owner FROM public.universes LIMIT 1;
  IF v_owner IS NULL THEN
    RAISE EXCEPTION 'No owner_id found in universes. Create at least one universe (with a real user) first, then rerun.';
  END IF;

  INSERT INTO public.universes
    (id, owner_id, slug, title, subject, grade_level, description, metadata, visibility)
  SELECT
    gen_random_uuid(),
    v_owner,
    ('auto-' || subject_slugs[((i-1) % array_length(subjects,1)) + 1] || '-' || to_char( ((i-1)/12)+1 , 'FM000'))::text AS slug,
    initcap(subjects[((i-1) % array_length(subjects,1)) + 1]) || ' Quest ' || to_char( ((i-1)/12)+1 , 'FM000') AS title,
    subjects[((i-1) % array_length(subjects,1)) + 1] AS subject,     -- <-- EXACT labels you provided
    '6-12' AS grade_level,
    'Auto-generated universe #' || i || ' in ' || subjects[((i-1) % array_length(subjects,1)) + 1] || '.' AS description,
    jsonb_build_object(
      'category', subject_category -> (subject_slugs[((i-1) % array_length(subjects,1)) + 1]),
      'subjectSlug', subject_slugs[((i-1) % array_length(subjects,1)) + 1],
      'tags', ARRAY[
        subject_slugs[((i-1) % array_length(subjects,1)) + 1],
        'project','challenge'
      ]::text[],
      'imagePrompt',
        'bright kid-friendly ' ||
        replace(subjects[((i-1) % array_length(subjects,1)) + 1], '&','and') ||
        ' scene, simple shapes, high-contrast',
      'parameters', jsonb_build_object(
        'supports', ARRAY['lang','difficulty','length','groupSize','theme','nativeLocale','targetLanguage']::text[],
        'defaults', jsonb_build_object(
          'lang','en','difficulty','mixed','length',60,'groupSize','1-4','theme','standard',
          'nativeLocale','auto','targetLanguage','auto'
        )
      )
    ),
    'public'
  FROM generate_series(1, 300) AS g(i)
  ON CONFLICT (slug) DO NOTHING;  -- idempotent
END $$;