from pydantic import BaseModel
from typing import List, Optional
from datetime import date, datetime

class AppUsage(BaseModel):
    app_name: str
    minutes: int
    classification: str

class DailyStats(BaseModel):
    date: Optional[date] = None
    focus_minutes: int
    distraction_minutes: int
    neutral_minutes: int
    productivity_score: int
    session_count: int
    top_apps: List[AppUsage]

class WeeklyStats(BaseModel):
    days: List[DailyStats]

class HeatmapData(BaseModel):
    hour: int
    day: int
    value: float

class InterventionLogSchema(BaseModel):
    session_id: Optional[int]
    action: str
    timestamp: datetime
