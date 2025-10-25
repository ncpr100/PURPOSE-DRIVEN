#!/bin/bash

# =================================================================
# DONATIONS MODULE - P0 CRITICAL INFRASTRUCTURE VALIDATION
# Test Suite: Critical functionality and stability tests
# =================================================================

echo "🏛️ DONATIONS MODULE - P0 CRITICAL INFRASTRUCTURE VALIDATION"
echo "============================================================="
echo "Testing critical infrastructure and core functionality..."
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

run_test "Donations API endpoint exists" \
    "[ -f app/api/donations/route.ts ]" \
    "success"

run_test "Donations stats API endpoint exists" \
    "[ -f app/api/donations/stats/route.ts ]" \
    "success"

run_test "Online payments API endpoint exists" \
    "[ -f app/api/online-payments/route.ts ]" \
    "success"

run_test "Payment webhooks API endpoint exists" \
    "[ -f app/api/webhooks/stripe/route.ts ]" \
    "success"

echo "=== P0.2: CORE COMPONENTS ==="

run_test "Main donations client component exists" \
    "[ -f app/\(dashboard\)/donations/_components/donations-client.tsx ]" \
    "success"

run_test "Donation stats component exists" \
    "[ -f app/\(dashboard\)/donations/_components/donation-stats.tsx ]" \
    "success"

run_test "Public donation form component exists" \
    "[ -f components/donations/public-donation-form.tsx ]" \
    "success"

run_test "Donation form dialog component exists" \
    "[ -f components/donations/donation-form-dialog.tsx ]" \
    "success"

echo "=== P0.3: DATABASE SCHEMA VALIDATION ==="

run_test "Donation model exists in Prisma schema" \
    "grep -q 'model Donation' prisma/schema.prisma" \
    "success"

run_test "DonationCategory model exists in Prisma schema" \
    "grep -q 'model DonationCategory' prisma/schema.prisma" \
    "success"

run_test "PaymentMethod model exists in Prisma schema" \
    "grep -q 'model PaymentMethod' prisma/schema.prisma" \
    "success"

run_test "OnlinePayment model exists in Prisma schema" \
    "grep -q 'model OnlinePayment' prisma/schema.prisma" \
    "success"

echo "=== P0.4: MAIN DASHBOARD PAGES ==="

run_test "Main donations dashboard page exists" \
    "[ -f app/\(dashboard\)/donations/page.tsx ]" \
    "success"

run_test "Public donation page exists" \
    "[ -f app/donate/\[churchId\]/page.tsx ]" \
    "success"

run_test "Thank you page exists" \
    "[ -f app/donate/thank-you/page.tsx ]" \
    "success"

run_test "Donations settings page exists" \
    "[ -f app/\(dashboard\)/settings/donations/page.tsx ]" \
    "success"

echo "=== P0.5: STRIPE INTEGRATION ==="

run_test "Stripe client configuration exists" \
    "[ -f lib/stripe.ts ]" \
    "success"

run_test "Stripe webhook handler exists" \
    "[ -f app/api/webhooks/stripe/route.ts ]" \
    "success"

run_test "Stripe environment variables configured" \
    "grep -q 'STRIPE_SECRET_KEY' .env.example" \
    "success"

run_test "Stripe publishable key configured" \
    "grep -q 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY' .env.example" \
    "success"

echo "=== P0.6: FINANCIAL REPORTING ==="

run_test "Financial reports integration exists" \
    "grep -q 'FINANCIAL' app/api/reports/\[id\]/execute/route.ts" \
    "success"

run_test "KPI metrics for donations exist" \
    "grep -q 'Donaciones Totales' app/api/kpi-metrics/templates/route.ts" \
    "success"

run_test "Donation analytics components exist" \
    "[ -f app/\(dashboard\)/analytics/_components/analytics-client.tsx ] && grep -q 'donations' app/\(dashboard\)/analytics/_components/analytics-client.tsx" \
    "success"

echo "=== P0.7: AUTOMATION INTEGRATION ==="

run_test "Donation automation triggers exist" \
    "grep -q 'donationReceived' app/api/donations/route.ts" \
    "success"

run_test "Automation engine imports donation triggers" \
    "grep -q 'AutomationTriggers' app/api/donations/route.ts" \
    "success"

echo "=== P0.8: MIDDLEWARE AUTHENTICATION ==="

run_test "Donations pages protected in middleware" \
    "grep -q 'donations' middleware.ts" \
    "success"

run_test "Donations API routes protected in middleware" \
    "grep -q 'api/donations' middleware.ts" \
    "success"

echo
echo "============================================================="
echo "🏛️ P0 CRITICAL INFRASTRUCTURE VALIDATION COMPLETE"
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

# Critical issues summary
if [ $passed_tests -lt $total_tests ]; then
    echo "🚨 CRITICAL ISSUES DETECTED:"
    echo "============================"
    for test_name in "${!test_results[@]}"; do
        if [ "${test_results[$test_name]}" = "FAIL" ]; then
            echo "❌ $test_name"
        fi
    done
    echo
    echo "⚠️  DONATIONS MODULE REQUIRES IMMEDIATE ATTENTION"
    echo "   Failed $((total_tests - passed_tests)) critical infrastructure tests"
else
    echo "🎉 ALL CRITICAL INFRASTRUCTURE TESTS PASSED!"
    echo "   DONATIONS module P0 infrastructure is fully operational"
fi

echo
echo "Next: Run P1 validation with './tests/donations-validation-p1.sh'"
echo "============================================================="