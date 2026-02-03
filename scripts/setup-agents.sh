#!/bin/bash

# OpenClaw LifeLog - Agent Setup Script
# Creates all 16 agents for comprehensive life tracking (120+ activities)

set -e

echo "=========================================="
echo "OpenClaw LifeLog - Agent Setup"
echo "=========================================="
echo ""

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Check if openclaw is installed
if ! command -v openclaw &> /dev/null; then
    echo "Error: openclaw CLI not found"
    echo "Please install OpenClaw first: npm install -g openclaw@latest"
    exit 1
fi

# Create all workspace directories
echo "Creating workspace directories..."
mkdir -p ~/.openclaw/workspace-master
mkdir -p ~/.openclaw/workspace-health-fitness
mkdir -p ~/.openclaw/workspace-nutrition
mkdir -p ~/.openclaw/workspace-sleep
mkdir -p ~/.openclaw/workspace-social
mkdir -p ~/.openclaw/workspace-entertainment
mkdir -p ~/.openclaw/workspace-learning
mkdir -p ~/.openclaw/workspace-finance
mkdir -p ~/.openclaw/workspace-home
mkdir -p ~/.openclaw/workspace-transport
mkdir -p ~/.openclaw/workspace-personal
mkdir -p ~/.openclaw/workspace-productivity
mkdir -p ~/.openclaw/workspace-emotional
mkdir -p ~/.openclaw/workspace-morning
mkdir -p ~/.openclaw/workspace-departure
mkdir -p ~/.openclaw/workspace-data
mkdir -p ~/.openclaw/workspace-dental
mkdir -p ~/.openclaw/workspace-work
mkdir -p ~/.openclaw/workspace-health
echo "  ✓ Workspace directories created"

# Copy agent definitions
echo ""
echo "Copying agent definitions..."

# Function to copy agent files
copy_agent_files() {
    local agent_id=$1
    local workspace=$2
    
    if [ -d "$PROJECT_DIR/agents/$agent_id" ]; then
        cp -r "$PROJECT_DIR/agents/$agent_id/"* "$workspace/" 2>/dev/null || true
        echo "  ✓ $agent_id"
    fi
}

# Copy all agent files
copy_agent_files "master-habit" "$HOME/.openclaw/workspace-master"
copy_agent_files "health-fitness" "$HOME/.openclaw/workspace-health-fitness"
copy_agent_files "nutrition-diet" "$HOME/.openclaw/workspace-nutrition"
copy_agent_files "sleep-rest" "$HOME/.openclaw/workspace-sleep"
copy_agent_files "social-communication" "$HOME/.openclaw/workspace-social"
copy_agent_files "entertainment-leisure" "$HOME/.openclaw/workspace-entertainment"
copy_agent_files "learning-education" "$HOME/.openclaw/workspace-learning"
copy_agent_files "finance-shopping" "$HOME/.openclaw/workspace-finance"
copy_agent_files "home-environment" "$HOME/.openclaw/workspace-home"
copy_agent_files "transportation-travel" "$HOME/.openclaw/workspace-transport"
copy_agent_files "personal-care" "$HOME/.openclaw/workspace-personal"
copy_agent_files "productivity-focus" "$HOME/.openclaw/workspace-productivity"
copy_agent_files "emotional-wellness" "$HOME/.openclaw/workspace-emotional"
copy_agent_files "morning-routine" "$HOME/.openclaw/workspace-morning"
copy_agent_files "departure" "$HOME/.openclaw/workspace-departure"
# Legacy agents (for backward compatibility)
copy_agent_files "dental-hygiene" "$HOME/.openclaw/workspace-dental"
copy_agent_files "work-life" "$HOME/.openclaw/workspace-work"

echo ""
echo "=========================================="
echo "Agent Setup Complete!"
echo "=========================================="
echo ""
echo "Life Scenario Agents (12 categories):"
echo "┌────────────────────────┬─────────────────────────────────────┐"
echo "│ Agent                  │ Tracks                              │"
echo "├────────────────────────┼─────────────────────────────────────┤"
echo "│ health-fitness         │ Exercise, sports, physical activity │"
echo "│ nutrition-diet         │ Eating, drinking, cooking           │"
echo "│ sleep-rest             │ Sleep patterns, napping, rest       │"
echo "│ social-communication   │ Calls, meetings, social media       │"
echo "│ entertainment-leisure  │ TV, games, hobbies, reading         │"
echo "│ learning-education     │ Study, courses, online learning     │"
echo "│ finance-shopping       │ Shopping, bills, banking            │"
echo "│ home-environment       │ Cleaning, organizing, pet care      │"
echo "│ transportation-travel  │ Commuting, driving, traveling       │"
echo "│ personal-care          │ Hygiene, grooming, medical          │"
echo "│ productivity-focus     │ Work, meetings, deep focus          │"
echo "│ emotional-wellness     │ Meditation, mood, stress relief     │"
echo "└────────────────────────┴─────────────────────────────────────┘"
echo ""
echo "Special Agents (4):"
echo "┌────────────────────────┬─────────────────────────────────────┐"
echo "│ master-habit           │ Main coordinator for all agents     │"
echo "│ morning-routine        │ Morning habits and routines         │"
echo "│ departure              │ Leaving home, item checking         │"
echo "│ data-acquisition       │ Camera capture, behavior collection │"
echo "└────────────────────────┴─────────────────────────────────────┘"
echo ""
echo "Total: 16 agents tracking 120+ activities"
echo ""
echo "Next steps:"
echo "  1. Copy config: cp $PROJECT_DIR/configs/openclaw.json ~/.openclaw/"
echo "  2. Setup cron:  ./setup-cron.sh"
echo "  3. Restart:     openclaw gateway restart"
echo "  4. Verify:      openclaw agents list"
