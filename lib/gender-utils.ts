/**
 * Shared gender inference utility for consistent gender logic across the app
 * Used by: UI components, API endpoints, analytics, and filtering systems
 */

export interface Member {
  firstName?: string | null;
  gender?: string | null;
}

/**
 * Infers gender from Spanish first names
 * Returns empty string if gender cannot be inferred
 */
export const inferGenderFromName = (firstName: string | null | undefined): string => {
  if (!firstName) return ''
  
  const name = firstName.toLowerCase().trim()
  
  // Common Spanish male names
  const maleNames = [
    'juan', 'carlos', 'josé', 'antonio', 'francisco', 'manuel', 'david', 'daniel', 
    'miguel', 'rafael', 'pedro', 'alejandro', 'fernando', 'sergio', 'pablo', 'jorge',
    'luis', 'alberto', 'ricardo', 'roberto', 'eduardo', 'andrés', 'javier', 'diego',
    'gabriel', 'adrián', 'óscar', 'gonzalo', 'mario', 'santiago', 'césar', 'ramón'
  ]
  
  // Common Spanish female names  
  const femaleNames = [
    'maría', 'ana', 'carmen', 'laura', 'elena', 'cristina', 'patricia', 'sandra',
    'monica', 'nuria', 'silvia', 'rosa', 'beatriz', 'teresa', 'pilar', 'mercedes',
    'angeles', 'isabel', 'julia', 'raquel', 'andrea', 'natalia', 'gloria', 'esperanza',
    'dolores', 'antonia', 'francisca', 'catalina', 'inmaculada', 'magdalena', 'josefa'
  ]
  
  // Check for exact matches
  if (maleNames.includes(name)) return 'masculino'
  if (femaleNames.includes(name)) return 'femenino'
  
  // Check for common endings
  if (name.endsWith('a') && !name.endsWith('ía')) {
    // Most Spanish female names end in 'a'
    return 'femenino'
  } else if (name.endsWith('o') || name.endsWith('r') || name.endsWith('n')) {
    // Most Spanish male names end in 'o', 'r', or 'n'
    return 'masculino'
  }
  
  return ''
}

/**
 * Gets the effective gender (actual or inferred) for a member
 * Returns the actual gender if present, otherwise attempts inference
 */
export const getEffectiveGender = (member: Member): string => {
  if (member.gender) {
    return member.gender.toLowerCase()
  }
  return inferGenderFromName(member.firstName)
}

/**
 * Checks if a member matches the given gender filter
 * Handles both actual database values and inferred values
 */
export const matchesGenderFilter = (member: Member, genderFilter: string): boolean => {
  if (genderFilter === 'all') return true
  
  const effectiveGender = getEffectiveGender(member)
  const lowerFilter = genderFilter.toLowerCase()
  
  // Match masculino variants
  if (lowerFilter === 'masculino') {
    return effectiveGender === 'masculino' || effectiveGender === 'male' || effectiveGender === 'm'
  }
  
  // Match femenino variants
  if (lowerFilter === 'femenino') {
    return effectiveGender === 'femenino' || effectiveGender === 'female' || effectiveGender === 'f'
  }
  
  // Exact match for other cases
  return effectiveGender === lowerFilter
}

/**
 * Categorizes gender for counting purposes
 * Returns 'masculino', 'femenino', or 'sinEspecificar'
 */
export const categorizeGender = (member: Member): 'masculino' | 'femenino' | 'sinEspecificar' => {
  const effectiveGender = getEffectiveGender(member)
  
  if (effectiveGender === 'masculino' || effectiveGender === 'male' || effectiveGender === 'm') {
    return 'masculino'
  }
  
  if (effectiveGender === 'femenino' || effectiveGender === 'female' || effectiveGender === 'f') {
    return 'femenino'
  }
  
  return 'sinEspecificar'
}