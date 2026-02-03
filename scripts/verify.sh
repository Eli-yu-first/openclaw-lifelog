#!/bin/bash

# OpenClaw LifeLog - Feature Verification Script
# This script verifies all components are properly configured and functional

# Removed set -e to allow script to continue on failures

echo "=========================================="
echo "OpenClaw LifeLog - Feature Verification"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
WARNINGS=0

# Function to check a feature
check_feature() {
    local name="$1"
    local command="$2"
    local expected="$3"
    
    printf "Checking %-40s" "$name..."
    
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}[PASS]${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}[FAIL]${NC}"
        ((FAILED++))
        return 1
    fi
}

# Function to check with warning
check_optional() {
    local name="$1"
    local command="$2"
    
    printf "Checking %-40s" "$name..."
    
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}[PASS]${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${YELLOW}[WARN]${NC}"
        ((WARNINGS++))
        return 1
    fi
}

echo "=== Prerequisites ==="
echo ""

# Check Node.js
check_feature "Node.js (>= 22)" "node --version | grep -E 'v2[2-9]|v[3-9][0-9]'"

# Check OpenClaw
check_feature "OpenClaw CLI" "command -v openclaw"

# Check Docker
check_optional "Docker" "command -v docker"

# Check Docker Compose
check_optional "Docker Compose" "command -v docker-compose || docker compose version"

echo ""
echo "=== Configuration Files ==="
echo ""

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Check config files
check_feature "openclaw.json" "test -f $PROJECT_DIR/configs/openclaw.json"
check_feature "voicewake.json" "test -f $PROJECT_DIR/configs/voicewake.json"
check_feature "talk.json" "test -f $PROJECT_DIR/configs/talk.json"
check_feature "camera.json" "test -f $PROJECT_DIR/configs/camera.json"
check_feature "browser.json" "test -f $PROJECT_DIR/configs/browser.json"
check_feature "skills.json" "test -f $PROJECT_DIR/configs/skills.json"
check_feature "webhooks.json" "test -f $PROJECT_DIR/configs/webhooks.json"

echo ""
echo "=== Agent Definitions ==="
echo ""

# Check agent files
check_feature "Master Habit Agent" "test -f $PROJECT_DIR/agents/master-habit/AGENTS.md"
check_feature "Morning Routine Agent" "test -f $PROJECT_DIR/agents/morning-routine/AGENTS.md"
check_feature "Dental Hygiene Agent" "test -f $PROJECT_DIR/agents/dental-hygiene/AGENTS.md"
check_feature "Work Life Agent" "test -f $PROJECT_DIR/agents/work-life/AGENTS.md"
check_feature "Departure Agent" "test -f $PROJECT_DIR/agents/departure/AGENTS.md"

echo ""
echo "=== Skills ==="
echo ""

# Check skills
check_feature "LifeLog Capture Skill" "test -f $PROJECT_DIR/skills/lifelog-capture/SKILL.md"
check_feature "Habit Tracker Skill" "test -f $PROJECT_DIR/skills/habit-tracker/SKILL.md"
check_feature "Smart Reminder Skill" "test -f $PROJECT_DIR/skills/smart-reminder/SKILL.md"

echo ""
echo "=== HAR Service ==="
echo ""

# Check HAR service files
check_feature "HAR Service Code" "test -f $PROJECT_DIR/services/har/har_service.py"
check_feature "HAR Dockerfile" "test -f $PROJECT_DIR/services/har/Dockerfile"
check_feature "HAR docker-compose.yml" "test -f $PROJECT_DIR/services/har/docker-compose.yml"
check_feature "HAR requirements.txt" "test -f $PROJECT_DIR/services/har/requirements.txt"

# Check if HAR service is running
check_optional "HAR Service Running" "curl -s http://localhost:5000/health | grep -q healthy"

echo ""
echo "=== Scripts ==="
echo ""

# Check scripts
check_feature "install.sh" "test -x $PROJECT_DIR/scripts/install.sh"
check_feature "setup-agents.sh" "test -x $PROJECT_DIR/scripts/setup-agents.sh"
check_feature "setup-cron.sh" "test -x $PROJECT_DIR/scripts/setup-cron.sh"

echo ""
echo "=== Documentation ==="
echo ""

# Check documentation
check_feature "README.md" "test -f $PROJECT_DIR/README.md"
check_feature "LICENSE" "test -f $PROJECT_DIR/LICENSE"
check_feature "ARCHITECTURE.md" "test -f $PROJECT_DIR/docs/ARCHITECTURE.md"
check_feature "CONFIGURATION.md" "test -f $PROJECT_DIR/docs/CONFIGURATION.md"

echo ""
echo "=== OpenClaw Integration (requires running Gateway) ==="
echo ""

# Check OpenClaw Gateway
check_optional "Gateway Running" "curl -s http://127.0.0.1:18789/api/health | grep -q ok"

# Check agents registered
check_optional "Agents Registered" "openclaw agents list 2>/dev/null | grep -q master-habit"

# Check cron jobs
check_optional "Cron Jobs Configured" "openclaw cron list 2>/dev/null | grep -q 'Toothbrush\|Reminder'"

echo ""
echo "=========================================="
echo "Verification Summary"
echo "=========================================="
echo ""
echo -e "Passed:   ${GREEN}$PASSED${NC}"
echo -e "Failed:   ${RED}$FAILED${NC}"
echo -e "Warnings: ${YELLOW}$WARNINGS${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}All required checks passed!${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}Some optional features are not available.${NC}"
        echo "Run ./scripts/install.sh to set up all features."
    fi
    exit 0
else
    echo -e "${RED}Some required checks failed.${NC}"
    echo "Please review the failed items and fix them."
    exit 1
fi
