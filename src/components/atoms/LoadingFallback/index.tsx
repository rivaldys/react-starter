import Skeleton from '../Skeleton'

interface LoadingFallbackProps {
    /** Type of loading fallback to display */
    type?: 'page' | 'card' | 'list' | 'text' | 'custom'
    /** Custom message to display */
    message?: string
    /** Whether to show the message */
    showMessage?: boolean
    /** Number of items for list type */
    itemCount?: number
}

/**
 * Loading Fallback component for SSR and lazy-loaded components
 * 
 * Provides a better UX than simple "Loading..." text by showing
 * skeleton placeholders that match common content layouts.
 * 
 * @example
 * // Full page loading
 * <Suspense fallback={<LoadingFallback type="page" />}>
 *     <LazyPage />
 * </Suspense>
 * 
 * @example
 * // Card loading
 * <Suspense fallback={<LoadingFallback type="card" />}>
 *     <LazyCard />
 * </Suspense>
 * 
 * @example
 * // List loading with custom count
 * <Suspense fallback={<LoadingFallback type="list" itemCount={5} />}>
 *     <LazyList />
 * </Suspense>
 */
export default function LoadingFallback({
    type = 'page',
    message = 'Loading...',
    showMessage = false,
    itemCount = 3
}: LoadingFallbackProps) {
    const renderPageSkeleton = () => (
        <div style={styles.pageContainer}>
            {/* Header skeleton */}
            <div style={styles.header}>
                <Skeleton width={150} height={32} borderRadius={8} />
                <div style={styles.navItems}>
                    <Skeleton width={60} height={20} />
                    <Skeleton width={60} height={20} />
                    <Skeleton width={60} height={20} />
                </div>
            </div>

            {/* Main content skeleton */}
            <div style={styles.mainContent}>
                {/* Hero section */}
                <div style={styles.heroSection}>
                    <Skeleton width="60%" height={40} borderRadius={8} />
                    <Skeleton width="40%" height={24} style={{ marginTop: 16 }} />
                </div>

                {/* Content blocks */}
                <div style={styles.contentBlocks}>
                    <Skeleton count={4} height={16} gap={12} />
                </div>
            </div>

            {/* Footer skeleton */}
            <div style={styles.footer}>
                <Skeleton width={200} height={16} />
            </div>
        </div>
    )

    const renderCardSkeleton = () => (
        <div style={styles.cardContainer}>
            {/* Card image */}
            <Skeleton width="100%" height={200} borderRadius="8px 8px 0 0" />
            
            {/* Card content */}
            <div style={styles.cardContent}>
                <Skeleton width="80%" height={24} borderRadius={4} />
                <Skeleton count={2} height={14} gap={8} style={{ marginTop: 12 }} />
                <div style={styles.cardActions}>
                    <Skeleton width={80} height={32} borderRadius={6} />
                    <Skeleton width={80} height={32} borderRadius={6} />
                </div>
            </div>
        </div>
    )

    const renderListSkeleton = () => (
        <div style={styles.listContainer}>
            {Array.from({ length: itemCount }).map((_, index) => (
                <div key={index} style={styles.listItem}>
                    <Skeleton width={48} height={48} borderRadius="full" />
                    <div style={styles.listItemContent}>
                        <Skeleton width="70%" height={18} />
                        <Skeleton width="50%" height={14} style={{ marginTop: 8 }} />
                    </div>
                </div>
            ))}
        </div>
    )

    const renderTextSkeleton = () => (
        <div style={styles.textContainer}>
            <Skeleton width="90%" height={20} />
            <Skeleton width="100%" height={16} style={{ marginTop: 12 }} />
            <Skeleton width="85%" height={16} style={{ marginTop: 8 }} />
            <Skeleton width="95%" height={16} style={{ marginTop: 8 }} />
            <Skeleton width="60%" height={16} style={{ marginTop: 8 }} />
        </div>
    )

    const renderContent = () => {
        switch (type) {
            case 'page':
                return renderPageSkeleton()
            case 'card':
                return renderCardSkeleton()
            case 'list':
                return renderListSkeleton()
            case 'text':
                return renderTextSkeleton()
            default:
                return renderPageSkeleton()
        }
    }

    return (
        <div style={styles.container} role="status" aria-label={message}>
            {showMessage && <span style={styles.srOnly}>{message}</span>}
            {renderContent()}
        </div>
    )
}

// Inline styles for the component
const styles: Record<string, React.CSSProperties> = {
    container: {
        width: '100%',
        minHeight: '100vh'
    },
    srOnly: {
        position: 'absolute',
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0
    },
    pageContainer: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        padding: '1rem'
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 0',
        marginBottom: '2rem'
    },
    navItems: {
        display: 'flex',
        gap: '1.5rem'
    },
    mainContent: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem 0'
    },
    heroSection: {
        textAlign: 'center',
        marginBottom: '3rem',
        width: '100%',
        maxWidth: '600px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    contentBlocks: {
        width: '100%',
        maxWidth: '500px'
    },
    footer: {
        display: 'flex',
        justifyContent: 'center',
        padding: '2rem 0'
    },
    cardContainer: {
        width: '100%',
        maxWidth: '320px',
        backgroundColor: '#fff',
        borderRadius: 8,
        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        overflow: 'hidden',
        margin: '0 auto'
    },
    cardContent: {
        padding: '1rem'
    },
    cardActions: {
        display: 'flex',
        gap: '0.75rem',
        marginTop: '1rem'
    },
    listContainer: {
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto',
        padding: '1rem'
    },
    listItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem 0',
        borderBottom: '1px solid #e5e7eb'
    },
    listItemContent: {
        flex: 1
    },
    textContainer: {
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '1rem'
    }
}
