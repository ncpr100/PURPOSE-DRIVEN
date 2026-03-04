/**
 * Premium Bible API Integration
 * Provides access to authenticated Bible APIs for paid subscribers
 */
export interface PremiumBibleVerse {
    book: string;
    chapter: number;
    verse: number;
    text: string;
    version: string;
    versionName: string;
    source: 'api-bible' | 'biblia-api' | 'esv-api' | 'local-fallback';
    authenticated: boolean;
}
export interface BibleComparisonResult {
    reference: string;
    versions: PremiumBibleVerse[];
    success: boolean;
    message?: string;
}
export declare class PremiumBibleAPI {
    /**
     * Search for Bible verse with premium authentication
     */
    static searchVerse(reference: string, version: string, churchId: string): Promise<PremiumBibleVerse | null>;
    /**
     * Compare multiple Bible versions
     */
    static compareVersions(reference: string, versions: string[], churchId: string): Promise<BibleComparisonResult>;
    /**
     * Fetch Spanish Bible verse from premium APIs
     */
    private static fetchSpanishVerse;
    /**
     * Fetch English Bible verse from premium APIs
     */
    private static fetchEnglishVerse;
    /**
     * Helper methods
     */
    private static isSpanishVersion;
    private static translateBookName;
    private static getVersionName;
    private static getApiBibleId;
    private static getBibleApiVersion;
    private static formatReferenceForApiBible;
}
export default PremiumBibleAPI;
//# sourceMappingURL=premium-bible-api.d.ts.map