import {
  Calculator,
  BookOpen,
  Code,
  Music,
  Globe,
  Brain,
  Languages,
  ScrollText,
  Map,
  HeartPulse,
  ClipboardCheck
} from 'lucide-react';

export interface SkillArea {
  id: string;
  name: string;
  description: string;
  route: string;
}

export interface SubjectData {
  id: string;
  name: string;
  icon: any;
  skillAreas: SkillArea[];
}

export const subjectsData: SubjectData[] = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    icon: Calculator,
    skillAreas: [
      { id: 'fractions', name: 'Fractions', description: 'Adding, subtracting, and working with fractions', route: '/learn/mathematics' },
      { id: 'arithmetic', name: 'Arithmetic', description: 'Basic math operations and number sense', route: '/learn/mathematics' },
      { id: 'geometry', name: 'Geometry', description: 'Shapes, angles, and spatial reasoning', route: '/learn/mathematics' },
      { id: 'algebra', name: 'Algebra', description: 'Variables, equations, and problem solving', route: '/learn/mathematics' }
    ]
  },
  {
    id: 'english',
    name: 'English',
    icon: BookOpen,
    skillAreas: [
      { id: 'spelling', name: 'Spelling', description: 'Word recognition and spelling patterns', route: '/learn/english' },
      { id: 'grammar', name: 'Grammar', description: 'Sentence structure and language rules', route: '/learn/english' },
      { id: 'reading', name: 'Reading', description: 'Comprehension and vocabulary building', route: '/learn/english' },
      { id: 'writing', name: 'Writing', description: 'Expression and communication skills', route: '/learn/english' }
    ]
  },
  {
    id: 'computer-science',
    name: 'Computer Science',
    icon: Code,
    skillAreas: [
      { id: 'programming', name: 'Programming', description: 'Basic coding concepts and logical thinking', route: '/learn/computer-science' },
      { id: 'algorithms', name: 'Algorithms', description: 'Problem-solving and computational thinking', route: '/learn/computer-science' },
      { id: 'ai-basics', name: 'AI Basics', description: 'Introduction to artificial intelligence concepts', route: '/learn/computer-science' },
      { id: 'data-structures', name: 'Data Structures', description: 'Organizing and managing information', route: '/learn/computer-science' }
    ]
  },
  {
    id: 'music',
    name: 'Music',
    icon: Music,
    skillAreas: [
      { id: 'music_theory', name: 'Music Theory', description: 'Understanding rhythm, melody, and harmony', route: '/learn/music' },
      { id: 'rhythm', name: 'Rhythm', description: 'Beat patterns and timing in music', route: '/learn/music' },
      { id: 'melody', name: 'Melody', description: 'Musical phrases and note sequences', route: '/learn/music' },
      { id: 'instruments', name: 'Instruments', description: 'Learning about different musical instruments', route: '/learn/music' }
    ]
  },
  {
    id: 'science',
    name: 'Science',
    icon: Globe,
    skillAreas: [
      { id: 'biology', name: 'Biology', description: 'Living organisms and life processes', route: '/learn/science' },
      { id: 'chemistry', name: 'Chemistry', description: 'Matter, atoms, and chemical reactions', route: '/learn/science' },
      { id: 'physics', name: 'Physics', description: 'Energy, motion, and physical laws', route: '/learn/science' },
      { id: 'earth-science', name: 'Earth Science', description: 'Our planet and the environment', route: '/learn/science' }
    ]
  },
  {
    id: 'mentalHealth',
    name: 'Mental Wellness',
    icon: Brain,
    skillAreas: [
      { id: 'understandingEmotions', name: 'Understanding Emotions', description: 'Learn to identify and understand your feelings and the feelings of others.', route: '/learn/mental-wellness' },
      { id: 'copingStrategies', name: 'Coping Strategies', description: 'Discover healthy ways to manage stress, anxiety, and difficult emotions.', route: '/learn/mental-wellness' },
      { id: 'mindfulnessBasics', name: 'Mindfulness Basics', description: 'Practice techniques to stay present and calm your mind.', route: '/learn/mental-wellness' },
      { id: 'buildingResilience', name: 'Building Resilience', description: 'Develop skills to bounce back from challenges and adversity.', route: '/learn/mental-wellness' },
      { id: 'empathyAndSupport', name: 'Empathy & Support', description: 'Learn how to support others and build strong, healthy relationships.', route: '/learn/mental-wellness' }
    ]
  },
  {
    id: 'languageLab',
    name: 'Language Lab',
    icon: Languages,
    skillAreas: [
      { id: 'exploreLanguages', name: 'Explore Languages', description: 'Choose a new language to learn or continue your progress.', route: '/learn/language-lab' }
    ]
  },
  {
    id: 'worldHistoryReligions',
    name: 'World History & Religions',
    icon: ScrollText,
    skillAreas: [
      { id: 'ancientHistory', name: 'Ancient History', description: 'Explore early civilizations and their legacies.', route: '/learn/world-history-religions' },
      { id: 'globalReligions', name: 'Global Religions', description: 'Understand diverse beliefs and practices.', route: '/learn/world-history-religions' }
    ]
  },
  {
    id: 'globalGeography',
    name: 'Global Geography',
    icon: Map,
    skillAreas: [
      { id: 'physicalGeography', name: 'Physical Geography', description: "Study Earth's natural features and processes.", route: '/learn/global-geography' },
      { id: 'humanGeography', name: 'Human Geography', description: 'Examine human populations and their impact.', route: '/learn/global-geography' }
    ]
  },
  {
    id: 'bodyLab',
    name: 'BodyLab: Healthy Living',
    icon: HeartPulse,
    skillAreas: [
      { id: 'nutritionFundamentals', name: 'Nutrition Fundamentals', description: 'Learn about healthy eating and diets.', route: '/learn/body-lab' },
      { id: 'fitnessForLife', name: 'Fitness for Life', description: 'Discover exercises and active habits.', route: '/learn/body-lab' }
    ]
  },
  {
    id: 'lifeEssentials',
    name: 'Life Essentials',
    icon: ClipboardCheck,
    skillAreas: [
      { id: 'personalFinance', name: 'Personal Finance', description: 'Manage budgets, savings, and investments.', route: '/learn/life-essentials' },
      { id: 'adultingSkills', name: 'Practical Adulting', description: 'Navigate household tasks and responsibilities.', route: '/learn/life-essentials' }
    ]
  }
];
