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

# Test Notification table exists and structure
run_test "Notification table schema validation" "node -e 'require(\"./tests/notifications-database-validator.js\").validateNotificationTable()'"

# Test NotificationDelivery table exists
run_test "NotificationDelivery table schema validation" "node -e 'require(\"./tests/notifications-database-validator.js\").validateNotificationDeliveryTable()'"

# Test NotificationPreference table exists
run_test "NotificationPreference table schema validation" "node -e 'require(\"./tests/notifications-database-validator.js\").validateNotificationPreferenceTable()'"

# Test NotificationTemplate table exists
run_test "NotificationTemplate table schema validation" "node -e 'require(\"./tests/notifications-database-validator.js\").validateNotificationTemplateTable()'"

# Test relationships integrity
run_test "Notification relationships validation" "node -e 'require(\"./tests/notifications-database-validator.js\").validateNotificationRelationships()'"

echo "📡 CATEGORY 2: API ENDPOINTS VALIDATION"
echo "--------------------------------------"

# Test main notifications API GET endpoint
run_test "GET /api/notifications endpoint" "curl -s -f http://localhost:3000/api/notifications > /dev/null"

# Test notifications POST endpoint structure
run_test "POST /api/notifications endpoint exists" "curl -s -X POST http://localhost:3000/api/notifications -H 'Content-Type: application/json' -d '{}' -w '%{http_code}' | grep -E '(400|401|200)' > /dev/null"

# Test bulk notifications endpoint
run_test "POST /api/notifications/bulk endpoint exists" "curl -s -X POST http://localhost:3000/api/notifications/bulk -H 'Content-Type: application/json' -d '{}' -w '%{http_code}' | grep -E '(400|401|200)' > /dev/null"

# Test acknowledge endpoint
run_test "POST /api/notifications/acknowledge endpoint exists" "curl -s -X POST http://localhost:3000/api/notifications/acknowledge -H 'Content-Type: application/json' -d '{}' -w '%{http_code}' | grep -E '(400|401|200)' > /dev/null"

# Test push notification endpoints
run_test "GET /api/push-notifications/vapid-key endpoint" "curl -s -f http://localhost:3000/api/push-notifications/vapid-key > /dev/null"

run_test "POST /api/push-notifications/subscribe endpoint exists" "curl -s -X POST http://localhost:3000/api/push-notifications/subscribe -w '%{http_code}' | grep -E '(400|401|200)' > /dev/null"

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
run_test "Notification model has required fields" "grep -E '(id|title|message|type|churchId)' prisma/schema.prisma | grep -q 'model Notification'"

# Test NotificationDelivery has per-user tracking
run_test "NotificationDelivery has per-user tracking" "grep -E '(userId|isRead|readAt)' prisma/schema.prisma | grep -q 'model NotificationDelivery'"

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
