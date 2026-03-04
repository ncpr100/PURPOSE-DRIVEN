/**
 * Centralized Bible Translation Configuration
 * Manages all Bible version definitions and translations
 * Updated: September 1, 2025
 */
export interface BibleVersion {
    id: string;
    name: string;
    abbreviation: string;
    language: 'es' | 'en';
    apiId?: string;
    copyrightInfo?: string;
    publishingHouse?: string;
    year?: number;
}
export declare const BIBLE_VERSIONS: BibleVersion[];
export declare function getBibleVersions(language?: 'es' | 'en'): BibleVersion[];
export declare function getBibleVersionById(id: string): BibleVersion | undefined;
export declare function getBibleVersionNames(): {
    [key: string]: string;
};
export declare function validateBibleVersionId(id: string): boolean;
export interface BibleAPIConfig {
    provider: 'bible-api' | 'scripture-api' | 'youversion' | 'esv-api';
    apiKey?: string;
    baseUrl: string;
    rateLimit: number;
    supportedVersions: string[];
}
export declare const BIBLE_API_PROVIDERS: {
    [key: string]: BibleAPIConfig;
};
export declare const CONTENT_STRATEGY: {
    highPriority: string[];
    sources: {
        PDT: string;
        VBL: string;
        AMP: string;
        NLT: string;
        GNT: string;
        MEV: string;
    };
    apiPriority: string[];
    manualContent: string[];
};
//# sourceMappingURL=bible-config.d.ts.map