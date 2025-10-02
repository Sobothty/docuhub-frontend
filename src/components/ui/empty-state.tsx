"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <Card className={cn("", className)}>
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        {icon && <div className="text-muted-foreground mb-4">{icon}</div>}
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        {description && <p className="text-muted-foreground mb-4 max-w-sm">{description}</p>}
        {action && (
          <Button onClick={action.onClick} className="mt-2">
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
