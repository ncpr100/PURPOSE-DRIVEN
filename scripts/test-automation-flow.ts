#!/usr/bin/env tsx

/**
 * AUTOMATION FLOW E2E TEST SCRIPT
 * 
 * Tests the complete automation system end-to-end:
 * 1. Prayer Request Automation (URGENT category)
 * 2. Visitor Check-In Automation (FIRST_TIME category)
 * 3. Retry/Fallback Logic Simulation
 * 4. Business Hours Configuration
 * 5. Escalation Notifications
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
}

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function section(title: string) {
  console.log('\n' + '='.repeat(80))
  log(title, 'cyan')
  console.log('='.repeat(80) + '\n')
}

async function checkPrerequisites() {
  section('📋 CHECKING PREREQUISITES')

  try {
    // Check database connection
    await prisma.$connect()
    log('✅ Database connection successful', 'green')

    // Check if we have at least one church
    const churches = await prisma.church.findMany({ take: 1 })
    if (churches.length === 0) {
      log('❌ No churches found in database. Please create a church first.', 'red')
      return null
    }
    log(`✅ Found church: ${churches[0].name} (${churches[0].id})`, 'green')

    // Check if we have at least one user
    const users = await prisma.user.findMany({ 
      where: { churchId: churches[0].id },
      take: 1 
    })
    if (users.length === 0) {
      log('❌ No users found for this church. Please create a user first.', 'red')
      return null
    }
    log(`✅ Found user: ${users[0].name || users[0].email} (${users[0].id})`, 'green')

    // Check for automation rules
    const rules = await prisma.automationRule.findMany({
      where: { 
        churchId: churches[0].id,
        isActive: true
      },
      take: 5
    })
    log(`📊 Found ${rules.length} active automation rules`, rules.length > 0 ? 'green' : 'yellow')
    
    if (rules.length === 0) {
      log('⚠️  No active automation rules found. Tests will demonstrate what WOULD happen.', 'yellow')
    } else {
      rules.forEach(rule => {
        log(`   - ${rule.name} (${rule.priorityLevel}, bypassApproval: ${rule.bypassApproval})`, 'blue')
      })
    }

    return { church: churches[0], user: users[0], rules }
  } catch (error) {
    log(`❌ Prerequisites check failed: ${error}`, 'red')
    return null
  }
}

async function testPrayerAutomation(churchId: string, userId: string) {
  section('🙏 TEST 1: PRAYER REQUEST AUTOMATION (URGENT)')

  try {
    log('Creating urgent prayer request...', 'blue')

    const prayerRequest = await prisma.prayerRequest.create({
      data: {
        churchId,
        requesterId: userId,
        category: 'URGENT',
        title: '[TEST] Urgent Prayer for Family Emergency',
        description: 'Test urgent prayer request to verify automation triggers. Please ignore this test entry.',
        prayerType: 'HEALING',
        isPublic: false,
        status: 'PENDING',
      }
    })

    log(`✅ Created prayer request: ${prayerRequest.id}`, 'green')
    log(`   Title: ${prayerRequest.title}`, 'cyan')
    log(`   Category: ${prayerRequest.category}`, 'cyan')
    log(`   Created: ${prayerRequest.createdAt.toISOString()}`, 'cyan')

    // Wait a moment for automation to trigger
    log('\n⏳ Waiting 2 seconds for automation to process...', 'yellow')
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Check if automation executed
    const executions = await prisma.automationExecution.findMany({
      where: {
        entityId: prayerRequest.id,
        entityType: 'PRAYER_REQUEST'
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    })

    if (executions.length > 0) {
      log(`\n✅ Found ${executions.length} automation execution(s):`, 'green')
      executions.forEach((exec, i) => {
        log(`   ${i + 1}. Status: ${exec.status}, Rule: ${exec.automationRuleId}`, 'cyan')
        log(`      Started: ${exec.startedAt?.toISOString() || 'N/A'}`, 'cyan')
        log(`      Completed: ${exec.completedAt?.toISOString() || 'N/A'}`, 'cyan')
        if (exec.error) {
          log(`      Error: ${exec.error}`, 'red')
        }
      })
    } else {
      log('\n⚠️  No automation executions found.', 'yellow')
      log('   This could mean:', 'yellow')
      log('   - No active automation rules for PRAYER_REQUEST_URGENT trigger', 'yellow')
      log('   - PrayerAutomationService.processPrayerRequest() not called', 'yellow')
      log('   - Automation conditions did not match', 'yellow')
    }

    // Check for follow-up tasks created
    const followUps = await prisma.visitorFollowUp.findMany({
      where: {
        notes: {
          contains: prayerRequest.id
        }
      },
      take: 5
    })

    if (followUps.length > 0) {
      log(`\n📋 Found ${followUps.length} follow-up task(s) created (manual approval required):`, 'cyan')
      followUps.forEach((task, i) => {
        log(`   ${i + 1}. Status: ${task.status}, Priority: ${task.priority}`, 'cyan')
      })
    }

    return { success: true, prayerRequestId: prayerRequest.id, executions: executions.length }
  } catch (error) {
    log(`❌ Prayer automation test failed: ${error}`, 'red')
    console.error(error)
    return { success: false, error }
  }
}

async function testVisitorAutomation(churchId: string, userId: string) {
  section('👥 TEST 2: VISITOR CHECK-IN AUTOMATION (FIRST-TIME)')

  try {
    log('Creating first-time visitor check-in...', 'blue')

    const checkIn = await prisma.checkIn.create({
      data: {
        churchId,
        checkInDate: new Date(),
        visitorName: 'Test Visitor - First Time',
        visitorEmail: 'test.visitor.firsttime@example.com',
        visitorPhone: '+1234567890',
        source: 'MANUAL',
        notes: 'Test check-in to verify visitor automation. Please ignore this test entry.',
      }
    })

    log(`✅ Created check-in: ${checkIn.id}`, 'green')
    log(`   Visitor: ${checkIn.visitorName}`, 'cyan')
    log(`   Email: ${checkIn.visitorEmail}`, 'cyan')
    log(`   Phone: ${checkIn.visitorPhone}`, 'cyan')
    log(`   Date: ${checkIn.checkInDate.toISOString()}`, 'cyan')

    // Wait a moment for automation to trigger
    log('\n⏳ Waiting 2 seconds for automation to process...', 'yellow')
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Check if VisitorProfile was created
    const visitorProfile = await prisma.visitorProfile.findFirst({
      where: {
        OR: [
          { email: checkIn.visitorEmail },
          { phone: checkIn.visitorPhone }
        ]
      }
    })

    if (visitorProfile) {
      log(`\n✅ VisitorProfile created/updated:`, 'green')
      log(`   ID: ${visitorProfile.id}`, 'cyan')
      log(`   Category: ${visitorProfile.category}`, 'cyan')
      log(`   Visit Count: ${visitorProfile.visitCount}`, 'cyan')
      log(`   First Visit: ${visitorProfile.firstVisit.toISOString()}`, 'cyan')
      log(`   Last Visit: ${visitorProfile.lastVisit.toISOString()}`, 'cyan')
    } else {
      log('\n⚠️  No VisitorProfile found. VisitorAutomationService may not have been called.', 'yellow')
    }

    // Check if automation executed
    const executions = await prisma.automationExecution.findMany({
      where: {
        entityId: checkIn.id,
        entityType: 'VISITOR_CHECK_IN'
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    })

    if (executions.length > 0) {
      log(`\n✅ Found ${executions.length} automation execution(s):`, 'green')
      executions.forEach((exec, i) => {
        log(`   ${i + 1}. Status: ${exec.status}, Rule: ${exec.automationRuleId}`, 'cyan')
        if (exec.error) {
          log(`      Error: ${exec.error}`, 'red')
        }
      })
    } else {
      log('\n⚠️  No automation executions found.', 'yellow')
      log('   This could mean:', 'yellow')
      log('   - No active automation rules for VISITOR_FIRST_TIME trigger', 'yellow')
      log('   - VisitorAutomationService.processVisitor() not called', 'yellow')
      log('   - Automation conditions did not match', 'yellow')
    }

    // Check for follow-up tasks
    const followUps = await prisma.visitorFollowUp.findMany({
      where: {
        visitorName: checkIn.visitorName
      },
      take: 5
    })

    if (followUps.length > 0) {
      log(`\n📋 Found ${followUps.length} follow-up task(s):`, 'cyan')
      followUps.forEach((task, i) => {
        log(`   ${i + 1}. Status: ${task.status}, Type: ${task.followUpType}, Method: ${task.contactMethod}`, 'cyan')
      })
    }

    return { success: true, checkInId: checkIn.id, executions: executions.length, profileCreated: !!visitorProfile }
  } catch (error) {
    log(`❌ Visitor automation test failed: ${error}`, 'red')
    console.error(error)
    return { success: false, error }
  }
}

async function testRetryLogic(churchId: string) {
  section('🔄 TEST 3: RETRY LOGIC & FALLBACK CHANNELS')

  try {
    log('Checking automation rules with retry configuration...', 'blue')

    const rulesWithRetry = await prisma.automationRule.findMany({
      where: {
        churchId,
        isActive: true,
        retryConfig: { not: null }
      }
    })

    if (rulesWithRetry.length > 0) {
      log(`✅ Found ${rulesWithRetry.length} rule(s) with retry configuration:`, 'green')
      rulesWithRetry.forEach(rule => {
        log(`   - ${rule.name}`, 'cyan')
        log(`     Retry Config: ${JSON.stringify(rule.retryConfig)}`, 'cyan')
        log(`     Fallback Channels: ${JSON.stringify(rule.fallbackChannels)}`, 'cyan')
      })
    } else {
      log('⚠️  No rules with retry configuration found.', 'yellow')
      log('   To test retry logic:', 'yellow')
      log('   1. Create an automation rule', 'yellow')
      log('   2. Set retryConfig: { maxRetries: 3, delays: [60, 300, 900] }', 'yellow')
      log('   3. Set fallbackChannels: ["EMAIL", "PUSH_NOTIFICATION"]', 'yellow')
    }

    // Check for failed executions that triggered retries
    const failedExecutions = await prisma.automationExecution.findMany({
      where: {
        churchId,
        status: { in: ['FAILED', 'RETRYING'] }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    if (failedExecutions.length > 0) {
      log(`\n📊 Found ${failedExecutions.length} failed/retrying execution(s):`, 'cyan')
      failedExecutions.forEach((exec, i) => {
        log(`   ${i + 1}. Status: ${exec.status}, Attempts: ${exec.retryCount || 0}`, 'cyan')
        log(`      Rule: ${exec.automationRuleId}`, 'cyan')
        log(`      Error: ${exec.error?.slice(0, 100)}...`, 'red')
      })
    } else {
      log('\n✅ No failed executions found (good sign!)', 'green')
    }

    return { success: true, rulesWithRetry: rulesWithRetry.length, failedExecutions: failedExecutions.length }
  } catch (error) {
    log(`❌ Retry logic test failed: ${error}`, 'red')
    return { success: false, error }
  }
}

async function testBusinessHours(churchId: string) {
  section('🕐 TEST 4: BUSINESS HOURS CONFIGURATION')

  try {
    log('Checking automation rules with business hours configuration...', 'blue')

    const rulesWithBusinessHours = await prisma.automationRule.findMany({
      where: {
        churchId,
        isActive: true,
        businessHoursOnly: true
      }
    })

    if (rulesWithBusinessHours.length > 0) {
      log(`✅ Found ${rulesWithBusinessHours.length} rule(s) with business hours:`, 'green')
      rulesWithBusinessHours.forEach(rule => {
        log(`   - ${rule.name}`, 'cyan')
        log(`     Business Hours Config: ${JSON.stringify(rule.businessHoursConfig)}`, 'cyan')
        log(`     Urgent Mode 24x7: ${rule.urgentMode24x7}`, 'cyan')
      })
    } else {
      log('⚠️  No rules with business hours configuration found.', 'yellow')
    }

    // Check current time
    const now = new Date()
    const hour = now.getHours()
    log(`\n⏰ Current time: ${now.toLocaleString()} (Hour: ${hour})`, 'cyan')
    
    if (hour >= 8 && hour <= 21) {
      log('✅ Currently within typical business hours (8 AM - 9 PM)', 'green')
    } else {
      log('⚠️  Currently OUTSIDE typical business hours', 'yellow')
      log('   Automation with businessHoursOnly=true would be deferred', 'yellow')
    }

    return { success: true, rulesWithBusinessHours: rulesWithBusinessHours.length, currentHour: hour }
  } catch (error) {
    log(`❌ Business hours test failed: ${error}`, 'red')
    return { success: false, error }
  }
}

async function testEscalation(churchId: string) {
  section('📈 TEST 5: ESCALATION CONFIGURATION')

  try {
    log('Checking automation rules with escalation configuration...', 'blue')

    const rulesWithEscalation = await prisma.automationRule.findMany({
      where: {
        churchId,
        isActive: true,
        escalationConfig: { not: null }
      }
    })

    if (rulesWithEscalation.length > 0) {
      log(`✅ Found ${rulesWithEscalation.length} rule(s) with escalation:`, 'green')
      rulesWithEscalation.forEach(rule => {
        log(`   - ${rule.name} (Priority: ${rule.priorityLevel})`, 'cyan')
        log(`     Escalation Config: ${JSON.stringify(rule.escalationConfig)}`, 'cyan')
      })

      // Show escalation timing by priority
      log('\n⏱️  Escalation Timing by Priority Level:', 'blue')
      log('   🚨 URGENT: Escalate after 15 minutes', 'red')
      log('   ⚡ HIGH: Escalate after 2 hours', 'yellow')
      log('   📊 NORMAL: Escalate after 24 hours', 'blue')
      log('   ⏸️  LOW: No escalation', 'cyan')
    } else {
      log('⚠️  No rules with escalation configuration found.', 'yellow')
    }

    // Check for executions that should have escalated
    const oldExecutions = await prisma.automationExecution.findMany({
      where: {
        churchId,
        status: 'PENDING',
        createdAt: {
          lt: new Date(Date.now() - 15 * 60 * 1000) // Older than 15 minutes
        }
      },
      take: 10
    })

    if (oldExecutions.length > 0) {
      log(`\n⚠️  Found ${oldExecutions.length} old pending execution(s) that may need escalation:`, 'yellow')
      oldExecutions.forEach((exec, i) => {
        const ageMinutes = Math.floor((Date.now() - exec.createdAt.getTime()) / (1000 * 60))
        log(`   ${i + 1}. Age: ${ageMinutes} minutes, Rule: ${exec.automationRuleId}`, 'cyan')
      })
    } else {
      log('\n✅ No old pending executions found', 'green')
    }

    return { success: true, rulesWithEscalation: rulesWithEscalation.length, oldExecutions: oldExecutions.length }
  } catch (error) {
    log(`❌ Escalation test failed: ${error}`, 'red')
    return { success: false, error }
  }
}

async function generateSummary(results: any) {
  section('📊 TEST SUMMARY')

  const allSuccess = Object.values(results).every((r: any) => r?.success !== false)

  if (allSuccess) {
    log('✅ ALL TESTS COMPLETED SUCCESSFULLY!', 'green')
  } else {
    log('⚠️  SOME TESTS FAILED OR HAD WARNINGS', 'yellow')
  }

  console.log('\nDetailed Results:')
  console.log('─'.repeat(80))
  
  if (results.prayer) {
    log(`\n🙏 Prayer Automation:`, 'cyan')
    log(`   Success: ${results.prayer.success ? '✅' : '❌'}`, results.prayer.success ? 'green' : 'red')
    log(`   Executions Found: ${results.prayer.executions || 0}`, 'cyan')
  }

  if (results.visitor) {
    log(`\n👥 Visitor Automation:`, 'cyan')
    log(`   Success: ${results.visitor.success ? '✅' : '❌'}`, results.visitor.success ? 'green' : 'red')
    log(`   Executions Found: ${results.visitor.executions || 0}`, 'cyan')
    log(`   Profile Created: ${results.visitor.profileCreated ? '✅' : '❌'}`, results.visitor.profileCreated ? 'green' : 'yellow')
  }

  if (results.retry) {
    log(`\n🔄 Retry Logic:`, 'cyan')
    log(`   Rules with Retry Config: ${results.retry.rulesWithRetry || 0}`, 'cyan')
    log(`   Failed Executions: ${results.retry.failedExecutions || 0}`, 'cyan')
  }

  if (results.businessHours) {
    log(`\n🕐 Business Hours:`, 'cyan')
    log(`   Rules with Business Hours: ${results.businessHours.rulesWithBusinessHours || 0}`, 'cyan')
    log(`   Current Hour: ${results.businessHours.currentHour}`, 'cyan')
  }

  if (results.escalation) {
    log(`\n📈 Escalation:`, 'cyan')
    log(`   Rules with Escalation: ${results.escalation.rulesWithEscalation || 0}`, 'cyan')
    log(`   Old Pending Executions: ${results.escalation.oldExecutions || 0}`, 'cyan')
  }

  console.log('\n' + '─'.repeat(80))
  
  log('\n📝 RECOMMENDATIONS:', 'magenta')
  
  if (!results.prayer?.executions && !results.visitor?.executions) {
    log('\n⚠️  No automation executions found. To enable automation:', 'yellow')
    log('   1. Go to /automation-rules/templates', 'yellow')
    log('   2. Activate at least 3 templates (Prayer + Visitor)', 'yellow')
    log('   3. Ensure bypassApproval is set correctly', 'yellow')
    log('   4. Re-run this test script', 'yellow')
  }

  if (!results.retry?.rulesWithRetry) {
    log('\n💡 Consider adding retry configuration to your rules:', 'cyan')
    log('   retryConfig: { maxRetries: 3, delays: [60, 300, 900] }', 'cyan')
    log('   fallbackChannels: ["EMAIL", "PUSH_NOTIFICATION"]', 'cyan')
  }

  if (!results.escalation?.rulesWithEscalation) {
    log('\n💡 Consider adding escalation for urgent requests:', 'cyan')
    log('   escalationConfig: { enabled: true, delayMinutes: 15, notifyUserIds: [...] }', 'cyan')
  }

  log('\n🚀 Next Steps:', 'magenta')
  log('   1. Review automation execution logs in the database', 'cyan')
  log('   2. Check communication service logs (Twilio, Mailgun)', 'cyan')
  log('   3. Build admin dashboard to monitor executions', 'cyan')
  log('   4. Test with real phone numbers and emails', 'cyan')
  log('   5. Adjust retry/fallback configuration based on results', 'cyan')
}

async function main() {
  try {
    log('🧪 AUTOMATION FLOW E2E TEST SUITE', 'magenta')
    log('Testing complete automation system from trigger to execution\n', 'cyan')

    const prerequisites = await checkPrerequisites()
    if (!prerequisites) {
      log('\n❌ Prerequisites not met. Exiting.', 'red')
      process.exit(1)
    }

    const results: any = {}

    // Run all tests
    results.prayer = await testPrayerAutomation(prerequisites.church.id, prerequisites.user.id)
    results.visitor = await testVisitorAutomation(prerequisites.church.id, prerequisites.user.id)
    results.retry = await testRetryLogic(prerequisites.church.id)
    results.businessHours = await testBusinessHours(prerequisites.church.id)
    results.escalation = await testEscalation(prerequisites.church.id)

    // Generate summary
    await generateSummary(results)

    log('\n✅ Test suite completed!', 'green')
  } catch (error) {
    log(`\n❌ Fatal error: ${error}`, 'red')
    console.error(error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
