from fastapi.testclient import TestClient
from backend.main import app
from backend.models.database import SessionLocal, init_db
from backend.models.settings import UserSettings
import pytest

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_db():
    init_db()
    # Ensure UserSettings table has row id=1
    db = SessionLocal()
    settings = db.query(UserSettings).filter(UserSettings.id == 1).first()
    if not settings:
        db.add(UserSettings(id=1, warning_threshold_minutes=5))
        db.commit()
    db.close()

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_get_settings():
    response = client.get("/api/settings", headers={"X-Focus-Guardian-Secret": "fg-dev-secret-2024"})
    assert response.status_code == 200
    data = response.json()
    assert "warning_threshold_minutes" in data
    assert "allowed_apps" in data
    assert "blocked_websites" in data

def test_update_settings():
    headers = {"X-Focus-Guardian-Secret": "fg-dev-secret-2024"}
    update_data = {
        "warning_threshold_minutes": 10,
        "focus_duration_minutes": 30,
        "allowed_apps": ["VS Code", "Terminal"],
        "blocked_websites": ["facebook.com", "instagram.com"]
    }
    response = client.put("/api/settings", json=update_data, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["warning_threshold_minutes"] == 10
    assert data["focus_duration_minutes"] == 30
    assert "VS Code" in data["allowed_apps"]
    assert "facebook.com" in data["blocked_websites"]

def test_focus_session_lifecycle():
    headers = {"X-Focus-Guardian-Secret": "fg-dev-secret-2024"}
    
    # 1. Start session
    start_response = client.post("/api/sessions/start", json={"task_name": "Test Integration Session"}, headers=headers)
    assert start_response.status_code == 200
    session_data = start_response.json()
    assert session_data["task_name"] == "Test Integration Session"
    assert session_data["is_active"] is True
    session_id = session_data["id"]

    # 2. Get active session
    get_response = client.get(f"/api/sessions/{session_id}", headers=headers)
    assert get_response.status_code == 200
    assert get_response.json()["id"] == session_id

    # 3. End session
    end_response = client.post(f"/api/sessions/{session_id}/end", headers=headers)
    assert end_response.status_code == 200
    end_data = end_response.json()
    assert end_data["is_active"] is False

    # 4. Clean up
    delete_response = client.delete(f"/api/sessions/{session_id}", headers=headers)
    assert delete_response.status_code == 200
    assert delete_response.json() == {"status": "deleted"}
