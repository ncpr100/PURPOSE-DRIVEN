// 🎨 FORM BUILDER ICON UTILITIES
// Extracted from branded-form-builder.tsx to reduce bundle size

import React from 'react'
import { 
  Mail,
  Phone,
  MapPin,
  Share2,
  Sparkles,
  BarChart3,
  FileText,
  Heart,
  Calendar,
  Users,
  HandHeart
} from 'lucide-react'

// Helper function to render preset field icons as JSX components
export const getPresetFieldIcon = (iconName: string) => {
  const iconProps = { className: "h-4 w-4 mr-2" }
  
  switch (iconName) {
    case 'Mail':
      return <Mail {...iconProps} className="h-4 w-4 mr-2 text-[hsl(var(--info))]" />
    case 'Phone':
      return <Phone {...iconProps} className="h-4 w-4 mr-2 text-[hsl(var(--success))]" />
    case 'MapPin':
      return <MapPin {...iconProps} className="h-4 w-4 mr-2 text-[hsl(var(--destructive))]" />
    case 'Share2':
      return <Share2 {...iconProps} className="h-4 w-4 mr-2 text-[hsl(var(--info))]" />
    default:
      return <FileText {...iconProps} className="h-4 w-4 mr-2 text-muted-foreground" />
  }
}

// Helper function to render template icons as JSX components
export const getTemplateIcon = (iconName: string) => {
  const iconProps = { className: "h-8 w-8" }
  
  switch (iconName) {
    case 'Sparkles':
      return <Sparkles {...iconProps} className="h-8 w-8 text-[hsl(var(--lavender))]" />
    case 'BarChart3':
      return <BarChart3 {...iconProps} className="h-8 w-8 text-[hsl(var(--info))]" />
    case 'Share2':
      return <Share2 {...iconProps} className="h-8 w-8 text-[hsl(var(--success))]" />
    case 'Heart':
      return <Heart {...iconProps} className="h-8 w-8 text-[hsl(var(--destructive))]" />
    case 'Calendar':
      return <Calendar {...iconProps} className="h-8 w-8 text-[hsl(var(--warning))]" />
    case 'Users':
      return <Users {...iconProps} className="h-8 w-8 text-primary" />
    case 'HandHeart':
      return <HandHeart {...iconProps} className="h-8 w-8 text-[hsl(var(--destructive))]" />
    case 'FileText':
    default:
      return <FileText {...iconProps} className="h-8 w-8 text-muted-foreground" />
  }
}