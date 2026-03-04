"use strict";
/**
 * Shared gender inference utility for consistent gender logic across the app
 * Used by: UI components, API endpoints, analytics, and filtering systems
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.categorizeGender = exports.matchesGenderFilter = exports.getEffectiveGender = exports.inferGenderFromName = void 0;
/**
 * Infers gender from Spanish first names
 * Returns empty string if gender cannot be inferred
 */
const inferGenderFromName = (firstName) => {
    if (!firstName)
        return '';
    const name = firstName.toLowerCase().trim();
    // Common Spanish male names
    const maleNames = [
        'juan', 'carlos', 'josé', 'antonio', 'francisco', 'manuel', 'david', 'daniel',
        'miguel', 'rafael', 'pedro', 'alejandro', 'fernando', 'sergio', 'pablo', 'jorge',
        'luis', 'alberto', 'ricardo', 'roberto', 'eduardo', 'andrés', 'javier', 'diego',
        'gabriel', 'adrián', 'óscar', 'gonzalo', 'mario', 'santiago', 'césar', 'ramón'
    ];
    // Common Spanish female names  
    const femaleNames = [
        'maría', 'ana', 'carmen', 'laura', 'elena', 'cristina', 'patricia', 'sandra',
        'monica', 'nuria', 'silvia', 'rosa', 'beatriz', 'teresa', 'pilar', 'mercedes',
        'angeles', 'isabel', 'julia', 'raquel', 'andrea', 'natalia', 'gloria', 'esperanza',
        'dolores', 'antonia', 'francisca', 'catalina', 'inmaculada', 'magdalena', 'josefa'
    ];
    // Check for exact matches
    if (maleNames.includes(name))
        return 'masculino';
    if (femaleNames.includes(name))
        return 'femenino';
    // Check for common endings
    if (name.endsWith('a') && !name.endsWith('ía')) {
        // Most Spanish female names end in 'a'
        return 'femenino';
    }
    else if (name.endsWith('o') || name.endsWith('r') || name.endsWith('n')) {
        // Most Spanish male names end in 'o', 'r', or 'n'
        return 'masculino';
    }
    return '';
};
exports.inferGenderFromName = inferGenderFromName;
/**
 * Gets the effective gender (actual or inferred) for a member
 * Returns the actual gender if present, otherwise attempts inference
 */
const getEffectiveGender = (member) => {
    if (member.gender) {
        return member.gender.toLowerCase();
    }
    return (0, exports.inferGenderFromName)(member.firstName);
};
exports.getEffectiveGender = getEffectiveGender;
/**
 * Checks if a member matches the given gender filter
 * Handles both actual database values and inferred values
 */
const matchesGenderFilter = (member, genderFilter) => {
    if (genderFilter === 'all')
        return true;
    const effectiveGender = (0, exports.getEffectiveGender)(member);
    const lowerFilter = genderFilter.toLowerCase();
    // Match masculino variants
    if (lowerFilter === 'masculino') {
        return effectiveGender === 'masculino' || effectiveGender === 'male' || effectiveGender === 'm';
    }
    // Match femenino variants
    if (lowerFilter === 'femenino') {
        return effectiveGender === 'femenino' || effectiveGender === 'female' || effectiveGender === 'f';
    }
    // Exact match for other cases
    return effectiveGender === lowerFilter;
};
exports.matchesGenderFilter = matchesGenderFilter;
/**
 * Categorizes gender for counting purposes
 * Returns 'masculino', 'femenino', or 'sinEspecificar'
 */
const categorizeGender = (member) => {
    const effectiveGender = (0, exports.getEffectiveGender)(member);
    if (effectiveGender === 'masculino' || effectiveGender === 'male' || effectiveGender === 'm') {
        return 'masculino';
    }
    if (effectiveGender === 'femenino' || effectiveGender === 'female' || effectiveGender === 'f') {
        return 'femenino';
    }
    return 'sinEspecificar';
};
exports.categorizeGender = categorizeGender;
//# sourceMappingURL=gender-utils.js.map