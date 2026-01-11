import type { CSSProperties, ReactNode } from 'react'

interface SkeletonProps {
    /** Width of the skeleton (can be number for px or string for any CSS unit) */
    width?: number | string
    /** Height of the skeleton (can be number for px or string for any CSS unit) */
    height?: number | string
    /** Border radius (can be number for px, string, or 'full' for circle/pill) */
    borderRadius?: number | string | 'full'
    /** Custom className for additional styling */
    className?: string
    /** Animation variant */
    variant?: 'pulse' | 'wave' | 'none'
    /** Number of skeleton items to render */
    count?: number
    /** Gap between skeleton items when count > 1 */
    gap?: number | string
    /** Custom inline styles */
    style?: CSSProperties
    /** Children to render inside skeleton */
    children?: ReactNode
}

/**
 * Skeleton component for loading states
 * 
 * A versatile skeleton loader that provides visual feedback during content loading.
 * Supports multiple animation variants and can be customized for different use cases.
 * 
 * @example
 * // Basic usage - text line
 * <Skeleton width="100%" height={20} />
 * 
 * @example
 * // Avatar placeholder
 * <Skeleton width={48} height={48} borderRadius="full" />
 * 
 * @example
 * // Multiple lines
 * <Skeleton count={3} height={16} gap={8} />
 * 
 * @example
 * // Card skeleton
 * <Skeleton width={300} height={200} borderRadius={12} />
 */
export default function Skeleton({
    width = '100%',
    height = 20,
    borderRadius = 4,
    className = '',
    variant = 'pulse',
    count = 1,
    gap = 8,
    style,
    children
}: SkeletonProps) {
    const resolvedWidth = typeof width === 'number' ? `${width}px` : width
    const resolvedHeight = typeof height === 'number' ? `${height}px` : height
    const resolvedBorderRadius = borderRadius === 'full' 
        ? '9999px' 
        : typeof borderRadius === 'number' 
            ? `${borderRadius}px` 
            : borderRadius
    const resolvedGap = typeof gap === 'number' ? `${gap}px` : gap

    const baseStyles: CSSProperties = {
        width: resolvedWidth,
        height: resolvedHeight,
        borderRadius: resolvedBorderRadius,
        backgroundColor: '#e5e7eb',
        // Reset background-related properties to prevent style leakage between variants
        background: undefined,
        backgroundSize: undefined,
        ...style
    }

    const animationStyles: CSSProperties = variant === 'pulse' 
        ? { 
            animation: 'skeleton-pulse 2s ease-in-out infinite',
            // Ensure clean background for pulse
            background: '#e5e7eb'
        }
        : variant === 'wave'
            ? { 
                background: 'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
                backgroundSize: '200% 100%',
                animation: 'skeleton-wave 1.5s ease-in-out infinite'
            }
            : { 
                animation: 'none',
                background: '#e5e7eb'
            }

    if (count > 1) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: resolvedGap }}>
                {Array.from({ length: count }).map((_, index) => (
                    <div
                        key={index}
                        className={className}
                        style={{ ...baseStyles, ...animationStyles }}
                        role="presentation"
                        aria-hidden="true"
                    >
                        {children}
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div
            className={className}
            style={{ ...baseStyles, ...animationStyles }}
            role="presentation"
            aria-hidden="true"
        >
            {children}
        </div>
    )
}

// Add keyframes to document head (only once)
if (typeof document !== 'undefined') {
    const styleId = 'skeleton-animations'
    if (!document.getElementById(styleId)) {
        const styleSheet = document.createElement('style')
        styleSheet.id = styleId
        styleSheet.textContent = `
            @keyframes skeleton-pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
            @keyframes skeleton-wave {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
        `
        document.head.appendChild(styleSheet)
    }
}
