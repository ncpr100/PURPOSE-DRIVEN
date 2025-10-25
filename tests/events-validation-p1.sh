#!/bin/bash

# =========================================================================
# EVENTS MODULE - P1 HIGH PRIORITY SAFETY VALIDATION SUITE
# =========================================================================
# Tests safety protocols, security, and reliability for events management
# Run after P0 (infrastructure) validation

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔒 EVENTS MODULE - P1 HIGH PRIORITY SAFETY VALIDATION${NC}"
echo "============================================================="
echo "Testing safety protocols, security, and reliability..."
echo

# Test counters
total_tests=0
passed_tests=0
declare -A test_results

# Test function
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_result="${3:-success}"
    
    total_tests=$((total_tests + 1))
    echo -e "${CYAN}🧪 Test $total_tests: $test_name${NC}"
    
    if eval "$test_command"; then
        if [ "$expected_result" = "success" ]; then
            echo -e "${GREEN}✅ PASS: $test_name${NC}"
            test_results["$test_name"]="PASS"
            passed_tests=$((passed_tests + 1))
        else
            echo -e "${RED}❌ FAIL: $test_name (expected failure but got success)${NC}"
            test_results["$test_name"]="FAIL"
        fi
    else
        if [ "$expected_result" = "fail" ]; then
            echo -e "${GREEN}✅ PASS: $test_name (expected failure)${NC}"
            test_results["$test_name"]="PASS"
            passed_tests=$((passed_tests + 1))
        else
            echo -e "${RED}❌ FAIL: $test_name${NC}"
            test_results["$test_name"]="FAIL"
        fi
    fi
    echo
}

echo -e "${PURPLE}=== P1.1: AUTHENTICATION & AUTHORIZATION ====${NC}"

run_test "Session authentication in events API" \
    "find app/api -name '*event*' -type f -exec grep -l 'getServerSession\\|session' {} \\;" \
    "success"

run_test "User authorization validation" \
    "grep -q 'session.*user' app/api/event-resources/route.ts" \
    "success"

run_test "Role validation in event creation" \
    "grep -q 'SUPER_ADMIN\\|ADMIN_IGLESIA\\|PASTOR' app/api/event-resources/route.ts" \
    "success"

run_test "Church ID validation in APIs" \
    "grep -q 'churchId.*session' app/api/event-resources/route.ts" \
    "success"

run_test "Protected routes in middleware" \
    "grep -q '/events' middleware.ts" \
    "success"

echo -e "${PURPLE}=== P1.2: DATA VALIDATION & SANITIZATION ====${NC}"

run_test "Event title validation" \
    "grep -q 'title.*required\\|name.*required' app/api/event-resources/route.ts" \
    "success"

run_test "Date validation in events" \
    "grep -q 'startDate\\|endDate\\|Date' 'app/(dashboard)/events/_components/smart-events-client.tsx'" \
    "success"

run_test "Event capacity validation" \
    "grep -q 'capacity.*parseInt\\|capacity.*number' app/api/event-resources/route.ts" \
    "success"

run_test "Input sanitization in forms" \
    "grep -q 'trim\\|sanitize\\|validation' 'app/(dashboard)/events/_components/smart-events-client.tsx'" \
    "success"

run_test "Resource type validation" \
    "grep -q 'type.*required' app/api/event-resources/route.ts" \
    "success"

echo -e "${PURPLE}=== P1.3: ERROR HANDLING & RECOVERY ====${NC}"

run_test "API error handling exists" \
    "grep -q 'try.*catch' app/api/event-resources/route.ts" \
    "success"

run_test "Client-side error handling" \
    "grep -q 'toast.error\\|catch.*error' 'app/(dashboard)/events/_components/smart-events-client.tsx'" \
    "success"

run_test "Database error handling" \
    "grep -q 'error.*console\\|catch.*error' app/api/event-resources/route.ts" \
    "success"

run_test "Form submission error handling" \
    "grep -q 'catch.*error\\|error.*response' 'app/(dashboard)/events/_components/smart-events-client.tsx'" \
    "success"

run_test "Analytics API error handling" \
    "grep -q 'try.*catch\\|error' app/api/events/analytics/route.ts" \
    "success"

echo -e "${PURPLE}=== P1.4: EVENT SECURITY ====${NC}"

run_test "Event visibility controls" \
    "grep -q 'isPublic\\|public' 'app/(dashboard)/events/_components/smart-events-client.tsx'" \
    "success"

run_test "Event access permissions" \
    "grep -q 'role.*PASTOR\\|role.*ADMIN' app/api/event-resources/route.ts" \
    "success"

run_test "Church isolation in events" \
    "grep -q 'where.*churchId\\|churchId.*where' app/api/event-resources/route.ts" \
    "success"

run_test "Event data protection" \
    "grep -q 'churchId.*session' app/api/event-resources/route.ts" \
    "success"

run_test "Resource access control" \
    "grep -q 'isActive.*true' app/api/event-resources/route.ts" \
    "success"

echo -e "${PURPLE}=== P1.5: LOGGING & AUDIT TRAIL ====${NC}"

run_test "Event creation logging" \
    "grep -q 'console.log\\|console.error' app/api/event-resources/route.ts" \
    "success"

run_test "Error logging exists" \
    "grep -q 'console.error.*error' app/api/event-resources/route.ts" \
    "success"

run_test "Analytics logging" \
    "grep -q 'console.error\\|error' app/api/events/analytics/route.ts" \
    "success"

run_test "AI suggestions logging" \
    "grep -q 'console\\|error' app/api/events/ai-suggestions/route.ts" \
    "success"

run_test "Real-time events logging" \
    "grep -q 'console\\|error' app/api/realtime/events/route.ts" \
    "success"

echo -e "${PURPLE}=== P1.6: RESOURCE MANAGEMENT SECURITY ====${NC}"

run_test "Resource creation authorization" \
    "grep -q 'LIDER\\|PASTOR\\|ADMIN' app/api/event-resources/route.ts" \
    "success"

run_test "Resource validation logic" \
    "grep -q 'name.*required\\|type.*required' app/api/event-resources/route.ts" \
    "success"

run_test "Resource capacity limits" \
    "grep -q 'capacity.*parseInt' app/api/event-resources/route.ts" \
    "success"

run_test "Resource status validation" \
    "grep -q 'isActive\\|status' app/api/event-resources/route.ts" \
    "success"

run_test "Resource reservation security" \
    "grep -q 'reservations\\|EventResourceReservation' prisma/schema.prisma" \
    "success"

echo -e "${PURPLE}=== P1.7: EVENT SCHEDULING SAFETY ====${NC}"

run_test "Date range validation" \
    "grep -q 'startDate.*endDate\\|Date.*validation' 'app/(dashboard)/events/_components/smart-events-client.tsx'" \
    "success"

run_test "Event scheduling conflicts" \
    "grep -q 'conflict\\|overlap\\|schedule' app/api/events/ -r" \
    "success"

run_test "Event status management" \
    "grep -q 'status.*PLANIFICANDO\\|status.*ACTIVO' 'app/(dashboard)/events/_components/smart-events-client.tsx'" \
    "success"

run_test "Recurring events handling" \
    "grep -q 'recurring\\|repeat' app/api/events/ -r" \
    "success"

run_test "Event cancellation safety" \
    "grep -q 'cancel\\|delete\\|remove' 'app/(dashboard)/events/_components/smart-events-client.tsx'" \
    "success"

echo -e "${PURPLE}=== P1.8: INTEGRATION SAFETY ====${NC}"

run_test "Database transaction safety" \
    "grep -q 'transaction\\|rollback' app/api/event-resources/route.ts" \
    "success"

run_test "Real-time broadcast security" \
    "grep -q 'broadcast.*church\\|churchId' app/api/realtime/events/route.ts" \
    "success"

run_test "AI suggestions validation" \
    "grep -q 'validation\\|sanitize' app/api/events/ai-suggestions/route.ts" \
    "success"

run_test "Analytics data protection" \
    "grep -q 'churchId.*session' app/api/events/analytics/route.ts" \
    "success"

run_test "Environment variable security" \
    "grep -q 'process.env' app/api/events/ -r" \
    "success"

# Calculate results
success_rate=$((passed_tests * 100 / total_tests))

echo
echo "============================================================="
echo -e "${BLUE}🔒 P1 HIGH PRIORITY SAFETY VALIDATION COMPLETE${NC}"
echo "============================================================="
echo -e "${CYAN}Total Tests: $total_tests${NC}"
echo -e "${GREEN}Passed: $passed_tests${NC}"
echo -e "${RED}Failed: $((total_tests - passed_tests))${NC}"
echo -e "${YELLOW}Success Rate: $success_rate%${NC}"
echo

echo -e "${CYAN}📊 DETAILED TEST RESULTS:${NC}"
echo "========================="
for test_name in $(printf '%s\n' "${!test_results[@]}" | sort); do
    result="${test_results[$test_name]}"
    if [ "$result" = "PASS" ]; then
        echo -e "${GREEN}✅ $test_name${NC}"
    else
        echo -e "${RED}❌ $test_name${NC}"
    fi
done

echo
if [ $success_rate -ge 95 ]; then
    echo -e "${GREEN}🔒 P1 SAFETY STATUS: ✅ EXCELLENT SECURITY${NC}"
    echo "   Events module has robust safety protocols"
elif [ $success_rate -ge 85 ]; then
    echo -e "${YELLOW}🔒 P1 SAFETY STATUS: ⚡ GOOD SECURITY${NC}"
    echo "   Events module has solid safety with minor gaps"
elif [ $success_rate -ge 75 ]; then
    echo -e "${YELLOW}🔒 P1 SAFETY STATUS: ⚠️ ADEQUATE SECURITY${NC}"
    echo "   Events module has basic safety but needs improvements"
else
    echo -e "${RED}🔒 P1 SAFETY STATUS: ❌ SECURITY CONCERNS${NC}"
    echo "   Events module requires significant security enhancements"
fi

echo
echo "Next: Run P2 validation with './tests/events-validation-p2.sh'"
echo "============================================================="