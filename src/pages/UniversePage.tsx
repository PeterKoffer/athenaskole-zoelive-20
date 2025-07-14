import React, { useState, useEffect } from 'react';
import UniversePlayer from '../components/UniversePlayer';
import { AIUniverseGenerator } from '../services/AIUniverseGenerator';
import { Universe } from '../services/UniverseGenerator';
import { PersonalizationEngine } from '../services/PersonalizationEngine';
import { StudentProfile } from '../types/student';

const UniversePage: React.FC = () => {
    const [universe, setUniverse] = useState<Universe | null>(null);

    useEffect(() => {
        const generateUniverse = async () => {
            const student: StudentProfile = {
                id: '1',
                name: 'John Doe',
                gradeLevel: 6,
                interests: ['space', 'dinosaurs'],
                abilities: {
                    math: 'intermediate'
                }
            };
            const initialUniverse: Universe = {
                id: '1',
                title: 'Travel to China',
                description: 'You have to travel to China to help a man in his store.'
            };
            const newUniverse = await PersonalizationEngine.personalizeUniverse(initialUniverse, student);
            setUniverse(newUniverse);
        };

        generateUniverse();
    }, []);

    return (
        <div>
            <h1>Universe Page</h1>
            {universe ? <UniversePlayer universe={universe} /> : <p>Loading...</p>}
        </div>
    );
};

export default UniversePage;
