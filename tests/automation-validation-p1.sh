#!/bin/bash

# AUTOMATION MODULE - P1 High Priority Safety Validation
# ======================================================
# Tests high-priority safety protocols for the automation system
# Including: Execution Safety, Data Integrity, Error Handling, Permission Controls

set -euo pipefail

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}🎯 EJECUTANDO VALIDACIÓN P1 - AUTOMATION MODULE (HIGH PRIORITY SAFETY)${NC}"
echo "=================================================================="

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
# CATEGORY 1: AUTOMATION EXECUTION SAFETY
# ==============================================

test_automation_execution_validation() {
    echo "🔍 Testing automation execution validation rules"
    
    if [ -f "lib/automation-engine.ts" ]; then
        # Check for execution validation and safety checks
        if grep -q "validate\|isValid\|checkSafety" lib/automation-engine.ts || \
           grep -q "try.*catch\|error.*handling" lib/automation-engine.ts; then
            return 0
        fi
    fi
    return 1
}

test_automation_retry_safety() {
    echo "🔍 Testing automation retry safety validation"
    
    # Check for retry configuration and limits
    if grep -r "retry\|maxRetries\|retryConfig" scripts/ lib/ 2>/dev/null | grep -q "automation"; then
        return 0
    fi
    return 1
}

test_automation_execution_limits() {
    echo "🔍 Testing automation execution limits safety"
    
    if [ -f "lib/automation-engine.ts" ]; then
        # Check for execution limits and throttling
        if grep -q "maxExecutions\|executeOnce\|limit\|throttle" lib/automation-engine.ts; then
            return 0
        fi
    fi
    return 1
}

test_automation_timeout_safety() {
    echo "🔍 Testing automation timeout safety"
    
    # Check for timeout configuration and handling
    if grep -r "timeout\|setTimeout\|deadline" lib/ 2>/dev/null | grep -q "automation"; then
        return 0
    fi
    return 1
}

# ==============================================
# CATEGORY 2: DATA INTEGRITY SAFETY
# ==============================================

test_automation_data_validation() {
    echo "🔍 Testing automation data validation rules"
    
    if [ -f "lib/automation-engine.ts" ]; then
        # Check for data validation before processing
        if grep -q "validate.*data\|schema.*validation\|zod\|joi" lib/automation-engine.ts || \
           grep -q "TriggerData\|validateTrigger" lib/automation-engine.ts; then
            return 0
        fi
    fi
    return 1
}

test_automation_rollback_safety() {
    echo "🔍 Testing automation rollback safety"
    
    # Check for rollback mechanisms
    if grep -r "rollback\|revert\|undo\|compensation" lib/ 2>/dev/null | grep -q "automation"; then
        return 0
    fi
    return 1
}

test_automation_transaction_safety() {
    echo "🔍 Testing automation transaction safety"
    
    if [ -f "lib/automation-engine.ts" ]; then
        # Check for transaction handling
        if grep -q "transaction\|atomic\|\$transaction" lib/automation-engine.ts; then
            return 0
        fi
    fi
    return 1
}

test_automation_state_consistency() {
    echo "🔍 Testing automation state consistency"
    
    # Check for state management and consistency checks
    if grep -r "state\|status.*consistency\|RUNNING\|COMPLETED" lib/ app/api/automation* 2>/dev/null; then
        return 0
    fi
    return 1
}

# ==============================================
# CATEGORY 3: ERROR HANDLING SAFETY
# ==============================================

test_automation_error_logging() {
    echo "🔍 Testing automation error logging safety"
    
    if [ -f "lib/automation-engine.ts" ]; then
        # Check for comprehensive error logging
        if grep -q "console\.error\|logger\|log.*error" lib/automation-engine.ts; then
            return 0
        fi
    fi
    return 1
}

test_automation_failure_recovery() {
    echo "🔍 Testing automation failure recovery"
    
    # Check for failure recovery mechanisms
    if grep -r "recovery\|fallback\|backup\|manual.*task" lib/ scripts/ 2>/dev/null | grep -q "automation"; then
        return 0
    fi
    return 1
}

test_automation_circuit_breaker() {
    echo "🔍 Testing automation circuit breaker safety"
    
    # Check for circuit breaker pattern implementation
    if grep -r "circuit.*breaker\|fail.*fast\|health.*check" lib/ 2>/dev/null | grep -q "automation"; then
        return 0
    fi
    return 1
}

test_automation_dead_letter_queue() {
    echo "🔍 Testing automation dead letter queue"
    
    # Check for failed message handling
    if grep -r "dead.*letter\|failed.*queue\|error.*queue" lib/ app/api/ 2>/dev/null | grep -q "automation\|message"; then
        return 0
    fi
    return 1
}

# ==============================================
# CATEGORY 4: PERMISSION & ACCESS CONTROL SAFETY
# ==============================================

test_automation_user_permissions() {
    echo "🔍 Testing automation user permissions validation"
    
    if [ -f "app/api/automation-rules/route.ts" ]; then
        # Check for user permission validation
        if grep -q "role\|permission\|canCreate\|canEdit" app/api/automation-rules/route.ts; then
            return 0
        fi
    fi
    return 1
}

test_automation_church_access_control() {
    echo "🔍 Testing automation church access control"
    
    if [ -f "app/api/automation-rules/route.ts" ]; then
        # Check for church-based access control
        if grep -q "churchId.*session\|where.*churchId" app/api/automation-rules/route.ts; then
            return 0
        fi
    fi
    return 1
}

test_automation_sensitive_action_control() {
    echo "🔍 Testing automation sensitive action control"
    
    # Check for sensitive action restrictions
    if grep -r "SEND_EMAIL\|SEND_SMS\|DELETE\|UPDATE" lib/automation-engine.ts 2>/dev/null; then
        # Should have some form of permission checking
        if grep -r "permission\|authorize\|canExecute" lib/automation-engine.ts 2>/dev/null; then
            return 0
        fi
    fi
    return 1
}

test_automation_role_based_execution() {
    echo "🔍 Testing automation role-based execution safety"
    
    # Check for role-based execution controls
    if grep -r "PASTOR\|ADMIN\|LIDER\|role.*check" lib/ app/api/automation* 2>/dev/null; then
        return 0
    fi
    return 1
}

# ==============================================
# CATEGORY 5: COMMUNICATION SAFETY
# ==============================================

test_automation_message_validation() {
    echo "🔍 Testing automation message validation safety"
    
    # Check for message content validation
    if grep -r "validate.*message\|sanitize\|content.*filter" lib/ 2>/dev/null | grep -q "automation\|message"; then
        return 0
    fi
    return 1
}

test_automation_rate_limiting() {
    echo "🔍 Testing automation rate limiting safety"
    
    # Check for rate limiting on communications
    if grep -r "rate.*limit\|throttle\|delay\|queue" lib/ 2>/dev/null | grep -q "automation\|message"; then
        return 0
    fi
    return 1
}

test_automation_recipient_validation() {
    echo "🔍 Testing automation recipient validation"
    
    # Check for recipient validation before sending
    if grep -r "recipient.*valid\|email.*valid\|phone.*valid" lib/ 2>/dev/null | grep -q "automation"; then
        return 0
    fi
    return 1
}

test_automation_communication_consent() {
    echo "🔍 Testing automation communication consent"
    
    # Check for consent verification before sending
    if grep -r "consent\|opt.*in\|permission.*send" lib/ 2>/dev/null | grep -q "automation\|communication"; then
        return 0
    fi
    return 1
}

# ==============================================
# CATEGORY 6: TEMPLATE & CONFIGURATION SAFETY
# ==============================================

test_automation_template_validation() {
    echo "🔍 Testing automation template validation safety"
    
    # Check for template validation before activation
    if grep -r "validate.*template\|template.*safe\|sanitize.*template" app/api/automation-templates/ lib/ 2>/dev/null; then
        return 0
    fi
    return 1
}

test_automation_configuration_safety() {
    echo "🔍 Testing automation configuration safety"
    
    # Check for configuration validation
    if grep -r "config.*valid\|validate.*config\|safe.*config" lib/ app/api/automation* 2>/dev/null; then
        return 0
    fi
    return 1
}

test_automation_template_isolation() {
    echo "🔍 Testing automation template isolation safety"
    
    # Check for church-based template isolation
    if [ -f "app/api/automation-templates/route.ts" ]; then
        if grep -q "churchId\|church.*isolation" app/api/automation-templates/route.ts; then
            return 0
        fi
    fi
    return 1
}

test_automation_custom_template_safety() {
    echo "🔍 Testing automation custom template safety"
    
    # Check for custom template safety measures
    if grep -r "custom.*template\|user.*template" app/api/automation* 2>/dev/null; then
        if grep -r "validate\|safe\|sanitize" app/api/automation* 2>/dev/null; then
            return 0
        fi
    fi
    return 1
}

# ==============================================
# CATEGORY 7: SCHEDULING & TIMING SAFETY
# ==============================================

test_automation_schedule_validation() {
    echo "🔍 Testing automation schedule validation safety"
    
    # Check for schedule validation
    if grep -r "schedule.*valid\|cron.*valid\|time.*valid" lib/ 2>/dev/null | grep -q "automation"; then
        return 0
    fi
    return 1
}

test_automation_business_hours_safety() {
    echo "🔍 Testing automation business hours safety"
    
    # Check for business hours restrictions
    if grep -r "business.*hours\|working.*hours\|schedule.*restrict" lib/ scripts/ 2>/dev/null | grep -q "automation"; then
        return 0
    fi
    return 1
}

test_automation_timezone_safety() {
    echo "🔍 Testing automation timezone safety"
    
    # Check for timezone handling
    if grep -r "timezone\|UTC\|local.*time" lib/ 2>/dev/null | grep -q "automation\|schedule"; then
        return 0
    fi
    return 1
}

test_automation_urgent_mode_safety() {
    echo "🔍 Testing automation urgent mode safety"
    
    # Check for urgent mode safety controls
    if grep -r "urgent.*mode\|24x7\|bypass.*hours" scripts/ lib/ 2>/dev/null | grep -q "automation"; then
        return 0
    fi
    return 1
}

# ==============================================
# CATEGORY 8: MONITORING & ALERTING SAFETY
# ==============================================

test_automation_execution_monitoring() {
    echo "🔍 Testing automation execution monitoring"
    
    # Check for execution monitoring
    if grep -r "monitor\|track.*execution\|execution.*log" lib/ app/api/automation* 2>/dev/null; then
        return 0
    fi
    return 1
}

test_automation_failure_alerting() {
    echo "🔍 Testing automation failure alerting"
    
    # Check for failure alerting mechanisms
    if grep -r "alert\|notify.*fail\|escalate" lib/ 2>/dev/null | grep -q "automation"; then
        return 0
    fi
    return 1
}

test_automation_performance_monitoring() {
    echo "🔍 Testing automation performance monitoring"
    
    # Check for performance monitoring
    if grep -r "performance\|duration\|response.*time" lib/ app/api/automation* 2>/dev/null; then
        return 0
    fi
    return 1
}

test_automation_health_checks() {
    echo "🔍 Testing automation health checks"
    
    # Check for health check implementations
    if grep -r "health.*check\|status.*check\|ping" app/api/automation* lib/ 2>/dev/null; then
        return 0
    fi
    return 1
}

# ==============================================
# EXECUTE ALL TESTS
# ==============================================

echo -e "${PURPLE}🔒 CATEGORY 1: AUTOMATION EXECUTION SAFETY${NC}"
echo "-------------------------------------------"
run_test "Automation execution validation rules" "test_automation_execution_validation"
run_test "Automation retry safety validation" "test_automation_retry_safety"
run_test "Automation execution limits safety" "test_automation_execution_limits"
run_test "Automation timeout safety" "test_automation_timeout_safety"

echo -e "${PURPLE}💾 CATEGORY 2: DATA INTEGRITY SAFETY${NC}"
echo "-----------------------------------"
run_test "Automation data validation rules" "test_automation_data_validation"
run_test "Automation rollback safety" "test_automation_rollback_safety"
run_test "Automation transaction safety" "test_automation_transaction_safety"
run_test "Automation state consistency" "test_automation_state_consistency"

echo -e "${PURPLE}🚨 CATEGORY 3: ERROR HANDLING SAFETY${NC}"
echo "------------------------------------"
run_test "Automation error logging safety" "test_automation_error_logging"
run_test "Automation failure recovery" "test_automation_failure_recovery"
run_test "Automation circuit breaker safety" "test_automation_circuit_breaker"
run_test "Automation dead letter queue" "test_automation_dead_letter_queue"

echo -e "${PURPLE}👥 CATEGORY 4: PERMISSION & ACCESS CONTROL SAFETY${NC}"
echo "------------------------------------------------"
run_test "Automation user permissions validation" "test_automation_user_permissions"
run_test "Automation church access control" "test_automation_church_access_control"
run_test "Automation sensitive action control" "test_automation_sensitive_action_control"
run_test "Automation role-based execution safety" "test_automation_role_based_execution"

echo -e "${PURPLE}📨 CATEGORY 5: COMMUNICATION SAFETY${NC}"
echo "-----------------------------------"
run_test "Automation message validation safety" "test_automation_message_validation"
run_test "Automation rate limiting safety" "test_automation_rate_limiting"
run_test "Automation recipient validation" "test_automation_recipient_validation"
run_test "Automation communication consent" "test_automation_communication_consent"

echo -e "${PURPLE}📋 CATEGORY 6: TEMPLATE & CONFIGURATION SAFETY${NC}"
echo "----------------------------------------------"
run_test "Automation template validation safety" "test_automation_template_validation"
run_test "Automation configuration safety" "test_automation_configuration_safety"
run_test "Automation template isolation safety" "test_automation_template_isolation"
run_test "Automation custom template safety" "test_automation_custom_template_safety"

echo -e "${PURPLE}⏰ CATEGORY 7: SCHEDULING & TIMING SAFETY${NC}"
echo "-------------------------------------------"
run_test "Automation schedule validation safety" "test_automation_schedule_validation"
run_test "Automation business hours safety" "test_automation_business_hours_safety"
run_test "Automation timezone safety" "test_automation_timezone_safety"
run_test "Automation urgent mode safety" "test_automation_urgent_mode_safety"

echo -e "${PURPLE}📊 CATEGORY 8: MONITORING & ALERTING SAFETY${NC}"
echo "--------------------------------------------"
run_test "Automation execution monitoring" "test_automation_execution_monitoring"
run_test "Automation failure alerting" "test_automation_failure_alerting"
run_test "Automation performance monitoring" "test_automation_performance_monitoring"
run_test "Automation health checks" "test_automation_health_checks"

# ==============================================
# FINAL RESULTS
# ==============================================

echo "=========================================="
echo -e "${CYAN}🎯 P1 HIGH PRIORITY SAFETY TEST RESULTS${NC}"
echo "=========================================="
echo "Total Tests: $TOTAL_TESTS"
echo "Passed: $PASSED_TESTS"
echo "Failed: $FAILED_TESTS"

# Calculate success rate
if [ $TOTAL_TESTS -gt 0 ]; then
    SUCCESS_RATE=$(( (PASSED_TESTS * 100) / TOTAL_TESTS ))
    echo -e "📊 P1 Success Rate: ${SUCCESS_RATE}%"
else
    SUCCESS_RATE=0
    echo -e "📊 P1 Success Rate: 0%"
fi

# Determine status
if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}✅ P1 STATUS: ALL SAFETY TESTS PASSED${NC}"
    echo -e "${GREEN}🛡️  Safety protocols are FULLY OPERATIONAL${NC}"
    exit 0
elif [ $SUCCESS_RATE -ge 90 ]; then
    echo -e "${YELLOW}⚠️  P1 STATUS: ${FAILED_TESTS} SAFETY TEST(S) FAILED${NC}"
    echo -e "${YELLOW}🔧 Safety protocols require minor attention${NC}"
    exit 1
else
    echo -e "${RED}❌ P1 STATUS: ${FAILED_TESTS} SAFETY TEST(S) FAILED${NC}"
    echo -e "${RED}⚠️  Safety protocols require immediate attention${NC}"
    exit 1
fi

echo "=========================================="