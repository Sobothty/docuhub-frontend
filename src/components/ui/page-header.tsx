import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  description?: string
  children?: ReactNode
  className?: string
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <div className={cn("space-y-4 pb-6 border-b border-border", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{title}</h1>
          {description && <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">{description}</p>}
        </div>
        {children && <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">{children}</div>}
      </div>
    </div>
  )
}
