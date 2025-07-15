
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import UniversePage from '../../pages/UniversePage';

describe('UniversePage', () => {
    it('should render the universe title and description', () => {
        const { getByText } = render(<UniversePage />);
        expect(getByText('Travel to China')).toBeInTheDocument();
        expect(getByText('You have to travel to China to help a man in his store.')).toBeInTheDocument();
    });

    it('should render the curriculum standards', () => {
        const { getByText } = render(<UniversePage />);
        expect(getByText('Solve real-world and mathematical problems by writing and solving equations of the form x + p = q and px = q for cases in which p, q and x are all nonnegative rational numbers.')).toBeInTheDocument();
        expect(getByText('Know precise definitions of angle, circle, perpendicular line, parallel line, and line segment, based on the undefined notions of point, line, distance along a line, and distance around a circular arc.')).toBeInTheDocument();
    });
});
