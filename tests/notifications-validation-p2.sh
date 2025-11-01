#!/bin/bash

# NOTIFICATIONS MODULE - P2 Advanced Feature Tests
# Tests enterprise features, performance, and edge cases

echo "🎯 EJECUTANDO VALIDACIÓN P2 - NOTIFICATIONS MODULE (ADVANCED FEATURES)"
echo "======================================================================"

# Test Results Tracking
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    echo "▶️  Test: $test_name"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if eval "$test_command" > /dev/null 2>&1; then
        echo "   ✅ PASS"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo "   ❌ FAIL"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    echo
}

echo "📡 CATEGORY 1: MULTI-CHANNEL DELIVERY TRACKING"
echo "--------------------------------------------"

# Test deliveryMethod field exists
run_test "Delivery method tracking supported" "grep -q 'deliveryMethod' prisma/schema.prisma"

# Test deliveryStatus field exists
run_test "Delivery status tracking supported" "grep -q 'deliveryStatus' prisma/schema.prisma"

# Test failure reason tracking
run_test "Delivery failure reason tracking supported" "grep -q 'failureReason' prisma/schema.prisma"

# Test delivered timestamp
run_test "Delivery timestamp tracking supported" "grep -q 'deliveredAt' prisma/schema.prisma"

# Test unique constraint on delivery method per user
run_test "Unique constraint on notification-user-method" "grep -A 5 'model NotificationDelivery' prisma/schema.prisma | grep -q 'unique.*notificationId.*userId.*deliveryMethod'"

echo "🔍 CATEGORY 2: ADVANCED QUERY OPTIMIZATION"
echo "-----------------------------------------"

# Test indexes for performance
run_test "Index on userId and isRead for fast queries" "grep -A 10 'model NotificationDelivery' prisma/schema.prisma | grep -q 'index.*userId.*isRead'"

run_test "Index on notificationId for fast lookups" "grep -A 10 'model NotificationDelivery' prisma/schema.prisma | grep -q 'index.*notificationId'"

# Test pagination support in API
run_test "Pagination support in notifications API" "grep -E '(page|limit|skip|take)' app/api/notifications/route.ts | wc -l | grep -E '[2-9]|[1-9][0-9]'"

echo "🎯 CATEGORY 3: ADVANCED TARGETING"
echo "--------------------------------"

# Test expiration support
run_test "Notification expiration supported" "grep -q 'expiresAt' prisma/schema.prisma"

# Test action URL support
run_test "Notification action URL supported" "grep -q 'actionUrl' prisma/schema.prisma"

# Test action label support
run_test "Notification action label supported" "grep -q 'actionLabel' prisma/schema.prisma"

# Test creator tracking
run_test "Notification creator tracking" "grep -q 'createdBy' prisma/schema.prisma"

echo "📊 CATEGORY 4: ANALYTICS & REPORTING"
echo "-----------------------------------"

# Test notification stats component
run_test "Notification statistics component exists" "test -f app/\(dashboard\)/notifications/_components/notification-stats.tsx"

# Test delivery analytics
run_test "Delivery analytics API endpoint exists" "test -f app/api/push-notifications/stats/route.ts"

# Test read/unread count tracking
run_test "Read/unread count logic in API" "grep -q 'unreadCount' app/api/notifications/route.ts || grep -q 'isRead.*false' app/api/notifications/route.ts"

echo "🔄 CATEGORY 5: BULK OPERATIONS & PERFORMANCE"
echo "-------------------------------------------"

# Test bulk creation support
run_test "Bulk notification creation endpoint" "test -f app/api/notifications/bulk/route.ts"

# Test createMany for bulk deliveries
run_test "Bulk delivery creation logic" "grep -q 'createMany' app/api/notifications/bulk/route.ts || grep -q 'Promise.all' app/api/notifications/bulk/route.ts"

# Test mark all as read functionality
run_test "Mark all as read functionality" "grep -q 'markAllAsRead' app/api/notifications/route.ts || grep -q 'updateMany' app/api/notifications/route.ts"

echo "🎨 CATEGORY 6: TEMPLATE SYSTEM ADVANCED"
echo "--------------------------------------"

# Test template table exists
run_test "NotificationTemplate model exists" "grep -q 'model NotificationTemplate' prisma/schema.prisma"

# Test template fields
run_test "Template has title and message templates" "grep -A 10 'model NotificationTemplate' prisma/schema.prisma | grep -E '(titleTemplate|messageTemplate)' | wc -l | grep -E '[2-9]'"

# Test template activation
run_test "Template activation flag exists" "grep -A 10 'model NotificationTemplate' prisma/schema.prisma | grep -q 'isActive'"

# Test system templates
run_test "System template flag exists" "grep -A 10 'model NotificationTemplate' prisma/schema.prisma | grep -q 'isSystem'"

echo "🔐 CATEGORY 7: SECURITY & PRIVACY"
echo "--------------------------------"

# Test church isolation
run_test "Notifications are church-scoped" "grep -q 'churchId' prisma/schema.prisma | grep -A 2 'model Notification'"

# Test cascade delete
run_test "Cascade delete on church removal" "grep -A 20 'model Notification' prisma/schema.prisma | grep -q 'onDelete.*Cascade'"

# Test cascade delete on deliveries
run_test "Cascade delete on notification removal" "grep -A 20 'model NotificationDelivery' prisma/schema.prisma | grep -q 'onDelete.*Cascade'"

echo "🌐 CATEGORY 8: INTERNATIONALIZATION"
echo "----------------------------------"

# Test Spanish language support
run_test "Spanish language support in components" "grep -E '(Notificaciones|Crear|Enviar|Preferencias)' app/\(dashboard\)/notifications/page.tsx || grep -E '(Notificaciones|Crear)' app/\(dashboard\)/notifications/_components/*.tsx | head -1"

echo "⚡ CATEGORY 9: REALTIME FEATURES"
echo "-------------------------------"

# Test realtime management component
run_test "Realtime management component exists" "test -f app/\(dashboard\)/notifications/_components/realtime-management.tsx"

# Test websocket or polling logic (check for intervals or subscriptions)
run_test "Realtime update logic present" "grep -E '(useEffect|setInterval|subscribe|realtime)' app/\(dashboard\)/notifications/_components/notifications-client.tsx | wc -l | grep -E '[1-9]'"

echo "🎭 CATEGORY 10: EDGE CASES & ERROR HANDLING"
echo "------------------------------------------"

# Test error handling in API
run_test "Error handling in notification API" "grep -E '(try|catch|error)' app/api/notifications/route.ts | wc -l | grep -E '[3-9]|[1-9][0-9]'"

# Test error handling in bulk API
run_test "Error handling in bulk API" "grep -E '(try|catch|error)' app/api/notifications/bulk/route.ts | wc -l | grep -E '[3-9]|[1-9][0-9]'"

# Test validation in acknowledge endpoint
run_test "Validation in acknowledge endpoint" "grep -E '(validation|zod|check|if.*!)' app/api/notifications/acknowledge/route.ts | wc -l | grep -E '[2-9]|[1-9][0-9]'"

echo "📈 CATEGORY 11: SCALABILITY FEATURES"
echo "-----------------------------------"

# Test database transaction support
run_test "Transaction support in bulk operations" "grep -q 'transaction' app/api/notifications/bulk/route.ts || grep -q '$transaction' app/api/notifications/bulk/route.ts"

# Test efficient querying with includes
run_test "Efficient relationship loading" "grep -E '(include|select)' app/api/notifications/route.ts | wc -l | grep -E '[2-9]|[1-9][0-9]'"

# Test limit on query results
run_test "Query result limiting" "grep -E '(take|limit)' app/api/notifications/route.ts"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "📊 P2 VALIDATION RESULTS - NOTIFICATIONS MODULE"
echo "═══════════════════════════════════════════════════════════════"
echo "Total Tests:  $TOTAL_TESTS"
echo "Passed:       $PASSED_TESTS ✅"
echo "Failed:       $FAILED_TESTS ❌"
echo "Success Rate: $(awk "BEGIN {printf \"%.1f\", ($PASSED_TESTS/$TOTAL_TESTS)*100}")%"
echo "═══════════════════════════════════════════════════════════════"

# Exit with appropriate code
if [ $FAILED_TESTS -eq 0 ]; then
    echo "🎉 ALL P2 ADVANCED TESTS PASSED!"
    echo "✅ Notifications module advanced features are excellent"
    exit 0
elif [ $(awk "BEGIN {print ($PASSED_TESTS/$TOTAL_TESTS) >= 0.80}") -eq 1 ]; then
    echo "✅ P2 TESTS PASSED THRESHOLD (≥80%)"
    echo "⚡ Advanced features are in good shape, minor improvements possible"
    exit 0
else
    echo "⚠️  P2 TESTS BELOW THRESHOLD"
    echo "💡 Consider scheduling optimization work for advanced features"
    exit 1
fi
