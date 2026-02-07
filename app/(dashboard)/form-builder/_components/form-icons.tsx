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
      return <Mail {...iconProps} className="h-4 w-4 mr-2 text-cyan-600" />
    case 'Phone':
      return <Phone {...iconProps} className="h-4 w-4 mr-2 text-green-600" />
    case 'MapPin':
      return <MapPin {...iconProps} className="h-4 w-4 mr-2 text-red-600" />
    case 'Share2':
      return <Share2 {...iconProps} className="h-4 w-4 mr-2 text-blue-600" />
    default:
      return <FileText {...iconProps} className="h-4 w-4 mr-2 text-gray-600" />
  }
}

// Helper function to render template icons as JSX components
export const getTemplateIcon = (iconName: string) => {
  const iconProps = { className: "h-8 w-8" }
  
  switch (iconName) {
    case 'Sparkles':
      return <Sparkles {...iconProps} className="h-8 w-8 text-purple-600" />
    case 'BarChart3':
      return <BarChart3 {...iconProps} className="h-8 w-8 text-blue-600" />
    case 'Share2':
      return <Share2 {...iconProps} className="h-8 w-8 text-green-600" />
    case 'Heart':
      return <Heart {...iconProps} className="h-8 w-8 text-pink-600" />
    case 'Calendar':
      return <Calendar {...iconProps} className="h-8 w-8 text-orange-600" />
    case 'Users':
      return <Users {...iconProps} className="h-8 w-8 text-indigo-600" />
    case 'HandHeart':
      return <HandHeart {...iconProps} className="h-8 w-8 text-rose-600" />
    case 'FileText':
    default:
      return <FileText {...iconProps} className="h-8 w-8 text-gray-600" />
  }
}