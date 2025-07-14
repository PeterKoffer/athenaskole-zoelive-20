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
            <h3>Characters</h3>
            <ul>
                {universe.characters.map(character => (
                    <li key={character}>{character}</li>
                ))}
            </ul>
            <h3>Locations</h3>
            <ul>
                {universe.locations.map(location => (
                    <li key={location}>{location}</li>
                ))}
            </ul>
            <h3>Activities</h3>
            <ul>
                {universe.activities.map(activity => (
                    <li key={activity}>{activity}</li>
                ))}
            </ul>
        </div>
    );
};

export default UniversePlayer;
