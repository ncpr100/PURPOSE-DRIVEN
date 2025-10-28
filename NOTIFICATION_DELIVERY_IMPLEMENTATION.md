# NotificationDelivery Model Implementation

## Overview

The `NotificationDelivery` model extends the notification system to provide per-user tracking of notification delivery and read status. This solves the limitation where the single `isRead` field on the `Notification` model couldn't properly track individual user interactions with notifications that target multiple users (global notifications, role-based notifications, etc.).

## Problem Statement

The previous implementation had the following limitations:

1. **Global notifications**: A single `isRead` boolean couldn't track which users had read the notification
2. **Role-based notifications**: No way to know which users in a role had seen the notification
3. **Analytics**: Unable to track notification engagement metrics per user
4. **Delivery tracking**: No way to confirm delivery to individual users

## Solution: NotificationDelivery Model

### Schema

```prisma
model NotificationDelivery {
  id             String       @id @default(cuid())
  notificationId String
  userId         String
  isRead         Boolean      @default(false)
  isDelivered    Boolean      @default(false)
  deliveredAt    DateTime?
  readAt         DateTime?
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @default(now())
  notification   Notification @relation(fields: [notificationId], references: [id], onDelete: Cascade)
  user           User         @relation("UserNotificationDeliveries", fields: [userId], references: [id], onDelete: Cascade)

  @@unique([notificationId, userId])
  @@index([userId])
  @@index([notificationId])
  @@index([isRead])
  @@index([isDelivered])
  @@map("notification_deliveries")
}
```

### Key Features

1. **Per-user tracking**: Each user gets their own delivery record
2. **Unique constraint**: Prevents duplicate deliveries (notificationId + userId)
3. **Read tracking**: Individual `isRead` and `readAt` per user
4. **Delivery confirmation**: `isDelivered` and `deliveredAt` timestamps
5. **Performance indexes**: Optimized queries on userId, notificationId, isRead, isDelivered
6. **Cascade deletion**: Automatically cleaned up when notification or user is deleted

## API Changes

### GET /api/notifications

**Received Notifications** (default):
- Now queries `NotificationDelivery` records for the current user
- Returns notifications with user-specific read status
- Includes delivery metadata: `deliveryId`, `deliveredAt`, `readAt`

**Sent Notifications** (`sentOnly=true`):
- Returns notifications created by the current user
- Includes all delivery records with statistics
- Useful for tracking notification engagement

### POST /api/notifications

**Enhanced Behavior**:
1. Creates the notification
2. Determines target users based on:
   - `targetUser`: Specific user
   - `targetRole`: All users with that role
   - `isGlobal`: All active users in the church
3. Creates `NotificationDelivery` records for all target users
4. Returns `deliveryCount` in the response

**Example Request**:
```json
{
  "title": "Important Update",
  "message": "System maintenance scheduled",
  "type": "INFO",
  "isGlobal": true,
  "priority": "HIGH"
}
```

**Example Response**:
```json
{
  "id": "notif_123",
  "title": "Important Update",
  "message": "System maintenance scheduled",
  "type": "INFO",
  "isGlobal": true,
  "priority": "HIGH",
  "deliveryCount": 45,
  "createdAt": "2025-10-28T22:00:00Z",
  ...
}
```

### PUT /api/notifications

**Mark as Read** - Now supports three methods:

1. **By Delivery IDs** (Preferred):
```json
{
  "deliveryIds": ["delivery_1", "delivery_2"]
}
```

2. **Mark All as Read**:
```json
{
  "markAllAsRead": true
}
```

3. **By Notification IDs** (Legacy support):
```json
{
  "notificationIds": ["notif_1", "notif_2"]
}
```

All methods:
- Update `isRead` to `true`
- Set `readAt` timestamp
- Only affect the current user's delivery records

## Data Migration

A migration script is provided to populate `NotificationDelivery` records for existing notifications:

```bash
npx tsx scripts/migrate-notification-deliveries.ts
```

This script:
1. Finds all existing notifications
2. Determines target users based on notification settings
3. Creates delivery records for each user
4. Preserves the original `isRead` status
5. Sets `isDelivered` to true for existing notifications

## Benefits

### 1. Accurate User Tracking
- Each user has their own read status
- No confusion with shared notifications

### 2. Better Analytics
- Track delivery rates
- Monitor read rates per user
- Identify users who haven't seen important notifications

### 3. Improved UX
- Accurate unread counts per user
- Proper notification badges
- Clear delivery status

### 4. Scalability
- Indexed queries for fast performance
- Efficient bulk operations
- Supports thousands of notifications

### 5. Data Integrity
- Unique constraints prevent duplicates
- Cascade deletion maintains referential integrity
- Timestamps provide audit trail

## Usage Examples

### Creating a Notification for All Pastors

```typescript
await prisma.notification.create({
  data: {
    title: 'Pastor Meeting',
    message: 'Monthly pastor meeting scheduled',
    type: 'INFO',
    churchId: churchId,
    targetRole: 'PASTOR',
    createdBy: userId,
  }
});

// Automatically creates NotificationDelivery records for all users with role 'PASTOR'
```

### Checking Unread Notifications for a User

```typescript
const unreadCount = await prisma.notificationDelivery.count({
  where: {
    userId: userId,
    isRead: false,
    notification: {
      churchId: churchId,
    }
  }
});
```

### Getting Notification Delivery Statistics

```typescript
const notification = await prisma.notification.findUnique({
  where: { id: notificationId },
  include: {
    deliveries: {
      select: {
        userId: true,
        isRead: true,
        readAt: true,
      }
    }
  }
});

const stats = {
  totalDeliveries: notification.deliveries.length,
  readCount: notification.deliveries.filter(d => d.isRead).length,
  readRate: (notification.deliveries.filter(d => d.isRead).length / notification.deliveries.length) * 100
};
```

## Performance Considerations

### Indexes
Four indexes optimize common queries:
- `userId`: Fast lookup of user's notifications
- `notificationId`: Fast lookup of notification's deliveries
- `isRead`: Efficient unread filtering
- `isDelivered`: Track delivery status

### Bulk Operations
Use `createMany` and `updateMany` for efficient batch processing:

```typescript
await prisma.notificationDelivery.createMany({
  data: targetUsers.map(user => ({
    notificationId: notification.id,
    userId: user.id,
    isDelivered: true,
    deliveredAt: new Date(),
  })),
  skipDuplicates: true,
});
```

## Security

1. **Church Isolation**: Users only see notifications from their church
2. **User Isolation**: Users can only mark their own deliveries as read
3. **Role-Based Access**: Creating notifications requires admin/pastor role
4. **Cascading Deletes**: Delivery records are automatically cleaned up

## Backward Compatibility

The implementation maintains backward compatibility:
- Old notification queries still work
- Legacy `notificationIds` parameter supported in PUT endpoint
- Existing `isRead` field preserved on Notification model
- Gradual migration supported

## Testing

Comprehensive test suites are provided:
1. `tests/notification-delivery.test.ts` - Model and schema tests
2. `tests/notification-api-integration.test.ts` - API integration tests

Run tests with:
```bash
npm test
```

## Future Enhancements

Possible future improvements:
1. Real-time delivery via WebSockets
2. Delivery failure tracking and retry logic
3. Notification preferences per category
4. Scheduled notification delivery
5. Delivery confirmation receipts
6. Advanced analytics dashboard

## Migration Checklist

- [x] Add NotificationDelivery model to schema
- [x] Create database migration
- [x] Update API endpoints
- [x] Create data migration script
- [x] Add tests
- [ ] Run database migration (when DB accessible)
- [ ] Run data migration script
- [ ] Deploy to production
- [ ] Monitor delivery metrics

## Support

For questions or issues related to the NotificationDelivery implementation, contact the development team or refer to the API documentation.
