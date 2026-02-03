#!/bin/bash

# OpenClaw LifeLog - One-Click Installation Script
# This script installs and configures the entire LifeLog system

set -e

echo "=========================================="
echo "OpenClaw LifeLog - Installation"
echo "=========================================="
echo ""

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Check prerequisites
echo "Checking prerequisites..."

# Check OpenClaw
if ! command -v openclaw &> /dev/null; then
    echo "❌ OpenClaw not found"
    echo ""
    echo "Please install OpenClaw first:"
    echo "  curl -fsSL https://get.openclaw.ai | bash"
    echo ""
    echo "Or visit: https://github.com/openclaw/openclaw"
    exit 1
fi
echo "✓ OpenClaw installed"

# Check Docker (optional)
if command -v docker &> /dev/null; then
    echo "✓ Docker installed"
    DOCKER_AVAILABLE=true
else
    echo "⚠ Docker not found (HAR service will not be deployed)"
    DOCKER_AVAILABLE=false
fi

echo ""

# Step 1: Copy configuration files
echo "Step 1: Copying configuration files..."
mkdir -p ~/.openclaw/settings

if [ -f "$PROJECT_DIR/configs/openclaw.json" ]; then
    # Backup existing config
    if [ -f ~/.openclaw/openclaw.json ]; then
        cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.backup
        echo "  Backed up existing openclaw.json"
    fi
    cp "$PROJECT_DIR/configs/openclaw.json" ~/.openclaw/openclaw.json
    echo "  ✓ Copied openclaw.json"
fi

if [ -f "$PROJECT_DIR/configs/voicewake.json" ]; then
    cp "$PROJECT_DIR/configs/voicewake.json" ~/.openclaw/settings/voicewake.json
    echo "  ✓ Copied voicewake.json"
fi

if [ -f "$PROJECT_DIR/configs/talk.json" ]; then
    cp "$PROJECT_DIR/configs/talk.json" ~/.openclaw/settings/talk.json
    echo "  ✓ Copied talk.json"
fi

echo ""

# Step 2: Set up agents
echo "Step 2: Setting up agents..."
bash "$SCRIPT_DIR/setup-agents.sh"

echo ""

# Step 3: Set up cron jobs
echo "Step 3: Setting up cron jobs..."
bash "$SCRIPT_DIR/setup-cron.sh"

echo ""

# Step 4: Deploy HAR service (if Docker available)
if [ "$DOCKER_AVAILABLE" = true ]; then
    echo "Step 4: Deploying HAR service..."
    cd "$PROJECT_DIR/services/har"
    
    # Check if container already running
    if docker ps | grep -q openclaw-har-service; then
        echo "  HAR service already running"
    else
        docker-compose up -d
        echo "  ✓ HAR service deployed"
    fi
    
    # Wait for service to be ready
    echo "  Waiting for service to be ready..."
    sleep 5
    
    # Health check
    if curl -s http://localhost:5000/health | grep -q "healthy"; then
        echo "  ✓ HAR service is healthy"
    else
        echo "  ⚠ HAR service may not be ready yet"
    fi
else
    echo "Step 4: Skipping HAR service (Docker not available)"
fi

echo ""

# Step 5: Restart OpenClaw Gateway
echo "Step 5: Restarting OpenClaw Gateway..."
openclaw gateway restart 2>/dev/null || echo "  Note: Please restart gateway manually if needed"

echo ""
echo "=========================================="
echo "Installation Complete!"
echo "=========================================="
echo ""
echo "What's been set up:"
echo "  ✓ Configuration files copied to ~/.openclaw/"
echo "  ✓ 7 agents created (master-habit, morning-routine, etc.)"
echo "  ✓ 10+ cron jobs configured for automated reminders"
if [ "$DOCKER_AVAILABLE" = true ]; then
    echo "  ✓ HAR service running at http://localhost:5000"
fi
echo ""
echo "Voice wake word: 'Siri' or 'OpenClaw'"
echo ""
echo "Next steps:"
echo "1. Configure your messaging channel (WhatsApp/Telegram)"
echo "2. Grant camera permissions in macOS app"
echo "3. Test voice wake: say 'Siri' or 'OpenClaw'"
echo ""
echo "For more information, see the README.md"
