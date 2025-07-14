export interface Universe {
    id: string;
    title: string;
    description: string;
}

const universes: Universe[] = [
    {
        id: '1',
        title: 'Travel to China',
        description: 'You have to travel to China to help a man in his store.'
    },
    {
        id: '2',
        title: 'Power Outage',
        description: 'All power is out in your home, we have some fixing to do.'
    },
    {
        id: '3',
        title: 'Sporting Goods Store',
        description: 'Your local mall needs a sporting goods store, you will open it.'
    },
    {
        id: '4',
        title: 'Car Crash Investigation',
        description: 'Two cars crashed outside your house this morning, help the police with the investigations.'
    }
];

export const UniverseGenerator = {
    getUniverses: (): Universe[] => {
        return universes;
    }
};
