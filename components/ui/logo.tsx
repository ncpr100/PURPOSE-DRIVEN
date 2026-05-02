
'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  variant?: 'default' | 'compact' | 'text-only'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showText?: boolean
  /** 'dark' (default) = white logo for dark backgrounds; 'light' = black logo for light backgrounds */
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
  theme = 'dark'
}: LogoProps) {
  const logoSrc = theme === 'light' ? '/logo-light.png' : '/logo.png'
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
