#!/bin/bash

# SEGUIMIENTO MODULE - P0 Critical Infrastructure Tests
# Tests core database connectivity, API endpoints, and fundamental functionality

echo "🎯 EJECUTANDO VALIDACIÓN P0 - SEGUIMIENTO MODULE (CRITICAL INFRASTRUCTURE)"
echo "=================================================================="

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

# Test visitor follow-ups table exists
run_test "VisitorFollowUp table exists" "node -e 'require(\"./tests/seguimiento-database-validator.js\").validateTable(\"visitorFollowUp\")'"

# Test follow-up relationships
run_test "FollowUp relationships integrity" "node -e 'require(\"./tests/seguimiento-database-validator.js\").validateRelationships()'"

# Test follow-up status enumeration
run_test "FollowUp status enum validation" "node -e 'require(\"./tests/seguimiento-database-validator.js\").validateStatusEnum()'"

# Test follow-up type enumeration
run_test "FollowUp type enum validation" "node -e 'require(\"./tests/seguimiento-database-validator.js\").validateTypeEnum()'"

echo "📡 CATEGORY 2: API ENDPOINTS VALIDATION"
echo "--------------------------------------"

# Test follow-ups API endpoint accessibility
run_test "Follow-ups API endpoint exists" "test -f 'app/api/visitor-follow-ups/route.ts'"

# Test follow-ups update API endpoint
run_test "Follow-ups update API endpoint exists" "test -f 'app/api/visitor-follow-ups/[id]/route.ts'"

# Test API route structure validation
run_test "Follow-ups API routes structure" "node -e 'require(\"./tests/seguimiento-database-validator.js\").validateAPIStructure()'"

echo "🎨 CATEGORY 3: UI COMPONENTS VALIDATION"
echo "-------------------------------------"

# Test main follow-ups page exists
run_test "Follow-ups main page exists" "test -f 'app/(dashboard)/follow-ups/page.tsx'"

# Test follow-ups client component exists
run_test "Follow-ups client component exists" "test -f 'app/(dashboard)/follow-ups/_components/follow-ups-client.tsx'"

# Test component structure validation
run_test "Follow-ups component structure" "node -e 'require(\"./tests/seguimiento-database-validator.js\").validateComponentStructure()'"

echo "🔐 CATEGORY 4: SECURITY & AUTHENTICATION"
echo "---------------------------------------"

# Test authentication requirements
run_test "Follow-ups authentication protected" "node -e 'require(\"./tests/seguimiento-database-validator.js\").validateAuthentication()'"

# Test role-based access control
run_test "Follow-ups RBAC implementation" "node -e 'require(\"./tests/seguimiento-database-validator.js\").validateRBAC()'"

# Test session validation
run_test "Follow-ups session validation" "node -e 'require(\"./tests/seguimiento-database-validator.js\").validateSessionSecurity()'"

echo "⚡ CATEGORY 5: DATA FLOW VALIDATION"
echo "---------------------------------"

# Test follow-up creation flow
run_test "Follow-up creation data flow" "node -e 'require(\"./tests/seguimiento-database-validator.js\").validateCreationFlow()'"

# Test follow-up update flow
run_test "Follow-up update data flow" "node -e 'require(\"./tests/seguimiento-database-validator.js\").validateUpdateFlow()'"

# Test follow-up filtering system
run_test "Follow-up filtering functionality" "node -e 'require(\"./tests/seguimiento-database-validator.js\").validateFilteringSystem()'"

echo "============================================"
echo "🎯 P0 CRITICAL INFRASTRUCTURE TEST RESULTS"
echo "============================================"
echo "Total Tests: $TOTAL_TESTS"
echo "Passed: $PASSED_TESTS"
echo "Failed: $FAILED_TESTS"

if [ $FAILED_TESTS -eq 0 ]; then
    echo "✅ P0 STATUS: ALL CRITICAL TESTS PASSED"
    echo "🎉 Infrastructure is FULLY OPERATIONAL"
else
    echo "❌ P0 STATUS: $FAILED_TESTS CRITICAL TEST(S) FAILED"
    echo "⚠️  Infrastructure requires immediate attention"
fi

SUCCESS_RATE=$(( (PASSED_TESTS * 100) / TOTAL_TESTS ))
echo "📊 P0 Success Rate: $SUCCESS_RATE%"
echo "============================================"

exit $FAILED_TESTS