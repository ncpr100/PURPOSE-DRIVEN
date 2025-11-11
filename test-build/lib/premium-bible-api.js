"use strict";
/**
 * Premium Bible API Integration
 * Provides access to authenticated Bible APIs for paid subscribers
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PremiumBibleAPI = void 0;
const bible_integrations_1 = __importDefault(require("./bible-integrations"));
class PremiumBibleAPI {
    /**
     * Search for Bible verse with premium authentication
     */
    static async searchVerse(reference, version, churchId) {
        // Check if church has Bible integration subscription
        const canUse = await bible_integrations_1.default.canUseBibleFeature(churchId, 'bible-search');
        if (!canUse) {
            return {
                book: reference.split(' ')[0] || 'Unknown',
                chapter: 1,
                verse: 1,
                text: `🔒 Función Premium - Actualiza a Bible Pro para acceder a búsquedas bíblicas avanzadas`,
                version,
                versionName: this.getVersionName(version),
                source: 'local-fallback',
                authenticated: false
            };
        }
        try {
            // Increment usage counter
            await bible_integrations_1.default.incrementUsage(churchId);
            // Try premium APIs based on version language
            if (this.isSpanishVersion(version)) {
                return await this.fetchSpanishVerse(reference, version);
            }
            else {
                return await this.fetchEnglishVerse(reference, version);
            }
        }
        catch (error) {
            console.error('Premium Bible API error:', error);
            return null;
        }
    }
    /**
     * Compare multiple Bible versions
     */
    static async compareVersions(reference, versions, churchId) {
        const canUse = await bible_integrations_1.default.canUseBibleFeature(churchId, 'bible-compare');
        if (!canUse) {
            return {
                reference,
                versions: versions.map(version => ({
                    book: reference.split(' ')[0] || 'Unknown',
                    chapter: 1,
                    verse: 1,
                    text: `🔒 Función Premium - Actualiza a Bible Pro para comparar versiones bíblicas`,
                    version,
                    versionName: this.getVersionName(version),
                    source: 'local-fallback',
                    authenticated: false
                })),
                success: false,
                message: 'Subscription required for version comparison'
            };
        }
        // Fetch all versions
        const versePromises = versions.map(version => this.searchVerse(reference, version, churchId));
        const results = await Promise.all(versePromises);
        const validResults = results.filter(r => r !== null);
        return {
            reference,
            versions: validResults,
            success: validResults.length > 0,
            message: validResults.length > 0 ? 'Comparison completed' : 'No verses found'
        };
    }
    /**
     * Fetch Spanish Bible verse from premium APIs
     */
    static async fetchSpanishVerse(reference, version) {
        // Translate Spanish book names to English for API compatibility
        const translatedRef = this.translateBookName(reference);
        // Try API.Bible first (requires authentication)
        try {
            const response = await fetch(`https://api.scripture.api.bible/v1/bibles/${this.getApiBibleId(version)}/verses/${this.formatReferenceForApiBible(translatedRef)}`, {
                headers: {
                    'api-key': process.env.API_BIBLE_KEY || 'demo'
                }
            });
            if (response.ok) {
                const data = await response.json();
                return {
                    book: reference.split(' ')[0],
                    chapter: parseInt(reference.match(/(\d+)/)?.[1] || '1'),
                    verse: parseInt(reference.match(/:(\d+)/)?.[1] || '1'),
                    text: data.data?.content?.replace(/<[^>]*>/g, '') || 'Verse not found',
                    version,
                    versionName: this.getVersionName(version),
                    source: 'api-bible',
                    authenticated: true
                };
            }
        }
        catch (error) {
            console.error('API.Bible failed:', error);
        }
        // Fallback to Biblia.com API (requires authentication)
        try {
            const response = await fetch(`https://api.biblia.com/v1/bible/content/${version}.json?passage=${encodeURIComponent(translatedRef)}&key=${process.env.BIBLIA_API_KEY}`);
            if (response.ok) {
                const data = await response.json();
                return {
                    book: reference.split(' ')[0],
                    chapter: parseInt(reference.match(/(\d+)/)?.[1] || '1'),
                    verse: parseInt(reference.match(/:(\d+)/)?.[1] || '1'),
                    text: data.text || 'Verse not found',
                    version,
                    versionName: this.getVersionName(version),
                    source: 'biblia-api',
                    authenticated: true
                };
            }
        }
        catch (error) {
            console.error('Biblia API failed:', error);
        }
        // Final fallback
        return {
            book: reference.split(' ')[0],
            chapter: parseInt(reference.match(/(\d+)/)?.[1] || '1'),
            verse: parseInt(reference.match(/:(\d+)/)?.[1] || '1'),
            text: `Versículo no disponible: ${reference} en ${version}`,
            version,
            versionName: this.getVersionName(version),
            source: 'local-fallback',
            authenticated: true
        };
    }
    /**
     * Fetch English Bible verse from premium APIs
     */
    static async fetchEnglishVerse(reference, version) {
        // ESV API for ESV version
        if (version === 'ESV') {
            try {
                const response = await fetch(`https://api.esv.org/v3/passage/text/?q=${encodeURIComponent(reference)}`, {
                    headers: {
                        'Authorization': `Token ${process.env.ESV_API_KEY}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    return {
                        book: reference.split(' ')[0],
                        chapter: parseInt(reference.match(/(\d+)/)?.[1] || '1'),
                        verse: parseInt(reference.match(/:(\d+)/)?.[1] || '1'),
                        text: data.passages?.[0] || 'Verse not found',
                        version,
                        versionName: this.getVersionName(version),
                        source: 'esv-api',
                        authenticated: true
                    };
                }
            }
            catch (error) {
                console.error('ESV API failed:', error);
            }
        }
        // Fallback to bible-api.com with version parameters
        try {
            const versionParam = this.getBibleApiVersion(version);
            const url = `https://bible-api.com/${encodeURIComponent(reference)}?translation=${versionParam}`;
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                return {
                    book: reference.split(' ')[0],
                    chapter: parseInt(reference.match(/(\d+)/)?.[1] || '1'),
                    verse: parseInt(reference.match(/:(\d+)/)?.[1] || '1'),
                    text: data.text || 'Verse not found',
                    version,
                    versionName: this.getVersionName(version),
                    source: 'api-bible',
                    authenticated: true
                };
            }
        }
        catch (error) {
            console.error('Bible API failed:', error);
        }
        // Final fallback
        return {
            book: reference.split(' ')[0],
            chapter: parseInt(reference.match(/(\d+)/)?.[1] || '1'),
            verse: parseInt(reference.match(/:(\d+)/)?.[1] || '1'),
            text: `Verse not available: ${reference} in ${version}`,
            version,
            versionName: this.getVersionName(version),
            source: 'local-fallback',
            authenticated: true
        };
    }
    /**
     * Helper methods
     */
    static isSpanishVersion(version) {
        const spanishVersions = ['RVR1960', 'RVC', 'TLA', 'PDT', 'NVI', 'NTV', 'NBLA', 'VBL', 'AMP'];
        return spanishVersions.includes(version);
    }
    static translateBookName(reference) {
        const translations = {
            'Santiago': 'James',
            'Juan': 'John',
            'Salmos': 'Psalms',
            'Mateo': 'Matthew',
            'Marcos': 'Mark',
            'Lucas': 'Luke',
            'Romanos': 'Romans',
            'Filipenses': 'Philippians',
            'Jeremías': 'Jeremiah'
        };
        let translatedRef = reference;
        Object.entries(translations).forEach(([spanish, english]) => {
            translatedRef = translatedRef.replace(new RegExp(`^${spanish}`, 'i'), english);
        });
        return translatedRef;
    }
    static getVersionName(version) {
        const versionNames = {
            'RVR1960': 'Reina Valera 1960',
            'RVC': 'Reina Valera Contemporánea',
            'TLA': 'Traducción en Lenguaje Actual',
            'PDT': 'Palabra de Dios para Todos',
            'NVI': 'Nueva Versión Internacional',
            'NTV': 'Nueva Traducción Viviente',
            'NBLA': 'Nueva Biblia de las Américas',
            'VBL': 'Versión Biblia Libre',
            'AMP': 'Amplified Bible',
            'ESV': 'English Standard Version',
            'KJV': 'King James Version',
            'NIV': 'New International Version'
        };
        return versionNames[version] || version;
    }
    static getApiBibleId(version) {
        const bibleIds = {
            'RVR1960': 'RVR1960',
            'RVC': 'RVC',
            'ESV': 'ESV',
            'KJV': 'KJV'
        };
        return bibleIds[version] || 'RVR1960';
    }
    static getBibleApiVersion(version) {
        const apiVersions = {
            'KJV': 'kjv',
            'ESV': 'web',
            'NIV': 'web',
            'AMPC': 'web'
        };
        return apiVersions[version] || 'web';
    }
    static formatReferenceForApiBible(reference) {
        // Convert "James 3:12" to "JAS.3.12" format
        return reference.replace(/(\w+)\s+(\d+):(\d+)/, (match, book, chapter, verse) => {
            const bookAbbrev = book.substring(0, 3).toUpperCase();
            return `${bookAbbrev}.${chapter}.${verse}`;
        });
    }
}
exports.PremiumBibleAPI = PremiumBibleAPI;
exports.default = PremiumBibleAPI;
//# sourceMappingURL=premium-bible-api.js.map