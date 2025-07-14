import { Universe } from './UniverseGenerator';

export interface CurriculumStandard {
    id: string;
    description: string;
}

const curriculumMap: { [key: string]: CurriculumStandard[] } = {
    '1': [
        { id: 'MATH.CONTENT.6.EE.B.7', description: 'Solve real-world and mathematical problems by writing and solving equations of the form x + p = q and px = q for cases in which p, q and x are all nonnegative rational numbers.' },
        { id: 'GEO.G.CO.A.1', description: 'Know precise definitions of angle, circle, perpendicular line, parallel line, and line segment, based on the undefined notions of point, line, distance along a line, and distance around a circular arc.' }
    ],
    '2': [
        { id: 'SCI.PS3.B.1', description: 'Moving objects have kinetic energy and objects may have potential energy due to their relative positions.' },
        { id: 'SCI.PS3.B.2', description: 'The expression for the kinetic energy of an object is 1/2mv^2.' }
    ],
    '3': [
        { id: 'BUS.AD.A.1', description: 'Analyze the role of business in the economic system.' },
        { id: 'BUS.AD.A.2', description: 'Describe the functions of business.' }
    ],
    '4': [
        { id: 'LAW.CR.A.1', description: 'Understand the elements of a crime.' },
        { id: 'LAW.CR.A.2', description: 'Understand the criminal investigation process.' }
    ]
};

export const CurriculumMapper = {
    getStandardsForUniverse: (universe: Universe): CurriculumStandard[] => {
        return curriculumMap[universe.id] || [];
    }
};
