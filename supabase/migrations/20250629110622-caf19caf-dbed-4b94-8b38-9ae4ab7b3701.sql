
-- Update KC: Adding Fractions with Like Denominators
UPDATE public.knowledge_components 
SET curriculum_standards = '[
  {
    "standardId": "us_std_uuid_fractions_ops",
    "standardSet": "CCSSM",
    "description": "CCSS.Math.Content.4.NF.B.3.a - Understand addition and subtraction of fractions as joining and separating parts referring to the same whole"
  },
  {
    "standardId": "dk_std_uuid_fractions_ops", 
    "standardSet": "FM",
    "description": "Fælles Mål Grade 4 - Addition og subtraktion af brøker med ens nævnere"
  }
]'::jsonb
WHERE id = 'kc_math_g4_add_fractions_likedenom';

-- Update KC: Subtracting Fractions with Like Denominators  
UPDATE public.knowledge_components
SET curriculum_standards = '[
  {
    "standardId": "us_std_uuid_fractions_ops",
    "standardSet": "CCSSM", 
    "description": "CCSS.Math.Content.4.NF.B.3.a - Understand addition and subtraction of fractions as joining and separating parts referring to the same whole"
  },
  {
    "standardId": "dk_std_uuid_fractions_ops",
    "standardSet": "FM",
    "description": "Fælles Mål Grade 4 - Addition og subtraktion af brøker med ens nævnere"
  }
]'::jsonb
WHERE id = 'kc_math_g4_subtract_fractions_likedenom';

-- Verify the updates
SELECT id, name, curriculum_standards 
FROM public.knowledge_components 
WHERE id IN ('kc_math_g4_add_fractions_likedenom', 'kc_math_g4_subtract_fractions_likedenom');
