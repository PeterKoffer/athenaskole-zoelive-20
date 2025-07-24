import { CurriculumNode } from '@/types/curriculum';
import { NELIESubject } from '@/types/curriculum/NELIESubjects';

export const usPECurriculumData: CurriculumNode[] = [
  // US Physical Education Subject Node
  {
    id: 'us-pe',
    parentId: 'us-root',
    nodeType: 'subject',
    name: 'Physical Education',
    description: 'Curriculum for K-12 Physical Education in the United States, focusing on motor skills, health-related fitness, and personal and social responsibility.',
    educationalLevel: 'K-12',
    subject: NELIESubject.PHYSICAL_EDUCATION,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['physical_education', 'health', 'fitness', 'motor_skills', 'usa'],
  },

  // --- Kindergarten: Movement Foundations ---
  {
    id: 'us-k-pe',
    parentId: 'us-pe',
    nodeType: 'course',
    name: 'Kindergarten Physical Education',
    description: 'Introduction to basic motor skills, movement concepts, and cooperative play.',
    educationalLevel: 'K',
    subject: NELIESubject.PHYSICAL_EDUCATION,
    tags: ['kindergarten', 'movement_foundations'],
  },
  {
    id: 'us-k-pe-ms', parentId: 'us-k-pe', nodeType: 'domain', name: 'Movement Skills & Concepts',
    educationalLevel: 'K', subject: NELIESubject.PHYSICAL_EDUCATION,
  },
  {
    id: 'us-k-pe-ms-lo1', parentId: 'us-k-pe-ms', nodeType: 'learning_objective', name: 'Demonstrate basic locomotor skills (running, jumping, hopping).',
    educationalLevel: 'K', subject: NELIESubject.PHYSICAL_EDUCATION,
  },

  // --- Grade 1: Skill Refinement ---
  {
    id: 'us-g1-pe', parentId: 'us-pe', nodeType: 'course', name: 'Grade 1 Physical Education',
    description: 'Refining locomotor skills and introducing object control.',
    educationalLevel: '1', subject: NELIESubject.PHYSICAL_EDUCATION, tags: ['grade1', 'skill_refinement'],
  },
  {
    id: 'us-g1-pe-oc', parentId: 'us-g1-pe', nodeType: 'domain', name: 'Object Control Skills',
    educationalLevel: '1', subject: NELIESubject.PHYSICAL_EDUCATION,
  },
  {
    id: 'us-g1-pe-oc-lo1', parentId: 'us-g1-pe-oc', nodeType: 'learning_objective', name: 'Toss and catch a large ball with two hands.',
    educationalLevel: '1', subject: NELIESubject.PHYSICAL_EDUCATION,
  },

  // --- Grade 2: Combining Skills ---
  {
    id: 'us-g2-pe', parentId: 'us-pe', nodeType: 'course', name: 'Grade 2 Physical Education',
    description: 'Combining motor skills and applying them in simple games.',
    educationalLevel: '2', subject: NELIESubject.PHYSICAL_EDUCATION, tags: ['grade2', 'skill_combination'],
  },
  {
    id: 'us-g2-pe-hf', parentId: 'us-g2-pe', nodeType: 'domain', name: 'Health-Related Fitness',
    educationalLevel: '2', subject: NELIESubject.PHYSICAL_EDUCATION,
  },
  {
    id: 'us-g2-pe-hf-lo1', parentId: 'us-g2-pe-hf', nodeType: 'learning_objective', name: 'Identify activities that increase heart rate.',
    educationalLevel: '2', subject: NELIESubject.PHYSICAL_EDUCATION,
  },

  // --- Grade 3: Cooperative Play ---
  {
    id: 'us-g3-pe', parentId: 'us-pe', nodeType: 'course', name: 'Grade 3 Physical Education',
    description: 'Focus on cooperative games and applying skills with partners.',
    educationalLevel: '3', subject: NELIESubject.PHYSICAL_EDUCATION, tags: ['grade3', 'cooperative_play'],
  },
  {
    id: 'us-g3-pe-psr', parentId: 'us-g3-pe', nodeType: 'domain', name: 'Personal & Social Responsibility',
    educationalLevel: '3', subject: NELIESubject.PHYSICAL_EDUCATION,
  },
  {
    id: 'us-g3-pe-psr-lo1', parentId: 'us-g3-pe-psr', nodeType: 'learning_objective', name: 'Work cooperatively with a partner or small group.',
    educationalLevel: '3', subject: NELIESubject.PHYSICAL_EDUCATION,
  },

  // --- Grade 4: Fitness & Tactics ---
  {
    id: 'us-g4-pe', parentId: 'us-pe', nodeType: 'course', name: 'Grade 4 Physical Education',
    description: 'Introduction to fitness concepts and simple game tactics.',
    educationalLevel: '4', subject: NELIESubject.PHYSICAL_EDUCATION, tags: ['grade4', 'fitness_concepts'],
  },
  {
    id: 'us-g4-pe-hf', parentId: 'us-g4-pe', nodeType: 'domain', name: 'Health-Related Fitness',
    educationalLevel: '4', subject: NELIESubject.PHYSICAL_EDUCATION,
  },
  {
    id: 'us-g4-pe-hf-lo1', parentId: 'us-g4-pe-hf', nodeType: 'learning_objective', name: 'Describe the components of fitness (cardio, strength, flexibility).',
    educationalLevel: '4', subject: NELIESubject.PHYSICAL_EDUCATION,
  },

  // --- Grade 5: Sports & Lifetime Activities ---
  {
    id: 'us-g5-pe', parentId: 'us-pe', nodeType: 'course', name: 'Grade 5 Physical Education',
    description: 'Applying skills to modified sports and lifetime activities.',
    educationalLevel: '5', subject: NELIESubject.PHYSICAL_EDUCATION, tags: ['grade5', 'sports_skills'],
  },
  {
    id: 'us-g5-pe-sa', parentId: 'us-g5-pe', nodeType: 'domain', name: 'Specialized Activity Skills',
    educationalLevel: '5', subject: NELIESubject.PHYSICAL_EDUCATION,
  },
  {
    id: 'us-g5-pe-sa-lo1', parentId: 'us-g5-pe-sa', nodeType: 'learning_objective', name: 'Demonstrate mature form for skills in a modified sport (e.g., dribbling in basketball).',
    educationalLevel: '5', subject: NELIESubject.PHYSICAL_EDUCATION,
  }
];
