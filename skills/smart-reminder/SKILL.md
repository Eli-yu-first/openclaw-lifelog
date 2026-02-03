# Smart Reminder Skill

This skill provides intelligent, context-aware reminders based on user habits and patterns.

## Overview

The Smart Reminder skill uses habit data and pattern analysis to send proactive reminders when users deviate from their normal routines or are about to forget important tasks.

## Triggers

- `remind` - Set a reminder
- `alert` - Configure alerts
- `notify` - Send notification

## Usage

### Set Reminder

```
Remind me to brush my teeth every morning at 8am
```

### Check Reminders

```
What reminders do I have today?
```

### Disable Reminder

```
Stop reminding me about drinking water
```

## Smart Reminder Types

### 1. Habit-Based Reminders

Automatically triggered when user misses expected habits:

- **Toothbrush Reminder**: If no brushing detected by 9am
- **Hydration Reminder**: If no drinking detected for 2 hours
- **Movement Reminder**: If sitting detected for 2+ hours

### 2. Departure Reminders

Triggered when leaving home is detected:

- Check for keys, phone, wallet
- Weather-based umbrella reminder
- Work badge on weekdays

### 3. Scheduled Reminders

User-configured time-based reminders:

- Daily routines
- Weekly tasks
- Custom schedules

## Configuration

Edit `~/.openclaw/skills/smart-reminder/config.json`:

```json
{
  "channels": ["whatsapp", "telegram"],
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "07:00"
  },
  "urgencyLevels": {
    "low": { "repeat": false },
    "medium": { "repeat": true, "interval": 30 },
    "high": { "repeat": true, "interval": 10 }
  }
}
```

## Reminder Rules

### Default Rules

| Trigger | Condition | Message |
|---------|-----------|---------|
| Morning Brush | No brush by 9:00 | "Good morning! Don't forget to brush your teeth." |
| Evening Brush | No brush by 22:30 | "Time to brush before bed!" |
| Hydration | No drink for 2h | "Stay hydrated! Time for some water." |
| Movement | Sitting for 2h | "Time to stretch and move around!" |
| Departure | Leaving detected | "Don't forget: keys, phone, wallet!" |

### Custom Rules

Add custom rules in `rules.json`:

```json
{
  "rules": [
    {
      "name": "Medication Reminder",
      "trigger": "cron",
      "cron": "0 9,21 * * *",
      "message": "Time to take your medication!",
      "urgency": "high"
    }
  ]
}
```

## Integration

### With Cron Jobs

```bash
openclaw cron add \
  --name "Smart Reminder Check" \
  --cron "*/30 * * * *" \
  --agentId master-habit \
  --message "Run smart reminder checks"
```

### With Webhooks

Configure webhook to receive external triggers:

```json
{
  "url": "/api/webhook/reminder",
  "events": ["reminder.trigger", "reminder.snooze"]
}
```
