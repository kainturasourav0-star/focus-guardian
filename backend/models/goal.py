from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Date
from datetime import datetime, timezone
from backend.models.database import Base

class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    type = Column(String, nullable=False) # study, coding, reading, focus_hours, weekly_target
    target_hours = Column(Float, nullable=False)
    current_hours = Column(Float, default=0.0, nullable=False)
    deadline = Column(Date, nullable=True)
    completed = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
