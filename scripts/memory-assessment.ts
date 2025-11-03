/**
 * KHESED-TEK CMS Memory Assessment Script
 * Comprehensive memory analysis and cleanup recommendations
 * 
 * PROTOCOL CHECKS IMPLEMENTED:
 * 1. Safe analysis - read-only assessment
 * 2. Detailed reporting - no assumptions
 * 3. Recommendations only - no automatic deletions
 * 4. Comprehensive scope - includes all areas
 */

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

interface FileInfo {
  path: string;
  size: number;
  sizeFormatted: string;
  category: string;
}

interface AssessmentReport {
  totalSize: number;
  categories: {
    [key: string]: {
      count: number;
      totalSize: number;
      files: FileInfo[];
    };
  };
  recommendations: string[];
}

class MemoryAssessment {
  private excludeDirs = ['node_modules', '.git', '.next', 'dist'];
  private tempExtensions = ['.tmp', '.bak', '.old', '.log'];
  private report: AssessmentReport = {
    totalSize: 0,
    categories: {},
    recommendations: []
  };

  /**
   * Format bytes to human-readable format
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Categorize file based on extension and name
   */
  private categorizeFile(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const basename = path.basename(filePath).toLowerCase();

    if (this.tempExtensions.includes(ext)) return 'Temporary Files';
    if (basename.includes('screenshot') || basename.includes('capture')) return 'Screenshots/Attachments';
    if (basename.includes('test') && !filePath.includes('/tests/')) return 'Test Files';
    if (ext === '.pdf') return 'PDF Documents';
    if (['.png', '.jpg', '.jpeg', '.gif', '.svg'].includes(ext)) return 'Images';
    if (['.md'].includes(ext)) return 'Documentation';
    if (ext === '.zip') return 'Archives';
    
    return 'Other';
  }

  /**
   * Scan directory recursively
   */
  private async scanDirectory(dirPath: string): Promise<void> {
    try {
      const entries = await readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        // Skip excluded directories
        if (entry.isDirectory() && this.excludeDirs.includes(entry.name)) {
          continue;
        }

        if (entry.isDirectory()) {
          await this.scanDirectory(fullPath);
        } else {
          const stats = await stat(fullPath);
          const category = this.categorizeFile(fullPath);

          if (!this.report.categories[category]) {
            this.report.categories[category] = {
              count: 0,
              totalSize: 0,
              files: []
            };
          }

          const fileInfo: FileInfo = {
            path: fullPath,
            size: stats.size,
            sizeFormatted: this.formatBytes(stats.size),
            category
          };

          this.report.categories[category].count++;
          this.report.categories[category].totalSize += stats.size;
          this.report.categories[category].files.push(fileInfo);
          this.report.totalSize += stats.size;
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${dirPath}:`, error);
    }
  }

  /**
   * Generate recommendations based on findings
   */
  private generateRecommendations(): void {
    const recommendations: string[] = [];

    // Check temporary files
    const tempFiles = this.report.categories['Temporary Files'];
    if (tempFiles && tempFiles.count > 0) {
      recommendations.push(
        `🧹 IMMEDIATE: Remove ${tempFiles.count} temporary files (${this.formatBytes(tempFiles.totalSize)})`
      );
    }

    // Check test files
    const testFiles = this.report.categories['Test Files'];
    if (testFiles && testFiles.count > 0) {
      recommendations.push(
        `⚠️ REVIEW: Found ${testFiles.count} test files outside test directory (${this.formatBytes(testFiles.totalSize)})`
      );
    }

    // Check archives
    const archives = this.report.categories['Archives'];
    if (archives && archives.count > 0) {
      recommendations.push(
        `📦 REVIEW: Found ${archives.count} archive files (${this.formatBytes(archives.totalSize)}) - consider moving to external storage`
      );
    }

    // Check screenshots
    const screenshots = this.report.categories['Screenshots/Attachments'];
    if (screenshots && screenshots.count > 0) {
      recommendations.push(
        `📸 REVIEW: Found ${screenshots.count} screenshot/attachment files (${this.formatBytes(screenshots.totalSize)})`
      );
    }

    // Check PDF documents
    const pdfs = this.report.categories['PDF Documents'];
    if (pdfs && pdfs.count > 0 && pdfs.totalSize > 5 * 1024 * 1024) {
      recommendations.push(
        `📄 OPTIMIZE: ${pdfs.count} PDF files total ${this.formatBytes(pdfs.totalSize)} - consider compression or external storage`
      );
    }

    // Memory best practices
    recommendations.push('');
    recommendations.push('💡 BEST PRACTICES:');
    recommendations.push('  • Run cleanup script regularly: npm run cleanup');
    recommendations.push('  • Use .gitignore to prevent committing temporary files');
    recommendations.push('  • Store large attachments in cloud storage (S3, Cloudinary)');
    recommendations.push('  • Enable automatic memory monitoring in production');
    recommendations.push('  • Implement log rotation for production logs');

    this.report.recommendations = recommendations;
  }

  /**
   * Print report to console
   */
  private printReport(): void {
    console.log('\n🔍 KHESED-TEK CMS MEMORY ASSESSMENT REPORT');
    console.log('==========================================\n');

    console.log(`📊 TOTAL ANALYZED SIZE: ${this.formatBytes(this.report.totalSize)}\n`);

    console.log('📁 BREAKDOWN BY CATEGORY:\n');
    
    // Sort categories by size
    const sortedCategories = Object.entries(this.report.categories)
      .sort(([, a], [, b]) => b.totalSize - a.totalSize);

    for (const [category, data] of sortedCategories) {
      console.log(`  ${category}:`);
      console.log(`    Count: ${data.count} files`);
      console.log(`    Size: ${this.formatBytes(data.totalSize)}`);
      
      // Show top 3 largest files in each category
      const topFiles = data.files
        .sort((a, b) => b.size - a.size)
        .slice(0, 3);
      
      if (topFiles.length > 0) {
        console.log('    Largest files:');
        topFiles.forEach(file => {
          const relativePath = file.path.replace(process.cwd(), '.');
          console.log(`      - ${relativePath} (${file.sizeFormatted})`);
        });
      }
      console.log('');
    }

    console.log('\n📋 RECOMMENDATIONS:\n');
    this.report.recommendations.forEach(rec => console.log(`  ${rec}`));

    console.log('\n==========================================');
    console.log('✅ Assessment complete\n');
  }

  /**
   * Run the assessment
   */
  async run(): Promise<void> {
    console.log('🚀 Starting memory assessment...\n');
    
    const startTime = Date.now();
    await this.scanDirectory(process.cwd());
    const endTime = Date.now();

    this.generateRecommendations();
    this.printReport();

    console.log(`⏱️ Assessment completed in ${((endTime - startTime) / 1000).toFixed(2)}s`);
  }
}

// Run assessment
const assessment = new MemoryAssessment();
assessment.run().catch(console.error);
