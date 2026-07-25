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
from backend.services.ai_coach import get_coaching_message_async

class MonitorService:
    def __init__(self):
        self._running = False
        self._last_window = None
        self._last_window_time = datetime.now(timezone.utc)
        self._distraction_start = None
        self._active_session_id = None
        self._connected_clients = set()
        self._last_coach_time = datetime.now(timezone.utc)
        self._app_switch_count = 0
        
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
        
        # Count app switches
        if self._last_window and self._last_window.app_name != window.app_name:
            self._app_switch_count += 1
            
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
        
        # Compute productivity score dynamically
        score = 0
        if self._active_session_id:
            score = AnalyticsEngine.compute_productivity_score(self._active_session_id, db)
        else:
            today_stats = AnalyticsEngine.get_daily_stats(now.date(), db)
            score = today_stats.get("productivity_score", 0)

        # Broadcast current activity (using activity_update to match frontend expectations)
        await self._broadcast("activity_update", {
            "app_name": window.app_name,
            "window_title": window.window_title,
            "classification": classification['classification'],
            "confidence": classification.get('confidence', 1.0),
            "productivity_score": score,
            "source": classification.get('source', 'rule_fallback')
        })
        
        # Distraction threshold logic
        if classification['classification'] == 'DISTRACTION':
            if not self._distraction_start:
                self._distraction_start = now
            else:
                distraction_mins = (now - self._distraction_start).total_seconds() / 60.0
                if distraction_mins >= settings.warning_threshold_minutes:
                    await self._broadcast("distraction_alert", {
                        "app_name": window.app_name,
                        "window_title": window.window_title,
                        "minutes_on_distraction": round(distraction_mins, 1),
                        "threshold_minutes": settings.warning_threshold_minutes
                    })
        else:
            self._distraction_start = None

        # Periodically trigger AI Coach message (after 6 switches or 120s of active session)
        if self._active_session_id:
            time_since_coach = (now - self._last_coach_time).total_seconds()
            if self._app_switch_count >= 6 or time_since_coach >= 120:
                self._app_switch_count = 0
                self._last_coach_time = now
                
                # Retrieve last 10 activities for context
                recent_logs = db.query(ActivityLog).filter(
                    ActivityLog.session_id == self._active_session_id
                ).order_by(ActivityLog.timestamp.desc()).limit(10).all()
                
                recent_activities = [
                    {"app_name": log.app_name, "classification": log.classification}
                    for log in recent_logs
                ]
                
                msg = await get_coaching_message_async(recent_activities, settings.gemini_api_key)
                await self._broadcast("coach_message", msg)

    def stop(self):
        self._running = False
        idle_detector.stop()

monitor_service = MonitorService()
