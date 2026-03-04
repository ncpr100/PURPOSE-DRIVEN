/**
 * SPIRITUAL GIFTS CONFIGURATION
 * Complete mapping of spiritual gifts, categories, and ministry alignments
 * Based on provided assessment form and strategic analysis
 *
 * @created October 18, 2024
 * @version 1.0.0
 */
export interface SpiritualGiftSubcategory {
    id: string;
    name: string;
    description: string;
    relatedMinistries: string[];
    leadershipPotential: 'high' | 'medium' | 'low';
    skillKeywords: string[];
}
export interface SpiritualGiftCategory {
    id: string;
    name: string;
    icon: string;
    color: string;
    description: string;
    subcategories: SpiritualGiftSubcategory[];
}
export interface MinistryPassion {
    id: string;
    name: string;
    category?: string;
    description?: string;
}
export interface ExperienceLevelDefinition {
    id: string;
    value: 'NOVATO' | 'INTERMEDIO' | 'AVANZADO';
    name: string;
    label: string;
    range: string;
    yearsOfService: string;
    description: string;
}
export interface GiftSelection {
    subcategoryId: string;
    type: 'primary' | 'secondary';
}
export interface SpiritualAssessmentData {
    giftSelections: GiftSelection[];
    ministryPassions: string[];
    experienceLevel: string;
    spiritualCalling?: string;
    motivation?: string;
    completedAt?: string;
}
export declare const SPIRITUAL_GIFT_CATEGORIES: SpiritualGiftCategory[];
export declare const MINISTRY_PASSIONS: MinistryPassion[];
export declare const EXPERIENCE_LEVELS: ExperienceLevelDefinition[];
/**
 * Get all subcategories across all categories
 */
export declare function getAllSubcategories(): SpiritualGiftSubcategory[];
/**
 * Find a subcategory by ID
 */
export declare function findSubcategory(subcategoryId: string): SpiritualGiftSubcategory | undefined;
/**
 * Find a category by ID
 */
export declare function findCategory(categoryId: string): SpiritualGiftCategory | undefined;
/**
 * Get subcategories by leadership potential
 */
export declare function getSubcategoriesByLeadership(level: 'high' | 'medium' | 'low'): SpiritualGiftSubcategory[];
/**
 * Get high leadership potential gifts
 */
export declare function getLeadershipGifts(): SpiritualGiftSubcategory[];
/**
 * Check if a gift has high leadership potential
 */
export declare function isLeadershipGift(subcategoryId: string): boolean;
/**
 * Get all ministry IDs that align with a gift
 */
export declare function getRelatedMinistries(subcategoryId: string): string[];
/**
 * Get category color classes for a subcategory
 */
export declare function getCategoryColor(subcategoryId: string): string;
/**
 * Get category icon for a subcategory
 */
export declare function getCategoryIcon(subcategoryId: string): string;
/**
 * Count total subcategories
 */
export declare function getTotalSubcategories(): number;
/**
 * Get experience level by value
 */
export declare function getExperienceLevel(value: string): ExperienceLevelDefinition | undefined;
/**
 * Check if experience level meets minimum requirement
 */
export declare function meetsExperienceRequirement(currentLevel: 'NOVATO' | 'INTERMEDIO' | 'AVANZADO', requiredLevel: 'NOVATO' | 'INTERMEDIO' | 'AVANZADO'): boolean;
export declare const SPIRITUAL_GIFTS_SUMMARY: {
    totalCategories: number;
    totalSubcategories: number;
    totalMinistryPassions: number;
    totalExperienceLevels: number;
    highLeadershipGifts: number;
    categories: {
        id: string;
        name: string;
        subcategoryCount: number;
    }[];
};
//# sourceMappingURL=spiritual-gifts-config.d.ts.map