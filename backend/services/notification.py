from sqlalchemy.orm import Session
from datetime import datetime, timezone
from backend.models.session import FocusSession
from backend.models.intervention import InterventionLog

def log_intervention(session_id: int, action: str, app_name: str, db: Session):
    if not session_id:
        return
        
    session = db.query(FocusSession).filter(FocusSession.id == session_id).first()
    if session:
        # 1. Save structured log
        log_entry = InterventionLog(
            session_id=session_id,
            timestamp=datetime.now(timezone.utc),
            app_name=app_name,
            action_taken=action
        )
        db.add(log_entry)
        
        # 2. Increment session distraction count
        session.distraction_count = (session.distraction_count or 0) + 1
        
        # 3. Append to textual notes
        timestamp = datetime.now(timezone.utc).isoformat()
        note_entry = f"[{timestamp}] Intervention action '{action}' on app '{app_name}'\n"
        session.notes = (session.notes or "") + note_entry
        db.commit()
