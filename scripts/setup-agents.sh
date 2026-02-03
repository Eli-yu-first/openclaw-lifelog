#!/bin/bash

# OpenClaw LifeLog - Agent Setup Script
# This script creates all required agents for the LifeLog system

set -e

echo "=========================================="
echo "OpenClaw LifeLog - Agent Setup"
echo "=========================================="

# Check if openclaw is installed
if ! command -v openclaw &> /dev/null; then
    echo "Error: openclaw command not found"
    echo "Please install OpenClaw first: https://github.com/openclaw/openclaw"
    exit 1
fi

# Create workspace directories
echo "Creating workspace directories..."
mkdir -p ~/.openclaw/workspace-master
mkdir -p ~/.openclaw/workspace-morning
mkdir -p ~/.openclaw/workspace-dental
mkdir -p ~/.openclaw/workspace-work
mkdir -p ~/.openclaw/workspace-departure
mkdir -p ~/.openclaw/workspace-health
mkdir -p ~/.openclaw/workspace-data

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Copy agent definitions
echo "Copying agent definitions..."

# Master Habit Agent
if [ -d "$PROJECT_DIR/agents/master-habit" ]; then
    cp -r "$PROJECT_DIR/agents/master-habit/"* ~/.openclaw/workspace-master/
    echo "  ✓ Master Habit Agent files copied"
fi

# Morning Routine Agent
if [ -d "$PROJECT_DIR/agents/morning-routine" ]; then
    cp -r "$PROJECT_DIR/agents/morning-routine/"* ~/.openclaw/workspace-morning/
    echo "  ✓ Morning Routine Agent files copied"
fi

# Dental Hygiene Agent
if [ -d "$PROJECT_DIR/agents/dental-hygiene" ]; then
    cp -r "$PROJECT_DIR/agents/dental-hygiene/"* ~/.openclaw/workspace-dental/
    echo "  ✓ Dental Hygiene Agent files copied"
fi

# Work Life Agent
if [ -d "$PROJECT_DIR/agents/work-life" ]; then
    cp -r "$PROJECT_DIR/agents/work-life/"* ~/.openclaw/workspace-work/
    echo "  ✓ Work Life Agent files copied"
fi

# Departure Agent
if [ -d "$PROJECT_DIR/agents/departure" ]; then
    cp -r "$PROJECT_DIR/agents/departure/"* ~/.openclaw/workspace-departure/
    echo "  ✓ Departure Agent files copied"
fi

# Create agents using CLI
echo ""
echo "Creating agents..."

# Check if agents already exist
existing_agents=$(openclaw agents list 2>/dev/null | grep -E "master-habit|morning-routine|dental-hygiene|work-life|departure|health|data-acquisition" || true)

if [ -n "$existing_agents" ]; then
    echo "Warning: Some agents already exist. Skipping creation."
    echo "Existing agents:"
    echo "$existing_agents"
else
    # Create Master Habit Agent
    openclaw agents add master-habit \
        --name "Master Habit Agent" \
        --workspace "~/.openclaw/workspace-master" \
        --default 2>/dev/null || echo "  Note: master-habit may already exist"
    echo "  ✓ Master Habit Agent created"

    # Create Morning Routine Agent
    openclaw agents add morning-routine \
        --name "Morning Routine Agent" \
        --workspace "~/.openclaw/workspace-morning" 2>/dev/null || echo "  Note: morning-routine may already exist"
    echo "  ✓ Morning Routine Agent created"

    # Create Dental Hygiene Agent
    openclaw agents add dental-hygiene \
        --name "Dental Hygiene Agent" \
        --workspace "~/.openclaw/workspace-dental" 2>/dev/null || echo "  Note: dental-hygiene may already exist"
    echo "  ✓ Dental Hygiene Agent created"

    # Create Work Life Agent
    openclaw agents add work-life \
        --name "Work Life Agent" \
        --workspace "~/.openclaw/workspace-work" 2>/dev/null || echo "  Note: work-life may already exist"
    echo "  ✓ Work Life Agent created"

    # Create Departure Agent
    openclaw agents add departure \
        --name "Departure Agent" \
        --workspace "~/.openclaw/workspace-departure" 2>/dev/null || echo "  Note: departure may already exist"
    echo "  ✓ Departure Agent created"

    # Create Health Agent
    openclaw agents add health \
        --name "Health Agent" \
        --workspace "~/.openclaw/workspace-health" 2>/dev/null || echo "  Note: health may already exist"
    echo "  ✓ Health Agent created"

    # Create Data Acquisition Agent
    openclaw agents add data-acquisition \
        --name "Data Acquisition Agent" \
        --workspace "~/.openclaw/workspace-data" 2>/dev/null || echo "  Note: data-acquisition may already exist"
    echo "  ✓ Data Acquisition Agent created"
fi

echo ""
echo "=========================================="
echo "Agent setup complete!"
echo "=========================================="
echo ""
echo "Created agents:"
openclaw agents list --bindings 2>/dev/null || echo "Run 'openclaw agents list' to see agents"
echo ""
echo "Next steps:"
echo "1. Run ./setup-cron.sh to configure scheduled tasks"
echo "2. Restart OpenClaw Gateway: openclaw gateway restart"
