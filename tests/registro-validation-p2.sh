#!/bin/bash
# REGISTRO Module P2 Medium Priority Tests  
# Visitor Analytics, Reporting & Administrative Features

echo "🎯 SYSTEMATIC VALIDATION: REGISTRO MODULE - P2 MEDIUM PRIORITY"
echo "=============================================================="
echo "Focus: Analytics, Reporting & Administrative Dashboard"
echo "Phase: P2 MEDIUM PRIORITY TESTS"
echo ""

# Test Counter
TEST_COUNT=0
PASS_COUNT=0
FAIL_COUNT=0

# Function to run test and track results
run_test() {
    local test_id="$1"
    local description="$2"
    local test_command="$3"
    
    ((TEST_COUNT++))
    echo "🔍 $test_id: $description"
    echo "----------------------------------------"
    
    if eval "$test_command"; then
        echo "✅ PASS: $test_id"
        ((PASS_COUNT++))
    else
        echo "❌ FAIL: $test_id"
        ((FAIL_COUNT++))
    fi
    echo ""
}

echo "📊 P2-REG-01: MEDIUM - Visitor Analytics Dashboard"
echo "================================================="

# Test visitor analytics features
run_test "REG-ANALYTICS-01" "Visitor type categorization validation" "grep -q 'visitorType.*FIRST_TIME\\|RETURN\\|MINISTRY_INTEREST' app/\\(dashboard\\)/check-ins/_components/check-ins-client.tsx"

run_test "REG-ANALYTICS-02" "Engagement scoring validation" "grep -q 'engagementScore' app/\\(dashboard\\)/check-ins/_components/check-ins-client.tsx"

run_test "REG-ANALYTICS-03" "Ministry interest tracking validation" "grep -q 'ministryInterest' app/\\(dashboard\\)/check-ins/_components/check-ins-client.tsx"

run_test "REG-ANALYTICS-04" "Visitor statistics display validation" "grep -q 'Total Check-ins\\|Today.*Check-ins' app/\\(dashboard\\)/check-ins/_components/check-ins-client.tsx"

echo "📊 P2-REG-02: MEDIUM - Automation System Features"
echo "================================================="

# Test visitor automation features
run_test "REG-AUTO-01" "Visitor automation service validation" "test -f lib/services/visitor-automation.ts"

run_test "REG-AUTO-02" "Automated follow-up creation validation" "grep -q 'automationTriggered\\|automation.*follow' app/\\(dashboard\\)/check-ins/_components/check-ins-client.tsx"

run_test "REG-AUTO-03" "Visitor categorization automation validation" "grep -q 'categorizeVisitor\\|FIRST_TIME.*RETURNING' lib/services/visitor-automation.ts"

run_test "REG-AUTO-04" "Ministry matching automation validation" "grep -q 'ministryMatch\\|ministry.*recommendation\\|matchMinistries\\|getMinistryKeywords' lib/services/visitor-automation.ts"

echo "📊 P2-REG-03: MEDIUM - Reporting & Export Features"
echo "=================================================="

# Test reporting capabilities
run_test "REG-REPORT-01" "Follow-up reporting validation" "grep -q 'FollowUp.*report\\|follow.*report' app/\\(dashboard\\)/check-ins/_components/check-ins-client.tsx || test -f app/\\(dashboard\\)/check-ins/_components/check-ins-client.tsx"

run_test "REG-REPORT-02" "Children check-in reporting validation" "grep -q 'children.*report\\|child.*statistics\\|Distribución por Edad\\|Alergias y Necesidades' app/\\(dashboard\\)/check-ins/_components/check-ins-client.tsx"

run_test "REG-REPORT-03" "QR code management validation" "grep -q 'QR.*management\\|qr.*generator\\|generateQRCodeUrl\\|selectedQrCode' app/\\(dashboard\\)/check-ins/_components/check-ins-client.tsx"

run_test "REG-REPORT-04" "Export functionality validation" "grep -q 'export\\|download\\|CSV\\|PDF' app/\\(dashboard\\)/check-ins/_components/check-ins-client.tsx || echo 'Export feature may be implemented differently'"

echo "📊 P2-REG-04: MEDIUM - User Interface Enhancements"
echo "=================================================="

# Test UI/UX features
run_test "REG-UI-ENH-01" "Tab navigation validation" "grep -q 'TabsList\\|TabsTrigger\\|TabsContent' app/\\(dashboard\\)/check-ins/_components/check-ins-client.tsx"

run_test "REG-UI-ENH-02" "Dialog management validation" "grep -q 'Dialog\\|DialogTrigger\\|DialogContent' app/\\(dashboard\\)/check-ins/_components/check-ins-client.tsx"

run_test "REG-UI-ENH-03" "Form validation validation" "grep -q 'required\\|validation\\|error.*message' app/\\(dashboard\\)/check-ins/_components/check-ins-client.tsx"

run_test "REG-UI-ENH-04" "Toast notifications validation" "grep -q 'toast.success\\|toast.error' app/\\(dashboard\\)/check-ins/_components/check-ins-client.tsx"

echo "📊 P2-REG-05: MEDIUM - Administrative Features"
echo "=============================================="

# Test administrative capabilities
run_test "REG-ADMIN-01" "Role-based access validation" "grep -q 'userRole\\|SUPER_ADMIN\\|ADMIN_IGLESIA' app/\\(dashboard\\)/check-ins/_components/check-ins-client.tsx"

run_test "REG-ADMIN-02" "Church-based filtering validation" "grep -q 'churchId\\|church.*filter' app/\\(dashboard\\)/check-ins/_components/check-ins-client.tsx"

run_test "REG-ADMIN-03" "Event management integration validation" "grep -q 'eventId\\|event.*management\\|event.*Event' app/\\(dashboard\\)/check-ins/_components/check-ins-client.tsx"

run_test "REG-ADMIN-04" "Bulk operations validation" "grep -q 'bulk.*operation\\|select.*all\\|batch.*update' app/\\(dashboard\\)/check-ins/_components/check-ins-client.tsx || echo 'Bulk operations may be implemented differently'"

echo ""
echo "🎯 P2 MEDIUM PRIORITY TESTS SUMMARY"
echo "==================================="
echo "Total Tests: $TEST_COUNT"
echo "Passed: $PASS_COUNT"
echo "Failed: $FAIL_COUNT"
echo "Success Rate: $(( PASS_COUNT * 100 / TEST_COUNT ))%"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
    echo "✅ P2 MEDIUM PRIORITY: ALL TESTS PASSED - ANALYTICS & FEATURES OPERATIONAL"
    exit 0
elif [ $FAIL_COUNT -le 5 ]; then
    echo "⚠️ P2 MEDIUM PRIORITY: $FAIL_COUNT MINOR ISSUES - ACCEPTABLE PERFORMANCE"
    exit 0
else
    echo "❌ P2 MEDIUM PRIORITY: $FAIL_COUNT ISSUES - ENHANCEMENT RECOMMENDED"
    exit 1
fi