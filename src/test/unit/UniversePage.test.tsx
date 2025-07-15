import React from 'react';
import { render, screen } from '@testing-library/react';
import DailyUniversePage from '../../pages/DailyUniversePage';
import { contentGenerationService } from '../../services/ContentGenerationService';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../services/ContentGenerationService');

describe('UniversePage', () => {
    it('should render the universe title and description', () => {
        (contentGenerationService.generateDailyUniverse as jest.Mock).mockReturnValue({
            title: 'Travel to China',
            description: 'You have to travel to China to help a man in his store',
            objectives: [],
        });
        render(<BrowserRouter><DailyUniversePage /></BrowserRouter>);
        expect(screen.getByText('Travel to China')).toBeInTheDocument();
        expect(screen.getByText('You have to travel to China to help a man in his store')).toBeInTheDocument();
    });

    it('should render the curriculum standards', () => {
        (contentGenerationService.generateDailyUniverse as jest.Mock).mockReturnValue({
            title: 'Travel to China',
            description: 'You have to travel to China to help a man in his store',
            objectives: [
                {
                    id: '1',
                    name: 'Math Objective',
                    description: 'Solve real-world and mathematical problems by writing and solving equations of the form x + p = q and px = q for cases in which p, q and x are all nonnegative rational numbers.',
                    subjectName: 'Math',
                    educationalLevel: 'Grade 6',
                },
            ],
        });
        render(<BrowserRouter><DailyUniversePage /></BrowserRouter>);
        expect(screen.getByText('Solve real-world and mathematical problems by writing and solving equations of the form x + p = q and px = q for cases in which p, q and x are all nonnegative rational numbers.')).toBeInTheDocument();
    });
});
