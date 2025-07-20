
export interface Universe {
  id?: string;
  title: string;
  description: string;
  theme?: string;
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
    characters: ['Professor Numberton', 'Calculator Cat'],
    locations: ['Addition Alley', 'Fraction Forest'],
    activities: ['Solve puzzles', 'Collect numbers']
  },
  {
    id: 'u2',
    title: 'Science Safari',
    description: 'Investigate the wonders of the natural world.',
    theme: 'science',
    characters: ['Dr. Atom', 'Inspector Photon'],
    locations: ['Molecule Meadow', 'Gravity Gorge'],
    activities: ['Run experiments', 'Collect samples']
  },
  {
    id: 'u3',
    title: 'History Hunters',
    description: 'Travel through time to famous events.',
    theme: 'history',
    characters: ['Chrono Captain', 'Archive Aria'],
    locations: ['Medieval Market', 'Renaissance Road'],
    activities: ['Interview locals', 'Document discoveries']
  },
  {
    id: 'u4',
    title: 'Language Land',
    description: 'Master communication in many languages.',
    theme: 'languages',
    characters: ['Linguist Leo', 'Grammar Genie'],
    locations: ['Vocabulary Valley', 'Syntax Summit'],
    activities: ['Dialogue practice', 'Word games']
  },
  {
    id: 'u5',
    title: 'Art Adventure',
    description: 'Express creativity through various mediums.',
    theme: 'arts',
    characters: ['Painter Pixel', 'Maestro Melody'],
    locations: ['Canvas Cove', 'Sculpture Square'],
    activities: ['Create masterpieces', 'Study famous works']
  },
  {
    id: 'u6',
    title: 'Tech Trek',
    description: 'Discover the power of technology and coding.',
    theme: 'technology',
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
