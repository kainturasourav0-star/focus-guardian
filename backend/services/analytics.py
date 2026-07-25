from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, date, timedelta
from backend.models.activity import ActivityLog
from backend.models.session import FocusSession

class AnalyticsEngine:
    @staticmethod
    def compute_productivity_score(session_id: int, db: Session) -> int:
        logs = db.query(ActivityLog).filter(ActivityLog.session_id == session_id).all()
        if not logs:
            return 0
            
        productive_time = sum(log.duration_seconds for log in logs if log.classification == 'PRODUCTIVE')
        distraction_time = sum(log.duration_seconds for log in logs if log.classification == 'DISTRACTION')
        
        total_relevant = productive_time + distraction_time
        if total_relevant == 0:
            return 0
            
        return int((productive_time / total_relevant) * 100)

    @staticmethod
    def get_daily_stats(target_date: date, db: Session) -> dict:
        start_dt = datetime.combine(target_date, datetime.min.time())
        end_dt = datetime.combine(target_date, datetime.max.time())
        
        logs = db.query(ActivityLog).filter(
            ActivityLog.timestamp >= start_dt,
            ActivityLog.timestamp <= end_dt
        ).all()
        
        focus_seconds = sum(log.duration_seconds for log in logs if log.classification == 'PRODUCTIVE')
        distraction_seconds = sum(log.duration_seconds for log in logs if log.classification == 'DISTRACTION')
        neutral_seconds = sum(log.duration_seconds for log in logs if log.classification == 'NEUTRAL')
        
        sessions = db.query(FocusSession).filter(
            func.date(FocusSession.start_time) == target_date
        ).count()
        
        total_relevant = focus_seconds + distraction_seconds
        score = int((focus_seconds / total_relevant) * 100) if total_relevant > 0 else 0
        
        return {
            "date": target_date,
            "focus_minutes": focus_seconds // 60,
            "distraction_minutes": distraction_seconds // 60,
            "neutral_minutes": neutral_seconds // 60,
            "productivity_score": score,
            "session_count": sessions,
            "top_apps": AnalyticsEngine.get_top_apps(db, limit=5, target_date=target_date)
        }

    @staticmethod
    def get_weekly_stats(db: Session) -> list[dict]:
        today = date.today()
        stats = []
        for i in range(6, -1, -1):
            target = today - timedelta(days=i)
            stats.append(AnalyticsEngine.get_daily_stats(target, db))
        return stats

    @staticmethod
    def get_heatmap_data(db: Session) -> list[dict]:
        # Get logs from last 30 days
        thirty_days_ago = datetime.now(timezone.utc) - timedelta(days=30)
        logs = db.query(ActivityLog).filter(
            ActivityLog.timestamp >= thirty_days_ago,
            ActivityLog.classification == 'PRODUCTIVE'
        ).all()
        
        # Initialize grid (0 = Mon, ..., 6 = Sun)
        grid = {d: {h: 0.0 for h in range(24)} for d in range(7)}
        
        for log in logs:
            dt = log.timestamp
            # Ensure it is timezone-aware if comparing or processing
            day = dt.weekday() # 0-6 (Mon-Sun)
            hour = dt.hour
            grid[day][hour] += log.duration_seconds
            
        data = []
        for day in range(7):
            for hour in range(24):
                # Convert duration_seconds to minutes
                val = round(grid[day][hour] / 60.0, 1)
                data.append({"hour": hour, "day": day, "value": val})
        return data

    @staticmethod
    def get_top_apps(db: Session, limit: int = 5, target_date: date = None) -> list[dict]:
        query = db.query(
            ActivityLog.app_name,
            ActivityLog.classification,
            func.sum(ActivityLog.duration_seconds).label('total_seconds')
        )
        if target_date:
            start_dt = datetime.combine(target_date, datetime.min.time())
            end_dt = datetime.combine(target_date, datetime.max.time())
            query = query.filter(ActivityLog.timestamp >= start_dt, ActivityLog.timestamp <= end_dt)
            
        query = query.group_by(ActivityLog.app_name, ActivityLog.classification)\
                     .order_by(func.sum(ActivityLog.duration_seconds).desc())\
                     .limit(limit)
                     
        results = []
        for row in query.all():
            results.append({
                "app_name": row.app_name,
                "minutes": row.total_seconds // 60,
                "classification": row.classification
            })
        return results
