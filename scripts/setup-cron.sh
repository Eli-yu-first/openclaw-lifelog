#!/bin/bash

# OpenClaw LifeLog - Cron Job Setup Script
# This script configures all scheduled tasks for the LifeLog system

set -e

echo "=========================================="
echo "OpenClaw LifeLog - Cron Job Setup"
echo "=========================================="

# Check if openclaw is installed
if ! command -v openclaw &> /dev/null; then
    echo "Error: openclaw command not found"
    echo "Please install OpenClaw first: https://github.com/openclaw/openclaw"
    exit 1
fi

# Default timezone (can be overridden)
TIMEZONE="${TIMEZONE:-Asia/Shanghai}"
echo "Using timezone: $TIMEZONE"
echo ""

# Function to add cron job safely
add_cron_job() {
    local name="$1"
    local cron="$2"
    local agent="$3"
    local message="$4"
    
    echo "Adding cron job: $name"
    
    # Check if job already exists
    if openclaw cron list 2>/dev/null | grep -q "$name"; then
        echo "  Note: Job '$name' already exists, skipping"
        return
    fi
    
    openclaw cron add \
        --name "$name" \
        --cron "$cron" \
        --tz "$TIMEZONE" \
        --session isolated \
        --agentId "$agent" \
        --message "$message" \
        2>/dev/null || echo "  Warning: Failed to add job '$name'"
    
    echo "  ✓ Added"
}

echo "Setting up scheduled tasks..."
echo ""

# ==========================================
# Morning Checks
# ==========================================
echo "--- Morning Checks ---"

# Morning toothbrush check (9:00 AM)
add_cron_job \
    "Morning Toothbrush Check" \
    "0 9 * * *" \
    "master-habit" \
    "检查用户今天早上是否已刷牙。查询 dental-hygiene agent 的记忆，如果今天早上 9:00 前没有刷牙记录，发送提醒消息：'早上好！记得刷牙保持口腔健康哦。'"

# Morning routine check (9:30 AM)
add_cron_job \
    "Morning Routine Check" \
    "30 9 * * *" \
    "master-habit" \
    "检查用户今天早上的晨间流程是否完成。查询 morning-routine agent 的记忆，总结今天早上的活动情况。"

echo ""

# ==========================================
# Work Day Checks
# ==========================================
echo "--- Work Day Checks ---"

# Departure checklist (8:00 AM, weekdays)
add_cron_job \
    "Departure Checklist" \
    "0 8 * * 1-5" \
    "departure" \
    "用户即将出门上班。检查用户是否已准备好出门，提醒携带钥匙、手机、钱包等必需品。"

# Sedentary reminder (every 2 hours, 9AM-6PM, weekdays)
add_cron_job \
    "Sedentary Reminder" \
    "0 9,11,13,15,17 * * 1-5" \
    "work-life" \
    "检查用户过去 2 小时的活动记录。如果用户一直处于坐姿，发送活动提醒：'该起来活动一下了，伸展一下身体吧！'"

# Hydration reminder (every 2 hours, 9AM-6PM)
add_cron_job \
    "Hydration Reminder" \
    "0 10,12,14,16,18 * * *" \
    "work-life" \
    "检查用户过去 2 小时是否有喝水记录。如果没有，发送提醒：'记得多喝水，保持身体水分充足！'"

echo ""

# ==========================================
# Evening Checks
# ==========================================
echo "--- Evening Checks ---"

# Evening toothbrush check (10:30 PM)
add_cron_job \
    "Evening Toothbrush Check" \
    "30 22 * * *" \
    "master-habit" \
    "检查用户今天晚上是否已刷牙。查询 dental-hygiene agent 的记忆，如果今天晚上 10:30 前没有刷牙记录，发送提醒：'睡前记得刷牙哦，保护牙齿健康！'"

# Sleep reminder (11:00 PM)
add_cron_job \
    "Sleep Reminder" \
    "0 23 * * *" \
    "health" \
    "检查用户当前状态。如果用户仍在工作或活动，发送提醒：'夜深了，该准备休息了，保证充足睡眠很重要！'"

echo ""

# ==========================================
# Daily Summary
# ==========================================
echo "--- Daily Summary ---"

# Daily habit summary (9:00 PM)
add_cron_job \
    "Daily Habit Summary" \
    "0 21 * * *" \
    "master-habit" \
    "生成今天的习惯总结报告。汇总所有子 agent 的记录，分析用户今天的习惯完成情况，并更新 MEMORY.md。"

echo ""

# ==========================================
# Weekly Tasks
# ==========================================
echo "--- Weekly Tasks ---"

# Weekly habit analysis (Sunday 8:00 PM)
add_cron_job \
    "Weekly Habit Analysis" \
    "0 20 * * 0" \
    "master-habit" \
    "生成本周的习惯分析报告。分析用户本周的习惯模式，识别改进点，更新用户画像，并提供下周的建议。"

echo ""
echo "=========================================="
echo "Cron job setup complete!"
echo "=========================================="
echo ""
echo "Configured jobs:"
openclaw cron list 2>/dev/null || echo "Run 'openclaw cron list' to see jobs"
echo ""
echo "To modify timezone, set TIMEZONE environment variable:"
echo "  TIMEZONE=America/New_York ./setup-cron.sh"
echo ""
echo "To manually run a job:"
echo "  openclaw cron run <job-id> --force"
