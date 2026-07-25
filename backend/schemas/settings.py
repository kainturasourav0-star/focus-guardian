from pydantic import BaseModel, ConfigDict
from typing import List, Optional

class UserSettingsBase(BaseModel):
    warning_threshold_minutes: int = 5
    focus_duration_minutes: int = 25
    break_duration_minutes: int = 5
    idle_threshold_seconds: int = 90
    dark_mode: bool = True
    notifications_enabled: bool = True
    allowed_apps: List[str] = []
    blocked_websites: List[str] = ["instagram.com", "facebook.com", "netflix.com", "tiktok.com"]
    gemini_api_key: Optional[str] = None

class UserSettingsUpdate(BaseModel):
    warning_threshold_minutes: Optional[int] = None
    focus_duration_minutes: Optional[int] = None
    break_duration_minutes: Optional[int] = None
    idle_threshold_seconds: Optional[int] = None
    dark_mode: Optional[bool] = None
    notifications_enabled: Optional[bool] = None
    allowed_apps: Optional[List[str]] = None
    blocked_websites: Optional[List[str]] = None
    gemini_api_key: Optional[str] = None

class UserSettingsResponse(UserSettingsBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
