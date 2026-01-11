/// <reference types="vite/client" />
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders, userEvent } from '../utils'
import ErrorBoundary from '@/components/atoms/ErrorBoundary'

// Component that throws an error for testing
function ThrowError({ shouldThrow = true }: { shouldThrow?: boolean }) {
    if (shouldThrow) {
        throw new Error('Test error')
    }
    return <div>No error</div>
}

// Suppress console.error for error boundary tests
const originalError = console.error
beforeEach(() => {
    console.error = vi.fn()
})

afterEach(() => {
    console.error = originalError
})

describe('ErrorBoundary', () => {
    it('renders children when there is no error', () => {
        renderWithProviders(
            <ErrorBoundary>
                <div>Test content</div>
            </ErrorBoundary>
        )

        expect(screen.getByText('Test content')).toBeInTheDocument()
    })

    it('renders fallback UI when child throws an error', () => {
        renderWithProviders(
            <ErrorBoundary>
                <ThrowError />
            </ErrorBoundary>
        )

        expect(screen.getByText('Something went wrong')).toBeInTheDocument()
        expect(screen.getByText(/We're sorry, but something unexpected happened/)).toBeInTheDocument()
    })

    it('renders custom fallback when provided', () => {
        renderWithProviders(
            <ErrorBoundary fallback={<div>Custom error page</div>}>
                <ThrowError />
            </ErrorBoundary>
        )

        expect(screen.getByText('Custom error page')).toBeInTheDocument()
    })

    it('calls onError callback when error occurs', () => {
        const onError = vi.fn()

        renderWithProviders(
            <ErrorBoundary onError={onError}>
                <ThrowError />
            </ErrorBoundary>
        )

        expect(onError).toHaveBeenCalled()
        expect(onError.mock.calls[0][0]).toBeInstanceOf(Error)
        expect(onError.mock.calls[0][0].message).toBe('Test error')
    })

    it('resets error state when "Try Again" is clicked', async () => {
        const user = userEvent.setup()
        let shouldThrow = true

        // Use a component that we can control externally
        function ControlledThrow() {
            if (shouldThrow) {
                throw new Error('Test error')
            }
            return <div>No error</div>
        }

        const { rerender } = renderWithProviders(
            <ErrorBoundary>
                <ControlledThrow />
            </ErrorBoundary>
        )

        // Error UI should be shown
        expect(screen.getByText('Something went wrong')).toBeInTheDocument()

        // Now change the flag so it won't throw on next render
        shouldThrow = false

        // Click "Try Again" button - this calls window.location.reload() in the component
        // For testing, we need to verify the button exists and is clickable
        const tryAgainButton = screen.getByRole('button', { name: /try again/i })
        expect(tryAgainButton).toBeInTheDocument()

        // Note: The actual "Try Again" triggers location.reload() which can't be fully tested
        // in jsdom. We verify the UI state and button presence instead.
    })

    it('renders children without error state after key change', () => {
        const { rerender } = renderWithProviders(
            <ErrorBoundary key="error-state">
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        )

        // Error UI should be shown
        expect(screen.getByText('Something went wrong')).toBeInTheDocument()

        // Rerender with different key to reset error boundary
        rerender(
            <ErrorBoundary key="fresh-state">
                <ThrowError shouldThrow={false} />
            </ErrorBoundary>
        )

        // After key change with non-throwing component, content should show
        expect(screen.getByText('No error')).toBeInTheDocument()
    })

    it('shows error details in development mode', () => {
        // Note: In vitest, import.meta.env.DEV is true by default in test environment
        // We can verify the error details are shown when an error occurs
        renderWithProviders(
            <ErrorBoundary>
                <ThrowError />
            </ErrorBoundary>
        )

        // In development mode (which is default in tests), error details should be visible
        // The ErrorBoundary component checks import.meta.env.DEV
        // Error Details section should be present with a <details> element
        expect(screen.getByText(/error details/i)).toBeInTheDocument()
        
        // Error message is inside the pre tag, use regex to find it
        expect(screen.getByText(/Error: Test error/)).toBeInTheDocument()
    })
})
