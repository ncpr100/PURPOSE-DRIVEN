/**
 * Member Filter Type Definitions
 * Centralized type safety for all member filtering operations
 */

// Marital Status Filter Options
export type MaritalStatusFilter = 
  | 'all'           // Show all members
  | 'soltero'       // Single members
  | 'casado'        // Married members
  | 'divorciado'    // Divorced members
  | 'viudo'         // Widowed members
  | 'family-group'  // Family groupings (derived filter)

// Gender Filter Options
export type GenderFilter = 
  | 'all'       // All genders
  | 'masculino' // Male
  | 'femenino'  // Female

// Age Range Filter Options
export type AgeFilter = 
  | 'all'     // All ages
  | '0-17'    // Children/Youth
  | '18-25'   // Young adults
  | '26-35'   // Adults
  | '36-50'   // Middle-aged
  | '51+'     // Seniors

// Smart List Filter Options
export type SmartListFilter = 
  | 'all'                  // All members
  | 'new-members'          // Recently joined
  | 'inactive-members'     // Inactive members
  | 'birthdays'            // Upcoming birthdays
  | 'volunteer-candidates' // Potential volunteers
  | 'leadership-ready'     // Leadership pipeline

// Complete Filter State
export interface MemberFilters {
  search: string
  gender: GenderFilter
  age: AgeFilter
  maritalStatus: MaritalStatusFilter
  smartList: SmartListFilter
}

// Member Badge Display Props
export interface MemberBadgeData {
  gender?: string
  maritalStatus?: string
  ministryId?: string
}
