
-- Insert the missing knowledge components that the localization test is looking for
INSERT INTO knowledge_components (id, name, description, subject, domain, grade_levels, difficulty_estimate) VALUES
(
  'kc_math_g4_add_fractions_likedenom',
  'Adding Fractions with Like Denominators',
  'Understanding how to add fractions that have the same denominator',
  'mathematics',
  'fractions',
  ARRAY[4, 5],
  0.6
),
(
  'kc_math_g4_subtract_fractions_likedenom', 
  'Subtracting Fractions with Like Denominators',
  'Understanding how to subtract fractions that have the same denominator',
  'mathematics', 
  'fractions',
  ARRAY[4, 5],
  0.6
);
