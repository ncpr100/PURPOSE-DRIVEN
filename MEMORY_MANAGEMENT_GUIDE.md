# KHESED-TEK CMS Memory Management Guide

## Overview

This guide provides comprehensive instructions for memory assessment, cleanup, and best practices to maintain optimal system performance.

## 🎯 Quick Reference

### Available Commands

```bash
# Run memory assessment (read-only analysis)
npm run memory:assess

# Run cleanup script (removes temporary files)
npm run cleanup

# Test memory monitoring system
npm run cleanup:memory

# Full optimization (cleanup + optimized build)
npm run optimize
```

## 📊 Memory Assessment

The memory assessment script provides a comprehensive analysis of file storage without making any changes.

### Running Assessment

```bash
npm run memory:assess
```

### What It Analyzes

- **Temporary Files**: `.tmp`, `.bak`, `.old`, `.log` files
- **Test Files**: Test files outside the designated test directory
- **Archives**: `.zip` and other archive files
- **Screenshots/Attachments**: Image files that may be temporary
- **PDF Documents**: Large documentation files
- **Overall Breakdown**: Size and count by category

### Assessment Output

The script provides:
- Total analyzed size
- Breakdown by category with largest files
- Specific recommendations for cleanup
- Best practices for ongoing maintenance

## 🧹 Memory Cleanup

The cleanup script safely removes temporary files and build artifacts.

### Running Cleanup

```bash
npm run cleanup
```

### What Gets Cleaned

✅ **SAFE TO REMOVE:**
- TypeScript build info (`.tsbuildinfo`)
- Next.js cache (`.next/` directory)
- Build output (`dist/` directory)
- Temporary files (`*.tmp` in root directory only)
- Backup files (`*.bak`, `*.old`)
- Log files (`*.log` excluding node_modules)

⚠️ **NEVER REMOVED:**
- Source code files
- Configuration files
- Production assets
- Node modules dependencies
- Database files
- User-generated content

### Cleanup Phases

1. **Phase 1**: Build Artifacts Cleanup
   - Removes regenerable build files
   - Clears Next.js cache

2. **Phase 2**: Temporary Files Cleanup
   - Removes `.tmp`, `.bak`, `.old` files
   - Clears log files
   - Reports on screenshot/attachment files

3. **Phase 3**: Dependency Optimization
   - Cleans npm cache

## 🔍 Memory Monitoring

The memory monitoring system tracks memory usage in real-time during development.

### Automatic Monitoring

Memory monitoring automatically starts in development mode:

```javascript
// Automatically enabled in development
if (process.env.NODE_ENV === 'development') {
  memoryMonitor.startMonitoring();
}
```

### Manual Control

```javascript
import { memoryMonitor } from '@/lib/memory-monitor';

// Start monitoring
memoryMonitor.startMonitoring();

// Get current stats
const stats = memoryMonitor.getMemoryStats();
console.log(stats);

// Stop monitoring
memoryMonitor.stopMonitoring();
```

### Memory Threshold

- **Default Threshold**: 80% of heap memory
- **Check Interval**: 30 seconds
- **Auto-cleanup**: Triggered when threshold exceeded

## 📝 Best Practices

### 1. Regular Maintenance

Run cleanup regularly to prevent accumulation:

```bash
# Weekly or after major changes
npm run cleanup
```

### 2. Pre-Deployment Cleanup

Always run cleanup before deployment:

```bash
# Full optimization
npm run optimize
```

### 3. Monitor Large Files

Use assessment to track file sizes:

```bash
npm run memory:assess | grep "Largest files"
```

### 4. Prevent Temporary File Commits

The `.gitignore` file now includes:

```gitignore
# Temporary files
*.tmp
*.log
*.bak
*.old
*_results.tmp
```

### 5. External Storage for Large Assets

Consider using cloud storage for:
- User uploads
- Generated PDFs
- Screenshots and attachments
- Database backups

**Recommended Services:**
- AWS S3
- Cloudinary
- Google Cloud Storage
- Azure Blob Storage

## 🚨 Troubleshooting

### Issue: Build Fails After Cleanup

**Cause**: Critical files were accidentally removed

**Solution**:
```bash
# Reinstall dependencies
npm install

# Rebuild
npm run build
```

### Issue: High Memory Usage Persists

**Cause**: Large files or memory leaks

**Solution**:
```bash
# Run assessment to identify large files
npm run memory:assess

# Review recommendations
# Consider optimizing or moving large files
```

### Issue: Cleanup Script Fails

**Cause**: Permission issues or locked files

**Solution**:
```bash
# Make script executable
chmod +x scripts/memory-cleanup.sh

# Run with explicit bash
bash scripts/memory-cleanup.sh
```

## 🔐 Protocol Checks

Before any cleanup operation, the system verifies:

1. ✅ **Is this the right approach?**
   - Only removes regenerable files
   
2. ✅ **What are the repercussions?**
   - No data loss, improved performance
   
3. ✅ **Do we already have this?**
   - Checks for existing implementations
   
4. ✅ **Double-check work**
   - Verifies files before deletion
   
5. ✅ **Avoid new errors**
   - Excludes critical dependencies
   
6. ✅ **May need this later?**
   - Only removes temporary files
   
7. ✅ **Next steps**
   - Documents enhancement opportunities

## 📈 Enhancement Opportunities

### Future Improvements

1. **Automated Scheduling**
   - Cron job for regular cleanup
   - Pre-commit hooks for validation

2. **Cloud Storage Integration**
   - Automatic upload of large files
   - CDN integration for assets

3. **Advanced Analytics**
   - Memory usage trends
   - Performance metrics dashboard

4. **Log Rotation**
   - Automated log file management
   - Compression of old logs

5. **Docker Optimization**
   - Multi-stage builds
   - Layer caching strategies

## 📞 Support

For issues or questions:
- Check this guide first
- Review error messages carefully
- Run assessment before cleanup
- Contact development team if needed

## 🔄 Version History

- **v1.0.0** (2024-11-03)
  - Initial memory management system
  - Assessment and cleanup scripts
  - Automatic monitoring in development
  - Comprehensive documentation

---

**Remember**: Regular maintenance prevents memory issues. Run assessments periodically and cleanup before deployments.
