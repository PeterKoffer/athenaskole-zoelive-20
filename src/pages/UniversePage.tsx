import React, { useState, useEffect } from 'react';
import UniversePlayer from '../components/UniversePlayer';
import { AIUniverseGenerator } from '../services/AIUniverseGenerator';
import { Universe } from '../services/UniverseGenerator';

const UniversePage: React.FC = () => {
    const [universe, setUniverse] = useState<Universe | null>(null);

    useEffect(() => {
        const generateUniverse = async () => {
            const newUniverse = await AIUniverseGenerator.generateUniverse('A story about a friendly robot who needs help learning about fractions.');
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
