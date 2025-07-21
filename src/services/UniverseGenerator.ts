
export interface Universe {
  id?: string;
  title: string;
  description: string;
  theme?: string;
  /** Optional image representing the universe */
  image?: string;
  characters: string[];
  locations: string[];
  activities: string[];
}

// Basic sample universes used for tests and fallback scenarios
const sampleUniverses: Universe[] = [
  {
    id: 'u1',
    title: 'Math Quest',
    description: 'Explore the realm of numbers and logic.',
    theme: 'mathematics',
    image: '/lovable-uploads/e8c77180-c952-401c-9f41-7bfb74d94967.png',
    characters: ['Professor Numberton', 'Calculator Cat'],
    locations: ['Addition Alley', 'Fraction Forest'],
    activities: ['Solve puzzles', 'Collect numbers']
  },
  {
    id: 'u2',
    title: 'Science Safari',
    description: 'Investigate the wonders of the natural world.',
    theme: 'science',
    image: '/lovable-uploads/3e7290ac-38f6-419d-af42-91ed54e26b77.png',
    characters: ['Dr. Atom', 'Inspector Photon'],
    locations: ['Molecule Meadow', 'Gravity Gorge'],
    activities: ['Run experiments', 'Collect samples']
  },
  {
    id: 'u3',
    title: 'History Hunters',
    description: 'Travel through time to famous events.',
    theme: 'history',
    image: '/lovable-uploads/5533306d-0f97-4375-b7ef-14fc095edef3.png',
    characters: ['Chrono Captain', 'Archive Aria'],
    locations: ['Medieval Market', 'Renaissance Road'],
    activities: ['Interview locals', 'Document discoveries']
  },
  {
    id: 'u4',
    title: 'Language Land',
    description: 'Master communication in many languages.',
    theme: 'languages',
    image: '/lovable-uploads/9d6652ab-9a6c-41b4-b243-88ec0f5add86.png',
    characters: ['Linguist Leo', 'Grammar Genie'],
    locations: ['Vocabulary Valley', 'Syntax Summit'],
    activities: ['Dialogue practice', 'Word games']
  },
  {
    id: 'u5',
    title: 'Art Adventure',
    description: 'Express creativity through various mediums.',
    theme: 'arts',
    image: '/lovable-uploads/21d261a5-4b71-4ced-a38c-416551e6cd98.png',
    characters: ['Painter Pixel', 'Maestro Melody'],
    locations: ['Canvas Cove', 'Sculpture Square'],
    activities: ['Create masterpieces', 'Study famous works']
  },
  {
    id: 'u6',
    title: 'Tech Trek',
    description: 'Discover the power of technology and coding.',
    theme: 'technology',
    image: '/lovable-uploads/d6dd5b62-fafb-483a-be80-1fb5d88c9b3a.png',
    characters: ['Coder Chip', 'Debug Droid'],
    locations: ['Binary Bay', 'Algorithm Avenue'],
    activities: ['Build programs', 'Solve logic problems']
  }
];

export class UniverseGenerator {
  static getUniverses(): Universe[] {
    return sampleUniverses;
  }

  static getUniverseById(id: string): Universe | undefined {
    return sampleUniverses.find(u => u.id === id);
  }
}
