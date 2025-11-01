/**
 * Memory Monitor Test Script
 * Tests the memory monitoring system
 */

import { memoryMonitor } from '../lib/memory-monitor';

async function testMemoryMonitor() {
  console.log('🧪 Testing Memory Monitor System');
  console.log('================================');
  
  // Get initial memory stats
  console.log('📊 Initial Memory Stats:');
  console.log(memoryMonitor.getMemoryStats());
  
  // Start monitoring for a short time
  memoryMonitor.startMonitoring();
  
  // Create some memory pressure for testing
  console.log('\n🔄 Creating memory pressure...');
  const testArrays: any[] = [];
  
  for (let i = 0; i < 1000; i++) {
    testArrays.push(new Array(1000).fill(`test-data-${i}`));
  }
  
  console.log('📈 Memory after allocation:');
  console.log(memoryMonitor.getMemoryStats());
  
  // Wait a bit to see monitoring in action
  await new Promise(resolve => setTimeout(resolve, 35000));
  
  // Clean up
  testArrays.length = 0;
  
  console.log('\n🧹 Memory after cleanup:');
  console.log(memoryMonitor.getMemoryStats());
  
  // Stop monitoring
  memoryMonitor.stopMonitoring();
  
  console.log('\n✅ Memory monitor test completed');
}

testMemoryMonitor().catch(console.error);