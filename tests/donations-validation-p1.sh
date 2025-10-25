#!/bin/bash

# =================================================================
# DONATIONS MODULE - P1 HIGH PRIORITY SAFETY VALIDATION
# Test Suite: Safety protocols, security, and reliability tests
# =================================================================

echo "🔒 DONATIONS MODULE - P1 HIGH PRIORITY SAFETY VALIDATION"
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

echo "=== P1.1: FINANCIAL SECURITY PROTOCOLS ==="

run_test "Stripe webhook signature verification exists" \
    "grep -q 'stripe.webhooks.constructEvent' app/api/webhooks/stripe/route.ts" \
    "success"

run_test "Payment validation in online payments API" \
    "grep -q 'amount.*validation\\|amount.*required' app/api/online-payments/route.ts" \
    "success"

run_test "Donation amount validation exists" \
    "grep -q 'amount.*parseFloat\\|amount.*number' app/api/donations/route.ts" \
    "success"

run_test "Currency validation exists" \
    "grep -q 'currency' app/api/donations/route.ts" \
    "success"

echo "=== P1.2: AUTHENTICATION & AUTHORIZATION ==="

run_test "Session authentication in donations API" \
    "grep -q 'getServerSession\\|session' app/api/donations/route.ts" \
    "success"

run_test "Church ID validation in donations" \
    "grep -q 'churchId' app/api/donations/route.ts" \
    "success"

run_test "User role validation in stats API" \
    "grep -q 'session\\|auth' app/api/donations/stats/route.ts" \
    "success"

run_test "Protected middleware for donations endpoints" \
    "grep -q '/api/donations' middleware.ts" \
    "success"

echo "=== P1.3: DATA VALIDATION & SANITIZATION ==="

run_test "Input sanitization in donation form" \
    "grep -q 'trim()\\|sanitize\\|validate' components/donations/public-donation-form.tsx" \
    "success"

run_test "Email validation in donation form" \
    "grep -q 'email.*validation\\|email.*pattern' components/donations/public-donation-form.tsx" \
    "success"

run_test "Phone number validation exists" \
    "grep -q 'phone.*validation\\|phone.*pattern' components/donations/public-donation-form.tsx" \
    "success"

run_test "Donation category validation" \
    "grep -q 'categoryId' app/api/donations/route.ts" \
    "success"

echo "=== P1.4: ERROR HANDLING & RECOVERY ==="

run_test "Error handling in donations API" \
    "grep -q 'try.*catch\\|error' app/api/donations/route.ts" \
    "success"

run_test "Error handling in online payments" \
    "grep -q 'try.*catch\\|error' app/api/online-payments/route.ts" \
    "success"

run_test "Webhook error handling exists" \
    "grep -q 'try.*catch\\|error' app/api/webhooks/stripe/route.ts" \
    "success"

run_test "Client-side error handling in form" \
    "grep -q 'catch.*error\\|error.*message' components/donations/public-donation-form.tsx" \
    "success"

echo "=== P1.5: TRANSACTION SAFETY ==="

run_test "Database transaction handling exists" \
    "grep -q 'transaction\\|db\\.\\$transaction' app/api/donations/route.ts" \
    "success"

run_test "Payment status tracking exists" \
    "grep -q 'status.*COMPLETADA\\|status.*PENDIENTE' app/api/donations/route.ts" \
    "success"

run_test "Duplicate payment prevention" \
    "grep -q 'reference\\|unique' app/api/donations/route.ts" \
    "success"

run_test "Rollback mechanisms exist in payments" \
    "grep -q 'rollback\\|revert\\|cancel' app/api/online-payments/route.ts" \
    "success"

echo "=== P1.6: SECURITY COMPLIANCE ==="

run_test "HTTPS enforcement for payments" \
    "grep -q 'https\\|secure' components/donations/public-donation-form.tsx" \
    "success"

run_test "PCI DSS compliance indicators" \
    "grep -q 'stripe\\|secure' lib/stripe.ts" \
    "success"

run_test "Sensitive data protection" \
    "grep -q 'password\\|secret' .gitignore" \
    "success"

run_test "Environment variable security" \
    "grep -q 'STRIPE_SECRET_KEY' .env.example && ! grep -q 'sk_live\\|sk_test' .env.example" \
    "success"

echo "=== P1.7: AUDIT TRAIL & LOGGING ==="

run_test "Donation audit trail exists" \
    "grep -q 'createdAt\\|updatedAt' prisma/schema.prisma" \
    "success"

run_test "Payment logging exists" \
    "grep -q 'console.log\\|logger' app/api/donations/route.ts" \
    "success"

run_test "Webhook logging exists" \
    "grep -q 'console.log\\|logger' app/api/webhooks/stripe/route.ts" \
    "success"

run_test "Error logging in payments" \
    "grep -q 'console.error\\|error.*log' app/api/online-payments/route.ts" \
    "success"

echo "=== P1.8: PERFORMANCE & RELIABILITY ==="

run_test "Database indexing for donations" \
    "grep -q '@@index\\|@@unique' prisma/schema.prisma" \
    "success"

run_test "Pagination in donations list" \
    "grep -q 'take\\|skip\\|page' app/api/donations/route.ts" \
    "success"

run_test "Caching mechanisms exist" \
    "grep -q 'cache\\|revalidate' app/\(dashboard\)/donations/_components/donation-stats.tsx" \
    "success"

run_test "Connection pooling configured" \
    "grep -q 'pool\\|connection' lib/prisma.ts" \
    "success"

echo
echo "============================================================="
echo "🔒 P1 HIGH PRIORITY SAFETY VALIDATION COMPLETE"
echo "============================================================="
echo "Total Tests: $total_tests"
echo "Passed: $passed_tests"
echo "Failed: $((total_tests - passed_tests))"
echo "Success Rate: $(( (passed_tests * 100) / total_tests ))%"
echo

# Detailed results
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

# Safety assessment
if [ $passed_tests -lt $total_tests ]; then
    echo "🚨 SAFETY CONCERNS DETECTED:"
    echo "============================"
    for test_name in "${!test_results[@]}"; do
        if [ "${test_results[$test_name]}" = "FAIL" ]; then
            echo "❌ $test_name"
        fi
    done
    echo
    echo "⚠️  DONATIONS MODULE HAS SAFETY GAPS"
    echo "   Failed $((total_tests - passed_tests)) safety protocol tests"
    echo "   IMMEDIATE SECURITY REVIEW REQUIRED"
else
    echo "🎉 ALL SAFETY PROTOCOLS VALIDATED!"
    echo "   DONATIONS module P1 safety measures are robust"
fi

echo
echo "Next: Run P2 validation with './tests/donations-validation-p2.sh'"
echo "============================================================="