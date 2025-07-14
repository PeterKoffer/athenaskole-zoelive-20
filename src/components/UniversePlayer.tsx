import React from 'react';
import { Universe } from '../services/UniverseGenerator';

interface UniversePlayerProps {
    universe: Universe;
}

const UniversePlayer: React.FC<UniversePlayerProps> = ({ universe }) => {
    return (
        <div>
            <h2>{universe.title}</h2>
            <p>{universe.description}</p>
        </div>
    );
};

export default UniversePlayer;
