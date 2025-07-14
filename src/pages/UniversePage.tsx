import React from 'react';
import UniversePlayer from '../components/UniversePlayer';
import { UniverseGenerator } from '../services/UniverseGenerator';

const UniversePage: React.FC = () => {
    const universes = UniverseGenerator.getUniverses();
    const universe = universes[0]; // For now, just display the first universe

    return (
        <div>
            <h1>Universe Page</h1>
            <UniversePlayer universe={universe} />
        </div>
    );
};

export default UniversePage;
