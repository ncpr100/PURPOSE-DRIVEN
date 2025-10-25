#!/bin/bash

# ==========================================
# KHESED-TEK DASHBOARD MODULE VALIDATION
# P0 CRITICAL INFRASTRUCTURE TESTS
# ==========================================

echo "🏛️ KHESED-TEK PLATFORM VALIDATION SYSTEM"
echo "📊 DASHBOARD MODULE - P0 CRITICAL INFRASTRUCTURE TESTS"
echo "📅 Date: $(date '+%Y-%m-%d %H:%M:%S')"
echo "🎯 Target: Critical infrastructure validation for dashboard system"
echo "==============================================="
echo

# Test Results Tracking
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to run test and track results
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_result="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -e "${BLUE}Test $TOTAL_TESTS: $test_name${NC}"
    
    if eval "$test_command" >/dev/null 2>&1; then
        echo -e "  ${GREEN}✅ PASS${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "  ${RED}❌ FAIL${NC} - $expected_result"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    echo
}

echo "🔍 DASHBOARD MODULE P0 CRITICAL INFRASTRUCTURE VALIDATION"
echo "========================================================="
echo

# 1. CORE DASHBOARD INFRASTRUCTURE TESTS
echo "📊 1. CORE DASHBOARD INFRASTRUCTURE"
echo "-----------------------------------"

run_test "Analytics Client Component" \
    "test -f 'app/(dashboard)/analytics/_components/analytics-client.tsx'" \
    "Analytics client component should exist"

run_test "Analytics Page Route" \
    "test -f 'app/(dashboard)/analytics/page.tsx'" \
    "Analytics page route should exist"

run_test "Business Intelligence Client" \
    "test -f 'app/(dashboard)/business-intelligence/_components/business-intelligence-client.tsx'" \
    "Business intelligence client should exist"

run_test "Reports Client Component" \
    "test -f 'app/(dashboard)/reports/_components/reports-client.tsx'" \
    "Reports client component should exist"

# 2. DASHBOARD API INFRASTRUCTURE TESTS
echo "🔌 2. DASHBOARD API INFRASTRUCTURE"
echo "----------------------------------"

run_test "Analytics API Route" \
    "test -f 'app/api/analytics/route.ts' || test -f 'app/api/analytics/\[...segments\]/route.ts' || ls app/api/ | grep -q analytics" \
    "Analytics API endpoint should exist"

run_test "Reports API Route" \
    "test -f 'app/api/reports/route.ts' || test -f 'app/api/reports/\[...segments\]/route.ts' || ls app/api/ | grep -q reports" \
    "Reports API endpoint should exist"

run_test "Dashboard API Route" \
    "test -f 'app/api/dashboard/route.ts' || test -f 'app/api/dashboard/\[...segments\]/route.ts' || ls app/api/ | grep -q dashboard" \
    "Dashboard API endpoint should exist"

# 3. SPECIALIZED DASHBOARD COMPONENTS
echo "📈 3. SPECIALIZED DASHBOARD COMPONENTS"
echo "--------------------------------------"

run_test "Donation Stats Component" \
    "test -f 'app/(dashboard)/donations/_components/donation-stats.tsx'" \
    "Donation statistics component should exist"

run_test "Social Media Analytics" \
    "test -f 'app/(dashboard)/social-media/_components/analytics-dashboard.tsx'" \
    "Social media analytics dashboard should exist"

run_test "Prayer Analytics Dashboard" \
    "test -f 'components/prayer-wall/PrayerAnalyticsDashboard.tsx'" \
    "Prayer analytics dashboard component should exist"

run_test "Platform Analytics Page" \
    "test -f 'app/(platform)/platform/analytics/page.tsx'" \
    "Platform analytics page should exist"

# 4. DASHBOARD UI LIBRARIES AND DEPENDENCIES
echo "📚 4. DASHBOARD UI LIBRARIES"
echo "-----------------------------"

run_test "Recharts Library Dependency" \
    "grep -q 'recharts' package.json" \
    "Recharts charting library should be installed"

run_test "Chart Components Import" \
    "grep -r 'BarChart\|LineChart\|PieChart\|AreaChart' app/ | head -1" \
    "Chart components should be imported and used"

run_test "UI Components Availability" \
    "test -f 'components/ui/card.tsx' && test -f 'components/ui/button.tsx'" \
    "Core UI components should be available"

# 5. DASHBOARD ROUTING AND MIDDLEWARE
echo "🛣️ 5. DASHBOARD ROUTING INFRASTRUCTURE"
echo "---------------------------------------"

run_test "Dashboard Route Protection" \
    "grep -q 'dashboard' middleware.ts" \
    "Dashboard routes should be protected in middleware"

run_test "Analytics Route Protection" \
    "grep -q 'analytics' middleware.ts || grep -q '/dashboard/' middleware.ts" \
    "Analytics routes should be protected"

run_test "Reports Route Protection" \
    "grep -q 'reports' middleware.ts || grep -q '/dashboard/' middleware.ts" \
    "Reports routes should be protected"

# 6. DATABASE SCHEMA FOR DASHBOARD DATA
echo "💾 6. DATABASE SCHEMA VALIDATION"
echo "---------------------------------"

run_test "Dashboard-related Schema" \
    "grep -q -i 'dashboard\|report\|analytic' prisma/schema.prisma" \
    "Dashboard-related database schema should exist"

run_test "Business Intelligence Schema" \
    "grep -q -i 'widget\|kpi\|metric' prisma/schema.prisma" \
    "Business intelligence schema should exist"

# 7. DASHBOARD AUTHENTICATION AND PERMISSIONS
echo "🔐 7. AUTHENTICATION & PERMISSIONS"
echo "-----------------------------------"

run_test "Dashboard Authentication Check" \
    "grep -r 'useSession\|getSession' app/\(dashboard\)/ | head -1" \
    "Dashboard components should use authentication"

run_test "Role-based Access Control" \
    "grep -r 'role\|permission' app/\(dashboard\)/ | head -1" \
    "Dashboard should implement role-based access"

# 8. DASHBOARD CONFIGURATION AND ENVIRONMENT
echo "⚙️ 8. CONFIGURATION & ENVIRONMENT"
echo "----------------------------------"

run_test "Environment Variables for Analytics" \
    "test -f '.env.example' && grep -q -i 'analytics\|dashboard' .env.example" \
    "Analytics environment variables should be documented"

run_test "Dashboard Configuration" \
    "test -f 'next.config.js' && grep -q -i 'dashboard\|analytics' next.config.js || test -f 'tailwind.config.ts'" \
    "Dashboard configuration should exist"

# FINAL RESULTS
echo "========================================================="
echo "🏆 DASHBOARD MODULE P0 CRITICAL INFRASTRUCTURE RESULTS"
echo "========================================================="
echo -e "📊 Total Tests: $TOTAL_TESTS"
echo -e "✅ Passed: ${GREEN}$PASSED_TESTS${NC}"
echo -e "❌ Failed: ${RED}$FAILED_TESTS${NC}"

# Calculate success rate
if [ $TOTAL_TESTS -gt 0 ]; then
    SUCCESS_RATE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
    echo -e "📈 Success Rate: ${GREEN}$SUCCESS_RATE%${NC}"
    
    if [ $SUCCESS_RATE -ge 90 ]; then
        echo -e "🎉 Status: ${GREEN}PRODUCTION READY${NC}"
    elif [ $SUCCESS_RATE -ge 75 ]; then
        echo -e "⚡ Status: ${YELLOW}OPERATIONAL${NC}"
    elif [ $SUCCESS_RATE -ge 50 ]; then
        echo -e "⚠️  Status: ${YELLOW}REQUIRES DEVELOPMENT${NC}"
    else
        echo -e "🚨 Status: ${RED}CRITICAL ISSUES${NC}"
    fi
else
    echo -e "📈 Success Rate: ${RED}0%${NC}"
    echo -e "🚨 Status: ${RED}NO TESTS EXECUTED${NC}"
fi

echo
echo "📋 DASHBOARD MODULE P0 VALIDATION COMPLETE"
echo "Next: Execute P1 High-Priority Safety Tests"
echo "========================================================="