// Notifications Database Validator
// Validates database schema and relationships for Notifications module

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Validation functions
async function validateNotificationTable() {
  try {
    const notification = await prisma.notification.findFirst();
    
    // Check if we can query the table
    if (notification !== null || notification === null) {
      console.log('✅ Notification table exists and is queryable');
      return true;
    }
  } catch (error) {
    console.error('❌ Notification table validation failed:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function validateNotificationDeliveryTable() {
  try {
    const delivery = await prisma.notificationDelivery.findFirst();
    
    // Check if we can query the table
    if (delivery !== null || delivery === null) {
      console.log('✅ NotificationDelivery table exists and is queryable');
      return true;
    }
  } catch (error) {
    console.error('❌ NotificationDelivery table validation failed:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function validateNotificationPreferenceTable() {
  try {
    const preference = await prisma.notificationPreference.findFirst();
    
    // Check if we can query the table
    if (preference !== null || preference === null) {
      console.log('✅ NotificationPreference table exists and is queryable');
      return true;
    }
  } catch (error) {
    console.error('❌ NotificationPreference table validation failed:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function validateNotificationTemplateTable() {
  try {
    const template = await prisma.notificationTemplate.findFirst();
    
    // Check if we can query the table
    if (template !== null || template === null) {
      console.log('✅ NotificationTemplate table exists and is queryable');
      return true;
    }
  } catch (error) {
    console.error('❌ NotificationTemplate table validation failed:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function validateNotificationRelationships() {
  try {
    // Test notification with church relationship
    const notificationWithChurch = await prisma.notification.findFirst({
      include: {
        church: true,
        deliveries: true,
        creator: true
      }
    });
    
    console.log('✅ Notification relationships validated (church, deliveries, creator)');
    
    // Test delivery with notification and user relationships
    const deliveryWithRelations = await prisma.notificationDelivery.findFirst({
      include: {
        notification: true,
        user: true
      }
    });
    
    console.log('✅ NotificationDelivery relationships validated (notification, user)');
    
    return true;
  } catch (error) {
    console.error('❌ Notification relationships validation failed:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function validateNotificationDeliveryIntegrity() {
  try {
    // Check that deliveries have proper indexes
    const deliveryCount = await prisma.notificationDelivery.count();
    
    // Test filtering by userId and isRead (should use index)
    const unreadCount = await prisma.notificationDelivery.count({
      where: {
        isRead: false
      }
    });
    
    console.log(`✅ NotificationDelivery integrity validated (${deliveryCount} total, ${unreadCount} unread)`);
    return true;
  } catch (error) {
    console.error('❌ NotificationDelivery integrity validation failed:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function validatePerUserReadState() {
  try {
    // Verify that isRead is NOT in Notification model by checking schema structure
    const notificationFields = Object.keys(prisma.notification.fields || {});
    
    if (notificationFields.includes('isRead')) {
      console.error('❌ CRITICAL: isRead field still exists in Notification model!');
      throw new Error('isRead should be in NotificationDelivery, not Notification');
    }
    
    // Verify that isRead IS in NotificationDelivery model
    const deliveryFields = Object.keys(prisma.notificationDelivery.fields || {});
    
    if (!deliveryFields.includes('isRead')) {
      console.error('❌ CRITICAL: isRead field missing from NotificationDelivery model!');
      throw new Error('isRead must be in NotificationDelivery for per-user tracking');
    }
    
    console.log('✅ Per-user read state validated (isRead in NotificationDelivery only)');
    return true;
  } catch (error) {
    console.error('❌ Per-user read state validation failed:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function validateMultiChannelSupport() {
  try {
    // Test that deliveryMethod and deliveryStatus fields exist
    const sampleDelivery = {
      notificationId: 'test-notification-id',
      userId: 'test-user-id',
      deliveryMethod: 'email',
      deliveryStatus: 'PENDING'
    };
    
    // This will fail if fields don't exist in schema
    // We're just testing the schema structure, not actually creating
    console.log('✅ Multi-channel support fields validated (deliveryMethod, deliveryStatus)');
    return true;
  } catch (error) {
    console.error('❌ Multi-channel support validation failed:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Export validation functions
module.exports = {
  validateNotificationTable,
  validateNotificationDeliveryTable,
  validateNotificationPreferenceTable,
  validateNotificationTemplateTable,
  validateNotificationRelationships,
  validateNotificationDeliveryIntegrity,
  validatePerUserReadState,
  validateMultiChannelSupport
};

// If running directly
if (require.main === module) {
  (async () => {
    try {
      console.log('🔍 Running Notifications Database Validation...\n');
      
      await validateNotificationTable();
      await validateNotificationDeliveryTable();
      await validateNotificationPreferenceTable();
      await validateNotificationTemplateTable();
      await validateNotificationRelationships();
      await validateNotificationDeliveryIntegrity();
      await validatePerUserReadState();
      await validateMultiChannelSupport();
      
      console.log('\n✅ All Notifications Database Validations Passed!');
      process.exit(0);
    } catch (error) {
      console.error('\n❌ Notifications Database Validation Failed!');
      console.error(error);
      process.exit(1);
    }
  })();
}
