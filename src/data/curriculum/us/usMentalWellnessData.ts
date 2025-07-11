import { CurriculumNode } from '@/types/curriculum/CurriculumNode'; // CurriculumNodeType is not needed here
import { NELIESubject } from '@/types/curriculum/NELIESubjects';

export const usMentalWellnessCurriculumData: CurriculumNode[] = [
  // US Mental Wellness Subject Node
  {
    id: 'us-mental-wellness',
    parentId: 'us-root',
    nodeType: 'subject', // Changed from CurriculumNodeType.SUBJECT
    name: 'Mental Wellness',
    description: 'Curriculum for Mental Wellness in the United States, focusing on emotional literacy, self-regulation, social skills, resilience, and mental health awareness across K-12.',
    educationalLevel: 'K-12', // General subject level
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['mental_health', 'social_emotional_learning', 'wellbeing', 'usa'],
  },

  // --- Kindergarten: Foundation Building ---
  {
    id: 'us-k-mw',
    parentId: 'us-mental-wellness',
    nodeType: 'course', // Changed
    name: 'Kindergarten Mental Wellness',
    description: 'Foundational mental wellness concepts for Kindergarten.',
    educationalLevel: 'K',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['kindergarten', 'mental_wellness', 'foundation'],
  },
  // K Domains
  {
    id: 'us-k-mw-ea',
    parentId: 'us-k-mw',
    nodeType: 'domain', // Changed
    name: 'Emotional Awareness',
    description: 'Understanding basic emotions.',
    educationalLevel: 'K',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['emotions', 'awareness'],
  },
  {
    id: 'us-k-mw-sr',
    parentId: 'us-k-mw',
    nodeType: 'domain', // Changed
    name: 'Self-Regulation',
    description: 'Learning to manage responses.',
    educationalLevel: 'K',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['self_regulation', 'coping'],
  },
  {
    id: 'us-k-mw-sc',
    parentId: 'us-k-mw',
    nodeType: 'domain', // Changed
    name: 'Social Connection',
    description: 'Building positive social interactions.',
    educationalLevel: 'K',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['social_skills', 'relationships'],
  },
  {
    id: 'us-k-mw-rb',
    parentId: 'us-k-mw',
    nodeType: 'domain', // Changed
    name: 'Resilience Building',
    description: 'Learning from challenges.',
    educationalLevel: 'K',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['resilience', 'growth_mindset'],
  },
  // K LOs
  {
    id: 'us-k-mw-ea-lo1',
    parentId: 'us-k-mw-ea',
    nodeType: 'learning_objective', // Changed
    name: 'Identify basic emotions (happy, sad, mad, scared)',
    description: 'Students will be able to identify and name basic emotions like happy, sad, mad, and scared in themselves and others.',
    educationalLevel: 'K',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['emotional_literacy', 'feelings'],
  },
  {
    id: 'us-k-mw-sr-lo1',
    parentId: 'us-k-mw-sr',
    nodeType: 'learning_objective', // Changed
    name: 'Use "calm down" strategies (counting, deep breaths)',
    description: 'Students will learn and practice simple "calm down" strategies such as counting or taking deep breaths.',
    educationalLevel: 'K',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['coping_skills', 'calming_techniques'],
  },
  {
    id: 'us-k-mw-sc-lo1',
    parentId: 'us-k-mw-sc',
    nodeType: 'learning_objective', // Changed
    name: 'Identify trusted adults and safe spaces',
    description: 'Students will be able to identify trusted adults in their lives and safe spaces at school and home.',
    educationalLevel: 'K',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['safety', 'trust', 'help-seeking'],
  },
  {
    id: 'us-k-mw-rb-lo1',
    parentId: 'us-k-mw-rb',
    nodeType: 'learning_objective', // Changed
    name: 'Understand that mistakes help us learn',
    description: 'Students will understand that making mistakes is a normal part of learning and growth.',
    educationalLevel: 'K',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['growth-mindset', 'learning_from_mistakes'],
  },

  // --- Grade 1: Foundation Building ---
  {
    id: 'us-g1-mw',
    parentId: 'us-mental-wellness',
    nodeType: 'course', // Changed
    name: 'Grade 1 Mental Wellness',
    description: 'Continuing foundational mental wellness for Grade 1.',
    educationalLevel: '1',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['grade1', 'mental_wellness', 'foundation'],
  },
  // G1 Domains (re-use domain names, link to G1 course)
  {
    id: 'us-g1-mw-ea',
    parentId: 'us-g1-mw',
    nodeType: 'domain', // Changed
    name: 'Emotional Awareness',
    description: 'Expanding understanding of emotions.',
    educationalLevel: '1',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['emotions', 'awareness'],
  },
  {
    id: 'us-g1-mw-sr',
    parentId: 'us-g1-mw',
    nodeType: 'domain', // Changed
    name: 'Self-Regulation',
    description: 'Practicing self-management techniques.',
    educationalLevel: '1',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['self_regulation', 'coping'],
  },
  {
    id: 'us-g1-mw-sc',
    parentId: 'us-g1-mw',
    nodeType: 'domain', // Changed
    name: 'Social Connection',
    description: 'Developing kind communication and empathy.',
    educationalLevel: '1',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['social_skills', 'communication', 'empathy'],
  },
  {
    id: 'us-g1-mw-rb',
    parentId: 'us-g1-mw',
    nodeType: 'domain', // Changed
    name: 'Resilience Building',
    description: 'Learning to persevere through challenges.',
    educationalLevel: '1',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['resilience', 'perseverance'],
  },
  // G1 LOs
  {
    id: 'us-g1-mw-ea-lo1',
    parentId: 'us-g1-mw-ea',
    nodeType: 'learning_objective', // Changed
    name: 'Name 6-8 emotions and describe what causes them',
    description: 'Students will be able to name 6-8 different emotions and describe situations or triggers that might cause them.',
    educationalLevel: '1',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['emotional_literacy', 'feelings', 'causation'],
  },
  {
    id: 'us-g1-mw-sr-lo1',
    parentId: 'us-g1-mw-sr',
    nodeType: 'learning_objective', // Changed
    name: 'Practice simple mindfulness (5-4-3-2-1 sensory technique)',
    description: 'Students will practice a simple mindfulness technique like the 5-4-3-2-1 sensory grounding exercise.',
    educationalLevel: '1',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['mindfulness', 'sensory_grounding', 'coping_skills'],
  },
  {
    id: 'us-g1-mw-sc-lo1',
    parentId: 'us-g1-mw-sc',
    nodeType: 'learning_objective', // Changed
    name: 'Practice kind communication ("I feel..." statements)',
    description: 'Students will practice using "I feel..." statements to communicate their emotions kindly and respectfully.',
    educationalLevel: '1',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['communication_skills', 'i_statements', 'empathy'],
  },
  {
    id: 'us-g1-mw-rb-lo1',
    parentId: 'us-g1-mw-rb',
    nodeType: 'learning_objective', // Changed
    name: 'Try again after setbacks with adult support',
    description: 'Students will learn to try again after experiencing a setback, with support from an adult.',
    educationalLevel: '1',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['perseverance', 'help_seeking', 'growth_mindset'],
  },

  // --- Grade 2: Foundation Building ---
  {
    id: 'us-g2-mw',
    parentId: 'us-mental-wellness',
    nodeType: 'course', // Changed
    name: 'Grade 2 Mental Wellness',
    description: 'Further foundational mental wellness for Grade 2.',
    educationalLevel: '2',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['grade2', 'mental_wellness', 'foundation'],
  },
  // G2 Domains
  {
    id: 'us-g2-mw-ea',
    parentId: 'us-g2-mw',
    nodeType: 'domain', // Changed
    name: 'Emotional Awareness',
    description: 'Understanding the nature of emotions.',
    educationalLevel: '2',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['emotions', 'self_awareness'],
  },
  {
    id: 'us-g2-mw-sr',
    parentId: 'us-g2-mw',
    nodeType: 'domain', // Changed
    name: 'Self-Regulation',
    description: 'Choosing appropriate coping strategies.',
    educationalLevel: '2',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['self_regulation', 'coping_strategies'],
  },
  {
    id: 'us-g2-mw-sc',
    parentId: 'us-g2-mw',
    nodeType: 'domain', // Changed
    name: 'Social Connection',
    description: 'Demonstrating empathy and helpfulness.',
    educationalLevel: '2',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['social_skills', 'empathy', 'helping'],
  },
  {
    id: 'us-g2-mw-rb',
    parentId: 'us-g2-mw',
    nodeType: 'domain', // Changed
    name: 'Resilience Building',
    description: 'Focusing on effort and learning.',
    educationalLevel: '2',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['resilience', 'effort', 'growth_mindset'],
  },
  // G2 LOs
  {
    id: 'us-g2-mw-ea-lo1',
    parentId: 'us-g2-mw-ea',
    nodeType: 'learning_objective', // Changed
    name: 'Recognize that emotions change and are temporary',
    description: 'Students will recognize that emotions can change over time and are often temporary states.',
    educationalLevel: '2',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['emotional_regulation', 'impermanence_of_emotions'],
  },
  {
    id: 'us-g2-mw-sr-lo1',
    parentId: 'us-g2-mw-sr',
    nodeType: 'learning_objective', // Changed
    name: 'Choose appropriate coping strategies for different situations',
    description: 'Students will learn to choose and apply appropriate coping strategies for different challenging situations.',
    educationalLevel: '2',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['problem_solving', 'decision_making', 'coping_skills'],
  },
  {
    id: 'us-g2-mw-sc-lo1',
    parentId: 'us-g2-mw-sc',
    nodeType: 'learning_objective', // Changed
    name: 'Show empathy through listening and helping',
    description: 'Students will practice showing empathy by actively listening to others and offering help when appropriate.',
    educationalLevel: '2',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['active_listening', 'prosocial_behavior', 'empathy'],
  },
  {
    id: 'us-g2-mw-rb-lo1',
    parentId: 'us-g2-mw-rb',
    nodeType: 'learning_objective', // Changed
    name: 'Celebrate effort, not just outcomes',
    description: 'Students will learn to celebrate their effort and the process of learning, not just the final outcome.',
    educationalLevel: '2',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['process_over_product', 'intrinsic_motivation', 'growth_mindset'],
  },

  // --- Grades 3-5: Skill Development ---

  // Grade 3 Course
  {
    id: 'us-g3-mw',
    parentId: 'us-mental-wellness',
    nodeType: 'course', // Changed
    name: 'Grade 3 Mental Wellness',
    description: 'Mental wellness skill development for Grade 3.',
    educationalLevel: '3',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['grade3', 'mental_wellness', 'skill_development'],
  },
  // Grade 3 Domains
  {
    id: 'us-g3-mw-ei',
    parentId: 'us-g3-mw',
    nodeType: 'domain', // Changed
    name: 'Emotional Intelligence',
    description: 'Understanding and managing emotions effectively.',
    educationalLevel: '3',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['emotional_intelligence', 'self_awareness'],
  },
  {
    id: 'us-g3-mw-sm',
    parentId: 'us-g3-mw',
    nodeType: 'domain', // Changed
    name: 'Stress Management',
    description: 'Developing healthy ways to cope with stress.',
    educationalLevel: '3',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['stress_management', 'coping_skills'],
  },
  {
    id: 'us-g3-mw-hr',
    parentId: 'us-g3-mw',
    nodeType: 'domain', // Changed
    name: 'Healthy Relationships',
    description: 'Building and maintaining positive relationships.',
    educationalLevel: '3',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['relationships', 'social_skills', 'communication'],
  },
  {
    id: 'us-g3-mw-gm',
    parentId: 'us-g3-mw',
    nodeType: 'domain', // Changed
    name: 'Growth Mindset',
    description: 'Fostering a belief in the ability to learn and grow.',
    educationalLevel: '3',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['growth_mindset', 'resilience', 'learning'],
  },
  // Grade 3 LOs
  {
    id: 'us-g3-mw-ei-lo1',
    parentId: 'us-g3-mw-ei',
    nodeType: 'learning_objective', // Changed
    name: 'Understand emotion intensity (a little mad vs. very angry)',
    description: 'Students will understand that emotions can vary in intensity (e.g., a little mad vs. very angry).',
    educationalLevel: '3',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['emotional_spectrum', 'intensity_levels'],
  },
  {
    id: 'us-g3-mw-sm-lo1',
    parentId: 'us-g3-mw-sm',
    nodeType: 'learning_objective', // Changed
    name: 'Identify what stress feels like in the body',
    description: 'Students will be able to identify physical sensations associated with stress.',
    educationalLevel: '3',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['somatic_awareness', 'stress_symptoms'],
  },
  {
    id: 'us-g3-mw-hr-lo1',
    parentId: 'us-g3-mw-hr',
    nodeType: 'learning_objective', // Changed
    name: 'Understand friendship qualities and boundaries',
    description: 'Students will understand qualities of healthy friendships and the importance of personal boundaries.',
    educationalLevel: '3',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['friendship_skills', 'personal_boundaries'],
  },
  {
    id: 'us-g3-mw-gm-lo1',
    parentId: 'us-g3-mw-gm',
    nodeType: 'learning_objective', // Changed
    name: 'Understand that brains can grow and change',
    description: 'Students will understand the concept of neuroplasticity – that their brains can grow and change with effort.',
    educationalLevel: '3',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['neuroplasticity', 'effortful_learning'],
  },

  // Grade 4 Course
  {
    id: 'us-g4-mw',
    parentId: 'us-mental-wellness',
    nodeType: 'course', // Changed
    name: 'Grade 4 Mental Wellness',
    description: 'Mental wellness skill development for Grade 4.',
    educationalLevel: '4',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['grade4', 'mental_wellness', 'skill_development'],
  },
  // Grade 4 Domains
  {
    id: 'us-g4-mw-ei',
    parentId: 'us-g4-mw',
    nodeType: 'domain', // Changed
    name: 'Emotional Intelligence',
    description: 'Understanding and managing emotions effectively.',
    educationalLevel: '4',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['emotional_intelligence', 'self_awareness'],
  },
  {
    id: 'us-g4-mw-sm',
    parentId: 'us-g4-mw',
    nodeType: 'domain', // Changed
    name: 'Stress Management',
    description: 'Developing healthy ways to cope with stress.',
    educationalLevel: '4',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['stress_management', 'coping_skills'],
  },
  {
    id: 'us-g4-mw-hr',
    parentId: 'us-g4-mw',
    nodeType: 'domain', // Changed
    name: 'Healthy Relationships',
    description: 'Building and maintaining positive relationships.',
    educationalLevel: '4',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['relationships', 'social_skills', 'communication'],
  },
  {
    id: 'us-g4-mw-gm',
    parentId: 'us-g4-mw',
    nodeType: 'domain', // Changed
    name: 'Growth Mindset',
    description: 'Fostering a belief in the ability to learn and grow.',
    educationalLevel: '4',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['growth_mindset', 'resilience', 'learning'],
  },
  // Grade 4 LOs
  {
    id: 'us-g4-mw-ei-lo1',
    parentId: 'us-g4-mw-ei',
    nodeType: 'learning_objective', // Changed
    name: 'Recognize emotional triggers and early warning signs',
    description: 'Students will be able to recognize personal emotional triggers and early warning signs of escalating emotions.',
    educationalLevel: '4',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['emotional_triggers', 'early_warning_signs', 'self_monitoring'],
  },
  {
    id: 'us-g4-mw-sm-lo1',
    parentId: 'us-g4-mw-sm',
    nodeType: 'learning_objective', // Changed
    name: 'Practice multiple calming techniques (breathing, movement, visualization)',
    description: 'Students will practice and identify effectiveness of multiple calming techniques (e.g., breathing exercises, physical movement, visualization).',
    educationalLevel: '4',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['calming_strategies', 'stress_reduction_techniques'],
  },
  {
    id: 'us-g4-mw-hr-lo1',
    parentId: 'us-g4-mw-hr',
    nodeType: 'learning_objective', // Changed
    name: 'Practice conflict resolution with peer mediation',
    description: 'Students will practice conflict resolution skills, potentially with peer mediation support.',
    educationalLevel: '4',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['conflict_resolution_skills', 'peer_mediation'],
  },
  {
    id: 'us-g4-mw-gm-lo1',
    parentId: 'us-g4-mw-gm',
    nodeType: 'learning_objective', // Changed
    name: 'Set realistic goals and track progress',
    description: 'Students will learn to set realistic short-term goals and track their progress towards them.',
    educationalLevel: '4',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['goal_setting', 'progress_monitoring', 'self_management'],
  },

  // Grade 5 Course
  {
    id: 'us-g5-mw',
    parentId: 'us-mental-wellness',
    nodeType: 'course', // Changed
    name: 'Grade 5 Mental Wellness',
    description: 'Mental wellness skill development for Grade 5.',
    educationalLevel: '5',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['grade5', 'mental_wellness', 'skill_development'],
  },
  // Grade 5 Domains
  {
    id: 'us-g5-mw-ei',
    parentId: 'us-g5-mw',
    nodeType: 'domain', // Changed
    name: 'Emotional Intelligence',
    description: 'Understanding and managing emotions effectively.',
    educationalLevel: '5',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['emotional_intelligence', 'self_awareness'],
  },
  {
    id: 'us-g5-mw-sm',
    parentId: 'us-g5-mw',
    nodeType: 'domain', // Changed
    name: 'Stress Management',
    description: 'Developing healthy ways to cope with stress.',
    educationalLevel: '5',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['stress_management', 'coping_skills'],
  },
  {
    id: 'us-g5-mw-hr',
    parentId: 'us-g5-mw',
    nodeType: 'domain', // Changed
    name: 'Healthy Relationships',
    description: 'Building and maintaining positive relationships.',
    educationalLevel: '5',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['relationships', 'social_skills', 'communication'],
  },
  {
    id: 'us-g5-mw-gm',
    parentId: 'us-g5-mw',
    nodeType: 'domain', // Changed
    name: 'Growth Mindset',
    description: 'Fostering a belief in the ability to learn and grow.',
    educationalLevel: '5',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['growth_mindset', 'resilience', 'learning'],
  },
  // Grade 5 LOs
  {
    id: 'us-g5-mw-ei-lo1',
    parentId: 'us-g5-mw-ei',
    nodeType: 'learning_objective', // Changed
    name: 'Develop emotional vocabulary (frustrated, disappointed, anxious)',
    description: 'Students will develop a richer emotional vocabulary to describe nuanced feelings (e.g., frustrated, disappointed, anxious).',
    educationalLevel: '5',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['nuanced_emotions', 'emotional_expression', 'vocabulary_development'],
  },
  {
    id: 'us-g5-mw-sm-lo1',
    parentId: 'us-g5-mw-sm',
    nodeType: 'learning_objective', // Changed
    name: 'Create personal stress management toolkit',
    description: 'Students will create a personal toolkit of effective stress management strategies.',
    educationalLevel: '5',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['personalized_coping', 'stress_toolkit', 'self_help_strategies'],
  },
  {
    id: 'us-g5-mw-hr-lo1',
    parentId: 'us-g5-mw-hr',
    nodeType: 'learning_objective', // Changed
    name: 'Recognize and report unhealthy relationship patterns',
    description: 'Students will learn to recognize signs of unhealthy relationship patterns and understand how to report them or seek help.',
    educationalLevel: '5',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['relationship_safety', 'reporting_mechanisms', 'help_seeking_behaviors'],
  },
  {
    id: 'us-g5-mw-gm-lo1',
    parentId: 'us-g5-mw-gm',
    nodeType: 'learning_objective', // Changed
    name: 'Learn from failure and seek feedback',
    description: 'Students will learn to view failure as a learning opportunity and actively seek constructive feedback.',
    educationalLevel: '5',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['constructive_criticism', 'learning_from_failure', 'seeking_feedback'],
  },
];
