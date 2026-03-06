/**
 * Enhanced Bible Verse Content
 * Comprehensive verse translations for all configured versions
 * Updated: September 1, 2025
 */
export declare const ENHANCED_BIBLE_DATA: {
    [key: string]: {
        [version: string]: string;
    };
};
export declare function normalizeReference(reference: string): string;
export declare function findBestMatch(input: string): string | null;
export declare function getAvailableVerses(): string[];
export declare function getVerseTranslations(reference: string): {
    [version: string]: string;
} | null;
//# sourceMappingURL=bible-data.d.ts.map