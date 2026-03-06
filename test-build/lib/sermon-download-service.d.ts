/**
 * Sermon Download Service
 * Supports PDF, DOCX, HTML, and TXT formats
 * Free export functionality for pastors
 */
export interface SermonContent {
    title: string;
    date: string;
    scripture: string;
    introduction: string;
    context: string;
    points: {
        title: string;
        content: string;
        scripture?: string;
    }[];
    conclusion: string;
    author: string;
    church?: string;
}
export type DownloadFormat = 'pdf' | 'docx' | 'html' | 'txt';
declare class SermonDownloadService {
    /**
     * Download sermon in specified format
     */
    downloadSermon(sermon: SermonContent, format: DownloadFormat): Promise<void>;
    /**
     * Generate PDF using jsPDF
     */
    private downloadAsPDF;
    /**
     * Generate DOCX (simplified HTML-based approach)
     */
    private downloadAsWord;
    /**
     * Generate HTML download
     */
    private downloadAsHTML;
    /**
     * Generate TXT download
     */
    private downloadAsText;
    /**
     * Generate HTML content
     */
    private generateHTML;
    /**
     * Validate sermon content before download
     */
    validateSermonContent(sermon: SermonContent): {
        valid: boolean;
        errors: string[];
    };
    /**
     * Get download formats with descriptions
     */
    getAvailableFormats(): {
        format: DownloadFormat;
        name: string;
        description: string;
    }[];
}
export declare const sermonDownloadService: SermonDownloadService;
export default sermonDownloadService;
//# sourceMappingURL=sermon-download-service.d.ts.map