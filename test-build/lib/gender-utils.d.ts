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
export declare const inferGenderFromName: (firstName: string | null | undefined) => string;
/**
 * Gets the effective gender (actual or inferred) for a member
 * Returns the actual gender if present, otherwise attempts inference
 */
export declare const getEffectiveGender: (member: Member) => string;
/**
 * Checks if a member matches the given gender filter
 * Handles both actual database values and inferred values
 */
export declare const matchesGenderFilter: (member: Member, genderFilter: string) => boolean;
/**
 * Categorizes gender for counting purposes
 * Returns 'masculino', 'femenino', or 'sinEspecificar'
 */
export declare const categorizeGender: (member: Member) => 'masculino' | 'femenino' | 'sinEspecificar';
//# sourceMappingURL=gender-utils.d.ts.map