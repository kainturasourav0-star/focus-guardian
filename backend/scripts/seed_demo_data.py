from backend.models.database import SessionLocal, Base, engine
from backend.models.session import FocusSession
from backend.models.activity import ActivityLog
from backend.models.goal import Goal
from backend.models.settings import UserSettings
from datetime import datetime, timedelta, timezone
import random

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    if db.query(FocusSession).first() is not None:
        print("DB already has data. Skipping seed.")
        db.close()
        return

    # Add Settings
    db.add(UserSettings(id=1, warning_threshold_minutes=5))

    # Add Goals
    db.add_all([
        Goal(title="Study Python", type="study", target_hours=10, current_hours=4),
        Goal(title="Daily 4h focus", type="focus_hours", target_hours=4, current_hours=2),
        Goal(title="Read 1h", type="reading", target_hours=1, current_hours=0.5)
    ])
    
    # Add Sessions & Activities for past 5 days
    now = datetime.now(timezone.utc)
    apps = [
        ("vscode", "Code - main.py", "PRODUCTIVE"),
        ("youtube", "Python Tutorial - YouTube", "PRODUCTIVE"),
        ("twitter", "Home / Twitter", "DISTRACTION"),
        ("netflix", "Netflix - Movie", "DISTRACTION"),
        ("notion", "Project Notes - Notion", "PRODUCTIVE")
    ]
    
    for i in range(5, -1, -1):
        target_date = now - timedelta(days=i)
        
        for _ in range(random.randint(3, 5)):
            start = target_date.replace(hour=random.randint(8, 20), minute=0, second=0)
            end = start + timedelta(minutes=random.randint(25, 90))
            
            session = FocusSession(
                start_time=start,
                end_time=end,
                task_name=f"Demo Task {i}",
                productivity_score=random.randint(60, 100),
                is_active=False,
                notes="[DEMO_DATA]"
            )
            db.add(session)
            db.commit()
            db.refresh(session)
            
            # Activities
            current_time = start
            while current_time < end:
                app = random.choice(apps)
                dur = random.randint(30, 300)
                log = ActivityLog(
                    session_id=session.id,
                    timestamp=current_time,
                    app_name=app[0],
                    window_title=app[1],
                    classification=app[2],
                    confidence=0.9,
                    source="rule_fallback",
                    duration_seconds=dur
                )
                db.add(log)
                current_time += timedelta(seconds=dur)
                
    db.commit()
    db.close()
    print("Seed complete.")

if __name__ == "__main__":
    seed()
