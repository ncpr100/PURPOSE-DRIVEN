/**
 * Memory Assessment and Cleanup Utility
 * Systematic analysis and cleanup of storage usage
 */
interface FileAnalysis {
    path: string;
    size: number;
    type: 'documentation' | 'build' | 'temp' | 'source' | 'config' | 'other';
    priority: 'safe' | 'review' | 'keep';
    lastModified: Date;
}
interface MemoryReport {
    totalSize: number;
    filesByType: Record<string, FileAnalysis[]>;
    cleanupRecommendations: {
        safeToDelete: FileAnalysis[];
        requiresReview: FileAnalysis[];
        totalSavings: number;
    };
    largestFiles: FileAnalysis[];
    oldFiles: FileAnalysis[];
}
export declare class MemoryAssessment {
    private readonly projectRoot;
    private readonly excludePaths;
    private readonly filePatterns;
    private readonly safeToDeletePatterns;
    private readonly criticalFiles;
    constructor(projectRoot?: string);
    /**
     * PROTOCOL CHECK: Is this the right approach?
     * YES - Systematic analysis before deletion ensures safety
     */
    analyzeProjectMemory(): Promise<MemoryReport>;
    private scanDirectory;
    private analyzeFiles;
    private analyzeFile;
    private categorizeFile;
    /**
     * PROTOCOL CHECK: What are the repercussions?
     * Careful prioritization ensures critical files are never marked for deletion
     */
    private determinePriority;
    private generateReport;
    /**
     * PROTOCOL CHECK: Do we have this already? May we need this later?
     * This is new functionality. Files are backed up before deletion.
     */
    performSafeCleanup(report: MemoryReport, dryRun?: boolean): Promise<void>;
    private formatBytes;
    /**
     * Generate detailed memory report for review
     */
    generateMemoryReport(): Promise<string>;
}
export declare function runMemoryAssessment(projectRoot?: string): Promise<MemoryReport>;
export declare function generateMemoryReport(projectRoot?: string): Promise<string>;
export declare function performSafeCleanup(report: MemoryReport, dryRun?: boolean, projectRoot?: string): Promise<void>;
export {};
//# sourceMappingURL=memory-assessment.d.ts.map