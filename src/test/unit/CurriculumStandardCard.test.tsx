import React from 'react';
import { render, screen } from '@testing-library/react';
import CurriculumStandardCard from '../../components/CurriculumStandardCard';
import { CurriculumStandard } from '../../services/CurriculumMapper';

describe('CurriculumStandardCard', () => {
    it('should render the curriculum standard', () => {
        const standard: CurriculumStandard = {
            id: 'MATH.CONTENT.6.EE.B.7',
            subject: 'Math',
            gradeLevel: 6,
            description: 'Solve real-world and mathematical problems by writing and solving equations of the form x + p = q and px = q for cases in which p, q and x are all nonnegative rational numbers.',
            keywords: ['math', 'equations', 'problems', 'numbers']
        };
        render(<CurriculumStandardCard standard={standard} />);
        expect(screen.getByText('MATH.CONTENT.6.EE.B.7')).toBeInTheDocument();
        expect(screen.getByText('Solve real-world and mathematical problems by writing and solving equations of the form x + p = q and px = q for cases in which p, q and x are all nonnegative rational numbers.')).toBeInTheDocument();
    });
});
