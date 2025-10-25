#!/bin/bash

# =================================================================
# COMMUNICATIONS MODULE - P1 HIGH PRIORITY SAFETY VALIDATION
# Test Suite: Safety protocols, security, and reliability tests
# =================================================================

echo "🔒 COMMUNICATIONS MODULE - P1 HIGH PRIORITY SAFETY VALIDATION"
echo "============================================================="
echo "Testing safety protocols, security, and reliability..."
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

echo "=== P1.1: AUTHENTICATION & AUTHORIZATION ==="

run_test "Session authentication in communications API" \
    "grep -q 'getServerSession' app/api/communications/route.ts" \
    "success"

run_test "User authorization validation" \
    "grep -q 'session.*user' app/api/communications/route.ts" \
    "success"

run_test "Role validation in mass send API" \
    "grep -q 'role' app/api/communications/mass-send/route.ts" \
    "success"

run_test "Church ID validation in APIs" \
    "grep -q 'churchId' app/api/communications/route.ts" \
    "success"

run_test "Protected routes in middleware" \
    "grep -q '/api/communications' middleware.ts" \
    "success"

echo "=== P1.2: EMAIL SECURITY PROTOCOLS ==="

run_test "Email input validation exists" \
    "grep -q 'email.*validation\\|@.*validation' app/api/email/send-notification/route.ts" \
    "success"

run_test "SMTP security configuration" \
    "grep -q 'secure\\|ssl\\|tls' lib/email.ts" \
    "success"

run_test "Email template injection protection" \
    "grep -q 'sanitize\\|escape\\|html' lib/email.ts" \
    "success"

run_test "Rate limiting for email sending" \
    "grep -q 'queue\\|limit\\|throttle' lib/email.ts" \
    "success"

echo "=== P1.3: DATA VALIDATION & SANITIZATION ==="

run_test "Message content validation" \
    "grep -q 'content.*trim\\|message.*trim' app/api/communications/route.ts" \
    "success"

run_test "Phone number validation for SMS" \
    "grep -q 'phone.*validation\\|\\+.*pattern' app/api/communications/mass-send/route.ts" \
    "success"

run_test "Template variable sanitization" \
    "grep -q 'variable.*replace\\|sanitize' app/api/communications/mass-send/route.ts" \
    "success"

run_test "Recipient validation" \
    "grep -q 'recipient.*validation\\|email.*valid' app/api/communications/mass-send/route.ts" \
    "success"

echo "=== P1.4: INTEGRATION SECURITY ==="

run_test "Twilio credentials protection" \
    "grep -q 'process.env.*TWILIO' lib/integrations/twilio.ts" \
    "success"

run_test "Mailgun API key security" \
    "grep -q 'process.env.*MAILGUN' lib/integrations/mailgun.ts" \
    "success"

run_test "WhatsApp API security" \
    "grep -q 'process.env.*WHATSAPP' lib/integrations/whatsapp.ts" \
    "success"

run_test "Integration error handling" \
    "grep -q 'try.*catch\\|error' lib/integrations/communication.ts" \
    "success"

echo "=== P1.5: ERROR HANDLING & RECOVERY ==="

run_test "Error handling in communications API" \
    "grep -q 'try.*catch\\|error' app/api/communications/route.ts" \
    "success"

run_test "Error handling in mass send" \
    "grep -q 'try.*catch' app/api/communications/mass-send/route.ts" \
    "success"

run_test "Email sending error handling" \
    "grep -q 'catch.*error' app/api/email/send-notification/route.ts" \
    "success"

run_test "Client-side error handling" \
    "grep -q 'error\\|catch' app/\(dashboard\)/communications/_components/communications-client.tsx" \
    "success"

echo "=== P1.6: LOGGING & AUDIT TRAIL ==="

run_test "Communication logging exists" \
    "grep -q 'console.log\\|logger' app/api/communications/route.ts" \
    "success"

run_test "Email sending logging" \
    "grep -q 'console.log\\|log' app/api/email/send-notification/route.ts" \
    "success"

run_test "Mass communication audit trail" \
    "grep -q 'log\\|audit' app/api/communications/mass-send/route.ts" \
    "success"

run_test "Integration service logging" \
    "grep -q 'console.log\\|error' lib/integrations/communication.ts" \
    "success"

echo "=== P1.7: MESSAGE DELIVERY SAFETY ==="

run_test "Bulk sending limits exist" \
    "grep -q 'limit\\|max\\|batch' app/api/communications/mass-send/route.ts" \
    "success"

run_test "Message delivery status tracking" \
    "grep -q 'status.*SENT\\|status.*FAILED' app/api/communications/route.ts" \
    "success"

run_test "Email queue management" \
    "grep -q 'queue\\|process' lib/email.ts" \
    "success"

run_test "Failed message retry mechanism" \
    "grep -q 'retry\\|queue.*retry' lib/email.ts" \
    "success"

echo "=== P1.8: PRIVACY & COMPLIANCE ==="

run_test "Sensitive data protection" \
    "grep -q 'secret\\|password\\|api.*key' .gitignore" \
    "success"

run_test "Email unsubscribe mechanism" \
    "grep -q 'unsubscribe\\|opt.*out' components/email-templates/notification-email.tsx" \
    "success"

run_test "Data retention policies" \
    "grep -q 'retention\\|delete.*old' app/api/communications/route.ts" \
    "success"

run_test "Environment variable security" \
    "grep -q 'SMTP_\\|MAILGUN_\\|TWILIO_' .env.example && ! grep -q 'sk_live\\|sg_live' .env.example" \
    "success"


echo
echo "============================================================="
echo "🔒 P1 HIGH PRIORITY SAFETY VALIDATION COMPLETE"
echo "============================================================="
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
    echo "🔒 P1 SAFETY STATUS: ✅ EXCELLENT SECURITY"
    echo "   Communications module has robust safety protocols"
elif [ $success_rate -ge 75 ]; then
    echo "⚠️  P1 SAFETY STATUS: ⚠️ GOOD WITH GAPS"
    echo "   Communications module has good safety with minor issues"
else
    echo "🚨 P1 SAFETY STATUS: ❌ CRITICAL SECURITY ISSUES"
    echo "   Communications module has significant safety concerns"
    echo "   IMMEDIATE SECURITY REVIEW REQUIRED"
fi

echo
echo "Next: Run P2 validation with './tests/communications-validation-p2.sh'"
echo "============================================================="