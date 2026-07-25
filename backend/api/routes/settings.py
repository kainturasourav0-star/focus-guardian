from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import json

from backend.api.deps import get_database
from backend.models.settings import UserSettings
from backend.schemas.settings import UserSettingsResponse, UserSettingsUpdate

router = APIRouter()

def get_or_create_settings(db: Session) -> UserSettings:
    settings = db.query(UserSettings).filter(UserSettings.id == 1).first()
    if not settings:
        settings = UserSettings(id=1)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@router.get('/api/settings', response_model=UserSettingsResponse)
def get_settings(db: Session = Depends(get_database)):
    settings = get_or_create_settings(db)
    
    # Parse JSON strings to lists
    response = UserSettingsResponse.model_validate(settings)
    response.allowed_apps = json.loads(settings.allowed_apps)
    response.blocked_websites = json.loads(settings.blocked_websites)
    return response

@router.put('/api/settings', response_model=UserSettingsResponse)
def update_settings(settings_in: UserSettingsUpdate, db: Session = Depends(get_database)):
    settings = get_or_create_settings(db)
    
    update_data = settings_in.model_dump(exclude_unset=True)
    
    if 'allowed_apps' in update_data:
        update_data['allowed_apps'] = json.dumps(update_data['allowed_apps'])
    if 'blocked_websites' in update_data:
        update_data['blocked_websites'] = json.dumps(update_data['blocked_websites'])
        
    for key, value in update_data.items():
        setattr(settings, key, value)
        
    db.commit()
    db.refresh(settings)
    
    response = UserSettingsResponse.model_validate(settings)
    response.allowed_apps = json.loads(settings.allowed_apps)
    response.blocked_websites = json.loads(settings.blocked_websites)
    return response
