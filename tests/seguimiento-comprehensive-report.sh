#!/bin/bash

# SEGUIMIENTO MODULE - Comprehensive Testing Report Generator
# Executes all testing phases and generates detailed assessment

echo "🎯 SEGUIMIENTO MODULE - COMPREHENSIVE VALIDATION ASSESSMENT"
echo "=========================================================="
echo "📅 Date: $(date)"
echo "🕐 Time: $(date +%H:%M:%S)"
echo ""

# Initialize result tracking
declare -A phase_results
declare -A phase_details

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to run a test phase
run_phase() {
    local phase_name="$1"
    local script_name="$2"
    local phase_description="$3"
    
    echo -e "${BLUE}🚀 EXECUTING PHASE: $phase_name${NC}"
    echo "   📝 $phase_description"
    echo "   ⚡ Running: $script_name"
    echo ""
    
    # Make script executable
    chmod +x "./tests/$script_name"
    
    # Run the test script and capture results
    if ./tests/$script_name > "./tests/${phase_name,,}_results.log" 2>&1; then
        local exit_code=$?
        local success_rate=$(tail -2 "./tests/${phase_name,,}_results.log" | grep "Success Rate" | grep -o '[0-9]*%' || echo "100%")
        
        phase_results[$phase_name]="PASS"
        phase_details[$phase_name]="✅ $success_rate success rate"
        
        echo -e "${GREEN}   ✅ $phase_name COMPLETED - $success_rate${NC}"
    else
        local exit_code=$?
        local success_rate=$(tail -2 "./tests/${phase_name,,}_results.log" | grep "Success Rate" | grep -o '[0-9]*%' || echo "0%")
        
        phase_results[$phase_name]="FAIL"
        phase_details[$phase_name]="❌ $success_rate success rate"
        
        echo -e "${RED}   ❌ $phase_name FAILED - $success_rate${NC}"
    fi
    
    echo ""
}

# Execute all testing phases
echo "🎯 STARTING COMPREHENSIVE SEGUIMIENTO MODULE VALIDATION"
echo "======================================================="
echo ""

# Phase 1: P0 Critical Infrastructure
run_phase "P0_CRITICAL" "seguimiento-validation-p0.sh" "Critical infrastructure, database, API endpoints, and security"

# Phase 2: P1 High Priority Safety
run_phase "P1_HIGH_PRIORITY" "seguimiento-validation-p1.sh" "Safety protocols, user workflows, and data integrity"

# Phase 3: P2 Medium Priority Features
run_phase "P2_MEDIUM_PRIORITY" "seguimiento-validation-p2.sh" "Analytics, advanced features, and performance optimization"

# Extract detailed metrics from each phase
echo "📊 EXTRACTING DETAILED METRICS"
echo "============================="

# P0 Results
if [ -f "./tests/p0_critical_results.log" ]; then
    P0_TOTAL=$(grep "Total Tests:" "./tests/p0_critical_results.log" | grep -o '[0-9]*' | head -1)
    P0_PASSED=$(grep "Passed:" "./tests/p0_critical_results.log" | grep -o '[0-9]*' | head -1)
    P0_FAILED=$(grep "Failed:" "./tests/p0_critical_results.log" | grep -o '[0-9]*' | head -1)
    P0_RATE=$(grep "Success Rate:" "./tests/p0_critical_results.log" | grep -o '[0-9]*%')
else
    P0_TOTAL=0; P0_PASSED=0; P0_FAILED=0; P0_RATE="0%"
fi

# P1 Results
if [ -f "./tests/p1_high_priority_results.log" ]; then
    P1_TOTAL=$(grep "Total Tests:" "./tests/p1_high_priority_results.log" | grep -o '[0-9]*' | head -1)
    P1_PASSED=$(grep "Passed:" "./tests/p1_high_priority_results.log" | grep -o '[0-9]*' | head -1)
    P1_FAILED=$(grep "Failed:" "./tests/p1_high_priority_results.log" | grep -o '[0-9]*' | head -1)
    P1_RATE=$(grep "Success Rate:" "./tests/p1_high_priority_results.log" | grep -o '[0-9]*%')
else
    P1_TOTAL=0; P1_PASSED=0; P1_FAILED=0; P1_RATE="0%"
fi

# P2 Results
if [ -f "./tests/p2_medium_priority_results.log" ]; then
    P2_TOTAL=$(grep "Total Tests:" "./tests/p2_medium_priority_results.log" | grep -o '[0-9]*' | head -1)
    P2_PASSED=$(grep "Passed:" "./tests/p2_medium_priority_results.log" | grep -o '[0-9]*' | head -1)
    P2_FAILED=$(grep "Failed:" "./tests/p2_medium_priority_results.log" | grep -o '[0-9]*' | head -1)
    P2_RATE=$(grep "Success Rate:" "./tests/p2_medium_priority_results.log" | grep -o '[0-9]*%')
else
    P2_TOTAL=0; P2_PASSED=0; P2_FAILED=0; P2_RATE="0%"
fi

# Calculate overall metrics
TOTAL_TESTS=$((P0_TOTAL + P1_TOTAL + P2_TOTAL))
TOTAL_PASSED=$((P0_PASSED + P1_PASSED + P2_PASSED))
TOTAL_FAILED=$((P0_FAILED + P1_FAILED + P2_FAILED))

if [ $TOTAL_TESTS -gt 0 ]; then
    OVERALL_RATE=$(( (TOTAL_PASSED * 100) / TOTAL_TESTS ))
else
    OVERALL_RATE=0
fi

# Generate comprehensive report
echo ""
echo "🏆 SEGUIMIENTO MODULE - COMPREHENSIVE VALIDATION REPORT"
echo "======================================================"
echo "📊 OVERALL ASSESSMENT"
echo "--------------------"
echo "• Total Tests Executed: $TOTAL_TESTS"
echo "• Tests Passed: $TOTAL_PASSED"
echo "• Tests Failed: $TOTAL_FAILED"
echo "• Overall Success Rate: ${OVERALL_RATE}%"
echo ""

echo "📋 PHASE-BY-PHASE BREAKDOWN"
echo "---------------------------"
echo "P0 Critical Infrastructure:"
echo "   • Tests: $P0_TOTAL | Passed: $P0_PASSED | Failed: $P0_FAILED | Rate: $P0_RATE"
echo "   • Status: ${phase_details[P0_CRITICAL]}"
echo ""

echo "P1 High Priority Safety:"
echo "   • Tests: $P1_TOTAL | Passed: $P1_PASSED | Failed: $P1_FAILED | Rate: $P1_RATE"
echo "   • Status: ${phase_details[P1_HIGH_PRIORITY]}"
echo ""

echo "P2 Medium Priority Features:"
echo "   • Tests: $P2_TOTAL | Passed: $P2_PASSED | Failed: $P2_FAILED | Rate: $P2_RATE"
echo "   • Status: ${phase_details[P2_MEDIUM_PRIORITY]}"
echo ""

# Determine overall system status
echo "🎯 SYSTEM HEALTH ASSESSMENT"
echo "---------------------------"

if [ $OVERALL_RATE -ge 95 ]; then
    echo -e "${GREEN}✅ SEGUIMIENTO MODULE STATUS: PRODUCTION READY${NC}"
    echo "🎉 System is fully operational and ready for production deployment"
elif [ $OVERALL_RATE -ge 85 ]; then
    echo -e "${YELLOW}⚠️  SEGUIMIENTO MODULE STATUS: MOSTLY OPERATIONAL${NC}"
    echo "🔧 System is functional but has minor issues requiring attention"
elif [ $OVERALL_RATE -ge 70 ]; then
    echo -e "${YELLOW}⚠️  SEGUIMIENTO MODULE STATUS: OPERATIONAL WITH ISSUES${NC}"
    echo "🛠️  System requires significant improvements before production"
else
    echo -e "${RED}❌ SEGUIMIENTO MODULE STATUS: NEEDS MAJOR IMPROVEMENTS${NC}"
    echo "🚨 System requires extensive fixes before deployment"
fi

echo ""
echo "📈 BUSINESS READINESS METRICS"
echo "----------------------------"

# Infrastructure Readiness
if [ "${P0_RATE%?}" -ge 95 ]; then
    echo "• Infrastructure Readiness: ✅ EXCELLENT ($P0_RATE)"
elif [ "${P0_RATE%?}" -ge 85 ]; then
    echo "• Infrastructure Readiness: ⚠️  GOOD ($P0_RATE)"
else
    echo "• Infrastructure Readiness: ❌ NEEDS WORK ($P0_RATE)"
fi

# Safety Protocol Readiness
if [ "${P1_RATE%?}" -ge 95 ]; then
    echo "• Safety Protocol Readiness: ✅ EXCELLENT ($P1_RATE)"
elif [ "${P1_RATE%?}" -ge 85 ]; then
    echo "• Safety Protocol Readiness: ⚠️  GOOD ($P1_RATE)"
else
    echo "• Safety Protocol Readiness: ❌ NEEDS WORK ($P1_RATE)"
fi

# Feature Completeness
if [ "${P2_RATE%?}" -ge 90 ]; then
    echo "• Feature Completeness: ✅ EXCELLENT ($P2_RATE)"
elif [ "${P2_RATE%?}" -ge 75 ]; then
    echo "• Feature Completeness: ⚠️  GOOD ($P2_RATE)"
else
    echo "• Feature Completeness: ❌ NEEDS WORK ($P2_RATE)"
fi

echo ""
echo "🔍 AREAS NEEDING ATTENTION"
echo "-------------------------"

# Check which areas need attention
NEEDS_ATTENTION=""

if [ "${P0_RATE%?}" -lt 95 ]; then
    NEEDS_ATTENTION="${NEEDS_ATTENTION}• P0 Critical Infrastructure (${P0_RATE} success rate)\n"
fi

if [ "${P1_RATE%?}" -lt 95 ]; then
    NEEDS_ATTENTION="${NEEDS_ATTENTION}• P1 Safety Protocols (${P1_RATE} success rate)\n"
fi

if [ "${P2_RATE%?}" -lt 90 ]; then
    NEEDS_ATTENTION="${NEEDS_ATTENTION}• P2 Feature Implementation (${P2_RATE} success rate)\n"
fi

if [ -n "$NEEDS_ATTENTION" ]; then
    echo -e "$NEEDS_ATTENTION"
else
    echo "✅ All areas performing within acceptable parameters"
fi

echo ""
echo "📋 RECOMMENDED NEXT STEPS"
echo "------------------------"

if [ $OVERALL_RATE -ge 95 ]; then
    echo "✅ DEPLOY TO PRODUCTION - System ready"
    echo "✅ MONITOR PERFORMANCE - Continue monitoring"
    echo "✅ PLAN ENHANCEMENTS - Consider advanced features"
elif [ $OVERALL_RATE -ge 85 ]; then
    echo "🔧 FIX MINOR ISSUES - Address failed tests"
    echo "🔍 REVIEW FAILED COMPONENTS - Detailed analysis needed"
    echo "⏱️  RETEST AFTER FIXES - Validate improvements"
else
    echo "🛠️  MAJOR IMPROVEMENTS NEEDED - Systematic fixes required"
    echo "🔍 DETAILED FAILURE ANALYSIS - Review all failed tests"
    echo "🔄 ITERATIVE IMPROVEMENT - Fix and retest cycles"
fi

echo ""
echo "📁 DETAILED LOGS AVAILABLE"
echo "-------------------------"
echo "• P0 Critical Results: ./tests/p0_critical_results.log"
echo "• P1 Safety Results: ./tests/p1_high_priority_results.log"
echo "• P2 Features Results: ./tests/p2_medium_priority_results.log"

echo ""
echo "⏰ ASSESSMENT COMPLETED: $(date +%H:%M:%S)"
echo "📊 OVERALL SUCCESS RATE: ${OVERALL_RATE}%"
echo "======================================================"

# Return appropriate exit code
if [ $OVERALL_RATE -ge 85 ]; then
    exit 0
else
    exit 1
fi