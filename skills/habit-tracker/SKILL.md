# Habit Tracker Skill

This skill provides comprehensive habit tracking and analysis capabilities.

## Overview

The Habit Tracker skill manages the multi-agent system for recording, analyzing, and reporting on user habits across different life domains.

## Triggers

- `habit` - Query or record a habit
- `routine` - Check routine status
- `track` - Start tracking a new habit

## Usage

### Query Habits

```
What are my brushing habits this week?
```

### Record Manual Entry

```
I just finished brushing my teeth
```

### View Statistics

```
Show my habit statistics for today
```

### Add New Habit

```
Track my meditation habit
```

## Habit Categories

| Category | Agent | Tracked Items |
|----------|-------|---------------|
| Dental | dental-hygiene | Brushing, flossing, mouthwash |
| Morning | morning-routine | Wake time, shower, breakfast |
| Work | work-life | Work hours, breaks, hydration |
| Departure | departure | Leave time, items carried |
| Health | health | Exercise, sleep, meals |

## Configuration

Edit `~/.openclaw/skills/habit-tracker/config.json`:

```json
{
  "categories": ["dental", "morning", "work", "departure", "health"],
  "reminderEnabled": true,
  "weeklyReportDay": "sunday",
  "timezone": "Asia/Shanghai"
}
```

## Memory Structure

Habits are stored in each agent's workspace:

```
~/.openclaw/workspace-{agent}/
├── MEMORY.md           # Habit patterns summary
└── memory/
    └── YYYY-MM-DD.md   # Daily records
```

## API

### Record Habit

```javascript
habit_record({
  category: "dental",
  activity: "brushing_teeth",
  timestamp: "2026-02-03T08:15:30Z",
  duration: 120
});
```

### Query Habits

```javascript
habit_query({
  category: "dental",
  startDate: "2026-02-01",
  endDate: "2026-02-03"
});
```
