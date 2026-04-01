import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect, vi } from 'vitest';
import { Provider } from 'react-redux';
import { store } from './store';
import { MemoryRouter } from 'react-router-dom';

describe('App', () => {
    it('renders ShopSmart title', () => {
        // Mock fetch
        global.fetch = vi.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ status: 'ok', message: 'Test Msg', timestamp: 'now' })
            })
        );

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <App />
                </MemoryRouter>
            </Provider>
        );
        const linkElements = screen.getAllByText(/ShopSmart/i);
        expect(linkElements.length).toBeGreaterThan(0);
    });
});
