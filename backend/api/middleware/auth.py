from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
import os

class SecretHeaderMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Exclude paths that do not require authentication
        if request.url.path in ["/api/health", "/docs", "/openapi.json"] or request.url.path.startswith("/ws/"):
            return await call_next(request)
        
        # Check secret
        secret = os.getenv("FOCUS_GUARDIAN_SECRET", "fg-dev-secret-2024")
        if request.headers.get("X-Focus-Guardian-Secret") != secret:
            # Fallback to allow dev mode options request easily depending on CORS setup, 
            # but usually let it fail here if it's missing the header.
            if request.method != "OPTIONS":
                return JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={"detail": "Unauthorized: Invalid or missing X-Focus-Guardian-Secret header"}
                )
        
        response = await call_next(request)
        return response
