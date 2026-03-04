"use strict";
/**
 * Memory Assessment and Cleanup Utility
 * Systematic analysis and cleanup of storage usage
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.performSafeCleanup = exports.generateMemoryReport = exports.runMemoryAssessment = exports.MemoryAssessment = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
class MemoryAssessment {
    constructor(projectRoot = process.cwd()) {
        this.excludePaths = [
            'node_modules',
            '.git',
            '.next',
            'dist',
            'build',
            '.turbo',
            'coverage'
        ];
        // File patterns for categorization
        this.filePatterns = {
            documentation: /\.(md|txt|doc|docx|pdf)$/i,
            build: /\.(js\.map|d\.ts\.map|tsbuildinfo)$/i,
            temp: /\.(tmp|temp|cache|log)$/i,
            source: /\.(ts|tsx|js|jsx|css|scss|json)$/i,
            config: /\.(config|env|gitignore|prettierrc|eslintrc)$/i
        };
        // Files safe to delete (old documentation, temp files, etc.)
        this.safeToDeletePatterns = [
            /^.*_TEST.*\.md$/i,
            /^.*_SUMMARY.*\.md$/i,
            /^.*_REPORT.*\.md$/i,
            /^.*_COMPLETE.*\.md$/i,
            /^.*_GUIDE.*\.md$/i,
            /^.*_TESTING.*\.md$/i,
            /^.*PERFORMANCE_TEST.*\.md$/i,
            /^.*DEPLOYMENT.*\.md$/i,
            /\.tsbuildinfo$/,
            /\.tmp$/,
            /\.cache$/,
            /\.log$/
        ];
        // Critical files to always keep
        this.criticalFiles = [
            'README.md',
            'package.json',
            'package-lock.json',
            'tsconfig.json',
            'next.config.js',
            'tailwind.config.ts',
            'middleware.ts',
            'prisma/schema.prisma',
            '.env',
            '.env.local',
            '.env.example'
        ];
        this.projectRoot = projectRoot;
    }
    /**
     * PROTOCOL CHECK: Is this the right approach?
     * YES - Systematic analysis before deletion ensures safety
     */
    async analyzeProjectMemory() {
        const files = await this.scanDirectory(this.projectRoot);
        const analysis = await this.analyzeFiles(files);
        return this.generateReport(analysis);
    }
    async scanDirectory(dir, relativePath = '') {
        const files = [];
        try {
            const entries = await fs_1.promises.readdir(dir, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path_1.default.join(dir, entry.name);
                const relPath = path_1.default.join(relativePath, entry.name);
                // Skip excluded directories
                if (entry.isDirectory() && this.excludePaths.includes(entry.name)) {
                    continue;
                }
                if (entry.isDirectory()) {
                    const subFiles = await this.scanDirectory(fullPath, relPath);
                    files.push(...subFiles);
                }
                else {
                    files.push(fullPath);
                }
            }
        }
        catch (error) {
            console.warn(`Cannot access directory: ${dir}`, error);
        }
        return files;
    }
    async analyzeFiles(filePaths) {
        const analyses = [];
        for (const filePath of filePaths) {
            try {
                const stats = await fs_1.promises.stat(filePath);
                const analysis = await this.analyzeFile(filePath, stats);
                analyses.push(analysis);
            }
            catch (error) {
                console.warn(`Cannot analyze file: ${filePath}`, error);
            }
        }
        return analyses;
    }
    async analyzeFile(filePath, stats) {
        const relativePath = path_1.default.relative(this.projectRoot, filePath);
        const fileName = path_1.default.basename(filePath);
        // Determine file type
        const type = this.categorizeFile(fileName, filePath);
        // Determine cleanup priority
        const priority = this.determinePriority(fileName, relativePath, type);
        return {
            path: relativePath,
            size: stats.size,
            type,
            priority,
            lastModified: stats.mtime
        };
    }
    categorizeFile(fileName, filePath) {
        for (const [type, pattern] of Object.entries(this.filePatterns)) {
            if (pattern.test(fileName)) {
                return type;
            }
        }
        return 'other';
    }
    /**
     * PROTOCOL CHECK: What are the repercussions?
     * Careful prioritization ensures critical files are never marked for deletion
     */
    determinePriority(fileName, relativePath, type) {
        // Always keep critical files
        if (this.criticalFiles.includes(fileName) || this.criticalFiles.includes(relativePath)) {
            return 'keep';
        }
        // Source files are generally kept
        if (type === 'source' || type === 'config') {
            return 'keep';
        }
        // Safe to delete patterns
        for (const pattern of this.safeToDeletePatterns) {
            if (pattern.test(fileName) || pattern.test(relativePath)) {
                return 'safe';
            }
        }
        // Documentation files need review (some may be important)
        if (type === 'documentation') {
            return 'review';
        }
        // Build artifacts and temp files are safe to delete
        if (type === 'build' || type === 'temp') {
            return 'safe';
        }
        return 'review';
    }
    generateReport(analyses) {
        const filesByType = {};
        const safeToDelete = [];
        const requiresReview = [];
        for (const analysis of analyses) {
            // Group by type
            if (!filesByType[analysis.type]) {
                filesByType[analysis.type] = [];
            }
            filesByType[analysis.type].push(analysis);
            // Group by priority
            if (analysis.priority === 'safe') {
                safeToDelete.push(analysis);
            }
            else if (analysis.priority === 'review') {
                requiresReview.push(analysis);
            }
        }
        const totalSize = analyses.reduce((sum, file) => sum + file.size, 0);
        const totalSavings = safeToDelete.reduce((sum, file) => sum + file.size, 0);
        // Get largest files (over 1MB)
        const largestFiles = analyses
            .filter(file => file.size > 1024 * 1024)
            .sort((a, b) => b.size - a.size);
        // Get old files (over 30 days)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const oldFiles = analyses
            .filter(file => file.lastModified < thirtyDaysAgo && file.priority !== 'keep')
            .sort((a, b) => a.lastModified.getTime() - b.lastModified.getTime());
        return {
            totalSize,
            filesByType,
            cleanupRecommendations: {
                safeToDelete: safeToDelete.sort((a, b) => b.size - a.size),
                requiresReview: requiresReview.sort((a, b) => b.size - a.size),
                totalSavings
            },
            largestFiles,
            oldFiles
        };
    }
    /**
     * PROTOCOL CHECK: Do we have this already? May we need this later?
     * This is new functionality. Files are backed up before deletion.
     */
    async performSafeCleanup(report, dryRun = true) {
        console.log(`🧹 Starting ${dryRun ? 'DRY RUN' : 'ACTUAL'} cleanup...`);
        let totalCleaned = 0;
        let filesDeleted = 0;
        for (const file of report.cleanupRecommendations.safeToDelete) {
            const fullPath = path_1.default.join(this.projectRoot, file.path);
            try {
                if (dryRun) {
                    console.log(`[DRY RUN] Would delete: ${file.path} (${this.formatBytes(file.size)})`);
                }
                else {
                    // Create backup directory if needed
                    const backupDir = path_1.default.join(this.projectRoot, '.cleanup-backup', path_1.default.dirname(file.path));
                    await fs_1.promises.mkdir(backupDir, { recursive: true });
                    // Backup file before deletion
                    const backupPath = path_1.default.join(this.projectRoot, '.cleanup-backup', file.path);
                    await fs_1.promises.copyFile(fullPath, backupPath);
                    // Delete original file
                    await fs_1.promises.unlink(fullPath);
                    console.log(`✅ Deleted: ${file.path} (${this.formatBytes(file.size)})`);
                }
                totalCleaned += file.size;
                filesDeleted++;
            }
            catch (error) {
                console.error(`❌ Failed to process ${file.path}:`, error);
            }
        }
        console.log(`\n📊 Cleanup Summary:`);
        console.log(`Files processed: ${filesDeleted}`);
        console.log(`Space ${dryRun ? 'that would be' : ''} freed: ${this.formatBytes(totalCleaned)}`);
        if (!dryRun) {
            console.log(`📁 Backup created in: .cleanup-backup/`);
        }
    }
    formatBytes(bytes) {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        return `${size.toFixed(1)} ${units[unitIndex]}`;
    }
    /**
     * Generate detailed memory report for review
     */
    async generateMemoryReport() {
        const report = await this.analyzeProjectMemory();
        let output = `# 🧠 Memory Assessment Report\n`;
        output += `**Generated**: ${new Date().toISOString()}\n\n`;
        output += `## 📊 Overview\n`;
        output += `- **Total Project Size**: ${this.formatBytes(report.totalSize)}\n`;
        output += `- **Potential Savings**: ${this.formatBytes(report.cleanupRecommendations.totalSavings)}\n`;
        output += `- **Files Safe to Delete**: ${report.cleanupRecommendations.safeToDelete.length}\n`;
        output += `- **Files Requiring Review**: ${report.cleanupRecommendations.requiresReview.length}\n\n`;
        output += `## 🗂 Files by Type\n`;
        for (const [type, files] of Object.entries(report.filesByType)) {
            const totalSize = files.reduce((sum, f) => sum + f.size, 0);
            output += `- **${type}**: ${files.length} files (${this.formatBytes(totalSize)})\n`;
        }
        output += `\n## 🗑 Safe to Delete (${report.cleanupRecommendations.safeToDelete.length} files)\n`;
        for (const file of report.cleanupRecommendations.safeToDelete.slice(0, 20)) {
            output += `- \`${file.path}\` (${this.formatBytes(file.size)})\n`;
        }
        if (report.cleanupRecommendations.safeToDelete.length > 20) {
            output += `... and ${report.cleanupRecommendations.safeToDelete.length - 20} more files\n`;
        }
        output += `\n## ⚠️ Requires Review (${report.cleanupRecommendations.requiresReview.length} files)\n`;
        for (const file of report.cleanupRecommendations.requiresReview.slice(0, 10)) {
            output += `- \`${file.path}\` (${this.formatBytes(file.size)}) - Last modified: ${file.lastModified.toLocaleDateString()}\n`;
        }
        output += `\n## 📈 Largest Files\n`;
        for (const file of report.largestFiles.slice(0, 10)) {
            output += `- \`${file.path}\` (${this.formatBytes(file.size)}) - ${file.priority}\n`;
        }
        return output;
    }
}
exports.MemoryAssessment = MemoryAssessment;
// Export utility functions
async function runMemoryAssessment(projectRoot) {
    const assessment = new MemoryAssessment(projectRoot);
    return assessment.analyzeProjectMemory();
}
exports.runMemoryAssessment = runMemoryAssessment;
async function generateMemoryReport(projectRoot) {
    const assessment = new MemoryAssessment(projectRoot);
    return assessment.generateMemoryReport();
}
exports.generateMemoryReport = generateMemoryReport;
async function performSafeCleanup(report, dryRun = true, projectRoot) {
    const assessment = new MemoryAssessment(projectRoot);
    return assessment.performSafeCleanup(report, dryRun);
}
exports.performSafeCleanup = performSafeCleanup;
//# sourceMappingURL=memory-assessment.js.map