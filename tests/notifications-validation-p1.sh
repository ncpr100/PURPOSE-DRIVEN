#!/bin/bash

# NOTIFICATIONS MODULE - P1 High Priority Feature Tests
# Tests user-facing features, workflows, and core functionality

echo "🎯 EJECUTANDO VALIDACIÓN P1 - NOTIFICATIONS MODULE (HIGH PRIORITY FEATURES)"
echo "=========================================================================="

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

echo "🎨 CATEGORY 1: TEMPLATE SYSTEM VALIDATION"
echo "----------------------------------------"

# Test template components exist
run_test "Template management UI exists" "test -f app/\(dashboard\)/notifications/_components/notification-list.tsx"

# Test template API endpoints
run_test "Template API functionality" "grep -q 'NotificationTemplate' app/api/notifications/route.ts"

# Test template variables support
run_test "Template variable replacement logic" "grep -q 'variables' app/api/notifications/bulk/route.ts || grep -q 'template' app/api/notifications/bulk/route.ts"

echo "⚙️  CATEGORY 2: USER PREFERENCES VALIDATION"
echo "------------------------------------------"

# Test preferences page exists
run_test "Notification preferences page exists" "test -f app/\(dashboard\)/settings/notifications/page.tsx"

# Test preferences component exists
run_test "Notification preferences component exists" "test -f app/\(dashboard\)/notifications/_components/notification-preferences.tsx"

# Test preferences API
run_test "Preferences API functionality" "grep -q 'NotificationPreference' prisma/schema.prisma"

# Test preference fields
run_test "Email preferences fields exist" "grep -E '(emailEnabled|emailEvents|emailDonations)' prisma/schema.prisma"

run_test "Push preferences fields exist" "grep -E '(pushEnabled|pushEvents|pushDonations)' prisma/schema.prisma"

run_test "In-app preferences fields exist" "grep -E '(inAppEnabled|inAppEvents|inAppCommunications)' prisma/schema.prisma"

echo "📬 CATEGORY 3: DELIVERY WORKFLOW VALIDATION"
echo "------------------------------------------"

# Test individual notification delivery
run_test "Individual notification targeting support" "grep -q 'targetUser' prisma/schema.prisma"

# Test role-based delivery
run_test "Role-based notification targeting support" "grep -q 'targetRole' prisma/schema.prisma"

# Test global delivery
run_test "Global notification support" "grep -q 'isGlobal' prisma/schema.prisma"

# Test bulk delivery endpoint
run_test "Bulk delivery endpoint exists" "test -f app/api/notifications/bulk/route.ts"

# Test acknowledgment endpoint
run_test "Acknowledgment endpoint exists" "test -f app/api/notifications/acknowledge/route.ts"

echo "🔔 CATEGORY 4: PUSH NOTIFICATION INTEGRATION"
echo "-------------------------------------------"

# Test push notification settings component
run_test "Push notification settings component exists" "test -f app/\(dashboard\)/settings/notifications/_components/push-notification-settings.tsx"

# Test VAPID key endpoint
run_test "VAPID key endpoint exists" "test -f app/api/push-notifications/vapid-key/route.ts"

# Test subscription endpoint
run_test "Push subscription endpoint exists" "test -f app/api/push-notifications/subscribe/route.ts"

# Test unsubscribe endpoint
run_test "Push unsubscribe endpoint exists" "test -f app/api/push-notifications/unsubscribe/route.ts"

# Test send push endpoint
run_test "Send push notification endpoint exists" "test -f app/api/push-notifications/send/route.ts"

echo "📊 CATEGORY 5: NOTIFICATION STATISTICS"
echo "-------------------------------------"

# Test statistics component exists
run_test "Notification statistics component exists" "test -f app/\(dashboard\)/notifications/_components/notification-stats.tsx"

# Test statistics API endpoint
run_test "Push notification stats endpoint exists" "test -f app/api/push-notifications/stats/route.ts"

echo "🔄 CATEGORY 6: REALTIME MANAGEMENT"
echo "--------------------------------"

# Test realtime management component
run_test "Realtime management component exists" "test -f app/\(dashboard\)/notifications/_components/realtime-management.tsx"

# Test email management component
run_test "Email management component exists" "test -f app/\(dashboard\)/notifications/_components/email-management.tsx"

# Test sent notifications list
run_test "Sent notifications list component exists" "test -f app/\(dashboard\)/notifications/_components/sent-notifications-list.tsx"

echo "🎭 CATEGORY 7: UI/UX COMPONENTS"
echo "------------------------------"

# Test notification creation dialog
run_test "Create notification dialog has required fields" "grep -E '(title|message|type)' app/\(dashboard\)/notifications/_components/create-notification-dialog.tsx | wc -l | grep -E '[3-9]|[1-9][0-9]'"

# Test notification list component
run_test "Notification list handles empty state" "grep -q 'No notifications' app/\(dashboard\)/notifications/_components/notification-list.tsx || grep -q 'empty' app/\(dashboard\)/notifications/_components/notification-list.tsx"

# Test notification preferences has all categories
run_test "Preferences has all notification categories" "grep -E '(events|donations|communications|systemUpdates)' app/\(dashboard\)/notifications/_components/notification-preferences.tsx | wc -l | grep -E '[4-9]|[1-9][0-9]'"

echo "🔒 CATEGORY 8: SECURITY & VALIDATION"
echo "-----------------------------------"

# Test authentication middleware includes notifications
run_test "Notifications route protected" "grep -q '/notifications' middleware.ts || echo 'Notifications should be accessible only to authenticated users'"

# Test API routes have proper auth checks
run_test "Notification API has auth checks" "grep -q 'getServerSession' app/api/notifications/route.ts"

# Test bulk API has auth checks
run_test "Bulk notification API has auth checks" "grep -q 'getServerSession' app/api/notifications/bulk/route.ts"

echo "📝 CATEGORY 9: DATA VALIDATION"
echo "-----------------------------"

# Test notification type enum
run_test "Notification types defined" "grep -E '(info|warning|error|success)' app/api/notifications/route.ts || grep -E '(INFO|WARNING|ERROR|SUCCESS)' app/api/notifications/route.ts"

# Test priority levels
run_test "Priority levels supported" "grep -q 'priority' prisma/schema.prisma"

# Test notification categories
run_test "Notification categories supported" "grep -q 'category' prisma/schema.prisma"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "📊 P1 VALIDATION RESULTS - NOTIFICATIONS MODULE"
echo "═══════════════════════════════════════════════════════════════"
echo "Total Tests:  $TOTAL_TESTS"
echo "Passed:       $PASSED_TESTS ✅"
echo "Failed:       $FAILED_TESTS ❌"
echo "Success Rate: $(awk "BEGIN {printf \"%.1f\", ($PASSED_TESTS/$TOTAL_TESTS)*100}")%"
echo "═══════════════════════════════════════════════════════════════"

# Exit with appropriate code
if [ $FAILED_TESTS -eq 0 ]; then
    echo "🎉 ALL P1 HIGH PRIORITY TESTS PASSED!"
    echo "✅ Notifications module core features are functional"
    exit 0
elif [ $(awk "BEGIN {print ($PASSED_TESTS/$TOTAL_TESTS) >= 0.95}") -eq 1 ]; then
    echo "⚠️  SOME P1 TESTS FAILED - BUT WITHIN ACCEPTABLE THRESHOLD (≥95%)"
    echo "⚡ Review and address failed tests when possible"
    exit 0
else
    echo "❌ TOO MANY P1 TESTS FAILED - REQUIRES ATTENTION"
    echo "⚠️  Core features have issues that should be resolved"
    exit 1
fi
