from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class BrowserTabData(BaseModel):
    title: str
    url: str
    browser: str

@router.post("/api/browser-tab")
async def report_browser_tab(data: BrowserTabData):
    """
    Endpoint for browser extensions to push the active tab information.
    The monitor service can use this to enrich window tracking data.
    """
    # For now, echo the data. Later this hooks into MonitorService state.
    return {"status": "ok", "data": data.model_dump()}
