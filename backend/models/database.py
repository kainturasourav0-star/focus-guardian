from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./focus_guardian.db")

# For SQLite, we need connect_args to allow multiple threads to use the connection
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """FastAPI dependency for yielding database sessions."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Create all tables on startup."""
    from backend.models.session import FocusSession
    from backend.models.activity import ActivityLog
    from backend.models.goal import Goal
    from backend.models.settings import UserSettings
    from backend.models.intervention import InterventionLog
    Base.metadata.create_all(bind=engine)
