from sqlalchemy import Column, Integer, Boolean, String
from backend.models.database import Base

class UserSettings(Base):
    __tablename__ = "user_settings"

    id = Column(Integer, primary_key=True, index=True) # Always 1 for singleton
    warning_threshold_minutes = Column(Integer, default=5, nullable=False)
    focus_duration_minutes = Column(Integer, default=25, nullable=False)
    break_duration_minutes = Column(Integer, default=5, nullable=False)
    idle_threshold_seconds = Column(Integer, default=90, nullable=False)
    dark_mode = Column(Boolean, default=True, nullable=False)
    notifications_enabled = Column(Boolean, default=True, nullable=False)
    allowed_apps = Column(String, default="[]", nullable=False) # JSON string
    blocked_websites = Column(String, default='["instagram.com","facebook.com","netflix.com","tiktok.com"]', nullable=False) # JSON string
    gemini_api_key = Column(String, default="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", nullable=True)
    ai_coach_tone = Column(String, default="motivational", nullable=False)
