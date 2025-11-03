#!/usr/bin/env node

/**
 * PHASE 2 ANALYTICS API TESTING SCRIPT
 * November 3, 2025
 * 
 * This script tests all analytics APIs to assess data quality
 * and identify areas for enhancement in Phase 2
 */

const testAnalyticsAPIs = async () => {
  const baseUrl = 'http://localhost:3000';
  const endpoints = [
    '/api/analytics/predictive',
    '/api/analytics/member-journey', 
    '/api/analytics/executive-report?type=monthly'
  ];

  console.log('🧪 PHASE 2: ANALYTICS API DATA QUALITY ASSESSMENT');
  console.log('================================================\n');

  for (const endpoint of endpoints) {
    console.log(`🔍 Testing: ${endpoint}`);
    try {
      const response = await fetch(`${baseUrl}${endpoint}`);
      console.log(`   Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`   Data Keys: ${Object.keys(data).join(', ')}`);
        console.log(`   Data Size: ${JSON.stringify(data).length} bytes`);
        
        // Quick data quality check
        const hasRealData = JSON.stringify(data).includes('0') || 
                          JSON.stringify(data).includes('null') ||
                          JSON.stringify(data).length < 500;
        
        console.log(`   Quality: ${hasRealData ? '⚠️  May need enhancement' : '✅ Looks comprehensive'}`);
      } else {
        console.log(`   ❌ Error: ${response.statusText}`);
      }
    } catch (error) {
      console.log(`   ❌ Failed: ${error.message}`);
    }
    console.log('');
  }

  console.log('📊 RECOMMENDATIONS FOR PHASE 2:');
  console.log('- Enhance API data calculations');
  console.log('- Implement real-time data aggregation');  
  console.log('- Add interactive chart components');
  console.log('- Optimize database queries for performance');
};

// Only run if called directly
if (require.main === module) {
  testAnalyticsAPIs().catch(console.error);
}

module.exports = { testAnalyticsAPIs };