from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import asyncio

from backend.models.database import init_db, get_db, SessionLocal
from backend.api.middleware.auth import SecretHeaderMiddleware
from backend.services.monitor import monitor_service
from backend.scripts.seed_demo_data import seed
from backend.scripts.cleanup_orphaned_sessions import run_cleanup

# Routers
from backend.api.routes.health import router as health_router
from backend.api.routes.sessions import router as sessions_router
from backend.api.routes.analytics import router as analytics_router
from backend.api.routes.goals import router as goals_router
from backend.api.routes.settings import router as settings_router
from backend.api.routes.insights import router as insights_router
from backend.api.routes.websocket import router as websocket_router
from backend.adapters.browser_extension import router as browser_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_db()
    run_cleanup()
    seed()
    
    # Start monitor task
    def db_factory():
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()
            
    task = asyncio.create_task(monitor_service.start(db_factory))
    
    yield
    
    # Shutdown
    monitor_service.stop()
    task.cancel()

app = FastAPI(title="Focus Guardian API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "app://"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(SecretHeaderMiddleware)

# Include routers
app.include_router(health_router)
app.include_router(sessions_router)
app.include_router(analytics_router)
app.include_router(goals_router)
app.include_router(settings_router)
app.include_router(insights_router)
app.include_router(websocket_router)
app.include_router(browser_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
