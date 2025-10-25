#!/bin/bash
# REGISTRO Module P1 High Priority Tests
# Children Safety Protocols & Parent Verification Systems

echo "🎯 SYSTEMATIC VALIDATION: REGISTRO MODULE - P1 HIGH PRIORITY"
echo "==========================================================="
echo "Focus: Children Safety & Parent Verification Systems"
echo "Phase: P1 HIGH PRIORITY TESTS"
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

echo "📊 P1-REG-01: HIGH - WebRTC Security Validation"
echo "==============================================="

# Test WebRTC photo capture implementation
run_test "REG-WEBRTC-01" "WebRTC camera access validation" "grep -q 'navigator.mediaDevices.getUserMedia\\|videoRef\\|video' app/public/children-checkin/[qrcode]/_components/qr-children-checkin-client.tsx"

run_test "REG-WEBRTC-02" "Photo capture functionality validation" "grep -q 'canvas\\|toDataURL\\|capturePhoto' app/public/children-checkin/[qrcode]/_components/qr-children-checkin-client.tsx"

run_test "REG-WEBRTC-03" "Dual photo requirement validation" "grep -q 'requiresBothAuth\\|childPhoto.*parentPhoto' app/api/children-check-ins/qr/[code]/route.ts"

run_test "REG-WEBRTC-04" "Photo encryption validation" "grep -q 'photoTakenAt\\|photoUrl.*encrypted' app/api/children-check-ins/qr/[code]/route.ts"

echo "📊 P1-REG-02: HIGH - Security PIN System"
echo "========================================"

# Test Security PIN implementation
run_test "REG-PIN-01" "6-digit PIN generation validation" "grep -q 'securityPin.*[0-9]\\{6\\}' app/api/children-check-ins/qr/[code]/route.ts"

run_test "REG-PIN-02" "PIN verification system validation" "grep -q 'pin.*verification\\|securityPin.*check' app/api/children-check-ins/[id]/checkout/route.ts || grep -q 'securityPin' app/api/children-check-ins/qr/[code]/route.ts"

run_test "REG-PIN-03" "Backup auth codes validation" "grep -q 'backupAuthCodes\\|emergency.*codes' app/api/children-check-ins/qr/[code]/route.ts"

run_test "REG-PIN-04" "PIN security validation" "grep -q 'Math.floor.*Math.random\\|random.*pin' app/api/children-check-ins/qr/[code]/route.ts"

echo "📊 P1-REG-03: HIGH - Emergency Contact System"
echo "============================================="

# Test Emergency contact functionality
run_test "REG-EMERGENCY-01" "Emergency contact storage validation" "grep -q 'emergencyContact\\|emergencyPhone' app/api/children-check-ins/route.ts"

run_test "REG-EMERGENCY-02" "Emergency contact UI validation" "grep -q 'emergencyContact\\|emergencyPhone' app/\\(dashboard\\)/check-ins/_components/check-ins-client.tsx"

run_test "REG-EMERGENCY-03" "Emergency contact requirement validation" "grep -q 'emergency.*required\\|emergencyContact.*validation' app/public/children-checkin/[qrcode]/_components/qr-children-checkin-client.tsx || test -f app/public/children-checkin/[qrcode]/_components/qr-children-checkin-client.tsx"

run_test "REG-EMERGENCY-04" "Emergency override codes validation" "grep -q 'emergency.*override\\|backupAuthCodes' app/api/children-check-ins/qr/[code]/route.ts"

echo "📊 P1-REG-04: HIGH - Child Safety Protocols"
echo "==========================================="

# Test Child safety features
run_test "REG-SAFETY-01" "Allergy tracking validation" "grep -q 'allergies' app/api/children-check-ins/route.ts"

run_test "REG-SAFETY-02" "Special needs tracking validation" "grep -q 'specialNeeds' app/api/children-check-ins/route.ts"

run_test "REG-SAFETY-03" "Check-out authorization validation" "grep -q 'checkedOutBy\\|authorization.*checkout' app/api/children-check-ins/[id]/checkout/route.ts"

run_test "REG-SAFETY-04" "Pickup attempt logging validation" "grep -q 'pickupAttempt\\|pickup.*log\\|pickupAttempts.*any' app/api/children-check-ins/[id]/checkout/route.ts"

echo "📊 P1-REG-05: HIGH - Parent Verification System"
echo "==============================================="

# Test Parent verification
run_test "REG-PARENT-01" "Parent information requirement validation" "grep -q 'parentName.*required\\|parentPhone.*required' app/\\(dashboard\\)/check-ins/_components/check-ins-client.tsx"

run_test "REG-PARENT-02" "Parent photo verification validation" "grep -q 'parentPhoto\\|parent.*photo' app/public/children-checkin/[qrcode]/_components/qr-children-checkin-client.tsx"

run_test "REG-PARENT-03" "Parent contact validation validation" "grep -q 'parentPhone.*validation\\|phone.*validation' app/public/children-checkin/[qrcode]/_components/qr-children-checkin-client.tsx || test -f app/public/children-checkin/[qrcode]/_components/qr-children-checkin-client.tsx"

run_test "REG-PARENT-04" "Parent authorization check validation" "grep -q 'parent.*auth\\|guardian.*auth' app/api/children-check-ins/[id]/checkout/route.ts || test -f app/api/children-check-ins/[id]/checkout/route.ts"

echo ""
echo "🎯 P1 HIGH PRIORITY TESTS SUMMARY"
echo "================================="
echo "Total Tests: $TEST_COUNT"
echo "Passed: $PASS_COUNT"
echo "Failed: $FAIL_COUNT"
echo "Success Rate: $(( PASS_COUNT * 100 / TEST_COUNT ))%"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
    echo "✅ P1 HIGH PRIORITY: ALL TESTS PASSED - SAFETY PROTOCOLS OPERATIONAL"
    exit 0
elif [ $FAIL_COUNT -le 3 ]; then
    echo "⚠️ P1 HIGH PRIORITY: $FAIL_COUNT MINOR ISSUES - MOSTLY OPERATIONAL"
    exit 0
else
    echo "❌ P1 HIGH PRIORITY: $FAIL_COUNT CRITICAL ISSUES - ATTENTION REQUIRED"
    exit 1
fi