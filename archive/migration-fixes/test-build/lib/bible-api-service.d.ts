/**
 * Bible API Integration Service
 * Foundation for real-time Bible verse retrieval
 * Updated: September 1, 2025
 */
export interface BibleAPIResponse {
    reference: string;
    text: string;
    version: string;
    book: string;
    chapter: number;
    verse: number;
    success: boolean;
    source: 'local' | 'api';
}
export interface BibleAPIError {
    error: string;
    code: 'INVALID_REFERENCE' | 'VERSION_NOT_SUPPORTED' | 'API_ERROR' | 'RATE_LIMIT';
    success: false;
}
export declare class BibleAPIService {
    private config;
    private requestCount;
    private lastRequestTime;
    constructor(provider?: string);
    /**
     * Get verse from local data or external API
     */
    getVerse(reference: string, version: string): Promise<BibleAPIResponse | BibleAPIError>;
    /**
     * Get verse from local enhanced data
     */
    private getLocalVerse;
    /**
     * Get verse from external Bible API (future implementation)
     */
    private getApiVerse;
    /**
     * Parse biblical reference
     */
    private parseReference;
    /**
     * Get multiple verses for comparison
     */
    getMultipleVerses(reference: string, versions: string[]): Promise<{
        results: BibleAPIResponse[];
        errors: BibleAPIError[];
    }>;
    /**
     * Health check for API connectivity
     */
    healthCheck(): Promise<boolean>;
}
export declare const bibleAPIService: BibleAPIService;
export declare function createBibleAPIService(provider: string): BibleAPIService;
//# sourceMappingURL=bible-api-service.d.ts.map