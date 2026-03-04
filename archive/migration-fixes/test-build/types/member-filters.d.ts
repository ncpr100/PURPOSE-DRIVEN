/**
 * Member Filter Type Definitions
 * Centralized type safety for all member filtering operations
 */
export type MaritalStatusFilter = 'all' | 'soltero' | 'casado' | 'divorciado' | 'viudo' | 'family-group';
export type GenderFilter = 'all' | 'masculino' | 'femenino';
export type AgeFilter = 'all' | '0-17' | '18-25' | '26-35' | '36-50' | '51+';
export type SmartListFilter = 'all' | 'new-members' | 'inactive-members' | 'birthdays' | 'volunteer-candidates' | 'leadership-ready';
export interface MemberFilters {
    search: string;
    gender: GenderFilter;
    age: AgeFilter;
    maritalStatus: MaritalStatusFilter;
    smartList: SmartListFilter;
}
export interface MemberBadgeData {
    gender?: string;
    maritalStatus?: string;
    ministryId?: string;
}
//# sourceMappingURL=member-filters.d.ts.map