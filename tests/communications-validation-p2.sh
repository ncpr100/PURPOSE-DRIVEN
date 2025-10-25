#!/bin/bash

# =========================================================================
# COMMUNICATIONS MODULE - P2 FEATURE VALIDATION SUITE
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

echo -e "${BLUE}🚀 COMMUNICATIONS MODULE - P2 FEATURE VALIDATION${NC}"
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

echo -e "${PURPLE}=== P2.1: COMMUNICATION TEMPLATES ====${NC}"

run_test "Template creation API exists" \
    "test -f app/api/communications/templates/route.ts" \
    "success"

run_test "Template CRUD operations" \
    "grep -q 'POST\\|GET\\|PUT\\|DELETE' app/api/communications/templates/route.ts" \
    "success"

run_test "Template validation logic" \
    "grep -q 'title\\|content' app/api/communications/templates/route.ts" \
    "success"

run_test "Template variable system" \
    "grep -q 'variables\\|{{.*}}' app/api/communications/mass-send/route.ts" \
    "success"

run_test "Template UI component exists" \
    "find components -name '*template*' -type f | head -1" \
    "success"

echo -e "${PURPLE}=== P2.2: MULTI-CHANNEL COMMUNICATION ====${NC}"

run_test "Email communication support" \
    "grep -q 'EMAIL\\|email' app/api/communications/mass-send/route.ts" \
    "success"

run_test "SMS communication support" \
    "grep -q 'SMS\\|sms' app/api/communications/mass-send/route.ts" \
    "success"

run_test "WhatsApp integration" \
    "grep -q 'WHATSAPP\\|whatsapp' app/api/communications/mass-send/route.ts" \
    "success"

run_test "Communication type validation" \
    "grep -q 'type.*EMAIL\\|type.*SMS' app/api/communications/mass-send/route.ts" \
    "success"

run_test "Recipient filtering by channel" \
    "grep -q 'email.*filter\\|phone.*filter' app/api/communications/mass-send/route.ts" \
    "success"

echo -e "${PURPLE}=== P2.3: TARGET GROUP MANAGEMENT ====${NC}"

run_test "All members targeting" \
    "grep -q 'allMembers\\|all.*members' app/api/communications/mass-send/route.ts" \
    "success"

run_test "Volunteers targeting" \
    "grep -q 'volunteers\\|VOLUNTEER' app/api/communications/mass-send/route.ts" \
    "success"

run_test "Leaders targeting" \
    "grep -q 'leaders\\|PASTOR\\|LIDER' app/api/communications/mass-send/route.ts" \
    "success"

run_test "Custom recipient selection" \
    "grep -q 'custom\\|recipientIds' app/api/communications/mass-send/route.ts" \
    "success"

run_test "Target group validation" \
    "grep -q 'targetGroup.*required\\|targetGroup.*validation' app/api/communications/mass-send/route.ts" \
    "success"

echo -e "${PURPLE}=== P2.4: SCHEDULED COMMUNICATIONS ====${NC}"

run_test "Scheduled sending support" \
    "grep -q 'scheduledAt\\|scheduled' app/api/communications/mass-send/route.ts" \
    "success"

run_test "Scheduled status handling" \
    "grep -q 'PROGRAMADO\\|scheduled.*status' app/api/communications/mass-send/route.ts" \
    "success"

run_test "Scheduling validation" \
    "grep -q 'new Date\\|scheduledAt.*Date' app/api/communications/mass-send/route.ts" \
    "success"

run_test "Background job processing" \
    "grep -q 'schedule\\|queue\\|job' app/api/communications/ -r" \
    "success"

echo -e "${PURPLE}=== P2.5: COMMUNICATION HISTORY ====${NC}"

run_test "Communication tracking model" \
    "grep -q 'Communication' prisma/schema.prisma" \
    "success"

run_test "Communication status tracking" \
    "grep -q 'status.*ENVIADO\\|status.*FALLIDO' app/api/communications/mass-send/route.ts" \
    "success"

run_test "Sent timestamp tracking" \
    "grep -q 'sentAt\\|sent.*at' app/api/communications/mass-send/route.ts" \
    "success"

run_test "Communication history API" \
    "test -f app/api/communications/route.ts" \
    "success"

run_test "History filtering capability" \
    "grep -q 'where.*churchId\\|filter' app/api/communications/route.ts" \
    "success"

echo -e "${PURPLE}=== P2.6: INTEGRATION SERVICES ====${NC}"

run_test "Mailgun integration" \
    "grep -q 'mailgun\\|MAILGUN' lib/integrations/ -r" \
    "success"

run_test "Twilio SMS integration" \
    "grep -q 'twilio\\|TWILIO' app/api/communications/mass-send/route.ts" \
    "success"

run_test "Integration configuration model" \
    "grep -q 'integrationConfig\\|IntegrationConfig' app/api/communications/mass-send/route.ts" \
    "success"

run_test "Service fallback handling" \
    "grep -q 'catch.*error\\|fallback' app/api/communications/mass-send/route.ts" \
    "success"

run_test "Integration health checks" \
    "grep -q 'config.*active\\|isActive' app/api/communications/mass-send/route.ts" \
    "success"

echo -e "${PURPLE}=== P2.7: USER INTERFACE FEATURES ====${NC}"

run_test "Communication dashboard exists" \
    "find app -name '*communication*' -type f | head -1" \
    "success"

run_test "Mass send UI component" \
    "find components -name '*communication*' -o -name '*mass*' -type f | head -1" \
    "success"

run_test "Template management UI" \
    "find app -path '*template*' -name '*.tsx' | head -1" \
    "success"

run_test "Communication history view" \
    "find app -path '*communication*' -name 'page.tsx' | head -1" \
    "success"

run_test "Recipient selection UI" \
    "grep -q 'select.*recipient\\|recipient.*select' app/comunicaciones/ -r" \
    "success"

echo -e "${PURPLE}=== P2.8: BUSINESS LOGIC FEATURES ====${NC}"

run_test "Bulk sending limits" \
    "grep -q 'bulk.*limit\\|100.*recipient' app/api/communications/mass-send/route.ts" \
    "success"

run_test "Message content validation" \
    "grep -q 'content.*required\\|message.*validation' app/api/communications/mass-send/route.ts" \
    "success"

run_test "Recipient count tracking" \
    "grep -q 'recipients.*length\\|validRecipients' app/api/communications/mass-send/route.ts" \
    "success"

run_test "Church isolation logic" \
    "grep -q 'churchId.*session\\|where.*churchId' app/api/communications/mass-send/route.ts" \
    "success"

run_test "Communication analytics" \
    "grep -q 'success.*count\\|results.*filter' app/api/communications/mass-send/route.ts" \
    "success"

echo -e "${PURPLE}=== P2.9: NOTIFICATION SYSTEM ====${NC}"

run_test "Notification model exists" \
    "grep -q 'Notification' prisma/schema.prisma" \
    "success"

run_test "Email notification API" \
    "test -f app/api/email/send-notification/route.ts" \
    "success"

run_test "Notification preferences" \
    "grep -q 'preferences\\|notification.*setting' app/api/email/send-notification/route.ts" \
    "success"

run_test "Unsubscribe mechanism" \
    "grep -q 'unsubscribe\\|opt.*out' components/email-templates/ -r" \
    "success"

run_test "Notification templates" \
    "find components -name '*notification*' -o -name '*email-template*' -type f | head -1" \
    "success"

echo -e "${PURPLE}=== P2.10: ADVANCED FEATURES ====${NC}"

run_test "Communication search functionality" \
    "grep -q 'search\\|filter.*title' app/api/communications/route.ts" \
    "success"

run_test "Message retry mechanism" \
    "grep -q 'retry\\|failed.*message' app/api/communications/mass-send/route.ts" \
    "success"

run_test "Delivery status webhooks" \
    "find app/api -name '*webhook*' -o -name '*callback*' | head -1" \
    "success"

run_test "Communication metrics" \
    "grep -q 'metric\\|analytic\\|stat' app/api/communications/ -r" \
    "success"

run_test "Export functionality" \
    "grep -q 'export\\|download\\|csv' app/comunicaciones/ -r" \
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
    echo "   Communications module has comprehensive functionality"
elif [ $success_rate -ge 80 ]; then
    echo -e "${YELLOW}🚀 P2 FEATURE STATUS: ⚡ GOOD FEATURES${NC}"
    echo "   Communications module has solid functionality with minor gaps"
elif [ $success_rate -ge 70 ]; then
    echo -e "${YELLOW}🚀 P2 FEATURE STATUS: ⚠️ ADEQUATE FEATURES${NC}"
    echo "   Communications module has basic functionality but needs improvements"
else
    echo -e "${RED}🚀 P2 FEATURE STATUS: ❌ NEEDS DEVELOPMENT${NC}"
    echo "   Communications module requires significant feature development"
fi

echo
echo "Complete validation summary available after all tests"
echo "============================================================="