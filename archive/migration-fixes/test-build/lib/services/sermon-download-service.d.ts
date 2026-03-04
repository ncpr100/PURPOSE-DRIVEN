interface SermonData {
    title: string;
    content: string;
    scripture?: string;
    topic?: string;
    date?: string;
    pastor?: string;
    church?: string;
}
declare class SermonDownloadService {
    downloadAsPDF(sermon: SermonData): void;
    downloadAsWord(sermon: SermonData): void;
    downloadAsText(sermon: SermonData): void;
    downloadAsMarkdown(sermon: SermonData): void;
    downloadAsHTML(sermon: SermonData): void;
    printSermon(sermon: SermonData): void;
    getAvailableFormats(): Array<{
        id: string;
        name: string;
        icon: string;
        description: string;
    }>;
}
export declare const sermonDownloadService: SermonDownloadService;
export type { SermonData };
//# sourceMappingURL=sermon-download-service.d.ts.map