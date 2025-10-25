#!/bin/bash

# MEMBERS MODULE - P1 High Priority Safety & Security Tests
# Tests user workflows, data integrity, and member management security

echo "🎯 EJECUTANDO VALIDACIÓN P1 - MEMBERS MODULE (HIGH PRIORITY SAFETY)"
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

# Test 1: Member Data Safety
echo "🔒 CATEGORY 1: MEMBER DATA SAFETY"
echo "--------------------------------"

# Test member data validation
run_test "Member data validation rules" "node -e 'require(\"./tests/members-database-validator.js\").validateMemberDataSafety()'"

# Test email uniqueness enforcement
run_test "Email uniqueness validation" "node -e 'require(\"./tests/members-database-validator.js\").validateEmailUniqueness()'"

# Test phone number validation
run_test "Phone number format validation" "node -e 'require(\"./tests/members-database-validator.js\").validatePhoneNumberSafety()'"

# Test member status transitions
run_test "Member status transition safety" "node -e 'require(\"./tests/members-database-validator.js\").validateStatusTransitions()'"

echo "👥 CATEGORY 2: USER INTERACTION SAFETY"
echo "------------------------------------"

# Test user role permissions
run_test "User role permission validation" "node -e 'require(\"./tests/members-database-validator.js\").validateUserPermissions()'"

# Test member access control
run_test "Member access control" "node -e 'require(\"./tests/members-database-validator.js\").validateMemberAccessControl()'"

# Test bulk operation safety
run_test "Bulk operation safety validation" "node -e 'require(\"./tests/members-database-validator.js\").validateBulkOperationSafety()'"

# Test concurrent modification protection
run_test "Concurrent modification protection" "node -e 'require(\"./tests/members-database-validator.js\").validateConcurrentModification()'"

echo "📊 CATEGORY 3: PROFILE MANAGEMENT SAFETY"
echo "---------------------------------------"

# Test profile photo upload safety
run_test "Profile photo upload safety" "node -e 'require(\"./tests/members-database-validator.js\").validatePhotoUploadSafety()'"

# Test sensitive data handling
run_test "Sensitive data handling" "node -e 'require(\"./tests/members-database-validator.js\").validateSensitiveDataHandling()'"

# Test member deletion safety
run_test "Member deletion safety" "node -e 'require(\"./tests/members-database-validator.js\").validateDeletionSafety()'"

# Test member archival process
run_test "Member archival safety" "node -e 'require(\"./tests/members-database-validator.js\").validateArchivalSafety()'"

echo "🔄 CATEGORY 4: SPIRITUAL GROWTH SAFETY"
echo "-------------------------------------"

# Test spiritual assessment data safety
run_test "Spiritual assessment safety" "node -e 'require(\"./tests/members-database-validator.js\").validateSpiritualAssessmentSafety()'"

# Test ministry assignment safety
run_test "Ministry assignment safety" "node -e 'require(\"./tests/members-database-validator.js\").validateMinistryAssignmentSafety()'"

# Test spiritual gifts tracking
run_test "Spiritual gifts tracking safety" "node -e 'require(\"./tests/members-database-validator.js\").validateSpiritualGiftsTracking()'"

# Test leadership development safety
run_test "Leadership development safety" "node -e 'require(\"./tests/members-database-validator.js\").validateLeadershipDevelopmentSafety()'"

echo "📈 CATEGORY 5: COMMUNICATION SAFETY"
echo "----------------------------------"

# Test member communication safety
run_test "Member communication safety" "node -e 'require(\"./tests/members-database-validator.js\").validateCommunicationSafety()'"

# Test bulk email safety
run_test "Bulk email safety validation" "node -e 'require(\"./tests/members-database-validator.js\").validateBulkEmailSafety()'"

# Test contact information safety
run_test "Contact information safety" "node -e 'require(\"./tests/members-database-validator.js\").validateContactInfoSafety()'"

# Test notification preferences
run_test "Notification preferences safety" "node -e 'require(\"./tests/members-database-validator.js\").validateNotificationSafety()'"

echo "🔐 CATEGORY 6: INTEGRATION SAFETY"
echo "--------------------------------"

# Test volunteer system integration safety
run_test "Volunteer integration safety" "node -e 'require(\"./tests/members-database-validator.js\").validateVolunteerIntegrationSafety()'"

# Test event integration safety
run_test "Event integration safety" "node -e 'require(\"./tests/members-database-validator.js\").validateEventIntegrationSafety()'"

# Test financial integration safety
run_test "Financial integration safety" "node -e 'require(\"./tests/members-database-validator.js\").validateFinancialIntegrationSafety()'"

# Test reporting data safety
run_test "Reporting data safety" "node -e 'require(\"./tests/members-database-validator.js\").validateReportingDataSafety()'"

echo "=========================================="
echo "🎯 P1 HIGH PRIORITY SAFETY TEST RESULTS"
echo "=========================================="
echo "Total Tests: $TOTAL_TESTS"
echo "Passed: $PASSED_TESTS"
echo "Failed: $FAILED_TESTS"

if [ $FAILED_TESTS -eq 0 ]; then
    echo "✅ P1 STATUS: ALL SAFETY TESTS PASSED"
    echo "🛡️  Safety protocols are FULLY OPERATIONAL"
elif [ $FAILED_TESTS -le 2 ]; then
    echo "⚠️  P1 STATUS: $FAILED_TESTS MINOR SAFETY ISSUE(S)"
    echo "🔧 Safety protocols are MOSTLY OPERATIONAL"
else
    echo "❌ P1 STATUS: $FAILED_TESTS SAFETY TEST(S) FAILED"
    echo "⚠️  Safety protocols require immediate attention"
fi

SUCCESS_RATE=$(( (PASSED_TESTS * 100) / TOTAL_TESTS ))
echo "📊 P1 Success Rate: $SUCCESS_RATE%"
echo "=========================================="

exit $FAILED_TESTS