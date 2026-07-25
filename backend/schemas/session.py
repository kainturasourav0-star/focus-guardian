from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class FocusSessionBase(BaseModel):
    task_name: str

class SessionStartRequest(BaseModel):
    task_name: Optional[str] = "Deep Work Session"

class FocusSessionCreate(FocusSessionBase):
    pass

class FocusSessionUpdate(BaseModel):
    task_name: Optional[str] = None
    productivity_score: Optional[int] = None
    distraction_count: Optional[int] = None
    idle_seconds: Optional[int] = None
    notes: Optional[str] = None
    is_active: Optional[bool] = None

class FocusSessionResponse(FocusSessionBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    start_time: datetime
    end_time: Optional[datetime]
    productivity_score: int
    distraction_count: int
    idle_seconds: int
    notes: Optional[str]
    is_active: bool
