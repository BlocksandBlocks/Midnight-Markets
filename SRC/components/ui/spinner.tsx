import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const spinnerVariants = cva(
  'animate-spin rounded-full border-solid border-t-transparent',
  {
    variants: {
      size: {
        sm: 'h-4 w-4 border-2',
        md: 'h-6 w-6 border-2',
        lg: 'h-8 w-8 border-3',
        xl: 'h-12 w-12 border-4',
      },
      variant: {
        default: 'border-midnight-blue border-t-transparent',
        primary: 'border-primary border-t-transparent',
        secondary: 'border-secondary border-t-transparent',
        white: 'border-white border-t-transparent',
        muted: 'border-muted-foreground border-t-transparent',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
)

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string
}

export function Spinner({ size, variant, className }: SpinnerProps) {
  return (
    <div
      className={cn(spinnerVariants({ size, variant }), className)}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

// Loading component with text
interface LoadingProps {
  text?: string
  size?: VariantProps<typeof spinnerVariants>['size']
  variant?: VariantProps<typeof spinnerVariants>['variant']
  className?: string
}

export function Loading({ 
  text = 'Loading...', 
  size = 'md', 
  variant = 'default',
  className 
}: LoadingProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Spinner size={size} variant={variant} />
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  )
}

// Full page loading overlay
interface LoadingOverlayProps {
  isVisible: boolean
  text?: string
  onCancel?: () => void
}

export function LoadingOverlay({ 
  isVisible, 
  text = 'Loading...', 
  onCancel 
}: LoadingOverlayProps) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-lg bg-card p-6 shadow-lg">
        <Spinner size="lg" />
        <p className="text-sm text-muted-foreground">{text}</p>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-xs text-muted-foreground hover:text-foreground underline"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}

// Skeleton loader for placeholder content
interface SkeletonProps {
  className?: string
  lines?: number
}

export function Skeleton({ className, lines = 1 }: SkeletonProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-muted rounded animate-pulse"
          style={{
            width: `${Math.random() * 40 + 60}%`,
          }}
        />
      ))}
    </div>
  )
}

export { spinnerVariants }