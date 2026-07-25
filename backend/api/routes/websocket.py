from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from backend.services.monitor import monitor_service
from backend.services.notification import log_intervention
from backend.models.database import SessionLocal

router = APIRouter()

@router.websocket("/ws/monitor")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    monitor_service.register_client(websocket)
    
    try:
        while True:
            data = await websocket.receive_json()
            # Handle incoming messages from client (e.g. intervention response)
            msg_type = data.get("type")
            payload = data.get("data", {})
            
            if msg_type == "intervention_response":
                action = payload.get("action")
                app = payload.get("app")
                db = SessionLocal()
                try:
                    log_intervention(monitor_service._active_session_id, action, app, db)
                finally:
                    db.close()
            elif msg_type == "start_session":
                # Fallback, preferable to use REST endpoint
                pass
            elif msg_type == "end_session":
                pass
                
    except WebSocketDisconnect:
        monitor_service.unregister_client(websocket)
    except Exception as e:
        print(f"WS error: {e}")
        monitor_service.unregister_client(websocket)
