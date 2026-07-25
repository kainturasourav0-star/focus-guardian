from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date
from typing import List

from backend.api.deps import get_database
from backend.services.analytics import AnalyticsEngine
from backend.schemas.analytics import DailyStats, WeeklyStats, HeatmapData, AppUsage

router = APIRouter()

@router.get('/api/analytics/daily', response_model=DailyStats)
def get_daily(date: date = None, db: Session = Depends(get_database)):
    target = date or date.today()
    return AnalyticsEngine.get_daily_stats(target, db)

@router.get('/api/analytics/weekly', response_model=List[DailyStats])
def get_weekly(db: Session = Depends(get_database)):
    return AnalyticsEngine.get_weekly_stats(db)

@router.get('/api/analytics/heatmap', response_model=List[HeatmapData])
def get_heatmap(db: Session = Depends(get_database)):
    return AnalyticsEngine.get_heatmap_data(db)

@router.get('/api/analytics/top-apps', response_model=List[AppUsage])
def get_top_apps(limit: int = 5, db: Session = Depends(get_database)):
    return AnalyticsEngine.get_top_apps(db, limit=limit)
