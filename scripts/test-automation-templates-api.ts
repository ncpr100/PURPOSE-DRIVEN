/**
 * Test Automation Templates API
 * Diagnose why templates aren't loading in the frontend
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testTemplatesAPI() {
  console.log('=== AUTOMATION TEMPLATES API TEST ===\n');

  try {
    // Test 1: Raw template count
    const count = await prisma.automationRuleTemplate.count();
    console.log(`✅ Total templates in DB: ${count}\n`);

    // Test 2: Try the exact query from the API
    console.log('Testing API query...');
    const templates = await prisma.automationRuleTemplate.findMany({
      where: {
        isActive: true
      },
      orderBy: [
        { isSystemTemplate: 'desc' },
        { installCount: 'desc' },
        { name: 'asc' }
      ],
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        subcategory: true,
        icon: true,
        color: true,
        isSystemTemplate: true,
        isActive: true,
        isPublic: true,
        priorityLevel: true,
        businessHoursOnly: true,
        urgentMode24x7: true,
        installCount: true,
        lastUsedAt: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
        creator: {
          select: {
            id: true,
            name: true
          }
        },
      }
    });

    console.log(`✅ Query successful! Retrieved ${templates.length} templates\n`);

    // Test 3: Check for any templates with null creator
    const templatesWithNullCreator = templates.filter(t => !t.creator && t.createdBy);
    if (templatesWithNullCreator.length > 0) {
      console.log(`⚠️  WARNING: ${templatesWithNullCreator.length} templates have createdBy but no creator user found`);
      console.log('This could cause errors. Templates:');
      templatesWithNullCreator.forEach(t => {
        console.log(`  - ${t.name}`);
      });
      console.log();
    }

    // Test 4: Sample template details
    if (templates.length > 0) {
      console.log('Sample template:');
      const sample = templates[0];
      console.log(`  Name: ${sample.name}`);
      console.log(`  Category: ${sample.category}`);
      console.log(`  Icon: ${sample.icon || 'N/A'}`);
      console.log(`  Color: ${sample.color || 'N/A'}`);
      console.log(`  Creator: ${sample.creator?.name || 'System'}`);
      console.log(`  Install Count: ${sample.installCount}`);
      console.log(`  Tags: ${sample.tags.join(', ')}`);
      console.log();
    }

    // Test 5: Get categories
    const categories = await prisma.automationRuleTemplate.groupBy({
      by: ['category'],
      where: { isActive: true },
      _count: {
        category: true
      }
    });

    console.log('✅ Categories:');
    categories.forEach(cat => {
      console.log(`  - ${cat.category}: ${cat._count.category} templates`);
    });
    console.log();

    // Test 6: Check for prayer-related templates
    const prayerTemplates = templates.filter(t => 
      t.category === 'PRAYER_REQUEST' || 
      t.name.toLowerCase().includes('prayer') ||
      t.name.toLowerCase().includes('oración')
    );
    
    console.log(`✅ Prayer-related templates: ${prayerTemplates.length}`);
    prayerTemplates.forEach(t => {
      console.log(`  - ${t.name} (${t.category})`);
    });
    console.log();

    console.log('=== TEST COMPLETE ===');
    console.log('If all tests passed, the API should work correctly.');
    console.log('The error might be a frontend issue or authentication problem.');

  } catch (error) {
    console.error('\n❌ ERROR:', error);
    
    if (error instanceof Error) {
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
    }
  } finally {
    await prisma.$disconnect();
  }
}

testTemplatesAPI();
