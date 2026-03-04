#!/usr/bin/env node
/**
 * 🔍 SIMPLIFIED SYSTEM VALIDATION TEST
 * Focuses on the core issues mentioned by the user
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');

class SystemValidator {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
    this.results = [];
    this.cookies = '';
  }

  log(level, message, data = {}) {
    const entry = { level, message, data, timestamp: new Date().toISOString() };
    this.results.push(entry);
    
    const icons = { 'INFO': 'ℹ️', 'SUCCESS': '✅', 'ERROR': '❌', 'WARNING': '⚠️' };
    console.log(`${icons[level] || '📍'} ${message}`);
    if (Object.keys(data).length > 0) {
      console.log(`   ${JSON.stringify(data, null, 2)}`);
    }
  }

  // Simple HTTP request helper
  async makeRequest(path, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
      const url = new URL(path, this.baseUrl);
      const options = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        method: method,
        headers: {
          'User-Agent': 'Khesed-Tek-Testing-Agent',
          ...(this.cookies && { 'Cookie': this.cookies }),
          ...(data && { 'Content-Type': 'application/json' })
        }
      };

      if (data) {
        options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(data));
      }

      const req = http.request(options, (res) => {
        let responseData = '';
        
        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          // Extract cookies from response if present
          if (res.headers['set-cookie']) {
            this.cookies = res.headers['set-cookie'].join('; ');
          }

          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: responseData
          });
        });
      });

      req.on('error', reject);

      if (data) {
        req.write(JSON.stringify(data));
      }

      req.end();
    });
  }

  // Test basic server connectivity
  async testServerConnectivity() {
    console.log('\n🔌 TESTING SERVER CONNECTIVITY...');
    
    try {
      const response = await this.makeRequest('/');
      
      if (response.statusCode >= 200 && response.statusCode < 400) {
        this.log('SUCCESS', 'Server is running and accessible', { 
          statusCode: response.statusCode,
          serverResponse: response.body.substring(0, 100) + '...'
        });
        return true;
      } else {
        this.log('ERROR', 'Server returned unexpected status', { 
          statusCode: response.statusCode 
        });
        return false;
      }
    } catch (error) {
      this.log('ERROR', 'Server connectivity failed', { error: error.message });
      return false;
    }
  }

  // Test sign-in page accessibility
  async testSignInPageAccess() {
    console.log('\n🔐 TESTING SIGN-IN PAGE...');
    
    try {
      const response = await this.makeRequest('/auth/signin');
      
      if (response.statusCode === 200) {
        const hasLoginForm = response.body.includes('name="email"') && 
                           response.body.includes('name="password"');
        
        if (hasLoginForm) {
          this.log('SUCCESS', 'Sign-in page loads with proper form fields');
          return true;
        } else {
          this.log('WARNING', 'Sign-in page loads but missing form fields');
          return false;
        }
      } else {
        this.log('ERROR', 'Sign-in page not accessible', { statusCode: response.statusCode });
        return false;
      }
    } catch (error) {
      this.log('ERROR', 'Sign-in page test failed', { error: error.message });
      return false;
    }
  }

  // Test protected dashboard access (should redirect to login)
  async testDashboardProtection() {
    console.log('\n🛡️ TESTING DASHBOARD PROTECTION...');
    
    try {
      const response = await this.makeRequest('/home');
      
      if (response.statusCode === 302 || response.statusCode === 401) {
        this.log('SUCCESS', 'Dashboard properly protected (redirects unauthenticated users)', {
          statusCode: response.statusCode,
          redirectLocation: response.headers.location || 'Not specified'
        });
        return true;
      } else if (response.statusCode === 200) {
        this.log('WARNING', 'Dashboard accessible without authentication - potential security issue');
        return false;
      } else {
        this.log('ERROR', 'Unexpected dashboard response', { statusCode: response.statusCode });
        return false;
      }
    } catch (error) {
      this.log('ERROR', 'Dashboard protection test failed', { error: error.message });
      return false;
    }
  }

  // Test Members API endpoint (should require auth)
  async testMembersAPIProtection() {
    console.log('\n👥 TESTING MEMBERS API PROTECTION...');
    
    try {
      const response = await this.makeRequest('/api/members');
      
      if (response.statusCode === 401 || response.statusCode === 403) {
        this.log('SUCCESS', 'Members API properly protected (requires authentication)', {
          statusCode: response.statusCode
        });
        return true;
      } else if (response.statusCode === 200) {
        this.log('WARNING', 'Members API accessible without authentication - potential security issue');
        
        // Check if it returns actual data
        try {
          const apiData = JSON.parse(response.body);
          this.log('INFO', 'API returned data without auth', { 
            dataStructure: typeof apiData,
            hasData: Array.isArray(apiData) ? apiData.length > 0 : Object.keys(apiData).length > 0
          });
        } catch (e) {
          this.log('INFO', 'API returned non-JSON response');
        }
        
        return false;
      } else {
        this.log('WARNING', 'Unexpected Members API response', { statusCode: response.statusCode });
        return false;
      }
    } catch (error) {
      this.log('ERROR', 'Members API test failed', { error: error.message });
      return false;
    }
  }

  // Test if Spanish language is consistent across public pages
  async testLanguageConsistency() {
    console.log('\n🌍 TESTING LANGUAGE CONSISTENCY...');
    
    try {
      // Test the main landing page
      const response = await this.makeRequest('/');
      
      if (response.statusCode === 200) {
        const html = response.body.toLowerCase();
        
        // Check for English words that should be Spanish
        const englishWords = [
          'login', 'sign in', 'member', 'management', 'dashboard',
          'volunteer', 'donate', 'prayer request'
        ];
        
        const spanishWords = [
          'iniciar sesión', 'miembro', 'gestión', 'panel', 
          'voluntario', 'donar', 'petición de oración'
        ];
        
        const foundEnglishWords = englishWords.filter(word => html.includes(word));
        const foundSpanishWords = spanishWords.filter(word => html.includes(word));
        
        if (foundEnglishWords.length === 0) {
          this.log('SUCCESS', 'No English words found on main page');
          return true;
        } else {
          this.log('WARNING', 'English words found in Spanish interface', {
            englishWords: foundEnglishWords,
            spanishWords: foundSpanishWords
          });
          return false;
        }
      } else {
        this.log('ERROR', 'Could not access main page for language test', { 
          statusCode: response.statusCode 
        });
        return false;
      }
    } catch (error) {
      this.log('ERROR', 'Language consistency test failed', { error: error.message });
      return false;
    }
  }

  // Test Super Admin platform access
  async testSuperAdminPlatformAccess() {
    console.log('\n👑 TESTING SUPER ADMIN PLATFORM ACCESS...');
    
    try {
      const response = await this.makeRequest('/platform');
      
      if (response.statusCode === 302 || response.statusCode === 401) {
        this.log('SUCCESS', 'Platform properly protected (redirects unauthenticated users)', {
          statusCode: response.statusCode
        });
        return true;
      } else if (response.statusCode === 200) {
        this.log('WARNING', 'Platform accessible without authentication - potential security issue');
        return false;
      } else {
        this.log('ERROR', 'Unexpected platform response', { statusCode: response.statusCode });
        return false;
      }
    } catch (error) {
      this.log('ERROR', 'Super Admin platform test failed', { error: error.message });
      return false;
    }
  }

  // Test NextAuth.js endpoints exist
  async testNextAuthEndpoints() {
    console.log('\n🔐 TESTING NEXTAUTH ENDPOINTS...');
    
    const endpoints = [
      '/api/auth/signin',
      '/api/auth/signout', 
      '/api/auth/session',
      '/api/auth/providers'
    ];
    
    let allWorking = true;
    
    for (const endpoint of endpoints) {
      try {
        const response = await this.makeRequest(endpoint);
        
        if (response.statusCode >= 200 && response.statusCode < 400) {
          this.log('SUCCESS', `NextAuth endpoint working: ${endpoint}`, { 
            statusCode: response.statusCode 
          });
        } else {
          this.log('WARNING', `NextAuth endpoint issue: ${endpoint}`, { 
            statusCode: response.statusCode 
          });
          allWorking = false;
        }
      } catch (error) {
        this.log('ERROR', `NextAuth endpoint failed: ${endpoint}`, { error: error.message });
        allWorking = false;
      }
    }
    
    return allWorking;
  }

  // Generate comprehensive validation report
  generateReport() {
    const issues = this.results.filter(r => r.level === 'ERROR');
    const warnings = this.results.filter(r => r.level === 'WARNING');
    const successes = this.results.filter(r => r.level === 'SUCCESS');
    
    return {
      summary: {
        totalTests: this.results.length,
        successes: successes.length,
        warnings: warnings.length,
        errors: issues.length,
        healthScore: Math.round((successes.length / this.results.length) * 100)
      },
      issues: issues.map(i => ({
        message: i.message,
        data: i.data,
        timestamp: i.timestamp
      })),
      warnings: warnings.map(w => ({
        message: w.message,
        data: w.data,
        timestamp: w.timestamp
      })),
      allResults: this.results
    };
  }

  // Run all validation tests
  async runValidation() {
    console.log('🚀 STARTING SYSTEM VALIDATION...\n');
    console.log(`📍 Target: ${this.baseUrl}`);
    console.log(`🕒 Started at: ${new Date().toISOString()}`);

    // Core system tests
    const serverOk = await this.testServerConnectivity();
    if (!serverOk) {
      console.log('\n💥 Server not accessible - aborting remaining tests');
      return this.generateReport();
    }

    await this.testSignInPageAccess();
    await this.testDashboardProtection();
    await this.testMembersAPIProtection();
    await this.testLanguageConsistency();
    await this.testSuperAdminPlatformAccess();
    await this.testNextAuthEndpoints();

    // Generate final report
    const report = this.generateReport();
    
    console.log('\n' + '='.repeat(80));
    console.log('📊 SYSTEM VALIDATION SUMMARY');
    console.log('='.repeat(80));
    console.log(`🎯 Health Score: ${report.summary.healthScore}%`);
    console.log(`✅ Successful Tests: ${report.summary.successes}`);
    console.log(`⚠️ Warnings: ${report.summary.warnings}`);
    console.log(`❌ Errors: ${report.summary.errors}`);
    console.log('='.repeat(80));

    // Show critical issues
    if (report.issues.length > 0) {
      console.log('\n🚨 CRITICAL ISSUES FOUND:');
      report.issues.forEach((issue, idx) => {
        console.log(`${idx + 1}. ${issue.message}`);
        if (Object.keys(issue.data).length > 0) {
          console.log(`   ${JSON.stringify(issue.data)}`);
        }
      });
    }

    // Show warnings
    if (report.warnings.length > 0) {
      console.log('\n⚠️ WARNINGS:');
      report.warnings.forEach((warning, idx) => {
        console.log(`${idx + 1}. ${warning.message}`);
        if (Object.keys(warning.data).length > 0) {
          console.log(`   ${JSON.stringify(warning.data)}`);
        }
      });
    }

    console.log('\n✅ System validation completed!');
    
    return report;
  }
}

// Execute validation if run directly
if (require.main === module) {
  const validator = new SystemValidator();
  validator.runValidation()
    .then(report => {
      // Save detailed report
      const fs = require('fs');
      const reportPath = '/workspaces/PURPOSE-DRIVEN/SYSTEM_VALIDATION_REPORT.json';
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log(`📄 Detailed report saved to: ${reportPath}`);
      
      // Exit with error code if critical issues found
      process.exit(report.summary.errors > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('💥 System validation failed:', error);
      process.exit(1);
    });
}

module.exports = SystemValidator;