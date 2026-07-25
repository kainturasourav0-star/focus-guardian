from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from datetime import datetime, timezone
from backend.models.database import Base

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("focus_sessions.id"), nullable=True, index=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    app_name = Column(String, nullable=False, index=True)
    window_title = Column(String, nullable=False)
    classification = Column(String, nullable=False) # PRODUCTIVE, DISTRACTION, NEUTRAL
    confidence = Column(Float, nullable=False)
    source = Column(String, nullable=False) # gemini, rule_fallback
    duration_seconds = Column(Integer, default=0, nullable=False)
    category = Column(String, nullable=True)
