// Quick test script for the free Bible service
import { freeBibleService, FREE_BIBLE_VERSIONS } from '../lib/services/free-bible-service'

async function testFreeBibleService() {
  console.log('🧪 TESTING FREE BIBLE SERVICE')
  console.log('=' .repeat(50))

  // Test 1: Available Versions
  console.log('\n1. AVAILABLE VERSIONS:')
  console.log(`Found ${FREE_BIBLE_VERSIONS.length} versions:`)
  FREE_BIBLE_VERSIONS.slice(0, 5).forEach(version => {
    console.log(`  - ${version.name} (${version.id}) [${version.language}]`)
  })
  console.log(`  ... and ${FREE_BIBLE_VERSIONS.length - 5} more`)

  // Test 2: Get a single verse
  console.log('\n2. SINGLE VERSE LOOKUP:')
  try {
    const verse = await freeBibleService.getVerse('John 3:16', 'RVR1960')
    console.log(`✅ ${verse.reference}: "${verse.text.substring(0, 80)}..."`)
  } catch (error) {
    console.log(`❌ Error: ${error}`)
  }

  // Test 3: Compare versions
  console.log('\n3. VERSION COMPARISON:')
  try {
    const comparison = await freeBibleService.compareVersions('1 John 4:8', ['RVR1960', 'NVI', 'ESV'])
    console.log(`✅ Compared ${comparison.length} versions:`)
    comparison.forEach(v => {
      console.log(`  - ${v.version}: "${v.text.substring(0, 60)}..."`)
    })
  } catch (error) {
    console.log(`❌ Error: ${error}`)
  }

  // Test 4: Cross references
  console.log('\n4. CROSS REFERENCES:')
  try {
    const crossRefs = await freeBibleService.getCrossReferences('John 3:16', 'love')
    console.log(`✅ Found ${crossRefs.length} cross-references:`)
    crossRefs.slice(0, 3).forEach(ref => {
      console.log(`  - ${ref}`)
    })
  } catch (error) {
    console.log(`❌ Error: ${error}`)
  }

  // Test 5: Bible books
  console.log('\n5. BIBLE BOOKS:')
  const books = freeBibleService.getBibleBooks()
  console.log(`✅ Found ${books.length} books:`)
  console.log(`  - First: ${books[0].name} (${books[0].chapters} chapters)`)
  console.log(`  - Last: ${books[books.length - 1].name} (${books[books.length - 1].chapters} chapters)`)

  console.log('\n🎯 FREE BIBLE SERVICE TEST COMPLETED')
}

testFreeBibleService().catch(console.error)