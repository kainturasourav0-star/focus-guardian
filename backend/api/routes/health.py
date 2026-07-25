from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.api.deps import get_database

router = APIRouter()

@router.get('/api/health')
def health_check(db: Session = Depends(get_database)):
    try:
        from sqlalchemy import text
        db.execute(text('SELECT 1'))
        return {'status': 'ok', 'db': 'connected'}
    except Exception as e:
        return {'status': 'degraded', 'db': str(e)}
