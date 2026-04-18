
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface PlatformStatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: number
  className?: string
}

export function PlatformStatsCard({
  title,
  value,
  subtitle,
  icon,
  trend = 'neutral',
  trendValue,
  className
}: PlatformStatsCardProps) {
  return (
    <Card className={cn('', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {icon && (
            <div className="text-muted-foreground/70">
              {icon}
            </div>
          )}
        </div>
        
        {trend !== 'neutral' && trendValue && (
          <div className={cn(
            'flex items-center gap-1 mt-3 text-sm',
            trend === 'up' ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--destructive))]'
          )}>
            {trend === 'up' ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>{trendValue}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
