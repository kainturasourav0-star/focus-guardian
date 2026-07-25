import asyncio
from datetime import datetime, timezone
import sys
from fastapi import WebSocket

from backend.adapters.windows_adapter import WindowsAdapter
from backend.adapters.macos_adapter import MacOSAdapter
from backend.services.classifier_cache import classifier_cache
from backend.services.ai_classifier import classify_async
from backend.services.idle import idle_detector
from backend.models.settings import UserSettings
from backend.models.activity import ActivityLog
from backend.services.analytics import AnalyticsEngine

class MonitorService:
    def __init__(self):
        self._running = False
        self._last_window = None
        self._last_window_time = datetime.now(timezone.utc)
        self._distraction_start = None
        self._active_session_id = None
        self._connected_clients = set()
        
        if sys.platform == 'win32':
            self.adapter = WindowsAdapter()
        else:
            self.adapter = MacOSAdapter()

    def set_active_session(self, session_id: int | None):
        self._active_session_id = session_id

    def register_client(self, ws: WebSocket):
        self._connected_clients.add(ws)
        
    def unregister_client(self, ws: WebSocket):
        self._connected_clients.discard(ws)
        
    async def _broadcast(self, event_type: str, data: dict):
        dead_clients = set()
        msg = {"type": event_type, "data": data}
        for client in self._connected_clients:
            try:
                await client.send_json(msg)
            except Exception:
                dead_clients.add(client)
        
        for client in dead_clients:
            self._connected_clients.discard(client)

    async def start(self, db_factory):
        if self._running:
            return
            
        self._running = True
        idle_detector.start()
        
        while self._running:
            try:
                await asyncio.sleep(3)
                
                db = next(db_factory())
                try:
                    await self._tick(db)
                finally:
                    db.close()
            except Exception as e:
                print(f"Monitor tick error: {e}")

    async def _tick(self, db):
        settings = db.query(UserSettings).first()
        if not settings:
            return
            
        if idle_detector.is_idle(settings.idle_threshold_seconds):
            await self._broadcast("idle_status", {"is_idle": True})
            return
            
        await self._broadcast("idle_status", {"is_idle": False})
        
        window = self.adapter.get_active_window()
        if not window:
            return
            
        await self._process_window(window, db, settings)

    async def _process_window(self, window, db, settings):
        now = datetime.now(timezone.utc)
        duration = int((now - self._last_window_time).total_seconds())
        self._last_window_time = now
        self._last_window = window
        
        # Check cache
        classification = classifier_cache.get_cached(window.app_name, window.window_title)
        if not classification:
            classification = await classify_async(window.app_name, window.window_title, settings.gemini_api_key)
            classifier_cache.set_cached(window.app_name, window.window_title, classification)
            
        # Log to DB
        log_entry = ActivityLog(
            session_id=self._active_session_id,
            timestamp=now,
            app_name=window.app_name,
            window_title=window.window_title,
            classification=classification['classification'],
            confidence=classification['confidence'],
            source=classification['source'],
            duration_seconds=max(3, duration),
            category=classification.get('category')
        )
        db.add(log_entry)
        db.commit()
        
        # Broadcast current activity
        await self._broadcast("current_activity", {
            "app_name": window.app_name,
            "window_title": window.window_title,
            "classification": classification['classification']
        })
        
        # Distraction threshold logic
        if classification['classification'] == 'DISTRACTION':
            if not self._distraction_start:
                self._distraction_start = now
            else:
                distraction_mins = (now - self._distraction_start).total_seconds() / 60.0
                if distraction_mins >= settings.warning_threshold_minutes:
                    await self._broadcast("distraction_alert", {
                        "minutes": round(distraction_mins, 1),
                        "app": window.app_name
                    })
        else:
            self._distraction_start = None

    def stop(self):
        self._running = False
        idle_detector.stop()

monitor_service = MonitorService()
