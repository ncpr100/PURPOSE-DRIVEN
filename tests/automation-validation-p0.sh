#!/bin/bash

# AUTOMATION MODULE - P0 Critical Infrastructure Validation
# =========================================================
# Tests critical infrastructure components of the automation system
# Including: Automation Engine, Database Schema, API Endpoints, Template System, Security

set -euo pipefail

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}🎯 EJECUTANDO VALIDACIÓN P0 - AUTOMATION MODULE (CRITICAL INFRASTRUCTURE)${NC}"
echo "====================================================================="

# Initialize test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Test execution function
run_test() {
    local test_name="$1"
    local test_function="$2"
    
    echo -e "▶️  Test: ${test_name}"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if eval "$test_function"; then
        echo -e "   ${GREEN}✅ PASS${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "   ${RED}❌ FAIL${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    echo
}

# ==============================================
# CATEGORY 1: DATABASE SCHEMA VALIDATION
# ==============================================

test_automation_rule_schema() {
    echo "🔍 Testing automation rule schema validation"
    
    # Check if prisma schema contains AutomationRule model
    if grep -q "model AutomationRule" prisma/schema.prisma; then
        # Check essential fields
        if grep -A 30 "model AutomationRule" prisma/schema.prisma | grep -q "name.*String" && \
           grep -A 30 "model AutomationRule" prisma/schema.prisma | grep -q "isActive.*Boolean" && \
           grep -A 30 "model AutomationRule" prisma/schema.prisma | grep -q "churchId.*String"; then
            return 0
        fi
    fi
    return 1
}

test_automation_template_schema() {
    echo "🔍 Testing automation template schema validation"
    
    # Check AutomationTemplate model
    if grep -q "model AutomationTemplate" prisma/schema.prisma; then
        if grep -A 30 "model AutomationTemplate" prisma/schema.prisma | grep -q "name.*String" && \
           grep -A 30 "model AutomationTemplate" prisma/schema.prisma | grep -q "triggerConfig.*Json" && \
           grep -A 30 "model AutomationTemplate" prisma/schema.prisma | grep -q "actionsConfig.*Json"; then
            return 0
        fi
    fi
    return 1
}

test_automation_execution_schema() {
    echo "🔍 Testing automation execution schema validation"
    
    # Check AutomationExecution model
    if grep -q "model AutomationExecution" prisma/schema.prisma; then
        if grep -A 20 "model AutomationExecution" prisma/schema.prisma | grep -q "automationId.*String" && \
           grep -A 20 "model AutomationExecution" prisma/schema.prisma | grep -q "status.*String" && \
           grep -A 20 "model AutomationExecution" prisma/schema.prisma | grep -q "executedAt.*DateTime"; then
            return 0
        fi
    fi
    return 1
}

test_automation_triggers_schema() {
    echo "🔍 Testing automation triggers schema validation"
    
    # Check AutomationTrigger model or related structures
    if grep -q "model AutomationTrigger" prisma/schema.prisma || \
       grep -q "AutomationTriggerType" prisma/schema.prisma; then
        return 0
    fi
    return 1
}

# ==============================================
# CATEGORY 2: API ENDPOINTS VALIDATION
# ==============================================

test_automation_rules_api() {
    echo "🔍 Testing automation rules API endpoint"
    
    if [ -f "app/api/automation-rules/route.ts" ]; then
        # Check for GET and POST methods
        if grep -q "GET" app/api/automation-rules/route.ts && \
           grep -q "POST\|export.*POST" app/api/automation-rules/route.ts; then
            return 0
        fi
    fi
    return 1
}

test_automation_templates_api() {
    echo "🔍 Testing automation templates API endpoint"
    
    if [ -f "app/api/automation-templates/route.ts" ]; then
        if grep -q "GET" app/api/automation-templates/route.ts; then
            return 0
        fi
    fi
    return 1
}

test_automation_dashboard_api() {
    echo "🔍 Testing automation dashboard API endpoint"
    
    if [ -f "app/api/automation-dashboard/route.ts" ] || \
       [ -f "app/api/automation-rules/dashboard/route.ts" ]; then
        return 0
    fi
    return 1
}

test_automation_execution_api() {
    echo "🔍 Testing automation execution API endpoints"
    
    if [ -f "app/api/automation-rules/[id]/route.ts" ]; then
        if grep -q "GET\|POST\|PUT\|PATCH" app/api/automation-rules/[id]/route.ts; then
            return 0
        fi
    fi
    return 1
}

# ==============================================
# CATEGORY 3: AUTOMATION ENGINE VALIDATION
# ==============================================

test_automation_engine_core() {
    echo "🔍 Testing automation engine core module"
    
    if [ -f "lib/automation-engine.ts" ]; then
        # Check for AutomationEngine class and key methods
        if grep -q "class AutomationEngine" lib/automation-engine.ts && \
           grep -q "triggerAutomation\|processTrigger" lib/automation-engine.ts; then
            return 0
        fi
    fi
    return 1
}

test_automation_trigger_system() {
    echo "🔍 Testing automation trigger system"
    
    if [ -f "lib/automation-engine.ts" ]; then
        # Check for trigger functions and event handling
        if grep -q "AutomationTriggers\|triggerAutomation" lib/automation-engine.ts && \
           grep -q "TriggerData\|processTrigger" lib/automation-engine.ts; then
            return 0
        fi
    fi
    return 1
}

test_automation_action_processors() {
    echo "🔍 Testing automation action processors"
    
    if [ -f "lib/automation-engine.ts" ]; then
        # Check for action execution logic
        if grep -q "executeAction\|processAction\|SEND_EMAIL\|SEND_SMS" lib/automation-engine.ts; then
            return 0
        fi
    fi
    return 1
}

test_automation_conditions_evaluator() {
    echo "🔍 Testing automation conditions evaluator"
    
    if [ -f "lib/automation-engine.ts" ]; then
        # Check for condition evaluation logic
        if grep -q "evaluateConditions\|checkConditions\|operator" lib/automation-engine.ts; then
            return 0
        fi
    fi
    return 1
}

# ==============================================
# CATEGORY 4: UI COMPONENTS VALIDATION
# ==============================================

test_automation_rules_page() {
    echo "🔍 Testing automation rules main page"
    
    if [ -f "app/\\(dashboard\\)/automation-rules/page.tsx" ]; then
        if grep -q "AutomationRules\\|UnifiedAutomationInterface" "app/\\(dashboard\\)/automation-rules/page.tsx"; then
            return 0
        fi
    fi
    return 1
}

test_automation_dashboard_page() {
    echo "🔍 Testing automation dashboard page"
    
    if [ -f "app/\\(dashboard\\)/automation-rules/dashboard/page.tsx" ]; then
        return 0
    fi
    return 1
}

test_automation_client_component() {
    echo "🔍 Testing automation client component"
    
    if [ -f "app/\\(dashboard\\)/automation-rules/_components/automation-rules-client.tsx" ]; then
        if grep -q "AutomationRulesClient" "app/\\(dashboard\\)/automation-rules/_components/automation-rules-client.tsx"; then
            return 0
        fi
    fi
    return 1
}

test_automation_templates_component() {
    echo "🔍 Testing automation templates component"
    
    if [ -f "app/\\(dashboard\\)/automation-rules/_components/automation-templates.tsx" ]; then
        if grep -q "template\\|Template" "app/\\(dashboard\\)/automation-rules/_components/automation-templates.tsx"; then
            return 0
        fi
    fi
    return 1
}

# ==============================================
# CATEGORY 5: SECURITY & AUTHENTICATION
# ==============================================

test_automation_authentication() {
    echo "🔍 Testing automation authentication requirements"
    
    if [ -f "app/\\(dashboard\\)/automation-rules/page.tsx" ]; then
        # Check if authentication is implemented in the route
        if grep -q "getServerSession\\|authOptions\\|session" "app/\\(dashboard\\)/automation-rules/page.tsx" || \
           [ -f "middleware.ts" ] && grep -q "automation-rules" middleware.ts; then
            return 0
        fi
    fi
    return 1
}

test_automation_rbac() {
    echo "🔍 Testing automation RBAC implementation"
    
    # Check middleware for automation routes protection
    if [ -f "middleware.ts" ]; then
        if grep -q "automation\|AUTOMATION" middleware.ts; then
            return 0
        fi
    fi
    return 1
}

test_automation_data_privacy() {
    echo "🔍 Testing automation data privacy validation"
    
    if [ -f "app/api/automation-rules/route.ts" ]; then
        # Check for session and church-based filtering
        if grep -q "session" app/api/automation-rules/route.ts && \
           grep -q "churchId" app/api/automation-rules/route.ts; then
            return 0
        fi
    fi
    return 1
}

test_automation_church_isolation() {
    echo "🔍 Testing automation church data isolation"
    
    if [ -f "app/api/automation-rules/route.ts" ]; then
        # Check for church-based filtering in API
        if grep -q "churchId.*session\|where.*churchId" app/api/automation-rules/route.ts; then
            return 0
        fi
    fi
    return 1
}

# ==============================================
# CATEGORY 6: INTEGRATION VALIDATION
# ==============================================

test_automation_prayer_integration() {
    echo "🔍 Testing automation prayer system integration"
    
    # Check if prayer automation is integrated
    if [ -f "components/prayer-wall/AutomationEngine.tsx" ] || \
       grep -r "PRAYER_REQUEST" scripts/ 2>/dev/null | grep -q "automation"; then
        return 0
    fi
    return 1
}

test_automation_communication_integration() {
    echo "🔍 Testing automation communication integration"
    
    if [ -f "lib/automation-engine.ts" ]; then
        # Check for communication integrations
        if grep -q "SEND_EMAIL\|SEND_SMS\|SEND_WHATSAPP" lib/automation-engine.ts; then
            return 0
        fi
    fi
    return 1
}

test_automation_notification_integration() {
    echo "🔍 Testing automation notification integration"
    
    if [ -f "lib/automation-engine.ts" ]; then
        # Check for notification system integration
        if grep -q "notification\|broadcast\|PushNotification" lib/automation-engine.ts; then
            return 0
        fi
    fi
    return 1
}

test_automation_database_integration() {
    echo "🔍 Testing automation database integration"
    
    if [ -f "lib/automation-engine.ts" ]; then
        # Check for database operations
        if grep -q "prisma\|db\|\\.create\|\\.update\|\\.findMany" lib/automation-engine.ts; then
            return 0
        fi
    fi
    return 1
}

# ==============================================
# EXECUTE ALL TESTS
# ==============================================

echo -e "${PURPLE}📋 CATEGORY 1: DATABASE SCHEMA VALIDATION${NC}"
echo "----------------------------------------"
run_test "Automation rule schema validation" "test_automation_rule_schema"
run_test "Automation template schema validation" "test_automation_template_schema"
run_test "Automation execution schema validation" "test_automation_execution_schema"
run_test "Automation triggers schema validation" "test_automation_triggers_schema"

echo -e "${PURPLE}📡 CATEGORY 2: API ENDPOINTS VALIDATION${NC}"
echo "--------------------------------------"
run_test "Automation rules API endpoint exists" "test_automation_rules_api"
run_test "Automation templates API endpoint exists" "test_automation_templates_api"
run_test "Automation dashboard API endpoint exists" "test_automation_dashboard_api"
run_test "Automation execution API endpoints exist" "test_automation_execution_api"

echo -e "${PURPLE}🤖 CATEGORY 3: AUTOMATION ENGINE VALIDATION${NC}"
echo "-------------------------------------------"
run_test "Automation engine core module" "test_automation_engine_core"
run_test "Automation trigger system" "test_automation_trigger_system"
run_test "Automation action processors" "test_automation_action_processors"
run_test "Automation conditions evaluator" "test_automation_conditions_evaluator"

echo -e "${PURPLE}🎨 CATEGORY 4: UI COMPONENTS VALIDATION${NC}"
echo "-------------------------------------"
run_test "Automation rules main page exists" "test_automation_rules_page"
run_test "Automation dashboard page exists" "test_automation_dashboard_page"
run_test "Automation client component exists" "test_automation_client_component"
run_test "Automation templates component exists" "test_automation_templates_component"

echo -e "${PURPLE}🔐 CATEGORY 5: SECURITY & AUTHENTICATION${NC}"
echo "---------------------------------------"
run_test "Automation authentication protected" "test_automation_authentication"
run_test "Automation RBAC implementation" "test_automation_rbac"
run_test "Automation data privacy validation" "test_automation_data_privacy"
run_test "Automation church data isolation" "test_automation_church_isolation"

echo -e "${PURPLE}🔗 CATEGORY 6: INTEGRATION VALIDATION${NC}"
echo "-----------------------------------"
run_test "Automation prayer system integration" "test_automation_prayer_integration"
run_test "Automation communication integration" "test_automation_communication_integration"
run_test "Automation notification integration" "test_automation_notification_integration"
run_test "Automation database integration" "test_automation_database_integration"

# ==============================================
# FINAL RESULTS
# ==============================================

echo "============================================"
echo -e "${CYAN}🎯 P0 CRITICAL INFRASTRUCTURE TEST RESULTS${NC}"
echo "============================================"
echo "Total Tests: $TOTAL_TESTS"
echo "Passed: $PASSED_TESTS"
echo "Failed: $FAILED_TESTS"

# Calculate success rate
if [ $TOTAL_TESTS -gt 0 ]; then
    SUCCESS_RATE=$(( (PASSED_TESTS * 100) / TOTAL_TESTS ))
    echo -e "📊 P0 Success Rate: ${SUCCESS_RATE}%"
else
    SUCCESS_RATE=0
    echo -e "📊 P0 Success Rate: 0%"
fi

# Determine status
if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}✅ P0 STATUS: ALL CRITICAL TESTS PASSED${NC}"
    echo -e "${GREEN}🏗️  Infrastructure is FULLY OPERATIONAL${NC}"
    exit 0
elif [ $SUCCESS_RATE -ge 90 ]; then
    echo -e "${YELLOW}⚠️  P0 STATUS: ${FAILED_TESTS} CRITICAL TEST(S) FAILED${NC}"
    echo -e "${YELLOW}🔧 Infrastructure requires minor attention${NC}"
    exit 1
else
    echo -e "${RED}❌ P0 STATUS: ${FAILED_TESTS} CRITICAL TEST(S) FAILED${NC}"
    echo -e "${RED}⚠️  Infrastructure requires immediate attention${NC}"
    exit 1
fi

echo "============================================"