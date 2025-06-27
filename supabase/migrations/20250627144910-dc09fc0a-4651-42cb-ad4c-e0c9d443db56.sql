
-- Insert sample content atoms for testing the adaptive practice module
INSERT INTO public.content_atoms (id, atom_type, content, kc_ids) VALUES 
(
  gen_random_uuid(),
  'TEXT_EXPLANATION',
  '{
    "title": "Adding Fractions with Like Denominators",
    "explanation": "When adding fractions with the same denominator, you add the numerators and keep the denominator the same. For example: 1/4 + 2/4 = 3/4",
    "examples": [
      "1/5 + 2/5 = 3/5",
      "3/8 + 1/8 = 4/8 = 1/2",
      "2/7 + 3/7 = 5/7"
    ]
  }'::jsonb,
  ARRAY['kc_math_g4_add_fractions_likedenom']
),
(
  gen_random_uuid(),
  'QUESTION_MULTIPLE_CHOICE',
  '{
    "question": "What is 2/6 + 1/6?",
    "options": ["3/6", "3/12", "2/12", "1/6"],
    "correctAnswer": 0,
    "correctFeedback": "Excellent! When adding fractions with like denominators, we add the numerators: 2 + 1 = 3, and keep the denominator: 3/6 = 1/2",
    "generalIncorrectFeedback": "Remember: when adding fractions with the same denominator, add the numerators and keep the denominator the same."
  }'::jsonb,
  ARRAY['kc_math_g4_add_fractions_likedenom']
),
(
  gen_random_uuid(),
  'TEXT_EXPLANATION',
  '{
    "title": "Subtracting Fractions with Like Denominators", 
    "explanation": "When subtracting fractions with the same denominator, you subtract the numerators and keep the denominator the same. For example: 3/4 - 1/4 = 2/4 = 1/2",
    "examples": [
      "4/5 - 1/5 = 3/5",
      "5/8 - 2/8 = 3/8", 
      "6/7 - 2/7 = 4/7"
    ]
  }'::jsonb,
  ARRAY['kc_math_g4_subtract_fractions_likedenom']
),
(
  gen_random_uuid(),
  'QUESTION_MULTIPLE_CHOICE',
  '{
    "question": "What is 5/8 - 2/8?",
    "options": ["3/8", "3/16", "7/8", "3/0"],
    "correctAnswer": 0,
    "correctFeedback": "Perfect! When subtracting fractions with like denominators: 5 - 2 = 3, so 5/8 - 2/8 = 3/8",
    "generalIncorrectFeedback": "When subtracting fractions with the same denominator, subtract the numerators and keep the denominator the same."
  }'::jsonb,
  ARRAY['kc_math_g4_subtract_fractions_likedenom']
),
(
  gen_random_uuid(),
  'INTERACTIVE_EXERCISE',
  '{
    "title": "Practice Adding Fractions",
    "description": "Interactive exercise for practicing fraction addition",
    "exerciseType": "drag_and_drop",
    "components": {
      "problem": "1/3 + 1/3 = ?",
      "answer": "2/3"
    }
  }'::jsonb,
  ARRAY['kc_math_g4_add_fractions_likedenom']
);
