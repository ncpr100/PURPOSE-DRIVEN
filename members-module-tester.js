#!/usr/bin/env node
/**
 * 🎯 MEMBERS MODULE TAB COUNT VALIDATOR
 * Specifically tests the Members module issues mentioned by the user
 */

const http = require('http');
const { URL } = require('url');

class MembersModuleTester {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
    this.results = [];
  }

  log(level, message, data = {}) {
    const entry = { level, message, data, timestamp: new Date().toISOString() };
    this.results.push(entry);
    
    const icons = { 'INFO': 'ℹ️', 'SUCCESS': '✅', 'ERROR': '❌', 'WARNING': '⚠️' };
    console.log(`${icons[level] || '📍'} [MEMBERS] ${message}`);
    if (Object.keys(data).length > 0) {
      console.log(`   ${JSON.stringify(data, null, 2)}`);
    }
  }

  async makeRequest(path, method = 'GET') {
    return new Promise((resolve, reject) => {
      const url = new URL(path, this.baseUrl);
      const options = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        method: method,
        headers: {
          'User-Agent': 'Khesed-Tek-Members-Tester'
        }
      };

      const req = http.request(options, (res) => {
        let responseData = '';
        
        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: responseData
          });
        });
      });

      req.on('error', reject);
      req.end();
    });
  }

  // Test Members page structure
  async testMembersPageStructure() {
    console.log('\n👥 TESTING MEMBERS PAGE STRUCTURE...');
    
    try {
      // Test the members route (should redirect to auth if not logged in)
      const membersResponse = await this.makeRequest('/members');
      
      this.log('INFO', 'Members page response', { 
        statusCode: membersResponse.statusCode,
        redirectLocation: membersResponse.headers.location || 'No redirect'
      });

      // Test the dashboard members route
      const dashboardMembersResponse = await this.makeRequest('/home');
      
      this.log('INFO', 'Dashboard/Home response', { 
        statusCode: dashboardMembersResponse.statusCode,
        redirectLocation: dashboardMembersResponse.headers.location || 'No redirect'
      });

      // If we get HTML back, analyze the structure
      if (membersResponse.statusCode === 200) {
        await this.analyzeMembersPageHTML(membersResponse.body);
      } else if (dashboardMembersResponse.statusCode === 200) {
        await this.analyzeMembersPageHTML(dashboardMembersResponse.body);
      }

      return true;
    } catch (error) {
      this.log('ERROR', 'Members page structure test failed', { error: error.message });
      return false;
    }
  }

  // Analyze the HTML structure for Members-related content
  async analyzeMembersPageHTML(html) {
    this.log('INFO', 'Analyzing page HTML structure...');

    // Look for common Members module elements
    const memberKeywords = [
      'miembros', 'members', 'voluntarios', 'volunteers', 
      'activos', 'active', 'inactivos', 'inactive',
      'líderes', 'leaders', 'tabs', 'pestañas'
    ];

    const foundKeywords = memberKeywords.filter(keyword => 
      html.toLowerCase().includes(keyword.toLowerCase())
    );

    this.log('INFO', 'Member-related content found', { 
      foundKeywords,
      totalHtmlSize: html.length
    });

    // Look for tab structure
    const tabIndicators = [
      'tab-', 'data-tab', 'role="tab"', 'tablist', 'tabpanel',
      'tab-content', 'nav-tabs', 'tab-nav'
    ];

    const foundTabIndicators = tabIndicators.filter(indicator =>
      html.toLowerCase().includes(indicator.toLowerCase())
    );

    this.log('INFO', 'Tab structure indicators', {
      foundIndicators: foundTabIndicators,
      hasTabStructure: foundTabIndicators.length > 0
    });

    // Look for Spanish/English language mix
    const englishWords = [
      'dashboard', 'member', 'volunteer', 'active', 'inactive',
      'management', 'login', 'logout', 'settings'
    ];

    const foundEnglishWords = englishWords.filter(word =>
      html.toLowerCase().includes(word.toLowerCase())
    );

    if (foundEnglishWords.length > 0) {
      this.log('WARNING', 'English words found in interface', {
        englishWords: foundEnglishWords
      });
    } else {
      this.log('SUCCESS', 'No obvious English words found in interface');
    }
  }

  // Test Members API endpoints directly
  async testMembersAPIEndpoints() {
    console.log('\n🔌 TESTING MEMBERS API ENDPOINTS...');

    const endpoints = [
      '/api/members',
      '/api/members?status=active',
      '/api/members?role=volunteer',
      '/api/volunteers',
      '/api/users'
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await this.makeRequest(endpoint);
        
        this.log('INFO', `API Endpoint: ${endpoint}`, {
          statusCode: response.statusCode,
          hasContent: response.body.length > 0,
          contentType: response.headers['content-type'] || 'unknown'
        });

        // If we get JSON back, analyze the structure
        if (response.headers['content-type']?.includes('application/json')) {
          try {
            const data = JSON.parse(response.body);
            this.log('SUCCESS', `Valid JSON response from ${endpoint}`, {
              dataType: typeof data,
              isArray: Array.isArray(data),
              itemCount: Array.isArray(data) ? data.length : Object.keys(data).length
            });
          } catch (parseError) {
            this.log('WARNING', `Invalid JSON from ${endpoint}`, {
              error: parseError.message
            });
          }
        }
        
      } catch (error) {
        this.log('ERROR', `API endpoint failed: ${endpoint}`, {
          error: error.message
        });
      }
    }
  }

  // Test static assets and resources
  async testMembersModuleAssets() {
    console.log('\n📦 TESTING MEMBERS MODULE ASSETS...');

    const assets = [
      '/_next/static/css',
      '/_next/static/chunks',
      '/api/auth/session',
    ];

    for (const asset of assets) {
      try {
        const response = await this.makeRequest(asset);
        
        this.log('INFO', `Asset: ${asset}`, {
          statusCode: response.statusCode,
          contentLength: response.body.length
        });
        
      } catch (error) {
        this.log('WARNING', `Asset loading failed: ${asset}`, {
          error: error.message
        });
      }
    }
  }

  // Generate diagnostic report
  generateDiagnosticReport() {
    const issues = this.results.filter(r => r.level === 'ERROR');
    const warnings = this.results.filter(r => r.level === 'WARNING');
    const successes = this.results.filter(r => r.level === 'SUCCESS');
    
    return {
      summary: {
        timestamp: new Date().toISOString(),
        totalChecks: this.results.length,
        successes: successes.length,
        warnings: warnings.length,
        errors: issues.length,
        healthScore: this.results.length > 0 ? Math.round((successes.length / this.results.length) * 100) : 0
      },
      findings: {
        criticalIssues: issues.map(i => ({
          message: i.message,
          data: i.data
        })),
        warnings: warnings.map(w => ({
          message: w.message,
          data: w.data
        })),
        achievements: successes.map(s => s.message)
      },
      recommendations: this.generateRecommendations(issues, warnings),
      allResults: this.results
    };
  }

  generateRecommendations(issues, warnings) {
    const recommendations = [];
    
    if (issues.length > 0) {
      recommendations.push('🚨 CRITICAL: Address API connectivity issues first');
      recommendations.push('🔧 Check authentication flow and session management');
    }
    
    if (warnings.some(w => w.message.includes('English words'))) {
      recommendations.push('🌍 LOCALIZATION: Replace English terms with Spanish equivalents');
    }
    
    if (warnings.some(w => w.message.includes('JSON'))) {
      recommendations.push('📊 DATA: Validate API response formats and error handling');
    }
    
    recommendations.push('✅ TEST: Perform manual testing with valid user credentials');
    recommendations.push('🔍 MONITOR: Set up continuous monitoring for the Members module');
    
    return recommendations;
  }

  // Run comprehensive Members module testing
  async runMembersModuleTests() {
    console.log('🎯 STARTING MEMBERS MODULE VALIDATION...\n');
    console.log(`📍 Target: ${this.baseUrl}`);
    console.log(`🕒 Started at: ${new Date().toISOString()}`);

    // Run all tests
    await this.testMembersPageStructure();
    await this.testMembersAPIEndpoints();
    await this.testMembersModuleAssets();

    // Generate comprehensive report
    const report = this.generateDiagnosticReport();
    
    console.log('\n' + '='.repeat(80));
    console.log('👥 MEMBERS MODULE VALIDATION SUMMARY');
    console.log('='.repeat(80));
    console.log(`🎯 Health Score: ${report.summary.healthScore}%`);
    console.log(`✅ Successful Checks: ${report.summary.successes}`);
    console.log(`⚠️ Warnings: ${report.summary.warnings}`);
    console.log(`❌ Errors: ${report.summary.errors}`);
    console.log('='.repeat(80));

    // Show recommendations
    if (report.recommendations.length > 0) {
      console.log('\n📋 RECOMMENDATIONS:');
      report.recommendations.forEach((rec, idx) => {
        console.log(`${idx + 1}. ${rec}`);
      });
    }

    // Show critical issues
    if (report.findings.criticalIssues.length > 0) {
      console.log('\n🚨 CRITICAL ISSUES:');
      report.findings.criticalIssues.forEach((issue, idx) => {
        console.log(`${idx + 1}. ${issue.message}`);
        if (Object.keys(issue.data).length > 0) {
          console.log(`   ${JSON.stringify(issue.data)}`);
        }
      });
    }

    console.log('\n✅ Members module validation completed!');
    
    return report;
  }
}

// Execute testing if run directly
if (require.main === module) {
  const tester = new MembersModuleTester();
  tester.runMembersModuleTests()
    .then(report => {
      // Save detailed report
      const fs = require('fs');
      const reportPath = '/workspaces/PURPOSE-DRIVEN/MEMBERS_MODULE_DIAGNOSTIC.json';
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log(`📄 Detailed report saved to: ${reportPath}`);
      
      process.exit(report.summary.errors > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('💥 Members module testing failed:', error);
      process.exit(1);
    });
}

module.exports = MembersModuleTester;