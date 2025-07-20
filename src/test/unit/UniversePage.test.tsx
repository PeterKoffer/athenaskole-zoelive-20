import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DailyProgramPage from '../../pages/DailyProgramPage';
import { BrowserRouter } from 'react-router-dom';
import { aiUniverseGenerator } from '../../services/AIUniverseGenerator';

// Mock the universe generation service
vi.mock('../../services/AIUniverseGenerator', () => ({
    aiUniverseGenerator: {
        generateUniverse: vi.fn()
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

// Mock useAuth hook
vi.mock('@/hooks/useAuth', () => ({
    useAuth: () => ({
        user: { uid: 'test-user' },
        loading: false,
    }),
}));


describe('DailyProgramPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render the universe title and description', async () => {
        (aiUniverseGenerator.generateUniverse as any).mockResolvedValue(JSON.stringify({
            title: 'Travel to China',
            description: 'You have to travel to China to help a man in his store',
            objectives: [],
        }));

        render(
            <BrowserRouter>
                <DailyProgramPage />
            </BrowserRouter>
        );

        userEvent.click(screen.getByRole('button', { name: /start/i }));

        await waitFor(() => {
            expect(screen.getByText('Travel to China')).toBeInTheDocument();
            expect(screen.getByText('You have to travel to China to help a man in his store')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /start learning session/i })).toBeInTheDocument();
        });
    });

    it('should render the curriculum standards', async () => {
        (aiUniverseGenerator.generateUniverse as any).mockResolvedValue(JSON.stringify({
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
        }));

        render(
            <BrowserRouter>
                <DailyProgramPage />
            </BrowserRouter>
        );

        userEvent.click(screen.getByRole('button', { name: /start/i }));

        await waitFor(() => {
            expect(screen.getByText('Solve real-world and mathematical problems by writing and solving equations of the form x + p = q and px = q for cases in which p, q and x are all nonnegative rational numbers.')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /start learning session/i })).toBeInTheDocument();
        });
    });
});
