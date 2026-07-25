# Focus Guardian — API Documentation

Base URL: `http://127.0.0.1:8000`

All endpoints (except `/api/health`) require the header:
```
X-Focus-Guardian-Secret: <shared_secret>
```

---

## Health

### `GET /api/health`
No auth required. Used by Electron to gate window creation.

**Response 200:**
```json
{ "status": "ok", "db": "connected" }
```

---

## Sessions

### `GET /api/sessions`
List all focus sessions, newest first.

**Response 200:**
```json
[
  {
    "id": 1,
    "start_time": "2024-01-15T09:00:00",
    "end_time": "2024-01-15T09:52:00",
    "task_name": "Build React dashboard",
    "productivity_score": 82,
    "distraction_count": 3,
    "idle_seconds": 120,
    "notes": null,
    "is_active": false
  }
]
```

### `POST /api/sessions/start`
Start a new focus session.

**Body:**
```json
{ "task_name": "Study algorithms" }
```

**Response 201:** Session object with `is_active: true`.

### `POST /api/sessions/{id}/end`
End an active session. Computes final productivity_score.

**Response 200:** Updated session object.

### `GET /api/sessions/{id}`
Get a single session.

### `DELETE /api/sessions/{id}`
Delete a session.

---

## Analytics

### `GET /api/analytics/daily?date=YYYY-MM-DD`
Daily stats for a specific date (defaults to today).

**Response 200:**
```json
{
  "date": "2024-01-15",
  "focus_minutes": 180,
  "distraction_minutes": 42,
  "neutral_minutes": 30,
  "productivity_score": 78,
  "session_count": 3,
  "top_apps": [
    { "app_name": "VS Code", "minutes": 95, "classification": "PRODUCTIVE" },
    { "app_name": "YouTube", "minutes": 28, "classification": "DISTRACTION" }
  ]
}
```

### `GET /api/analytics/weekly`
Last 7 days of daily stats.

**Response 200:** Array of DailyStats objects.

### `GET /api/analytics/heatmap`
Hour × weekday productivity heatmap.

**Response 200:**
```json
[
  { "hour": 9, "day": 1, "value": 85.5 },
  { "hour": 14, "day": 3, "value": 40.0 }
]
```

### `GET /api/analytics/top-apps`
Top 10 apps by total time.

---

## Goals

### `GET /api/goals`
List all goals.

### `POST /api/goals`
Create a new goal.

**Body:**
```json
{
  "title": "Learn Python daily",
  "type": "study",
  "target_hours": 2.0,
  "deadline": "2024-02-01"
}
```

### `PUT /api/goals/{id}`
Update a goal.

### `DELETE /api/goals/{id}`
Delete a goal.

### `PATCH /api/goals/{id}/complete`
Mark a goal as completed.

---

## Insights

### `GET /api/insights?date=YYYY-MM-DD`
Generate AI-powered insights for a specific date.

**Response 200:**
```json
{
  "date": "2024-01-15",
  "insights": [
    "You focus best between 9 AM and 11 AM.",
    "Most distractions happen after 37 minutes of focused work.",
    "Your biggest distraction today was YouTube (42 min).",
    "Average uninterrupted focus block: 28 minutes."
  ],
  "source": "gemini"
}
```
`source` is `"gemini"` or `"rule_fallback"`.

---

## Settings

### `GET /api/settings`
Get user settings.

**Response 200:**
```json
{
  "id": 1,
  "warning_threshold_minutes": 5,
  "focus_duration_minutes": 25,
  "break_duration_minutes": 5,
  "idle_threshold_seconds": 90,
  "dark_mode": true,
  "notifications_enabled": true,
  "allowed_apps": [],
  "blocked_websites": ["instagram.com", "facebook.com"],
  "gemini_api_key": null
}
```

### `PUT /api/settings`
Update settings (partial update supported).

---

## Interventions

### `POST /api/interventions`
Log a distraction intervention response.

**Body:**
```json
{
  "session_id": 5,
  "action": "return_to_work",
  "app_name": "Instagram"
}
```

`action` values: `"return_to_work"`, `"snooze"`, `"ignore"`

---

## WebSocket

### `WS /ws/monitor`
Real-time activity stream. Connect and receive events:

**Event: `activity_update`**
```json
{
  "type": "activity_update",
  "timestamp": "2024-01-15T10:23:45",
  "data": {
    "app_name": "VS Code",
    "window_title": "App.tsx — focus-guardian",
    "classification": "PRODUCTIVE",
    "confidence": 0.94,
    "productivity_score": 85,
    "source": "gemini"
  }
}
```

**Event: `distraction_alert`**
```json
{
  "type": "distraction_alert",
  "timestamp": "2024-01-15T10:35:00",
  "data": {
    "app_name": "YouTube",
    "window_title": "YouTube - Home",
    "minutes_on_distraction": 5,
    "threshold_minutes": 5
  }
}
```

**Event: `coach_message`**
```json
{
  "type": "coach_message",
  "timestamp": "2024-01-15T10:40:00",
  "data": "You've switched apps 8 times in 10 minutes. Try staying in one app for at least 15 minutes."
}
```

**Send from client:**
```json
{ "type": "start_session", "data": { "task_name": "Study" } }
{ "type": "end_session", "data": {} }
{ "type": "intervention_response", "data": { "action": "return_to_work" } }
```
