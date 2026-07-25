from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timezone

from backend.api.deps import get_database
from backend.models.session import FocusSession
from backend.schemas.session import FocusSessionResponse, FocusSessionCreate, SessionStartRequest
from backend.services.monitor import monitor_service
from backend.services.analytics import AnalyticsEngine

router = APIRouter()

@router.get('/api/sessions', response_model=List[FocusSessionResponse])
def list_sessions(skip: int = 0, limit: int = 100, db: Session = Depends(get_database)):
    return db.query(FocusSession).order_by(FocusSession.start_time.desc()).offset(skip).limit(limit).all()

@router.post('/api/sessions/start', response_model=FocusSessionResponse)
def start_session(req: SessionStartRequest, db: Session = Depends(get_database)):
    # Close any active sessions first
    active = db.query(FocusSession).filter(FocusSession.is_active == True).all()
    for s in active:
        s.is_active = False
        s.end_time = datetime.now(timezone.utc)
    
    new_session = FocusSession(
        task_name=req.task_name or "Deep Work Session",
        is_active=True
    )
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    
    monitor_service.set_active_session(new_session.id)
    return new_session

@router.post('/api/sessions/{session_id}/end', response_model=FocusSessionResponse)
def end_session(session_id: int, db: Session = Depends(get_database)):
    session = db.query(FocusSession).filter(FocusSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    if session.is_active:
        session.is_active = False
        session.end_time = datetime.now(timezone.utc)
        session.productivity_score = AnalyticsEngine.compute_productivity_score(session_id, db)
        db.commit()
        db.refresh(session)
        
    if monitor_service._active_session_id == session_id:
        monitor_service.set_active_session(None)
        
    return session

@router.get('/api/sessions/{session_id}', response_model=FocusSessionResponse)
def get_session(session_id: int, db: Session = Depends(get_database)):
    session = db.query(FocusSession).filter(FocusSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@router.delete('/api/sessions/{session_id}')
def delete_session(session_id: int, db: Session = Depends(get_database)):
    session = db.query(FocusSession).filter(FocusSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if monitor_service._active_session_id == session_id:
        monitor_service.set_active_session(None)
        
    db.delete(session)
    db.commit()
    return {"status": "deleted"}
