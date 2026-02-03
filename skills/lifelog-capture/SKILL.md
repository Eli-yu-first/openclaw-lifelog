# LifeLog Capture Skill

This skill enables automatic behavior capture and analysis using the device camera.

## Overview

The LifeLog Capture skill integrates with OpenClaw's Camera Capture feature to periodically record video clips and send them to the HAR (Human Activity Recognition) service for analysis.

## Triggers

- `capture` - Start a capture session
- `record` - Record current activity
- `watch` - Enable continuous monitoring

## Usage

### Manual Capture

```
capture my current activity
```

### Continuous Monitoring

```
watch me for the next hour
```

### Stop Monitoring

```
stop watching
```

## Configuration

Edit `~/.openclaw/skills/lifelog-capture/config.json`:

```json
{
  "captureInterval": 300,
  "clipDuration": 10,
  "analysisEndpoint": "http://localhost:5000/analyze",
  "saveRawVideo": false
}
```

## How It Works

1. **Capture**: Uses `camera.clip` to record a short video
2. **Encode**: Converts video to base64
3. **Analyze**: Sends to HAR service for activity recognition
4. **Route**: Dispatches results to appropriate habit agent
5. **Store**: Saves structured data to memory

## Requirements

- OpenClaw with Camera Capture enabled
- HAR service running (Docker)
- macOS/iOS/Android device with camera

## Privacy

- All processing is done locally
- Videos are deleted after analysis
- Only structured behavior data is stored
