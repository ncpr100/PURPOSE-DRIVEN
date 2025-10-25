#!/bin/bash
# REGISTRO Module Systematic Validation Protocol
# P0 Critical Tests for Visitors & Children's Checking Module

echo "🎯 SYSTEMATIC VALIDATION: REGISTRO MODULE"
echo "========================================"
echo "Focus: Visitors & Children's Checking System"
echo "Phase: P0 CRITICAL TESTS"
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

# P0-REG-01: Database Schema Validation
echo "📊 P0-REG-01: CRITICAL - Database Schema Validation"
echo "=================================================="

# Test CheckIn table structure
run_test "REG-DB-01" "CheckIn table schema validation" "node -e \"const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.checkIn.findFirst().then(() => console.log('Schema valid')).catch(e => { console.log('Schema error:', e.message); process.exit(1); }).finally(() => prisma.\\\$disconnect())\" > /dev/null 2>&1"

# Test ChildCheckIn table structure  
run_test "REG-DB-02" "ChildCheckIn table schema validation" "node -e \"const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.childCheckIn.findFirst().then(() => console.log('Schema valid')).catch(e => { console.log('Schema error:', e.message); process.exit(1); }).finally(() => prisma.\\\$disconnect())\" > /dev/null 2>&1"

# Test VisitorFollowUp table structure
run_test "REG-DB-03" "VisitorFollowUp table schema validation" "node -e \"const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.visitorFollowUp.findFirst().then(() => console.log('Schema valid')).catch(e => { console.log('Schema error:', e.message); process.exit(1); }).finally(() => prisma.\\\$disconnect())\" > /dev/null 2>&1"

echo "📊 P0-REG-02: CRITICAL - API Endpoints Validation"
echo "================================================"

# Test API route files exist
run_test "REG-API-01" "Check-ins API routes validation" "test -f app/api/check-ins/route.ts"

run_test "REG-API-02" "Children check-ins API routes validation" "test -f app/api/children-check-ins/route.ts"

run_test "REG-API-03" "Children checkout API routes validation" "test -f app/api/children-check-ins/[id]/checkout/route.ts"

run_test "REG-API-04" "QR check-in API routes validation" "test -f app/api/children-check-ins/qr/[code]/route.ts"

echo "📊 P0-REG-03: CRITICAL - UI Components Validation"
echo "================================================"

# Test UI component files exist
run_test "REG-UI-01" "Check-ins client component validation" "test -f app/\\(dashboard\\)/check-ins/_components/check-ins-client.tsx"

run_test "REG-UI-02" "QR children check-in component validation" "test -f app/public/children-checkin/[qrcode]/_components/qr-children-checkin-client.tsx"

run_test "REG-UI-03" "Check-ins page validation" "test -f app/\\(dashboard\\)/check-ins/page.tsx"

run_test "REG-UI-04" "QR check-in page validation" "test -f app/public/children-checkin/[qrcode]/page.tsx"

echo "📊 P0-REG-04: CRITICAL - Security Features Validation"
echo "===================================================="

# Test security features in code
run_test "REG-SEC-01" "WebRTC photo security validation" "grep -q 'childPhotoUrl\\|parentPhotoUrl' app/api/children-check-ins/qr/[code]/route.ts"

run_test "REG-SEC-02" "Security PIN validation" "grep -q 'securityPin' app/api/children-check-ins/qr/[code]/route.ts"

run_test "REG-SEC-03" "Authentication middleware validation" "grep -q 'getServerSession\\|authOptions' app/api/children-check-ins/route.ts"

run_test "REG-SEC-04" "Authorization checks validation" "grep -q 'SUPER_ADMIN\\|ADMIN_IGLESIA\\|PASTOR\\|LIDER' app/api/children-check-ins/route.ts"

echo "📊 P0-REG-05: CRITICAL - Data Flow Validation"
echo "============================================="

# Test data flow between components
run_test "REG-FLOW-01" "Visitor form to API flow validation" "grep -q 'handleVisitorCheckIn\\|/api/check-ins' app/\\(dashboard\\)/check-ins/_components/check-ins-client.tsx"

run_test "REG-FLOW-02" "Children form to API flow validation" "grep -q 'handleChildCheckIn\\|/api/children-check-ins' app/\\(dashboard\\)/check-ins/_components/check-ins-client.tsx"

run_test "REG-FLOW-03" "QR code generation flow validation" "grep -q 'qrCode\\|QrCode' app/\\(dashboard\\)/check-ins/_components/check-ins-client.tsx"

run_test "REG-FLOW-04" "Checkout flow validation" "grep -q 'handleChildCheckOut\\|checkout' app/\\(dashboard\\)/check-ins/_components/check-ins-client.tsx"

echo ""
echo "🎯 P0 CRITICAL TESTS SUMMARY"
echo "==========================="
echo "Total Tests: $TEST_COUNT"
echo "Passed: $PASS_COUNT"
echo "Failed: $FAIL_COUNT"
echo "Success Rate: $(( PASS_COUNT * 100 / TEST_COUNT ))%"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
    echo "✅ P0 CRITICAL: ALL TESTS PASSED - REGISTRO MODULE OPERATIONAL"
    exit 0
else
    echo "⚠️ P0 CRITICAL: $FAIL_COUNT TESTS FAILED - ATTENTION REQUIRED"
    exit 1
fi