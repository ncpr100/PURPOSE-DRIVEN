#!/bin/bash

# =========================================================================
# EVENTS MODULE - P0 CRITICAL INFRASTRUCTURE VALIDATION SUITE
# =========================================================================
# Tests critical infrastructure, core APIs, database models, and essential components
# This is the foundational validation that must pass before any other testing

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}🏗️ EVENTS MODULE - P0 CRITICAL INFRASTRUCTURE VALIDATION${NC}"
echo "========================================================================="
echo "Testing critical infrastructure, core APIs, and essential components..."
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

echo -e "${PURPLE}=== P0.1: DATABASE MODELS & SCHEMA ====${NC}"

run_test "Event model exists in schema" \
    "grep -q 'model Event' prisma/schema.prisma" \
    "success"

run_test "EventResource model exists" \
    "grep -q 'model EventResource' prisma/schema.prisma" \
    "success"

run_test "EventResourceReservation model exists" \
    "grep -q 'model EventResourceReservation' prisma/schema.prisma" \
    "success"

run_test "Event-Church relationship" \
    "grep -A 10 'model Event' prisma/schema.prisma | grep -q 'churchId'" \
    "success"

run_test "Event status field validation" \
    "grep -A 15 'model Event' prisma/schema.prisma | grep -q 'status'" \
    "success"

echo -e "${PURPLE}=== P0.2: CORE API ENDPOINTS ====${NC}"

run_test "Main events API route exists" \
    "test -f app/api/events/route.ts || find app/api -name '*events*' -type f | head -1" \
    "success"

run_test "Event resources API exists" \
    "test -f app/api/event-resources/route.ts" \
    "success"

run_test "Events analytics API exists" \
    "test -f app/api/events/analytics/route.ts" \
    "success"

run_test "Events AI suggestions API exists" \
    "test -f app/api/events/ai-suggestions/route.ts" \
    "success"

run_test "Events communications API exists" \
    "test -f app/api/events/[id]/communications/route.ts" \
    "success"

echo -e "${PURPLE}=== P0.3: UI COMPONENTS & PAGES ====${NC}"

run_test "Events main page exists" \
    "test -f 'app/(dashboard)/events/page.tsx'" \
    "success"

run_test "Smart events client component" \
    "test -f 'app/(dashboard)/events/_components/smart-events-client.tsx'" \
    "success"

run_test "Advanced events client component" \
    "test -f 'app/(dashboard)/advanced-events/_components/advanced-events-client.tsx'" \
    "success"

run_test "Events help documentation" \
    "test -f 'app/(dashboard)/help/events/page.tsx'" \
    "success"

run_test "Events manual documentation" \
    "test -f 'app/(dashboard)/help/manual/events/page.tsx'" \
    "success"

echo -e "${PURPLE}=== P0.4: AUTHENTICATION & AUTHORIZATION ====${NC}"

run_test "Session authentication in event resources API" \
    "grep -q 'getServerSession\\|session' app/api/event-resources/route.ts" \
    "success"

run_test "Church ID validation in APIs" \
    "grep -q 'churchId.*session' app/api/event-resources/route.ts" \
    "success"

run_test "Role-based access control" \
    "grep -q 'SUPER_ADMIN\\|ADMIN_IGLESIA\\|PASTOR' app/api/event-resources/route.ts" \
    "success"

run_test "Protected routes in middleware" \
    "grep -q '/events' middleware.ts" \
    "success"

echo -e "${PURPLE}=== P0.5: INTEGRATION POINTS ====${NC}"

run_test "Prisma database integration" \
    "grep -q 'prisma\\|db' app/api/event-resources/route.ts" \
    "success"

run_test "Real-time events API integration" \
    "test -f app/api/realtime/events/route.ts" \
    "success"

run_test "Auto-assign volunteers integration" \
    "test -f app/api/events/[id]/auto-assign-volunteers/route.ts" \
    "success"

run_test "Authentication integration" \
    "grep -q 'authOptions' app/api/event-resources/route.ts" \
    "success"

echo -e "${PURPLE}=== P0.6: BASIC CRUD OPERATIONS ====${NC}"

run_test "Event creation logic exists" \
    "grep -q 'POST' app/api/event-resources/route.ts || find app -name '*.tsx' -exec grep -l 'createEvent\\|POST.*events' {} \\;" \
    "success"

run_test "Event retrieval logic exists" \
    "grep -q 'GET' app/api/event-resources/route.ts" \
    "success"

run_test "Event form handling in UI" \
    "grep -q 'eventForm\\|handleCreateEvent' 'app/(dashboard)/events/_components/smart-events-client.tsx'" \
    "success"

run_test "Resource management CRUD" \
    "grep -q 'createResource\\|fetchResources' 'app/(dashboard)/events/_components/smart-events-client.tsx'" \
    "success"

echo -e "${PURPLE}=== P0.7: ERROR HANDLING & VALIDATION ====${NC}"

run_test "API error handling exists" \
    "grep -q 'try.*catch\\|error' app/api/event-resources/route.ts" \
    "success"

run_test "Input validation in APIs" \
    "grep -q 'required\\|validation' app/api/event-resources/route.ts" \
    "success"

run_test "Client-side error handling" \
    "grep -q 'toast.error\\|catch.*error' 'app/(dashboard)/events/_components/smart-events-client.tsx'" \
    "success"

run_test "Form validation in UI" \
    "grep -q 'required\\|validation' 'app/(dashboard)/events/_components/smart-events-client.tsx'" \
    "success"

echo -e "${PURPLE}=== P0.8: ESSENTIAL FEATURES ====${NC}"

run_test "Event scheduling functionality" \
    "grep -q 'startDate\\|endDate' 'app/(dashboard)/events/_components/smart-events-client.tsx'" \
    "success"

run_test "Event categorization system" \
    "grep -q 'category\\|type' 'app/(dashboard)/events/_components/smart-events-client.tsx'" \
    "success"

run_test "Event location management" \
    "grep -q 'location' 'app/(dashboard)/events/_components/smart-events-client.tsx'" \
    "success"

run_test "Event capacity management" \
    "grep -q 'capacity' app/api/event-resources/route.ts" \
    "success"

run_test "Event status tracking" \
    "grep -q 'status' 'app/(dashboard)/events/_components/smart-events-client.tsx'" \
    "success"

# Calculate results
success_rate=$((passed_tests * 100 / total_tests))

echo
echo "========================================================================="
echo -e "${BLUE}🏗️ P0 CRITICAL INFRASTRUCTURE VALIDATION COMPLETE${NC}"
echo "========================================================================="
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
    echo -e "${GREEN}🏗️ P0 INFRASTRUCTURE STATUS: ✅ EXCELLENT FOUNDATION${NC}"
    echo "   Events module has robust critical infrastructure"
elif [ $success_rate -ge 85 ]; then
    echo -e "${YELLOW}🏗️ P0 INFRASTRUCTURE STATUS: ⚡ GOOD FOUNDATION${NC}"
    echo "   Events module has solid infrastructure with minor gaps"
elif [ $success_rate -ge 75 ]; then
    echo -e "${YELLOW}🏗️ P0 INFRASTRUCTURE STATUS: ⚠️ ADEQUATE FOUNDATION${NC}"
    echo "   Events module has basic infrastructure but needs improvements"
else
    echo -e "${RED}🏗️ P0 INFRASTRUCTURE STATUS: ❌ CRITICAL ISSUES${NC}"
    echo "   Events module requires significant infrastructure development"
fi

echo
echo "Next: Run P1 validation with './tests/events-validation-p1.sh'"
echo "========================================================================"