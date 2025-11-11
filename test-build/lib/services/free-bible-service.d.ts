interface BibleVerse {
    book: string;
    chapter: number;
    verse: number;
    text: string;
    version: string;
    reference: string;
}
interface BibleBook {
    id: string;
    name: string;
    chapters: number;
}
interface SearchResult {
    reference: string;
    text: string;
    version: string;
}
declare class FreeBibleService {
    private readonly APIs;
    private readonly VERSIONS;
    getVerse(reference: string, version?: string): Promise<BibleVerse | null>;
    private getVerseFromGetBible;
    searchVerses(query: string, version?: string, limit?: number): Promise<SearchResult[]>;
    private fallbackSearch;
    compareVerses(reference: string, versions: string[]): Promise<BibleVerse[]>;
    private getVerseWithFallback;
    private getVerseFromBibleGateway;
    getCrossReferences(reference: string, topic?: string): Promise<string[]>;
    getBibleBooks(): BibleBook[];
    getAvailableVersions(): {
        [key: string]: string;
    };
    parseReference(reference: string): {
        book: string;
        chapter: number;
        verse?: number;
    } | null;
    getRandomVerse(version?: string): Promise<BibleVerse | null>;
    /**
     * NEW COMPREHENSIVE BIBLE ACCESS METHODS
     * Provides access to ALL 31,000+ verses × multiple versions through working APIs
     */
    /**
     * Enhanced Bible-API.com access (WORKING API - Complete Bible Database)
     * Access to all 66 books, 31,000+ verses dynamically
     */
    getVerseFromBibleAPICom(reference: string, version?: string): Promise<BibleVerse | null>;
    /**
     * Enhanced Bible.org Labs API access (WORKING API - Complete Bible Database)
     * Access to multiple translations and all biblical verses
     */
    getVerseFromBibleOrgLabs(reference: string, version?: string): Promise<BibleVerse | null>;
    /**
     * ENHANCED MAIN VERSE RETRIEVAL METHOD
     * Uses working APIs to provide access to complete biblical database
     * 31,000+ verses × multiple versions through reliable API sources
     */
    getVerseEnhanced(reference: string, version?: string): Promise<BibleVerse | null>;
    /**
     * GET ALL BOOKS - Complete Biblical Coverage
     * Returns all 66 books of the Bible for comprehensive access
     */
    getAllBibleBooks(): BibleBook[];
}
export declare const freeBibleService: FreeBibleService;
export declare const FREE_BIBLE_VERSIONS: {
    id: string;
    name: string;
    language: string;
}[];
export type { BibleVerse, BibleBook, SearchResult };
//# sourceMappingURL=free-bible-service.d.ts.map