// Test Bible version comparison after fix
const { freeBibleService } = require('./lib/services/free-bible-service.ts')

async function testComparison() {
  try {
    console.log('=== Testing Bible Version Comparison Fix ===')
    
    // Test the comparison method with the reference from the screenshot
    const verses = await freeBibleService.compareVerses('Judas 1:4', ['NVI', 'TLA'])
    
    console.log('Comparison Results:')
    verses.forEach(verse => {
      console.log(`\n[${verse.version}] ${verse.reference}`)
      console.log(`Text: ${verse.text}`)
    })
    
    console.log(`\nTotal versions found: ${verses.length}`)
    console.log('Test completed successfully!')
    
  } catch (error) {
    console.error('Test failed:', error.message)
  }
}

testComparison()