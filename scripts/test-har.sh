#!/bin/bash

# OpenClaw LifeLog - HAR Service Test Script
# This script tests the HAR (Human Activity Recognition) service

set -e

echo "=========================================="
echo "HAR Service Test"
echo "=========================================="
echo ""

HAR_URL="${HAR_URL:-http://localhost:5000}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Test health endpoint
echo "Testing health endpoint..."
HEALTH=$(curl -s "$HAR_URL/health")
if echo "$HEALTH" | grep -q "healthy"; then
    echo -e "${GREEN}✓ Health check passed${NC}"
    echo "  Response: $HEALTH"
else
    echo -e "${RED}✗ Health check failed${NC}"
    echo "  Make sure HAR service is running:"
    echo "  cd services/har && docker-compose up -d"
    exit 1
fi

echo ""

# Test activities endpoint
echo "Testing activities endpoint..."
ACTIVITIES=$(curl -s "$HAR_URL/activities")
if echo "$ACTIVITIES" | grep -q "activities"; then
    echo -e "${GREEN}✓ Activities endpoint passed${NC}"
    echo "  Supported activities:"
    echo "$ACTIVITIES" | python3 -c "import sys,json; data=json.load(sys.stdin); print('    ' + '\n    '.join(data.get('activities', [])))"
else
    echo -e "${RED}✗ Activities endpoint failed${NC}"
    exit 1
fi

echo ""

# Test analyze endpoint with mock data
echo "Testing analyze endpoint..."

# Create a minimal test video (1x1 pixel, 1 frame)
# In production, this would be actual video data
TEST_VIDEO_BASE64="AAAAHGZ0eXBpc29tAAACAGlzb21pc28ybXA0MQ=="

ANALYZE_RESPONSE=$(curl -s -X POST "$HAR_URL/analyze" \
    -H "Content-Type: application/json" \
    -d "{
        \"video\": \"$TEST_VIDEO_BASE64\",
        \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"
    }")

if echo "$ANALYZE_RESPONSE" | grep -q "timestamp"; then
    echo -e "${GREEN}✓ Analyze endpoint passed${NC}"
    echo "  Response: $ANALYZE_RESPONSE"
else
    echo -e "${RED}✗ Analyze endpoint failed${NC}"
    echo "  Response: $ANALYZE_RESPONSE"
fi

echo ""

# Test image analyze endpoint
echo "Testing image analyze endpoint..."

# Minimal 1x1 PNG image
TEST_IMAGE_BASE64="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

IMAGE_RESPONSE=$(curl -s -X POST "$HAR_URL/analyze/image" \
    -H "Content-Type: application/json" \
    -d "{
        \"image\": \"$TEST_IMAGE_BASE64\",
        \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"
    }")

if echo "$IMAGE_RESPONSE" | grep -q "timestamp"; then
    echo -e "${GREEN}✓ Image analyze endpoint passed${NC}"
    echo "  Response: $IMAGE_RESPONSE"
else
    echo -e "${RED}✗ Image analyze endpoint failed${NC}"
    echo "  Response: $IMAGE_RESPONSE"
fi

echo ""
echo "=========================================="
echo "All HAR service tests passed!"
echo "=========================================="
