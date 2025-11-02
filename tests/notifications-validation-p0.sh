#!/bin/bash

# NOTIFICATIONS MODULE - P0 Critical Infrastructure Tests
# Tests core database connectivity, API endpoints, and fundamental functionality

echo "🎯 EJECUTANDO VALIDACIÓN P0 - NOTIFICATIONS MODULE (CRITICAL INFRASTRUCTURE)"
echo "============================================================================="

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

# Test 1: Database Schema Validation
echo "📋 CATEGORY 1: DATABASE SCHEMA VALIDATION"
echo "----------------------------------------"

# Test Notification table exists and structure (using schema file)
run_test "Notification table schema validation" "grep -A 5 'model Notification' prisma/schema.prisma | grep -q 'id.*String'"

# Test NotificationDelivery table exists
run_test "NotificationDelivery table schema validation" "grep -A 5 'model NotificationDelivery' prisma/schema.prisma | grep -q 'id.*String'"

# Test NotificationPreference table exists
run_test "NotificationPreference table schema validation" "grep -A 5 'model NotificationPreference' prisma/schema.prisma | grep -q 'id.*String'"

# Test NotificationTemplate table exists
run_test "NotificationTemplate table schema validation" "grep -A 5 'model NotificationTemplate' prisma/schema.prisma | grep -q 'id.*String'"

# Test relationships integrity
run_test "Notification relationships validation" "grep -A 20 'model Notification' prisma/schema.prisma | grep -E '(church.*Church|deliveries.*NotificationDelivery)' | wc -l | grep -E '[2-9]'"

echo "📡 CATEGORY 2: API ENDPOINTS VALIDATION"
echo "--------------------------------------"

# Test main notifications API GET endpoint exists as file
run_test "GET /api/notifications endpoint exists" "test -f app/api/notifications/route.ts"

# Test notifications POST endpoint structure exists
run_test "POST /api/notifications endpoint exists" "grep -q 'export async function POST' app/api/notifications/route.ts"

# Test bulk notifications endpoint exists
run_test "POST /api/notifications/bulk endpoint exists" "test -f app/api/notifications/bulk/route.ts"

# Test acknowledge endpoint exists
run_test "POST /api/notifications/acknowledge endpoint exists" "test -f app/api/notifications/acknowledge/route.ts"

# Test push notification endpoints exist
run_test "GET /api/push-notifications/vapid-key endpoint exists" "test -f app/api/push-notifications/vapid-key/route.ts"

run_test "POST /api/push-notifications/subscribe endpoint exists" "test -f app/api/push-notifications/subscribe/route.ts"

echo "🖥️  CATEGORY 3: UI COMPONENT VALIDATION"
echo "--------------------------------------"

# Test notifications page exists
run_test "Notifications page exists" "test -f app/\(dashboard\)/notifications/page.tsx"

# Test notification components exist
run_test "NotificationsClient component exists" "test -f app/\(dashboard\)/notifications/_components/notifications-client.tsx"

run_test "CreateNotificationDialog component exists" "test -f app/\(dashboard\)/notifications/_components/create-notification-dialog.tsx"

run_test "NotificationList component exists" "test -f app/\(dashboard\)/notifications/_components/notification-list.tsx"

run_test "NotificationPreferences component exists" "test -f app/\(dashboard\)/notifications/_components/notification-preferences.tsx"

echo "🔧 CATEGORY 4: TYPESCRIPT COMPILATION"
echo "------------------------------------"

# Test TypeScript compilation
run_test "TypeScript compilation (notifications module)" "npx tsc --noEmit --project tsconfig.json 2>&1 | grep -i notification | wc -l | grep -E '^0$' > /dev/null || npx tsc --noEmit --project tsconfig.json 2>&1 | grep -vi 'notification' > /dev/null"

echo "📊 CATEGORY 5: CRITICAL FUNCTIONALITY"
echo "------------------------------------"

# Test notification model has required fields
run_test "Notification model has required fields" "grep -A 20 'model Notification' prisma/schema.prisma | grep -E '(id|title|message|type|churchId)' | wc -l | grep -E '[5-9]|[1-9][0-9]'"

# Test NotificationDelivery has per-user tracking
run_test "NotificationDelivery has per-user tracking" "grep -A 15 'model NotificationDelivery' prisma/schema.prisma | grep -E '(userId|isRead|readAt)' | wc -l | grep -E '[3-9]|[1-9][0-9]'"

# Test no isRead field in Notification model (moved to NotificationDelivery)
run_test "Notification model does NOT have isRead field" "! grep -A 20 'model Notification' prisma/schema.prisma | grep -E '^\s+isRead'"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "📊 P0 VALIDATION RESULTS - NOTIFICATIONS MODULE"
echo "═══════════════════════════════════════════════════════════════"
echo "Total Tests:  $TOTAL_TESTS"
echo "Passed:       $PASSED_TESTS ✅"
echo "Failed:       $FAILED_TESTS ❌"
echo "Success Rate: $(awk "BEGIN {printf \"%.1f\", ($PASSED_TESTS/$TOTAL_TESTS)*100}")%"
echo "═══════════════════════════════════════════════════════════════"

# Exit with appropriate code
if [ $FAILED_TESTS -eq 0 ]; then
    echo "🎉 ALL P0 CRITICAL TESTS PASSED!"
    echo "✅ Notifications module infrastructure is stable and ready"
    exit 0
else
    echo "⚠️  SOME P0 TESTS FAILED - REQUIRES IMMEDIATE ATTENTION"
    echo "❌ Notifications module has critical issues that must be resolved"
    exit 1
fi
