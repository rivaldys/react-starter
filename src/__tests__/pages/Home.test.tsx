import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders, userEvent } from '../utils'
import Home from '@/pages/Home'

describe('Home Page', () => {
    it('renders the home page with welcome message', () => {
        renderWithProviders(<Home />)

        expect(screen.getByText(/welcome to react starter/i)).toBeInTheDocument()
    })

    it('displays the description text', () => {
        renderWithProviders(<Home />)

        expect(screen.getByText(/atomic design methodology/i)).toBeInTheDocument()
    })

    it('shows the edit instruction', () => {
        renderWithProviders(<Home />)

        expect(screen.getByText(/src\/pages\/Home\/index\.tsx/i)).toBeInTheDocument()
    })

    it('renders within the Layout component', () => {
        renderWithProviders(<Home />)

        // Check for layout elements (navbar, footer)
        expect(screen.getByRole('navigation')).toBeInTheDocument()
    })
})
