/**
 * Member Filter Data Diagnostic Script
 * 
 * Purpose: Check actual values in database for gender, maritalStatus, and birthDate
 * to help debug filter discrepancies
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkMemberFilterData() {
  console.log('🔍 MEMBER FILTER DATA DIAGNOSTIC\n')
  console.log('=' .repeat(60))

  try {
    // Get total member count
    const totalMembers = await prisma.member.count()
    console.log(`\n📊 Total Members: ${totalMembers}`)

    // Check gender distribution
    console.log('\n' + '='.repeat(60))
    console.log('👥 GENDER DISTRIBUTION')
    console.log('='.repeat(60))
    
    const genderCounts = await prisma.member.groupBy({
      by: ['gender'],
      _count: true,
    })

    console.log('\nGender Values Found:')
    genderCounts.forEach(({ gender, _count }) => {
      console.log(`  ${gender || '(null/empty)'}: ${_count} members`)
    })

    // Get sample of gender values to check exact formatting
    const genderSamples = await prisma.member.findMany({
      where: {
        gender: { not: null }
      },
      select: {
        gender: true,
      },
      take: 10,
    })
    
    if (genderSamples.length > 0) {
      console.log('\nSample Gender Values (exact strings):')
      const uniqueGenders = [...new Set(genderSamples.map(m => m.gender))]
      uniqueGenders.forEach(gender => {
        console.log(`  "${gender}" (length: ${gender?.length}, lowercase: "${gender?.toLowerCase()}")`)
      })
    }

    // Check marital status distribution
    console.log('\n' + '='.repeat(60))
    console.log('💑 MARITAL STATUS DISTRIBUTION')
    console.log('='.repeat(60))
    
    const maritalCounts = await prisma.member.groupBy({
      by: ['maritalStatus'],
      _count: true,
    })

    console.log('\nMarital Status Values Found:')
    maritalCounts.forEach(({ maritalStatus, _count }) => {
      console.log(`  ${maritalStatus || '(null/empty)'}: ${_count} members`)
    })

    // Get sample of marital status values
    const maritalSamples = await prisma.member.findMany({
      where: {
        maritalStatus: { not: null }
      },
      select: {
        maritalStatus: true,
      },
      take: 10,
    })
    
    if (maritalSamples.length > 0) {
      console.log('\nSample Marital Status Values (exact strings):')
      const uniqueStatuses = [...new Set(maritalSamples.map(m => m.maritalStatus))]
      uniqueStatuses.forEach(status => {
        console.log(`  "${status}" (length: ${status?.length})`)
      })
    }

    // Check birthDate distribution
    console.log('\n' + '='.repeat(60))
    console.log('🎂 BIRTH DATE DISTRIBUTION')
    console.log('='.repeat(60))
    
    const membersWithBirthDate = await prisma.member.count({
      where: {
        birthDate: { not: null }
      }
    })

    const membersWithoutBirthDate = await prisma.member.count({
      where: {
        birthDate: null
      }
    })

    console.log(`\nMembers with birthDate: ${membersWithBirthDate}`)
    console.log(`Members without birthDate: ${membersWithoutBirthDate}`)

    // Calculate age distribution for members with birthdate
    if (membersWithBirthDate > 0) {
      const membersWithDates = await prisma.member.findMany({
        where: {
          birthDate: { not: null }
        },
        select: {
          birthDate: true,
        }
      })

      const now = new Date()
      const ageBrackets = {
        '0-17': 0,
        '18-25': 0,
        '26-35': 0,
        '36-50': 0,
        '51+': 0,
      }

      membersWithDates.forEach(member => {
        if (member.birthDate) {
          const age = Math.floor((now.getTime() - member.birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
          
          if (age < 18) ageBrackets['0-17']++
          else if (age <= 25) ageBrackets['18-25']++
          else if (age <= 35) ageBrackets['26-35']++
          else if (age <= 50) ageBrackets['36-50']++
          else ageBrackets['51+']++
        }
      })

      console.log('\nAge Distribution:')
      Object.entries(ageBrackets).forEach(([bracket, count]) => {
        console.log(`  ${bracket} años: ${count} members`)
      })
    }

    // Check for data quality issues
    console.log('\n' + '='.repeat(60))
    console.log('⚠️  DATA QUALITY CHECKS')
    console.log('='.repeat(60))

    // Check for weird gender values
    const weirdGenders = await prisma.member.findMany({
      where: {
        AND: [
          { gender: { not: null } },
          { 
            gender: { 
              notIn: ['Masculino', 'Femenino', 'masculino', 'femenino', 'M', 'F', 'm', 'f'] 
            }
          }
        ]
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        gender: true,
      },
      take: 10,
    })

    if (weirdGenders.length > 0) {
      console.log('\n⚠️  Found members with unusual gender values:')
      weirdGenders.forEach(member => {
        console.log(`  ${member.firstName} ${member.lastName}: "${member.gender}"`)
      })
    } else {
      console.log('\n✅ All gender values look normal')
    }

    // Check for whitespace issues
    const gendersWithSpaces = await prisma.member.findMany({
      where: {
        OR: [
          { gender: { startsWith: ' ' } },
          { gender: { endsWith: ' ' } },
        ]
      },
      select: {
        id: true,
        firstName: true,
        gender: true,
      },
      take: 10,
    })

    if (gendersWithSpaces.length > 0) {
      console.log('\n⚠️  Found gender values with leading/trailing spaces:')
      gendersWithSpaces.forEach(member => {
        console.log(`  ${member.firstName}: "|${member.gender}|"`)
      })
    } else {
      console.log('✅ No whitespace issues in gender values')
    }

    console.log('\n' + '='.repeat(60))
    console.log('✅ DIAGNOSTIC COMPLETE')
    console.log('='.repeat(60) + '\n')

  } catch (error) {
    console.error('❌ Error running diagnostic:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the diagnostic
checkMemberFilterData()
  .then(() => {
    console.log('\n✅ Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  })
