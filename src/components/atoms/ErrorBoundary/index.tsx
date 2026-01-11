import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
    children: ReactNode
    fallback?: ReactNode
    onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
    hasError: boolean
    error: Error | null
    errorInfo: ErrorInfo | null
}

/**
 * Error Boundary component for catching JavaScript errors anywhere in the child component tree.
 * 
 * Features:
 * - Catches errors during rendering, in lifecycle methods, and in constructors
 * - Displays a fallback UI instead of the crashed component tree
 * - Logs error information for debugging
 * - Provides a "Try Again" button to reset the error state
 * 
 * @example
 * // Basic usage - wraps entire app
 * <ErrorBoundary>
 *     <App />
 * </ErrorBoundary>
 * 
 * @example
 * // With custom fallback and error handler
 * <ErrorBoundary 
 *     fallback={<CustomErrorPage />}
 *     onError={(error, info) => logToService(error, info)}
 * >
 *     <MyComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        }
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Log error to console in development
        if (import.meta.env.DEV) {
            console.error('ErrorBoundary caught an error:', error)
            console.error('Component stack:', errorInfo.componentStack)
        }

        // Update state with error info
        this.setState({ errorInfo })

        // Call custom error handler if provided
        this.props.onError?.(error, errorInfo)
    }

    handleReset = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        })
    }

    render(): ReactNode {
        if (this.state.hasError) {
            // Render custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback
            }

            // Default fallback UI
            return (
                <div style={styles.container}>
                    <div style={styles.content}>
                        <div style={styles.iconWrapper}>
                            <svg
                                style={styles.icon}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                                />
                            </svg>
                        </div>
                        <h1 style={styles.title}>Something went wrong</h1>
                        <p style={styles.message}>
                            We're sorry, but something unexpected happened. Please try again.
                        </p>
                        
                        {import.meta.env.DEV && this.state.error && (
                            <details style={styles.details}>
                                <summary style={styles.summary}>Error Details (Dev Only)</summary>
                                <pre style={styles.errorText}>
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}

                        <div style={styles.buttonGroup}>
                            <button
                                onClick={this.handleReset}
                                style={styles.primaryButton}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#4338ca'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#4f46e5'
                                }}
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                style={styles.secondaryButton}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f3f4f6'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#ffffff'
                                }}
                            >
                                Reload Page
                            </button>
                        </div>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

// Inline styles to avoid external CSS dependencies
const styles: Record<string, React.CSSProperties> = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '1rem',
        backgroundColor: '#f9fafb',
        fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    content: {
        maxWidth: '28rem',
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: '#ffffff',
        borderRadius: '0.75rem',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
    },
    iconWrapper: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '1rem'
    },
    icon: {
        width: '4rem',
        height: '4rem',
        color: '#ef4444'
    },
    title: {
        fontSize: '1.5rem',
        fontWeight: 600,
        color: '#111827',
        marginBottom: '0.5rem'
    },
    message: {
        fontSize: '1rem',
        color: '#6b7280',
        marginBottom: '1.5rem',
        lineHeight: 1.5
    },
    details: {
        marginBottom: '1.5rem',
        textAlign: 'left'
    },
    summary: {
        cursor: 'pointer',
        fontSize: '0.875rem',
        fontWeight: 500,
        color: '#4b5563',
        marginBottom: '0.5rem'
    },
    errorText: {
        fontSize: '0.75rem',
        color: '#dc2626',
        backgroundColor: '#fef2f2',
        padding: '1rem',
        borderRadius: '0.375rem',
        overflow: 'auto',
        maxHeight: '12rem',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
    },
    buttonGroup: {
        display: 'flex',
        gap: '0.75rem',
        justifyContent: 'center',
        flexWrap: 'wrap'
    },
    primaryButton: {
        padding: '0.625rem 1.25rem',
        fontSize: '0.875rem',
        fontWeight: 500,
        color: '#ffffff',
        backgroundColor: '#4f46e5',
        border: 'none',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        transition: 'background-color 0.15s ease'
    },
    secondaryButton: {
        padding: '0.625rem 1.25rem',
        fontSize: '0.875rem',
        fontWeight: 500,
        color: '#374151',
        backgroundColor: '#ffffff',
        border: '1px solid #d1d5db',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        transition: 'background-color 0.15s ease'
    }
}

export default ErrorBoundary
