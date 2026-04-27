import * as React from 'react'
import { cn } from './utils'
import { Loader2 } from 'lucide-react'

// Spinner Component
interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
    }

    return <Loader2 className={cn('animate-spin text-muted-foreground', sizeClasses[size], className)} />
}

// Loading Button Content
interface LoadingButtonContentProps {
    loading?: boolean
    children: React.ReactNode
    loadingText?: string
}

export function LoadingButtonContent({ loading, children, loadingText }: LoadingButtonContentProps) {
    if (loading) {
        return (
            <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {loadingText || 'Loading...'}
            </>
        )
    }
    return <>{children}</>
}

// Skeleton Component
interface SkeletonProps {
    className?: string
}

export function Skeleton({ className }: SkeletonProps) {
    return <div className={cn('animate-pulse rounded-md bg-muted', className)} />
}

// Skeleton Text
interface SkeletonTextProps {
    lines?: number
    className?: string
}

export function SkeletonText({ lines = 1, className }: SkeletonTextProps) {
    return (
        <div className={cn('space-y-2', className)}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton key={i} className={cn('h-4', i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full')} />
            ))}
        </div>
    )
}

// Skeleton Card
export function SkeletonCard() {
    return (
        <div className="rounded-lg border bg-card p-6 space-y-4">
            <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </div>
            <SkeletonText lines={3} />
        </div>
    )
}

// Skeleton Table Row
interface SkeletonTableRowProps {
    columns?: number
}

export function SkeletonTableRow({ columns = 5 }: SkeletonTableRowProps) {
    return (
        <tr className="border-b">
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i} className="p-4">
                    <Skeleton className="h-4 w-full" />
                </td>
            ))}
        </tr>
    )
}

// Skeleton Table
interface SkeletonTableProps {
    rows?: number
    columns?: number
}

export function SkeletonTable({ rows = 5, columns = 5 }: SkeletonTableProps) {
    return (
        <div className="rounded-md border">
            <table className="w-full">
                <thead>
                    <tr className="border-b bg-muted/50">
                        {Array.from({ length: columns }).map((_, i) => (
                            <th key={i} className="p-4 text-left">
                                <Skeleton className="h-4 w-20" />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rows }).map((_, i) => (
                        <SkeletonTableRow key={i} columns={columns} />
                    ))}
                </tbody>
            </table>
        </div>
    )
}

// Full Page Loading
interface PageLoadingProps {
    message?: string
}

export function PageLoading({ message = 'Loading...' }: PageLoadingProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <Spinner size="lg" />
            <p className="text-sm text-muted-foreground">{message}</p>
        </div>
    )
}

// Loading Overlay
interface LoadingOverlayProps {
    visible: boolean
    message?: string
    fullScreen?: boolean
    className?: string
    duration?: number
}

export function LoadingOverlay({
    visible,
    message,
    fullScreen = false,
    className,
    duration = 150,
}: LoadingOverlayProps) {
    const [mounted, setMounted] = React.useState(visible)

    // Keep the element mounted through the fade-out, then unmount
    React.useEffect(() => {
        if (visible) {
            setMounted(true)
            return
        }
        const t = setTimeout(() => setMounted(false), duration)
        return () => clearTimeout(t)
    }, [visible, duration])

    if (!mounted) return null

    return (
        <div
            role="status"
            aria-live="polite"
            aria-busy={visible}
            style={{ transitionDuration: `${duration}ms` }}
            className={cn(
                'inset-0 z-50 flex items-center justify-center bg-primary/35 backdrop-blur-sm',
                'transition-opacity ease-in-out',
                visible ? 'opacity-100' : 'opacity-0',
                fullScreen ? 'fixed' : 'absolute',
                className
            )}
        >
            <div className="flex flex-col items-center gap-3">
                <Spinner size="lg" className="w-10 h-10 text-primary" />
                {message && <p className="text-sm text-muted-foreground">{message}</p>}
            </div>
        </div>
    )
}

// Inline Loading
interface InlineLoadingProps {
    className?: string
}

export function InlineLoading({ className }: InlineLoadingProps) {
    return (
        <div className={cn('flex items-center gap-2 text-muted-foreground', className)}>
            <Spinner size="sm" />
            <span className="text-sm">Loading...</span>
        </div>
    )
}
