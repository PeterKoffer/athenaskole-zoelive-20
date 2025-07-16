
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DailyUniversePage from '../../pages/DailyUniversePage';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';

// Mock the daily universe generator
vi.mock('../../services/DailyUniverseGenerator', () => ({
    dailyUniverseGenerator: {
        generate: vi.fn()
    }
}));

// Mock react-router-dom navigate
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

// Mock sonner toast
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn()
    }
}));

import { dailyUniverseGenerator } from '../../services/DailyUniverseGenerator';

describe('DailyUniversePage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render the universe title and description', async () => {
        (dailyUniverseGenerator.generate as any).mockResolvedValue({
            title: 'Travel to China',
            description: 'You have to travel to China to help a man in his store',
            objectives: [],
        });

        render(
            <BrowserRouter>
                <AuthProvider>
                    <DailyUniversePage />
                </AuthProvider>
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Travel to China')).toBeInTheDocument();
            expect(screen.getByText('You have to travel to China to help a man in his store')).toBeInTheDocument();
        });
    });

    it('should render the curriculum standards', async () => {
        (dailyUniverseGenerator.generate as any).mockResolvedValue({
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

        render(
            <BrowserRouter>
                <AuthProvider>
                    <DailyUniversePage />
                </AuthProvider>
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Solve real-world and mathematical problems by writing and solving equations of the form x + p = q and px = q for cases in which p, q and x are all nonnegative rational numbers.')).toBeInTheDocument();
        });
    });
});
