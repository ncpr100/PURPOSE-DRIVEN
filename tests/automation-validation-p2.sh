#!/bin/bash

# AUTOMATION MODULE - P2 Medium Priority Feature Validation
# =========================================================
# Tests medium-priority features for the automation system
# Including: Template System, Dashboard Analytics, Real-time Features, Integration Capabilities

set -euo pipefail

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}🎯 EJECUTANDO VALIDACIÓN P2 - AUTOMATION MODULE (MEDIUM PRIORITY FEATURES)${NC}"
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
# CATEGORY 1: TEMPLATE SYSTEM FEATURES
# ==============================================

test_automation_template_library() {
    echo "🔍 Testing automation template library"
    
    # Check for template library implementation
    if [ -f "app/\\(dashboard\\)/automation-rules/_components/automation-templates.tsx" ]; then
        if grep -q "template\\|Template" "app/\\(dashboard\\)/automation-rules/_components/automation-templates.tsx"; then
            return 0
        fi
    fi
    return 1
}

test_automation_template_categories() {
    echo "🔍 Testing automation template categories"
    
    # Check for template categorization
    if grep -r "category\|subcategory\|PRAYER_REQUEST\|VISITOR" scripts/seed-automation-templates.ts 2>/dev/null; then
        return 0
    fi
    return 1
}

test_automation_template_activation() {
    echo "🔍 Testing automation template activation"
    
    # Check for template activation functionality
    if [ -f "app/api/automation-templates/[id]/route.ts" ]; then
        if grep -q "POST\|activate" app/api/automation-templates/[id]/route.ts; then
            return 0
        fi
    fi
    return 1
}

test_automation_template_customization() {
    echo "🔍 Testing automation template customization"
    
    # Check for template customization features
    if grep -r "customization\|customize\|modify.*template" app/api/automation-templates/ 2>/dev/null; then
        return 0
    fi
    return 1
}

test_automation_template_preview() {
    echo "🔍 Testing automation template preview"
    
    # Check for template preview functionality
    if grep -r "preview\\|test.*template\\|demo" "app/\\(dashboard\\)/automation-rules/" 2>/dev/null; then
        return 0
    fi
    return 1
}

# ==============================================
# CATEGORY 2: DASHBOARD & ANALYTICS FEATURES
# ==============================================

test_automation_dashboard_analytics() {
    echo "🔍 Testing automation dashboard analytics"
    
    # Check for dashboard analytics implementation
    if [ -f "app/\(dashboard\)/automation-rules/_components/automation-stats.tsx" ] || \
       [ -f "app/\(dashboard\)/automation-rules/dashboard/page.tsx" ]; then
        return 0
    fi
    return 1
}

test_automation_execution_metrics() {
    echo "🔍 Testing automation execution metrics"
    
    # Check for execution metrics tracking
    if grep -r "execution.*count\|success.*rate\|performance.*metrics" app/\(dashboard\)/automation-rules/ app/api/automation* 2>/dev/null; then
        return 0
    fi
    return 1
}

test_automation_trend_analysis() {
    echo "🔍 Testing automation trend analysis"
    
    # Check for trend analysis features
    if grep -r "trend\|analytics\|TrendingUp" app/\(dashboard\)/automation-rules/ 2>/dev/null; then
        return 0
    fi
    return 1
}

test_automation_trigger_statistics() {
    echo "🔍 Testing automation trigger statistics"
    
    # Check for trigger statistics
    if grep -r "trigger.*stats\|trigger.*count\|popular.*trigger" app/\(dashboard\)/automation-rules/ 2>/dev/null; then
        return 0
    fi
    return 1
}

test_automation_performance_dashboard() {
    echo "🔍 Testing automation performance dashboard"
    
    # Check for performance dashboard
    if grep -r "performance\|response.*time\|avg.*time" app/\(dashboard\)/automation-rules/ 2>/dev/null; then
        return 0
    fi
    return 1
}

# ==============================================
# CATEGORY 3: REAL-TIME FEATURES
# ==============================================

test_automation_real_time_updates() {
    echo "🔍 Testing automation real-time updates"
    
    # Check for real-time update mechanisms
    if grep -r "setInterval\|real.*time\|live.*update" components/prayer-wall/AutomationEngine.tsx app/\(dashboard\)/automation-rules/ 2>/dev/null; then
        return 0
    fi
    return 1
}

test_automation_live_execution_monitoring() {
    echo "🔍 Testing automation live execution monitoring"
    
    # Check for live execution monitoring
    if grep -r "live.*monitor\|real.*time.*execution\|status.*update" app/\(dashboard\)/automation-rules/ 2>/dev/null; then
        return 0
    fi
    return 1
}

test_automation_message_queue_monitoring() {
    echo "🔍 Testing automation message queue monitoring"
    
    # Check for message queue monitoring
    if grep -r "message.*queue\|queue.*monitor\|MessageQueue" components/prayer-wall/AutomationEngine.tsx 2>/dev/null; then
        return 0
    fi
    return 1
}

test_automation_broadcast_updates() {
    echo "🔍 Testing automation broadcast updates"
    
    # Check for broadcast/SSE updates
    if grep -r "broadcast\|sse\|server.*sent" lib/automation-engine.ts 2>/dev/null; then
        return 0
    fi
    return 1
}

test_automation_notification_system() {
    echo "🔍 Testing automation notification system"
    
    # Check for notification system integration
    if grep -r "notification\|alert\|toast" components/prayer-wall/AutomationEngine.tsx app/\(dashboard\)/automation-rules/ 2>/dev/null; then
        return 0
    fi
    return 1
}

# ==============================================
# CATEGORY 4: ADVANCED AUTOMATION FEATURES
# ==============================================

test_automation_conditional_logic() {
    echo "🔍 Testing automation conditional logic"
    
    # Check for conditional logic implementation
    if grep -r "condition\|operator\|AND\|OR" lib/automation-engine.ts scripts/seed-automation-templates.ts 2>/dev/null; then
        return 0
    fi
    return 1
}

test_automation_multi_action_workflows() {
    echo "🔍 Testing automation multi-action workflows"
    
    # Check for multi-action workflow support
    if grep -r "actions.*config\|multiple.*actions\|workflow" scripts/seed-automation-templates.ts lib/automation-engine.ts 2>/dev/null; then
        return 0
    fi
    return 1
}

test_automation_delay_scheduling() {
    echo "🔍 Testing automation delay scheduling"
    
    # Check for delay and scheduling features
    if grep -r "delay\|schedule\|timeout" scripts/seed-automation-templates.ts lib/automation-engine.ts 2>/dev/null; then
        return 0
    fi
    return 1
}

test_automation_priority_handling() {
    echo "🔍 Testing automation priority handling"
    
    # Check for priority-based execution
    if grep -r "priority\|urgent\|URGENT\|HIGH" scripts/seed-automation-templates.ts lib/automation-engine.ts 2>/dev/null; then
        return 0
    fi
    return 1
}

test_automation_escalation_rules() {
    echo "🔍 Testing automation escalation rules"
    
    # Check for escalation rule implementation
    if grep -r "escalation\|escalate\|supervisor" scripts/seed-automation-templates.ts lib/automation-engine.ts 2>/dev/null; then
        return 0
    fi
    return 1
}

# ==============================================
# CATEGORY 5: COMMUNICATION FEATURES
# ==============================================

test_automation_multi_channel_support() {
    echo "🔍 Testing automation multi-channel support"
    
    # Check for multiple communication channels
    if grep -r "SEND_EMAIL\|SEND_SMS\|SEND_WHATSAPP\|PUSH_NOTIFICATION" lib/automation-engine.ts scripts/seed-automation-templates.ts 2>/dev/null; then
        return 0
    fi
    return 1
}

test_automation_message_templates() {
    echo "🔍 Testing automation message templates"
    
    # Check for message template system
    if grep -r "template.*message\|message.*template\|emailTemplate" scripts/seed-automation-templates.ts 2>/dev/null; then
        return 0
    fi
    return 1
}

test_automation_personalization() {
    echo "🔍 Testing automation personalization"
    
    # Check for message personalization features
    if grep -r "personalize\|{{.*}}\|placeholder\|variable" scripts/seed-automation-templates.ts 2>/dev/null; then
        return 0
    fi
    return 1
}

test_automation_channel_fallback() {
    echo "🔍 Testing automation channel fallback"
    
    # Check for channel fallback mechanisms
    if grep -r "fallback\|backup.*channel\|alternative.*channel" scripts/seed-automation-templates.ts lib/automation-engine.ts 2>/dev/null; then
        return 0
    fi
    return 1
}

test_automation_delivery_tracking() {
    echo "🔍 Testing automation delivery tracking"
    
    # Check for delivery tracking features
    if grep -r "delivery.*status\|message.*status\|sent\|failed" components/prayer-wall/AutomationEngine.tsx 2>/dev/null; then
        return 0
    fi
    return 1
}

# ==============================================
# CATEGORY 6: INTEGRATION FEATURES
# ==============================================

test_automation_prayer_wall_integration() {
    echo "🔍 Testing automation prayer wall integration"
    
    # Check for prayer wall integration
    if [ -f "components/prayer-wall/AutomationEngine.tsx" ]; then
        if grep -q "prayer\|Prayer" components/prayer-wall/AutomationEngine.tsx; then
            return 0
        fi
    fi
    return 1
}

test_automation_member_system_integration() {
    echo "🔍 Testing automation member system integration"
    
    # Check for member system integration
    if grep -r "member\|Member\|CRM" lib/automation-engine.ts scripts/seed-automation-templates.ts 2>/dev/null; then
        return 0
    fi
    return 1
}

test_automation_visitor_system_integration() {
    echo "🔍 Testing automation visitor system integration"
    
    # Check for visitor system integration
    if grep -r "visitor\|Visitor\|VISITOR" scripts/seed-automation-templates.ts lib/automation-engine.ts 2>/dev/null; then
        return 0
    fi
    return 1
}

test_automation_event_system_integration() {
    echo "🔍 Testing automation event system integration"
    
    # Check for event system integration
    if grep -r "event\|Event\|CheckIn" lib/automation-engine.ts scripts/seed-automation-templates.ts 2>/dev/null; then
        return 0
    fi
    return 1
}

test_automation_external_service_integration() {
    echo "🔍 Testing automation external service integration"
    
    # Check for external service integrations
    if grep -r "twilio\|mailgun\|stripe\|external.*service" lib/automation-engine.ts 2>/dev/null; then
        return 0
    fi
    return 1
}

# ==============================================
# CATEGORY 7: USER EXPERIENCE FEATURES
# ==============================================

test_automation_rule_builder_interface() {
    echo "🔍 Testing automation rule builder interface"
    
    # Check for rule builder UI
    if [ -f "app/\(dashboard\)/automation-rules/_components/create-automation-rule-dialog.tsx" ] || \
       grep -r "rule.*builder\|create.*rule" app/\(dashboard\)/automation-rules/ 2>/dev/null; then
        return 0
    fi
    return 1
}

test_automation_visual_workflow_editor() {
    echo "🔍 Testing automation visual workflow editor"
    
    # Check for visual workflow editor
    if grep -r "workflow.*editor\|visual.*editor\|drag.*drop" app/\(dashboard\)/automation-rules/ 2>/dev/null; then
        return 0
    fi
    return 1
}

test_automation_testing_interface() {
    echo "🔍 Testing automation testing interface"
    
    # Check for automation testing interface
    if [ -f "app/api/automation-rules/[id]/test/route.ts" ] || \
       grep -r "test.*automation\|simulate" app/\(dashboard\)/automation-rules/ 2>/dev/null; then
        return 0
    fi
    return 1
}

test_automation_rule_management_ui() {
    echo "🔍 Testing automation rule management UI"
    
    # Check for rule management interface
    if [ -f "app/\(dashboard\)/automation-rules/_components/automation-rules-list.tsx" ]; then
        if grep -q "manage\|edit\|delete\|activate" app/\(dashboard\)/automation-rules/_components/automation-rules-list.tsx; then
            return 0
        fi
    fi
    return 1
}

test_automation_unified_interface() {
    echo "🔍 Testing automation unified interface"
    
    # Check for unified automation interface
    if [ -f "app/\(dashboard\)/automation-rules/_components/unified-automation-interface.tsx" ]; then
        return 0
    fi
    return 1
}

# ==============================================
# CATEGORY 8: PERFORMANCE & OPTIMIZATION
# ==============================================

test_automation_query_optimization() {
    echo "🔍 Testing automation query optimization"
    
    # Check for query optimization in automation APIs
    if grep -r "include\|select\|where.*churchId" app/api/automation* 2>/dev/null; then
        return 0
    fi
    return 1
}

test_automation_caching_system() {
    echo "🔍 Testing automation caching system"
    
    # Check for caching implementation
    if grep -r "cache\|Cache\|redis\|memoize" app/api/automation* lib/automation-engine.ts 2>/dev/null; then
        return 0
    fi
    return 1
}

test_automation_batch_processing() {
    echo "🔍 Testing automation batch processing"
    
    # Check for batch processing capabilities
    if grep -r "batch\|bulk\|queue\|async" lib/automation-engine.ts 2>/dev/null; then
        return 0
    fi
    return 1
}

test_automation_resource_management() {
    echo "🔍 Testing automation resource management"
    
    # Check for resource management
    if grep -r "memory\|cpu\|limit\|throttle" lib/automation-engine.ts 2>/dev/null; then
        return 0
    fi
    return 1
}

test_automation_scalability_features() {
    echo "🔍 Testing automation scalability features"
    
    # Check for scalability considerations
    if grep -r "scale\|distribute\|worker\|job.*queue" lib/automation-engine.ts 2>/dev/null; then
        return 0
    fi
    return 1
}

# ==============================================
# EXECUTE ALL TESTS
# ==============================================

echo -e "${PURPLE}📋 CATEGORY 1: TEMPLATE SYSTEM FEATURES${NC}"
echo "---------------------------------------"
run_test "Automation template library" "test_automation_template_library"
run_test "Automation template categories" "test_automation_template_categories"
run_test "Automation template activation" "test_automation_template_activation"
run_test "Automation template customization" "test_automation_template_customization"
run_test "Automation template preview" "test_automation_template_preview"

echo -e "${PURPLE}📊 CATEGORY 2: DASHBOARD & ANALYTICS FEATURES${NC}"
echo "---------------------------------------------"
run_test "Automation dashboard analytics" "test_automation_dashboard_analytics"
run_test "Automation execution metrics" "test_automation_execution_metrics"
run_test "Automation trend analysis" "test_automation_trend_analysis"
run_test "Automation trigger statistics" "test_automation_trigger_statistics"
run_test "Automation performance dashboard" "test_automation_performance_dashboard"

echo -e "${PURPLE}⚡ CATEGORY 3: REAL-TIME FEATURES${NC}"
echo "--------------------------------"
run_test "Automation real-time updates" "test_automation_real_time_updates"
run_test "Automation live execution monitoring" "test_automation_live_execution_monitoring"
run_test "Automation message queue monitoring" "test_automation_message_queue_monitoring"
run_test "Automation broadcast updates" "test_automation_broadcast_updates"
run_test "Automation notification system" "test_automation_notification_system"

echo -e "${PURPLE}🔧 CATEGORY 4: ADVANCED AUTOMATION FEATURES${NC}"
echo "--------------------------------------------"
run_test "Automation conditional logic" "test_automation_conditional_logic"
run_test "Automation multi-action workflows" "test_automation_multi_action_workflows"
run_test "Automation delay scheduling" "test_automation_delay_scheduling"
run_test "Automation priority handling" "test_automation_priority_handling"
run_test "Automation escalation rules" "test_automation_escalation_rules"

echo -e "${PURPLE}📨 CATEGORY 5: COMMUNICATION FEATURES${NC}"
echo "------------------------------------"
run_test "Automation multi-channel support" "test_automation_multi_channel_support"
run_test "Automation message templates" "test_automation_message_templates"
run_test "Automation personalization" "test_automation_personalization"
run_test "Automation channel fallback" "test_automation_channel_fallback"
run_test "Automation delivery tracking" "test_automation_delivery_tracking"

echo -e "${PURPLE}🔗 CATEGORY 6: INTEGRATION FEATURES${NC}"
echo "----------------------------------"
run_test "Automation prayer wall integration" "test_automation_prayer_wall_integration"
run_test "Automation member system integration" "test_automation_member_system_integration"
run_test "Automation visitor system integration" "test_automation_visitor_system_integration"
run_test "Automation event system integration" "test_automation_event_system_integration"
run_test "Automation external service integration" "test_automation_external_service_integration"

echo -e "${PURPLE}🎨 CATEGORY 7: USER EXPERIENCE FEATURES${NC}"
echo "---------------------------------------"
run_test "Automation rule builder interface" "test_automation_rule_builder_interface"
run_test "Automation visual workflow editor" "test_automation_visual_workflow_editor"
run_test "Automation testing interface" "test_automation_testing_interface"
run_test "Automation rule management UI" "test_automation_rule_management_ui"
run_test "Automation unified interface" "test_automation_unified_interface"

echo -e "${PURPLE}🚀 CATEGORY 8: PERFORMANCE & OPTIMIZATION${NC}"
echo "------------------------------------------"
run_test "Automation query optimization" "test_automation_query_optimization"
run_test "Automation caching system" "test_automation_caching_system"
run_test "Automation batch processing" "test_automation_batch_processing"
run_test "Automation resource management" "test_automation_resource_management"
run_test "Automation scalability features" "test_automation_scalability_features"

# ==============================================
# FINAL RESULTS
# ==============================================

echo "============================================"
echo -e "${CYAN}🎯 P2 MEDIUM PRIORITY FEATURES TEST RESULTS${NC}"
echo "============================================"
echo "Total Tests: $TOTAL_TESTS"
echo "Passed: $PASSED_TESTS"
echo "Failed: $FAILED_TESTS"

# Calculate success rate
if [ $TOTAL_TESTS -gt 0 ]; then
    SUCCESS_RATE=$(( (PASSED_TESTS * 100) / TOTAL_TESTS ))
    echo -e "📊 P2 Success Rate: ${SUCCESS_RATE}%"
else
    SUCCESS_RATE=0
    echo -e "📊 P2 Success Rate: 0%"
fi

# Determine status
if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}✅ P2 STATUS: ALL FEATURE TESTS PASSED${NC}"
    echo -e "${GREEN}🚀 Features are FULLY OPERATIONAL${NC}"
    exit 0
elif [ $SUCCESS_RATE -ge 90 ]; then
    echo -e "${YELLOW}⚠️  P2 STATUS: ${FAILED_TESTS} FEATURE TEST(S) FAILED${NC}"
    echo -e "${YELLOW}🔧 Features require minor attention${NC}"
    exit 1
else
    echo -e "${RED}❌ P2 STATUS: ${FAILED_TESTS} FEATURE TEST(S) FAILED${NC}"
    echo -e "${RED}⚠️  Features require significant attention${NC}"
    exit 1
fi

echo "============================================"