from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime, timezone
from backend.models.database import Base

class FocusSession(Base):
    __tablename__ = "focus_sessions"

    id = Column(Integer, primary_key=True, index=True)
    start_time = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    end_time = Column(DateTime, nullable=True)
    task_name = Column(String, nullable=False)
    productivity_score = Column(Integer, default=0, nullable=False)
    distraction_count = Column(Integer, default=0, nullable=False)
    idle_seconds = Column(Integer, default=0, nullable=False)
    notes = Column(String, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
