"use strict";
/**
 * Bible API Integration Service
 * Foundation for real-time Bible verse retrieval
 * Updated: September 1, 2025
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBibleAPIService = exports.bibleAPIService = exports.BibleAPIService = void 0;
const bible_config_1 = require("./bible-config");
const bible_data_1 = require("./bible-data");
class BibleAPIService {
    constructor(provider) {
        this.config = null;
        this.requestCount = 0;
        this.lastRequestTime = 0;
        if (provider && bible_config_1.BIBLE_API_PROVIDERS[provider]) {
            this.config = bible_config_1.BIBLE_API_PROVIDERS[provider];
        }
    }
    /**
     * Get verse from local data or external API
     */
    async getVerse(reference, version) {
        try {
            // Always try local data first for performance
            const localResult = await this.getLocalVerse(reference, version);
            if (localResult.success) {
                return localResult;
            }
            // Fallback to API if configured and version is supported
            if (this.config && this.config.supportedVersions.includes(version)) {
                return await this.getApiVerse(reference, version);
            }
            return {
                error: `Versión ${version} no disponible para la referencia ${reference}`,
                code: 'VERSION_NOT_SUPPORTED',
                success: false
            };
        }
        catch (error) {
            console.error('Bible API Service error:', error);
            return {
                error: 'Error interno del servicio bíblico',
                code: 'API_ERROR',
                success: false
            };
        }
    }
    /**
     * Get verse from local enhanced data
     */
    async getLocalVerse(reference, version) {
        const verseTranslations = (0, bible_data_1.getVerseTranslations)(reference);
        if (!verseTranslations || !verseTranslations[version]) {
            return {
                error: `Referencia ${reference} no encontrada localmente`,
                code: 'INVALID_REFERENCE',
                success: false
            };
        }
        const parsedRef = this.parseReference(reference);
        if (!parsedRef) {
            return {
                error: 'Formato de referencia inválido',
                code: 'INVALID_REFERENCE',
                success: false
            };
        }
        return {
            reference,
            text: verseTranslations[version],
            version,
            book: parsedRef.book,
            chapter: parsedRef.chapter,
            verse: parsedRef.verse,
            success: true,
            source: 'local'
        };
    }
    /**
     * Get verse from external Bible API (future implementation)
     */
    async getApiVerse(reference, version) {
        if (!this.config) {
            return {
                error: 'API no configurada',
                code: 'API_ERROR',
                success: false
            };
        }
        // Rate limiting check
        const now = Date.now();
        if (now - this.lastRequestTime < (3600000 / this.config.rateLimit)) {
            if (this.requestCount >= this.config.rateLimit) {
                return {
                    error: 'Límite de solicitudes alcanzado',
                    code: 'RATE_LIMIT',
                    success: false
                };
            }
        }
        else {
            this.requestCount = 0;
        }
        try {
            // This is where the actual API integration would go
            // Example implementation structure:
            /*
            const response = await fetch(`${this.config.baseUrl}/v1/verses/${reference}`, {
              headers: {
                'Authorization': `Bearer ${this.config.apiKey}`,
                'Content-Type': 'application/json'
              },
              params: {
                version,
                format: 'json'
              }
            })
      
            if (!response.ok) {
              throw new Error(`API error: ${response.status}`)
            }
      
            const data = await response.json()
            */
            this.requestCount++;
            this.lastRequestTime = now;
            // For now, return placeholder indicating API integration needed
            const parsedRef = this.parseReference(reference);
            return {
                reference,
                text: `[API Integration: ${reference} en ${version} - ${this.config.provider}]`,
                version,
                book: parsedRef?.book || '',
                chapter: parsedRef?.chapter || 0,
                verse: parsedRef?.verse || 0,
                success: true,
                source: 'api'
            };
        }
        catch (error) {
            console.error(`Bible API error (${this.config.provider}):`, error);
            return {
                error: `Error de la API ${this.config.provider}`,
                code: 'API_ERROR',
                success: false
            };
        }
    }
    /**
     * Parse biblical reference
     */
    parseReference(reference) {
        const match = reference.match(/^(.+?)\s+(\d+):(\d+)$/i);
        if (!match)
            return null;
        return {
            book: match[1].trim(),
            chapter: parseInt(match[2]),
            verse: parseInt(match[3])
        };
    }
    /**
     * Get multiple verses for comparison
     */
    async getMultipleVerses(reference, versions) {
        const promises = versions.map(version => this.getVerse(reference, version));
        const results = await Promise.all(promises);
        const successResults = [];
        const errorResults = [];
        results.forEach(result => {
            if (result.success) {
                successResults.push(result);
            }
            else {
                errorResults.push(result);
            }
        });
        return {
            results: successResults,
            errors: errorResults
        };
    }
    /**
     * Health check for API connectivity
     */
    async healthCheck() {
        if (!this.config)
            return false;
        try {
            // Test with a simple verse
            const result = await this.getVerse('John 3:16', 'ESV');
            return result.success;
        }
        catch {
            return false;
        }
    }
}
exports.BibleAPIService = BibleAPIService;
// Export singleton instance
exports.bibleAPIService = new BibleAPIService();
// Export factory function for different providers
function createBibleAPIService(provider) {
    return new BibleAPIService(provider);
}
exports.createBibleAPIService = createBibleAPIService;
//# sourceMappingURL=bible-api-service.js.map