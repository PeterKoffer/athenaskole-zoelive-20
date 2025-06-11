
-- Create table to track lesson progress for resuming sessions
CREATE TABLE public.lesson_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  skill_area TEXT NOT NULL,
  current_activity_index INTEGER NOT NULL DEFAULT 0,
  total_activities INTEGER NOT NULL DEFAULT 0,
  lesson_data JSONB DEFAULT '{}',
  score INTEGER DEFAULT 0,
  time_elapsed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_completed BOOLEAN DEFAULT false,
  
  -- Ensure one active lesson progress per user/subject/skill combination
  UNIQUE(user_id, subject, skill_area)
);

-- Add RLS policies for lesson progress
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own lesson progress" 
  ON public.lesson_progress 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own lesson progress" 
  ON public.lesson_progress 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lesson progress" 
  ON public.lesson_progress 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lesson progress" 
  ON public.lesson_progress 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create table for subject-specific question templates
CREATE TABLE public.subject_question_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subject TEXT NOT NULL,
  skill_area TEXT NOT NULL,
  question_template TEXT NOT NULL,
  options_template JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation_template TEXT,
  difficulty_level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert subject-specific question templates
INSERT INTO public.subject_question_templates (subject, skill_area, question_template, options_template, correct_answer, explanation_template, difficulty_level) VALUES
('creative-arts', 'color-theory', 'Which colors are considered primary colors in traditional art?', '["Red, Blue, Yellow", "Red, Green, Blue", "Yellow, Orange, Purple", "Blue, Green, Orange"]', 0, 'Primary colors are Red, Blue, and Yellow - they cannot be created by mixing other colors.', 1),
('creative-arts', 'drawing', 'What technique involves creating different shades by varying the spacing of lines?', '["Hatching", "Blending", "Stippling", "Smudging"]', 0, 'Hatching is a drawing technique that uses parallel lines to create shading effects.', 1),
('creative-arts', 'crafts', 'Which material is best for making paper sculptures?', '["Cardstock", "Tissue paper", "Newspaper", "Foil"]', 0, 'Cardstock is sturdy enough to hold shapes while being easy to cut and fold.', 1),
('computer-science', 'programming', 'What is a variable in programming?', '["A container that stores data", "A type of loop", "A function", "An error message"]', 0, 'A variable is like a labeled box that holds information we can use and change in our program.', 1),
('computer-science', 'algorithms', 'What is an algorithm?', '["A step-by-step solution to a problem", "A type of computer", "A programming language", "A website"]', 0, 'An algorithm is a clear set of instructions that tells us how to solve a problem step by step.', 1),
('computer-science', 'digital-citizenship', 'What should you do if someone asks for your password online?', '["Never share it with anyone", "Share it only with friends", "Share it with teachers", "Post it on social media"]', 0, 'Passwords should never be shared with anyone to keep your accounts safe and secure.', 1),
('science', 'biology', 'What part of the plant makes food through photosynthesis?', '["Leaves", "Roots", "Stems", "Flowers"]', 0, 'Leaves contain chlorophyll which captures sunlight to make food for the plant.', 1),
('science', 'chemistry', 'What happens when you mix baking soda and vinegar?', '["It creates a fizzy reaction", "Nothing happens", "It gets very hot", "It changes color only"]', 0, 'Baking soda and vinegar create a chemical reaction that produces carbon dioxide gas, making it fizzy.', 1),
('science', 'physics', 'What force pulls objects toward the Earth?', '["Gravity", "Magnetism", "Electricity", "Friction"]', 0, 'Gravity is the force that pulls all objects toward the center of the Earth.', 1),
('english', 'reading', 'What is the main idea of a story called?', '["Theme", "Plot", "Character", "Setting"]', 0, 'The theme is the central message or main idea that the author wants to share.', 1),
('english', 'writing', 'Which punctuation mark ends a question?', '["Question mark (?)", "Period (.)", "Exclamation mark (!)", "Comma (,)"]', 0, 'Questions always end with a question mark to show that someone is asking something.', 1),
('english', 'grammar', 'What type of word describes an action?', '["Verb", "Noun", "Adjective", "Adverb"]', 0, 'Verbs are action words that tell us what someone or something is doing.', 1);

-- Add more varied questions for each subject
INSERT INTO public.subject_question_templates (subject, skill_area, question_template, options_template, correct_answer, explanation_template, difficulty_level) VALUES
('creative-arts', 'color-theory', 'What happens when you mix red and yellow paint?', '["Orange", "Purple", "Green", "Brown"]', 0, 'Red and yellow are primary colors that combine to create the secondary color orange.', 1),
('creative-arts', 'drawing', 'Which pencil creates the darkest lines?', '["6B", "2H", "HB", "4H"]', 0, 'B pencils are softer and create darker marks, with 6B being very dark and soft.', 2),
('computer-science', 'programming', 'What does a loop do in programming?', '["Repeats instructions", "Stores data", "Displays output", "Connects to internet"]', 0, 'Loops allow us to repeat the same instructions multiple times without writing them over and over.', 1),
('science', 'biology', 'Which organ pumps blood through your body?', '["Heart", "Lungs", "Brain", "Stomach"]', 0, 'The heart is a muscle that pumps blood to carry oxygen and nutrients throughout your body.', 1),
('english', 'reading', 'What do we call the people in a story?', '["Characters", "Authors", "Readers", "Plots"]', 0, 'Characters are the people, animals, or beings that the story is about.', 1);
