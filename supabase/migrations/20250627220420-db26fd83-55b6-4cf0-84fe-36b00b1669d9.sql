
-- Add sample content atoms for the missing Knowledge Components
INSERT INTO content_atoms (atom_type, content, kc_ids, metadata, version, author_id) VALUES
(
  'TEXT_EXPLANATION',
  '{
    "title": "Understanding Decimal Multiplication", 
    "explanation": "When multiplying decimals, we multiply the numbers as if they were whole numbers, then count the total number of decimal places in both factors and place the decimal point in the product.",
    "examples": ["2.5 × 1.2 = 3.0", "0.75 × 0.4 = 0.30"]
  }',
  ARRAY['kc_math_g5_multiply_decimals'],
  '{"difficulty": 0.6, "estimatedTime": 120}',
  1,
  NULL
),
(
  'QUESTION_MULTIPLE_CHOICE',
  '{
    "question": "What is 2.3 × 1.4?",
    "options": ["3.22", "3.2", "32.2", "0.322"],
    "correctAnswer": 0,
    "correctFeedback": "Correct! 2.3 × 1.4 = 3.22. We multiply 23 × 14 = 322, then place the decimal point 2 places from the right.",
    "generalIncorrectFeedback": "Remember to count decimal places: 2.3 has 1 decimal place, 1.4 has 1 decimal place, so the answer should have 2 decimal places."
  }',
  ARRAY['kc_math_g5_multiply_decimals'],
  '{"difficulty": 0.7, "estimatedTime": 90}',
  1,
  NULL
),
(
  'QUESTION_MULTIPLE_CHOICE',
  '{
    "question": "What is 0.6 × 0.8?",
    "options": ["0.48", "4.8", "0.048", "48"],
    "correctAnswer": 0,
    "correctFeedback": "Excellent! 0.6 × 0.8 = 0.48. Both numbers have 1 decimal place each, so the product has 2 decimal places.",
    "generalIncorrectFeedback": "When multiplying decimals, count the decimal places in both numbers and add them together to find where to place the decimal in your answer."
  }',
  ARRAY['kc_math_g5_multiply_decimals'],
  '{"difficulty": 0.5, "estimatedTime": 75}',
  1,
  NULL
),
(
  'TEXT_EXPLANATION',
  '{
    "title": "Decimal Multiplication Steps", 
    "explanation": "Step 1: Ignore the decimal points and multiply as whole numbers. Step 2: Count decimal places in both original numbers. Step 3: Place the decimal point in your answer, counting from the right.",
    "examples": ["1.25 × 0.3: First 125 × 3 = 375, then 2+1=3 decimal places, so 0.375"]
  }',
  ARRAY['kc_math_g5_multiply_decimals'],
  '{"difficulty": 0.4, "estimatedTime": 100}',
  1,
  NULL
);

-- Add content atoms for other common grade 4-5 math KCs that might be recommended
INSERT INTO content_atoms (atom_type, content, kc_ids, metadata, version, author_id) VALUES
(
  'QUESTION_MULTIPLE_CHOICE',
  '{
    "question": "What is 3/8 - 1/8?",
    "options": ["2/8", "1/4", "Both A and B", "4/8"],
    "correctAnswer": 2,
    "correctFeedback": "Perfect! 3/8 - 1/8 = 2/8, which simplifies to 1/4. Both answers are correct!",
    "generalIncorrectFeedback": "When subtracting fractions with the same denominator, subtract the numerators and keep the denominator the same."
  }',
  ARRAY['kc_math_g4_subtract_fractions_likedenom'],
  '{"difficulty": 0.6, "estimatedTime": 80}',
  1,
  NULL
),
(
  'TEXT_EXPLANATION',
  '{
    "title": "Subtracting Like Fractions", 
    "explanation": "When fractions have the same denominator (bottom number), we subtract the numerators (top numbers) and keep the denominator the same.",
    "examples": ["5/6 - 2/6 = 3/6 = 1/2", "7/10 - 3/10 = 4/10 = 2/5"]
  }',
  ARRAY['kc_math_g4_subtract_fractions_likedenom'],
  '{"difficulty": 0.4, "estimatedTime": 90}',
  1,
  NULL
);
