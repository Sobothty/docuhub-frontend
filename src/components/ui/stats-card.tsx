import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: ReactNode
  trend?: {
    value: number
    label: string
    isPositive?: boolean
  }
  className?: string
}

export function StatsCard({ title, value, description, icon, trend, className }: StatsCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        {trend && (
          <div className="flex items-center mt-2">
            <span
              className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
              )}
            >
              {trend.isPositive ? "+" : ""}
              {trend.value}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
