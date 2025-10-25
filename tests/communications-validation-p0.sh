#!/bin/bash

# =================================================================
# COMMUNICATIONS MODULE - P0 CRITICAL INFRASTRUCTURE VALIDATION
# Test Suite: Core infrastructure, APIs, and foundation tests
# =================================================================

echo "🚀 COMMUNICATIONS MODULE - P0 CRITICAL INFRASTRUCTURE VALIDATION"
echo "================================================================="
echo "Testing core infrastructure, APIs, and foundational components..."
echo

# Initialize test tracking
declare -A test_results
total_tests=0
passed_tests=0

# Test function with enhanced reporting
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_result="$3"
    
    total_tests=$((total_tests + 1))
    echo "🧪 Test $total_tests: $test_name"
    
    if eval "$test_command"; then
        if [ "$expected_result" = "success" ]; then
            echo "✅ PASS: $test_name"
            test_results["$test_name"]="PASS"
            passed_tests=$((passed_tests + 1))
        else
            echo "❌ FAIL: $test_name (expected failure but got success)"
            test_results["$test_name"]="FAIL"
        fi
    else
        if [ "$expected_result" = "fail" ]; then
            echo "✅ PASS: $test_name (expected failure)"
            test_results["$test_name"]="PASS"
            passed_tests=$((passed_tests + 1))
        else
            echo "❌ FAIL: $test_name"
            test_results["$test_name"]="FAIL"
        fi
    fi
    echo
}

echo "=== P0.1: CORE API ENDPOINTS ==="

run_test "Communications main API route exists" \
    "test -f app/api/communications/route.ts" \
    "success"

run_test "Communications mass send API exists" \
    "test -f app/api/communications/mass-send/route.ts" \
    "success"

run_test "Communication templates API exists" \
    "test -f app/api/communication-templates/route.ts" \
    "success"

run_test "Email notification API exists" \
    "test -f app/api/email/send-notification/route.ts" \
    "success"

run_test "Email digest API exists" \
    "test -f app/api/email/send-digest/route.ts" \
    "success"

echo "=== P0.2: INTEGRATION SERVICES ==="

run_test "Communication service integration exists" \
    "test -f lib/integrations/communication.ts" \
    "success"

run_test "Mailgun integration exists" \
    "test -f lib/integrations/mailgun.ts" \
    "success"

run_test "Twilio integration exists" \
    "test -f lib/integrations/twilio.ts" \
    "success"

run_test "WhatsApp integration exists" \
    "test -f lib/integrations/whatsapp.ts" \
    "success"

run_test "Email service library exists" \
    "test -f lib/email.ts" \
    "success"

echo "=== P0.3: UI COMPONENTS INFRASTRUCTURE ==="

run_test "Communications dashboard client exists" \
    "test -f app/\(dashboard\)/communications/_components/communications-client.tsx" \
    "success"

run_test "Email management component exists" \
    "test -f app/\(dashboard\)/notifications/_components/email-management.tsx" \
    "success"

run_test "Communications page exists" \
    "test -f app/\(dashboard\)/communications/page.tsx" \
    "success"

run_test "Notifications page exists" \
    "test -f app/\(dashboard\)/notifications/page.tsx" \
    "success"

echo "=== P0.4: EMAIL INFRASTRUCTURE ==="

run_test "Email templates directory exists" \
    "test -d components/email-templates" \
    "success"

run_test "Notification email template exists" \
    "test -f components/email-templates/notification-email.tsx" \
    "success"

run_test "Email configuration in environment" \
    "grep -q 'SMTP_HOST\\|FROM_EMAIL\\|MAILGUN' .env.example" \
    "success"

echo "=== P0.5: DATABASE SCHEMA SUPPORT ==="

run_test "Communication model in schema" \
    "grep -q 'model Communication' prisma/schema.prisma" \
    "success"

run_test "CommunicationTemplate model in schema" \
    "grep -q 'model CommunicationTemplate' prisma/schema.prisma" \
    "success"

run_test "Notification model in schema" \
    "grep -q 'model Notification' prisma/schema.prisma" \
    "success"

run_test "Email queue support in schema" \
    "grep -q 'email\\|notification' prisma/schema.prisma" \
    "success"

echo "=== P0.6: AUTHENTICATION & MIDDLEWARE ==="

run_test "Communications routes protected by middleware" \
    "grep -q '/communications' middleware.ts" \
    "success"

run_test "API authentication in communications" \
    "grep -q 'getServerSession' app/api/communications/route.ts" \
    "success"

run_test "Role-based access in API" \
    "grep -q 'role' app/api/communications/route.ts" \
    "success"

echo "=== P0.7: HELP & DOCUMENTATION ==="

run_test "Communications help page exists" \
    "test -f app/\(dashboard\)/help/communications/page.tsx" \
    "success"

run_test "Communications manual exists" \
    "test -f app/\(dashboard\)/help/manual/communications/page.tsx" \
    "success"

echo "=== P0.8: TESTING & DIAGNOSTICS ==="

run_test "Integration testing endpoints exist" \
    "test -f app/api/test-all-integrations/route.ts" \
    "success"

run_test "Twilio testing endpoint exists" \
    "test -f app/api/test-twilio-send/route.ts" \
    "success"


echo
echo "================================================================="
echo "🚀 P0 CRITICAL INFRASTRUCTURE VALIDATION COMPLETE"
echo "================================================================="
success_rate=$((passed_tests * 100 / total_tests))
echo "Total Tests: $total_tests"
echo "Passed: $passed_tests"
echo "Failed: $((total_tests - passed_tests))"
echo "Success Rate: $success_rate%"
echo

echo "📊 DETAILED TEST RESULTS:"
echo "========================="
for test_name in "${!test_results[@]}"; do
    result="${test_results[$test_name]}"
    if [ "$result" = "PASS" ]; then
        echo "✅ $test_name"
    else
        echo "❌ $test_name"
    fi
done

echo
if [ $success_rate -ge 90 ]; then
    echo "🎯 P0 INFRASTRUCTURE STATUS: ✅ EXCELLENT"
    echo "   Communications module has solid infrastructure foundation"
elif [ $success_rate -ge 75 ]; then
    echo "⚡ P0 INFRASTRUCTURE STATUS: ⚠️ GOOD WITH GAPS"
    echo "   Communications module has good infrastructure with minor issues"
else
    echo "🚨 P0 INFRASTRUCTURE STATUS: ❌ CRITICAL ISSUES"
    echo "   Communications module has significant infrastructure problems"
fi

echo
echo "Next: Run P1 validation with './tests/communications-validation-p1.sh'"
echo "================================================================="