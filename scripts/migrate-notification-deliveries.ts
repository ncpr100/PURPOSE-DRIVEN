/**
 * Data Migration Script: Populate NotificationDelivery records
 * 
 * This script creates NotificationDelivery records for all existing notifications
 * to ensure backward compatibility with the new notification tracking system.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateNotificationDeliveries() {
  console.log('🚀 Starting NotificationDelivery data migration...\n');

  try {
    // Get all existing notifications
    const notifications = await prisma.notification.findMany({
      include: {
        church: {
          include: {
            users: true,
          },
        },
      },
    });

    console.log(`📊 Found ${notifications.length} notifications to process\n`);

    let totalDeliveries = 0;
    let processedNotifications = 0;

    for (const notification of notifications) {
      const deliveriesToCreate: Array<{
        notificationId: string;
        userId: string;
        isRead: boolean;
        isDelivered: boolean;
        deliveredAt: Date;
        readAt: Date | null;
      }> = [];

      // Determine target users for this notification
      let targetUsers: Array<{ id: string }> = [];

      if (notification.targetUser) {
        // Specific user targeted
        const user = notification.church.users.find(u => u.id === notification.targetUser);
        if (user) {
          targetUsers = [user];
        }
      } else if (notification.targetRole) {
        // Role-based notification
        targetUsers = notification.church.users.filter(u => u.role === notification.targetRole);
      } else if (notification.isGlobal) {
        // Global notification - all church users
        targetUsers = notification.church.users;
      }

      // Create delivery records for each target user
      for (const user of targetUsers) {
        // Check if delivery record already exists
        const existingDelivery = await prisma.notificationDelivery.findUnique({
          where: {
            notificationId_userId: {
              notificationId: notification.id,
              userId: user.id,
            },
          },
        });

        if (!existingDelivery) {
          deliveriesToCreate.push({
            notificationId: notification.id,
            userId: user.id,
            // For existing notifications, we cannot know the per-user read status
            // Default to false (unread) to be safe - users can mark as read if needed
            isRead: false,
            isDelivered: true, // Mark as delivered since it's an existing notification
            deliveredAt: notification.createdAt,
            // readAt is null since we're defaulting to unread
            readAt: null,
          });
        }
      }

      // Bulk create delivery records for this notification
      if (deliveriesToCreate.length > 0) {
        await prisma.notificationDelivery.createMany({
          data: deliveriesToCreate,
          skipDuplicates: true,
        });

        totalDeliveries += deliveriesToCreate.length;
        processedNotifications++;

        console.log(
          `✅ Notification "${notification.title}" - Created ${deliveriesToCreate.length} delivery records`
        );
      }
    }

    console.log('\n📈 Migration Summary:');
    console.log(`  - Processed notifications: ${processedNotifications}`);
    console.log(`  - Total delivery records created: ${totalDeliveries}`);
    console.log('\n✅ NotificationDelivery data migration completed successfully!\n');
  } catch (error) {
    console.error('❌ Error during migration:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
migrateNotificationDeliveries()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
