from backend.models.database import SessionLocal
from backend.models.session import FocusSession
from datetime import datetime, timezone, timedelta

def run_cleanup():
    db = SessionLocal()
    try:
        now = datetime.now(timezone.utc)
        cutoff = now - timedelta(hours=8)
        
        orphans = db.query(FocusSession).filter(
            FocusSession.is_active == True,
            FocusSession.start_time < cutoff
        ).all()
        
        for session in orphans:
            session.is_active = False
            session.end_time = session.start_time + timedelta(hours=8)
            session.notes = (session.notes or "") + "[AUTO_CLOSED: crash recovery]"
            
        if orphans:
            db.commit()
            print(f"Cleaned up {len(orphans)} orphaned sessions.")
            
    finally:
        db.close()

if __name__ == "__main__":
    run_cleanup()
