from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime, date

class GoalBase(BaseModel):
    title: str
    type: str # study, coding, reading, focus_hours, weekly_target
    target_hours: float
    deadline: Optional[date] = None

class GoalCreate(GoalBase):
    pass

class GoalUpdate(BaseModel):
    title: Optional[str] = None
    type: Optional[str] = None
    target_hours: Optional[float] = None
    current_hours: Optional[float] = None
    deadline: Optional[date] = None
    completed: Optional[bool] = None

class GoalResponse(GoalBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    current_hours: float
    completed: bool
    created_at: datetime
