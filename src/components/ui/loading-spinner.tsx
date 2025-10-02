import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  return <div className={cn("animate-spin rounded-full border-b-2 border-primary", sizeClasses[size], className)} />
}

export function LoadingCard({ title, description }: { title?: string; description?: string }) {
  return (
    <div className="flex items-center justify-center p-8 bg-card rounded-lg border">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        {title && <h3 className="text-lg font-semibold text-foreground">{title}</h3>}
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
    </div>
  )
}

export function LoadingPage({ title = "Loading..." }: { title?: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground">{title}</p>
      </div>
    </div>
  )
}
