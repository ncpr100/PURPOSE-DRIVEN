#!/usr/bin/env node

/**
 * Memory Assessment CLI Tool
 * Usage: npm run memory-assessment [--cleanup] [--dry-run]
 */

import { MemoryAssessment } from '../lib/memory-assessment';
import { promises as fs } from 'fs';
import path from 'path';

async function main() {
  const args = process.argv.slice(2);
  const shouldCleanup = args.includes('--cleanup');
  const dryRun = !args.includes('--no-dry-run');
  
  console.log('🧠 Starting Memory Assessment...\n');
  
  const assessment = new MemoryAssessment();
  
  try {
    // Generate assessment report
    const report = await assessment.analyzeProjectMemory();
    
    // Create detailed report file
    const reportContent = await assessment.generateMemoryReport();
    const reportPath = path.join(process.cwd(), 'MEMORY_ASSESSMENT_REPORT.md');
    await fs.writeFile(reportPath, reportContent);
    
    console.log('📊 Memory Assessment Complete!');
    console.log(`📁 Detailed report saved: ${reportPath}\n`);
    
    // Display summary
    console.log('📋 Summary:');
    console.log(`Total project size: ${formatBytes(report.totalSize)}`);
    console.log(`Potential savings: ${formatBytes(report.cleanupRecommendations.totalSavings)}`);
    console.log(`Files safe to delete: ${report.cleanupRecommendations.safeToDelete.length}`);
    console.log(`Files requiring review: ${report.cleanupRecommendations.requiresReview.length}\n`);
    
    // Top cleanup candidates
    if (report.cleanupRecommendations.safeToDelete.length > 0) {
      console.log('🗑 Top cleanup candidates:');
      report.cleanupRecommendations.safeToDelete.slice(0, 10).forEach(file => {
        console.log(`  - ${file.path} (${formatBytes(file.size)})`);
      });
      console.log('');
    }
    
    // Perform cleanup if requested
    if (shouldCleanup) {
      console.log(`🧹 ${dryRun ? 'DRY RUN' : 'ACTUAL'} Cleanup Starting...\n`);
      await assessment.performSafeCleanup(report, dryRun);
      
      if (dryRun) {
        console.log('\n💡 To perform actual cleanup, run with --no-dry-run flag');
      }
    } else {
      console.log('💡 To perform cleanup, run with --cleanup flag');
    }
    
  } catch (error) {
    console.error('❌ Memory assessment failed:', error);
    process.exit(1);
  }
}

function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}