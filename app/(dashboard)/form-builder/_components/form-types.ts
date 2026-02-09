// 🎯 FORM BUILDER TYPE DEFINITIONS
// Extracted from branded-form-builder.tsx to reduce bundle size

export interface FormField {
  id: number | string
  label: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date'
  required: boolean
  placeholder?: string
  options?: string[]
}

export interface FormConfig {
  title: string
  description?: string
  fields: FormField[]
  
  // Submit Button Customization
  submitButtonText?: string
  submitButtonColor?: string
  submitButtonTextColor?: string
  
  // Church Branding & Personalization
  backgroundImage?: string       // Form background image
  churchLogo?: string            // Church logo on form
  primaryColor?: string          // Primary brand color
  secondaryColor?: string        // Secondary brand color
  headerTextColor?: string       // Form title color
  bodyTextColor?: string         // Form description/field text color
  fontFamily?: string            // Typography selection
  formBackgroundColor?: string   // Form container background
  borderColor?: string           // Form border color
  inputBorderColor?: string      // Input field border color
  inputFocusColor?: string       // Input focus state color
}

export interface QRConfig {
  // Basic settings
  size: number
  margin: number
  backgroundColor: string
  foregroundColor: string
  
  // Advanced styling
  dotType: 'square' | 'rounded' | 'dots' | 'classy'
  cornerType: 'square' | 'rounded' | 'circle'
  
  // Gradient options
  useGradient: boolean
  gradientType: 'linear' | 'radial'
  gradientColors: string[]
  gradientAngle: number
  
  // Background options
  useBackgroundImage: boolean
  backgroundImage?: string
  backgroundOpacity: number
  
  // ENHANCED: Logo/overlay with enterprise features
  logoImage?: string
  logoSize: number
  logoOpacity: number
  logoMargin: number
  logoShape: 'circle' | 'square' | 'rounded'
  logoBackgroundColor: string
  logoBackgroundOpacity: number
  
  // Eye (corner squares) customization
  eyeColor: string
  eyeBorderColor: string
  eyeShape: 'square' | 'rounded' | 'circle'
}

export interface PresetField {
  id: string
  label: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date'
  icon: string
  category: string
  options?: string[]
}

export interface SmartTemplate {
  id: string
  name: string
  description: string
  icon: string
  category: string
  fields: Partial<FormField>[]
}