// Investigate actual database gender values to find the real issue
// Run with: node scripts/investigate-gender-data.js

console.log('🔍 INVESTIGATING ACTUAL DATABASE GENDER VALUES...\n')

// This script will help us understand what's actually in the database
const investigationSQL = `
-- Check actual gender values in the database
SELECT 
  gender,
  COUNT(*) as count,
  CASE 
    WHEN gender IS NULL THEN 'NULL'
    WHEN gender = '' THEN 'EMPTY_STRING'
    WHEN LOWER(gender) = 'masculino' THEN 'MASCULINO_MATCH'
    WHEN LOWER(gender) = 'femenino' THEN 'FEMENINO_MATCH'
    WHEN LOWER(gender) = 'male' THEN 'MALE_MATCH'
    WHEN LOWER(gender) = 'female' THEN 'FEMALE_MATCH'
    ELSE 'OTHER: ' || gender
  END as category
FROM "Members" 
WHERE "churchId" = 'your-church-id' AND "isActive" = true
GROUP BY gender
ORDER BY count DESC;
`

console.log('📊 SQL Query to run in database:')
console.log(investigationSQL)

console.log('\n🔍 What we need to check:')
console.log('1. Exact gender values stored in database')
console.log('2. Case sensitivity issues (Masculino vs masculino)')  
console.log('3. Null vs empty string vs whitespace')
console.log('4. Unexpected gender values')
console.log('5. Church ID scoping issues')

console.log('\n💡 Possible issues:')
console.log('- Gender values might be "Masculino" (capitalized) but filter checks for "masculino"')
console.log('- Values might have extra whitespace')
console.log('- Different language variants (Male/Female vs Masculino/Femenino)')
console.log('- ChurchId mismatch between UI display and count API')

console.log('\n🎯 Next Steps:')
console.log('1. Run the SQL query above to see actual database values')
console.log('2. Check if gender matching logic handles all variations correctly')
console.log('3. Verify churchId is consistent between UI and API calls')
console.log('4. Test the count API with debug logging')

// Also check the current matching logic
console.log('\n🔧 Current Matching Logic Analysis:')
console.log('API checks for:')
console.log('- masculino: gender === "masculino" || gender === "male" || gender === "m"')
console.log('- femenino: gender === "femenino" || gender === "female" || gender === "f"')
console.log('- But what if database has "Masculino" (capitalized)?')

console.log('\n❓ Questions to answer:')
console.log('1. What exact values are in the "gender" column?')
console.log('2. Are they capitalized (Masculino/Femenino)?') 
console.log('3. Is churchId filtering working correctly?')
console.log('4. Is the count API being called with the right session?')

console.log('\n🚨 STOP CLAIMING FIXES UNTIL VERIFIED!')