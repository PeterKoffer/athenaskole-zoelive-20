
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
    },
    {
        id: '5',
        title: 'Space Mission Control',
        description: 'You are a mission controller helping astronauts solve problems in space.',
        characters: ['You', 'The Astronaut', 'Mission Commander'],
        locations: ['Mission Control Center', 'International Space Station'],
        activities: ['Calculate orbital trajectories', 'Monitor life support systems', 'Plan spacewalk activities']
    },
    {
        id: '6',
        title: 'Dinosaur Discovery',
        description: 'You are a paleontologist who has just discovered a new dinosaur fossil site.',
        characters: ['You', 'Field Assistant', 'Museum Director'],
        locations: ['Excavation Site', 'Research Lab', 'Natural History Museum'],
        activities: ['Carefully excavate fossils', 'Identify dinosaur species', 'Create museum exhibit']
    }
];

export const UniverseGenerator = {
    getUniverses: (): Universe[] => {
        return universes;
    },

    getUniverseById: (id: string): Universe | undefined => {
        return universes.find(universe => universe.id === id);
    },

    getRandomUniverse: (): Universe => {
        const randomIndex = Math.floor(Math.random() * universes.length);
        return universes[randomIndex];
    },

    searchUniverses: (query: string): Universe[] => {
        const lowercaseQuery = query.toLowerCase();
        return universes.filter(universe => 
            universe.title.toLowerCase().includes(lowercaseQuery) ||
            universe.description.toLowerCase().includes(lowercaseQuery) ||
            universe.activities.some(activity => activity.toLowerCase().includes(lowercaseQuery))
        );
    },

    getUniversesByTheme: (theme: string): Universe[] => {
        const lowercaseTheme = theme.toLowerCase();
        return universes.filter(universe => 
            universe.title.toLowerCase().includes(lowercaseTheme) ||
            universe.description.toLowerCase().includes(lowercaseTheme)
        );
    }
};
