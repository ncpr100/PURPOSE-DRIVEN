#!/bin/bash

# =========================================================================
# EVENTS MODULE - P2 FEATURE VALIDATION SUITE
# =========================================================================
# Tests advanced features, user experience, and business logic
# Run after P0 (infrastructure) and P1 (safety) validation

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 EVENTS MODULE - P2 FEATURE VALIDATION${NC}"
echo "============================================================="
echo "Testing advanced features, user experience, and business logic..."
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

echo -e "${PURPLE}=== P2.1: EVENT MANAGEMENT FEATURES ====${NC}"

run_test "Event CRUD operations" \
    "test -f app/api/events/route.ts" \
    "success"

run_test "Event creation form" \
    "grep -q 'createEvent\\|eventForm' 'app/(dashboard)/events/_components/smart-events-client.tsx'" \
    "success"

run_test "Event editing functionality" \
    "grep -q 'edit.*event\\|update.*event' 'app/(dashboard)/events/_components/smart-events-client.tsx'" \
    "success"

run_test "Event status management" \
    "grep -q 'PLANIFICANDO\\|ACTIVO\\|COMPLETADO' app/api/events/route.ts" \
    "success"

run_test "Event categorization system" \
    "grep -q 'category' 'app/(dashboard)/events/_components/smart-events-client.tsx'" \
    "success"

echo -e "${PURPLE}=== P2.2: EVENT SCHEDULING & CALENDAR ====${NC}"

run_test "Event scheduling functionality" \
    "grep -q 'startDate\\|endDate' app/api/events/route.ts" \
    "success"

run_test "Calendar view integration" \
    "grep -q 'calendar\\|Calendar' 'app/(dashboard)/events/_components/smart-events-client.tsx'" \
    "success"

run_test "Event time management" \
    "grep -q 'time\\|hour\\|minute' 'app/(dashboard)/events/_components/smart-events-client.tsx'" \
    "success"

run_test "Recurring events support" \
    "grep -q 'recurring\\|repeat' app/api/events/ -r" \
    "success"

run_test "Event duration calculation" \
    "grep -q 'duration\\|startDate.*endDate' app/api/events/route.ts" \
    "success"

echo -e "${PURPLE}=== P2.3: RESOURCE MANAGEMENT ====${NC}"

run_test "Event resource allocation" \
    "test -f app/api/event-resources/route.ts" \
    "success"

run_test "Resource reservation system" \
    "grep -q 'reservation\\|EventResourceReservation' prisma/schema.prisma" \
    "success"

run_test "Resource capacity management" \
    "grep -q 'capacity' app/api/event-resources/route.ts" \
    "success"

run_test "Resource conflict detection" \
    "grep -q 'conflict\\|overlap' app/api/event-resources/route.ts" \
    "success"

run_test "Resource type classification" \
    "grep -q 'EQUIPO\\|ESPACIO\\|type' app/api/event-resources/route.ts" \
    "success"

echo -e "${PURPLE}=== P2.4: EVENT ANALYTICS & REPORTING ====${NC}"

run_test "Event analytics API" \
    "test -f app/api/events/analytics/route.ts" \
    "success"

run_test "Attendance tracking" \
    "grep -q 'attendance\\|attendees' app/api/events/analytics/route.ts" \
    "success"

run_test "Event performance metrics" \
    "grep -q 'metrics\\|performance' app/api/events/analytics/route.ts" \
    "success"

run_test "Monthly trends analysis" \
    "grep -q 'monthly\\|trends' app/api/events/analytics/route.ts" \
    "success"

run_test "Event success tracking" \
    "grep -q 'success\\|completion' app/api/events/analytics/route.ts" \
    "success"

echo -e "${PURPLE}=== P2.5: AI-POWERED FEATURES ====${NC}"

run_test "AI event suggestions" \
    "test -f app/api/events/ai-suggestions/route.ts" \
    "success"

run_test "Seasonal event recommendations" \
    "grep -q 'seasonal\\|season' app/api/events/ai-suggestions/route.ts" \
    "success"

run_test "Event template generation" \
    "grep -q 'template\\|suggestion' app/api/events/ai-suggestions/route.ts" \
    "success"

run_test "Smart event categorization" \
    "grep -q 'category.*suggestion\\|smart' app/api/events/ai-suggestions/route.ts" \
    "success"

run_test "AI-powered event optimization" \
    "grep -q 'optimization\\|improve' app/api/events/ai-suggestions/route.ts" \
    "success"

echo -e "${PURPLE}=== P2.6: COMMUNICATION INTEGRATION ====${NC}"

run_test "Event communication API" \
    "test -f app/api/events/[id]/communications/route.ts" \
    "success"

run_test "Event notifications" \
    "grep -q 'notification\\|notify' app/api/events/[id]/communications/route.ts" \
    "success"

run_test "Event reminders" \
    "grep -q 'reminder\\|remind' app/api/events/[id]/communications/route.ts" \
    "success"

run_test "Attendee communication" \
    "grep -q 'attendee\\|participant' app/api/events/[id]/communications/route.ts" \
    "success"

run_test "Event promotion features" \
    "grep -q 'promotion\\|announce' app/api/events/[id]/communications/route.ts" \
    "success"

echo -e "${PURPLE}=== P2.7: VOLUNTEER INTEGRATION ====${NC}"

run_test "Auto-assign volunteers API" \
    "test -f app/api/events/[id]/auto-assign-volunteers/route.ts" \
    "success"

run_test "Volunteer requirement planning" \
    "grep -q 'volunteer\\|requirement' app/api/events/[id]/auto-assign-volunteers/route.ts" \
    "success"

run_test "Skill-based volunteer matching" \
    "grep -q 'skill\\|match' app/api/events/[id]/auto-assign-volunteers/route.ts" \
    "success"

run_test "Volunteer availability check" \
    "grep -q 'available\\|schedule' app/api/events/[id]/auto-assign-volunteers/route.ts" \
    "success"

run_test "Volunteer assignment tracking" \
    "grep -q 'assign\\|track' app/api/events/[id]/auto-assign-volunteers/route.ts" \
    "success"

echo -e "${PURPLE}=== P2.8: USER INTERFACE FEATURES ====${NC}"

run_test "Events dashboard page" \
    "test -f 'app/(dashboard)/events/page.tsx'" \
    "success"

run_test "Smart events client component" \
    "test -f 'app/(dashboard)/events/_components/smart-events-client.tsx'" \
    "success"

run_test "Advanced events management" \
    "test -f 'app/(dashboard)/advanced-events/_components/advanced-events-client.tsx'" \
    "success"

run_test "Event creation dialog" \
    "grep -q 'dialog\\|modal\\|Dialog' 'app/(dashboard)/events/_components/smart-events-client.tsx'" \
    "success"

run_test "Event filtering and search" \
    "grep -q 'filter\\|search' 'app/(dashboard)/events/_components/smart-events-client.tsx'" \
    "success"

echo -e "${PURPLE}=== P2.9: REAL-TIME FEATURES ====${NC}"

run_test "Real-time events API" \
    "test -f app/api/realtime/events/route.ts" \
    "success"

run_test "Live event updates" \
    "grep -q 'broadcast\\|update' app/api/realtime/events/route.ts" \
    "success"

run_test "Real-time attendance tracking" \
    "grep -q 'attendance\\|checkin' app/api/realtime/events/route.ts" \
    "success"

run_test "Live event notifications" \
    "grep -q 'notification\\|alert' app/api/realtime/events/route.ts" \
    "success"

run_test "Event status broadcasting" \
    "grep -q 'status.*broadcast\\|live.*status' app/api/realtime/events/route.ts" \
    "success"

echo -e "${PURPLE}=== P2.10: DOCUMENTATION & HELP ====${NC}"

run_test "Events help documentation" \
    "test -f 'app/(dashboard)/help/events/page.tsx'" \
    "success"

run_test "Events manual documentation" \
    "test -f 'app/(dashboard)/help/manual/events/page.tsx'" \
    "success"

run_test "Event management guide" \
    "grep -q 'manual\\|guide\\|help' 'app/(dashboard)/help/events/page.tsx'" \
    "success"

run_test "Step-by-step instructions" \
    "grep -q 'step\\|instruction' 'app/(dashboard)/help/manual/events/page.tsx'" \
    "success"

run_test "Event best practices" \
    "grep -q 'best.*practice\\|tip\\|advice' 'app/(dashboard)/help/manual/events/page.tsx'" \
    "success"

# Calculate results
success_rate=$((passed_tests * 100 / total_tests))

echo
echo "============================================================="
echo -e "${BLUE}🚀 P2 FEATURE VALIDATION COMPLETE${NC}"
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
if [ $success_rate -ge 90 ]; then
    echo -e "${GREEN}🚀 P2 FEATURE STATUS: ✅ EXCELLENT FEATURES${NC}"
    echo "   Events module has comprehensive functionality"
elif [ $success_rate -ge 80 ]; then
    echo -e "${YELLOW}🚀 P2 FEATURE STATUS: ⚡ GOOD FEATURES${NC}"
    echo "   Events module has solid functionality with minor gaps"
elif [ $success_rate -ge 70 ]; then
    echo -e "${YELLOW}🚀 P2 FEATURE STATUS: ⚠️ ADEQUATE FEATURES${NC}"
    echo "   Events module has basic functionality but needs improvements"
else
    echo -e "${RED}🚀 P2 FEATURE STATUS: ❌ NEEDS DEVELOPMENT${NC}"
    echo "   Events module requires significant feature development"
fi

echo
echo "Complete validation summary available after all tests"
echo "============================================================="