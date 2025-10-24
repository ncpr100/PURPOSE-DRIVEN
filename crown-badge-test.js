/**
 * CROWN BADGE TESTING UTILITY
 * 
 * This script generates volunteer recommendations to test the crown badge functionality.
 * The crown badge appears when volunteerRecommendations.length > 0
 */

async function generateRecommendations() {
  try {
    console.log('🔍 CROWN BADGE DEBUG: Generating recommendations...\n')
    
    const response = await fetch('/api/volunteer-matching', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ministryId: 'cmgu3beyw000478lti0qslomk', // Alabanza y Adoración
        maxRecommendations: 10
      })
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Recommendations generated successfully!')
      console.log('📊 Stats:', {
        recommendations: data.recommendations?.length || 0,
        qualifiedCandidates: data.stats?.qualifiedCandidates || 0,
        topRecommendations: data.stats?.topRecommendations || 0
      })
      console.log('\n🎯 Now try recruiting a member - crown badge should appear!')
    } else {
      console.error('❌ Failed to generate recommendations:', response.status)
      const errorText = await response.text()
      console.error('Error:', errorText)
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

// Auto-run if in browser console
if (typeof window !== 'undefined') {
  generateRecommendations()
} else {
  console.log('ℹ️  Run this in browser console to generate recommendations')
}

// Export for manual use
export { generateRecommendations }