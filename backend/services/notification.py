from sqlalchemy.orm import Session
from datetime import datetime, timezone
from backend.models.session import FocusSession

def log_intervention(session_id: int, action: str, app_name: str, db: Session):
    if not session_id:
        return
        
    session = db.query(FocusSession).filter(FocusSession.id == session_id).first()
    if session:
        # Simple string append to notes
        timestamp = datetime.now(timezone.utc).isoformat()
        note_entry = f"[{timestamp}] Intervention action '{action}' on app '{app_name}'\n"
        session.notes = (session.notes or "") + note_entry
        db.commit()
