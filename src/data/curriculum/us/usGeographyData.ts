
import { CurriculumNode } from '@/types/curriculum/CurriculumNode';
import { NELIESubject } from '@/types/curriculum/NELIESubjects';

export const usGeographyCurriculumData: CurriculumNode[] = [
  // US Geography Subject Node
  {
    id: 'us-geography',
    parentId: 'us-root',
    nodeType: 'subject',
    name: 'Geography',
    description: 'Curriculum for K-12 Geography in the United States, covering spatial thinking, places and regions, physical systems, human systems, and environment-society interactions.',
    educationalLevel: 'K-12',
    subject: NELIESubject.GEOGRAPHY,
    countryCode: 'US',
    languageCode: 'en',
    tags: ['geography', 'social_studies', 'spatial_thinking', 'usa'],
  },

  // --- Kindergarten: My World ---
  {
    id: 'us-k-geo', parentId: 'us-geography', nodeType: 'course', name: 'Kindergarten Geography',
    description: 'Introduction to geography, focusing on maps, personal location, and the immediate environment.',
    educationalLevel: 'K', subject: NELIESubject.GEOGRAPHY, tags: ['kindergarten', 'maps_basics', 'personal_location'],
  },
  {
    id: 'us-k-geo-spatial', parentId: 'us-k-geo', nodeType: 'domain', name: 'The World in Spatial Terms',
    educationalLevel: 'K', subject: NELIESubject.GEOGRAPHY, tags: ['maps', 'globes', 'location'],
  },
  {
    id: 'us-k-geo-lo1', parentId: 'us-k-geo-spatial', nodeType: 'learning_objective', name: 'Identify a map and a globe as representations of Earth.',
    educationalLevel: 'K', subject: NELIESubject.GEOGRAPHY, tags: ['maps', 'globes', 'spatial_thinking'],
  },
  {
    id: 'us-k-geo-lo2', parentId: 'us-k-geo-spatial', nodeType: 'learning_objective', name: 'Describe the location of self and objects in the classroom.',
    educationalLevel: 'K', subject: NELIESubject.GEOGRAPHY, tags: ['relative_location', 'classroom_geography'],
  },

  // --- Grade 1: My Community ---
  {
    id: 'us-g1-geo', parentId: 'us-geography', nodeType: 'course', name: 'Grade 1 Geography',
    description: 'Focus on the geography of the local community.',
    educationalLevel: '1', subject: NELIESubject.GEOGRAPHY, tags: ['grade1', 'community_geography', 'local_maps'],
  },
  {
    id: 'us-g1-geo-places', parentId: 'us-g1-geo', nodeType: 'domain', name: 'Places and Regions',
    educationalLevel: '1', subject: NELIESubject.GEOGRAPHY, tags: ['community_features', 'local_places'],
  },
  {
    id: 'us-g1-geo-lo1', parentId: 'us-g1-geo-places', nodeType: 'learning_objective', name: 'Create and use simple maps of the classroom and school.',
    educationalLevel: '1', subject: NELIESubject.GEOGRAPHY, tags: ['map_making', 'school_map', 'classroom_map'],
  },
  {
    id: 'us-g1-geo-lo2', parentId: 'us-g1-geo-places', nodeType: 'learning_objective', name: 'Identify natural and human-made features in the community.',
    educationalLevel: '1', subject: NELIESubject.GEOGRAPHY, tags: ['physical_features', 'human_features', 'community_places'],
  },

  // --- Grade 2: Our World ---
  {
    id: 'us-g2-geo', parentId: 'us-geography', nodeType: 'course', name: 'Grade 2 Geography',
    description: 'Expanding to understand continents, oceans, and different environments.',
    educationalLevel: '2', subject: NELIESubject.GEOGRAPHY, tags: ['grade2', 'world_geography', 'continents_oceans'],
  },
  {
    id: 'us-g2-geo-world', parentId: 'us-g2-geo', nodeType: 'domain', name: 'The World',
    educationalLevel: '2', subject: NELIESubject.GEOGRAPHY, tags: ['continents', 'oceans', 'world_map'],
  },
  {
    id: 'us-g2-geo-lo1', parentId: 'us-g2-geo-world', nodeType: 'learning_objective', name: 'Locate and name the seven continents and five oceans.',
    educationalLevel: '2', subject: NELIESubject.GEOGRAPHY, tags: ['continents', 'oceans', 'world_map'],
  },
  {
    id: 'us-g2-geo-lo2', parentId: 'us-g2-geo-world', nodeType: 'learning_objective', name: 'Compare different kinds of communities (urban, suburban, rural).',
    educationalLevel: '2', subject: NELIESubject.GEOGRAPHY, tags: ['community_types', 'urban', 'suburban', 'rural'],
  },

  // --- Grade 3: Our State & Region ---
  {
    id: 'us-g3-geo', parentId: 'us-geography', nodeType: 'course', name: 'Grade 3 Geography',
    description: 'Focus on the geography of the local state and region.',
    educationalLevel: '3', subject: NELIESubject.GEOGRAPHY, tags: ['grade3', 'state_geography', 'regional_landforms'],
  },
  {
    id: 'us-g3-geo-state', parentId: 'us-g3-geo', nodeType: 'domain', name: 'State & Regional Geography',
    educationalLevel: '3', subject: NELIESubject.GEOGRAPHY, tags: ['state_maps', 'human_environment_interaction'],
  },
  {
    id: 'us-g3-geo-lo1', parentId: 'us-g3-geo-state', nodeType: 'learning_objective', name: 'Use maps to identify major cities, rivers, and landforms in their state.',
    educationalLevel: '3', subject: NELIESubject.GEOGRAPHY, tags: ['state_maps', 'physical_geography', 'human_geography'],
  },
  {
    id: 'us-g3-geo-lo2', parentId: 'us-g3-geo-state', nodeType: 'learning_objective', name: 'Explain how the environment affects human activity in their region.',
    educationalLevel: '3', subject: NELIESubject.GEOGRAPHY, tags: ['human_environment_interaction', 'regional_adaptation'],
  },

  // --- Grade 4: U.S. Regions ---
  {
    id: 'us-g4-geo', parentId: 'us-geography', nodeType: 'course', name: 'Grade 4 Geography',
    description: 'Study of the physical and human geography of the different regions of the United States.',
    educationalLevel: '4', subject: NELIESubject.GEOGRAPHY, tags: ['grade4', 'us_regions', 'regional_geography'],
  },
  {
    id: 'us-g4-geo-regions', parentId: 'us-g4-geo', nodeType: 'domain', name: 'U.S. Regions',
    educationalLevel: '4', subject: NELIESubject.GEOGRAPHY, tags: ['us_regions_map', 'regional_comparison'],
  },
  {
    id: 'us-g4-geo-lo1', parentId: 'us-g4-geo-regions', nodeType: 'learning_objective', name: 'Locate the major regions of the United States and identify their states.',
    educationalLevel: '4', subject: NELIESubject.GEOGRAPHY, tags: ['us_regions_map', 'state_identification'],
  },
  {
    id: 'us-g4-geo-lo2', parentId: 'us-g4-geo-regions', nodeType: 'learning_objective', name: 'Compare the climate, landforms, and natural resources of different U.S. regions.',
    educationalLevel: '4', subject: NELIESubject.GEOGRAPHY, tags: ['regional_comparison', 'physical_systems', 'natural_resources'],
  },

  // --- Grade 5: The United States in the World ---
  {
    id: 'us-g5-geo', parentId: 'us-geography', nodeType: 'course', name: 'Grade 5 Geography',
    description: 'Focus on the geography of the United States in relation to the Western Hemisphere.',
    educationalLevel: '5', subject: NELIESubject.GEOGRAPHY, tags: ['grade5', 'western_hemisphere', 'us_geography_context'],
  },
  {
    id: 'us-g5-geo-hemisphere', parentId: 'us-g5-geo', nodeType: 'domain', name: 'The Western Hemisphere',
    educationalLevel: '5', subject: NELIESubject.GEOGRAPHY, tags: ['map_skills', 'human_settlement'],
  },
  {
    id: 'us-g5-geo-lo1', parentId: 'us-g5-geo-hemisphere', nodeType: 'learning_objective', name: 'Use latitude and longitude to locate places in the Western Hemisphere.',
    educationalLevel: '5', subject: NELIESubject.GEOGRAPHY, tags: ['latitude_longitude', 'coordinate_system', 'map_skills'],
  },
  {
    id: 'us-g5-geo-lo2', parentId: 'us-g5-geo-hemisphere', nodeType: 'learning_objective', name: 'Describe major patterns of human settlement in the Americas.',
    educationalLevel: '5', subject: NELIESubject.GEOGRAPHY, tags: ['human_settlement', 'population_distribution', 'americas'],
  }
];
