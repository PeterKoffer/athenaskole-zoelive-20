
-- Insert pilot content atoms for kc_math_g4_add_fractions_likedenom

-- 1. Explanation Atom (English)
INSERT INTO content_atoms (atom_type, content, kc_ids, metadata) VALUES (
  'TEXT_EXPLANATION',
  '{"text": "To add fractions with the same denominator, you add the numerators together and keep the denominator the same. For example, 1/4 + 2/4 = (1+2)/4 = 3/4."}'::jsonb,
  ARRAY['kc_math_g4_add_fractions_likedenom'],
  '{"difficulty": 2, "learningStyles": ["visual", "reading_writing"], "language": "en-US"}'::jsonb
);

-- 2. Explanation Atom (Danish Placeholder)
INSERT INTO content_atoms (atom_type, content, kc_ids, metadata) VALUES (
  'TEXT_EXPLANATION',
  '{"text": "[DA] For at addere brøker med samme nævner, adderer du tællerne og beholder nævneren. For eksempel, 1/4 + 2/4 = (1+2)/4 = 3/4."}'::jsonb,
  ARRAY['kc_math_g4_add_fractions_likedenom'],
  '{"difficulty": 2, "learningStyles": ["visual", "reading_writing"], "language": "da-DK"}'::jsonb
);

-- 3. Question Atom (English)
INSERT INTO content_atoms (atom_type, content, kc_ids, metadata) VALUES (
  'QUESTION_MULTIPLE_CHOICE',
  '{"question": "What is 2/5 + 1/5?", "options": ["3/10", "2/5", "3/5", "2/10"], "correctAnswerIndex": 2, "explanation": "When adding fractions with the same denominator, add the numerators: 2 + 1 = 3. Keep the denominator: 5. So the answer is 3/5."}'::jsonb,
  ARRAY['kc_math_g4_add_fractions_likedenom'],
  '{"difficulty": 2, "language": "en-US"}'::jsonb
);

-- 4. Question Atom (Danish Placeholder)
INSERT INTO content_atoms (atom_type, content, kc_ids, metadata) VALUES (
  'QUESTION_MULTIPLE_CHOICE',
  '{"question": "[DA] Hvad er 2/5 + 1/5?", "options": ["3/10", "2/5", "3/5", "2/10"], "correctAnswerIndex": 2, "explanation": "[DA] Når man adderer brøker med samme nævner, adderer man tællerne: 2 + 1 = 3. Behold nævneren: 5. Så svaret er 3/5."}'::jsonb,
  ARRAY['kc_math_g4_add_fractions_likedenom'],
  '{"difficulty": 2, "language": "da-DK"}'::jsonb
);
