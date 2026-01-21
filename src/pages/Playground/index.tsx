import { useState } from 'react'
import { ErrorBoundary, Skeleton, LoadingFallback } from '@/components'
import { Layout } from '@/components'
import './index.css'

/**
 * Component that intentionally throws an error for testing ErrorBoundary
 */
function BuggyComponent({ shouldThrow }: { shouldThrow: boolean }) {
    if (shouldThrow) {
        throw new Error('This is a test error thrown intentionally to demonstrate ErrorBoundary!')
    }
    return (
        <div className="playground-success-box">
            ✅ Component rendered successfully (no error)
        </div>
    )
}

/**
 * Component Playground page for testing and previewing UI components
 * 
 * This page provides visual demonstrations of:
 * - ErrorBoundary component behavior
 * - Skeleton loading components
 * - LoadingFallback variants
 * 
 * Note: This page is only accessible in development mode.
 */
export default function ComponentPlayground()
{
    const [triggerError, setTriggerError] = useState(false)
    const [errorKey, setErrorKey] = useState(0)
    const [skeletonVariant, setSkeletonVariant] = useState<'pulse' | 'wave' | 'none'>('pulse')
    const [skeletonKey, setSkeletonKey] = useState(0)
    const [loadingType, setLoadingType] = useState<'page' | 'card' | 'list' | 'text'>('page')

    const handleTriggerError = () => {
        setTriggerError(true)
    }

    const handleResetError = () => {
        setTriggerError(false)
        setErrorKey(prev => prev + 1)
    }

    const handleVariantChange = (newVariant: 'pulse' | 'wave' | 'none') => {
        setSkeletonVariant(newVariant)
        setSkeletonKey(prev => prev + 1)
    }

    return (
        <>
            <title>Component Playground &#8729; React Starter</title>
            <meta name="description" content="Interactive playground for testing and previewing UI components including ErrorBoundary, Skeleton, and LoadingFallback." />
            <meta name="robots" content="noindex, nofollow" />

            <Layout>
                <div className="playground-container">
                    {/* Title Section */}
                    <div className="playground-title-wrapper">
                        <h1 className="playground-title">🧩 Component Playground</h1>
                        <p className="playground-description">
                            Interactive showcase for testing and previewing UI components behavior.
                        </p>
                    </div>

                    {/* Error Boundary Section */}
                    <section className="playground-section">
                        <h2 className="playground-section-title">Error Boundary</h2>
                        <p className="playground-section-description">
                            Test how the ErrorBoundary component catches and displays errors gracefully.
                        </p>

                        <div className="playground-controls">
                            <button
                                onClick={handleTriggerError}
                                className="playground-button playground-button--danger"
                                disabled={triggerError}
                            >
                                💥 Trigger Error
                            </button>
                            <button
                                onClick={handleResetError}
                                className="playground-button playground-button--primary"
                            >
                                🔄 Reset Component
                            </button>
                        </div>

                        <div className="playground-demo-box">
                            <ErrorBoundary
                                key={errorKey}
                                onError={(error, info) => {
                                    console.log('[Playground] Error caught:', error.message)
                                    console.log('[Playground] Component stack:', info.componentStack)
                                }}
                            >
                                <BuggyComponent shouldThrow={triggerError} />
                            </ErrorBoundary>
                        </div>
                    </section>

                    {/* Skeleton Section */}
                    <section className="playground-section">
                        <h2 className="playground-section-title">Skeleton Component</h2>
                        <p className="playground-section-description">
                            Preview skeleton loading animations with different variants.
                        </p>

                        <div className="playground-controls">
                            <label className="playground-label">Animation Variant:</label>
                            <select
                                value={skeletonVariant}
                                onChange={(e) => handleVariantChange(e.target.value as 'pulse' | 'wave' | 'none')}
                                className="playground-select"
                            >
                                <option value="pulse">Pulse</option>
                                <option value="wave">Wave</option>
                                <option value="none">None</option>
                            </select>
                        </div>

                        <div key={skeletonKey} className="playground-skeleton-grid">
                            {/* Text Skeleton */}
                            <div className="playground-skeleton-card">
                                <h4 className="playground-card-title">Text Lines</h4>
                                <Skeleton variant={skeletonVariant} count={3} height={16} gap={8} />
                            </div>

                            {/* Avatar Skeleton */}
                            <div className="playground-skeleton-card">
                                <h4 className="playground-card-title">Avatar</h4>
                                <div className="playground-avatar-row">
                                    <Skeleton variant={skeletonVariant} width={48} height={48} borderRadius="full" />
                                    <div className="playground-avatar-content">
                                        <Skeleton variant={skeletonVariant} width="80%" height={16} />
                                        <Skeleton variant={skeletonVariant} width="60%" height={12} style={{ marginTop: 8 }} />
                                    </div>
                                </div>
                            </div>

                            {/* Card Skeleton */}
                            <div className="playground-skeleton-card">
                                <h4 className="playground-card-title">Card</h4>
                                <Skeleton variant={skeletonVariant} width="100%" height={120} borderRadius={8} />
                                <Skeleton variant={skeletonVariant} width="70%" height={20} style={{ marginTop: 12 }} />
                                <Skeleton variant={skeletonVariant} width="100%" height={14} style={{ marginTop: 8 }} />
                            </div>

                            {/* Button Skeleton */}
                            <div className="playground-skeleton-card">
                                <h4 className="playground-card-title">Buttons</h4>
                                <div className="playground-buttons-row">
                                    <Skeleton variant={skeletonVariant} width={100} height={36} borderRadius={6} />
                                    <Skeleton variant={skeletonVariant} width={100} height={36} borderRadius={6} />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Loading Fallback Section */}
                    <section className="playground-section">
                        <h2 className="playground-section-title">Loading Fallback</h2>
                        <p className="playground-section-description">
                            Preview different loading fallback layouts used during page/component loading.
                        </p>

                        <div className="playground-controls">
                            <label className="playground-label">Fallback Type:</label>
                            <select
                                value={loadingType}
                                onChange={(e) => setLoadingType(e.target.value as 'page' | 'card' | 'list' | 'text')}
                                className="playground-select"
                            >
                                <option value="page">Page</option>
                                <option value="card">Card</option>
                                <option value="list">List</option>
                                <option value="text">Text</option>
                            </select>
                        </div>

                        <div className="playground-loading-preview">
                            <div className="playground-loading-preview-inner">
                                <LoadingFallback type={loadingType} itemCount={3} />
                            </div>
                        </div>
                    </section>

                    {/* Component Usage Section */}
                    <section className="playground-section">
                        <h2 className="playground-section-title">Usage Examples</h2>

                        <div className="playground-code-block">
                            <h4 className="playground-code-title">ErrorBoundary</h4>
                            <pre className="playground-code">
    {`import { ErrorBoundary } from '@/components'

    <ErrorBoundary
        fallback={<CustomErrorUI />}
        onError={(error, info) => logToService(error)}
    >
        <YourComponent />
    </ErrorBoundary>`}
                            </pre>
                        </div>

                        <div className="playground-code-block">
                            <h4 className="playground-code-title">Skeleton</h4>
                            <pre className="playground-code">
    {`import { Skeleton } from '@/components'

    // Text lines
    <Skeleton count={3} height={16} gap={8} />

    // Avatar
    <Skeleton width={48} height={48} borderRadius="full" />

    // With wave animation
    <Skeleton variant="wave" width="100%" height={200} />`}
                            </pre>
                        </div>

                        <div className="playground-code-block">
                            <h4 className="playground-code-title">LoadingFallback</h4>
                            <pre className="playground-code">
    {`import { LoadingFallback } from '@/components'

    // In Suspense
    <Suspense fallback={<LoadingFallback type="page" />}>
        <LazyComponent />
    </Suspense>

    // Types: 'page' | 'card' | 'list' | 'text'`}
                            </pre>
                        </div>
                    </section>
                </div>
            </Layout>
        </>
    )
}
