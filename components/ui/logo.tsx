
'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

/**
 * CSS-ONLY THEME SWITCHING — Zero JavaScript dependency.
 *
 * Both logo variants are always rendered in the DOM.
 * globals.css controls which is visible via:
 *   .logo-cosmos-dark  { display: block }   ← shown on dark theme (default)
 *   .logo-cosmos-light { display: none  }   ← hidden on dark theme
 *   [data-theme="light"] .logo-cosmos-dark  { display: none  }
 *   [data-theme="light"] .logo-cosmos-light { display: block }
 *
 * Because data-theme is set server-side (layout.tsx) AND by the inline head script
 * before any CSS loads, the correct logo is ALWAYS visible with zero flash —
 * no React state, no useTheme(), no hydration mismatch.
 *
 * The `theme` prop is kept for API compatibility but is now a no-op;
 * CSS handles switching automatically.
 */

interface LogoProps {
  variant?: 'default' | 'compact' | 'text-only'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showText?: boolean
  /** @deprecated CSS auto-switches based on data-theme. Kept for API compatibility. */
  theme?: 'dark' | 'light'
}

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
}

const textSizeClasses = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-3xl',
}

/** Renders both logo images; CSS selects which is shown based on [data-theme] on <html>. */
function DualLogo({ size, alt }: { size: keyof typeof sizeClasses; alt: string }) {
  return (
    <div className={cn('relative', sizeClasses[size])}>
      {/* Dark Cosmos theme — light-colored logo on navy background */}
      <Image
        src="/logo.png"
        alt={alt}
        fill
        className="object-contain logo-cosmos-dark"
        priority
      />
      {/* Sunshine theme — dark-colored logo on light #F0F2F5 background */}
      <Image
        src="/logo-light.png"
        alt={alt}
        fill
        className="object-contain logo-cosmos-light"
        priority
      />
    </div>
  )
}

export function Logo({
  variant = 'default',
  size = 'md',
  className,
  showText = true,
}: LogoProps) {
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
        <DualLogo size={size} alt="Kḥesed-tek Logo" />
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
      <DualLogo size={size} alt="Kḥesed-tek Church Management Systems" />
      {showText && (
        <div>
          <h1 className={cn('font-bold text-foreground', textSizeClasses[size])}>
            Kḥesed-tek
          </h1>
          {size !== 'sm' && (
            <p className="text-xs text-muted-foreground">Church Management Systems</p>
          )}
        </div>
      )}
    </div>
  )
}
