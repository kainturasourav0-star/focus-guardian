from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date
from typing import List

from backend.api.deps import get_database
from backend.models.settings import UserSettings
from backend.services.ai_insights import generate_insights

router = APIRouter()

@router.get('/api/insights', response_model=List[str])
def get_insights(date: date = None, db: Session = Depends(get_database)):
    target = date or date.today()
    settings = db.query(UserSettings).filter(UserSettings.id == 1).first()
    api_key = settings.gemini_api_key if settings else None
    
    return generate_insights(target, db, api_key)
