
import { CurriculumNode } from '@/types/curriculum/CurriculumNode';
import { NELIESubject } from '@/types/curriculum/NELIESubjects';

export const usHistoryCurriculumData: CurriculumNode[] = [
  // US History Subject Node
  {
    id: 'us-history',
    parentId: 'us-root',
    nodeType: 'subject',
    name: 'History',
    description: 'Curriculum for K-12 History in the United States, covering American history, world history, civics, and cultural understanding.',
    educationalLevel: 'K-12',
    subject: NELIESubject.SOCIAL_STUDIES,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['history', 'social_studies', 'american_history', 'world_history', 'civics', 'usa']
  },

  // --- Kindergarten: Myself and Others ---
  {
    id: 'us-k-history',
    parentId: 'us-history',
    nodeType: 'course',
    name: 'Kindergarten History',
    description: 'Introduction to history focusing on personal identity, family, and community.',
    educationalLevel: 'K',
    subject: NELIESubject.SOCIAL_STUDIES,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['kindergarten', 'family_history', 'community', 'personal_identity']
  },
  {
    id: 'us-k-history-identity',
    parentId: 'us-k-history',
    nodeType: 'domain',
    name: 'Personal and Family Identity',
    educationalLevel: 'K',
    subject: NELIESubject.SOCIAL_STUDIES,
    tags: ['personal_identity', 'family_traditions', 'cultural_heritage']
  },
  {
    id: 'us-k-history-lo1',
    parentId: 'us-k-history-identity',
    nodeType: 'learning_objective',
    name: 'Describe personal characteristics and family traditions.',
    educationalLevel: 'K',
    subject: NELIESubject.SOCIAL_STUDIES,
    tags: ['family_traditions', 'personal_characteristics', 'cultural_identity']
  },
  {
    id: 'us-k-history-lo2',
    parentId: 'us-k-history-identity',
    nodeType: 'learning_objective',
    name: 'Identify how we learn about the past through family stories and photographs.',
    educationalLevel: 'K',
    subject: NELIESubject.SOCIAL_STUDIES,
    tags: ['historical_sources', 'family_stories', 'photographs', 'past_present']
  },

  // --- Grade 1: Family and School History ---
  {
    id: 'us-g1-history',
    parentId: 'us-history',
    nodeType: 'course',
    name: 'Grade 1 History',
    description: 'Focus on family history, school traditions, and community helpers.',
    educationalLevel: '1',
    subject: NELIESubject.SOCIAL_STUDIES,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['grade1', 'family_history', 'school_traditions', 'community_helpers']
  },

  // --- Grade 2: Community History ---
  {
    id: 'us-g2-history',
    parentId: 'us-history',
    nodeType: 'course',
    name: 'Grade 2 History',
    description: 'Introduction to community history and American symbols.',
    educationalLevel: '2',
    subject: NELIESubject.SOCIAL_STUDIES,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['grade2', 'community_history', 'american_symbols', 'local_history']
  },

  // --- Grade 3: Local History and Native Americans ---
  {
    id: 'us-g3-history',
    parentId: 'us-history',
    nodeType: 'course',
    name: 'Grade 3 History',
    description: 'Focus on local history, Native American cultures, and early explorers.',
    educationalLevel: '3',
    subject: NELIESubject.SOCIAL_STUDIES,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['grade3', 'local_history', 'native_americans', 'explorers', 'indigenous_cultures']
  },
  {
    id: 'us-g3-history-native',
    parentId: 'us-g3-history',
    nodeType: 'domain',
    name: 'Native American Cultures',
    educationalLevel: '3',
    subject: NELIESubject.SOCIAL_STUDIES,
    tags: ['native_americans', 'indigenous_cultures', 'tribal_societies']
  },
  {
    id: 'us-g3-history-lo1',
    parentId: 'us-g3-history-native',
    nodeType: 'learning_objective',
    name: 'Compare and contrast different Native American cultural groups.',
    educationalLevel: '3',
    subject: NELIESubject.SOCIAL_STUDIES,
    tags: ['native_americans', 'cultural_comparison', 'tribal_diversity']
  },
  {
    id: 'us-g3-history-lo2',
    parentId: 'us-g3-history-native',
    nodeType: 'learning_objective',
    name: 'Describe how Native Americans adapted to their environments.',
    educationalLevel: '3',
    subject: NELIESubject.SOCIAL_STUDIES,
    tags: ['environmental_adaptation', 'native_americans', 'cultural_geography']
  },

  // --- Grade 4: State History ---
  {
    id: 'us-g4-history',
    parentId: 'us-history',
    nodeType: 'course',
    name: 'Grade 4 History',
    description: 'Study of state history, including settlement, development, and key historical figures.',
    educationalLevel: '4',
    subject: NELIESubject.SOCIAL_STUDIES,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['grade4', 'state_history', 'settlement', 'historical_figures']
  },

  // --- Grade 5: Early American History ---
  {
    id: 'us-g5-history',
    parentId: 'us-history',
    nodeType: 'course',
    name: 'Grade 5 History',
    description: 'Focus on early American history including exploration, colonization, and the Revolutionary War.',
    educationalLevel: '5',
    subject: NELIESubject.SOCIAL_STUDIES,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['grade5', 'american_history', 'colonial_period', 'revolutionary_war', 'exploration']
  },
  {
    id: 'us-g5-history-colonial',
    parentId: 'us-g5-history',
    nodeType: 'domain',
    name: 'Colonial America',
    educationalLevel: '5',
    subject: NELIESubject.SOCIAL_STUDIES,
    tags: ['colonial_period', 'thirteen_colonies', 'european_settlement']
  },
  {
    id: 'us-g5-history-lo1',
    parentId: 'us-g5-history-colonial',
    nodeType: 'learning_objective',
    name: 'Describe the reasons for European exploration and colonization of North America.',
    educationalLevel: '5',
    subject: NELIESubject.SOCIAL_STUDIES,
    tags: ['european_exploration', 'colonization', 'motives', 'age_of_exploration']
  },
  {
    id: 'us-g5-history-lo2',
    parentId: 'us-g5-history-colonial',
    nodeType: 'learning_objective',
    name: 'Compare the different colonial regions and their characteristics.',
    educationalLevel: '5',
    subject: NELIESubject.SOCIAL_STUDIES,
    tags: ['colonial_regions', 'new_england', 'middle_colonies', 'southern_colonies']
  }
];
