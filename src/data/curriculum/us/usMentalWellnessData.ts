import { CurriculumNode } from '@/types/curriculum/CurriculumNode';
import { NELIESubject } from '@/types/curriculum/NELIESubjects';

export const usMentalWellnessCurriculumData: CurriculumNode[] = [
  // Subject Node
  {
    id: 'us-mental-wellness',
    parentId: 'us-root',
    nodeType: 'subject',
    name: 'Mental Wellness',
    description: 'Curriculum for Mental Wellness in the United States, focusing on emotional literacy, self-regulation, social skills, resilience, and mental health awareness across K-12.',
    educationalLevel: 'K-12',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['mental_health', 'social_emotional_learning', 'wellbeing', 'usa']
  },
  // K-2
  {
    id: 'us-k-2-mw',
    parentId: 'us-mental-wellness',
    nodeType: 'course',
    name: 'K-2 Mental Wellness',
    description: 'Foundational mental wellness concepts for K-2.',
    educationalLevel: 'K-2',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['kindergarten', 'grade1', 'grade2', 'mental_wellness', 'foundation']
  },
  {
    id: 'us-k-2-mw-ea',
    parentId: 'us-k-2-mw',
    nodeType: 'domain',
    name: 'Emotional Awareness',
    description: 'Understanding basic emotions.',
    educationalLevel: 'K-2',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['emotions', 'awareness']
  },
  {
    id: 'us-k-2-mw-sr',
    parentId: 'us-k-2-mw',
    nodeType: 'domain',
    name: 'Self-Regulation',
    description: 'Learning to manage responses.',
    educationalLevel: 'K-2',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['self_regulation', 'coping']
  },
  {
    id: 'us-k-2-mw-sc',
    parentId: 'us-k-2-mw',
    nodeType: 'domain',
    name: 'Social Connection',
    description: 'Building positive social interactions.',
    educationalLevel: 'K-2',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['social_skills', 'relationships']
  },
  {
    id: 'us-k-2-mw-rb',
    parentId: 'us-k-2-mw',
    nodeType: 'domain',
    name: 'Resilience Building',
    description: 'Learning from challenges.',
    educationalLevel: 'K-2',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['resilience', 'growth_mindset']
  },
  // 3-5
  {
    id: 'us-3-5-mw',
    parentId: 'us-mental-wellness',
    nodeType: 'course',
    name: 'Grades 3-5 Mental Wellness',
    description: 'Mental wellness skill development for Grades 3-5.',
    educationalLevel: '3-5',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['grade3', 'grade4', 'grade5', 'mental_wellness', 'skill_development']
  },
  {
    id: 'us-3-5-mw-ei',
    parentId: 'us-3-5-mw',
    nodeType: 'domain',
    name: 'Emotional Intelligence',
    description: 'Understanding and managing emotions effectively.',
    educationalLevel: '3-5',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['emotional_intelligence', 'self_awareness']
  },
  {
    id: 'us-3-5-mw-sm',
    parentId: 'us-3-5-mw',
    nodeType: 'domain',
    name: 'Stress Management',
    description: 'Developing healthy ways to cope with stress.',
    educationalLevel: '3-5',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['stress_management', 'coping_skills']
  },
  {
    id: 'us-3-5-mw-hr',
    parentId: 'us-3-5-mw',
    nodeType: 'domain',
    name: 'Healthy Relationships',
    description: 'Building and maintaining positive relationships.',
    educationalLevel: '3-5',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['relationships', 'social_skills', 'communication']
  },
  {
    id: 'us-3-5-mw-gm',
    parentId: 'us-3-5-mw',
    nodeType: 'domain',
    name: 'Growth Mindset',
    description: 'Fostering a belief in the ability to learn and grow.',
    educationalLevel: '3-5',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['growth_mindset', 'resilience', 'learning']
  },
  // 6-8
  {
    id: 'us-6-8-mw',
    parentId: 'us-mental-wellness',
    nodeType: 'course',
    name: 'Grades 6-8 Mental Wellness',
    description: 'Identity and Transition',
    educationalLevel: '6-8',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['grade6', 'grade7', 'grade8', 'mental_wellness', 'identity', 'transition']
  },
  // 9-12
  {
    id: 'us-9-12-mw',
    parentId: 'us-mental-wellness',
    nodeType: 'course',
    name: 'Grades 9-12 Mental Wellness',
    description: 'Preparation for Adulthood',
    educationalLevel: '9-12',
    subject: NELIESubject.MENTAL_WELLNESS,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['grade9', 'grade10', 'grade11', 'grade12', 'mental_wellness', 'adulthood']
  },
];
