
import { Universe } from './UniverseGenerator';
import curriculum from '../data/curriculum.json';
import Fuse from 'fuse.js';

export interface CurriculumStandard {
    id: string;
    subject: string;
    gradeLevel: number;
    description: string;
    keywords: string[];
}

const fuse = new Fuse(curriculum, {
    keys: ['keywords']
});

export const CurriculumMapper = {
    getStandardsForUniverse: (universe: Universe): CurriculumStandard[] => {
        const universeKeywords = [...universe.title.toLowerCase().split(' '), ...universe.description.toLowerCase().split(' ')];
        const relevantStandards = universeKeywords.flatMap(keyword => {
            return fuse.search(keyword).map(result => result.item);
        });
        return [...new Set(relevantStandards)]; // Remove duplicates
    }
};
