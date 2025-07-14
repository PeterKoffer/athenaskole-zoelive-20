
export interface Universe {
    id: string;
    title: string;
    description: string;
    characters: string[];
    locations: string[];
    activities: string[];
}

const universes: Universe[] = [
    {
        id: '1',
        title: 'Travel to China',
        description: 'You have to travel to China to help a man in his store.',
        characters: ['You', 'The Shopkeeper'],
        locations: ['A store in China'],
        activities: ['Help the shopkeeper count his money', 'Learn some Chinese phrases']
    },
    {
        id: '2',
        title: 'Power Outage',
        description: 'All power is out in your home, we have some fixing to do.',
        characters: ['You', 'Your Family'],
        locations: ['Your Home'],
        activities: ['Find a flashlight', 'Play a board game']
    },
    {
        id: '3',
        title: 'Sporting Goods Store',
        description: 'Your local mall needs a sporting goods store, you will open it.',
        characters: ['You', 'The Mall Manager'],
        locations: ['The Mall'],
        activities: ['Choose a name for your store', 'Design a logo']
    },
    {
        id: '4',
        title: 'Car Crash Investigation',
        description: 'Two cars crashed outside your house this morning, help the police with the investigations.',
        characters: ['You', 'The Police Officer'],
        locations: ['The Street'],
        activities: ['Interview the witnesses', 'Draw a map of the crash scene']
    }
];

export const UniverseGenerator = {
    getUniverses: (): Universe[] => {
        return universes;
    }
};
