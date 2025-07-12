import { CurriculumNode } from '@/types/curriculum/CurriculumNode';
import { NELIESubject } from '@/types/curriculum/NELIESubjects';

export const usHistoryCurriculumData: CurriculumNode[] = [
  // US History & Social Studies Subject Node
  {
    id: 'us-history',
    parentId: 'us-root',
    nodeType: 'subject',
    name: 'History & Social Studies',
    description: 'Curriculum for K-12 History and Social Studies in the United States, covering US history, world history, civics, geography, and economics.',
    educationalLevel: 'K-12',
    subject: NELIESubject.HISTORY_RELIGION,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['history', 'social_studies', 'civics', 'geography', 'economics', 'usa'],
  },

  // --- Kindergarten: My World and Me ---
  {
    id: 'us-k-history',
    parentId: 'us-history',
    nodeType: 'course',
    name: 'Kindergarten Social Studies',
    description: 'Introduction to social studies concepts focusing on self, family, school, and community.',
    educationalLevel: 'K',
    subject: NELIESubject.HISTORY_RELIGION,
    tags: ['kindergarten', 'community', 'self_awareness'],
  },
  {
    id: 'us-k-history-civics', parentId: 'us-k-history', nodeType: 'domain', name: 'Civics & Governance',
    educationalLevel: 'K', subject: NELIESubject.HISTORY_RELIGION, tags: ['rules', 'citizenship_basics'],
  },
  {
    id: 'us-k-history-history', parentId: 'us-k-history', nodeType: 'domain', name: 'History',
    educationalLevel: 'K', subject: NELIESubject.HISTORY_RELIGION, tags: ['past_present', 'family_history'],
  },
  {
    id: 'us-k-history-civics-lo1', parentId: 'us-k-history-civics', nodeType: 'learning_objective', name: 'Follow rules in school and community.',
    educationalLevel: 'K', subject: NELIESubject.HISTORY_RELIGION, tags: ['rules', 'community_living', 'civic_ideals'],
  },
  {
    id: 'us-k-history-history-lo1', parentId: 'us-k-history-history', nodeType: 'learning_objective', name: 'Distinguish between events that happened long ago and today.',
    educationalLevel: 'K', subject: NELIESubject.HISTORY_RELIGION, tags: ['time_continuity_change', 'chronology_basics'],
  },

  // --- Grade 1: My Community ---
  {
    id: 'us-g1-history', parentId: 'us-history', nodeType: 'course', name: 'Grade 1 Social Studies',
    description: 'Focus on the local community, its people, and its history.',
    educationalLevel: '1', subject: NELIESubject.HISTORY_RELIGION, tags: ['grade1', 'local_community', 'community_helpers'],
  },
  {
    id: 'us-g1-history-civics', parentId: 'us-g1-history', nodeType: 'domain', name: 'Civics & Governance',
    educationalLevel: '1', subject: NELIESubject.HISTORY_RELIGION, tags: ['community_roles', 'symbols_us'],
  },
  {
    id: 'us-g1-history-civics-lo1', parentId: 'us-g1-history-civics', nodeType: 'learning_objective', name: 'Identify the roles of community helpers.',
    educationalLevel: '1', subject: NELIESubject.HISTORY_RELIGION, tags: ['community_roles', 'civics', 'individuals_groups_institutions'],
  },
  {
    id: 'us-g1-history-geo-lo1', parentId: 'us-g1-history', nodeType: 'learning_objective', name: 'Describe the location of places in the community.',
    educationalLevel: '1', subject: NELIESubject.HISTORY_RELIGION, tags: ['local_geography', 'people_places_environments'],
  },

  // --- Grade 2: Our World ---
  {
    id: 'us-g2-history', parentId: 'us-history', nodeType: 'course', name: 'Grade 2 Social Studies',
    description: 'Expanding understanding to the broader world, including different cultures and historical figures.',
    educationalLevel: '2', subject: NELIESubject.HISTORY_RELIGION, tags: ['grade2', 'world_cultures', 'historical_figures'],
  },
  {
    id: 'us-g2-history-history', parentId: 'us-g2-history', nodeType: 'domain', name: 'History',
    educationalLevel: '2', subject: NELIESubject.HISTORY_RELIGION, tags: ['historical_figures', 'us_history'],
  },
  {
    id: 'us-g2-history-history-lo1', parentId: 'us-g2-history-history', nodeType: 'learning_objective', name: 'Describe the contributions of historical figures.',
    educationalLevel: '2', subject: NELIESubject.HISTORY_RELIGION, tags: ['biographies', 'us_history', 'time_continuity_change'],
  },
  {
    id: 'us-g2-history-culture-lo1', parentId: 'us-g2-history', nodeType: 'learning_objective', name: 'Compare family life in different cultures.',
    educationalLevel: '2', subject: NELIESubject.HISTORY_RELIGION, tags: ['culture', 'global_connections', 'family_life'],
  },

  // --- Grade 3: Our State & Region ---
  {
    id: 'us-g3-history', parentId: 'us-history', nodeType: 'course', name: 'Grade 3 Social Studies',
    description: 'Focus on the history, geography, and government of the local state and region.',
    educationalLevel: '3', subject: NELIESubject.HISTORY_RELIGION, tags: ['grade3', 'state_history', 'regional_geography'],
  },
  {
    id: 'us-g3-history-history', parentId: 'us-g3-history', nodeType: 'domain', name: 'State History',
    educationalLevel: '3', subject: NELIESubject.HISTORY_RELIGION, tags: ['local_history', 'state_studies'],
  },
  {
    id: 'us-g3-history-gov', parentId: 'us-g3-history', nodeType: 'domain', name: 'State & Local Government',
    educationalLevel: '3', subject: NELIESubject.HISTORY_RELIGION, tags: ['local_government', 'civics'],
  },
  {
    id: 'us-g3-history-history-lo1', parentId: 'us-g3-history-history', nodeType: 'learning_objective', name: 'Describe the history of the local state or region.',
    educationalLevel: '3', subject: NELIESubject.HISTORY_RELIGION, tags: ['local_history', 'state_studies', 'time_continuity_change'],
  },
  {
    id: 'us-g3-history-gov-lo1', parentId: 'us-g3-history-gov', nodeType: 'learning_objective', name: 'Explain the basic functions of local government.',
    educationalLevel: '3', subject: NELIESubject.HISTORY_RELIGION, tags: ['local_government', 'civics', 'power_authority_governance'],
  },

  // --- Grade 4: U.S. Regions ---
  {
    id: 'us-g4-history', parentId: 'us-history', nodeType: 'course', name: 'Grade 4 Social Studies',
    description: 'Study of the different regions of the United States.',
    educationalLevel: '4', subject: NELIESubject.HISTORY_RELIGION, tags: ['grade4', 'us_regions', 'regional_studies'],
  },
  {
    id: 'us-g4-history-geo', parentId: 'us-g4-history', nodeType: 'domain', name: 'U.S. Regional Geography',
    educationalLevel: '4', subject: NELIESubject.HISTORY_RELIGION, tags: ['us_geography', 'regions'],
  },
  {
    id: 'us-g4-history-econ', parentId: 'us-g4-history', nodeType: 'domain', name: 'U.S. Regional Economy',
    educationalLevel: '4', subject: NELIESubject.HISTORY_RELIGION, tags: ['us_economy', 'regional_economy'],
  },
  {
    id: 'us-g4-history-geo-lo1', parentId: 'us-g4-history-geo', nodeType: 'learning_objective', name: 'Identify the major geographic features of different U.S. regions.',
    educationalLevel: '4', subject: NELIESubject.HISTORY_RELIGION, tags: ['us_geography', 'regions', 'people_places_environments'],
  },
  {
    id: 'us-g4-history-econ-lo1', parentId: 'us-g4-history-econ', nodeType: 'learning_objective', name: 'Describe the economic activities of different U.S. regions.',
    educationalLevel: '4', subject: NELIESubject.HISTORY_RELIGION, tags: ['us_economy', 'regional_economy', 'production_distribution_consumption'],
  },

  // --- Grade 5: U.S. History and Government ---
  {
    id: 'us-g5-history', parentId: 'us-history', nodeType: 'course', name: 'Grade 5 Social Studies',
    description: 'Early U.S. history from pre-colonial times through the American Revolution.',
    educationalLevel: '5', subject: NELIESubject.HISTORY_RELIGION, tags: ['grade5', 'us_history_early', 'american_revolution'],
  },
  {
    id: 'us-g5-history-history', parentId: 'us-g5-history', nodeType: 'domain', name: 'Early U.S. History',
    educationalLevel: '5', subject: NELIESubject.HISTORY_RELIGION, tags: ['age_of_exploration', 'colonial_america'],
  },
  {
    id: 'us-g5-history-civics', parentId: 'us-g5-history', nodeType: 'domain', name: 'U.S. Government Foundations',
    educationalLevel: '5', subject: NELIESubject.HISTORY_RELIGION, tags: ['us_constitution', 'civics'],
  },
  {
    id: 'us-g5-history-history-lo1', parentId: 'us-g5-history-history', nodeType: 'learning_objective', name: 'Describe the motivations of early European explorers.',
    educationalLevel: '5', subject: NELIESubject.HISTORY_RELIGION, tags: ['age_of_exploration', 'us_history_colonial', 'time_continuity_change'],
  },
  {
    id: 'us-g5-history-civics-lo1', parentId: 'us-g5-history-civics', nodeType: 'learning_objective', name: 'Explain the key principles of the U.S. Constitution.',
    educationalLevel: '5', subject: NELIESubject.HISTORY_RELIGION, tags: ['us_constitution', 'civics', 'power_authority_governance'],
  }
];
