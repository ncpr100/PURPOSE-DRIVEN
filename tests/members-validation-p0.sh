#!/bin/bash

# MEMBERS MODULE - P0 Critical Infrastructure Tests
# Tests core database connectivity, API endpoints, and fundamental functionality

echo "🎯 EJECUTANDO VALIDACIÓN P0 - MEMBERS MODULE (CRITICAL INFRASTRUCTURE)"
echo "====================================================================="

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

# Test Member table exists and structure
run_test "Member table schema validation" "node -e 'require(\"./tests/members-database-validator.js\").validateMemberTable()'"

# Test Member relationships integrity
run_test "Member relationships validation" "node -e 'require(\"./tests/members-database-validator.js\").validateMemberRelationships()'"

# Test Member field types and constraints
run_test "Member field validation" "node -e 'require(\"./tests/members-database-validator.js\").validateMemberFields()'"

# Test spiritual profile relationships
run_test "Spiritual profile integration" "node -e 'require(\"./tests/members-database-validator.js\").validateSpiritualProfileIntegration()'"

echo "📡 CATEGORY 2: API ENDPOINTS VALIDATION"
echo "--------------------------------------"

# Test Members API endpoint accessibility
run_test "Members API endpoint exists" "test -f 'app/api/members/route.ts'"

# Test Member individual API endpoint
run_test "Individual member API exists" "test -f 'app/api/members/[id]/route.ts'"

# Test spiritual assessment API integration
run_test "Spiritual assessment API integration" "test -f 'app/api/spiritual-assessment/route.ts'"

# Test member spiritual profile API
run_test "Member spiritual profile API" "test -f 'app/api/member-spiritual-profile/route.ts'"

echo "🎨 CATEGORY 3: UI COMPONENTS VALIDATION"
echo "-------------------------------------"

# Test main members page exists
run_test "Members main page exists" "test -f 'app/(dashboard)/members/page.tsx'"

# Test members client component exists
run_test "Members client component exists" "test -f 'app/(dashboard)/members/_components/members-client.tsx'"

# Test member form components
run_test "Enhanced member form component" "test -f 'components/members/enhanced-member-form.tsx'"

# Test member import functionality
run_test "Member import dialog component" "node -e 'require(\"./tests/members-database-validator.js\").validateImportComponent()'"

echo "🔐 CATEGORY 4: SECURITY & AUTHENTICATION"
echo "---------------------------------------"

# Test authentication requirements
run_test "Members authentication protected" "node -e 'require(\"./tests/members-database-validator.js\").validateAuthentication()'"

# Test role-based access control
run_test "Members RBAC implementation" "node -e 'require(\"./tests/members-database-validator.js\").validateRBAC()'"

# Test member data privacy
run_test "Member data privacy validation" "node -e 'require(\"./tests/members-database-validator.js\").validateDataPrivacy()'"

# Test church isolation
run_test "Church data isolation" "node -e 'require(\"./tests/members-database-validator.js\").validateChurchIsolation()'"

echo "⚡ CATEGORY 5: DATA FLOW VALIDATION"
echo "---------------------------------"

# Test member creation flow
run_test "Member creation data flow" "node -e 'require(\"./tests/members-database-validator.js\").validateMemberCreationFlow()'"

# Test member update flow
run_test "Member update data flow" "node -e 'require(\"./tests/members-database-validator.js\").validateMemberUpdateFlow()'"

# Test member search and filtering
run_test "Member search functionality" "node -e 'require(\"./tests/members-database-validator.js\").validateSearchFiltering()'"

# Test bulk operations
run_test "Bulk operations functionality" "node -e 'require(\"./tests/members-database-validator.js\").validateBulkOperations()'"

echo "📊 CATEGORY 6: SPIRITUAL INTEGRATION"
echo "-----------------------------------"

# Test spiritual assessment integration
run_test "Spiritual assessment flow" "node -e 'require(\"./tests/members-database-validator.js\").validateSpiritualAssessmentFlow()'"

# Test ministry matching
run_test "Ministry matching functionality" "node -e 'require(\"./tests/members-database-validator.js\").validateMinistryMatching()'"

# Test volunteer recruitment integration
run_test "Volunteer recruitment integration" "node -e 'require(\"./tests/members-database-validator.js\").validateVolunteerIntegration()'"

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