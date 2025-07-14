import React from 'react';
import { CurriculumStandard } from '../services/CurriculumMapper';

interface CurriculumStandardCardProps {
    standard: CurriculumStandard;
}

const CurriculumStandardCard: React.FC<CurriculumStandardCardProps> = ({ standard }) => {
    return (
        <div className="border rounded-lg p-4">
            <h3 className="font-bold">{standard.id}</h3>
            <p>{standard.description}</p>
        </div>
    );
};

export default CurriculumStandardCard;
