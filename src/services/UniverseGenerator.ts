export interface Universe {
  id: string;
  title: string;
  description: string;
  theme?: string;
  objectives?: any[];
  learningAtoms?: any[];
}

const universes: Universe[] = [
  {
    id: '1',
    title: 'Travel to China',
    description: 'You have to travel to China to help a friend.',
  },
  {
    id: '2',
    title: 'The Mystery of the Missing Cat',
    description: 'A cat is missing in your neighborhood. You have to find it.',
  },
  {
    id: '3',
    title: 'The Great Wall of China',
    description: 'You are visiting the Great Wall of China.',
  },
  {
    id: '4',
    title: 'The Amazon Rainforest',
    description: 'You are exploring the Amazon rainforest.',
  },
  {
    id: '5',
    title: 'The Lost City of Atlantis',
    description: 'You have discovered the lost city of Atlantis.',
  },
  {
    id: '6',
    title: 'The International Space Station',
    description: 'You are on a mission to the International Space Station.',
  },
];

export const UniverseGenerator = {
  getUniverses: () => universes,
  getUniverseById: (id: string) => universes.find((u) => u.id === id),
};
