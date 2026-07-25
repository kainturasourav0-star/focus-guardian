from backend.models.database import get_db
from sqlalchemy.orm import Session
from fastapi import Depends

def get_database(db: Session = Depends(get_db)) -> Session:
    return db
