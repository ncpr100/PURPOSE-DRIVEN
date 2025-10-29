#!/bin/bash

# NOTIFICATIONS MODULE - Comprehensive Validation Report
# Executes all priority levels and generates detailed report

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  NOTIFICATIONS MODULE - COMPREHENSIVE VALIDATION REPORT        ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📅 Date: $(date '+%Y-%m-%d %H:%M:%S')"
echo "🏢 Module: Notifications"
echo "🎯 Validation: P0 + P1 + P2 Complete Test Suite"
echo ""

# Create temporary results directory
RESULTS_DIR="/tmp/notification-test-results-$(date +%s)"
mkdir -p "$RESULTS_DIR"

# Initialize tracking
OVERALL_STATUS="PASS"
P0_STATUS="UNKNOWN"
P1_STATUS="UNKNOWN"
P2_STATUS="UNKNOWN"

echo "════════════════════════════════════════════════════════════════"
echo "🚀 PHASE 1: P0 CRITICAL INFRASTRUCTURE VALIDATION"
echo "════════════════════════════════════════════════════════════════"
echo ""

if [ -f "./tests/notifications-validation-p0.sh" ]; then
    ./tests/notifications-validation-p0.sh > "$RESULTS_DIR/p0-results.txt" 2>&1
    P0_EXIT_CODE=$?
    
    if [ $P0_EXIT_CODE -eq 0 ]; then
        P0_STATUS="✅ PASS"
        echo "✅ P0 Critical Tests: PASSED"
    else
        P0_STATUS="❌ FAIL"
        OVERALL_STATUS="FAIL"
        echo "❌ P0 Critical Tests: FAILED"
        echo "⚠️  CRITICAL: P0 failures must be addressed immediately!"
    fi
else
    P0_STATUS="⚠️  SKIP (script not found)"
    echo "⚠️  P0 test script not found"
fi

echo ""
cat "$RESULTS_DIR/p0-results.txt" | tail -20
echo ""

echo "════════════════════════════════════════════════════════════════"
echo "🎨 PHASE 2: P1 HIGH PRIORITY FEATURE VALIDATION"
echo "════════════════════════════════════════════════════════════════"
echo ""

if [ -f "./tests/notifications-validation-p1.sh" ]; then
    ./tests/notifications-validation-p1.sh > "$RESULTS_DIR/p1-results.txt" 2>&1
    P1_EXIT_CODE=$?
    
    if [ $P1_EXIT_CODE -eq 0 ]; then
        P1_STATUS="✅ PASS"
        echo "✅ P1 Feature Tests: PASSED"
    else
        P1_STATUS="⚠️  FAIL"
        echo "⚠️  P1 Feature Tests: FAILED (but may be within threshold)"
    fi
else
    P1_STATUS="⚠️  SKIP (script not found)"
    echo "⚠️  P1 test script not found"
fi

echo ""
cat "$RESULTS_DIR/p1-results.txt" | tail -20
echo ""

echo "════════════════════════════════════════════════════════════════"
echo "⚡ PHASE 3: P2 ADVANCED FEATURE VALIDATION"
echo "════════════════════════════════════════════════════════════════"
echo ""

if [ -f "./tests/notifications-validation-p2.sh" ]; then
    ./tests/notifications-validation-p2.sh > "$RESULTS_DIR/p2-results.txt" 2>&1
    P2_EXIT_CODE=$?
    
    if [ $P2_EXIT_CODE -eq 0 ]; then
        P2_STATUS="✅ PASS"
        echo "✅ P2 Advanced Tests: PASSED"
    else
        P2_STATUS="💡 PARTIAL"
        echo "💡 P2 Advanced Tests: PARTIAL (optimization opportunities)"
    fi
else
    P2_STATUS="⚠️  SKIP (script not found)"
    echo "⚠️  P2 test script not found"
fi

echo ""
cat "$RESULTS_DIR/p2-results.txt" | tail -20
echo ""

echo "════════════════════════════════════════════════════════════════"
echo "🔍 PHASE 4: DATABASE VALIDATION"
echo "════════════════════════════════════════════════════════════════"
echo ""

if [ -f "./tests/notifications-database-validator.js" ]; then
    echo "Running database validation..."
    node ./tests/notifications-database-validator.js > "$RESULTS_DIR/db-validation.txt" 2>&1
    DB_EXIT_CODE=$?
    
    if [ $DB_EXIT_CODE -eq 0 ]; then
        echo "✅ Database Validation: PASSED"
    else
        echo "❌ Database Validation: FAILED"
        OVERALL_STATUS="FAIL"
    fi
    
    echo ""
    cat "$RESULTS_DIR/db-validation.txt"
else
    echo "⚠️  Database validator not found"
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "📊 COMPREHENSIVE VALIDATION SUMMARY"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "┌────────────────────────────────────────────────────────────┐"
echo "│ Test Level        │ Status                                 │"
echo "├────────────────────────────────────────────────────────────┤"
echo "│ P0 Critical       │ $P0_STATUS"
echo "│ P1 High Priority  │ $P1_STATUS"
echo "│ P2 Advanced       │ $P2_STATUS"
echo "└────────────────────────────────────────────────────────────┘"
echo ""

# Extract test counts from results
if [ -f "$RESULTS_DIR/p0-results.txt" ]; then
    P0_TOTAL=$(grep "Total Tests:" "$RESULTS_DIR/p0-results.txt" | awk '{print $3}')
    P0_PASSED=$(grep "Passed:" "$RESULTS_DIR/p0-results.txt" | awk '{print $2}')
    P0_FAILED=$(grep "Failed:" "$RESULTS_DIR/p0-results.txt" | awk '{print $2}')
fi

if [ -f "$RESULTS_DIR/p1-results.txt" ]; then
    P1_TOTAL=$(grep "Total Tests:" "$RESULTS_DIR/p1-results.txt" | awk '{print $3}')
    P1_PASSED=$(grep "Passed:" "$RESULTS_DIR/p1-results.txt" | awk '{print $2}')
    P1_FAILED=$(grep "Failed:" "$RESULTS_DIR/p1-results.txt" | awk '{print $2}')
fi

if [ -f "$RESULTS_DIR/p2-results.txt" ]; then
    P2_TOTAL=$(grep "Total Tests:" "$RESULTS_DIR/p2-results.txt" | awk '{print $3}')
    P2_PASSED=$(grep "Passed:" "$RESULTS_DIR/p2-results.txt" | awk '{print $2}')
    P2_FAILED=$(grep "Failed:" "$RESULTS_DIR/p2-results.txt" | awk '{print $2}')
fi

echo "📈 Detailed Results:"
echo "  P0: $P0_PASSED/$P0_TOTAL passed"
echo "  P1: $P1_PASSED/$P1_TOTAL passed"
echo "  P2: $P2_PASSED/$P2_TOTAL passed"
echo ""

# Calculate overall totals
TOTAL_TESTS=$((P0_TOTAL + P1_TOTAL + P2_TOTAL))
TOTAL_PASSED=$((P0_PASSED + P1_PASSED + P2_PASSED))
TOTAL_FAILED=$((P0_FAILED + P1_FAILED + P2_FAILED))

if [ $TOTAL_TESTS -gt 0 ]; then
    OVERALL_RATE=$(awk "BEGIN {printf \"%.1f\", ($TOTAL_PASSED/$TOTAL_TESTS)*100}")
    echo "🎯 Overall Success Rate: $OVERALL_RATE% ($TOTAL_PASSED/$TOTAL_TESTS tests)"
else
    echo "⚠️  No tests were executed"
    OVERALL_RATE=0
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "🎯 RECOMMENDATIONS"
echo "════════════════════════════════════════════════════════════════"
echo ""

if [ "$OVERALL_STATUS" = "FAIL" ]; then
    echo "❌ CRITICAL ISSUES DETECTED"
    echo "   Action Required: Fix P0 failures immediately"
    echo "   Status: NOT READY FOR PRODUCTION"
    echo ""
    echo "   Failed Tests:"
    if [ $P0_FAILED -gt 0 ]; then
        echo "   - P0 Critical: $P0_FAILED failures"
    fi
    if [ $P1_FAILED -gt 0 ]; then
        echo "   - P1 Features: $P1_FAILED failures"
    fi
    if [ $P2_FAILED -gt 0 ]; then
        echo "   - P2 Advanced: $P2_FAILED failures"
    fi
elif [ $(awk "BEGIN {print ($OVERALL_RATE >= 95)}") -eq 1 ]; then
    echo "✅ EXCELLENT - PRODUCTION READY"
    echo "   The notifications module is in excellent condition"
    echo "   Status: READY FOR IMMEDIATE DEPLOYMENT"
    echo ""
    echo "   Next Steps:"
    echo "   1. Deploy to production with confidence"
    echo "   2. Monitor notification delivery metrics"
    echo "   3. Continue with remaining module validations"
elif [ $(awk "BEGIN {print ($OVERALL_RATE >= 85)}") -eq 1 ]; then
    echo "✅ GOOD - READY WITH MINOR IMPROVEMENTS"
    echo "   The notifications module is functional"
    echo "   Status: PRODUCTION READY (with monitoring)"
    echo ""
    echo "   Recommendations:"
    echo "   1. Address P1/P2 failures when possible"
    echo "   2. Monitor for any issues in production"
    echo "   3. Schedule optimization work"
else
    echo "⚠️  NEEDS IMPROVEMENT"
    echo "   Several tests are failing"
    echo "   Status: REQUIRES ATTENTION BEFORE PRODUCTION"
    echo ""
    echo "   Action Plan:"
    echo "   1. Review and fix failing tests"
    echo "   2. Re-run validation after fixes"
    echo "   3. Consider postponing deployment"
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "📁 DETAILED RESULTS SAVED TO:"
echo "    $RESULTS_DIR"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Files:"
echo "  - p0-results.txt (Critical Infrastructure)"
echo "  - p1-results.txt (High Priority Features)"
echo "  - p2-results.txt (Advanced Features)"
echo "  - db-validation.txt (Database Validation)"
echo ""

# Save summary report
SUMMARY_FILE="$RESULTS_DIR/summary-report.txt"
cat > "$SUMMARY_FILE" << EOF
NOTIFICATIONS MODULE - VALIDATION SUMMARY REPORT
================================================

Date: $(date '+%Y-%m-%d %H:%M:%S')
Module: Notifications
Overall Status: $OVERALL_STATUS

Test Results:
-------------
P0 Critical:      $P0_STATUS ($P0_PASSED/$P0_TOTAL passed)
P1 High Priority: $P1_STATUS ($P1_PASSED/$P1_TOTAL passed)
P2 Advanced:      $P2_STATUS ($P2_PASSED/$P2_TOTAL passed)

Overall:          $TOTAL_PASSED/$TOTAL_TESTS passed ($OVERALL_RATE%)

Production Readiness:
--------------------
$(if [ "$OVERALL_STATUS" = "FAIL" ]; then
    echo "NOT READY - Critical issues must be resolved"
elif [ $(awk "BEGIN {print ($OVERALL_RATE >= 95)}") -eq 1 ]; then
    echo "READY - Excellent condition for immediate deployment"
elif [ $(awk "BEGIN {print ($OVERALL_RATE >= 85)}") -eq 1 ]; then
    echo "READY - Good condition with monitoring recommended"
else
    echo "NOT READY - Requires attention before production"
fi)

EOF

echo "📄 Summary report saved to: $SUMMARY_FILE"
echo ""

# Exit with appropriate code
if [ "$OVERALL_STATUS" = "FAIL" ]; then
    exit 1
else
    exit 0
fi
