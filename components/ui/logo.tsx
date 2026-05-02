
'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/use-theme'

interface LogoProps {
  variant?: 'default' | 'compact' | 'text-only'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showText?: boolean
  /**
   * Optional explicit override.
   * If omitted, the logo auto-detects the active Cosmos theme:
   *   dark  → /logo.png      (light-colored logo for dark backgrounds)
   *   light  → /logo-light.png (dark-colored logo for Sunshine backgrounds)
   */
  theme?: 'dark' | 'light'
}

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8', 
  lg: 'h-12 w-12',
  xl: 'h-16 w-16'
}

const textSizeClasses = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-2xl', 
  xl: 'text-3xl'
}

export function Logo({ 
  variant = 'default', 
  size = 'md', 
  className, 
  showText = true,
  theme: themeProp
}: LogoProps) {
  // Auto-detect the active theme; explicit prop overrides auto-detection.
  // useTheme defaults to 'dark' on SSR (resolvedTheme undefined) — prevents flash.
  const { isDark } = useTheme()
  const useDark = themeProp !== undefined ? themeProp === 'dark' : isDark
  const logoSrc = useDark ? '/logo.png' : '/logo-light.png'
  if (variant === 'text-only') {
    return (
      <div className={cn('flex items-center', className)}>
        <h1 className={cn('font-bold text-foreground', textSizeClasses[size])}>
          Kḥesed-tek
        </h1>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className={cn('relative', sizeClasses[size])}>
          <Image
            src={logoSrc}
            alt="Kḥesed-tek Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        {showText && (
          <span className={cn('font-bold text-foreground', textSizeClasses[size])}>
            K
          </span>
        )}
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className={cn('relative', sizeClasses[size])}>
        <Image
          src={logoSrc}
          alt="Kḥesed-tek Church Management Systems"
          fill
          className="object-contain"
          priority
        />
      </div>
      {showText && (
        <div>
          <h1 className={cn('font-bold text-foreground', textSizeClasses[size])}>
            Kḥesed-tek
          </h1>
          {size !== 'sm' && (
            <p className="text-xs text-muted-foreground">
              Church Management Systems
            </p>
          )}
        </div>
      )}
    </div>
  )
}
